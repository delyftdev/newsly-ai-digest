
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useCompanyStore } from "@/stores/companyStore";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Building, Users, Palette, CheckCircle } from "lucide-react";

interface OnboardingData {
  companyName: string;
  teamSize: string;
  industry: string;
  fullName: string;
  primaryColor: string;
  logoUrl: string;
}

const OnboardingPage = () => {
  const { user } = useAuthStore();
  const { updateCompany, updateBranding } = useCompanyStore();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    companyName: "",
    teamSize: "",
    industry: "",
    fullName: "",
    primaryColor: "#3B82F6",
    logoUrl: "",
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    // Pre-fill user's name if available
    if (user.user_metadata?.full_name) {
      setData(prev => ({ ...prev, fullName: user.user_metadata.full_name }));
    }
  }, [user, navigate]);

  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(data.companyName && data.teamSize && data.industry && data.fullName);
      case 2:
        return true; // Optional step
      case 3:
        return true; // Optional step
      default:
        return true;
    }
  };

  const handleNextStep = async () => {
    if (!validateStep(currentStep)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      await completeOnboarding();
    }
  };

  const completeOnboarding = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: data.fullName,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
        toast({
          title: "Error",
          description: "Failed to update profile",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Get user's company from profile
      const { data: profile, error: profileFetchError } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (profileFetchError || !profile?.company_id) {
        // Create company if it doesn't exist
        const { data: newCompany, error: companyCreateError } = await supabase
          .from('companies')
          .insert({
            name: data.companyName,
            team_size: data.teamSize,
            industry: data.industry,
            logo_url: data.logoUrl || null,
            subdomain: `company-${Date.now()}`,
            primary_color: data.primaryColor,
          })
          .select()
          .single();

        if (companyCreateError || !newCompany) {
          console.error('Company creation error:', companyCreateError);
          toast({
            title: "Error",
            description: "Failed to create company",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        // Update profile with company_id
        await supabase
          .from('profiles')
          .update({ company_id: newCompany.id })
          .eq('id', user.id);

        // Create team member record
        await supabase
          .from('team_members')
          .insert({
            company_id: newCompany.id,
            user_id: user.id,
            role: 'admin',
            status: 'active',
            joined_at: new Date().toISOString(),
          });

        // Create branding record
        await supabase
          .from('branding')
          .insert({
            company_id: newCompany.id,
            primary_color: data.primaryColor,
          });

        profile.company_id = newCompany.id;
      } else {
        // Update existing company
        await updateCompany({
          name: data.companyName,
          team_size: data.teamSize,
          industry: data.industry,
          logo_url: data.logoUrl || null,
          primary_color: data.primaryColor,
        });

        // Update branding
        await updateBranding({
          primary_color: data.primaryColor,
        });
      }

      // Mark onboarding as completed
      await supabase
        .from('onboarding_progress')
        .update({
          completed_at: new Date().toISOString(),
          company_info_completed: true,
          branding_completed: true,
          current_step: 4,
          completed_steps: [1, 2, 3],
        })
        .eq('user_id', user.id);

      toast({
        title: "Welcome aboard!",
        description: "Your account has been set up successfully",
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Onboarding completion error:', error);
      toast({
        title: "Error",
        description: "Failed to complete onboarding",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { title: "Company Info", icon: Building },
    { title: "Team Setup", icon: Users },
    { title: "Branding", icon: Palette },
  ];

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Release Hub</h1>
          <p className="text-gray-600">Let's set up your account in a few simple steps</p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  index + 1 <= currentStep ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1 < currentStep ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    index + 1 < currentStep ? 'bg-primary' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <steps[currentStep - 1].icon className="w-5 h-5" />
              Step {currentStep}: {steps[currentStep - 1].title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Your Full Name *</Label>
                    <Input
                      id="fullName"
                      value={data.fullName}
                      onChange={(e) => updateData({ fullName: e.target.value })}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={data.companyName}
                      onChange={(e) => updateData({ companyName: e.target.value })}
                      placeholder="Acme Corp"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="teamSize">Team Size *</Label>
                    <Select value={data.teamSize} onValueChange={(value) => updateData({ teamSize: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select team size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-5">1-5 people</SelectItem>
                        <SelectItem value="6-20">6-20 people</SelectItem>
                        <SelectItem value="21-50">21-50 people</SelectItem>
                        <SelectItem value="51-200">51-200 people</SelectItem>
                        <SelectItem value="200+">200+ people</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="industry">Industry *</Label>
                    <Select value={data.industry} onValueChange={(value) => updateData({ industry: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="saas">SaaS</SelectItem>
                        <SelectItem value="ecommerce">E-commerce</SelectItem>
                        <SelectItem value="fintech">Fintech</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <div className="text-center space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Team Collaboration</h3>
                  <p className="text-gray-600">
                    You can invite team members later from the settings page. For now, you'll be set up as the admin.
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Tip:</strong> Invite your team members after completing setup to collaborate on releases and changelogs.
                  </p>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <>
                <div>
                  <Label htmlFor="logoUrl">Company Logo URL (Optional)</Label>
                  <Input
                    id="logoUrl"
                    value={data.logoUrl}
                    onChange={(e) => updateData({ logoUrl: e.target.value })}
                    placeholder="https://example.com/logo.png"
                    type="url"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    You can upload a logo later or provide a URL to your company logo
                  </p>
                </div>
                <div>
                  <Label htmlFor="primaryColor">Primary Brand Color</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={data.primaryColor}
                      onChange={(e) => updateData({ primaryColor: e.target.value })}
                      className="w-16 h-10 p-1 rounded"
                    />
                    <Input
                      value={data.primaryColor}
                      onChange={(e) => updateData({ primaryColor: e.target.value })}
                      placeholder="#3B82F6"
                      className="flex-1"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              <Button
                onClick={handleNextStep}
                disabled={isLoading}
              >
                {isLoading ? (
                  "Setting up..."
                ) : currentStep === 3 ? (
                  "Complete Setup"
                ) : (
                  "Next Step"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingPage;
