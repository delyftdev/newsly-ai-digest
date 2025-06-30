
import React from 'react';
import { Zap, Gift, Clock } from 'lucide-react';

const WhyJoinWaitlist = () => {
  const benefits = [
    {
      icon: Zap,
      title: "Early Access",
      description: "Be first to access new features when we launch"
    },
    {
      icon: Gift,
      title: "Exclusive Discounts",
      description: "Special pricing and perks for beta members"
    },
    {
      icon: Clock,
      title: "Priority Support",
      description: "Get faster support and direct feedback channels"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Why Join Our Beta?
        </h3>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Get exclusive access to delyft and help shape the future of customer communication
        </p>
      </div>

      {/* Beta Benefits */}
      <div className="grid md:grid-cols-3 gap-8">
        {benefits.map((benefit, index) => (
          <div key={index} className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-cyan-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <benefit.icon className="h-8 w-8 text-primary" />
            </div>
            <h5 className="text-lg font-semibold text-white mb-3">{benefit.title}</h5>
            <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
          </div>
        ))}
      </div>

      {/* Simple call to action */}
      <div className="text-center p-6 glass-card border-primary/20 rounded-xl">
        <p className="text-primary font-medium mb-3 text-lg">🚀 Ready to get started?</p>
        <p className="text-muted-foreground leading-relaxed">
          Join thousands of product teams who are already transforming their customer communication workflow.
        </p>
      </div>
    </div>
  );
};

export default WhyJoinWaitlist;
