
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface PricingCardProps {
  plan: {
    name: string;
    price: { monthly: number | string; annual: number | string };
    perUser?: { monthly: number; annual: number };
    description: string;
    features: string[];
    cta: string;
    ctaVariant: "default" | "outline";
    popular: boolean;
    enterprise?: boolean;
    savings?: string;
  };
  isAnnual: boolean;
}

const PricingCard = ({ plan, isAnnual }: PricingCardProps) => {
  const getPrice = () => {
    if (typeof plan.price.monthly === "string") return plan.price.monthly;
    return isAnnual ? plan.price.annual : plan.price.monthly;
  };

  const getPerUserPrice = () => {
    if (!plan.perUser) return null;
    return isAnnual ? plan.perUser.annual : plan.perUser.monthly;
  };

  const getSavings = () => {
    if (!plan.perUser || typeof plan.price.monthly === "string") return null;
    const monthlyTotal = (plan.price.monthly as number) + (plan.perUser.monthly * 3); // Assuming 3 users
    const annualTotal = ((plan.price.annual as number) + (plan.perUser.annual * 3)) * 12;
    const yearlySavings = (monthlyTotal * 12) - annualTotal;
    return Math.round((yearlySavings / (monthlyTotal * 12)) * 100);
  };

  return (
    <div className={`relative bg-card border rounded-2xl p-8 transition-all duration-300 hover:shadow-xl hover:scale-105 ${
      plan.popular ? 'border-primary shadow-lg ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
    }`}>
      {plan.popular && (
        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
          <Sparkles className="h-3 w-3 mr-1" />
          Most Popular
        </Badge>
      )}

      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
        <p className="text-muted-foreground mb-6">{plan.description}</p>
        
        <div className="mb-4">
          <span className="text-4xl font-bold text-foreground">
            {typeof getPrice() === "string" ? getPrice() : `$${getPrice()}`}
          </span>
          {typeof getPrice() !== "string" && (
            <span className="text-muted-foreground">/{isAnnual ? 'year' : 'month'}</span>
          )}
        </div>

        {getPerUserPrice() && (
          <div className="text-sm text-muted-foreground mb-4">
            + ${getPerUserPrice()}/user/{isAnnual ? 'year' : 'month'}
          </div>
        )}

        {isAnnual && getSavings() && (
          <Badge variant="secondary" className="mb-4">
            Save {getSavings()}% annually
          </Badge>
        )}

        {plan.savings && (
          <div className="text-sm text-primary font-medium mb-4">
            {plan.savings}
          </div>
        )}
      </div>

      <div className="space-y-4 mb-8">
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-start space-x-3">
            <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <span className="text-foreground">{feature}</span>
          </div>
        ))}
      </div>

      <Link to={plan.enterprise ? "/contact" : "/auth"} className="block">
        <Button 
          variant={plan.ctaVariant} 
          className={`w-full h-12 text-base font-medium ${
            plan.popular ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : ''
          }`}
        >
          {plan.cta}
        </Button>
      </Link>
    </div>
  );
};

export default PricingCard;
