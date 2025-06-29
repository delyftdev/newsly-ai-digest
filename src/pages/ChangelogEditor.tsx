
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Eye, Send, Tag, Users, Clock, Share, Copy } from "lucide-react";
import { useChangelogStore } from "@/stores/changelogStore";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import EnhancedRichTextEditor from "@/components/EnhancedRichTextEditor";
import ImageUpload from "@/components/ImageUpload";

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
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [featuredImage, setFeaturedImage] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [visibility, setVisibility] = useState("public");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

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
      setTags(currentChangelog.tags || []);
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
        tags,
        featured_image_url: featuredImage,
        video_url: videoUrl,
        visibility,
      });
      setLastSaved(new Date());
    }
  }, [title, content, category, tags, featuredImage, videoUrl, visibility]);

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
        tags,
        featured_image_url: featuredImage,
        video_url: videoUrl,
        visibility,
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

  const handleShare = () => {
    if (currentChangelog?.public_slug) {
      const shareUrl = `${window.location.origin}/changelog/${currentChangelog.public_slug}`;
      navigator.clipboard.writeText(shareUrl);
      toast({ title: "Share link copied to clipboard!" });
    }
  };

  const getEmbedCode = () => {
    if (currentChangelog?.public_slug) {
      return `<iframe src="${window.location.origin}/changelog/${currentChangelog.public_slug}/embed" width="100%" height="600" frameborder="0"></iframe>`;
    }
    return '';
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleImageUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setFeaturedImage(url);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/changelogs')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">
              {isEditing ? 'Edit Changelog' : 'New Changelog'}
            </h1>
            {lastSaved && (
              <Badge variant="outline" className="text-xs">
                Auto-saved {lastSaved.toLocaleTimeString()}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleSave} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Draft'}
            </Button>
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            {isEditing && currentChangelog?.status === 'published' && (
              <Button variant="outline" onClick={handleShare}>
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            )}
            {isEditing && currentChangelog?.status === 'draft' && (
              <Button onClick={handlePublish}>
                <Send className="h-4 w-4 mr-2" />
                Publish
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Featured Image */}
            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  onImageUpload={handleImageUpload}
                  currentImage={featuredImage}
                  onImageRemove={() => setFeaturedImage("")}
                />
              </CardContent>
            </Card>

            {/* Changelog Content */}
            <Card>
              <CardHeader>
                <CardTitle>Changelog Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What's new in this update?"
                    className="text-lg"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Content</label>
                  <EnhancedRichTextEditor
                    value={content}
                    onChange={setContent}
                    placeholder="Describe the changes, new features, improvements, and fixes..."
                    onImageUpload={handleImageUpload}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Video URL (Optional)</label>
                  <Input
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="YouTube, Vimeo, or direct video URL"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Send className="h-4 w-4 mr-2" />
                  Publish
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <div className="mt-1">
                    <Badge variant="outline">
                      {currentChangelog?.status || 'draft'}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="announcement">📢 Announcement</option>
                    <option value="new-feature">✨ New Feature</option>
                    <option value="improvement">📈 Improvement</option>
                    <option value="fix">🐛 Bug Fix</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Visibility</label>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value)}
                    className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                {currentChangelog?.status === 'published' && currentChangelog?.public_slug && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Embed Code</label>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(getEmbedCode());
                          toast({ title: "Embed code copied!" });
                        }}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Embed
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="h-4 w-4 mr-2" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag..."
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button size="sm" onClick={addTag}>Add</Button>
                </div>
              </CardContent>
            </Card>

            {/* Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <Clock className="w-3 h-3 text-blue-600" />
                    </div>
                    <span className="text-gray-600">
                      {isEditing ? 'Last updated' : 'Created'} {
                        currentChangelog ? 
                        new Date(currentChangelog.updated_at).toLocaleDateString() : 
                        'just now'
                      }
                    </span>
                  </div>
                  {lastSaved && (
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <Save className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-gray-600">Auto-saved {lastSaved.toLocaleTimeString()}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ChangelogEditor;
