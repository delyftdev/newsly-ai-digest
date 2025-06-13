
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
    console.log('Request body:', body);
    
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

    console.log('Environment check:');
    console.log('Mailgun API Key:', mailgunApiKey ? 'EXISTS' : 'MISSING');
    console.log('Mailgun Domain:', mailgunDomain || 'MISSING');
    console.log('Webhook URL:', webhookUrl);

    if (!mailgunApiKey || !mailgunDomain) {
      console.error('Missing Mailgun configuration');
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Mailgun configuration missing - API key or domain not found' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('Creating catch-all route for domain:', mailgunDomain);

    // First, check if a catch-all route already exists
    console.log('Checking for existing routes...');
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
      console.error('Error listing routes:', listRoutesResponse.status, errorText);
      return new Response(JSON.stringify({ 
        success: false, 
        error: `Failed to list existing routes: ${listRoutesResponse.status} - ${errorText}` 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const routesData = await listRoutesResponse.json();
    console.log('Existing routes count:', routesData.items?.length || 0);

    // Check if catch-all route already exists
    const catchAllExpression = `match_recipient(".*@${mailgunDomain}")`;
    const existingCatchAll = routesData.items?.find((route: any) => 
      route.expression === catchAllExpression && 
      route.actions?.some((action: any) => action.includes(webhookUrl))
    );

    if (existingCatchAll) {
      console.log('Catch-all route already exists:', existingCatchAll.id);
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Catch-all route already exists',
        routeId: existingCatchAll.id
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Create new catch-all route with proper FormData
    console.log('Creating new catch-all route...');
    const routeData = new FormData();
    routeData.append('priority', '0');
    routeData.append('description', 'Catch-all route for company inbox emails');
    routeData.append('expression', catchAllExpression);
    routeData.append('action', `forward("${webhookUrl}")`);

    console.log('Route creation payload:');
    console.log('- Priority: 0');
    console.log('- Expression:', catchAllExpression);
    console.log('- Action: forward("' + webhookUrl + '")');

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

    console.log('Create route response status:', createRouteResponse.status);

    if (!createRouteResponse.ok) {
      const errorText = await createRouteResponse.text();
      console.error('Error creating route:', createRouteResponse.status, errorText);
      return new Response(JSON.stringify({ 
        success: false, 
        error: `Failed to create catch-all route: ${createRouteResponse.status} - ${errorText}` 
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
      error: 'Internal server error: ' + error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};

serve(handler);
