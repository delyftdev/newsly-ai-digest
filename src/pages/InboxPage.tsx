
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Mail, MailOpen, Copy, Plus, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/authStore";
import { useQuery } from "@tanstack/react-query";

interface Email {
  id: string;
  sender_email: string;
  subject: string;
  content: string;
  html_content: string;
  ai_processed: boolean;
  ai_summary: string;
  created_at: string;
}

const InboxPage = () => {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuthStore();
  const { toast } = useToast();

  const { data: emails, isLoading, refetch } = useQuery({
    queryKey: ['emails'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('emails')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Email[];
    }
  });

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('generated_email')
        .eq('id', user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const filteredEmails = emails?.filter(email =>
    email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.sender_email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const copyGeneratedEmail = () => {
    if (profile?.generated_email) {
      navigator.clipboard.writeText(profile.generated_email);
      toast({ title: "Email copied to clipboard!" });
    }
  };

  const createReleaseFromEmail = async (email: Email) => {
    try {
      // Here we would typically process the email with AI and create a release
      // For now, we'll navigate to the release editor with the email content
      const releaseData = {
        title: email.subject,
        content: email.content || email.html_content,
        source_type: 'email',
        source_id: email.id,
        category: 'announcement'
      };

      // Store in localStorage temporarily to pass to editor
      localStorage.setItem('draft_release', JSON.stringify(releaseData));
      
      // Navigate to release editor
      window.location.href = '/releases/new';
      
      toast({ title: "Creating release from email..." });
    } catch (error) {
      toast({ title: "Error creating release", variant: "destructive" });
    }
  };

  const processWithAI = async (email: Email) => {
    try {
      toast({ title: "Processing email with AI..." });
      
      // This would call an Edge Function to process with OpenAI
      // For now, we'll simulate the processing
      setTimeout(() => {
        toast({ title: "AI processing complete!" });
        refetch();
      }, 2000);
      
    } catch (error) {
      toast({ title: "Error processing with AI", variant: "destructive" });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inbox</h1>
            <p className="text-gray-600">Manage incoming emails and convert them to releases</p>
          </div>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Generated Email Display */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Forwarding Email</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <code className="bg-gray-100 px-3 py-2 rounded text-sm font-mono">
                  {profile?.generated_email || 'Loading...'}
                </code>
                <p className="text-sm text-gray-500 mt-1">
                  Forward emails to this address to automatically import them into your inbox
                </p>
              </div>
              <Button onClick={copyGeneratedEmail} variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Email List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search emails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-2">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading emails...</p>
                </div>
              ) : filteredEmails.length === 0 ? (
                <div className="text-center py-8">
                  <Mail className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No emails found</p>
                  <p className="text-sm text-gray-400">
                    {searchTerm ? 'Try a different search term' : 'Forward emails to your generated address to get started'}
                  </p>
                </div>
              ) : (
                filteredEmails.map((email) => (
                  <Card 
                    key={email.id} 
                    className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedEmail?.id === email.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedEmail(email)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            {email.ai_processed ? (
                              <MailOpen className="h-4 w-4 text-blue-500" />
                            ) : (
                              <Mail className="h-4 w-4 text-gray-400" />
                            )}
                            <span className="text-sm font-medium text-gray-900 truncate">
                              {email.sender_email}
                            </span>
                          </div>
                          <h4 className="font-medium text-sm text-gray-900 truncate mb-1">
                            {email.subject}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {formatDate(email.created_at)}
                          </p>
                        </div>
                        {email.ai_processed && (
                          <Badge variant="secondary" className="ml-2">AI</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Email Content */}
          <div className="lg:col-span-2">
            {selectedEmail ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{selectedEmail.subject}</CardTitle>
                      <p className="text-sm text-gray-500">
                        From: {selectedEmail.sender_email} • {formatDate(selectedEmail.created_at)}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      {!selectedEmail.ai_processed && (
                        <Button onClick={() => processWithAI(selectedEmail)} size="sm" variant="outline">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Process with AI
                        </Button>
                      )}
                      <Button onClick={() => createReleaseFromEmail(selectedEmail)} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Release
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {selectedEmail.ai_summary && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">AI Summary</h4>
                      <p className="text-sm text-blue-800">{selectedEmail.ai_summary}</p>
                    </div>
                  )}
                  
                  <div className="prose prose-sm max-w-none">
                    {selectedEmail.html_content ? (
                      <div dangerouslySetInnerHTML={{ __html: selectedEmail.html_content }} />
                    ) : (
                      <pre className="whitespace-pre-wrap text-sm">{selectedEmail.content}</pre>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Mail className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Select an email to view its content</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InboxPage;
