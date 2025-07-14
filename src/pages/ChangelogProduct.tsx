import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, PenTool, Users, Bell, TrendingUp, Sparkles, CheckCircle, Edit3, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SlackLogo from "@/components/logos/SlackLogo";
import GitHubLogo from "@/components/logos/GitHubLogo";
import IntercomLogo from "@/components/logos/IntercomLogo";
import NotionLogo from "@/components/logos/NotionLogo";
import LinearLogo from "@/components/logos/LinearLogo";
import FigmaLogo from "@/components/logos/FigmaLogo";

const ChangelogProduct = () => {
  const [activeTab, setActiveTab] = useState("list");

  const features = [
    {
      icon: Sparkles,
      title: "Beautiful Design",
      description: "Create on-brand changelogs that reflect your unique style.",
    },
    {
      icon: Bell,
      title: "Automatic Notifications",
      description: "Keep customers informed when new features are released.",
    },
    {
      icon: TrendingUp,
      title: "Engagement Tracking",
      description: "Measure the impact of your updates with detailed analytics.",
    },
    {
      icon: Users,
      title: "User Feedback",
      description: "Collect and prioritize feedback directly from your changelog.",
    }
  ];

  const mockChangelog = [
    {
      title: "Dark mode is here!",
      date: "October 18, 2024",
      description: "You asked, we delivered! Dark mode is now available for all users.",
      category: "New Feature"
    },
    {
      title: "Improved search functionality",
      date: "October 12, 2024",
      description: "Find what you need faster with our new and improved search.",
      category: "Improvement"
    },
    {
      title: "Bug fixes and performance improvements",
      date: "October 5, 2024",
      description: "We've squashed some bugs and made the app even faster.",
      category: "Bug Fix"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              <PenTool className="h-3 w-3 mr-1" />
              Changelog & Updates
            </Badge>
            <h1 className="text-5xl md:text-6xl font-extrabold text-foreground mb-6">
              Keep customers informed with
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent block">
                beautiful changelogs
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Create stunning product updates that customers actually read. Turn feature releases 
              into engagement opportunities with our powerful changelog platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="text-lg px-8 py-6">
                  Start Creating Changelogs
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                View Example
              </Button>
            </div>
          </div>

          {/* Interactive Demo */}
          <div className="bg-card rounded-2xl shadow-2xl p-8">
            <div className="flex gap-4 mb-6">
              <Button 
                variant={activeTab === "list" ? "default" : "outline"}
                onClick={() => setActiveTab("list")}
              >
                Changelog List
              </Button>
              <Button 
                variant={activeTab === "editor" ? "default" : "outline"}
                onClick={() => setActiveTab("editor")}
              >
                Changelog Editor
              </Button>
              <Button 
                variant={activeTab === "analytics" ? "default" : "outline"}
                onClick={() => setActiveTab("analytics")}
              >
                Analytics
              </Button>
            </div>
            
            {activeTab === "list" && (
              <div className="space-y-4">
                {mockChangelog.map((item, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{item.title}</h3>
                            <Badge variant="secondary">{item.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                          <p className="text-xs text-muted-foreground mt-2">{item.date}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <Edit3 className="h-3 w-3" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === "editor" && (
              <div className="text-center py-12">
                <PenTool className="h-16 w-16 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Changelog Editor</h3>
                <p className="text-muted-foreground">
                  Create and customize your changelog entries with ease
                </p>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="text-center py-12">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Changelog Analytics</h3>
                <p className="text-muted-foreground">
                  Track engagement, popular updates, and customer satisfaction metrics
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">The power to keep customers informed</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <feature.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Connects with your workflow</h2>
          <p className="text-lg text-muted-foreground mb-12">
            Seamlessly integrate with the tools your team uses every day.
          </p>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-8">
            {[
              { name: "Slack", logo: SlackLogo },
              { name: "GitHub", logo: GitHubLogo },
              { name: "Notion", logo: NotionLogo },
              { name: "Intercom", logo: IntercomLogo },
              { name: "Linear", logo: LinearLogo },
              { name: "Figma", logo: FigmaLogo }
            ].map((tool, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center hover:bg-accent transition-colors">
                  <tool.logo size={24} className="text-foreground" />
                </div>
                <span className="text-sm font-medium">{tool.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to create your first changelog?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of teams who trust Delyft to keep their customers informed and engaged.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="text-lg px-8 py-6">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ChangelogProduct;
