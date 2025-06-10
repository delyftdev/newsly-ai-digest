
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Eye, Send } from "lucide-react";
import { useReleaseStore } from "@/stores/releaseStore";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";

const ReleaseEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentRelease, fetchRelease, createRelease, updateRelease, publishRelease } = useReleaseStore();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [releaseType, setReleaseType] = useState("update");
  const [isSaving, setIsSaving] = useState(false);

  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing && id) {
      fetchRelease(id);
    }
  }, [isEditing, id, fetchRelease]);

  useEffect(() => {
    if (currentRelease) {
      setTitle(currentRelease.title);
      setContent(JSON.stringify(currentRelease.content || {}));
      setReleaseType(currentRelease.release_type);
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
        content: { text: content },
        release_type: releaseType,
        status: 'draft' as const,
      };

      if (isEditing && id) {
        const { error } = await updateRelease(id, releaseData);
        if (error) throw new Error(error);
        toast({ title: "Release updated!" });
      } else {
        const { error } = await createRelease(releaseData);
        if (error) throw new Error(error);
        toast({ title: "Release created!" });
        navigate('/dashboard');
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
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish release",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
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
                    placeholder="Release title..."
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Release Type</label>
                  <select
                    value={releaseType}
                    onChange={(e) => setReleaseType(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="update">Update</option>
                    <option value="feature">New Feature</option>
                    <option value="bugfix">Bug Fix</option>
                    <option value="integration">New Integration</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Content</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your release notes..."
                    className="w-full h-64 border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Visibility</label>
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Tags</label>
                    <Input placeholder="Add tags..." />
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
