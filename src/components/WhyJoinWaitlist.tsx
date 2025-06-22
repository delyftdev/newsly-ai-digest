
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
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Join the Waitlist?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get exclusive rewards, early access, and build your credit balance before launch
          </p>
        </div>

        {/* Referral Rewards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="glass-card p-6 border-white/[0.08] hover:border-white/[0.16] transition-all duration-300 group relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <benefit.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white">{benefit.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${benefit.gradient} text-white`}>
                    {benefit.rank}
                  </span>
                </div>
                <p className={`text-lg font-bold bg-gradient-to-r ${benefit.gradient} bg-clip-text text-transparent mb-2`}>
                  {benefit.reward}
                </p>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Universal Benefits */}
        <div className="glass-card p-8 border-primary/20">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            Every Waitlist Member Gets
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {universalBenefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-cyan-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">{benefit.title}</h4>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Credits System Hint */}
        <div className="text-center mt-8 p-6 glass-card border-cyan-500/20">
          <p className="text-cyan-400 font-medium mb-2">💡 Pro Tip</p>
          <p className="text-muted-foreground">
            Delyft will work on a credit-based system. Grab as many credits as you can now - 
            they'll be in your account when you sign up with your waitlist email!
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyJoinWaitlist;
