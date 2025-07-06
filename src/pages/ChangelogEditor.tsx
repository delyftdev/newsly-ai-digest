
import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, MessageSquare, X } from "lucide-react";
import { useChangelogStore } from "@/stores/changelogStore";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import TipTapEditor from "@/components/TipTapEditor";
import AIWriterChat from "@/components/AIWriterChat";

// Debounce utility function with enhanced logging
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      console.log('=== DEBOUNCED FUNCTION EXECUTING ===');
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Content validation utilities
const isContentEmpty = (content: string): boolean => {
  if (!content || content.trim() === '') return true;
  
  // Remove HTML tags and check if meaningful content remains
  const textContent = content.replace(/<[^>]*>/g, '').trim();
  return textContent === '' || textContent === 'Start writing...';
};

const validateContentFormat = (content: any): { isValid: boolean; cleanContent: string } => {
  console.log('=== VALIDATING CONTENT FORMAT ===');
  console.log('Raw content:', content);
  
  if (!content) {
    return { isValid: true, cleanContent: '' };
  }
  
  if (typeof content === 'string') {
    const isEmpty = isContentEmpty(content);
    console.log('String content empty check:', isEmpty);
    return { 
      isValid: !isEmpty, 
      cleanContent: isEmpty ? '' : content 
    };
  }
  
  if (typeof content === 'object' && content.html) {
    const isEmpty = isContentEmpty(content.html);
    console.log('Object.html content empty check:', isEmpty);
    return { 
      isValid: !isEmpty, 
      cleanContent: isEmpty ? '' : content.html 
    };
  }
  
  console.log('Content format invalid or empty');
  return { isValid: false, cleanContent: '' };
};

const ChangelogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { 
    currentChangelog, 
    fetchChangelog, 
    createChangelog, 
    updateChangelog, 
    publishChangelog,
    autoSaveChangelog,
    setCurrentChangelog,
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
  const [editorKey, setEditorKey] = useState(0);
  const [isDirty, setIsDirty] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [autoSaveBlocked, setAutoSaveBlocked] = useState(false);

  const isEditing = Boolean(id);
  const isNewChangelog = location.pathname === '/changelogs/new';

  console.log('=== EDITOR COMPONENT STATE ===');
  console.log('URL ID:', id);
  console.log('Is editing:', isEditing);
  console.log('Is new:', isNewChangelog);
  console.log('Current changelog ID:', currentChangelog?.id);
  console.log('Content loaded:', contentLoaded);
  console.log('Is dirty:', isDirty);
  console.log('Auto-save blocked:', autoSaveBlocked);

  // Determine if there's meaningful content for showing the publish button
  const hasContent = useMemo(() => {
    const hasTitle = Boolean(title?.trim());
    const { isValid } = validateContentFormat(content);
    console.log('Has content check:', { hasTitle, isValidContent: isValid });
    return hasTitle && isValid;
  }, [title, content]);

  // Show publish button logic
  const showPublishButton = isEditing 
    ? currentChangelog?.status === 'draft' && hasContent
    : hasContent;

  // Enhanced content extraction with validation
  const extractContentString = useCallback((contentData: any): string => {
    console.log('=== EXTRACTING CONTENT STRING ===');
    console.log('Input content data:', contentData);
    
    const { isValid, cleanContent } = validateContentFormat(contentData);
    
    if (!isValid) {
      console.log('Content validation failed, returning empty string');
      return '';
    }
    
    console.log('Extracted clean content:', cleanContent.substring(0, 100) + '...');
    return cleanContent;
  }, []);

  // Clear all editor state
  const clearEditorState = useCallback(() => {
    console.log('=== CLEARING EDITOR STATE ===');
    setTitle("");
    setContent("");
    setCategory("announcement");
    setFeaturedImage("");
    setVideoUrl("");
    setAiGenerated(false);
    setContentLoaded(false);
    setLoadingContent(false);
    setIsDirty(false);
    setIsAutoSaving(false);
    setAutoSaveBlocked(false);
    setCurrentChangelog(null);
    setEditorKey(prev => prev + 1);
    console.log('Editor state cleared successfully');
  }, [setCurrentChangelog]);

  // Enhanced auto-save with strict validation and corruption prevention
  const performAutoSave = useCallback(async (saveData: {
    title: string;
    content: string;
    category: string;
    featured_image_url: string;
    video_url: string;
    ai_generated: boolean;
  }) => {
    console.log('=== AUTO-SAVE TRIGGERED ===');
    console.log('Save data:', {
      title: saveData.title,
      contentLength: saveData.content?.length || 0,
      contentPreview: saveData.content?.substring(0, 100) + '...',
      category: saveData.category
    });

    // Block auto-save during content loading or if already auto-saving
    if (autoSaveBlocked || isAutoSaving || loadingContent) {
      console.log('Auto-save blocked:', { autoSaveBlocked, isAutoSaving, loadingContent });
      return;
    }

    // Validate content before saving
    const { isValid: isTitleValid } = { isValid: Boolean(saveData.title?.trim()) };
    const { isValid: isContentValid } = validateContentFormat(saveData.content);
    
    // Only save if we have meaningful content (title OR valid content)
    if (!isTitleValid && !isContentValid) {
      console.log('Auto-save skipped: no meaningful content');
      return;
    }

    // Prevent empty HTML corruption
    if (saveData.content && saveData.content.trim() === '<p></p>') {
      console.log('Auto-save skipped: preventing empty paragraph corruption');
      return;
    }

    setIsAutoSaving(true);
    
    try {
      // Prepare clean save data
      const cleanSaveData = {
        ...saveData,
        content: isContentValid ? { html: saveData.content } : { html: '' },
        status: 'draft' as const,
        visibility: 'public' as const,
        tags: [],
      };

      console.log('Clean save data prepared:', {
        title: cleanSaveData.title,
        contentHtml: cleanSaveData.content.html?.substring(0, 100) + '...',
        hasValidContent: isContentValid
      });

      if (isEditing && id && currentChangelog?.id === id) {
        console.log('Auto-saving existing changelog:', id);
        await autoSaveChangelog(id, cleanSaveData);
        console.log('Auto-save completed successfully');
      } else if (!isEditing && !currentChangelog) {
        console.log('Creating new changelog draft');
        const result = await createChangelog(cleanSaveData);
        
        if (result.data?.id) {
          console.log('New changelog created:', result.data.id);
          console.log('Redirecting to edit mode');
          navigate(`/changelogs/${result.data.id}/edit`, { replace: true });
        } else if (result.error) {
          console.error('Failed to create changelog:', result.error);
          toast({
            title: "Auto-save Failed",
            description: result.error,
            variant: "destructive",
          });
        }
      } else {
        console.log('Auto-save skipped: invalid state');
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
      toast({
        title: "Auto-save Failed",
        description: "There was an issue saving your changes",
        variant: "destructive",
      });
    } finally {
      setIsAutoSaving(false);
    }
  }, [isEditing, id, currentChangelog, autoSaveChangelog, createChangelog, navigate, toast, autoSaveBlocked, isAutoSaving, loadingContent]);

  // Debounced auto-save with enhanced validation
  const debouncedAutoSave = useCallback(
    debounce(performAutoSave, 2000),
    [performAutoSave]
  );

  // Handle route changes and state management
  useEffect(() => {
    console.log('=== ROUTE CHANGE EFFECT ===');
    console.log('Location pathname:', location.pathname);
    console.log('URL ID:', id);
    
    if (isNewChangelog) {
      console.log('New changelog route detected');
      clearEditorState();
    } else if (isEditing && id) {
      console.log('Edit mode detected for ID:', id);
      
      // Block auto-save during loading
      setAutoSaveBlocked(true);
      setLoadingContent(true);
      setContentLoaded(false);
      
      fetchChangelog(id)
        .then(() => {
          console.log('Changelog fetch completed');
        })
        .catch((error) => {
          console.error('Failed to fetch changelog:', error);
          toast({
            title: "Failed to load changelog",
            description: "The changelog might not exist or you don't have permission to view it.",
            variant: "destructive",
          });
          navigate('/changelogs');
        })
        .finally(() => {
          setLoadingContent(false);
          // Small delay to ensure content is fully loaded before enabling auto-save
          setTimeout(() => {
            setAutoSaveBlocked(false);
          }, 500);
        });
    }
  }, [location.pathname, id, isNewChangelog, isEditing, fetchChangelog, clearEditorState, toast, navigate]);

  // Load content into editor when currentChangelog changes
  useEffect(() => {
    if (currentChangelog && !contentLoaded && !loadingContent && isEditing) {
      console.log('=== LOADING CHANGELOG DATA INTO EDITOR ===');
      console.log('Changelog data:', {
        id: currentChangelog.id,
        title: currentChangelog.title,
        contentType: typeof currentChangelog.content,
        contentPreview: JSON.stringify(currentChangelog.content).substring(0, 200)
      });
      
      // Block auto-save during content loading
      setAutoSaveBlocked(true);
      
      setTitle(currentChangelog.title || '');
      
      // Enhanced content parsing with validation
      const extractedContent = extractContentString(currentChangelog.content);
      console.log('Extracted content for editor:', {
        length: extractedContent.length,
        isEmpty: isContentEmpty(extractedContent),
        preview: extractedContent.substring(0, 200) + '...'
      });
      
      setContent(extractedContent);
      setCategory(currentChangelog.category || 'announcement');
      setFeaturedImage(currentChangelog.featured_image_url || "");
      setVideoUrl(currentChangelog.video_url || "");
      setAiGenerated(currentChangelog.ai_generated || false);
      
      setContentLoaded(true);
      setIsDirty(false);
      
      // Re-enable auto-save after content is loaded
      setTimeout(() => {
        setAutoSaveBlocked(false);
      }, 500);
      
      console.log('=== CONTENT LOADING COMPLETE ===');
    }
  }, [currentChangelog, contentLoaded, loadingContent, isEditing, extractContentString]);

  // Enhanced auto-save trigger with validation
  useEffect(() => {
    if (!autoSaveBlocked && !loadingContent && isDirty) {
      console.log('=== AUTO-SAVE TRIGGER CHECK ===');
      console.log('Conditions:', {
        autoSaveBlocked,
        loadingContent,
        isDirty,
        hasTitle: Boolean(title?.trim()),
        hasContent: Boolean(content?.trim())
      });

      const saveData = {
        title: title || '',
        content: content || '',
        category,
        featured_image_url: featuredImage,
        video_url: videoUrl,
        ai_generated: aiGenerated,
      };
      
      console.log('Triggering debounced auto-save');
      debouncedAutoSave(saveData);
    }
  }, [title, content, category, featuredImage, videoUrl, aiGenerated, debouncedAutoSave, autoSaveBlocked, loadingContent, isDirty]);

  // Track dirty state changes
  useEffect(() => {
    if (!loadingContent && contentLoaded) {
      setIsDirty(true);
    }
  }, [title, content, category, featuredImage, videoUrl, aiGenerated, loadingContent, contentLoaded]);

  const handlePublish = async () => {
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please add a title before publishing",
        variant: "destructive",
      });
      return;
    }

    const { isValid: isContentValid } = validateContentFormat(content);
    if (!isContentValid) {
      toast({
        title: "Content Required",
        description: "Please add some content before publishing",
        variant: "destructive",
      });
      return;
    }

    setIsPublishing(true);
    
    try {
      let changelogId = id;
      
      // If this is a new changelog, save it first
      if (!isEditing || !currentChangelog) {
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
    setIsDirty(true);
    toast({
      title: "Content Generated!",
      description: "AI has created content for your changelog.",
    });
  };

  const handleInsertContent = (contentToInsert: string) => {
    const { isValid } = validateContentFormat(content);
    if (isValid && content.trim()) {
      setContent(prev => prev + '\n\n' + contentToInsert);
    } else {
      setContent(contentToInsert);
    }
    setAiGenerated(true);
    setIsDirty(true);
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
                {isAutoSaving && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-500"></div>
                    <span>Auto-saving...</span>
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
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setIsDirty(true);
                  }}
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
                      onChange={(e) => {
                        setTitle(e.target.value);
                        setIsDirty(true);
                      }}
                      placeholder="Enter changelog title..."
                      className="text-4xl font-bold border-none shadow-none p-0 h-auto bg-transparent focus-visible:ring-0 placeholder:text-muted-foreground/50"
                      style={{ 
                        fontSize: '2.25rem', 
                        lineHeight: '2.5rem',
                      }}
                    />
                  </div>

                  {/* TipTap Editor */}
                  <TipTapEditor
                    key={editorKey}
                    content={content}
                    onChange={(newContent) => {
                      console.log('Editor content changed:', {
                        length: newContent?.length || 0,
                        preview: newContent?.substring(0, 100) + '...'
                      });
                      setContent(newContent);
                      setIsDirty(true);
                    }}
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
