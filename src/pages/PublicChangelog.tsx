
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Tag
} from "lucide-react";

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
  created_at: string;
}

const PublicChangelog = () => {
  const { companySlug } = useParams<{ companySlug: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [changelogs, setChangelogs] = useState<Changelog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (companySlug) {
      fetchCompanyAndChangelogs();
    }
  }, [companySlug]);

  const fetchCompanyAndChangelogs = async () => {
    try {
      console.log('Fetching company and changelogs for:', companySlug);
      
      // Try to find by subdomain first, then by slug
      let { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('id, name, logo_url, primary_color, secondary_color, font_family, subdomain, slug')
        .eq('subdomain', companySlug)
        .maybeSingle();

      if (!companyData && !companyError) {
        const { data: companyBySlug, error: slugError } = await supabase
          .from('companies')
          .select('id, name, logo_url, primary_color, secondary_color, font_family, subdomain, slug')
          .eq('slug', companySlug)
          .maybeSingle();
          
        companyData = companyBySlug;
        companyError = slugError;
      }

      console.log('Company lookup result:', { companyData, companyError });

      if (companyError || !companyData) {
        console.error('Error fetching company:', companyError);
        setIsLoading(false);
        return;
      }

      setCompany(companyData);

      // Fetch published changelogs
      const { data: changelogsData, error: changelogsError } = await supabase
        .from('changelogs')
        .select('id, title, content, category, featured_image_url, tags, published_at, status, visibility, created_at')
        .eq('company_id', companyData.id)
        .eq('status', 'published')
        .eq('visibility', 'public')
        .not('published_at', 'is', null)
        .order('published_at', { ascending: false });

      console.log('Changelogs query result:', { changelogsData, changelogsError });
      
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'new-feature': return '✨';
      case 'improvement': return '📈';
      case 'fix': return '🐛';
      default: return '📢';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'new-feature': return 'New Feature';
      case 'improvement': return 'Improvement';
      case 'fix': return 'Bug Fix';
      default: return 'Announcement';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading changelog...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto p-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Changelog Not Found</h1>
          <p className="text-muted-foreground mb-4">The requested company changelog could not be found.</p>
        </div>
      </div>
    );
  }

  const primaryColor = company.primary_color || '#3B82F6';
  const fontFamily = company.font_family || 'Inter';

  return (
    <div 
      className="min-h-screen bg-background"
      style={{ fontFamily }}
    >
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            {company.logo_url && (
              <img
                src={company.logo_url}
                alt={`${company.name} logo`}
                className="h-10 w-10 rounded-lg object-cover"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-foreground">{company.name}</h1>
              <p className="text-muted-foreground">Product Updates & Changelog</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-0">
              {changelogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No changelog entries yet. Check back soon for updates!</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {changelogs.map((changelog) => (
                    <div key={changelog.id} className="p-6 hover:bg-accent/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-lg">{getCategoryIcon(changelog.category)}</span>
                            <h3 className="text-lg font-semibold text-foreground">{changelog.title}</h3>
                            <Badge variant="default">
                              published
                            </Badge>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(changelog.published_at).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <Tag className="h-4 w-4 mr-1" />
                              {getCategoryLabel(changelog.category)}
                            </div>
                          </div>

                          {changelog.tags && changelog.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {changelog.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-12">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center">
          <p className="text-sm text-muted-foreground">
            Powered by Release Hub - Keep your users in the loop
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PublicChangelog;
