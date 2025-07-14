
import { useState } from "react";
import { Check, Star, Zap, Shield, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PricingCard from "@/components/pricing/PricingCard";
import PricingToggle from "@/components/pricing/PricingToggle";
import ROICalculator from "@/components/pricing/ROICalculator";
import PricingFAQ from "@/components/pricing/PricingFAQ";
import { Link } from "react-router-dom";

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Free",
      price: { monthly: 0, annual: 0 },
      description: "Perfect for getting started",
      features: [
        "2 changelogs per month",
        "Basic templates",
        "Public changelog page",
        "Email notifications",
        "Community support"
      ],
      cta: "Start Free",
      ctaVariant: "outline" as const,
      popular: false
    },
    {
      name: "Starter",
      price: { monthly: 15, annual: 12 },
      perUser: { monthly: 5, annual: 4 },
      description: "Smart inbox and unlimited changelogs",
      features: [
        "Everything in Free",
        "Unlimited changelogs",
        "Smart Inbox with AI triaging",
        "Custom branding",
        "Advanced analytics",
        "Priority support",
        "Team collaboration (up to 5 users)"
      ],
      cta: "Start 14-day Trial",
      ctaVariant: "default" as const,
      popular: false,
      savings: "Saves 4+ hours/week per user"
    },
    {
      name: "Growth",
      price: { monthly: 40, annual: 32 },
      perUser: { monthly: 8, annual: 6 },
      description: "Advanced collaboration and white-labeling",
      features: [
        "Everything in Starter",
        "Advanced team collaboration",
        "White-label options",
        "Custom domains",
        "Advanced integrations",
        "Workflow automation",
        "Advanced analytics & reporting",
        "API access"
      ],
      cta: "Start 14-day Trial",
      ctaVariant: "default" as const,
      popular: true,
      savings: "Complete workflow automation"
    },
    {
      name: "Enterprise",
      price: { monthly: "Custom", annual: "Custom" },
      description: "Custom solutions for large teams",
      features: [
        "Everything in Growth",
        "SSO & SAML integration",
        "Advanced security & compliance",
        "Custom integrations",
        "Dedicated success manager",
        "SLA guarantees",
        "On-premise deployment",
        "Custom contracts"
      ],
      cta: "Contact Sales",
      ctaVariant: "default" as const,
      popular: false,
      enterprise: true
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6">
            <Sparkles className="h-4 w-4 mr-2" />
            Trusted by 10,000+ teams
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Choose your{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              growth plan
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Start free and scale as you grow. Every plan includes our core features 
            to help you build better customer relationships.
          </p>

          <div className="flex justify-center mb-16">
            <PricingToggle isAnnual={isAnnual} onToggle={setIsAnnual} />
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan) => (
              <PricingCard
                key={plan.name}
                plan={plan}
                isAnnual={isAnnual}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <ROICalculator />

      {/* Feature Comparison */}
      <section className="py-24 px-4 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-muted-foreground">
              Compare plans and find the perfect fit for your team
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                AI-Powered Intelligence
              </h3>
              <p className="text-muted-foreground">
                Smart inbox automatically categorizes and prioritizes customer feedback, 
                saving hours of manual work every week.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Team Collaboration
              </h3>
              <p className="text-muted-foreground">
                Seamless workflows for Product, Marketing, and Customer Success teams 
                to collaborate on customer communication.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Enterprise Security
              </h3>
              <p className="text-muted-foreground">
                SOC 2 compliance, SSO integration, and advanced security features 
                to keep your data safe and secure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-foreground mb-12">
            Loved by teams everywhere
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-foreground mb-4">
                "Delyft has transformed how we communicate with customers. 
                Our engagement rates increased by 300%."
              </p>
              <div className="text-sm text-muted-foreground">
                Sarah Chen, Head of Product at TechFlow
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-foreground mb-4">
                "The AI categorization saves us 6+ hours every week. 
                It's like having an extra team member."
              </p>
              <div className="text-sm text-muted-foreground">
                Marcus Rodriguez, Customer Success at DataSync
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-foreground mb-4">
                "Finally, a tool that makes our release notes actually readable. 
                Customers love the new format."
              </p>
              <div className="text-sm text-muted-foreground">
                Emily Watson, Product Marketing at CloudBase
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-muted-foreground">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">10,000+</div>
              <div className="text-sm">Teams served</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">4.9/5</div>
              <div className="text-sm">Customer rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">6 hours</div>
              <div className="text-sm">Saved per week</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">99.9%</div>
              <div className="text-sm">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <PricingFAQ />

      {/* Final CTA */}
      <section className="py-24 px-4 bg-gradient-to-r from-primary/10 via-background to-primary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Ready to transform your customer communication?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of teams already using Delyft to build better customer relationships.
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-6 h-auto">
              Start Free Today
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
