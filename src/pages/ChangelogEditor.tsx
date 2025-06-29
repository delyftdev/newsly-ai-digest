import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Send, Image as ImageIcon, Video, Bold, Italic, List, ListOrdered, Heading1, Heading2 } from "lucide-react";
import { useChangelogStore } from "@/stores/changelogStore";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import ImageUpload from "@/components/ImageUpload";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);
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
        // Prevent default browser dialog
        e.preventDefault();
        
        // Save the changelog
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

  // Fix text direction on editor mount and maintain LTR
  useEffect(() => {
    if (editorRef.current) {
      const editor = editorRef.current;
      // Force left-to-right text direction
      editor.style.direction = 'ltr';
      editor.style.textAlign = 'left';
      editor.style.unicodeBidi = 'bidi-override';
      editor.setAttribute('dir', 'ltr');
      
      // Set content if available
      if (content) {
        editor.innerHTML = content;
      }
    }
  }, [content]);

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
      
      // Generate shareable URL
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

  const executeCommand = (command: string, value?: string) => {
    if (!editorRef.current) {
      console.error('Editor ref not available');
      return;
    }
    
    console.log('Executing command:', command, value);
    
    // Focus the editor first
    editorRef.current.focus();
    
    // Execute the command
    const success = document.execCommand(command, false, value);
    console.log('Command execution result:', success);
    
    // Update content state and ensure LTR
    if (editorRef.current) {
      editorRef.current.style.direction = 'ltr';
      editorRef.current.style.textAlign = 'left';
      editorRef.current.style.unicodeBidi = 'bidi-override';
      setContent(editorRef.current.innerHTML);
    }
  };

  const insertVideo = () => {
    if (!videoUrl || !editorRef.current) {
      console.error('Video URL or editor ref not available');
      return;
    }

    console.log('Inserting video:', videoUrl);
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
      editorRef.current.innerHTML += embedHtml;
      setContent(editorRef.current.innerHTML);
      setVideoUrl('');
      setShowVideoDialog(false);
      console.log('Video inserted successfully');
    }
  };

  const handleImageUpload = (file: File) => {
    console.log('Image uploaded:', file.name);
    const imageUrl = URL.createObjectURL(file);
    
    if (editorRef.current) {
      const imageHtml = `<img src="${imageUrl}" alt="Image" style="max-width: 100%; height: auto; margin: 16px 0;" />`;
      editorRef.current.innerHTML += imageHtml;
      setContent(editorRef.current.innerHTML);
    }
    
    setFeaturedImage(imageUrl);
    setShowImageDialog(false);
  };

  const insertImage = () => {
    if (featuredImage && editorRef.current) {
      console.log('Inserting image:', featuredImage);
      const imageHtml = `<img src="${featuredImage}" alt="Image" style="max-width: 100%; height: auto; margin: 16px 0;" />`;
      editorRef.current.innerHTML += imageHtml;
      setContent(editorRef.current.innerHTML);
    }
  };

  const handleEditorInput = (e: React.FormEvent<HTMLDivElement>) => {
    console.log('Editor input event');
    if (editorRef.current) {
      // Force LTR direction on every input
      editorRef.current.style.direction = 'ltr';
      editorRef.current.style.textAlign = 'left';
      editorRef.current.style.unicodeBidi = 'bidi-override';
      setContent(editorRef.current.innerHTML);
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

          {/* Always Visible Formatting Toolbar */}
          <div className="mb-4 p-3 border rounded-md bg-muted/30">
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => executeCommand('bold')}
                className="h-8 w-8 p-0"
                title="Bold"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => executeCommand('italic')}
                className="h-8 w-8 p-0"
                title="Italic"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => executeCommand('formatBlock', 'h1')}
                className="h-8 w-8 p-0"
                title="Heading 1"
              >
                <Heading1 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => executeCommand('formatBlock', 'h2')}
                className="h-8 w-8 p-0"
                title="Heading 2"
              >
                <Heading2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => executeCommand('insertUnorderedList')}
                className="h-8 w-8 p-0"
                title="Bullet List"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => executeCommand('insertOrderedList')}
                className="h-8 w-8 p-0"
                title="Numbered List"
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
              
              <div className="w-px h-6 bg-border mx-2" />
              
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setShowImageDialog(true)}
                title="Add Image"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setShowVideoDialog(true)}
                title="Add Video"
              >
                <Video className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content Editor */}
          <div className="relative">
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning={true}
              onInput={handleEditorInput}
              className="prose prose-lg max-w-none dark:prose-invert min-h-[400px] focus:outline-none text-foreground border rounded-lg p-4"
              style={{ 
                direction: 'ltr',
                textAlign: 'left',
                unicodeBidi: 'bidi-override'
              }}
            />
            
            {!content && (
              <div className="absolute top-6 left-6 text-muted-foreground/50 pointer-events-none">
                Tell your story...
              </div>
            )}
          </div>
        </div>

        {/* Video Dialog */}
        <Dialog open={showVideoDialog} onOpenChange={setShowVideoDialog}>
          <DialogContent className="bg-popover">
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
          <DialogContent className="bg-popover">
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
