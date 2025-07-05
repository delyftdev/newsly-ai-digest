
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const claudeApiKey = Deno.env.get('CLAUDE_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Extract text from different file types
async function extractTextFromFile(fileContent: ArrayBuffer, fileName: string): Promise<string> {
  const extension = fileName.toLowerCase().split('.').pop();
  
  if (extension === 'txt' || extension === 'md') {
    return new TextDecoder().decode(fileContent);
  } else if (extension === 'pdf') {
    // Simple PDF text extraction - in production you'd use a proper PDF parser
    const text = new TextDecoder().decode(fileContent);
    return text.replace(/[^\x20-\x7E\n\r]/g, ''); // Remove non-printable characters
  } else if (extension === 'docx') {
    // Simple DOCX text extraction - in production you'd use a proper DOCX parser
    const text = new TextDecoder().decode(fileContent);
    return text.replace(/[^\x20-\x7E\n\r]/g, ''); // Remove non-printable characters
  }
  
  // Fallback - try to decode as text
  return new TextDecoder().decode(fileContent);
}

// Convert image to base64 for Claude vision
async function imageToBase64(fileContent: ArrayBuffer, mimeType: string): Promise<string> {
  const bytes = new Uint8Array(fileContent);
  let binary = '';
  bytes.forEach((byte) => binary += String.fromCharCode(byte));
  return btoa(binary);
}

// Generate content with Claude
async function generateWithClaude(
  userMessage: string, 
  conversationHistory: any[], 
  extractedTexts: string[], 
  images: { base64: string; mimeType: string }[]
): Promise<{ content: string; shouldInsert: boolean }> {
  
  // Build context from uploaded files
  let fileContext = '';
  if (extractedTexts.length > 0) {
    fileContext = `\n\nUploaded document content:\n${extractedTexts.join('\n\n---\n\n')}`;
  }
  
  // Determine if this is a content generation request
  const contentGenerationKeywords = [
    'create', 'generate', 'write', 'draft', 'make', 'build', 'compose', 
    'changelog', 'newsletter', 'announcement', 'blog post', 'content'
  ];
  const shouldInsert = contentGenerationKeywords.some(keyword => 
    userMessage.toLowerCase().includes(keyword)
  );

  // Build messages for Claude
  const messages = [
    {
      role: 'system',
      content: `You are Claude, an AI assistant specialized in content creation and editing. You help users create changelogs, newsletters, announcements, and other marketing content.

Key capabilities:
- Create customer-friendly changelogs from technical documents
- Generate engaging newsletters and announcements  
- Improve existing content for clarity and engagement
- Create content from screenshots, mockups, and documents
- Provide writing suggestions and refinements

When creating content, focus on:
- Clear, benefit-driven language
- Customer perspective and value
- Professional but engaging tone
- Proper HTML formatting for rich text editors
- SEO-friendly structure

${shouldInsert ? 'The user is asking for content generation. Provide ready-to-use HTML content that can be inserted into their editor.' : 'The user is asking for advice or refinement. Provide helpful guidance and suggestions.'}`
    },
    // Add conversation history
    ...conversationHistory.map((msg: any) => ({
      role: msg.role,
      content: msg.content
    })),
    {
      role: 'user',
      content: userMessage + fileContext
    }
  ];

  // Add images if present
  if (images.length > 0) {
    const lastMessage = messages[messages.length - 1];
    lastMessage.content = [
      { type: 'text', text: lastMessage.content },
      ...images.map(img => ({
        type: 'image',
        source: {
          type: 'base64',
          media_type: img.mimeType,
          data: img.base64
        }
      }))
    ];
  }

  console.log('Sending request to Claude with messages:', JSON.stringify(messages, null, 2));

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${claudeApiKey}`,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      messages: messages,
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  console.log('Claude response:', data);

  if (!response.ok) {
    throw new Error(`Claude API error: ${data.error?.message || 'Unknown error'}`);
  }

  const content = data.content[0].text;
  
  return {
    content,
    shouldInsert
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Claude AI Writer function called');
    
    const formData = await req.formData();
    const userMessage = formData.get('message') as string || '';
    const conversationHistoryStr = formData.get('conversationHistory') as string || '[]';
    const conversationHistory = JSON.parse(conversationHistoryStr);
    
    console.log('User message:', userMessage);
    console.log('Conversation history length:', conversationHistory.length);

    // Process uploaded files
    const extractedTexts: string[] = [];
    const images: { base64: string; mimeType: string }[] = [];
    
    // Look for uploaded files
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('file_') && value instanceof File) {
        console.log('Processing file:', value.name, value.type);
        
        const fileContent = await value.arrayBuffer();
        
        if (value.type.includes('image')) {
          // Handle image files for vision
          const base64 = await imageToBase64(fileContent, value.type);
          images.push({ base64, mimeType: value.type });
        } else {
          // Handle document files
          const extractedText = await extractTextFromFile(fileContent, value.name);
          extractedTexts.push(`File: ${value.name}\n${extractedText}`);
        }
      }
    }

    console.log('Extracted texts count:', extractedTexts.length);
    console.log('Images count:', images.length);

    // Generate content with Claude
    const result = await generateWithClaude(
      userMessage, 
      conversationHistory, 
      extractedTexts, 
      images
    );
    
    console.log('Generated content length:', result.content.length);
    console.log('Should insert:', result.shouldInsert);

    return new Response(JSON.stringify({
      success: true,
      content: result.content,
      shouldInsert: result.shouldInsert,
      filesProcessed: extractedTexts.length + images.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in claude-ai-writer function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message || 'Unknown error occurred'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
