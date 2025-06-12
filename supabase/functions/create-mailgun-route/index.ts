
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request): Promise<Response> => {
  console.log('Create Mailgun route function called');
  console.log('Method:', req.method);

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
    const body = await req.json();
    const { createCatchAll } = body;

    if (!createCatchAll) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'createCatchAll parameter required' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const mailgunApiKey = Deno.env.get('Mailgun_APIkey');
    const mailgunDomain = Deno.env.get('Mailgun_domain');
    const webhookUrl = `https://darirbyisgzrxvavbhox.supabase.co/functions/v1/mailgun-webhook`;

    if (!mailgunApiKey || !mailgunDomain) {
      console.error('Missing Mailgun configuration');
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Mailgun configuration missing' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('Creating catch-all route for domain:', mailgunDomain);
    console.log('Webhook URL:', webhookUrl);

    // First, check if a catch-all route already exists
    const listRoutesResponse = await fetch(
      `https://api.mailgun.net/v3/routes`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${btoa(`api:${mailgunApiKey}`)}`,
        },
      }
    );

    if (!listRoutesResponse.ok) {
      const errorText = await listRoutesResponse.text();
      console.error('Error listing routes:', errorText);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Failed to list existing routes' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const routesData = await listRoutesResponse.json();
    console.log('Existing routes:', routesData);

    // Check if catch-all route already exists
    const catchAllExpression = `match_recipient(".*@${mailgunDomain}")`;
    const existingCatchAll = routesData.items?.find((route: any) => 
      route.expression === catchAllExpression && 
      route.actions?.some((action: any) => action.includes(webhookUrl))
    );

    if (existingCatchAll) {
      console.log('Catch-all route already exists:', existingCatchAll);
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Catch-all route already exists',
        routeId: existingCatchAll.id
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Create new catch-all route
    const routeData = new FormData();
    routeData.append('priority', '0');
    routeData.append('description', 'Catch-all route for company inbox emails');
    routeData.append('expression', catchAllExpression);
    routeData.append('action', `forward("${webhookUrl}")`);

    console.log('Creating route with expression:', catchAllExpression);

    const createRouteResponse = await fetch(
      `https://api.mailgun.net/v3/routes`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`api:${mailgunApiKey}`)}`,
        },
        body: routeData,
      }
    );

    if (!createRouteResponse.ok) {
      const errorText = await createRouteResponse.text();
      console.error('Error creating route:', errorText);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Failed to create catch-all route',
        details: errorText
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const routeResult = await createRouteResponse.json();
    console.log('Catch-all route created successfully:', routeResult);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Catch-all route created successfully',
      routeId: routeResult.route?.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in create-mailgun-route function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};

serve(handler);
