
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import SlackLogo from "@/components/logos/SlackLogo";
import GitHubLogo from "@/components/logos/GitHubLogo";
import JiraLogo from "@/components/logos/JiraLogo";
import LinearLogo from "@/components/logos/LinearLogo";
import IntercomLogo from "@/components/logos/IntercomLogo";
import ZendeskLogo from "@/components/logos/ZendeskLogo";
import DiscordLogo from "@/components/logos/DiscordLogo";
import GmailLogo from "@/components/logos/GmailLogo";

const Integrations = () => {
  const integrationCategories = [
    {
      category: "Communication",
      integrations: [
        { name: "Slack", description: "Get notifications and updates in your Slack channels", logo: SlackLogo },
        { name: "Microsoft Teams", description: "Collaborate seamlessly with your team", logo: GmailLogo },
        { name: "Discord", description: "Engage with your community directly", logo: DiscordLogo },
        { name: "Email", description: "Send updates via email campaigns", logo: GmailLogo }
      ]
    },
    {
      category: "Development",
      integrations: [
        { name: "GitHub", description: "Link releases to code changes and pull requests", logo: GitHubLogo },
        { name: "GitLab", description: "Integrate with your GitLab workflow", logo: GitHubLogo },
        { name: "Jira", description: "Connect feedback to development tickets", logo: JiraLogo },
        { name: "Linear", description: "Streamline issue tracking and project management", logo: LinearLogo }
      ]
    },
    {
      category: "Customer Success",
      integrations: [
        { name: "Intercom", description: "Sync customer conversations and feedback", logo: IntercomLogo },
        { name: "Zendesk", description: "Connect support tickets to product updates", logo: ZendeskLogo },
        { name: "HubSpot", description: "Align marketing and customer communications", logo: IntercomLogo },
        { name: "Salesforce", description: "Enterprise CRM integration", logo: IntercomLogo }
      ]
    },
    {
      category: "Analytics",
      integrations: [
        { name: "Google Analytics", description: "Track engagement and conversion metrics", logo: GmailLogo },
        { name: "Mixpanel", description: "Advanced product analytics integration", logo: IntercomLogo },
        { name: "Amplitude", description: "User behavior and retention analysis", logo: IntercomLogo },
        { name: "Segment", description: "Unified customer data platform", logo: IntercomLogo }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Connect with your
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"> favorite tools</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Seamlessly integrate Delyft with your existing workflow. Connect with 50+ tools and platforms your team already uses.
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            View All Integrations
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Integrations Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {integrationCategories.map((category, index) => (
            <div key={index} className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-8">{category.category}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.integrations.map((integration, idx) => (
                  <div key={idx} className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-colors cursor-pointer">
                    <div className="mb-4">
                      <integration.logo size={32} className="text-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{integration.name}</h3>
                    <p className="text-sm text-muted-foreground">{integration.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* API Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">Need a custom integration?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Use our powerful REST API to build custom integrations and workflows that fit your unique needs.
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="outline" size="lg">
              View API Docs
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg">Contact Sales</Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Integrations;
