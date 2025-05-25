
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Search, Calendar, ExternalLink, Lightbulb } from "lucide-react";
import { useState } from "react";
import { useEmailStore } from "@/stores/emailStore";

const PublicGlossary = () => {
  const { userId } = useParams();
  const { emails, categories } = useEmailStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter emails by user ID and search/category
  const userEmails = emails.filter(email => email.userId === userId);
  const filteredEmails = userEmails.filter(email => {
    const matchesSearch = email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         email.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         email.aiSummary.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || email.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Product Updates': 'bg-blue-100 text-blue-800',
      'Feature Releases': 'bg-green-100 text-green-800',
      'News & Announcements': 'bg-purple-100 text-purple-800',
      'Marketing Content': 'bg-orange-100 text-orange-800',
      'Technical Updates': 'bg-red-100 text-red-800',
      'Company News': 'bg-yellow-100 text-yellow-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryCount = (category: string) => {
    return userEmails.filter(email => email.category === category).length;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Newsletter Insights</h1>
            </div>
            <p className="text-gray-600">
              AI-curated newsletter content and product updates
            </p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {userEmails.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No newsletter content available
              </h2>
              <p className="text-gray-600">
                This glossary will be populated as newsletters are processed.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-64 space-y-6">
              {/* Search */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Search Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search insights..."
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
                    All Content
                    <Badge variant="secondary">{userEmails.length}</Badge>
                  </Button>
                  
                  {categories.map((category) => {
                    const count = getCategoryCount(category);
                    if (count === 0) return null;
                    
                    return (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "ghost"}
                        className="w-full justify-between"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                        <Badge variant="secondary">{count}</Badge>
                      </Button>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Updates</span>
                    <span className="font-semibold">{userEmails.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Sources</span>
                    <span className="font-semibold">
                      {new Set(userEmails.map(email => email.sender)).size}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Categories</span>
                    <span className="font-semibold">
                      {new Set(userEmails.map(email => email.category)).size}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Latest Newsletter Insights
                </h2>
                <p className="text-gray-600">
                  {filteredEmails.length} update{filteredEmails.length !== 1 ? 's' : ''} found
                  {selectedCategory && ` in ${selectedCategory}`}
                </p>
              </div>

              {filteredEmails.length === 0 ? (
                <Card className="text-center py-8">
                  <CardContent>
                    <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No content matches your search
                    </h3>
                    <p className="text-gray-600">
                      Try adjusting your search terms or category filters.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {filteredEmails.map((email) => (
                    <Card key={email.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm text-gray-600 truncate">{email.sender}</span>
                              <Badge className={`text-xs ${getCategoryColor(email.category)}`}>
                                {email.category}
                              </Badge>
                            </div>
                            <CardTitle className="text-lg leading-tight mb-2">{email.subject}</CardTitle>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Calendar className="w-4 h-4" />
                              {formatDate(email.receivedAt)}
                            </div>
                          </div>
                        </div>
                        
                        <CardDescription className="text-base leading-relaxed">
                          {email.aiSummary}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Key Insights */}
                        {email.keyInsights.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <Lightbulb className="w-4 h-4 text-yellow-500" />
                              <h4 className="font-semibold text-gray-900">Key Insights</h4>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {email.keyInsights.map((insight, index) => (
                                <Badge key={index} variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-800">
                                  {insight}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Links */}
                        {email.links.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <ExternalLink className="w-4 h-4" />
                              Resources
                            </h4>
                            <div className="grid gap-2">
                              {email.links.map((link) => (
                                <a
                                  key={link.id}
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                  <span className="text-sm font-medium text-gray-900">{link.linkText}</span>
                                  <ExternalLink className="w-4 h-4 text-gray-500" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <Mail className="w-4 h-4 text-white" />
            </div>
            <span className="text-gray-900 font-semibold">NewsletterAI</span>
          </div>
          <p className="text-gray-600">
            Powered by AI-driven newsletter analysis and organization
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PublicGlossary;
