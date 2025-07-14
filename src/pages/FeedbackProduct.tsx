import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Users, Vote, Bell, TrendingUp, MessageSquare, Target, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SlackLogo from "@/components/logos/SlackLogo";
import GitHubLogo from "@/components/logos/GitHubLogo";
import IntercomLogo from "@/components/logos/IntercomLogo";
import NotionLogo from "@/components/logos/NotionLogo";
import LinearLogo from "@/components/logos/LinearLogo";
import JiraLogo from "@/components/logos/JiraLogo";

const FeedbackProduct = () => {
  const [activeTab, setActiveTab] = useState("board");

  const features = [
    {
      icon: Vote,
      title: "Public Voting",
      description: "Let customers vote on features they want most. Democracy in product development.",
    },
    {
      icon: Bell,
      title: "Automatic Updates",
      description: "Keep voters informed when their requested features ship.",
    },
    {
      icon: TrendingUp,
      title: "Smart Prioritization",
      description: "AI-powered insights help you prioritize what matters most to your customers.",
    },
    {
      icon: MessageSquare,
      title: "Rich Discussions",
      description: "Enable detailed conversations around feature requests and improvements.",
    }
  ];

  const roadmapStatuses = [
    { name: "Under Review", count: 12, color: "bg-yellow-500" },
    { name: "Planned", count: 8, color: "bg-blue-500" },
    { name: "In Progress", count: 5, color: "bg-purple-500" },
    { name: "Completed", count: 23, color: "bg-green-500" }
  ];

  const mockFeedback = [
    {
      title: "Dark mode support",
      votes: 142,
      status: "In Progress",
      priority: "High",
      description: "Add a dark theme option for better user experience during night hours."
    },
    {
      title: "Mobile app version",
      votes: 89,
      status: "Planned",
      priority: "Medium",
      description: "Native mobile application for iOS and Android platforms."
    },
    {
      title: "Advanced search filters",
      votes: 67,
      status: "Under Review",
      priority: "Low",
      description: "More granular search and filtering options for better content discovery."
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
              <MessageSquare className="h-3 w-3 mr-1" />
              Feedback & Roadmap
            </Badge>
            <h1 className="text-5xl md:text-6xl font-extrabold text-foreground mb-6">
              Close the feedback loop with
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent block">
                your customers
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Collect, organize, and act on customer feedback. Build products your users actually want 
              with transparent roadmaps and public voting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="text-lg px-8 py-6">
                  Create Your Feedback Board
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                See Example Board
              </Button>
            </div>
          </div>

          {/* Interactive Demo */}
          <div className="bg-card rounded-2xl shadow-2xl p-8">
            <div className="flex gap-4 mb-6">
              <Button 
                variant={activeTab === "board" ? "default" : "outline"}
                onClick={() => setActiveTab("board")}
              >
                Feedback Board
              </Button>
              <Button 
                variant={activeTab === "roadmap" ? "default" : "outline"}
                onClick={() => setActiveTab("roadmap")}
              >
                Public Roadmap
              </Button>
              <Button 
                variant={activeTab === "analytics" ? "default" : "outline"}
                onClick={() => setActiveTab("analytics")}
              >
                Analytics
              </Button>
            </div>
            
            {activeTab === "board" && (
              <div className="space-y-4">
                {mockFeedback.map((item, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{item.title}</h3>
                            <Badge variant={item.status === "In Progress" ? "default" : "secondary"}>
                              {item.status}
                            </Badge>
                            <Badge variant="outline">{item.priority}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <Vote className="h-3 w-3" />
                            {item.votes}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === "roadmap" && (
              <div className="grid md:grid-cols-4 gap-4">
                {roadmapStatuses.map((status, index) => (
                  <Card key={index}>
                    <CardContent className="p-6 text-center">
                      <div className={`w-4 h-4 ${status.color} rounded-full mx-auto mb-3`}></div>
                      <h3 className="font-semibold mb-1">{status.name}</h3>
                      <p className="text-2xl font-bold text-primary">{status.count}</p>
                      <p className="text-sm text-muted-foreground">items</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="text-center py-12">
                <TrendingUp className="h-16 w-16 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Feedback Analytics</h3>
                <p className="text-muted-foreground">
                  Track engagement, popular requests, and customer satisfaction metrics
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Build products customers love</h2>
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

      {/* Process Section */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">1. Collect Feedback</h3>
              <p className="text-sm text-muted-foreground">
                Users submit feature requests and improvements directly to your board
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Vote className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">2. Community Votes</h3>
              <p className="text-sm text-muted-foreground">
                Other users vote on requests they find valuable, surfacing popular demands
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">3. Prioritize & Plan</h3>
              <p className="text-sm text-muted-foreground">
                Use voting data and business metrics to prioritize your roadmap
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">4. Ship & Notify</h3>
              <p className="text-sm text-muted-foreground">
                Automatically notify voters when their requested features are ready
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Connects with your development tools</h2>
          <p className="text-lg text-muted-foreground mb-12">
            Sync feedback directly with your project management and development workflow.
          </p>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-8">
            {[
              { name: "GitHub", logo: GitHubLogo },
              { name: "Jira", logo: JiraLogo },
              { name: "Linear", logo: LinearLogo },
              { name: "Slack", logo: SlackLogo },
              { name: "Notion", logo: NotionLogo },
              { name: "Intercom", logo: IntercomLogo }
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

      {/* Benefits Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Build trust through transparency</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Show customers you're listening by making your product development process transparent. 
                Build stronger relationships and reduce churn with open communication.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Reduce support tickets</h4>
                    <p className="text-sm text-muted-foreground">Customers see what's coming next</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Increase customer satisfaction</h4>
                    <p className="text-sm text-muted-foreground">Build exactly what users want</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Data-driven decisions</h4>
                    <p className="text-sm text-muted-foreground">Let customer votes guide your roadmap</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-muted/30 rounded-lg p-8 text-center">
              <Users className="h-16 w-16 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Happy Customers</h3>
              <p className="text-muted-foreground">
                "Finally, a product team that listens! Seeing our feedback actually implemented builds so much trust."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Start building with your customers today</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Transform feedback into features. Create transparent roadmaps that build trust and drive engagement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="text-lg px-8 py-6">
                Create Feedback Board
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

export default FeedbackProduct;
