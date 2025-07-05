
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Extract text from different file types
async function extractTextFromFile(fileContent: ArrayBuffer, fileName: string): Promise<string> {
  const extension = fileName.toLowerCase().split('.').pop();
  
  if (extension === 'txt') {
    // Simple text file
    return new TextDecoder().decode(fileContent);
  } else if (extension === 'pdf') {
    // For PDF, we'll use a simple approach - in production you'd use a proper PDF parser
    // For now, we'll assume the user provides readable text or we handle this gracefully
    const text = new TextDecoder().decode(fileContent);
    return text.replace(/[^\x20-\x7E\n\r]/g, ''); // Remove non-printable characters
  } else if (extension === 'docx') {
    // For DOCX, we'll use a simple approach - in production you'd use a proper DOCX parser
    // For now, we'll extract any readable text
    const text = new TextDecoder().decode(fileContent);
    return text.replace(/[^\x20-\x7E\n\r]/g, ''); // Remove non-printable characters
  }
  
  // Fallback - try to decode as text
  return new TextDecoder().decode(fileContent);
}

// Generate changelog using OpenAI
async function generateChangelog(rawContent: string): Promise<any> {
  const prompt = `
You are a technical writer specializing in customer-facing product communications. 
Transform the following raw release notes/documentation into a polished, customer-friendly changelog entry.

Guidelines:
- Use clear, benefit-driven language that customers can understand
- Avoid technical jargon and internal references
- Focus on how changes benefit the user
- Categorize as: "new-feature", "improvement", "fix", or "announcement"
- Create an engaging title (max 80 characters)
- Write 2-4 paragraphs of description
- Highlight the most important customer benefits

Raw content:
"""
${rawContent}
"""

Return your response as a JSON object with this exact structure:
{
  "title": "Customer-friendly title",
  "content": "<p>HTML formatted content with proper paragraphs</p>",
  "category": "new-feature|improvement|fix|announcement",
  "summary": "Brief 1-sentence summary of the main benefit"
}
`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an expert technical writer who creates customer-facing product communications.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  const data = await response.json();
  const generatedText = data.choices[0].message.content;
  
  try {
    return JSON.parse(generatedText);
  } catch {
    // Fallback if JSON parsing fails
    return {
      title: "Generated Release Update",
      content: `<p>${generatedText}</p>`,
      category: "announcement",
      summary: "Generated from uploaded document"
    };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Processing document to changelog...');
    
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      throw new Error('No file provided');
    }

    console.log('File received:', file.name, file.type, file.size);

    // Convert file to ArrayBuffer
    const fileContent = await file.arrayBuffer();
    
    // Extract text from file
    const extractedText = await extractTextFromFile(fileContent, file.name);
    console.log('Extracted text length:', extractedText.length);
    
    if (!extractedText.trim()) {
      throw new Error('No readable text found in the document');
    }

    // Generate changelog with AI
    console.log('Generating changelog with AI...');
    const changelogData = await generateChangelog(extractedText);
    
    console.log('Generated changelog:', changelogData);

    return new Response(JSON.stringify({
      success: true,
      data: {
        ...changelogData,
        sourceDocument: file.name,
        originalContent: extractedText.substring(0, 500) + '...', // First 500 chars for reference
        aiGenerated: true
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in process-document-to-changelog:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
