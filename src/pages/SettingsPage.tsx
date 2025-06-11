import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Building2, Users, Palette, Key, Trash2, Plus, X } from "lucide-react";
import { useCompanyStore } from "@/stores/companyStore";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const SettingsPage = () => {
  const { company, branding, updateCompany, updateBranding } = useCompanyStore();
  const { user } = useAuthStore();
  const { toast } = useToast();

  const [profileData, setProfileData] = useState({
    full_name: "",
    role: ""
  });

  const [companyData, setCompanyData] = useState({
    name: company?.name || "",
    domain: company?.domain || "",
    team_size: company?.team_size || "",
    industry: company?.industry || ""
  });

  const [brandingData, setBrandingData] = useState({
    primary_color: branding?.primary_color || "#3B82F6",
    secondary_color: branding?.secondary_color || "#6B7280",
    font_family: branding?.font_family || "Inter"
  });

  const [newInvite, setNewInvite] = useState({ email: "", role: "viewer" });
  const [isLoading, setIsLoading] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const { data: teamInvitations } = useQuery({
    queryKey: ['team-invitations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_invitations')
        .select('*')
        .eq('company_id', company?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!company?.id
  });

  const updateProfile = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          role: profileData.role
        })
        .eq('id', user?.id);

      if (error) throw error;
      toast({ title: "Profile updated successfully!" });
    } catch (error) {
      toast({ title: "Error updating profile", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const updateCompanyInfo = async () => {
    setIsLoading(true);
    try {
      const result = await updateCompany(companyData);
      if (result.error) {
        toast({ title: result.error, variant: "destructive" });
      } else {
        toast({ title: "Company information updated!" });
      }
    } catch (error) {
      toast({ title: "Error updating company", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const updateBrandingSettings = async () => {
    setIsLoading(true);
    try {
      const result = await updateBranding(brandingData);
      if (result.error) {
        toast({ title: result.error, variant: "destructive" });
      } else {
        toast({ title: "Branding updated!" });
      }
    } catch (error) {
      toast({ title: "Error updating branding", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const sendTeamInvite = async () => {
    if (!newInvite.email || !newInvite.email.includes('@')) {
      toast({ title: "Please enter a valid email address", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('team_invitations')
        .insert({
          company_id: company?.id,
          email: newInvite.email,
          role: newInvite.role,
          invited_by: user?.id
        });

      if (error) throw error;
      
      setNewInvite({ email: "", role: "viewer" });
      toast({ title: "Team invitation sent!" });
    } catch (error) {
      toast({ title: "Error sending invitation", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteInvitation = async (invitationId: string) => {
    try {
      const { error } = await supabase
        .from('team_invitations')
        .delete()
        .eq('id', invitationId);

      if (error) throw error;
      toast({ title: "Invitation deleted" });
    } catch (error) {
      toast({ title: "Error deleting invitation", variant: "destructive" });
    }
  };

  // Initialize form data when profile/company data loads
  React.useEffect(() => {
    if (profile) {
      setProfileData({
        full_name: profile.full_name || "",
        role: profile.role || ""
      });
    }
  }, [profile]);

  React.useEffect(() => {
    if (company) {
      setCompanyData({
        name: company.name || "",
        domain: company.domain || "",
        team_size: company.team_size || "",
        industry: company.industry || ""
      });
    }
  }, [company]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account and workspace settings</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="company" className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span>Company</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Team</span>
            </TabsTrigger>
            <TabsTrigger value="branding" className="flex items-center space-x-2">
              <Palette className="h-4 w-4" />
              <span>Branding</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center space-x-2">
              <Key className="h-4 w-4" />
              <span>Account</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input
                    id="full-name"
                    value={profileData.full_name}
                    onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={profileData.role} onValueChange={(value) => setProfileData({...profileData, role: value})}>
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

                <div>
                  <Label>Email</Label>
                  <Input value={user?.email || ""} disabled />
                  <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <Button onClick={updateProfile} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="company">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    value={companyData.name}
                    onChange={(e) => setCompanyData({...companyData, name: e.target.value})}
                    placeholder="Enter company name"
                  />
                </div>

                <div>
                  <Label htmlFor="domain">Website Domain</Label>
                  <Input
                    id="domain"
                    value={companyData.domain}
                    onChange={(e) => setCompanyData({...companyData, domain: e.target.value})}
                    placeholder="https://yourcompany.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="team-size">Team Size</Label>
                    <Select value={companyData.team_size} onValueChange={(value) => setCompanyData({...companyData, team_size: value})}>
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
                    <Select value={companyData.industry} onValueChange={(value) => setCompanyData({...companyData, industry: value})}>
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
                </div>

                <Button onClick={updateCompanyInfo} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Invite Team Members</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      value={newInvite.email}
                      onChange={(e) => setNewInvite({...newInvite, email: e.target.value})}
                      placeholder="colleague@company.com"
                      className="flex-1"
                    />
                    <Select value={newInvite.role} onValueChange={(value) => setNewInvite({...newInvite, role: value})}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={sendTeamInvite} disabled={isLoading}>
                      <Plus className="h-4 w-4 mr-2" />
                      Invite
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pending Invitations</CardTitle>
                </CardHeader>
                <CardContent>
                  {teamInvitations && teamInvitations.length > 0 ? (
                    <div className="space-y-3">
                      {teamInvitations.map((invitation) => (
                        <div key={invitation.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{invitation.email}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline">{invitation.role}</Badge>
                              <Badge variant={invitation.status === 'pending' ? 'secondary' : 'default'}>
                                {invitation.status}
                              </Badge>
                            </div>
                          </div>
                          <Button 
                            onClick={() => deleteInvitation(invitation.id)} 
                            variant="ghost" 
                            size="sm"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No pending invitations</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="branding">
            <Card>
              <CardHeader>
                <CardTitle>Brand Customization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Brand Colors</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <Label htmlFor="primary-color" className="text-sm">Primary Color</Label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          id="primary-color"
                          value={brandingData.primary_color}
                          onChange={(e) => setBrandingData({...brandingData, primary_color: e.target.value})}
                          className="w-10 h-10 rounded border"
                        />
                        <Input
                          value={brandingData.primary_color}
                          onChange={(e) => setBrandingData({...brandingData, primary_color: e.target.value})}
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
                          value={brandingData.secondary_color}
                          onChange={(e) => setBrandingData({...brandingData, secondary_color: e.target.value})}
                          className="w-10 h-10 rounded border"
                        />
                        <Input
                          value={brandingData.secondary_color}
                          onChange={(e) => setBrandingData({...brandingData, secondary_color: e.target.value})}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="font-family">Font Family</Label>
                  <Select value={brandingData.font_family} onValueChange={(value) => setBrandingData({...brandingData, font_family: value})}>
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
                  backgroundColor: brandingData.primary_color + '10',
                  borderColor: brandingData.primary_color,
                  fontFamily: brandingData.font_family
                }}>
                  <h4 className="font-semibold" style={{ color: brandingData.primary_color }}>
                    Preview: {companyData.name || "Your Company"}
                  </h4>
                  <p style={{ color: brandingData.secondary_color }}>
                    This is how your changelog will look with these colors and font.
                  </p>
                </div>

                <Button onClick={updateBrandingSettings} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium">Change Password</h4>
                    <p className="text-sm text-gray-500 mb-2">
                      Update your account password
                    </p>
                    <Button variant="outline">Change Password</Button>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium text-red-600">Danger Zone</h4>
                    <p className="text-sm text-gray-500 mb-2">
                      Permanently delete your account and all associated data
                    </p>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
