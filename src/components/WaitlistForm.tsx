
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, CheckCircle, Sparkles, Gift } from "lucide-react";

interface WaitlistFormProps {
  onSuccess?: (email: string, referralCode: string) => void;
}

const WaitlistForm = ({ onSuccess }: WaitlistFormProps) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referredBy, setReferredBy] = useState<string | null>(null);
  const [userReferralCode, setUserReferralCode] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Check for referral code in URL
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
      setReferredBy(refCode);
    }

    // Get or generate user's own referral code
    let code = localStorage.getItem('delyft_referral_code');
    if (!code) {
      code = generateReferralCode();
      localStorage.setItem('delyft_referral_code', code);
    }
    setUserReferralCode(code);
  }, []);

  const generateReferralCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'DELYFT';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Insert subscriber with referral tracking
      const { error: subscriberError } = await supabase
        .from('subscribers')
        .insert([
          {
            email: email.toLowerCase().trim(),
            company_id: null,
            confirmed: false,
            metadata: role ? { role } : null,
            referral_code: userReferralCode,
            referred_by: referredBy,
          }
        ]);

      if (subscriberError) {
        if (subscriberError.code === '23505') {
          toast({
            title: "Already in the squad!",
            description: "You're already on our waitlist. We'll notify you when your AI agents are ready!",
          });
          setIsSubmitted(true);
          return;
        } else {
          throw subscriberError;
        }
      }

      // Create or update referral record for the new user
      await supabase
        .from('referrals')
        .upsert([
          {
            referral_code: userReferralCode,
            referrer_email: email.toLowerCase().trim(),
            total_credits: 0,
            total_referrals: 0
          }
        ]);

      // If referred by someone, update their credits - ENSURE 10 CREDITS ARE AWARDED
      if (referredBy) {
        const { data: referrerData } = await supabase
          .from('referrals')
          .select('*')
          .eq('referral_code', referredBy)
          .single();

        if (referrerData) {
          await supabase
            .from('referrals')
            .update({
              total_credits: referrerData.total_credits + 10, // Explicitly award 10 credits
              total_referrals: referrerData.total_referrals + 1,
              updated_at: new Date().toISOString()
            })
            .eq('referral_code', referredBy);
        }
      }

      setIsSubmitted(true);
      toast({
        title: "Welcome to your AI GTM squad!",
        description: referredBy 
          ? "You've joined via referral - your friend earned 10 credits! We'll be in touch soon."
          : "We'll be in touch soon with early access to your specialized agents.",
      });

      onSuccess?.(email, userReferralCode);

    } catch (error) {
      console.error('Waitlist signup error:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again or contact support if the problem persists.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="glass-card p-8 border-green-500/20 max-w-md mx-auto">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-green-400 mb-2">Your AI squad is assembling!</h3>
          <p className="text-muted-foreground mb-4">
            We'll send you early access details and agent use cases for your role soon.
          </p>
          {referredBy && (
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg mb-4">
              <div className="flex items-center justify-center space-x-2 text-primary">
                <Gift className="h-4 w-4" />
                <span className="text-sm font-medium">Your friend earned 10 credits!</span>
              </div>
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            Don't forget to share your referral link with friends to earn credits!
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 max-w-md mx-auto border-primary/20">
      {referredBy && (
        <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
          <div className="flex items-center space-x-2 text-primary">
            <Gift className="h-4 w-4" />
            <span className="text-sm font-medium">You were referred! Your friend will earn 10 credits.</span>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-background/50 border-white/[0.08] focus:border-primary/50 transition-colors"
            disabled={isLoading}
            required
          />
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="w-full sm:w-[180px] bg-background/50 border-white/[0.08] focus:border-primary/50">
              <SelectValue placeholder="Your role" />
            </SelectTrigger>
            <SelectContent className="bg-background border-white/[0.08]">
              <SelectItem value="pmm">Product Marketing Manager</SelectItem>
              <SelectItem value="csm">Customer Success Manager</SelectItem>
              <SelectItem value="content">Content Creator</SelectItem>
              <SelectItem value="pm">Product Manager</SelectItem>
              <SelectItem value="product-ops">Product Operations</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          type="submit" 
          size="lg" 
          disabled={isLoading}
          className="w-full button-glow bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-500/90 border-0 font-semibold transition-all duration-300"
        >
          {isLoading ? (
            <div className="flex items-center">
              <Sparkles className="mr-2 h-4 w-4 animate-spin" />
              Building Your AI Squad...
            </div>
          ) : (
            <div className="flex items-center">
              <Sparkles className="mr-2 h-4 w-4" />
              Build Your AI Squad
              <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          )}
        </Button>
      </div>
    </form>
  );
};

export default WaitlistForm;
