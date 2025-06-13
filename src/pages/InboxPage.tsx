import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Search, Filter, Copy, Check, Clock, RefreshCw } from "lucide-react";
import { useInboxStore } from "@/stores/inboxStore";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const InboxPage = () => {
  const { messages, emails, currentEmail, isLoading, fetchMessages, fetchEmails, ensureCompanyEmail, generateEmail } = useInboxStore();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Auto-ensure company email on page load
  useEffect(() => {
    const initializeInbox = async () => {
      console.log('Initializing inbox...');
      await ensureCompanyEmail();
      await fetchEmails();
      await fetchMessages();
    };
    
    initializeInbox();
  }, [ensureCompanyEmail, fetchEmails, fetchMessages]);

  const { data: inboxEmails, refetch: refetchEmails } = useQuery({
    queryKey: ['inbox-emails'],
    queryFn: async () => {
      console.log('Querying inbox emails...');
      const { data, error } = await supabase
        .from('inbox_emails')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Query error:', error);
        throw error;
      }
      console.log('Query result:', data);
      return data;
    },
  });

  const displayEmail = currentEmail || inboxEmails?.[0]?.email_address;

  const handleGenerateEmail = async () => {
    setIsGenerating(true);
    try {
      console.log('Manually generating email...');
      const result = await generateEmail();
      
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Company inbox email generated successfully!",
        });
        // Refresh the query data
        await refetchEmails();
      }
    } catch (error) {
      console.error('Error generating email:', error);
      toast({
        title: "Error",
        description: "Failed to generate email address",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyEmailToClipboard = async () => {
    if (!displayEmail) return;
    
    try {
      await navigator.clipboard.writeText(displayEmail);
      setCopiedEmail(true);
      toast({
        title: "Email copied!",
        description: "The inbox email has been copied to your clipboard.",
      });
      
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy email to clipboard.",
        variant: "destructive",
      });
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = searchTerm === "" || 
      message.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.from_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.content?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === "all" || message.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      feature: "bg-blue-100 text-blue-800",
      bug: "bg-red-100 text-red-800",
      feedback: "bg-green-100 text-green-800",
      question: "bg-yellow-100 text-yellow-800",
      uncategorized: "bg-gray-100 text-gray-800"
    };
    return colors[category as keyof typeof colors] || colors.uncategorized;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inbox</h1>
            <p className="text-gray-600">Manage incoming emails and feedback</p>
          </div>
        </div>

        {/* Inbox Email Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Company Inbox Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            {displayEmail ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <code className="flex-1 text-sm font-mono bg-white px-3 py-2 rounded border">
                    {displayEmail}
                  </code>
                  <Button
                    onClick={copyEmailToClipboard}
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    {copiedEmail ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copiedEmail ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
                <p className="text-sm text-gray-600">
                  Share this email with your users to collect feedback, feature requests, and bug reports.
                  All emails sent to this address will appear in your inbox.
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Setting up your inbox...</h3>
                <p className="text-gray-600 mb-4">
                  Your company inbox email is being generated automatically.
                </p>
                <Button 
                  onClick={handleGenerateEmail}
                  disabled={isGenerating}
                  className="flex items-center gap-2"
                >
                  {isGenerating ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Mail className="h-4 w-4" />
                  )}
                  {isGenerating ? 'Generating...' : 'Generate Email Now'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="feature">Feature Requests</SelectItem>
              <SelectItem value="bug">Bug Reports</SelectItem>
              <SelectItem value="feedback">Feedback</SelectItem>
              <SelectItem value="question">Questions</SelectItem>
              <SelectItem value="uncategorized">Uncategorized</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Messages */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message List */}
          <div className="lg:col-span-1 space-y-3">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading messages...</p>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="text-center py-8">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages yet</h3>
                <p className="text-gray-600">
                  {searchTerm || filterCategory !== "all" 
                    ? "No messages match your current filters."
                    : "Share your inbox email to start receiving messages."
                  }
                </p>
              </div>
            ) : (
              filteredMessages.map((message) => (
                <Card 
                  key={message.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedMessage?.id === message.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedMessage(message)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{message.subject || 'No Subject'}</h4>
                        <p className="text-sm text-gray-600 truncate">{message.from_email}</p>
                      </div>
                      <Badge className={getCategoryColor(message.category || 'uncategorized')}>
                        {message.category || 'uncategorized'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      {formatDate(message.received_at || message.created_at || '')}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{selectedMessage.subject || 'No Subject'}</CardTitle>
                      <p className="text-gray-600 mt-1">
                        From: {selectedMessage.from_name || selectedMessage.from_email}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(selectedMessage.received_at || selectedMessage.created_at)}
                      </p>
                    </div>
                    <Badge className={getCategoryColor(selectedMessage.category || 'uncategorized')}>
                      {selectedMessage.category || 'uncategorized'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    {selectedMessage.html_content ? (
                      <div dangerouslySetInnerHTML={{ __html: selectedMessage.html_content }} />
                    ) : (
                      <pre className="whitespace-pre-wrap font-sans">
                        {selectedMessage.content || 'No content available'}
                      </pre>
                    )}
                  </div>
                  
                  {selectedMessage.ai_summary && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">AI Summary</h4>
                      <p className="text-blue-800">{selectedMessage.ai_summary}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a message</h3>
                    <p className="text-gray-600">Choose a message from the list to view its details</p>
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
