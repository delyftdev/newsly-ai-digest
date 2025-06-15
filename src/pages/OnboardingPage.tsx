
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from "@/stores/authStore";
import { useCompanyStore } from "@/stores/companyStore";
import { useInboxStore } from "@/stores/inboxStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

const OnboardingPage = () => {
  const navigate = useNavigate(); // <-- FIXED: define navigate here
  const { user } = useAuthStore();
  const { company, fetchCompany, updateCompany } = useCompanyStore();
  const { emails, fetchEmails, autoGenerateEmailOnOnboarding } = useInboxStore();

  const [isLoading, setIsLoading] = useState(false);
  const [companyData, setCompanyData] = useState({
    name: "",
    domain: "",
    teamSize: "",
    industry: "",
  });
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  useEffect(() => {
    if (user) {
      fetchCompany();
    }
  }, [user, fetchCompany]);

  useEffect(() => {
    if (company) {
      setCompanyData({
        name: company.name || "",
        domain: company.domain || "",
        teamSize: company.team_size || "",
        industry: company.industry || "",
      });
    }
  }, [company]);

  const canProceed = !!companyData.name && !!companyData.domain && !!companyData.teamSize && !!companyData.industry;

  const handleCompanyUpdate = async () => {
    if (!canProceed) {
      toast({
        title: "Missing Info",
        description: "Please provide complete company information to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await updateCompany({
        name: companyData.name,
        domain: companyData.domain,
        team_size: companyData.teamSize,
        industry: companyData.industry,
      });

      if (error) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Company information updated successfully",
        });
        if (company?.id) {
          const { error: emailError } = await autoGenerateEmailOnOnboarding(company.id);
          if (emailError) {
            toast({
              title: "Error",
              description: emailError,
              variant: "destructive",
            });
          }
        }
        setStep(2);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    setStep(3);
  };

  const handleComplete = () => {
    navigate('/inbox');
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to the App!</h1>
        <p className="text-gray-600">Let's set up your company information to get started.</p>
      </div>

      <Progress value={(step / totalSteps) * 100} className="mb-4" />

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={companyData.name}
                onChange={(e) => setCompanyData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your company name"
              />
            </div>
            <div>
              <Label htmlFor="domain">Domain</Label>
              <Input
                id="domain"
                value={companyData.domain}
                onChange={(e) => setCompanyData(prev => ({ ...prev, domain: e.target.value }))}
                placeholder="company.com"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="teamSize">Team Size</Label>
                <Select value={companyData.teamSize} onValueChange={(value) => setCompanyData(prev => ({ ...prev, teamSize: value }))}>
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
                <Label htmlFor="industry">Industry</Label>
                <Select value={companyData.industry} onValueChange={(value) => setCompanyData(prev => ({ ...prev, industry: value }))}>
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
            <div className="flex justify-between">
              <Button onClick={handleSkip} variant="ghost">Skip</Button>
              <Button onClick={handleCompanyUpdate} disabled={isLoading || !canProceed}>
                {isLoading ? "Updating..." : "Next"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Email Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Generated Email Address</Label>
              <div className="mt-2">
                {emails.length > 0 ? (
                  <div className="space-y-2">
                    {emails.map((email) => (
                      <div key={email.id} className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-mono text-sm">{email.email_address}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Forward emails to this address to have them appear in your inbox
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No inbox email generated yet</p>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setStep(3)}>Next</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>All Done!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Your company information has been set up. You're ready to start using the app!</p>
            {emails.length > 0 && (
              <div>
                <Label>Your Inbox Email</Label>
                <p className="text-sm font-mono">{emails[0]?.email_address}</p>
              </div>
            )}
            <Button onClick={handleComplete}>Go to Inbox</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OnboardingPage;
