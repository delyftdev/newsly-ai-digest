
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ValuePropsSection from "@/components/ValuePropsSection";
import IntegrationsSection from "@/components/IntegrationsSection";
import WaitlistSection from "@/components/WaitlistSection";
import DelyftLogo from "@/components/DelyftLogo";

const Index = () => {
  const [submittedEmail, setSubmittedEmail] = useState<string>('');
  const [submittedReferralCode, setSubmittedReferralCode] = useState<string>('');
  const [showConfetti, setShowConfetti] = useState(false);

  const handleWaitlistSuccess = (email: string, referralCode: string) => {
    setSubmittedEmail(email);
    setSubmittedReferralCode(referralCode);
    setShowConfetti(true);
    
    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    setTimeout(() => {
      const waitlistElement = document.querySelector('#waitlist-section');
      if (waitlistElement) {
        waitlistElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 500);
  };

  const scrollToWaitlist = () => {
    const waitlistElement = document.querySelector('#waitlist-section');
    if (waitlistElement) {
      waitlistElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

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
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-foreground mb-6 leading-tight">
            Your shortcut to{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              customer-focused releases
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Create feedback loops, personalized changelogs, and track engagement — all in one place
          </p>

          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 mb-8"
            onClick={scrollToWaitlist}
          >
            <span className="mr-2">Get Early Access</span>
            <ArrowRight className="h-5 w-5" />
          </Button>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span>Early access guaranteed</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions Section */}
      <ValuePropsSection />

      {/* Integrations Section */}
      <IntegrationsSection />

      {/* Waitlist Section */}
      <WaitlistSection 
        submittedEmail={submittedEmail}
        submittedReferralCode={submittedReferralCode}
        onWaitlistSuccess={handleWaitlistSuccess}
      />

      <Footer />

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
