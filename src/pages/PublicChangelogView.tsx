
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Tag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface PublicChangelog {
  id: string;
  title: string;
  content: any;
  category: string;
  featured_image_url?: string;
  video_url?: string;
  tags: string[];
  published_at: string;
  company: {
    name: string;
    subdomain: string;
    logo_url?: string;
  };
}

const PublicChangelogView = () => {
  const { companySlug, changelogSlug } = useParams();
  const [changelog, setChangelog] = useState<PublicChangelog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchChangelog();
  }, [companySlug, changelogSlug]);

  const fetchChangelog = async () => {
    if (!companySlug || !changelogSlug) return;

    try {
      setLoading(true);
      
      // Fetch the published changelog with company info
      const { data, error: fetchError } = await supabase
        .from('changelogs')
        .select(`
          id,
          title,
          content,
          category,
          featured_image_url,
          video_url,
          tags,
          published_at,
          companies!inner (
            name,
            subdomain,
            logo_url
          )
        `)
        .eq('public_slug', changelogSlug)
        .eq('companies.subdomain', companySlug)
        .eq('status', 'published')
        .eq('visibility', 'public')
        .single();

      if (fetchError) {
        console.error('Error fetching changelog:', fetchError);
        setError('Changelog not found');
        return;
      }

      if (!data) {
        setError('Changelog not found');
        return;
      }

      setChangelog({
        ...data,
        company: data.companies
      });
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load changelog');
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading changelog...</p>
        </div>
      </div>
    );
  }

  if (error || !changelog) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Changelog Not Found</h1>
          <p className="text-muted-foreground mb-4">{error || 'The requested changelog could not be found.'}</p>
          <Button onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              {changelog.company.logo_url && (
                <img 
                  src={changelog.company.logo_url} 
                  alt={changelog.company.name}
                  className="h-8 w-8 rounded"
                />
              )}
              <div>
                <h1 className="text-xl font-semibold text-foreground">{changelog.company.name}</h1>
                <p className="text-sm text-muted-foreground">Changelog</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Card>
          <CardContent className="p-8">
            {/* Featured Image */}
            {changelog.featured_image_url && (
              <div className="mb-8">
                <img 
                  src={changelog.featured_image_url} 
                  alt="Featured" 
                  className="w-full rounded-lg shadow-sm max-h-96 object-cover"
                />
              </div>
            )}

            {/* Title and Meta */}
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-2xl">{getCategoryIcon(changelog.category)}</span>
                <Badge variant="secondary">
                  {getCategoryLabel(changelog.category)}
                </Badge>
              </div>
              
              <h1 className="text-4xl font-bold text-foreground mb-4">
                {changelog.title}
              </h1>
              
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(changelog.published_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>

              {/* Tags */}
              {changelog.tags && changelog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {changelog.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none dark:prose-invert text-foreground"
              dangerouslySetInnerHTML={{ 
                __html: typeof changelog.content === 'string' 
                  ? changelog.content 
                  : changelog.content?.html || ''
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PublicChangelogView;
