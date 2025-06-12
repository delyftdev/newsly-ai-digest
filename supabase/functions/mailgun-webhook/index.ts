
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MailgunWebhookPayload {
  'event-data': {
    message: {
      headers: {
        from: string;
        subject: string;
        to: string;
      };
    };
  };
  'body-plain'?: string;
  'body-html'?: string;
  'stripped-text'?: string;
  'stripped-html'?: string;
  sender: string;
  recipient: string;
  subject: string;
  'body-plain': string;
  'body-html': string;
  timestamp: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log('Mailgun webhook received');

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Parse form data from Mailgun
    const formData = await req.formData();
    
    // Extract email data from form
    const sender = formData.get('sender') as string;
    const recipient = formData.get('recipient') as string;
    const subject = formData.get('subject') as string;
    const bodyPlain = formData.get('body-plain') as string;
    const bodyHtml = formData.get('body-html') as string;
    const timestamp = formData.get('timestamp') as string;
    const from = formData.get('From') as string;

    console.log('Email data:', { sender, recipient, subject, from });

    if (!recipient) {
      console.error('No recipient found in webhook data');
      return new Response('No recipient found', { 
        status: 400, 
        headers: corsHeaders 
      });
    }

    // Find the inbox email record to get the user_id
    const { data: inboxEmail, error: inboxError } = await supabase
      .from('inbox_emails')
      .select('user_id')
      .eq('email_address', recipient)
      .single();

    if (inboxError || !inboxEmail) {
      console.error('Inbox email not found:', inboxError);
      return new Response('Inbox email not found', { 
        status: 404, 
        headers: corsHeaders 
      });
    }

    // Basic AI categorization based on subject and content
    let category = 'uncategorized';
    const subjectLower = (subject || '').toLowerCase();
    const contentLower = (bodyPlain || '').toLowerCase();

    if (subjectLower.includes('newsletter') || contentLower.includes('unsubscribe')) {
      category = 'newsletter';
    } else if (subjectLower.includes('feature') || subjectLower.includes('update') || subjectLower.includes('release')) {
      category = 'feature_announcement';
    } else if (subjectLower.includes('product') || contentLower.includes('product')) {
      category = 'product_brief';
    }

    // Generate basic AI summary
    let aiSummary = '';
    if (bodyPlain && bodyPlain.length > 0) {
      const words = bodyPlain.split(' ').slice(0, 30).join(' ');
      aiSummary = words.length < bodyPlain.length ? words + '...' : words;
    }

    // Store the email in inbox_messages
    const { error: insertError } = await supabase
      .from('inbox_messages')
      .insert({
        user_id: inboxEmail.user_id,
        from_email: sender || from || 'unknown@example.com',
        from_name: from || sender || null,
        subject: subject || 'No Subject',
        content: bodyPlain || '',
        html_content: bodyHtml || null,
        category: category,
        ai_summary: aiSummary,
        received_at: timestamp ? new Date(parseInt(timestamp) * 1000).toISOString() : new Date().toISOString()
      });

    if (insertError) {
      console.error('Error inserting email:', insertError);
      return new Response('Error storing email', { 
        status: 500, 
        headers: corsHeaders 
      });
    }

    console.log('Email stored successfully');
    return new Response('Email processed successfully', { 
      status: 200, 
      headers: corsHeaders 
    });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response('Internal server error', { 
      status: 500, 
      headers: corsHeaders 
    });
  }
};

serve(handler);
