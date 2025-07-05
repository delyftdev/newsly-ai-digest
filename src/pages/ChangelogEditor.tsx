
import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, MessageSquare, X } from "lucide-react";
import { useChangelogStore } from "@/stores/changelogStore";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import TipTapEditor from "@/components/TipTapEditor";
import AIWriterChat from "@/components/AIWriterChat";

// Debounce utility function
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

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
  const [aiGenerated, setAiGenerated] = useState(false);
  const [showAIWriter, setShowAIWriter] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const isEditing = Boolean(id);

  // Determine if there's content for showing the publish button
  const hasContent = useMemo(() => 
    Boolean(title?.trim() || content?.trim()), 
    [title, content]
  );

  // Show publish button logic
  const showPublishButton = isEditing 
    ? currentChangelog?.status === 'draft'
    : hasContent;

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
      
      // Improved content parsing to handle different formats
      let parsedContent = '';
      if (currentChangelog.content) {
        if (typeof currentChangelog.content === 'string') {
          // If it's a string, try to parse as JSON first, then use as-is
          try {
            const jsonContent = JSON.parse(currentChangelog.content);
            parsedContent = jsonContent.html || jsonContent.content || currentChangelog.content;
          } catch {
            parsedContent = currentChangelog.content;
          }
        } else if (currentChangelog.content.html) {
          parsedContent = currentChangelog.content.html;
        } else if (currentChangelog.content.content) {
          parsedContent = currentChangelog.content.content;
        }
      }
      
      console.log('Parsed content:', parsedContent);
      setContent(parsedContent);
      setCategory(currentChangelog.category);
      setFeaturedImage(currentChangelog.featured_image_url || "");
      setVideoUrl(currentChangelog.video_url || "");
      setAiGenerated(currentChangelog.ai_generated || false);
    }
  }, [currentChangelog]);

  // Debounced auto-save function with improved navigation logic
  const debouncedAutoSave = useCallback(
    debounce(async (saveData: any) => {
      if (!saveData.title?.trim() && !saveData.content?.trim()) return;
      
      try {
        if (isEditing && id) {
          // Update existing changelog
          await autoSaveChangelog(id, saveData);
        } else if (!isTyping) {
          // Only create new changelog when not actively typing
          const result = await createChangelog({
            ...saveData,
            status: 'draft',
          });
          if (result.data?.id) {
            // Fixed: Navigate to edit route instead of view route
            navigate(`/changelogs/${result.data.id}/edit`, { replace: true });
          }
        }
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, 1000), // Increased debounce time to prevent premature navigation
    [isEditing, id, autoSaveChangelog, createChangelog, navigate, isTyping]
  );

  // Auto-save on content change
  useEffect(() => {
    if (title || content) {
      const saveData = {
        title,
        content: { html: content },
        category,
        featured_image_url: featuredImage,
        video_url: videoUrl,
        visibility: 'public' as const,
        tags: [],
        ai_generated: aiGenerated,
      };
      
      debouncedAutoSave(saveData);
    }
  }, [title, content, category, featuredImage, videoUrl, aiGenerated, debouncedAutoSave]);

  // Handle title changes with typing state
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsTyping(true);
    setTitle(e.target.value);
    
    // Clear typing state after user stops typing
    setTimeout(() => setIsTyping(false), 1500);
  };

  // Handle content changes with typing state
  const handleContentChange = (newContent: string) => {
    setIsTyping(true);
    setContent(newContent);
    
    // Clear typing state after user stops typing
    setTimeout(() => setIsTyping(false), 1500);
  };

  // Save draft before leaving page
  useEffect(() => {
    const handleBeforeUnload = async (e: BeforeUnloadEvent) => {
      if ((title?.trim() || content?.trim()) && !isEditing) {
        e.preventDefault();
        e.returnValue = '';
        
        // Try to save as draft
        try {
          await createChangelog({
            title: title || "Untitled Changelog",
            content: { html: content },
            category,
            status: 'draft',
            featured_image_url: featuredImage,
            video_url: videoUrl,
            visibility: 'public' as const,
            tags: [],
            ai_generated: aiGenerated,
          });
        } catch (error) {
          console.error('Failed to save draft on page unload:', error);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [title, content, category, featuredImage, videoUrl, aiGenerated, isEditing, createChangelog]);

  const handlePublish = async () => {
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please add a title before publishing",
        variant: "destructive",
      });
      return;
    }

    setIsPublishing(true);
    
    try {
      let changelogId = id;
      
      // If this is a new changelog, save it first
      if (!isEditing) {
        const result = await createChangelog({
          title,
          content: { html: content },
          category,
          status: 'draft',
          featured_image_url: featuredImage,
          video_url: videoUrl,
          visibility: 'public' as const,
          tags: [],
          ai_generated: aiGenerated,
        });
        
        if (result.error) {
          throw new Error(result.error);
        }
        
        changelogId = result.data?.id;
      }
      
      if (changelogId) {
        const { error } = await publishChangelog(changelogId);
        if (error) throw new Error(error);
        
        toast({ 
          title: "Changelog Published!", 
          description: "Your changelog is now live and visible to your audience." 
        });
        
        // Navigate to the published changelog if we were creating a new one
        if (!isEditing) {
          navigate(`/changelogs/${changelogId}/edit`);
        }
      }
    } catch (error: any) {
      console.error('Publish error:', error);
      toast({
        title: "Publish Failed",
        description: error.message || "Failed to publish changelog",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleContentGenerated = (generatedContent: string) => {
    setContent(generatedContent);
    setAiGenerated(true);
    toast({
      title: "Content Generated!",
      description: "AI has created content for your changelog.",
    });
  };

  const handleInsertContent = (contentToInsert: string) => {
    // Insert content at current cursor position or append to existing content
    if (content.trim()) {
      setContent(prev => prev + '\n\n' + contentToInsert);
    } else {
      setContent(contentToInsert);
    }
    setAiGenerated(true);
  };

  const toggleAIWriter = () => {
    setShowAIWriter(!showAIWriter);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" onClick={() => navigate('/changelogs')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant={showAIWriter ? "default" : "ghost"}
                  size="sm"
                  onClick={toggleAIWriter}
                  className={showAIWriter ? "bg-purple-600 hover:bg-purple-700" : "text-purple-600 hover:text-purple-700"}
                >
                  {showAIWriter ? <X className="h-4 w-4 mr-2" /> : <MessageSquare className="h-4 w-4 mr-2" />}
                  {showAIWriter ? 'Close AI Writer' : 'AI Writer'}
                </Button>

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
                
                {showPublishButton && (
                  <Button onClick={handlePublish} disabled={isPublishing}>
                    <Send className="h-4 w-4 mr-2" />
                    {isPublishing ? 'Publishing...' : 'Publish'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex h-[calc(100vh-80px)]">
          {/* Editor Canvas */}
          <div className={`flex-1 transition-all duration-300 ${showAIWriter ? 'mr-96' : ''}`}>
            <div className="max-w-4xl mx-auto px-6 py-8 h-full overflow-y-auto">
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
                  onChange={handleTitleChange}
                  placeholder="Untitled"
                  className="text-4xl font-bold border-none shadow-none p-0 h-auto bg-transparent focus-visible:ring-0 placeholder:text-muted-foreground/50"
                  style={{ 
                    fontSize: '2.25rem', 
                    lineHeight: '2.5rem',
                  }}
                />
              </div>

              {/* TipTap Editor */}
              <TipTapEditor
                content={content}
                onChange={handleContentChange}
                placeholder="Tell your story..."
              />
            </div>
          </div>

          {/* AI Writer Side Panel */}
          {showAIWriter && (
            <div className="fixed right-0 top-[80px] w-96 h-[calc(100vh-80px)] bg-background border-l shadow-lg z-40">
              <AIWriterChat
                onContentGenerated={handleContentGenerated}
                onInsertContent={handleInsertContent}
              />
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ChangelogEditor;
