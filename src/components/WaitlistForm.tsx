
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
      console.log('Referral code detected from URL:', refCode);
    }
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
      console.log('Starting waitlist signup process...');
      console.log('Email:', email);
      console.log('Referred by:', referredBy);

      // Generate referral code only after successful signup
      const newUserReferralCode = generateReferralCode();
      console.log('Generated referral code:', newUserReferralCode);

      // Insert subscriber with referral tracking
      const { error: subscriberError } = await supabase
        .from('subscribers')
        .insert([
          {
            email: email.toLowerCase().trim(),
            company_id: null,
            confirmed: false,
            metadata: role ? { role } : null,
            referral_code: newUserReferralCode,
            referred_by: referredBy,
          }
        ]);

      if (subscriberError) {
        if (subscriberError.code === '23505') {
          toast({
            title: "Already joined!",
            description: "You're already on our waitlist. We'll notify you when we're ready!",
          });
          setIsSubmitted(true);
          return;
        } else {
          throw subscriberError;
        }
      }

      console.log('Successfully added subscriber to waitlist');

      // Create referral record for the new user AFTER successful signup
      const { error: newUserReferralError } = await supabase
        .from('referrals')
        .upsert([
          {
            referral_code: newUserReferralCode,
            referrer_email: email.toLowerCase().trim(),
            total_credits: 0,
            total_referrals: 0
          }
        ]);

      if (newUserReferralError) {
        console.error('Failed to create referral record for new user:', newUserReferralError);
      } else {
        console.log('Successfully created referral record for new user');
        // Store the referral code in localStorage
        localStorage.setItem('delyft_referral_code', newUserReferralCode);
        setUserReferralCode(newUserReferralCode);
      }

      // If referred by someone, award them credits
      if (referredBy) {
        console.log('Processing referral credit for:', referredBy);
        
        // First check if the referrer exists
        const { data: referrerData, error: referrerCheckError } = await supabase
          .from('referrals')
          .select('*')
          .eq('referral_code', referredBy)
          .single();

        if (referrerCheckError) {
          console.error('Referrer not found or error checking referrer:', referrerCheckError);
          toast({
            title: "Invalid referral code",
            description: "The referral code you used is not valid, but you've still been added to the waitlist!",
          });
        } else if (referrerData) {
          console.log('Found referrer:', referrerData);
          
          // Award 10 credits to the referrer
          const { error: creditError } = await supabase
            .from('referrals')
            .update({
              total_credits: referrerData.total_credits + 10,
              total_referrals: referrerData.total_referrals + 1,
              updated_at: new Date().toISOString()
            })
            .eq('referral_code', referredBy);

          if (creditError) {
            console.error('Failed to award credits to referrer:', creditError);
          } else {
            console.log('Successfully awarded 10 credits to referrer');
          }
        }
      }

      setIsSubmitted(true);
      toast({
        title: "Welcome to the beta!",
        description: referredBy 
          ? "You've joined via referral - your friend earned 10 credits! We'll be in touch soon."
          : "We'll be in touch soon with early access to your specialized agents.",
      });

      onSuccess?.(email, newUserReferralCode);

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
          <h3 className="text-xl font-semibold text-green-400 mb-2">You're in!</h3>
          <p className="text-muted-foreground mb-4">
            We'll send you early access details soon.
          </p>
          {referredBy && (
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg mb-4">
              <div className="flex items-center justify-center space-x-2 text-primary">
                <Gift className="h-4 w-4" />
                <span className="text-sm font-medium">Your friend earned 10 credits!</span>
              </div>
            </div>
          )}
          <p className="text-sm text-primary font-medium">
            🎉 Your referral code is ready! Scroll down to start sharing and earning credits.
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
              Joining Beta...
            </div>
          ) : (
            <div className="flex items-center">
              <Sparkles className="mr-2 h-4 w-4" />
              Join Beta
              <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          )}
        </Button>
      </div>
    </form>
  );
};

export default WaitlistForm;
