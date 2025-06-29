
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Calendar, Tag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Changelog } from '@/stores/changelogStore';

const PublicChangelogEntry = () => {
  const { slug } = useParams();
  const [changelog, setChangelog] = useState<Changelog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChangelog = async () => {
      if (!slug) return;
      
      try {
        const { data, error } = await supabase
          .from('changelogs')
          .select('*')
          .eq('public_slug', slug)
          .eq('status', 'published')
          .eq('visibility', 'public')
          .single();

        if (error) throw error;
        
        // Transform database row to match Changelog interface
        const transformedData: Changelog = {
          ...data,
          status: data.status as 'draft' | 'published',
          visibility: data.visibility as 'public' | 'private',
          tags: data.tags || [],
        };
        
        setChangelog(transformedData);
      } catch (error) {
        console.error('Error fetching changelog:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChangelog();
  }, [slug]);

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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading changelog...</p>
        </div>
      </div>
    );
  }

  if (!changelog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Changelog Not Found</h1>
          <p className="text-muted-foreground">The changelog entry you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-card rounded-lg shadow-sm border p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl">{getCategoryIcon(changelog.category)}</span>
              <h1 className="text-3xl font-bold text-foreground">{changelog.title}</h1>
            </div>

            <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(changelog.published_at || changelog.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                {getCategoryLabel(changelog.category)}
              </div>
            </div>

            {changelog.tags && changelog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {changelog.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Featured Image */}
          {changelog.featured_image_url && (
            <div className="mb-8">
              <img 
                src={changelog.featured_image_url} 
                alt="Featured"
                className="w-full rounded-lg shadow-sm"
              />
            </div>
          )}

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ 
              __html: typeof changelog.content === 'string' 
                ? changelog.content 
                : changelog.content?.html || '' 
            }}
          />

          {/* Video */}
          {changelog.video_url && (
            <div className="mt-8">
              <div className="aspect-video">
                {changelog.video_url.includes('youtube.com') || changelog.video_url.includes('youtu.be') ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${
                      changelog.video_url.includes('youtu.be') 
                        ? changelog.video_url.split('youtu.be/')[1]?.split('?')[0]
                        : changelog.video_url.split('v=')[1]?.split('&')[0]
                    }`}
                    className="w-full h-full rounded-lg"
                    frameBorder="0"
                    allowFullScreen
                  />
                ) : changelog.video_url.includes('vimeo.com') ? (
                  <iframe
                    src={`https://player.vimeo.com/video/${changelog.video_url.split('vimeo.com/')[1]?.split('?')[0]}`}
                    className="w-full h-full rounded-lg"
                    frameBorder="0"
                    allowFullScreen
                  />
                ) : (
                  <video controls className="w-full h-full rounded-lg">
                    <source src={changelog.video_url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicChangelogEntry;
