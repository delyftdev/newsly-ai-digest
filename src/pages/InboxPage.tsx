import { useState, useEffect } from "react";
import { useInboxStore } from "@/stores/inboxStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, FileText, Newspaper, Lightbulb, Plus, Copy } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const InboxPage = () => {
  const { emails, messages, isLoading, fetchEmails, fetchMessages } = useInboxStore();
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchEmails();
    fetchMessages();
  }, []);

  const copyEmailToClipboard = (email: string) => {
    navigator.clipboard.writeText(email);
    toast({
      title: "Copied!",
      description: "Email address copied to clipboard",
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'newsletter':
      case 'product_updates':
        return <Newspaper className="w-4 h-4" />;
      case 'product_brief':
      case 'feature_announcement':
        return <FileText className="w-4 h-4" />;
      case 'feedback':
        return <Lightbulb className="w-4 h-4" />;
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'newsletter': 'bg-blue-100 text-blue-800',
      'product_brief': 'bg-green-100 text-green-800',
      'feature_announcement': 'bg-purple-100 text-purple-800',
      'product_updates': 'bg-orange-100 text-orange-800',
      'feedback': 'bg-yellow-100 text-yellow-800',
      'uncategorized': 'bg-gray-100 text-gray-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredMessages = selectedCategory === "all" 
    ? messages 
    : messages.filter(msg => 
        (msg.enhanced_category || msg.category) === selectedCategory
      );

  const categoryStats = {
    all: messages.length,
    newsletter: messages.filter(m => (m.enhanced_category || m.category) === 'newsletter').length,
    product_brief: messages.filter(m => (m.enhanced_category || m.category) === 'product_brief').length,
    feature_announcement: messages.filter(m => (m.enhanced_category || m.category) === 'feature_announcement').length,
    feedback: messages.filter(m => (m.enhanced_category || m.category) === 'feedback').length,
    uncategorized: messages.filter(m => (m.enhanced_category || m.category) === 'uncategorized').length,
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">Loading inbox...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Inbox</h1>
        <p className="text-gray-600">
          Manage your incoming emails and create releases.
        </p>
      </div>

      {/* Always show the inbox email address if it exists */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Your Inbox Email
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {emails.length > 0 ? (
              emails.map((email) => (
                <div
                  key={email.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-mono text-sm">{email.email_address}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Forward emails to this address for them to appear here.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyEmailToClipboard(email.email_address)}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                No inbox email has been generated yet. Complete onboarding to generate one for your team.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">
            All ({categoryStats.all})
          </TabsTrigger>
          <TabsTrigger value="newsletter">
            Newsletters ({categoryStats.newsletter})
          </TabsTrigger>
          <TabsTrigger value="product_brief">
            Product Briefs ({categoryStats.product_brief})
          </TabsTrigger>
          <TabsTrigger value="feature_announcement">
            Announcements ({categoryStats.feature_announcement})
          </TabsTrigger>
          <TabsTrigger value="feedback">
            Feedback ({categoryStats.feedback})
          </TabsTrigger>
          <TabsTrigger value="uncategorized">
            Other ({categoryStats.uncategorized})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-4">
          {filteredMessages.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
                <p className="text-gray-500">
                  Forward emails to your inbox address to get started
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredMessages.map((message) => (
              <Card key={message.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {getCategoryIcon(message.enhanced_category || message.category || 'uncategorized')}
                        <span className="text-sm text-gray-600 truncate">{message.from_name || message.from_email}</span>
                        <Badge className={`text-xs ${getCategoryColor(message.enhanced_category || message.category || 'uncategorized')}`}>
                          {(message.enhanced_category || message.category || 'uncategorized').replace('_', ' ')}
                        </Badge>
                        {message.processed_by_ai && (
                          <Badge variant="outline" className="text-xs">
                            AI Processed
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg leading-tight mb-2">
                        {message.subject || "No Subject"}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{formatDate(message.received_at || message.created_at || "")}</span>
                        {message.confidence_score && (
                          <span>• Confidence: {Math.round(message.confidence_score * 100)}%</span>
                        )}
                      </div>
                    </div>
                    
                    <Button size="sm" className="flex-shrink-0">
                      <Plus className="w-4 h-4 mr-1" />
                      Create Release
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* AI Summary */}
                  {message.ai_summary && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-1">AI Summary</h4>
                      <p className="text-blue-800 text-sm">{message.ai_summary}</p>
                    </div>
                  )}

                  {/* AI Tags */}
                  {message.ai_tags && message.ai_tags.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-1">
                        {message.ai_tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Content Preview */}
                  {message.content && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Content</h4>
                      <div className="prose prose-sm max-w-none">
                        <p className="text-gray-700 line-clamp-3">
                          {message.content.substring(0, 300)}
                          {message.content.length > 300 && "..."}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InboxPage;
