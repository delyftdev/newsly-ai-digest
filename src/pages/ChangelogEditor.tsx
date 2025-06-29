
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Send, Plus, Image as ImageIcon, Video, Camera, Type, Bold, Italic, List, ListOrdered } from "lucide-react";
import { useChangelogStore } from "@/stores/changelogStore";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import ImageUpload from "@/components/ImageUpload";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
  const [showToolbar, setShowToolbar] = useState(false);
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);

  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing && id) {
      fetchChangelog(id);
    }
  }, [isEditing, id, fetchChangelog]);

  useEffect(() => {
    if (currentChangelog) {
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

  const handleSave = async () => {
    if (!title.trim()) {
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

      if (isEditing && id) {
        const { error } = await updateChangelog(id, changelogData);
        if (error) throw new Error(error);
        toast({ title: "Changelog updated!" });
      } else {
        const { error } = await createChangelog(changelogData);
        if (error) throw new Error(error);
        toast({ title: "Changelog created!" });
        navigate('/changelogs');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changelog",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!currentChangelog) return;
    
    try {
      const { error } = await publishChangelog(currentChangelog.id);
      if (error) throw new Error(error);
      toast({ title: "Changelog published!" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish changelog",
        variant: "destructive",
      });
    }
  };

  const insertVideo = () => {
    if (!videoUrl) return;

    let embedHtml = '';
    
    // YouTube
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      const videoId = videoUrl.includes('youtu.be') 
        ? videoUrl.split('youtu.be/')[1]?.split('?')[0]
        : videoUrl.split('v=')[1]?.split('&')[0];
      
      if (videoId) {
        embedHtml = `<div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; margin: 16px 0;">
          <iframe src="https://www.youtube.com/embed/${videoId}" 
                  style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" 
                  frameborder="0" allowfullscreen></iframe>
        </div>`;
      }
    }
    // Vimeo
    else if (videoUrl.includes('vimeo.com')) {
      const videoId = videoUrl.split('vimeo.com/')[1]?.split('?')[0];
      if (videoId) {
        embedHtml = `<div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; margin: 16px 0;">
          <iframe src="https://player.vimeo.com/video/${videoId}" 
                  style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" 
                  frameborder="0" allowfullscreen></iframe>
        </div>`;
      }
    }
    // Generic video URL
    else {
      embedHtml = `<video controls style="width: 100%; max-width: 100%; margin: 16px 0;">
        <source src="${videoUrl}" type="video/mp4">
        Your browser does not support the video tag.
      </video>`;
    }

    if (embedHtml) {
      setContent(content + embedHtml);
      setVideoUrl('');
      setShowVideoDialog(false);
    }
  };

  const handleImageUpload = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setFeaturedImage(imageUrl);
    setShowImageDialog(false);
  };

  const insertImage = () => {
    if (featuredImage) {
      const imageHtml = `<img src="${featuredImage}" alt="Image" style="max-width: 100%; height: auto; margin: 16px 0;" />`;
      setContent(content + imageHtml);
    }
  };

  const formatText = (command: string) => {
    document.execCommand(command, false);
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
                  className="px-3 py-1 border border-input bg-background text-foreground rounded-md text-sm"
                >
                  <option value="announcement">📢 Announcement</option>
                  <option value="new-feature">✨ New Feature</option>
                  <option value="improvement">📈 Improvement</option>
                  <option value="fix">🐛 Bug Fix</option>
                </select>
                
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as 'public' | 'private')}
                  className="px-3 py-1 border border-input bg-background text-foreground rounded-md text-sm"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
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
              style={{ fontSize: '2.25rem', lineHeight: '2.5rem' }}
            />
          </div>

          {/* Toolbar */}
          {showToolbar && (
            <div className="flex items-center space-x-2 mb-4 p-2 border rounded-md bg-card">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => formatText('bold')}
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => formatText('italic')}
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => formatText('insertUnorderedList')}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => formatText('insertOrderedList')}
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
              <div className="w-px h-6 bg-border mx-2" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowImageDialog(true)}
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowVideoDialog(true)}
              >
                <Video className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Content Editor */}
          <div className="relative">
            <div
              contentEditable
              suppressContentEditableWarning={true}
              onInput={(e) => setContent(e.currentTarget.innerHTML)}
              onFocus={() => setShowToolbar(true)}
              onBlur={() => setTimeout(() => setShowToolbar(false), 200)}
              className="prose prose-lg max-w-none dark:prose-invert min-h-[400px] focus:outline-none text-foreground"
              style={{ direction: 'ltr' }}
              dangerouslySetInnerHTML={{ __html: content }}
            />
            
            {!content && !showToolbar && (
              <div className="absolute top-0 left-0 text-muted-foreground/50 pointer-events-none">
                Tell your story...
              </div>
            )}

            {/* Plus Button */}
            {showToolbar && (
              <Button
                variant="outline"
                size="sm"
                className="absolute -left-12 top-0"
                onClick={() => setShowToolbar(!showToolbar)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Video Dialog */}
        <Dialog open={showVideoDialog} onOpenChange={setShowVideoDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Video</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Enter YouTube, Vimeo, or direct video URL"
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowVideoDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={insertVideo}>Add Video</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Image Dialog */}
        <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Featured Image</DialogTitle>
            </DialogHeader>
            <ImageUpload
              onImageUpload={handleImageUpload}
              currentImage={featuredImage}
              onImageRemove={() => setFeaturedImage("")}
            />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default ChangelogEditor;
