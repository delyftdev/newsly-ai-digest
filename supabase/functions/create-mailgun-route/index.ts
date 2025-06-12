
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateRouteRequest {
  emailAddress: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log('Create Mailgun route request received');

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
    const { emailAddress }: CreateRouteRequest = await req.json();

    if (!emailAddress) {
      return new Response('Email address is required', { 
        status: 400, 
        headers: corsHeaders 
      });
    }

    const mailgunApiKey = Deno.env.get('Mailgun_APIkey');
    const mailgunDomain = Deno.env.get('Mailgun_domain');
    const webhookUrl = Deno.env.get('Mailgun_Webhook');

    if (!mailgunApiKey || !mailgunDomain || !webhookUrl) {
      console.error('Missing Mailgun configuration');
      return new Response('Mailgun configuration missing', { 
        status: 500, 
        headers: corsHeaders 
      });
    }

    console.log('Creating route for:', emailAddress);
    console.log('Webhook URL:', webhookUrl);

    // Create Mailgun route
    const routeData = new URLSearchParams({
      priority: '1',
      description: `Route for ${emailAddress}`,
      expression: `match_recipient("${emailAddress}")`,
      action: `forward("${webhookUrl}")`
    });

    const response = await fetch(`https://api.mailgun.net/v3/routes`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`api:${mailgunApiKey}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: routeData
    });

    const result = await response.json();
    console.log('Mailgun API response:', result);

    if (!response.ok) {
      console.error('Mailgun API error:', result);
      return new Response(JSON.stringify({ 
        error: 'Failed to create Mailgun route',
        details: result 
      }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      routeId: result.route?.id,
      message: 'Route created successfully' 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error creating Mailgun route:', error);
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
