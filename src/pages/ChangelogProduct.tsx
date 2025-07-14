
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Palette, Mail, Globe, BarChart3, Users, Megaphone, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ChangelogProduct = () => {
  const [selectedTemplate, setSelectedTemplate] = useState("modern");

  const templates = [
    { id: "modern", name: "Modern", preview: "🎨" },
    { id: "minimal", name: "Minimal", preview: "⚡" },
    { id: "corporate", name: "Corporate", preview: "🏢" },
    { id: "creative", name: "Creative", preview: "🌈" }
  ];

  const features = [
    {
      icon: Palette,
      title: "Brand Customization",
      description: "Match your brand perfectly with custom colors, fonts, and layouts.",
    },
    {
      icon: Mail,
      title: "Multi-Channel Publishing",
      description: "Publish to email, in-app widgets, and external sites simultaneously.",
    },
    {
      icon: BarChart3,
      title: "Engagement Analytics",
      description: "Track reads, clicks, and engagement across all your announcements.",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Collaborate with your team on drafts before publishing.",
    }
  ];

  const publishingChannels = [
    { name: "Email Newsletter", icon: "📧", description: "Send to subscriber lists" },
    { name: "In-App Widget", icon: "📱", description: "Embed in your product" },
    { name: "Public Page", icon: "🌐", description: "Shareable changelog URL" },
    { name: "RSS Feed", icon: "📡", description: "Syndicate updates" },
    { name: "Slack/Discord", icon: "💬", description: "Team notifications" },
    { name: "API Webhook", icon: "🔗", description: "Custom integrations" }
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
              <Megaphone className="h-3 w-3 mr-1" />
              Changelog
            </Badge>
            <h1 className="text-5xl md:text-6xl font-extrabold text-foreground mb-6">
              Beautiful changelogs that
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent block">
                customers actually read
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Create stunning, branded announcements that engage your users and keep them 
              excited about your product updates. No design skills required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6">
                Create Your First Changelog
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                View Examples
              </Button>
            </div>
          </div>

          {/* Template Preview */}
          <div className="bg-card rounded-2xl shadow-2xl p-8">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Choose from beautiful templates</h3>
              <div className="flex gap-4">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      selectedTemplate === template.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="text-2xl mb-2">{template.preview}</div>
                    <div className="text-sm font-medium">{template.name}</div>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="bg-muted/30 rounded-lg p-8 min-h-[400px]">
              <div className="max-w-md mx-auto">
                <div className="bg-card rounded-lg p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold">New Feature Release</h4>
                      <p className="text-sm text-muted-foreground">March 15, 2024</p>
                    </div>
                  </div>
                  <p className="text-sm mb-4">
                    We're excited to announce our new Smart Inbox feature that will 
                    revolutionize how you manage customer communications.
                  </p>
                  <div className="flex gap-2">
                    <Badge variant="secondary">Feature</Badge>
                    <Badge variant="outline">New</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Everything you need for great announcements</h2>
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

      {/* Publishing Channels */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Publish everywhere at once</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishingChannels.map((channel, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{channel.icon}</div>
                    <div>
                      <h3 className="font-semibold mb-1">{channel.name}</h3>
                      <p className="text-sm text-muted-foreground">{channel.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics Preview */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Track what matters</h2>
              <p className="text-lg text-muted-foreground mb-6">
                See how your announcements perform with detailed analytics. 
                Track engagement, identify your most popular updates, and optimize your communication strategy.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Read rates and engagement metrics</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Click-through tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Subscriber growth analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Performance comparisons</span>
                </li>
              </ul>
            </div>
            <div className="bg-muted/30 rounded-lg p-8">
              <div className="text-center text-muted-foreground">
                📊 Analytics Dashboard Preview
                <br />
                <span className="text-sm">Interactive charts and metrics</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Start creating beautiful changelogs today</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of companies who trust Delyft to keep their customers informed and engaged.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
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
