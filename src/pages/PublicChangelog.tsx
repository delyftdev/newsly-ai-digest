
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Mail, ExternalLink, Rss } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Company {
  id: string;
  name: string;
  slug: string;
  logo_url: string;
  primary_color: string;
  secondary_color: string;
  font_family: string;
}

interface Release {
  id: string;
  title: string;
  content: any;
  category: string;
  release_date: string;
  published_at: string;
}

const PublicChangelog = () => {
  const { companySlug } = useParams();
  const [company, setCompany] = useState<Company | null>(null);
  const [releases, setReleases] = useState<Release[]>([]);
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (!companySlug) return;

      try {
        // Fetch company data
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('slug', companySlug)
          .single();

        if (companyError) {
          console.error('Company not found:', companyError);
          return;
        }

        setCompany(companyData);

        // Fetch published releases
        const { data: releasesData, error: releasesError } = await supabase
          .from('releases')
          .select('*')
          .eq('company_id', companyData.id)
          .eq('status', 'published')
          .eq('visibility', 'public')
          .order('published_at', { ascending: false });

        if (releasesError) {
          console.error('Error fetching releases:', releasesError);
          return;
        }

        setReleases(releasesData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [companySlug]);

  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) {
      toast({ title: "Please enter a valid email address", variant: "destructive" });
      return;
    }

    if (!company) return;

    try {
      const { error } = await supabase
        .from('subscribers')
        .insert({
          company_id: company.id,
          email: email,
          confirmed: false
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({ title: "You're already subscribed!", variant: "destructive" });
        } else {
          throw error;
        }
        return;
      }

      setIsSubscribed(true);
      setEmail("");
      toast({ title: "Successfully subscribed! Check your email for confirmation." });
    } catch (error) {
      console.error('Subscription error:', error);
      toast({ title: "Error subscribing. Please try again.", variant: "destructive" });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'product': return 'bg-blue-100 text-blue-800';
      case 'feature': return 'bg-green-100 text-green-800';
      case 'bugfix': return 'bg-red-100 text-red-800';
      case 'announcement': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const generateEmbedCode = () => {
    const embedCode = `<iframe src="${window.location.href}" width="100%" height="600" frameborder="0"></iframe>`;
    navigator.clipboard.writeText(embedCode);
    toast({ title: "Embed code copied to clipboard!" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Changelog Not Found</h1>
          <p className="text-gray-600">The requested changelog does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gray-50"
      style={{ fontFamily: company.font_family }}
    >
      {/* Header */}
      <header 
        className="bg-white shadow-sm border-b-4"
        style={{ borderBottomColor: company.primary_color }}
      >
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center space-x-4 mb-6">
            {company.logo_url && (
              <img 
                src={company.logo_url} 
                alt={company.name} 
                className="h-12 w-12 object-contain"
              />
            )}
            <div>
              <h1 
                className="text-3xl font-bold"
                style={{ color: company.primary_color }}
              >
                {company.name} Changelog
              </h1>
              <p style={{ color: company.secondary_color }}>
                Stay up to date with our latest releases and improvements
              </p>
            </div>
          </div>

          {/* Subscribe Section */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Subscribe to Updates</h3>
            <p className="text-gray-600 mb-4">
              Get notified when we ship new features and improvements
            </p>
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                disabled={isSubscribed}
              />
              <Button 
                onClick={handleSubscribe}
                disabled={isSubscribed}
                style={{ backgroundColor: company.primary_color }}
                className="hover:opacity-90"
              >
                <Mail className="h-4 w-4 mr-2" />
                {isSubscribed ? 'Subscribed!' : 'Subscribe'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {releases.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No releases yet</h3>
              <p className="text-gray-600">Check back soon for updates!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {releases.map((release) => (
              <Card key={release.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h2 className="text-xl font-semibold text-gray-900">
                          {release.title}
                        </h2>
                        <Badge 
                          variant="secondary" 
                          className={getCategoryColor(release.category)}
                        >
                          {release.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(release.published_at || release.release_date)}
                      </p>
                    </div>
                  </div>

                  <div className="prose prose-sm max-w-none">
                    {typeof release.content === 'string' ? (
                      <div dangerouslySetInnerHTML={{ __html: release.content }} />
                    ) : (
                      <div>
                        {release.content?.whats_new && (
                          <div className="mb-4">
                            <h4 className="font-semibold text-gray-900 mb-2">What's New</h4>
                            <ul className="list-disc list-inside space-y-1">
                              {release.content.whats_new.map((item: string, index: number) => (
                                <li key={index} className="text-gray-700">{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {release.content?.improvements && (
                          <div className="mb-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Improvements</h4>
                            <ul className="list-disc list-inside space-y-1">
                              {release.content.improvements.map((item: string, index: number) => (
                                <li key={index} className="text-gray-700">{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {release.content?.bug_fixes && (
                          <div className="mb-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Bug Fixes</h4>
                            <ul className="list-disc list-inside space-y-1">
                              {release.content.bug_fixes.map((item: string, index: number) => (
                                <li key={index} className="text-gray-700">{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Rss className="h-4 w-4 mr-2" />
                RSS Feed
              </Button>
              <Button variant="outline" size="sm" onClick={generateEmbedCode}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Embed Changelog
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              Powered by Newsletter AI
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicChangelog;
