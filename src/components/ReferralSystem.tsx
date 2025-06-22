
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Copy, Facebook, Twitter, Linkedin, MessageCircle, Share2, Coins } from 'lucide-react';

interface ReferralSystemProps {
  email?: string;
  onReferralGenerated?: (code: string) => void;
}

const ReferralSystem = ({ email, onReferralGenerated }: ReferralSystemProps) => {
  const [referralCode, setReferralCode] = useState('');
  const [credits, setCredits] = useState(0);
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const initializeReferral = async () => {
      let code = localStorage.getItem('delyft_referral_code');
      
      if (!code) {
        // Generate new referral code
        code = generateReferralCode();
        localStorage.setItem('delyft_referral_code', code);
      }
      
      setReferralCode(code);
      
      if (email) {
        await fetchOrCreateReferralData(email, code);
      }
    };

    initializeReferral();
  }, [email]);

  const generateReferralCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'DELYFT';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const fetchOrCreateReferralData = async (userEmail: string, code: string) => {
    try {
      const { data, error } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_email', userEmail)
        .single();

      if (error && error.code === 'PGRST116') {
        // Create new referral record
        const { error: insertError } = await supabase
          .from('referrals')
          .insert([{
            referral_code: code,
            referrer_email: userEmail,
            total_credits: 0,
            total_referrals: 0
          }]);

        if (!insertError) {
          setCredits(0);
          setTotalReferrals(0);
        }
      } else if (data) {
        setCredits(data.total_credits);
        setTotalReferrals(data.total_referrals);
        setReferralCode(data.referral_code);
      }
    } catch (error) {
      console.error('Error handling referral data:', error);
    }
  };

  const referralUrl = `${window.location.origin}?ref=${referralCode}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      toast({
        title: "Referral link copied!",
        description: "Share it with friends to earn credits",
      });
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: "Copy failed",
        description: "Please manually copy the link",
        variant: "destructive",
      });
    }
  };

  const shareOnSocial = (platform: string) => {
    const message = `Join me on Delyft's AI GTM Squad waitlist! Get early access to AI agents that automate your marketing workflows. ${referralUrl}`;
    const encodedMessage = encodeURIComponent(message);
    const encodedUrl = encodeURIComponent(referralUrl);

    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedMessage}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedMessage}`
    };

    window.open(urls[platform as keyof typeof urls], '_blank', 'width=600,height=400');
  };

  if (!referralCode) return null;

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Tell Your Friends & Earn Credits
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Share your referral link and earn 10 credits for each friend who joins. 
            Credits = future savings on your Delyft subscription!
          </p>
        </div>

        {/* Stats Display */}
        {email && (
          <div className="flex justify-center space-x-8 mb-8">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Coins className="h-5 w-5 text-yellow-400" />
                <span className="text-2xl font-bold text-white">{credits}</span>
              </div>
              <p className="text-sm text-muted-foreground">Credits Earned</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Share2 className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold text-white">{totalReferrals}</span>
              </div>
              <p className="text-sm text-muted-foreground">Friends Referred</p>
            </div>
          </div>
        )}

        <div className="glass-card p-8 border-primary/20 max-w-2xl mx-auto">
          {/* Referral Link */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-2">
              Your Referral Link
            </label>
            <div className="flex space-x-2">
              <Input
                value={referralUrl}
                readOnly
                className="bg-background/50 border-white/[0.08] text-white"
              />
              <Button
                onClick={copyToClipboard}
                variant="outline"
                className="border-white/[0.08] hover:bg-white/[0.05]"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="space-y-4">
            <p className="text-center text-muted-foreground">Share on social media:</p>
            <div className="flex justify-center space-x-4">
              <Button
                onClick={() => shareOnSocial('facebook')}
                variant="outline"
                size="lg"
                className="border-blue-500/50 hover:bg-blue-500/10 text-blue-400"
              >
                <Facebook className="h-5 w-5" />
              </Button>
              <Button
                onClick={() => shareOnSocial('twitter')}
                variant="outline"
                size="lg"
                className="border-sky-500/50 hover:bg-sky-500/10 text-sky-400"
              >
                <Twitter className="h-5 w-5" />
              </Button>
              <Button
                onClick={() => shareOnSocial('linkedin')}
                variant="outline"
                size="lg"
                className="border-blue-600/50 hover:bg-blue-600/10 text-blue-300"
              >
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button
                onClick={() => shareOnSocial('whatsapp')}
                variant="outline"
                size="lg"
                className="border-green-500/50 hover:bg-green-500/10 text-green-400"
              >
                <MessageCircle className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {!email && (
            <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-sm text-center text-primary">
                💡 Join the waitlist to track your referrals and credits!
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ReferralSystem;
