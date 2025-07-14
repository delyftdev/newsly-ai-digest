
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle, Inbox, Edit, MessageCircle, BarChart3, Users, Zap, Shield, Globe } from "lucide-react";

const Features = () => {
  const coreFeatures = [
    {
      icon: Inbox,
      title: "Smart Inbox",
      description: "AI-powered message organization and categorization",
      features: [
        "Automatic email parsing and categorization",
        "Smart tagging and priority detection",
        "Integration with popular tools",
        "Advanced search and filtering"
      ]
    },
    {
      icon: Edit,
      title: "Changelog Creation",
      description: "Beautiful, branded release communications",
      features: [
        "Rich text editor with templates",
        "Custom branding and styling",
        "Multi-format publishing",
        "Version control and drafts"
      ]
    },
    {
      icon: MessageCircle,
      title: "Feedback Hub",
      description: "Centralized customer feedback management",
      features: [
        "Feedback collection and voting",
        "Public roadmap integration",
        "Customer notification system",
        "Analytics and insights"
      ]
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description: "Data-driven communication optimization",
      features: [
        "Open rates and engagement tracking",
        "Customer sentiment analysis",
        "Performance benchmarking",
        "Custom reporting dashboards"
      ]
    }
  ];

  const advancedFeatures = [
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Seamless teamwork across departments"
    },
    {
      icon: Zap,
      title: "Automation",
      description: "Smart workflows and AI-powered assistance"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "SOC 2 compliance and advanced security features"
    },
    {
      icon: Globe,
      title: "Global Scale",
      description: "Multi-language support and worldwide CDN"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Everything you need for
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"> customer-focused releases</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover all the features that make Delyft the complete solution for customer communication and release management.
          </p>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Core Features</h2>
          <div className="grid md:grid-cols-2 gap-12">
            {coreFeatures.map((feature, index) => (
              <div key={index} className="bg-card rounded-xl p-8 border border-border">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {feature.features.map((item, idx) => (
                    <li key={idx} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Advanced Capabilities</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advancedFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Features;
