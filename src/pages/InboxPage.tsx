
import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle, Clock, Mail, Play, RefreshCw, Send, Zap } from "lucide-react";
import { useInboxStore } from "@/stores/inboxStore";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

const InboxPage = () => {
  const { 
    emails, 
    messages, 
    isLoading, 
    currentEmail, 
    diagnostics, 
    diagnosticMessages,
    fetchEmails, 
    fetchMessages, 
    generateEmail,
    runDiagnostics,
    sendTestEmail
  } = useInboxStore();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);

  useEffect(() => {
    fetchEmails();
    fetchMessages();
  }, [fetchEmails, fetchMessages]);

  const handleGenerateEmail = async () => {
    setIsGenerating(true);
    const result = await generateEmail();
    if (result?.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Email address generated successfully!",
      });
    }
    setIsGenerating(false);
  };

  const handleRunDiagnostics = async () => {
    await runDiagnostics();
    toast({
      title: "Diagnostics Complete",
      description: "Email system diagnostics have been completed",
    });
  };

  const handleSendTestEmail = async () => {
    setIsSendingTest(true);
    const result = await sendTestEmail();
    if (result?.error) {
      toast({
        title: "Test Failed",
        description: result.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Test Successful",
        description: "Test email sent and processed successfully!",
      });
    }
    setIsSendingTest(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'checking':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'error':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'checking':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

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
          <div className="flex gap-2">
            <Button onClick={handleRunDiagnostics} variant="outline">
              <Zap className="h-4 w-4 mr-2" />
              Run Diagnostics
            </Button>
            <Button onClick={() => { fetchEmails(); fetchMessages(); }} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        <Tabs defaultValue="inbox" className="space-y-6">
          <TabsList>
            <TabsTrigger value="inbox">Inbox</TabsTrigger>
            <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
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
                    <Button onClick={handleSendTestEmail} disabled={isSendingTest}>
                      {isSendingTest ? (
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4 mr-2" />
                      )}
                      Send Test Email
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    This email address is automatically configured to receive emails from your customers and forward them to your inbox.
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
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    You don't have an inbox email address yet. Generate one to start receiving emails.
                  </p>
                  <Button onClick={handleGenerateEmail} disabled={isGenerating}>
                    {isGenerating ? (
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Mail className="h-4 w-4 mr-2" />
                    )}
                    Generate Email Address
                  </Button>
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

          <TabsContent value="diagnostics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email System Diagnostics</CardTitle>
                <p className="text-sm text-gray-600">
                  Check the status of your email system components
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Mailgun API Connection */}
                <div className={`p-4 rounded-lg border ${getStatusColor(diagnostics.mailgunApiConnection)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(diagnostics.mailgunApiConnection)}
                      <div>
                        <h4 className="font-medium">Mailgun API Connection</h4>
                        <p className="text-sm opacity-80">
                          {diagnosticMessages.mailgunApiConnection || 'Testing connection to Mailgun API...'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Route Creation */}
                <div className={`p-4 rounded-lg border ${getStatusColor(diagnostics.routeCreation)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(diagnostics.routeCreation)}
                      <div>
                        <h4 className="font-medium">Route Creation</h4>
                        <p className="text-sm opacity-80">
                          {diagnosticMessages.routeCreation || 'Testing email route creation...'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email Generation */}
                <div className={`p-4 rounded-lg border ${getStatusColor(diagnostics.emailGeneration)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(diagnostics.emailGeneration)}
                      <div>
                        <h4 className="font-medium">Email Generation</h4>
                        <p className="text-sm opacity-80">
                          {diagnosticMessages.emailGeneration || 'Testing email address generation...'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Test Email */}
                <div className={`p-4 rounded-lg border ${getStatusColor(diagnostics.testEmail)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(diagnostics.testEmail)}
                      <div>
                        <h4 className="font-medium">Test Email Processing</h4>
                        <p className="text-sm opacity-80">
                          {diagnosticMessages.testEmail || 'Ready to test email processing...'}
                        </p>
                      </div>
                    </div>
                    {diagnostics.testEmail === 'idle' && currentEmail && (
                      <Button onClick={handleSendTestEmail} size="sm" disabled={isSendingTest}>
                        {isSendingTest ? (
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Play className="h-4 w-4 mr-2" />
                        )}
                        Test Now
                      </Button>
                    )}
                  </div>
                </div>
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
                      <p className="text-gray-500">No email addresses generated yet</p>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium mb-2">Actions</h4>
                    <div className="flex gap-2">
                      <Button onClick={handleGenerateEmail} disabled={isGenerating}>
                        {isGenerating ? (
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Mail className="h-4 w-4 mr-2" />
                        )}
                        Generate New Email
                      </Button>
                    </div>
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
