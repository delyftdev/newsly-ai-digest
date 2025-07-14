
import { Button } from "@/components/ui/button";

interface PricingToggleProps {
  isAnnual: boolean;
  onToggle: (isAnnual: boolean) => void;
}

const PricingToggle = ({ isAnnual, onToggle }: PricingToggleProps) => {
  return (
    <div className="flex items-center space-x-1 bg-muted p-1 rounded-full">
      <Button
        variant={!isAnnual ? "default" : "ghost"}
        size="sm"
        onClick={() => onToggle(false)}
        className={`rounded-full px-6 transition-all ${
          !isAnnual ? 'bg-primary text-primary-foreground' : 'hover:bg-transparent'
        }`}
      >
        Monthly
      </Button>
      <Button
        variant={isAnnual ? "default" : "ghost"}
        size="sm"
        onClick={() => onToggle(true)}
        className={`rounded-full px-6 transition-all relative ${
          isAnnual ? 'bg-primary text-primary-foreground' : 'hover:bg-transparent'
        }`}
      >
        Annual
        <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
          Save 20%
        </span>
      </Button>
    </div>
  );
};

export default PricingToggle;
