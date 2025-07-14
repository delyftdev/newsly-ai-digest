import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BarChart3, TrendingUp, Eye, Users, Clock, Target, Zap, PieChart } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SlackLogo from "@/components/logos/SlackLogo";
import GitHubLogo from "@/components/logos/GitHubLogo";
import IntercomLogo from "@/components/logos/IntercomLogo";
import NotionLogo from "@/components/logos/NotionLogo";
import GmailLogo from "@/components/logos/GmailLogo";
import ZendeskLogo from "@/components/logos/ZendeskLogo";

const InsightsProduct = () => {
  const [activeMetric, setActiveMetric] = useState("engagement");

  const features = [
    {
      icon: BarChart3,
      title: "Engagement Analytics",
      description: "Track how customers interact with your communications across all channels.",
    },
    {
      icon: TrendingUp,
      title: "Performance Trends",
      description: "Identify patterns and trends in customer behavior over time.",
    },
    {
      icon: Target,
      title: "ROI Tracking",
      description: "Measure the impact of your communications on business metrics.",
    },
    {
      icon: PieChart,
      title: "Audience Segmentation",
      description: "Understand different customer segments and their preferences.",
    }
  ];

  const metrics = [
    {
      id: "engagement",
      name: "Engagement Rate",
      value: "68%",
      change: "+12%",
      icon: Eye,
      description: "Average engagement across all communications"
    },
    {
      id: "satisfaction",
      name: "Customer Satisfaction",
      value: "4.8/5",
      change: "+0.3",
      icon: Users,
      description: "Based on feedback and surveys"
    },
    {
      id: "response",
      name: "Response Time",
      value: "2.4h",
      change: "-30%",
      icon: Clock,
      description: "Average time to respond to customer inquiries"
    },
    {
      id: "conversion",
      name: "Feature Adoption",
      value: "34%",
      change: "+8%",
      icon: Zap,
      description: "Rate of new feature adoption after announcements"
    }
  ];

  const dashboardSections = [
    {
      title: "Communication Performance",
      description: "Track email open rates, click-through rates, and engagement across all channels",
      metrics: ["Open Rate: 45%", "Click Rate: 12%", "Engagement: 68%"]
    },
    {
      title: "Customer Behavior",
      description: "Understand how customers interact with your product and communications",
      metrics: ["Active Users: 2,341", "Session Duration: 8m 32s", "Return Rate: 76%"]
    },
    {
      title: "Feedback Analysis",
      description: "Analyze sentiment and themes from customer feedback and support tickets",
      metrics: ["Satisfaction: 4.8/5", "Positive Sentiment: 82%", "Issues Resolved: 94%"]
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
              <BarChart3 className="h-3 w-3 mr-1" />
              Insights & Analytics
            </Badge>
            <h1 className="text-5xl md:text-6xl font-extrabold text-foreground mb-6">
              Make data-driven decisions with
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent block">
                powerful insights
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Transform your customer communications with actionable analytics. 
              Track engagement, measure impact, and optimize your strategy with comprehensive insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="text-lg px-8 py-6">
                  View Your Analytics
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Live Demo
              </Button>
            </div>
          </div>

          {/* Metrics Overview */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {metrics.map((metric, index) => (
              <Card 
                key={index} 
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  activeMetric === metric.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setActiveMetric(metric.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <metric.icon className="h-8 w-8 text-primary" />
                    <Badge variant={metric.change.startsWith('+') ? 'default' : 'secondary'}>
                      {metric.change}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-sm text-muted-foreground mb-1">{metric.name}</h3>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className="text-xs text-muted-foreground mt-2">{metric.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Dashboard Preview */}
          <div className="bg-card rounded-2xl shadow-2xl p-8">
            <h3 className="text-xl font-semibold mb-6">Your Analytics Dashboard</h3>
            <div className="grid lg:grid-cols-3 gap-6">
              {dashboardSections.map((section, index) => (
                <Card key={index} className="bg-muted/30">
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-3">{section.title}</h4>
                    <p className="text-sm text-muted-foreground mb-4">{section.description}</p>
                    <div className="space-y-2">
                      {section.metrics.map((metric, metricIndex) => (
                        <div key={metricIndex} className="flex justify-between text-sm">
                          <span>{metric.split(':')[0]}</span>
                          <span className="font-medium">{metric.split(':')[1]}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Comprehensive analytics for every need</h2>
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
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Turn insights into action</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Don't just collect data—use it to improve your customer relationships and drive business growth.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Optimize Communication Strategy</h3>
                    <p className="text-sm text-muted-foreground">
                      Identify which types of content resonate most with your audience and double down on what works.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Understand Your Audience</h3>
                    <p className="text-sm text-muted-foreground">
                      Segment customers based on behavior and preferences to deliver more personalized experiences.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Measure Business Impact</h3>
                    <p className="text-sm text-muted-foreground">
                      Connect communication metrics to business outcomes like retention, satisfaction, and growth.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-8">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-4">Real-time Analytics</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-card rounded p-3">
                    <div className="text-2xl font-bold text-primary">2.4k</div>
                    <div className="text-muted-foreground">Active Users</div>
                  </div>
                  <div className="bg-card rounded p-3">
                    <div className="text-2xl font-bold text-primary">94%</div>
                    <div className="text-muted-foreground">Satisfaction</div>
                  </div>
                  <div className="bg-card rounded p-3">
                    <div className="text-2xl font-bold text-primary">68%</div>
                    <div className="text-muted-foreground">Engagement</div>
                  </div>
                  <div className="bg-card rounded p-3">
                    <div className="text-2xl font-bold text-primary">34%</div>
                    <div className="text-muted-foreground">Conversion</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Connects with your existing tools</h2>
          <p className="text-lg text-muted-foreground mb-12">
            Seamlessly integrate with your current stack to get a complete view of customer interactions.
          </p>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-8">
            {[
              { name: "Google Analytics", logo: GmailLogo },
              { name: "Mixpanel", logo: IntercomLogo },
              { name: "Amplitude", logo: IntercomLogo },
              { name: "Segment", logo: IntercomLogo },
              { name: "HubSpot", logo: IntercomLogo },
              { name: "Salesforce", logo: IntercomLogo }
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
          <h2 className="text-3xl font-bold mb-6">Start making data-driven decisions today</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Get the insights you need to optimize your customer communications and drive business growth.
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

export default InsightsProduct;
