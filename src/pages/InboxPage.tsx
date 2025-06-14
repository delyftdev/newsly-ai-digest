
import React, { useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, RefreshCw } from "lucide-react";
import { useInboxStore } from "@/stores/inboxStore";
import { formatDistanceToNow } from "date-fns";

const InboxPage = () => {
  const { 
    emails, 
    messages, 
    isLoading, 
    currentEmail, 
    fetchEmails, 
    fetchMessages
  } = useInboxStore();

  useEffect(() => {
    fetchEmails();
    fetchMessages();
  }, [fetchEmails, fetchMessages]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inbox</h1>
            <p className="text-gray-600">
              Manage your company's incoming emails and feedback
            </p>
          </div>
          <Button onClick={() => { fetchEmails(); fetchMessages(); }} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <Tabs defaultValue="inbox" className="space-y-6">
          <TabsList>
            <TabsTrigger value="inbox">Inbox</TabsTrigger>
            <TabsTrigger value="settings">Email Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="inbox" className="space-y-6">
            {/* Current Email Address */}
            {currentEmail && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Your Company Email
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <code className="bg-gray-100 px-3 py-2 rounded text-sm font-mono">
                        {currentEmail}
                      </code>
                      <Badge variant="outline">Active</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    This email address is automatically configured to receive emails from your customers.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* No Email State */}
            {!currentEmail && !isLoading && (
              <Card>
                <CardHeader>
                  <CardTitle>No Email Address Found</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    No inbox email address found. If you just completed onboarding, please refresh the page.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Messages */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Messages</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">Loading messages...</p>
                  </div>
                ) : messages.length > 0 ? (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium">{message.subject || 'No Subject'}</h4>
                            <p className="text-sm text-gray-500">
                              From: {message.from_name || message.from_email}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge variant={message.is_processed ? 'default' : 'secondary'}>
                              {message.is_processed ? 'Processed' : 'New'}
                            </Badge>
                            <p className="text-xs text-gray-400 mt-1">
                              {formatDistanceToNow(new Date(message.received_at || message.created_at), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                        {message.content && (
                          <div className="text-sm text-gray-700 mt-2 p-3 bg-gray-50 rounded">
                            {message.content.substring(0, 200)}
                            {message.content.length > 200 && '...'}
                          </div>
                        )}
                        {message.category && (
                          <div className="mt-2">
                            <Badge variant="outline">{message.category}</Badge>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Mail className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">No messages yet</p>
                    <p className="text-sm text-gray-400">
                      Messages sent to your inbox email will appear here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Generated Email Addresses</h4>
                    {emails.length > 0 ? (
                      <div className="space-y-2">
                        {emails.map((email) => (
                          <div key={email.id} className="flex items-center justify-between p-3 border rounded">
                            <code className="text-sm font-mono">{email.email_address}</code>
                            <Badge variant="outline">
                              {formatDistanceToNow(new Date(email.created_at), { addSuffix: true })}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No email addresses found</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default InboxPage;
