
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
    autoSaveChangelog,
    loading 
  } = useChangelogStore();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("announcement");
  const [featuredImage, setFeaturedImage] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [aiGenerated, setAiGenerated] = useState(false);
  const [showAIWriter, setShowAIWriter] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [contentLoaded, setContentLoaded] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);

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

  // Enhanced content extraction with comprehensive logging and format support
  const extractContentString = useCallback((contentData: any): string => {
    console.log('=== EXTRACTING CONTENT ===');
    console.log('Raw content data:', contentData);
    console.log('Content type:', typeof contentData);
    
    if (!contentData) {
      console.log('No content data provided, returning empty string');
      return '';
    }
    
    if (typeof contentData === 'string') {
      console.log('Content is string format:', contentData.substring(0, 100) + '...');
      return contentData;
    }
    
    if (typeof contentData === 'object') {
      console.log('Content is object format:', Object.keys(contentData));
      
      // Handle {html: "content"} format (most common TipTap format)
      if (contentData.html && typeof contentData.html === 'string') {
        console.log('Found HTML property:', contentData.html.substring(0, 100) + '...');
        return contentData.html;
      }
      
      // Handle {content: "content"} format
      if (contentData.content && typeof contentData.content === 'string') {
        console.log('Found content property:', contentData.content.substring(0, 100) + '...');
        return contentData.content;
      }
      
      // Handle TipTap JSON format {type: "doc", content: [...]}
      if (contentData.type === 'doc' && Array.isArray(contentData.content)) {
        console.log('Found TipTap JSON format, converting to HTML...');
        try {
          // Simple conversion for common TipTap JSON structure
          let htmlContent = '';
          contentData.content.forEach((node: any) => {
            if (node.type === 'paragraph' && node.content) {
              htmlContent += '<p>';
              node.content.forEach((textNode: any) => {
                if (textNode.type === 'text') {
                  htmlContent += textNode.text || '';
                }
              });
              htmlContent += '</p>';
            } else if (node.type === 'heading' && node.content) {
              const level = node.attrs?.level || 1;
              htmlContent += `<h${level}>`;
              node.content.forEach((textNode: any) => {
                if (textNode.type === 'text') {
                  htmlContent += textNode.text || '';
                }
              });
              htmlContent += `</h${level}>`;
            }
          });
          console.log('Converted TipTap JSON to HTML:', htmlContent.substring(0, 100) + '...');
          return htmlContent;
        } catch (e) {
          console.error('Failed to convert TipTap JSON to HTML:', e);
        }
      }
      
      // Handle nested object formats
      if (contentData.data && typeof contentData.data === 'string') {
        console.log('Found data property:', contentData.data.substring(0, 100) + '...');
        return contentData.data;
      }

      // Handle array formats (some editors use arrays)
      if (Array.isArray(contentData) && contentData.length > 0) {
        console.log('Content is array format, attempting to join');
        return contentData.join('');
      }

      // Try to stringify if it's a complex object
      try {
        const stringified = JSON.stringify(contentData);
        console.log('Stringified content:', stringified.substring(0, 100) + '...');
        return stringified;
      } catch (e) {
        console.error('Failed to stringify content:', e);
      }
    }
    
    console.log('Could not extract content, returning empty string');
    return '';
  }, []);

  // Fetch changelog data when editing
  useEffect(() => {
    if (isEditing && id) {
      console.log('=== FETCHING CHANGELOG ===');
      console.log('Changelog ID:', id);
      setLoadingContent(true);
      setContentLoaded(false);
      fetchChangelog(id).finally(() => {
        setLoadingContent(false);
      });
    }
  }, [isEditing, id, fetchChangelog]);

  // Load content into editor when currentChangelog changes
  useEffect(() => {
    if (currentChangelog && !contentLoaded && !loadingContent) {
      console.log('=== LOADING CHANGELOG DATA ===');
      console.log('Current changelog:', currentChangelog);
      console.log('Raw content field:', currentChangelog.content);
      
      setTitle(currentChangelog.title || '');
      
      // Enhanced content parsing with detailed logging
      const extractedContent = extractContentString(currentChangelog.content);
      console.log('Extracted content length:', extractedContent.length);
      console.log('Extracted content preview:', extractedContent.substring(0, 200) + '...');
      
      // Validate content before setting
      if (extractedContent && extractedContent.trim().length > 0) {
        console.log('Setting content in editor');
        setContent(extractedContent);
      } else {
        console.warn('No valid content found, setting empty string');
        setContent('');
      }
      
      setCategory(currentChangelog.category || 'announcement');
      setFeaturedImage(currentChangelog.featured_image_url || "");
      setVideoUrl(currentChangelog.video_url || "");
      setAiGenerated(currentChangelog.ai_generated || false);
      
      setContentLoaded(true);
      console.log('=== CONTENT LOADING COMPLETE ===');
    }
  }, [currentChangelog, contentLoaded, loadingContent, extractContentString]);

  // Reset content loaded flag when switching changelogs
  useEffect(() => {
    if (isEditing && id) {
      setContentLoaded(false);
    }
  }, [id, isEditing]);

  // Enhanced auto-save with better content handling
  const debouncedAutoSave = useCallback(
    debounce(async (saveData: any) => {
      // Check if we have meaningful content to save
      const hasTitle = saveData.title && typeof saveData.title === 'string' && saveData.title.trim().length > 0;
      const hasContent = saveData.content && 
        ((typeof saveData.content === 'string' && saveData.content.trim().length > 0) ||
         (typeof saveData.content === 'object' && saveData.content.html && saveData.content.html.trim().length > 0));
      
      if (!hasTitle && !hasContent) {
        console.log('No meaningful content to auto-save');
        return;
      }
      
      try {
        console.log('=== AUTO-SAVE TRIGGERED ===');
        console.log('Save data:', saveData);
        
        if (isEditing && id) {
          console.log('Auto-saving existing changelog:', id);
          await autoSaveChangelog(id, saveData);
          console.log('Auto-save completed');
        } else {
          console.log('Creating new changelog draft');
          const result = await createChangelog({
            ...saveData,
            status: 'draft',
          });
          
          if (result.data?.id) {
            console.log('Created new changelog, redirecting to edit page:', result.data.id);
            navigate(`/changelogs/${result.data.id}/edit`, { replace: true });
          } else if (result.error) {
            console.error('Failed to create changelog:', result.error);
            toast({
              title: "Auto-save Failed",
              description: result.error,
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error('Auto-save failed:', error);
        toast({
          title: "Auto-save Failed",
          description: "There was an issue saving your changes",
          variant: "destructive",
        });
      }
    }, 500),
    [isEditing, id, autoSaveChangelog, createChangelog, navigate, toast]
  );

  // Auto-save on content change with enhanced data structure
  useEffect(() => {
    if (title || content) {
      const saveData = {
        title,
        content: typeof content === 'string' ? { html: content } : content,
        category,
        featured_image_url: featuredImage,
        video_url: videoUrl,
        visibility: 'public' as const,
        tags: [],
        ai_generated: aiGenerated,
      };
      
      console.log('Triggering auto-save with data:', saveData);
      debouncedAutoSave(saveData);
    }
  }, [title, content, category, featuredImage, videoUrl, aiGenerated, debouncedAutoSave]);

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
                {(loading || loadingContent) && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <span>Loading changelog...</span>
                  </div>
                )}
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
              {/* Loading State */}
              {loadingContent && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading changelog content...</p>
                  </div>
                </div>
              )}

              {/* Content Area */}
              {!loadingContent && (
                <>
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
                      }}
                    />
                  </div>

                  {/* TipTap Editor with enhanced content handling */}
                  <TipTapEditor
                    content={content}
                    onChange={setContent}
                    placeholder="Tell your story..."
                  />
                </>
              )}
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
