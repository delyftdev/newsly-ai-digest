
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
  Share
} from "lucide-react";
import { useChangelogStore } from "@/stores/changelogStore";
import { useCompanyStore } from "@/stores/companyStore";
import ShareDialog from "@/components/ShareDialog";

const Changelogs = () => {
  const { changelogs, fetchChangelogs, loading } = useChangelogStore();
  const { company } = useCompanyStore();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

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
    const companySlug = company?.subdomain || company?.slug || 'company';
    return `${baseUrl}/public/${companySlug}/changelog`;
  };

  const handleShareChangelog = () => {
    setShareDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex-1" />
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleShareChangelog}>
              <Share className="h-4 w-4 mr-2" />
              Share Changelog
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
                  <div key={changelog.id} className="p-6 hover:bg-accent/50 transition-colors">
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
                        <Link to={`/changelogs/${changelog.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

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
