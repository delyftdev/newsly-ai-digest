import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Mail, Brain, Filter, Zap, Clock, Target, CheckCircle, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GmailLogo from "@/components/logos/GmailLogo";
import SlackLogo from "@/components/logos/SlackLogo";
import IntercomLogo from "@/components/logos/IntercomLogo";
import ZendeskLogo from "@/components/logos/ZendeskLogo";
import NotionLogo from "@/components/logos/NotionLogo";
import LinearLogo from "@/components/logos/LinearLogo";

const SmartInbox = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Prioritization",
      description: "Automatically identifies and prioritizes important customer emails using AI."
    },
    {
      icon: Filter,
      title: "Smart Categorization",
      description: "Sorts emails into relevant categories like feedback, support, and feature requests."
    },
    {
      icon: Zap,
      title: "Automated Summaries",
      description: "Generates concise summaries of long email threads, saving you time."
    },
    {
      icon: Clock,
      title: "Snooze & Reminders",
      description: "Snooze non-urgent emails and set reminders to follow up later."
    }
  ];

  const benefits = [
    {
      icon: Target,
      title: "Never Miss Important Emails",
      description: "Ensure critical customer communications are always seen and addressed promptly."
    },
    {
      icon: CheckCircle,
      title: "Improve Response Times",
      description: "Respond faster to customer inquiries and feedback with AI-driven prioritization."
    },
    {
      icon: BarChart3,
      title: "Gain Actionable Insights",
      description: "Turn email overload into clear insights about customer needs and pain points."
    }
  ];

  const inboxPreviews = [
    {
      category: "Feedback",
      emails: [
        { sender: "john.doe@example.com", subject: "Feature Request: Dark Mode", summary: "John suggests adding a dark mode for better night-time usability..." },
        { sender: "jane.smith@example.com", subject: "Improvement Suggestion", summary: "Jane proposes a more intuitive navigation system for new users..." }
      ]
    },
    {
      category: "Support",
      emails: [
        { sender: "support@customer.com", subject: "Issue with Login", summary: "Customer reports they are unable to log in to their account..." },
        { sender: "help@user.net", subject: "Question about Integration", summary: "User asks for clarification on integrating with third-party apps..." }
      ]
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
              <Mail className="h-3 w-3 mr-1" />
              Smart Inbox
            </Badge>
            <h1 className="text-5xl md:text-6xl font-extrabold text-foreground mb-6">
              Never miss important
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent block">
                customer communications
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              AI-powered inbox that automatically categorizes, prioritizes, and summarizes customer emails. 
              Turn information overload into actionable insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="text-lg px-8 py-6">
                  Start Smart Organizing
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Inbox Preview Section */}
          <div className="bg-card rounded-2xl shadow-2xl p-8">
            <h3 className="text-xl font-semibold mb-6">AI-Powered Inbox Preview</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {inboxPreviews.map((category, index) => (
                <div key={index}>
                  <h4 className="text-lg font-semibold mb-3">{category.category}</h4>
                  <div className="space-y-3">
                    {category.emails.map((email, emailIndex) => (
                      <Card key={emailIndex} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{email.sender}</span>
                            <span className="text-sm text-muted-foreground">Today</span>
                          </div>
                          <h5 className="font-semibold">{email.subject}</h5>
                          <p className="text-sm text-muted-foreground">{email.summary}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
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

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12 items-center">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Works with your email and communication tools</h2>
          <p className="text-lg text-muted-foreground mb-12">
            Connect your existing email providers and communication platforms for seamless integration.
          </p>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-8">
            {[
              { name: "Gmail", logo: GmailLogo },
              { name: "Outlook", logo: GmailLogo },
              { name: "Slack", logo: SlackLogo },
              { name: "Intercom", logo: IntercomLogo },
              { name: "Zendesk", logo: ZendeskLogo },
              { name: "Linear", logo: LinearLogo }
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
          <h2 className="text-3xl font-bold mb-6">Ready to declutter your inbox?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of professionals who've transformed their email workflow with AI-powered organization.
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

export default SmartInbox;
