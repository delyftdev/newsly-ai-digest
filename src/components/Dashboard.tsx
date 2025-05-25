
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Mail, Search, Filter, Copy, ExternalLink, Calendar, Tag, LogOut, Settings, Plus } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/hooks/use-toast";
import EmailCard from "@/components/EmailCard";
import { useEmailStore } from "@/stores/emailStore";

const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const { emails, categories, addSampleEmail } = useEmailStore();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const copyEmailToClipboard = async () => {
    if (!user?.generatedEmail) return;
    
    try {
      await navigator.clipboard.writeText(user.generatedEmail);
      toast({
        title: "Copied!",
        description: "Your newsletter email has been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy email to clipboard.",
        variant: "destructive",
      });
    }
  };

  const filteredEmails = emails.filter(email => {
    const matchesSearch = email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         email.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         email.aiSummary.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || email.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryCount = (category: string) => {
    return emails.filter(email => email.category === category).length;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">NewsletterAI</h1>
                <p className="text-sm text-gray-600">Welcome back, {user?.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Email Generation Card */}
        <Card className="mb-8 border-primary-200 bg-gradient-to-r from-primary-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary-900">
              <Mail className="w-5 h-5" />
              Your Newsletter Email
            </CardTitle>
            <CardDescription>
              Forward all your newsletters to this address for automatic AI analysis and organization.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="flex-1 p-3 bg-white rounded-lg border border-primary-200">
                <code className="text-lg font-mono text-primary-700">
                  {user?.generatedEmail}
                </code>
              </div>
              <Button 
                onClick={copyEmailToClipboard}
                className="bg-primary hover:bg-primary-600"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              🔗 Share your public glossary: 
              <a 
                href={`/glossary/${user?.id}`} 
                className="text-primary hover:underline ml-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                newsletter-ai.com/glossary/{user?.id}
              </a>
            </p>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Emails</p>
                  <p className="text-2xl font-bold text-gray-900">{emails.length}</p>
                </div>
                <Mail className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Week</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {emails.filter(email => {
                      const emailDate = new Date(email.receivedAt);
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return emailDate > weekAgo;
                    }).length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Categories</p>
                  <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                </div>
                <Tag className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sources</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(emails.map(email => email.sender)).size}
                  </p>
                </div>
                <ExternalLink className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 space-y-6">
            {/* Search */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Search</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search emails..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={selectedCategory === null ? "default" : "ghost"}
                  className="w-full justify-between"
                  onClick={() => setSelectedCategory(null)}
                >
                  All Emails
                  <Badge variant="secondary">{emails.length}</Badge>
                </Button>
                
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "ghost"}
                    className="w-full justify-between"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                    <Badge variant="secondary">{getCategoryCount(category)}</Badge>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Demo Button */}
            <Card className="border-dashed border-gray-300">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-gray-600 mb-3">
                  No emails yet? Add a sample to see how it works!
                </p>
                <Button 
                  onClick={addSampleEmail}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Sample Email
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {filteredEmails.length === 0 ? (
              <Card className="p-12 text-center">
                <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {emails.length === 0 ? "No emails yet" : "No emails match your filters"}
                </h3>
                <p className="text-gray-600 mb-4">
                  {emails.length === 0 
                    ? "Start forwarding newsletters to your generated email address or add a sample email to get started."
                    : "Try adjusting your search or category filters to find what you're looking for."
                  }
                </p>
                {emails.length === 0 && (
                  <Button onClick={addSampleEmail} className="bg-primary hover:bg-primary-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Sample Email
                  </Button>
                )}
              </Card>
            ) : (
              <div className="space-y-6">
                {filteredEmails.map((email) => (
                  <EmailCard key={email.id} email={email} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
