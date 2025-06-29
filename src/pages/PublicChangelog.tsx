
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
}

interface Changelog {
  id: string;
  title: string;
  content: any;
  category: string;
  featured_image_url?: string;
  tags?: string[];
  published_at: string;
}

const PublicChangelog = () => {
  const { companySlug } = useParams<{ companySlug: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [changelogs, setChangelogs] = useState<Changelog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    if (companySlug) {
      fetchCompanyAndChangelogs();
    }
  }, [companySlug]);

  const fetchCompanyAndChangelogs = async () => {
    try {
      // First try to fetch by subdomain, then by slug
      let { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('id, name, logo_url, primary_color, secondary_color, font_family')
        .eq('subdomain', companySlug)
        .single();

      // If not found by subdomain, try by slug
      if (companyError && companyError.code === 'PGRST116') {
        const { data: companyBySlug, error: slugError } = await supabase
          .from('companies')
          .select('id, name, logo_url, primary_color, secondary_color, font_family')
          .eq('slug', companySlug)
          .single();
        
        companyData = companyBySlug;
        companyError = slugError;
      }

      if (companyError) {
        console.error('Error fetching company:', companyError);
        setIsLoading(false);
        return;
      }

      setCompany(companyData);

      // Fetch published changelogs
      const { data: changelogsData, error: changelogsError } = await supabase
        .from('changelogs')
        .select('id, title, content, category, featured_image_url, tags, published_at')
        .eq('company_id', companyData.id)
        .eq('status', 'published')
        .eq('visibility', 'public')
        .order('published_at', { ascending: false });

      if (changelogsError) {
        console.error('Error fetching changelogs:', changelogsError);
      } else {
        setChangelogs(changelogsData || []);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error in fetchCompanyAndChangelogs:', error);
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
    if (!content || !content.blocks) return null;

    return content.blocks.map((block: any, index: number) => {
      switch (block.type) {
        case 'paragraph':
          return (
            <p key={index} className="mb-4 text-gray-700 leading-relaxed">
              {block.data.text}
            </p>
          );
        case 'header':
          const HeaderTag = `h${Math.min(block.data.level || 1, 6)}` as keyof JSX.IntrinsicElements;
          return (
            <HeaderTag key={index} className="font-bold mb-3 text-gray-900">
              {block.data.text}
            </HeaderTag>
          );
        case 'list':
          const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
          return (
            <ListTag key={index} className="mb-4 pl-6 text-gray-700">
              {block.data.items.map((item: string, itemIndex: number) => (
                <li key={itemIndex} className="mb-1">{item}</li>
              ))}
            </ListTag>
          );
        default:
          return null;
      }
    });
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Changelog Not Found</h1>
          <p className="text-gray-600">The requested changelog could not be found.</p>
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
