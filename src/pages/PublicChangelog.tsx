
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, Calendar, Tag } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Company {
  id: string;
  name: string;
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  font_family?: string;
  subdomain?: string;
  slug?: string;
}

interface Changelog {
  id: string;
  title: string;
  content: any;
  category: string;
  featured_image_url?: string;
  tags?: string[];
  published_at: string;
  status: string;
  visibility: string;
}

const PublicChangelog = () => {
  const { companySlug } = useParams<{ companySlug: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [changelogs, setChangelogs] = useState<Changelog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>("");

  useEffect(() => {
    if (companySlug) {
      fetchCompanyAndChangelogs();
    }
  }, [companySlug]);

  const fetchCompanyAndChangelogs = async () => {
    try {
      console.log('=== DEBUG: Starting company lookup ===');
      console.log('Company slug from URL:', companySlug);
      
      let debugLog = `Looking for company with slug: "${companySlug}"\n`;
      
      // First, let's see all companies to understand the data
      const { data: allCompanies, error: allError } = await supabase
        .from('companies')
        .select('id, name, subdomain, slug');
      
      console.log('All companies in database:', allCompanies);
      debugLog += `All companies: ${JSON.stringify(allCompanies, null, 2)}\n`;
      
      if (allError) {
        console.error('Error fetching all companies:', allError);
        debugLog += `Error fetching all companies: ${allError.message}\n`;
      }

      // Try to find by subdomain first
      console.log('Trying subdomain lookup...');
      const { data: companyBySubdomain, error: subdomainError } = await supabase
        .from('companies')
        .select('id, name, logo_url, primary_color, secondary_color, font_family, subdomain, slug')
        .eq('subdomain', companySlug)
        .maybeSingle();

      debugLog += `Subdomain lookup result: ${JSON.stringify(companyBySubdomain, null, 2)}\n`;
      debugLog += `Subdomain error: ${subdomainError?.message || 'none'}\n`;

      let companyData = companyBySubdomain;
      let companyError = subdomainError;

      // If not found by subdomain, try by slug
      if (!companyData && !companyError) {
        console.log('Subdomain lookup failed, trying slug lookup...');
        const { data: companyBySlug, error: slugError } = await supabase
          .from('companies')
          .select('id, name, logo_url, primary_color, secondary_color, font_family, subdomain, slug')
          .eq('slug', companySlug)
          .maybeSingle();
          
        debugLog += `Slug lookup result: ${JSON.stringify(companyBySlug, null, 2)}\n`;
        debugLog += `Slug error: ${slugError?.message || 'none'}\n`;
        
        companyData = companyBySlug;
        companyError = slugError;
      }

      // Try a partial match on subdomain if exact matches fail
      if (!companyData && !companyError) {
        console.log('Exact matches failed, trying partial subdomain match...');
        const { data: partialMatch, error: partialError } = await supabase
          .from('companies')
          .select('id, name, logo_url, primary_color, secondary_color, font_family, subdomain, slug')
          .ilike('subdomain', `%${companySlug}%`)
          .limit(1)
          .maybeSingle();
          
        debugLog += `Partial match result: ${JSON.stringify(partialMatch, null, 2)}\n`;
        debugLog += `Partial error: ${partialError?.message || 'none'}\n`;
        
        companyData = partialMatch;
        companyError = partialError;
      }

      console.log('Final company data:', companyData);
      console.log('Final company error:', companyError);

      if (companyError) {
        console.error('Error fetching company:', companyError);
        debugLog += `Final error: ${companyError.message}\n`;
        setDebugInfo(debugLog);
        setIsLoading(false);
        return;
      }

      if (!companyData) {
        console.log('No company found');
        debugLog += 'No company found with any lookup method\n';
        setDebugInfo(debugLog);
        setIsLoading(false);
        return;
      }

      setCompany(companyData);
      debugLog += `Found company: ${companyData.name} (ID: ${companyData.id})\n`;

      // Fetch published changelogs
      console.log('Fetching changelogs for company:', companyData.id);
      const { data: changelogsData, error: changelogsError } = await supabase
        .from('changelogs')
        .select('id, title, content, category, featured_image_url, tags, published_at, status, visibility')
        .eq('company_id', companyData.id)
        .eq('status', 'published')
        .eq('visibility', 'public')
        .not('published_at', 'is', null)
        .order('published_at', { ascending: false });

      console.log('Changelogs query result:', { changelogsData, changelogsError });
      debugLog += `Changelogs found: ${changelogsData?.length || 0}\n`;
      
      if (changelogsError) {
        console.error('Error fetching changelogs:', changelogsError);
        debugLog += `Changelogs error: ${changelogsError.message}\n`;
      } else {
        setChangelogs(changelogsData || []);
      }

      setDebugInfo(debugLog);
      setIsLoading(false);
    } catch (error) {
      console.error('Error in fetchCompanyAndChangelogs:', error);
      setDebugInfo(`Unexpected error: ${error}`);
      setIsLoading(false);
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !email) return;

    setIsSubscribing(true);
    try {
      const { error } = await supabase
        .from('subscribers')
        .insert({
          company_id: company.id,
          email: email,
          confirmed: false,
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Already subscribed",
            description: "You're already subscribed to our changelog!",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to subscribe. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Subscribed!",
          description: "You'll receive updates when we publish new changes.",
        });
        setEmail("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  const renderContent = (content: any) => {
    if (!content) return null;

    // Handle blocks format (Editor.js format)
    if (content.blocks && Array.isArray(content.blocks)) {
      return content.blocks.map((block: any, index: number) => {
        switch (block.type) {
          case 'paragraph':
            return (
              <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                {block.data?.text || ''}
              </p>
            );
          case 'header':
            const HeaderTag = `h${Math.min(block.data.level || 1, 6)}` as keyof JSX.IntrinsicElements;
            return (
              <HeaderTag key={index} className="font-bold mb-3 text-gray-900">
                {block.data?.text || ''}
              </HeaderTag>
            );
          case 'list':
            const ListTag = block.data?.style === 'ordered' ? 'ol' : 'ul';
            return (
              <ListTag key={index} className="mb-4 pl-6 text-gray-700">
                {(block.data?.items || []).map((item: string, itemIndex: number) => (
                  <li key={itemIndex} className="mb-1">{item}</li>
                ))}
              </ListTag>
            );
          default:
            return null;
        }
      });
    }

    // Handle legacy HTML content
    if (typeof content === 'string') {
      return <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: content }} />;
    }

    return <p className="text-gray-500">No content available</p>;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'new-feature': 'bg-blue-100 text-blue-800',
      'improvement': 'bg-green-100 text-green-800',
      'fix': 'bg-red-100 text-red-800',
      'announcement': 'bg-purple-100 text-purple-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading changelog...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Changelog Not Found</h1>
          <p className="text-gray-600 mb-4">The requested company changelog could not be found.</p>
          
          {/* Debug information */}
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Debug Information (Click to expand)
            </summary>
            <pre className="mt-2 p-4 bg-gray-100 rounded text-xs text-gray-700 overflow-auto max-h-96">
              {debugInfo}
            </pre>
          </details>
        </div>
      </div>
    );
  }

  const primaryColor = company.primary_color || '#3B82F6';
  const fontFamily = company.font_family || 'Inter';

  return (
    <div 
      className="min-h-screen bg-gray-50"
      style={{ fontFamily }}
    >
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-6">
            {company.logo_url && (
              <img
                src={company.logo_url}
                alt={`${company.name} logo`}
                className="h-12 w-12 rounded-lg object-cover"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
              <p className="text-gray-600">Product Updates & Changelog</p>
            </div>
          </div>

          {/* Subscription Form */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Mail className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-3">
                    Subscribe to get notified when we ship new features and updates.
                  </p>
                  <form onSubmit={handleSubscribe} className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="flex-1"
                    />
                    <Button 
                      type="submit" 
                      disabled={isSubscribing}
                      style={{ backgroundColor: primaryColor }}
                    >
                      {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                    </Button>
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {changelogs.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No updates yet</h2>
            <p className="text-gray-600">Check back soon for product updates!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {changelogs.map((changelog) => (
              <Card key={changelog.id} className="overflow-hidden">
                {changelog.featured_image_url && (
                  <div className="aspect-video bg-gray-100">
                    <img
                      src={changelog.featured_image_url}
                      alt={changelog.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={getCategoryColor(changelog.category)}>
                          {changelog.category?.replace('-', ' ')}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl mb-2">{changelog.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(changelog.published_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    {renderContent(changelog.content)}
                  </div>
                  
                  {changelog.tags && changelog.tags.length > 0 && (
                    <>
                      <Separator className="my-4" />
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-gray-400" />
                        <div className="flex flex-wrap gap-1">
                          {changelog.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-6 py-6 text-center">
          <p className="text-sm text-gray-500">
            Powered by Release Hub - Keep your users in the loop
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PublicChangelog;
