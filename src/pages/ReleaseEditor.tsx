
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Eye, Send, Upload, Tag, Users, Clock } from "lucide-react";
import { useReleaseStore } from "@/stores/releaseStore";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import RichTextEditor from "@/components/RichTextEditor";
import ImageUpload from "@/components/ImageUpload";
import DocumentUpload from "@/components/DocumentUpload";

const ReleaseEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentRelease, fetchRelease, createRelease, updateRelease, publishRelease } = useReleaseStore();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [releaseType, setReleaseType] = useState("update");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [featuredImage, setFeaturedImage] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [visibility, setVisibility] = useState("public");
  const [isProcessingDocument, setIsProcessingDocument] = useState(false);

  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing && id) {
      fetchRelease(id);
    }
  }, [isEditing, id, fetchRelease]);

  useEffect(() => {
    if (currentRelease) {
      setTitle(currentRelease.title);
      setContent(typeof currentRelease.content === 'string' 
        ? currentRelease.content 
        : JSON.stringify(currentRelease.content || {})
      );
      setReleaseType(currentRelease.release_type);
      setTags(currentRelease.tags || []);
      setFeaturedImage(currentRelease.featured_image_url || "");
      setVisibility(currentRelease.visibility);
    }
  }, [currentRelease]);

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
      const releaseData = {
        title,
        content: { html: content },
        release_type: releaseType,
        status: 'draft' as const,
        tags,
        featured_image_url: featuredImage,
        visibility,
      };

      if (isEditing && id) {
        const { error } = await updateRelease(id, releaseData);
        if (error) throw new Error(error);
        toast({ title: "Release updated!" });
      } else {
        const { error } = await createRelease(releaseData);
        if (error) throw new Error(error);
        toast({ title: "Release created!" });
        navigate('/releases');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save release",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!currentRelease) return;
    
    try {
      const { error } = await publishRelease(currentRelease.id);
      if (error) throw new Error(error);
      toast({ title: "Release published!" });
      navigate('/releases');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish release",
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
    // In a real implementation, you'd upload to storage
    const url = URL.createObjectURL(file);
    setFeaturedImage(url);
  };

  const handleDocumentUpload = (file: File) => {
    toast({
      title: "Document uploaded",
      description: "Ready for AI processing",
    });
  };

  const handleGoogleDriveConnect = () => {
    toast({
      title: "Google Drive Integration",
      description: "Google Drive integration coming soon!",
    });
  };

  const handleAIProcess = async (documentContent: string) => {
    setIsProcessingDocument(true);
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock AI-generated content
      setTitle("New Feature Release - AI Generated");
      setContent(`
        <h2>What's New</h2>
        <p>We're excited to announce our latest feature updates based on your feedback.</p>
        
        <h3>Key Features</h3>
        <ul>
          <li>Enhanced user interface for better usability</li>
          <li>Improved performance and reliability</li>
          <li>New integration capabilities</li>
        </ul>
        
        <h3>Getting Started</h3>
        <p>To start using these new features, simply log into your account and explore the updated interface.</p>
      `);
      setTags(["feature", "update", "enhancement"]);
      
      toast({
        title: "AI Processing Complete",
        description: "Your document has been converted to a release draft!",
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/releases')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">
              {isEditing ? 'Edit Release' : 'New Release'}
            </h1>
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
            {isEditing && currentRelease?.status === 'draft' && (
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
            {/* Document Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <DocumentUpload
                  onDocumentUpload={handleDocumentUpload}
                  onGoogleDriveConnect={handleGoogleDriveConnect}
                  onAIProcess={handleAIProcess}
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

            {/* Release Content */}
            <Card>
              <CardHeader>
                <CardTitle>Release Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What's new in this release?"
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
                      {currentRelease?.status || 'draft'}
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
                  <label className="text-sm font-medium">Release Type</label>
                  <select
                    value={releaseType}
                    onChange={(e) => setReleaseType(e.target.value)}
                    className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="update">Update</option>
                    <option value="feature">New Feature</option>
                    <option value="bugfix">Bug Fix</option>
                    <option value="integration">New Integration</option>
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

export default ReleaseEditor;
