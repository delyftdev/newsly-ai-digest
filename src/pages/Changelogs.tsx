
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
  Eye
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

  const handleChangelogClick = (changelogId: string) => {
    // Auto-collapse sidebar on mobile/tablet - this will be handled by the DashboardLayout
    console.log('Navigating to changelog:', changelogId);
  };

  // Group changelogs by date
  const groupedChangelogs = changelogs.reduce((groups, changelog) => {
    const date = new Date(changelog.created_at).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(changelog);
    return groups;
  }, {} as Record<string, typeof changelogs>);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
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

        {loading ? (
          <Card>
            <CardContent className="p-8">
              <div className="text-center text-muted-foreground">
                <p>Loading changelogs...</p>
              </div>
            </CardContent>
          </Card>
        ) : changelogs.length === 0 ? (
          <Card>
            <CardContent className="p-8">
              <div className="text-center text-muted-foreground">
                <p>No changelog entries yet. Create your first entry to get started.</p>
                <Link to="/changelogs/new">
                  <Button className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Changelog
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedChangelogs).map(([dateString, dayChangelogs]) => (
              <div key={dateString} className="space-y-4">
                <div className="flex items-center space-x-3">
                  <h2 className="text-lg font-semibold text-foreground">
                    {formatDate(dateString)}
                  </h2>
                  <div className="flex-1 h-px bg-border"></div>
                </div>
                
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y divide-border">
                      {dayChangelogs.map((changelog) => (
                        <div key={changelog.id} className="p-6 hover:bg-accent/30 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-3">
                                <span className="text-2xl">{getCategoryIcon(changelog.category)}</span>
                                <Link 
                                  to={`/changelogs/${changelog.id}/edit`}
                                  className="text-xl font-semibold text-foreground hover:text-primary transition-colors"
                                  onClick={() => handleChangelogClick(changelog.id)}
                                >
                                  {changelog.title}
                                </Link>
                                <Badge 
                                  variant={changelog.status === 'published' ? 'default' : 'secondary'}
                                  className="ml-2"
                                >
                                  {changelog.status}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-3">
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>{new Date(changelog.created_at).toLocaleTimeString('en-US', { 
                                    hour: 'numeric', 
                                    minute: '2-digit',
                                    hour12: true 
                                  })}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Tag className="h-4 w-4" />
                                  <span>{getCategoryLabel(changelog.category)}</span>
                                </div>
                                {changelog.view_count !== undefined && changelog.view_count > 0 && (
                                  <div className="flex items-center space-x-1">
                                    <Eye className="h-4 w-4" />
                                    <span>{changelog.view_count} views</span>
                                  </div>
                                )}
                              </div>

                              {changelog.tags && changelog.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {changelog.tags.map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}

                              {changelog.ai_generated && (
                                <div className="flex items-center space-x-1 mb-2">
                                  <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                                    ✨ AI Generated
                                  </Badge>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center space-x-2 ml-4">
                              <Link 
                                to={`/changelogs/${changelog.id}/edit`}
                                onClick={() => handleChangelogClick(changelog.id)}
                              >
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}

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
