
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Upload, Plus, Check } from "lucide-react";
import { useCompanyStore } from "@/stores/companyStore";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
}

const STEPS: OnboardingStep[] = [
  { id: 1, title: "Company Information", description: "Tell us about your company" },
  { id: 2, title: "Team Invitations", description: "Invite your team members" },
  { id: 3, title: "Domain & Logo", description: "Set up your branding" },
  { id: 4, title: "Theme Customization", description: "Customize your appearance" },
  { id: 5, title: "Setup Complete", description: "You're all set!" }
];

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [companyData, setCompanyData] = useState({
    name: "",
    team_size: "",
    industry: "",
    domain: "",
    logo_url: ""
  });
  const [userRole, setUserRole] = useState("");
  const [teamInvites, setTeamInvites] = useState([{ email: "", role: "viewer" }]);
  const [colors, setColors] = useState({
    primary_color: "#3B82F6",
    secondary_color: "#6B7280"
  });
  const [fontFamily, setFontFamily] = useState("Inter");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { company, updateCompany, updateBranding } = useCompanyStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    // Check if onboarding is already complete
    const checkOnboardingStatus = async () => {
      const { data } = await supabase
        .from('onboarding_progress')
        .select('completed_at')
        .eq('user_id', user.id)
        .single();
      
      if (data?.completed_at) {
        navigate('/dashboard');
      }
    };
    
    checkOnboardingStatus();
  }, [user, navigate]);

  const handleCompanyInfoSubmit = async () => {
    if (!companyData.name || !companyData.team_size || !companyData.industry || !userRole) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      await updateCompany({
        name: companyData.name,
        team_size: companyData.team_size,
        industry: companyData.industry
      });

      // Update user profile with role
      await supabase
        .from('profiles')
        .update({ role: userRole })
        .eq('id', user?.id);

      await supabase
        .from('onboarding_progress')
        .update({ 
          company_info_completed: true,
          current_step: 2,
          completed_steps: [1]
        })
        .eq('user_id', user?.id);

      setCurrentStep(2);
      toast({ title: "Company information saved!" });
    } catch (error) {
      toast({ title: "Error saving company information", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTeamInvites = async () => {
    setIsLoading(true);
    try {
      const validInvites = teamInvites.filter(invite => invite.email && invite.email.includes('@'));
      
      if (validInvites.length > 0) {
        for (const invite of validInvites) {
          await supabase
            .from('team_invitations')
            .insert({
              company_id: company?.id,
              email: invite.email,
              role: invite.role,
              invited_by: user?.id
            });
        }
        toast({ title: `${validInvites.length} team invitations sent!` });
      }

      await supabase
        .from('onboarding_progress')
        .update({ 
          team_setup_completed: true,
          current_step: 3,
          completed_steps: [1, 2]
        })
        .eq('user_id', user?.id);

      setCurrentStep(3);
    } catch (error) {
      toast({ title: "Error sending invitations", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDomainSetup = async () => {
    setIsLoading(true);
    try {
      const slug = companyData.domain ? 
        companyData.domain.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase() :
        company?.name?.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();

      await updateCompany({
        domain: companyData.domain,
        logo_url: companyData.logo_url,
        slug: slug
      });

      await supabase
        .from('onboarding_progress')
        .update({ 
          domain_setup_completed: true,
          current_step: 4,
          completed_steps: [1, 2, 3]
        })
        .eq('user_id', user?.id);

      setCurrentStep(4);
      toast({ title: "Domain and logo setup complete!" });
    } catch (error) {
      toast({ title: "Error saving domain setup", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleThemeCustomization = async () => {
    setIsLoading(true);
    try {
      await updateBranding({
        primary_color: colors.primary_color,
        secondary_color: colors.secondary_color,
        font_family: fontFamily
      });

      await supabase
        .from('onboarding_progress')
        .update({ 
          branding_completed: true,
          current_step: 5,
          completed_steps: [1, 2, 3, 4]
        })
        .eq('user_id', user?.id);

      setCurrentStep(5);
      toast({ title: "Theme customization saved!" });
    } catch (error) {
      toast({ title: "Error saving theme", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const completeOnboarding = async () => {
    setIsLoading(true);
    try {
      await supabase
        .from('onboarding_progress')
        .update({ 
          workspace_completed: true,
          completed_at: new Date().toISOString(),
          completed_steps: [1, 2, 3, 4, 5]
        })
        .eq('user_id', user?.id);

      toast({ title: "Onboarding complete! Welcome aboard!" });
      navigate('/dashboard');
    } catch (error) {
      toast({ title: "Error completing onboarding", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const addTeamInvite = () => {
    setTeamInvites([...teamInvites, { email: "", role: "viewer" }]);
  };

  const removeTeamInvite = (index: number) => {
    setTeamInvites(teamInvites.filter((_, i) => i !== index));
  };

  const updateTeamInvite = (index: number, field: string, value: string) => {
    const updated = teamInvites.map((invite, i) => 
      i === index ? { ...invite, [field]: value } : invite
    );
    setTeamInvites(updated);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep > step.id ? 'bg-green-500 text-white' :
                  currentStep === step.id ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <h1 className="text-2xl font-bold text-center">{STEPS[currentStep - 1].title}</h1>
          <p className="text-gray-600 text-center">{STEPS[currentStep - 1].description}</p>
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>Step {currentStep} of {STEPS.length}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="company-name">Company Name *</Label>
                    <Input
                      id="company-name"
                      value={companyData.name}
                      onChange={(e) => setCompanyData({...companyData, name: e.target.value})}
                      placeholder="Enter your company name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="team-size">Team Size *</Label>
                    <Select onValueChange={(value) => setCompanyData({...companyData, team_size: value})}>
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
                    <Select onValueChange={(value) => setCompanyData({...companyData, industry: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SaaS">SaaS</SelectItem>
                        <SelectItem value="E-commerce">E-commerce</SelectItem>
                        <SelectItem value="FinTech">FinTech</SelectItem>
                        <SelectItem value="HealthTech">HealthTech</SelectItem>
                        <SelectItem value="EdTech">EdTech</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="role">Your Role *</Label>
                    <Select onValueChange={setUserRole}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Founder">Founder</SelectItem>
                        <SelectItem value="Product Manager">Product Manager</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Developer">Developer</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={handleCompanyInfoSubmit} disabled={isLoading} className="w-full">
                  {isLoading ? "Saving..." : "Continue"}
                </Button>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Invite Team Members</h3>
                    <Button onClick={addTeamInvite} variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Invite
                    </Button>
                  </div>

                  {teamInvites.map((invite, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={invite.email}
                        onChange={(e) => updateTeamInvite(index, 'email', e.target.value)}
                        placeholder="colleague@company.com"
                        className="flex-1"
                      />
                      <Select value={invite.role} onValueChange={(value) => updateTeamInvite(index, 'role', value)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                      {teamInvites.length > 1 && (
                        <Button onClick={() => removeTeamInvite(index)} variant="outline" size="sm">
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}

                  <p className="text-sm text-gray-500">
                    You can skip this step and invite team members later from settings.
                  </p>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setCurrentStep(3)} className="flex-1">
                    Skip for Now
                  </Button>
                  <Button onClick={handleTeamInvites} disabled={isLoading} className="flex-1">
                    {isLoading ? "Sending..." : "Send Invites & Continue"}
                  </Button>
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="domain">Company Website (Optional)</Label>
                    <Input
                      id="domain"
                      value={companyData.domain}
                      onChange={(e) => setCompanyData({...companyData, domain: e.target.value})}
                      placeholder="https://yourcompany.com"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Your public changelog will be at: changelog.{companyData.domain || 'yourcompany.com'}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="logo">Company Logo (Optional)</Label>
                    <div className="mt-2 flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        {companyData.logo_url ? (
                          <img src={companyData.logo_url} alt="Logo" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <Upload className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <Input
                          value={companyData.logo_url}
                          onChange={(e) => setCompanyData({...companyData, logo_url: e.target.value})}
                          placeholder="https://yourlogo.com/logo.png"
                        />
                        <p className="text-sm text-gray-500 mt-1">Enter a URL to your logo image</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button onClick={handleDomainSetup} disabled={isLoading} className="w-full">
                  {isLoading ? "Saving..." : "Continue"}
                </Button>
              </>
            )}

            {currentStep === 4 && (
              <>
                <div className="space-y-6">
                  <div>
                    <Label>Brand Colors</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <Label htmlFor="primary-color" className="text-sm">Primary Color</Label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            id="primary-color"
                            value={colors.primary_color}
                            onChange={(e) => setColors({...colors, primary_color: e.target.value})}
                            className="w-10 h-10 rounded border"
                          />
                          <Input
                            value={colors.primary_color}
                            onChange={(e) => setColors({...colors, primary_color: e.target.value})}
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="secondary-color" className="text-sm">Secondary Color</Label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            id="secondary-color"
                            value={colors.secondary_color}
                            onChange={(e) => setColors({...colors, secondary_color: e.target.value})}
                            className="w-10 h-10 rounded border"
                          />
                          <Input
                            value={colors.secondary_color}
                            onChange={(e) => setColors({...colors, secondary_color: e.target.value})}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="font-family">Font Family</Label>
                    <Select value={fontFamily} onValueChange={setFontFamily}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Roboto">Roboto</SelectItem>
                        <SelectItem value="Open Sans">Open Sans</SelectItem>
                        <SelectItem value="Lato">Lato</SelectItem>
                        <SelectItem value="Montserrat">Montserrat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="p-4 border rounded-lg" style={{ 
                    backgroundColor: colors.primary_color + '10',
                    borderColor: colors.primary_color,
                    fontFamily: fontFamily
                  }}>
                    <h4 className="font-semibold" style={{ color: colors.primary_color }}>
                      Preview: {companyData.name || "Your Company"}
                    </h4>
                    <p style={{ color: colors.secondary_color }}>
                      This is how your changelog will look with these colors and font.
                    </p>
                  </div>
                </div>

                <Button onClick={handleThemeCustomization} disabled={isLoading} className="w-full">
                  {isLoading ? "Saving..." : "Continue"}
                </Button>
              </>
            )}

            {currentStep === 5 && (
              <>
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Setup Complete!</h3>
                  <p className="text-gray-600">
                    Congratulations! Your workspace is ready. You can now start creating and publishing release notes.
                  </p>
                  
                  <div className="bg-gray-50 p-4 rounded-lg text-left space-y-2">
                    <h4 className="font-medium">What's next?</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Create your first release note</li>
                      <li>• Set up email integrations</li>
                      <li>• Share your public changelog</li>
                      <li>• Invite more team members</li>
                    </ul>
                  </div>
                </div>

                <Button onClick={completeOnboarding} disabled={isLoading} className="w-full">
                  {isLoading ? "Completing..." : "Go to Dashboard"}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingPage;
