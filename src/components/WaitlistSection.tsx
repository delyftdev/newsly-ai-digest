
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import WaitlistForm from "@/components/WaitlistForm";
import SocialProofCounter from "@/components/SocialProofCounter";
import WhyJoinWaitlist from "@/components/WhyJoinWaitlist";
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
    <section id="waitlist-section" className="py-24 px-4 bg-accent/20">
      <div className="max-w-5xl mx-auto text-center">
        <SocialProofCounter />
        
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          Get early access
        </h2>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
          Join thousands of product teams already transforming their customer communication
        </p>

        <div className="flex flex-col items-center space-y-6 mb-12">
          <WaitlistForm onSuccess={onWaitlistSuccess} />
          
          <div className="flex flex-col items-center space-y-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="lg" className="min-w-[160px]">
                  Why Join Beta?
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-2xl lg:max-w-4xl">
                <SheetHeader className="mb-6">
                  <SheetTitle className="text-2xl">Join Our Beta Program</SheetTitle>
                  <SheetDescription className="text-lg">
                    Get exclusive early access and special benefits
                  </SheetDescription>
                </SheetHeader>
                <div className="overflow-y-auto max-h-[80vh]">
                  <WhyJoinWaitlist />
                </div>
              </SheetContent>
            </Sheet>

            <Button
              variant="ghost"
              size="lg"
              onClick={() => setShowLeaderboard(true)}
              className="flex items-center space-x-2 text-base"
            >
              <Trophy className="h-5 w-5" />
              <span>View Top Referrers</span>
            </Button>
          </div>
        </div>

        <LeaderboardPanel open={showLeaderboard} onOpenChange={setShowLeaderboard} />
      </div>
    </section>
  );
};

export default WaitlistSection;
