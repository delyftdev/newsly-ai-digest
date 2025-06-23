
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Zap, Target, TrendingUp, CheckCircle, Trophy } from "lucide-react";
import WaitlistForm from "@/components/WaitlistForm";
import SocialProofCounter from "@/components/SocialProofCounter";
import WhyJoinWaitlist from "@/components/WhyJoinWaitlist";
import ReferralSystem from "@/components/ReferralSystem";
import LeaderboardPanel from "@/components/LeaderboardPanel";

const Index = () => {
  const [submittedEmail, setSubmittedEmail] = useState<string>('');
  const [submittedReferralCode, setSubmittedReferralCode] = useState<string>('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const handleWaitlistSuccess = (email: string, referralCode: string) => {
    setSubmittedEmail(email);
    setSubmittedReferralCode(referralCode);
    setShowConfetti(true);
    
    // Hide confetti after 3 seconds
    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    // Scroll to referral section
    setTimeout(() => {
      const referralElement = document.querySelector('#referral-section');
      if (referralElement) {
        referralElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 500);
  };

  const scrollToForm = () => {
    const formElement = document.querySelector('#waitlist-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="border-b border-white/[0.08] backdrop-blur-xl bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div>
                <h1 className="text-xl font-bold text-white">Delyft</h1>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={() => setShowLeaderboard(true)}
              className="text-white hover:bg-white/[0.05] flex items-center space-x-2"
            >
              <Trophy className="h-4 w-4" />
              <span>Top Referrers</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Leaderboard Panel */}
      <LeaderboardPanel open={showLeaderboard} onOpenChange={setShowLeaderboard} />

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="confetti-animation">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="confetti-piece"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-cyan-500/10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <div className="relative max-w-4xl mx-auto text-center">
          <SocialProofCounter />
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
            Deploy Your AI GTM Squad:{" "}
            <span className="bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
              4 Specialized Agents
            </span>{" "}
            That Launch Features 10X Faster
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Content, publishing, personalization and feedback automation - working in sync while you sleep
          </p>

          <div id="waitlist-form">
            <WaitlistForm onSuccess={handleWaitlistSuccess} />
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-400"  />
              <span>Early access guaranteed</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              4 Specialized Agents Working in Perfect Sync
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Each agent handles a specific part of your GTM workflow, seamlessly passing work to the next.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Bot,
                title: "Content Agent",
                description: "From spec to polished changelog in 90 seconds"
              },
              {
                icon: Target,
                title: "Publish Agent", 
                description: "Customer-branded widgets that deploy with 1 click"
              },
              {
                icon: Zap,
                title: "Outreach Agent",
                description: "CRM-powered emails drafted before your coffee brews"
              },
              {
                icon: TrendingUp,
                title: "Feedback Agent",
                description: "AI powered sentiment analysis on feedback"
              }
            ].map((feature, index) => (
              <div key={index} className="glass-card p-6 border-white/[0.08] hover:border-primary/30 transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-cyan-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Join Waitlist Section */}
      <WhyJoinWaitlist />

      {/* Referral System */}
      <div id="referral-section">
        <ReferralSystem 
          email={submittedEmail} 
          onReferralGenerated={(code) => setSubmittedReferralCode(code)}
        />
      </div>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card p-12 border-primary/20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to 10X Your GTM Velocity?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of GTM professionals building their AI squad. Get early access, exclusive rewards, and start earning credits today.
            </p>
            {!submittedEmail && (
              <Button 
                size="lg" 
                className="button-glow bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-500/90 border-0"
                onClick={scrollToForm}
              >
                <span className="mr-2">Join the Waitlist</span>
                <ArrowRight className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div>
                <span className="text-white font-semibold">Delyft</span>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-muted-foreground text-sm">
                © 2024 Delyft. All rights reserved.
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                Building the future of AI-powered GTM workflows
              </p>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        .confetti-animation {
          position: relative;
          width: 100%;
          height: 100%;
        }
        
        .confetti-piece {
          position: absolute;
          width: 10px;
          height: 10px;
          animation: confetti-fall 3s linear forwards;
        }
        
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Index;
