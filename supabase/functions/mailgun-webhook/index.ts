
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import OpenAI from 'https://esm.sh/openai@4.20.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Database {
  public: {
    Tables: {
      inbox_messages: {
        Row: {
          id: string
          user_id: string
          company_id: string | null
          from_email: string
          from_name: string | null
          subject: string | null
          content: string | null
          html_content: string | null
          category: string | null
          enhanced_category: string | null
          ai_summary: string | null
          ai_tags: string[] | null
          confidence_score: number | null
          processed_by_ai: boolean | null
          is_processed: boolean | null
          received_at: string | null
          created_at: string | null
        }
        Insert: {
          user_id: string
          company_id?: string | null
          from_email: string
          from_name?: string | null
          subject?: string | null
          content?: string | null
          html_content?: string | null
          category?: string | null
          enhanced_category?: string | null
          ai_summary?: string | null
          ai_tags?: string[] | null
          confidence_score?: number | null
          processed_by_ai?: boolean | null
          is_processed?: boolean | null
          received_at?: string | null
        }
      }
      team_activities: {
        Insert: {
          company_id: string
          user_id: string
          activity_type: string
          entity_type: string
          entity_id?: string | null
          description: string
          metadata?: any
        }
      }
    }
  }
}

const supabase = createClient<Database>(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY') ?? '',
})

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Mailgun webhook received')
    
    const formData = await req.formData()
    const to = formData.get('To') as string
    const from = formData.get('From') as string
    const subject = formData.get('Subject') as string
    const bodyPlain = formData.get('body-plain') as string
    const bodyHtml = formData.get('body-html') as string
    const timestamp = formData.get('timestamp') as string

    console.log('Email details:', { to, from, subject })

    if (!to || !from) {
      throw new Error('Missing required email fields')
    }

    // Extract company info from the "To" email address
    // Format: app-{company-subdomain}-{random}@domain.com
    const emailMatch = to.match(/app-([^-]+)-[^@]+@/)
    if (!emailMatch) {
      throw new Error('Invalid email format - cannot extract company info')
    }

    const companySubdomain = emailMatch[1]
    console.log('Extracted company subdomain:', companySubdomain)

    // Find the company and user
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id')
      .eq('subdomain', companySubdomain)
      .single()

    if (companyError || !company) {
      console.error('Company not found:', companyError)
      throw new Error('Company not found')
    }

    // Find the admin user for this company
    const { data: teamMember, error: teamError } = await supabase
      .from('team_members')
      .select('user_id')
      .eq('company_id', company.id)
      .eq('role', 'admin')
      .eq('status', 'active')
      .single()

    if (teamError || !teamMember) {
      console.error('Admin user not found:', teamError)
      throw new Error('Admin user not found')
    }

    console.log('Found company and user:', { companyId: company.id, userId: teamMember.user_id })

    // Parse sender information
    const fromMatch = from.match(/^(.*?)\s*<(.+)>$/) || [null, null, from]
    const senderName = fromMatch[1]?.trim() || null
    const senderEmail = fromMatch[2]?.trim() || from

    // Process with OpenAI for better categorization
    let aiResult = null
    try {
      console.log('Processing with OpenAI...')
      const content = bodyPlain || bodyHtml || ''
      
      const prompt = `Analyze this email and provide:
1. Category: newsletter, product_brief, feature_announcement, feedback, product_updates, or uncategorized
2. A brief summary (max 150 words)
3. Relevant tags (max 5)
4. Confidence score (0-1)

Email Subject: ${subject || 'No subject'}
Email Content: ${content.substring(0, 2000)}

Respond in JSON format:
{
  "category": "category_name",
  "summary": "brief summary",
  "tags": ["tag1", "tag2"],
  "confidence": 0.95
}`

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 500,
      })

      const aiResponse = response.choices[0]?.message?.content
      if (aiResponse) {
        try {
          aiResult = JSON.parse(aiResponse)
          console.log('AI processing result:', aiResult)
        } catch (parseError) {
          console.error('Failed to parse AI response:', parseError)
        }
      }
    } catch (aiError) {
      console.error('OpenAI processing failed:', aiError)
    }

    // Insert the email message
    const messageData = {
      user_id: teamMember.user_id,
      company_id: company.id,
      from_email: senderEmail,
      from_name: senderName,
      subject: subject || null,
      content: bodyPlain || null,
      html_content: bodyHtml || null,
      category: 'uncategorized',
      enhanced_category: aiResult?.category || null,
      ai_summary: aiResult?.summary || null,
      ai_tags: aiResult?.tags || null,
      confidence_score: aiResult?.confidence || null,
      processed_by_ai: !!aiResult,
      is_processed: true,
      received_at: timestamp ? new Date(parseInt(timestamp) * 1000).toISOString() : new Date().toISOString(),
    }

    const { data: insertedMessage, error: insertError } = await supabase
      .from('inbox_messages')
      .insert(messageData)
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting message:', insertError)
      throw insertError
    }

    console.log('Message inserted successfully:', insertedMessage.id)

    // Log team activity
    await supabase
      .from('team_activities')
      .insert({
        company_id: company.id,
        user_id: teamMember.user_id,
        activity_type: 'email_received',
        entity_type: 'email',
        entity_id: insertedMessage.id,
        description: `New email received from ${senderEmail}: ${subject || 'No subject'}`,
        metadata: {
          category: aiResult?.category || 'uncategorized',
          confidence: aiResult?.confidence || 0,
          ai_processed: !!aiResult,
        },
      })

    return new Response(
      JSON.stringify({ success: true, messageId: insertedMessage.id }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
