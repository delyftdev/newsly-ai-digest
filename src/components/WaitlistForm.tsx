
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, CheckCircle, Sparkles } from "lucide-react";

const WaitlistForm = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

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
      const { error } = await supabase
        .from('subscribers')
        .insert([
          {
            email: email.toLowerCase().trim(),
            company_id: null,
            confirmed: false,
            metadata: role ? { role } : null,
          }
        ]);

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Already in the squad!",
            description: "You're already on our waitlist. We'll notify you when your AI agents are ready!",
          });
        } else {
          throw error;
        }
      } else {
        setIsSubmitted(true);
        toast({
          title: "Welcome to your AI GTM squad!",
          description: "We'll be in touch soon with early access to your specialized agents.",
        });
      }
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
          <p className="text-muted-foreground">
            We'll send you early access details and agent use cases for your role soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 max-w-md mx-auto border-primary/20">
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
