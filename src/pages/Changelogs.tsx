
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Edit, 
  Calendar, 
  Tag, 
  Share,
  Trash2,
} from "lucide-react";
import { useChangelogStore } from "@/stores/changelogStore";
import { useCompanyStore } from "@/stores/companyStore";
import ShareDialog from "@/components/ShareDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const Changelogs = () => {
  const { changelogs, fetchChangelogs, deleteChangelog, loading } = useChangelogStore();
  const { company } = useCompanyStore();
  const { toast } = useToast();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [changelogToDelete, setChangelogToDelete] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchChangelogs();
  }, [fetchChangelogs]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'new-feature': return '✨';
      case 'improvement': return '📈';
      case 'fix': return '🐛';
      default: return '📢';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'new-feature': return 'New Feature';
      case 'improvement': return 'Improvement';
      case 'fix': return 'Bug Fix';
      default: return 'Announcement';
    }
  };

  const generateCompanyChangelogUrl = () => {
    const baseUrl = window.location.origin;
    
    // Use subdomain first, then slug, then fallback to company ID
    let companySlug = company?.subdomain;
    if (!companySlug) {
      companySlug = company?.slug;
    }
    if (!companySlug) {
      // Fallback to a URL-safe version of company name or ID
      companySlug = company?.name?.toLowerCase().replace(/[^a-z0-9]/g, '-') || company?.id;
    }
    
    console.log('Generating URL with company slug:', companySlug);
    console.log('Company data:', company);
    
    return `${baseUrl}/public/${companySlug}/changelog`;
  };

  const handleShareChangelog = () => {
    setShareDialogOpen(true);
  };

  const handleDeleteClick = (changelogId: string) => {
    console.log('Delete button clicked for changelog:', changelogId);
    setChangelogToDelete(changelogId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!changelogToDelete) return;

    console.log('Confirming delete for changelog:', changelogToDelete);
    setDeletingId(changelogToDelete);
    
    try {
      const { error } = await deleteChangelog(changelogToDelete);
      
      if (error) {
        throw new Error(error);
      }
      
      toast({
        title: "Changelog deleted successfully",
        description: "The changelog has been permanently removed.",
      });
      
      // Force refresh the changelogs list to ensure UI is updated
      console.log('Refreshing changelogs list after delete');
      await fetchChangelogs();
      
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        title: "Failed to delete changelog",
        description: error.message || "There was an error deleting the changelog. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
      setDeleteDialogOpen(false);
      setChangelogToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    console.log('Delete cancelled');
    setDeleteDialogOpen(false);
    setChangelogToDelete(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex-1" />
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleShareChangelog}>
              <Share className="h-4 w-4 mr-2" />
              Share Company Changelog
            </Button>
            <Link to="/changelogs/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New
              </Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Loading changelogs...</p>
              </div>
            ) : changelogs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No changelog entries yet. Create your first entry to get started.</p>
                <Link to="/changelogs/new">
                  <Button className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Changelog
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {changelogs.map((changelog) => (
                  <div key={changelog.id} className="p-6 hover:bg-accent/50 transition-colors group">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-lg">{getCategoryIcon(changelog.category)}</span>
                          <h3 className="text-lg font-semibold text-foreground">{changelog.title}</h3>
                          <Badge variant={changelog.status === 'published' ? 'default' : 'secondary'}>
                            {changelog.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(changelog.created_at).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Tag className="h-4 w-4 mr-1" />
                            {getCategoryLabel(changelog.category)}
                          </div>
                        </div>

                        {changelog.tags && changelog.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {changelog.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        {/* Edit Button */}
                        <Link to={`/changelogs/${changelog.id}/edit`}>
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        
                        {/* Delete Button */}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteClick(changelog.id)}
                          disabled={deletingId === changelog.id}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          {deletingId === changelog.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-destructive"></div>
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this changelog?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the changelog entry
                and remove it from your changelog history.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleDeleteCancel}>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteConfirm}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={deletingId !== null}
              >
                {deletingId ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <ShareDialog
          isOpen={shareDialogOpen}
          onClose={() => setShareDialogOpen(false)}
          title={`${company?.name || 'Company'} Changelog`}
          shareUrl={generateCompanyChangelogUrl()}
          type="changelog"
        />
      </div>
    </DashboardLayout>
  );
};

export default Changelogs;
