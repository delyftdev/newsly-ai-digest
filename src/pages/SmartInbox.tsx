
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle, Clock, Mail, Search, Zap, Brain, BarChart3, Users } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const SmartInbox = () => {
  const [activeDemo, setActiveDemo] = useState("categorization");

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Categorization",
      description: "Automatically categorize customer emails with 95% accuracy using advanced machine learning.",
      stats: "95% accuracy"
    },
    {
      icon: Search,
      title: "Smart Search",
      description: "Find any conversation instantly across all your communication channels.",
      stats: "10x faster"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Process thousands of emails in seconds, not hours.",
      stats: "< 100ms response"
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Track response times, sentiment, and customer satisfaction metrics.",
      stats: "Live insights"
    }
  ];

  const integrations = [
    { name: "Gmail", logo: "📧" },
    { name: "Outlook", logo: "📮" },
    { name: "Slack", logo: "💬" },
    { name: "Discord", logo: "🎮" },
    { name: "Zendesk", logo: "🎫" },
    { name: "Intercom", logo: "💭" }
  ];

  const beforeAfter = {
    before: [
      "❌ 2000+ unread emails",
      "❌ 4 hours daily sorting",
      "❌ Missed urgent messages",
      "❌ No visibility into trends"
    ],
    after: [
      "✅ Zero inbox with smart filters",
      "✅ 15 minutes daily management",
      "✅ Urgent alerts prioritized",
      "✅ Full analytics dashboard"
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              <Zap className="h-3 w-3 mr-1" />
              Smart Inbox
            </Badge>
            <h1 className="text-5xl md:text-6xl font-extrabold text-foreground mb-6">
              Superhuman speed for
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent block">
                customer communications
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Transform your chaotic inbox into an organized, AI-powered command center. 
              Process customer emails 10x faster with intelligent categorization and smart automation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Interactive Demo */}
          <div className="bg-card rounded-2xl shadow-2xl p-8 mb-16">
            <div className="flex gap-4 mb-6">
              <Button 
                variant={activeDemo === "categorization" ? "default" : "outline"}
                onClick={() => setActiveDemo("categorization")}
              >
                Auto-Categorization
              </Button>
              <Button 
                variant={activeDemo === "search" ? "default" : "outline"}
                onClick={() => setActiveDemo("search")}
              >
                Smart Search
              </Button>
              <Button 
                variant={activeDemo === "analytics" ? "default" : "outline"}
                onClick={() => setActiveDemo("analytics")}
              >
                Analytics
              </Button>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-6 min-h-[300px] flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">
                  {activeDemo === "categorization" && "🧠"}
                  {activeDemo === "search" && "🔍"}
                  {activeDemo === "analytics" && "📊"}
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {activeDemo === "categorization" && "AI Categorization Demo"}
                  {activeDemo === "search" && "Smart Search Demo"}
                  {activeDemo === "analytics" && "Analytics Dashboard"}
                </h3>
                <p className="text-muted-foreground">
                  Interactive demo coming soon
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Before/After Section */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">From Chaos to Control</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-destructive/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-destructive">Before Delyft</h3>
                <ul className="space-y-3">
                  {beforeAfter.before.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-destructive">{item.split(" ")[0]}</span>
                      <span>{item.slice(2)}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-primary/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-primary">After Delyft</h3>
                <ul className="space-y-3">
                  {beforeAfter.after.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary">{item.split(" ")[0]}</span>
                      <span>{item.slice(2)}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <feature.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
                  <Badge variant="secondary">{feature.stats}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Works with your existing tools</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {integrations.map((integration, index) => (
              <div key={index} className="flex items-center gap-3 bg-card p-4 rounded-lg">
                <span className="text-2xl">{integration.logo}</span>
                <span className="font-medium">{integration.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to transform your inbox?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of teams who've already supercharged their customer communications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6">
              Start Free Trial
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

export default SmartInbox;
