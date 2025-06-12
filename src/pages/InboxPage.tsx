
import { useEffect, useState } from "react";
import { useInboxStore } from "@/stores/inboxStore";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Mail, 
  Search, 
  Filter, 
  Archive, 
  Trash2, 
  FileText,
  Copy,
  CheckCircle,
  Clock
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const InboxPage = () => {
  const {
    messages,
    inboxEmail,
    isLoading,
    selectedCategory,
    searchQuery,
    fetchMessages,
    fetchInboxEmail,
    createInboxEmail,
    categorizeMessage,
    convertToRelease,
    setSelectedCategory,
    setSearchQuery,
    deleteMessage,
  } = useInboxStore();

  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
    fetchInboxEmail();
  }, [fetchMessages, fetchInboxEmail]);

  const handleCreateInboxEmail = async () => {
    const result = await createInboxEmail();
    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Inbox email created successfully!",
      });
    }
  };

  const handleCopyEmail = () => {
    if (inboxEmail?.email_address) {
      navigator.clipboard.writeText(inboxEmail.email_address);
      toast({
        title: "Copied!",
        description: "Email address copied to clipboard",
      });
    }
  };

  const handleCategorize = async (messageId: string, category: string) => {
    const result = await categorizeMessage(messageId, category);
    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Message categorized successfully",
      });
    }
  };

  const handleConvertToRelease = async (messageId: string) => {
    const result = await convertToRelease(messageId);
    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Message converted to release",
      });
    }
  };

  const handleDelete = async (messageId: string) => {
    const result = await deleteMessage(messageId);
    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Message deleted",
      });
    }
  };

  const categories = [
    { id: 'all', label: 'All Messages', count: messages.length },
    { id: 'newsletter', label: 'Newsletters', count: messages.filter(m => m.category === 'newsletter').length },
    { id: 'product_brief', label: 'Product Briefs', count: messages.filter(m => m.category === 'product_brief').length },
    { id: 'feature_announcement', label: 'Features', count: messages.filter(m => m.category === 'feature_announcement').length },
    { id: 'uncategorized', label: 'Uncategorized', count: messages.filter(m => m.category === 'uncategorized').length },
  ];

  const filteredMessages = messages.filter(message => {
    const matchesCategory = selectedCategory === 'all' || message.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      message.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.from_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.content?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectedMessageData = selectedMessage ? messages.find(m => m.id === selectedMessage) : null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Inbox</h1>
            <p className="text-gray-600">Manage your incoming emails and convert them to releases</p>
          </div>
        </div>

        {/* Inbox Email Setup */}
        {!inboxEmail ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Set Up Your Inbox Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Create a unique email address to receive newsletters and product updates.
              </p>
              <Button onClick={handleCreateInboxEmail}>
                <Mail className="h-4 w-4 mr-2" />
                Create Inbox Email
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Your Inbox Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                  {inboxEmail.email_address}
                </code>
                <Button variant="outline" size="sm" onClick={handleCopyEmail}>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Use this email to subscribe to newsletters and receive product updates.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar Categories */}
          <div className="col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-md text-left hover:bg-gray-100 ${
                      selectedCategory === category.id ? 'bg-primary-50 text-primary-700' : ''
                    }`}
                  >
                    <span className="text-sm">{category.label}</span>
                    <Badge variant="secondary" className="text-xs">
                      {category.count}
                    </Badge>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Messages List */}
          <div className="col-span-5">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Messages</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="p-4 text-center">Loading messages...</div>
                ) : filteredMessages.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No messages found
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredMessages.map((message) => (
                      <div
                        key={message.id}
                        onClick={() => setSelectedMessage(message.id)}
                        className={`p-4 cursor-pointer hover:bg-gray-50 ${
                          selectedMessage === message.id ? 'bg-primary-50' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm truncate">
                                {message.from_name || message.from_email}
                              </p>
                              {message.is_processed && (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              )}
                            </div>
                            <p className="text-sm text-gray-900 truncate">
                              {message.subject}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {message.content}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {message.category?.replace('_', ' ')}
                              </Badge>
                              <span className="text-xs text-gray-400">
                                {new Date(message.received_at || '').toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Message Detail */}
          <div className="col-span-4">
            {selectedMessageData ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">Message Details</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleConvertToRelease(selectedMessageData.id)}
                        disabled={selectedMessageData.is_processed}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Convert
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(selectedMessageData.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium">{selectedMessageData.subject}</h3>
                    <p className="text-sm text-gray-600">
                      From: {selectedMessageData.from_name || selectedMessageData.from_email}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(selectedMessageData.received_at || '').toLocaleString()}
                    </p>
                  </div>

                  {selectedMessageData.ai_summary && (
                    <div className="bg-blue-50 p-3 rounded-md">
                      <h4 className="text-sm font-medium text-blue-900 mb-1">AI Summary</h4>
                      <p className="text-sm text-blue-800">{selectedMessageData.ai_summary}</p>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-medium mb-2">Category</h4>
                    <Tabs value={selectedMessageData.category || 'uncategorized'}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger 
                          value="newsletter"
                          onClick={() => handleCategorize(selectedMessageData.id, 'newsletter')}
                        >
                          Newsletter
                        </TabsTrigger>
                        <TabsTrigger 
                          value="product_brief"
                          onClick={() => handleCategorize(selectedMessageData.id, 'product_brief')}
                        >
                          Product Brief
                        </TabsTrigger>
                      </TabsList>
                      <TabsList className="grid w-full grid-cols-2 mt-2">
                        <TabsTrigger 
                          value="feature_announcement"
                          onClick={() => handleCategorize(selectedMessageData.id, 'feature_announcement')}
                        >
                          Feature
                        </TabsTrigger>
                        <TabsTrigger 
                          value="uncategorized"
                          onClick={() => handleCategorize(selectedMessageData.id, 'uncategorized')}
                        >
                          Other
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Content</h4>
                    <div className="bg-gray-50 p-3 rounded-md max-h-64 overflow-y-auto">
                      <p className="text-sm whitespace-pre-wrap">
                        {selectedMessageData.content}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <p className="text-gray-500">Select a message to view details</p>
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
