
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const demoEmail = 'demo@delyft.com';
    
    // Find demo user
    const { data: authUser } = await supabaseClient.auth.admin.listUsers();
    const demoUser = authUser.users.find(u => u.email === demoEmail);
    
    if (!demoUser) {
      return new Response(
        JSON.stringify({ error: 'Demo user not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user's company
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('company_id')
      .eq('id', demoUser.id)
      .single();

    if (!profile?.company_id) {
      return new Response(
        JSON.stringify({ error: 'Demo user has no company' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const companyId = profile.company_id;

    // Update onboarding progress
    await supabaseClient
      .from('onboarding_progress')
      .upsert({
        user_id: demoUser.id,
        current_step: 5,
        completed_steps: [1, 2, 3, 4, 5],
        company_info_completed: true,
        team_setup_completed: true,
        domain_setup_completed: true,
        branding_completed: true,
        workspace_completed: true,
        completed_at: new Date().toISOString()
      });

    // Create sample feedback ideas
    const feedbackIdeas = [
      {
        company_id: companyId,
        user_id: demoUser.id,
        title: "Dark mode toggle in settings",
        description: "It would be great to have a dark mode option in the user interface settings for better accessibility during night time usage.",
        status: "planned",
        category: "feature",
        tags: ["ui", "accessibility", "settings"],
        vote_count: 15
      },
      {
        company_id: companyId,
        user_id: demoUser.id,
        title: "Export data to CSV",
        description: "Allow users to export their data and reports in CSV format for further analysis in external tools.",
        status: "under-review",
        category: "feature",
        tags: ["export", "csv", "data"],
        vote_count: 8
      },
      {
        company_id: companyId,
        user_id: demoUser.id,
        title: "Improve page loading speed",
        description: "The dashboard takes too long to load, especially with large datasets. Consider implementing pagination or lazy loading.",
        status: "in-development",
        category: "improvement",
        tags: ["performance", "loading", "optimization"],
        vote_count: 23
      },
      {
        company_id: companyId,
        user_id: demoUser.id,
        title: "Mobile app support",
        description: "Create a mobile application for iOS and Android to access the platform on the go.",
        status: "under-review",
        category: "feature",
        tags: ["mobile", "ios", "android"],
        vote_count: 42
      },
      {
        company_id: companyId,
        user_id: demoUser.id,
        title: "Fix notification bug",
        description: "Notifications are not showing up properly in Chrome browser. They appear delayed or sometimes not at all.",
        status: "completed",
        category: "bug",
        tags: ["notifications", "chrome", "browser"],
        vote_count: 5
      }
    ];

    await supabaseClient.from('feedback_ideas').insert(feedbackIdeas);

    // Create sample changelogs
    const changelogs = [
      {
        company_id: companyId,
        created_by: demoUser.id,
        title: "New Dashboard Analytics",
        content: {
          blocks: [
            {
              type: "paragraph",
              data: { text: "We've launched a completely redesigned analytics dashboard with real-time insights and improved data visualization." }
            },
            {
              type: "list",
              data: {
                style: "unordered",
                items: [
                  "Real-time data updates",
                  "Interactive charts and graphs",
                  "Custom date range selection",
                  "Export functionality for reports"
                ]
              }
            }
          ]
        },
        category: "feature",
        status: "published",
        visibility: "public",
        published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        published_by: demoUser.id,
        tags: ["analytics", "dashboard", "visualization"]
      },
      {
        company_id: companyId,
        created_by: demoUser.id,
        title: "Performance Improvements",
        content: {
          blocks: [
            {
              type: "paragraph",
              data: { text: "This update focuses on improving overall application performance and user experience." }
            },
            {
              type: "paragraph",
              data: { text: "Key improvements include:" }
            },
            {
              type: "list",
              data: {
                style: "unordered",
                items: [
                  "50% faster page load times",
                  "Reduced memory usage",
                  "Optimized database queries",
                  "Better caching mechanisms"
                ]
              }
            }
          ]
        },
        category: "improvement",
        status: "published",
        visibility: "public",
        published_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        published_by: demoUser.id,
        tags: ["performance", "optimization", "speed"]
      },
      {
        company_id: companyId,
        created_by: demoUser.id,
        title: "Security Update",
        content: {
          blocks: [
            {
              type: "paragraph",
              data: { text: "Important security updates and patches have been applied to ensure your data remains protected." }
            },
            {
              type: "paragraph",
              data: { text: "This update includes enhanced encryption and authentication improvements." }
            }
          ]
        },
        category: "security",
        status: "published",
        visibility: "public",
        published_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        published_by: demoUser.id,
        tags: ["security", "encryption", "authentication"]
      }
    ];

    await supabaseClient.from('changelogs').insert(changelogs);

    // Create sample inbox messages
    const inboxMessages = [
      {
        company_id: companyId,
        user_id: demoUser.id,
        from_email: "customer@example.com",
        from_name: "John Smith",
        subject: "Feature Request: Bulk Import",
        content: "Hi team, I would love to see a bulk import feature that allows me to upload multiple records at once via CSV. This would save us a lot of time when migrating data. Thanks!",
        category: "feature-request",
        ai_summary: "Customer requesting bulk CSV import functionality to streamline data migration process.",
        enhanced_category: "feature-request",
        ai_tags: ["bulk-import", "csv", "data-migration"],
        confidence_score: 0.92,
        processed_by_ai: true,
        received_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        company_id: companyId,
        user_id: demoUser.id,
        from_email: "support@partner.com",
        from_name: "Sarah Johnson",
        subject: "Integration Questions",
        content: "Hello, we're interested in integrating our CRM system with your platform. Could you provide documentation on your API endpoints? We specifically need to sync customer data and activity logs.",
        category: "integration",
        ai_summary: "Partner company inquiring about API documentation for CRM integration, specifically for customer data and activity sync.",
        enhanced_category: "integration",
        ai_tags: ["api", "crm", "integration", "documentation"],
        confidence_score: 0.88,
        processed_by_ai: true,
        received_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      },
      {
        company_id: companyId,
        user_id: demoUser.id,
        from_email: "bug-report@testuser.com",
        from_name: "Mike Davis",
        subject: "Login Issue on Mobile",
        content: "I'm having trouble logging into my account from my iPhone. The login button doesn't seem to respond when I tap it. This has been happening for the past two days. Browser version works fine.",
        category: "bug-report",
        ai_summary: "User experiencing mobile login issues on iPhone, desktop version working properly.",
        enhanced_category: "bug-report",
        ai_tags: ["mobile", "login", "iphone", "bug"],
        confidence_score: 0.95,
        processed_by_ai: true,
        received_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      },
      {
        company_id: companyId,
        user_id: demoUser.id,
        from_email: "feedback@customer.org",
        from_name: "Lisa Wilson",
        subject: "Great Job on the New Update!",
        content: "I wanted to reach out and say thank you for the recent updates to the platform. The new dashboard is much more intuitive and the performance improvements are very noticeable. Keep up the excellent work!",
        category: "feedback",
        ai_summary: "Positive customer feedback praising recent dashboard updates and performance improvements.",
        enhanced_category: "positive-feedback",
        ai_tags: ["praise", "dashboard", "performance", "positive"],
        confidence_score: 0.91,
        processed_by_ai: true,
        received_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
      }
    ];

    await supabaseClient.from('inbox_messages').insert(inboxMessages);

    console.log('Demo data populated successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Demo data populated successfully',
        data: {
          feedback_ideas: feedbackIdeas.length,
          changelogs: changelogs.length,
          inbox_messages: inboxMessages.length,
          onboarding_completed: true
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error populating demo data:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
