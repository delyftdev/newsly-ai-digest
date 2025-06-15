import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useCompanyStore } from "@/stores/companyStore";
import { useInboxStore } from "@/stores/inboxStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Building, Users, Palette, Mail, User } from "lucide-react";
import { useTeamActivityStore } from "@/stores/teamActivityStore";

const SettingsPage = () => {
  const { user } = useAuthStore();
  const { company, branding, teamMembers, fetchCompany, updateCompany, updateBranding, updateProfile, inviteTeamMember } = useCompanyStore();
  const { emails, fetchEmails } = useInboxStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "",
    role: "",
  });
  const [companyData, setCompanyData] = useState({
    name: "",
    domain: "",
    teamSize: "",
    industry: "",
  });
  const [brandingData, setBrandingData] = useState({
    primaryColor: "#3B82F6",
    secondaryColor: "#6B7280",
    fontFamily: "Inter",
  });
  const [inviteData, setInviteData] = useState({
    email: "",
    role: "viewer",
  });

  // Load data on mount and when company/branding changes
  useEffect(() => {
    fetchCompany();
    fetchEmails();
  }, []);

  // Update form data when store data changes
  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.user_metadata?.full_name || "",
        role: "admin", // Default for now, can be enhanced later
      });
    }
  }, [user]);

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

  useEffect(() => {
    if (branding) {
      setBrandingData({
        primaryColor: branding.primary_color || "#3B82F6",
        secondaryColor: branding.secondary_color || "#6B7280",
        fontFamily: branding.font_family || "Inter",
      });
    }
  }, [branding]);

  const { logActivity } = useTeamActivityStore();

  const handleProfileUpdate = async () => {
    setIsLoading(true);
    try {
      const { error } = await updateProfile({
        full_name: profileData.fullName,
        role: profileData.role,
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
          description: "Profile updated successfully",
        });
        await logActivity({
          activityType: "profile_updated",
          entityType: "user",
          entityId: user.id,
          description: `Profile updated: ${profileData.fullName}`,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompanyUpdate = async () => {
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
        await logActivity({
          activityType: "company_updated",
          entityType: "company",
          entityId: company?.id,
          description: `Company updated: ${companyData.name}`,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBrandingUpdate = async () => {
    setIsLoading(true);
    try {
      const { error } = await updateBranding({
        primary_color: brandingData.primaryColor,
        secondary_color: brandingData.secondaryColor,
        font_family: brandingData.fontFamily,
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
          description: "Branding updated successfully",
        });
        await logActivity({
          activityType: "branding_updated",
          entityType: "company",
          entityId: company?.id,
          description: "Brand settings updated",
          metadata: { ...brandingData },
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTeamInvite = async () => {
    setIsLoading(true);
    try {
      const { error } = await inviteTeamMember(inviteData.email, inviteData.role);

      if (error) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: `Invitation sent to ${inviteData.email}`,
        });
        setInviteData({ email: "", role: "viewer" });
        await logActivity({
          activityType: "team_member_invited",
          entityType: "user",
          description: `Invited ${inviteData.email} as ${inviteData.role}`,
          metadata: { invitedEmail: inviteData.email, invitedRole: inviteData.role }
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account and company settings</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="inbox">Inbox</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={profileData.fullName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user?.email || ""}
                  disabled
                  placeholder="Your email address"
                />
                <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
              </div>
              <Button onClick={handleProfileUpdate} disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Profile"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Company Information
              </CardTitle>
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
              <Button onClick={handleCompanyUpdate} disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Company"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Team Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{member.profiles?.full_name || "Unknown User"}</p>
                        <p className="text-sm text-gray-500 capitalize">{member.role}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {member.status === 'active' ? 'Active' : 'Pending'}
                      </div>
                    </div>
                  ))}
                  {teamMembers.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No team members found</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Invite Team Member</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="inviteEmail">Email Address</Label>
                  <Input
                    id="inviteEmail"
                    type="email"
                    value={inviteData.email}
                    onChange={(e) => setInviteData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="colleague@company.com"
                  />
                </div>
                <div>
                  <Label htmlFor="inviteRole">Role</Label>
                  <Select value={inviteData.role} onValueChange={(value) => setInviteData(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleTeamInvite} disabled={isLoading || !inviteData.email}>
                  {isLoading ? "Sending..." : "Send Invitation"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Brand Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={brandingData.primaryColor}
                    onChange={(e) => setBrandingData(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="w-16 h-10 p-1 rounded"
                  />
                  <Input
                    value={brandingData.primaryColor}
                    onChange={(e) => setBrandingData(prev => ({ ...prev, primaryColor: e.target.value }))}
                    placeholder="#3B82F6"
                    className="flex-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={brandingData.secondaryColor}
                    onChange={(e) => setBrandingData(prev => ({ ...prev, secondaryColor: e.target.value }))}
                    className="w-16 h-10 p-1 rounded"
                  />
                  <Input
                    value={brandingData.secondaryColor}
                    onChange={(e) => setBrandingData(prev => ({ ...prev, secondaryColor: e.target.value }))}
                    placeholder="#6B7280"
                    className="flex-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="fontFamily">Font Family</Label>
                <Select value={brandingData.fontFamily} onValueChange={(value) => setBrandingData(prev => ({ ...prev, fontFamily: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select font" />
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
              <Button onClick={handleBrandingUpdate} disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Branding"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inbox">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Inbox Settings
              </CardTitle>
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
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">How to use your inbox email:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Forward newsletters, product briefs, and updates to this email</li>
                  <li>• Our AI will automatically categorize and summarize the content</li>
                  <li>• Use the "Create Release" button to turn emails into releases</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
