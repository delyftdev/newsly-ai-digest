
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, CheckCircle } from "lucide-react";

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
      <div className="flex flex-col items-center justify-center p-8 bg-green-50 rounded-lg border border-green-200">
        <CheckCircle className="h-12 w-12 text-green-600 mb-4" />
        <h3 className="text-lg font-semibold text-green-800 mb-2">Your AI squad is assembling!</h3>
        <p className="text-green-700 text-center">
          We'll send you early access details and agent use cases for your role soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md w-full">
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1"
          disabled={isLoading}
          required
        />
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Your role" />
          </SelectTrigger>
          <SelectContent>
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
        className="bg-blue-600 hover:bg-blue-700 w-full"
      >
        {isLoading ? (
          "Building Your AI Squad..."
        ) : (
          <>
            Build Your AI Squad
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
};

export default WaitlistForm;
