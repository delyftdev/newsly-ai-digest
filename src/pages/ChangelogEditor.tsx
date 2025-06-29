
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Send } from "lucide-react";
import { useChangelogStore } from "@/stores/changelogStore";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import TipTapEditor from "@/components/TipTapEditor";

const ChangelogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    currentChangelog, 
    fetchChangelog, 
    createChangelog, 
    updateChangelog, 
    publishChangelog,
    autoSaveChangelog 
  } = useChangelogStore();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("announcement");
  const [featuredImage, setFeaturedImage] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [visibility, setVisibility] = useState<'public' | 'private'>("public");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing && id) {
      console.log('Fetching changelog with ID:', id);
      fetchChangelog(id);
    }
  }, [isEditing, id, fetchChangelog]);

  useEffect(() => {
    if (currentChangelog) {
      console.log('Loading changelog data:', currentChangelog);
      setTitle(currentChangelog.title);
      setContent(typeof currentChangelog.content === 'string' 
        ? currentChangelog.content 
        : currentChangelog.content?.html || ''
      );
      setCategory(currentChangelog.category);
      setFeaturedImage(currentChangelog.featured_image_url || "");
      setVideoUrl(currentChangelog.video_url || "");
      setVisibility(currentChangelog.visibility);
    }
  }, [currentChangelog]);

  // Auto-save functionality
  useEffect(() => {
    if (isEditing && id && (title || content)) {
      console.log('Auto-saving changelog');
      autoSaveChangelog(id, {
        title,
        content: { html: content },
        category,
        featured_image_url: featuredImage,
        video_url: videoUrl,
        visibility,
      });
      setLastSaved(new Date());
    }
  }, [title, content, category, featuredImage, videoUrl, visibility]);

  // Auto-save before leaving page
  useEffect(() => {
    const handleBeforeUnload = async (e: BeforeUnloadEvent) => {
      if (isEditing && id && (title.trim() || content.trim())) {
        e.preventDefault();
        
        try {
          await updateChangelog(id, {
            title,
            content: { html: content },
            category,
            featured_image_url: featuredImage,
            video_url: videoUrl,
            visibility,
            tags: [],
          });
          console.log('Auto-saved before page unload');
        } catch (error) {
          console.error('Failed to auto-save before unload:', error);
        }
      }
    };

    const handlePopState = async () => {
      if (isEditing && id && (title.trim() || content.trim())) {
        try {
          await updateChangelog(id, {
            title,
            content: { html: content },
            category,
            featured_image_url: featuredImage,
            video_url: videoUrl,
            visibility,
            tags: [],
          });
          console.log('Auto-saved on navigation');
        } catch (error) {
          console.error('Failed to auto-save on navigation:', error);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isEditing, id, title, content, category, featuredImage, videoUrl, visibility, updateChangelog]);

  const handleSave = async () => {
    console.log('=== SAVE CLICKED ===');
    console.log('Current state:', { title, content, category, visibility });
    
    if (!title.trim()) {
      console.error('Save failed: Title is required');
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const changelogData = {
        title,
        content: { html: content },
        category,
        status: 'draft' as const,
        featured_image_url: featuredImage,
        video_url: videoUrl,
        visibility,
        tags: [],
      };

      console.log('=== ATTEMPTING TO SAVE ===');
      console.log('Data being saved:', JSON.stringify(changelogData, null, 2));

      if (isEditing && id) {
        console.log('Updating existing changelog:', id);
        const result = await updateChangelog(id, changelogData);
        console.log('Update result:', result);
        if (result.error) {
          console.error('Update failed:', result.error);
          throw new Error(result.error);
        }
        console.log('✅ Update successful');
        toast({ title: "Changelog updated!" });
      } else {
        console.log('Creating new changelog');
        const result = await createChangelog(changelogData);
        console.log('Create result:', result);
        if (result.error) {
          console.error('Create failed:', result.error);
          throw new Error(result.error);
        }
        console.log('✅ Create successful');
        toast({ title: "Changelog created!" });
        if (result.data?.id) {
          console.log('Navigating to:', `/changelogs/${result.data.id}`);
          navigate(`/changelogs/${result.data.id}`);
        } else {
          console.log('Navigating to changelogs list');
          navigate('/changelogs');
        }
      }
    } catch (error: any) {
      console.error('=== SAVE ERROR ===');
      console.error('Error details:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      toast({
        title: "Error",
        description: error.message || "Failed to save changelog",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!currentChangelog) return;
    
    try {
      console.log('Publishing changelog:', currentChangelog.id);
      const { error } = await publishChangelog(currentChangelog.id);
      if (error) throw new Error(error);
      
      const shareableUrl = `${window.location.origin}/changelog/${currentChangelog.public_slug}`;
      
      toast({ 
        title: "Changelog published!", 
        description: `Share at: ${shareableUrl}` 
      });
    } catch (error: any) {
      console.error('Publish error:', error);
      toast({
        title: "Error",
        description: "Failed to publish changelog",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b z-10">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" onClick={() => navigate('/changelogs')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                {lastSaved && (
                  <Badge variant="outline" className="text-xs text-muted-foreground">
                    Auto-saved {lastSaved.toLocaleTimeString()}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="px-3 py-1 border border-input bg-background text-foreground rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring z-50"
                  style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
                >
                  <option value="announcement" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>📢 Announcement</option>
                  <option value="new-feature" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>✨ New Feature</option>
                  <option value="improvement" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>📈 Improvement</option>
                  <option value="fix" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>🐛 Bug Fix</option>
                </select>
                
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as 'public' | 'private')}
                  className="px-3 py-1 border border-input bg-background text-foreground rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring z-50"
                  style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
                >
                  <option value="public" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>Public</option>
                  <option value="private" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>Private</option>
                </select>

                <Button variant="outline" onClick={handleSave} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Draft'}
                </Button>
                
                {isEditing && currentChangelog?.status === 'draft' && (
                  <Button onClick={handlePublish}>
                    <Send className="h-4 w-4 mr-2" />
                    Publish
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Editor Canvas */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Featured Image */}
          {featuredImage && (
            <div className="mb-8">
              <img 
                src={featuredImage} 
                alt="Featured" 
                className="w-full rounded-lg shadow-sm max-h-96 object-cover"
              />
            </div>
          )}

          {/* Title */}
          <div className="mb-6">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled"
              className="text-4xl font-bold border-none shadow-none p-0 h-auto bg-transparent focus-visible:ring-0 placeholder:text-muted-foreground/50"
              style={{ 
                fontSize: '2.25rem', 
                lineHeight: '2.5rem',
                direction: 'ltr',
                textAlign: 'left'
              }}
            />
          </div>

          {/* TipTap Editor */}
          <TipTapEditor
            content={content}
            onChange={setContent}
            placeholder="Tell your story..."
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ChangelogEditor;
