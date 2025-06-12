
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request): Promise<Response> => {
  console.log('Mailgun webhook received');
  console.log('Method:', req.method);
  console.log('URL:', req.url);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
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
    
    // Log all form data keys for debugging
    console.log('Form data keys:', Array.from(formData.keys()));
    
    // Extract email data from form
    const sender = formData.get('sender') as string;
    const recipient = formData.get('recipient') as string;
    const subject = formData.get('subject') as string;
    const bodyPlain = formData.get('body-plain') as string;
    const bodyHtml = formData.get('body-html') as string;
    const timestamp = formData.get('timestamp') as string;
    const from = formData.get('From') as string;

    console.log('Email data:', { 
      sender, 
      recipient, 
      subject: subject?.substring(0, 50) + '...', 
      from,
      hasBodyPlain: !!bodyPlain,
      hasBodyHtml: !!bodyHtml,
      timestamp 
    });

    if (!recipient) {
      console.error('No recipient found in webhook data');
      return new Response('No recipient found', { 
        status: 400, 
        headers: corsHeaders 
      });
    }

    // Find the inbox email record to get the user_id
    console.log('Looking up inbox email for recipient:', recipient);
    const { data: inboxEmail, error: inboxError } = await supabase
      .from('inbox_emails')
      .select('user_id')
      .eq('email_address', recipient)
      .single();

    if (inboxError || !inboxEmail) {
      console.error('Inbox email not found:', inboxError);
      console.error('Recipient was:', recipient);
      return new Response('Inbox email not found', { 
        status: 404, 
        headers: corsHeaders 
      });
    }

    console.log('Found inbox email for user_id:', inboxEmail.user_id);

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

    // Parse timestamp - Mailgun sends Unix timestamp
    let receivedAt = new Date().toISOString();
    if (timestamp) {
      try {
        receivedAt = new Date(parseInt(timestamp) * 1000).toISOString();
      } catch (e) {
        console.warn('Failed to parse timestamp:', timestamp);
      }
    }

    // Store the email in inbox_messages
    console.log('Inserting message into database...');
    const { data: insertedMessage, error: insertError } = await supabase
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
        received_at: receivedAt
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting email:', insertError);
      return new Response('Error storing email', { 
        status: 500, 
        headers: corsHeaders 
      });
    }

    console.log('Email stored successfully with ID:', insertedMessage?.id);
    return new Response(JSON.stringify({ 
      success: true, 
      messageId: insertedMessage?.id,
      message: 'Email processed successfully' 
    }), { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};

serve(handler);
