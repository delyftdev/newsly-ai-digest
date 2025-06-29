
import React from 'react';
import { Crown, Trophy, Medal, Zap, Gift, Clock } from 'lucide-react';

const WhyJoinWaitlist = () => {
  const benefits = [
    {
      icon: Crown,
      title: "Top Referrer",
      reward: "Delyft Free Forever",
      description: "Get lifetime access to all AI agents",
      gradient: "from-yellow-400 to-orange-500",
      rank: "#1"
    },
    {
      icon: Trophy,
      title: "Top 5 Referrers", 
      reward: "1 Year Free Subscription",
      description: "Full platform access for 12 months",
      gradient: "from-purple-400 to-pink-500",
      rank: "Top 5"
    },
    {
      icon: Medal,
      title: "Top 10 Referrers",
      reward: "6 Months Free Subscription", 
      description: "Half year of premium features",
      gradient: "from-blue-400 to-cyan-500",
      rank: "Top 10"
    }
  ];

  const universalBenefits = [
    {
      icon: Zap,
      title: "Early Access",
      description: "Be first to access AI agents when we launch"
    },
    {
      icon: Gift,
      title: "Exclusive Discounts",
      description: "Special pricing and perks for waitlist members"
    },
    {
      icon: Clock,
      title: "Priority Support",
      description: "Get faster support and feature requests"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Exclusive Referral Rewards
        </h3>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Get exclusive rewards, early access, and build your credit balance before launch
        </p>
      </div>

      {/* Referral Rewards */}
      <div className="grid md:grid-cols-3 gap-6">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="glass-card p-6 border-white/[0.08] hover:border-white/[0.16] transition-all duration-300 group relative overflow-hidden rounded-xl"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
            <div className="relative z-10">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <benefit.icon className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-white">{benefit.title}</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${benefit.gradient} text-white`}>
                  {benefit.rank}
                </span>
              </div>
              <p className={`text-lg font-bold bg-gradient-to-r ${benefit.gradient} bg-clip-text text-transparent mb-3`}>
                {benefit.reward}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Universal Benefits */}
      <div className="glass-card p-8 border-primary/20 rounded-xl">
        <h4 className="text-2xl font-bold text-white mb-8 text-center">
          Every Waitlist Member Gets
        </h4>
        <div className="grid md:grid-cols-3 gap-8">
          {universalBenefits.map((benefit, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-cyan-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <benefit.icon className="h-8 w-8 text-primary" />
              </div>
              <h5 className="text-lg font-semibold text-white mb-3">{benefit.title}</h5>
              <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Credits System Hint */}
      <div className="text-center p-6 glass-card border-cyan-500/20 rounded-xl">
        <p className="text-cyan-400 font-medium mb-3 text-lg">💡 Pro Tip</p>
        <p className="text-muted-foreground leading-relaxed">
          Delyft will work on a credit-based system. Grab as many credits as you can now - 
          they'll be in your account when you sign up with your waitlist email!
        </p>
      </div>
    </div>
  );
};

export default WhyJoinWaitlist;
