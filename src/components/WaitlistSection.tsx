
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trophy, Users } from "lucide-react";
import WaitlistForm from "@/components/WaitlistForm";
import SocialProofCounter from "@/components/SocialProofCounter";
import WhyJoinWaitlist from "@/components/WhyJoinWaitlist";
import ReferralSystem from "@/components/ReferralSystem";
import LeaderboardPanel from "@/components/LeaderboardPanel";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface WaitlistSectionProps {
  submittedEmail: string;
  submittedReferralCode: string;
  onWaitlistSuccess: (email: string, referralCode: string) => void;
}

const WaitlistSection = ({ submittedEmail, submittedReferralCode, onWaitlistSuccess }: WaitlistSectionProps) => {
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  return (
    <section id="waitlist-section" className="py-20 px-4 bg-accent/20">
      <div className="max-w-4xl mx-auto text-center">
        <SocialProofCounter />
        
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Join the waitlist
        </h2>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Get early access to delyft and start building better customer relationships
        </p>

        <div className="flex items-center justify-center space-x-4 mb-8">
          <WaitlistForm onSuccess={onWaitlistSuccess} />
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                Why Join?
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Why Join Our Waitlist?</SheetTitle>
                <SheetDescription>
                  Get exclusive early access and special benefits
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <WhyJoinWaitlist />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLeaderboard(true)}
            className="flex items-center space-x-2"
          >
            <Trophy className="h-4 w-4" />
            <span>Top Referrers</span>
          </Button>
        </div>

        <LeaderboardPanel open={showLeaderboard} onOpenChange={setShowLeaderboard} />

        <div id="referral-section" className="mt-12">
          <ReferralSystem 
            email={submittedEmail} 
            onReferralGenerated={(code) => {}}
          />
        </div>
      </div>
    </section>
  );
};

export default WaitlistSection;
