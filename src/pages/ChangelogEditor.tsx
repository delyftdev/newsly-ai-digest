import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Eye, Send, Upload, Tag, Users, Clock } from "lucide-react";
import { useChangelogStore } from "@/stores/changelogStore";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import RichTextEditor from "@/components/RichTextEditor";
import ImageUpload from "@/components/ImageUpload";
import DocumentUpload from "@/components/DocumentUpload";
import { AddParticipantsButton } from "@/components/collaboration/AddParticipantsButton";
import { AvatarRow } from "@/components/collaboration/AvatarRow";
import { PresenceIndicator } from "@/components/collaboration/PresenceIndicator";

const ChangelogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentChangelog, fetchChangelog, createChangelog, updateChangelog, publishChangelog, autoSaveChangelog } = useChangelogStore();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("announcement");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [featuredImage, setFeaturedImage] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [visibility, setVisibility] = useState("public");
  const [isProcessingDocument, setIsProcessingDocument] = useState(false);
  const [participantsKey, setParticipantsKey] = useState(0);

  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing && id) {
      fetchChangelog(id);
    }
  }, [isEditing, id, fetchChangelog]);

  useEffect(() => {
    if (currentChangelog) {
      setTitle(currentChangelog.title);
      setContent(typeof currentChangelog.content === 'object' && currentChangelog.content?.html 
        ? currentChangelog.content.html 
        : typeof currentChangelog.content === 'string' 
        ? currentChangelog.content 
        : ''
      );
      setCategory(currentChangelog.category);
      setTags(currentChangelog.tags || []);
      setFeaturedImage(currentChangelog.featured_image_url || "");
      setVisibility(currentChangelog.visibility);
    }
  }, [currentChangelog]);

  // Auto-save functionality
  useEffect(() => {
    if (isEditing && id && (title || content)) {
      const autoSaveData = {
        title,
        content: { html: content },
        category,
        tags,
        featured_image_url: featuredImage,
        visibility,
      };
      autoSaveChangelog(id, {
        ...autoSaveData,
        visibility: visibility as "public" | "private"
      });
    }
  }, [title, content, category, tags, featuredImage, visibility, isEditing, id, autoSaveChangelog]);

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
        visibility: visibility as "public" | "private",
        ai_generated: false,
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
      navigate('/changelogs');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish changelog",
        variant: "destructive",
      });
    }
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

  const handleDocumentUpload = (file: File) => {
    toast({
      title: "Document uploaded",
      description: "Ready for AI processing",
    });
  };

  const handleAIGenerate = async (aiData: any) => {
    setIsProcessingDocument(true);
    try {
      setTitle(aiData.title || "New Changelog Entry - AI Generated");
      setContent(aiData.content || `
        <h2>What's New</h2>
        <p>We're excited to share our latest updates and improvements based on your feedback.</p>
        
        <h3>Key Updates</h3>
        <ul>
          <li>Enhanced user experience with improved interface design</li>
          <li>Better performance and faster loading times</li> 
          <li>New features to help you work more efficiently</li>
        </ul>
        
        <h3>Getting Started</h3>
        <p>These updates are now live for all users. Simply refresh your browser to see the changes.</p>
      `);
      setTags(aiData.tags || ["update", "improvement", "feature"]);
      
      toast({
        title: "AI Processing Complete",
        description: "Your document has been converted to a changelog draft!",
      });
    } catch (error) {
      toast({
        title: "Processing Error",
        description: "Failed to process document with AI",
        variant: "destructive",
      });
    } finally {
      setIsProcessingDocument(false);
    }
  };

  const handleParticipantsChange = () => {
    setParticipantsKey(prev => prev + 1);
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
            {isEditing && id && <PresenceIndicator changelogId={id} />}
          </div>
          
          <div className="flex items-center space-x-2">
            {isEditing && id && (
              <AddParticipantsButton 
                changelogId={id} 
                onParticipantsChange={handleParticipantsChange}
              />
            )}
            <Button variant="outline" onClick={handleSave} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Draft'}
            </Button>
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            {isEditing && currentChangelog?.status === 'draft' && (
              <Button onClick={handlePublish}>
                <Send className="h-4 w-4 mr-2" />
                Publish
              </Button>
            )}
          </div>
        </div>

        {/* Participants Row */}
        {isEditing && id && (
          <AvatarRow 
            key={participantsKey}
            changelogId={id} 
            onParticipantsChange={handleParticipantsChange}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Document Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <DocumentUpload
                  onDocumentUpload={handleDocumentUpload}
                  onAIGenerate={handleAIGenerate}
                  isProcessing={isProcessingDocument}
                />
              </CardContent>
            </Card>

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
                  <RichTextEditor
                    value={content}
                    onChange={setContent}
                    placeholder="Describe what's new, what's changed, and what's been fixed..."
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

                <div>
                  <label className="text-sm font-medium">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="announcement">Announcement</option>
                    <option value="feature">New Feature</option>
                    <option value="improvement">Improvement</option>
                    <option value="bugfix">Bug Fix</option>
                    <option value="security">Security Update</option>
                  </select>
                </div>
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

            {/* Team Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Team Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <Clock className="w-3 h-3 text-blue-600" />
                    </div>
                    <span className="text-gray-600">Created 2 hours ago</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <Save className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-600">Last saved 5 minutes ago</span>
                  </div>
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
