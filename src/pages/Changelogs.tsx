
import { useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ExternalLink, Edit, Eye, Calendar, Tag } from "lucide-react";
import { useChangelogStore } from "@/stores/changelogStore";

const Changelogs = () => {
  const { changelogs, fetchChangelogs, loading } = useChangelogStore();

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

  const publishedCount = changelogs.filter(c => c.status === 'published').length;
  const draftCount = changelogs.filter(c => c.status === 'draft').length;
  const thisMonthCount = changelogs.filter(c => {
    const created = new Date(c.created_at);
    const now = new Date();
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  }).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Changelogs</h1>
            <p className="text-gray-600">Manage your public changelog and customer communications</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Public
            </Button>
            <Link to="/changelogs/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Entry
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Published Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{publishedCount}</div>
              <p className="text-sm text-gray-500">Live changelogs</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Draft Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{draftCount}</div>
              <p className="text-sm text-gray-500">Work in progress</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{thisMonthCount}</div>
              <p className="text-sm text-gray-500">New this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">--</div>
              <p className="text-sm text-gray-500">Coming soon</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Changelog Entries</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                <p>Loading changelogs...</p>
              </div>
            ) : changelogs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No changelog entries yet. Create your first entry to get started.</p>
                <Link to="/changelogs/new">
                  <Button className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Changelog
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {changelogs.map((changelog) => (
                  <div key={changelog.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-lg">{getCategoryIcon(changelog.category)}</span>
                          <h3 className="text-lg font-semibold">{changelog.title}</h3>
                          <Badge variant={changelog.status === 'published' ? 'default' : 'secondary'}>
                            {changelog.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
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
                        {changelog.status === 'published' && changelog.public_slug && (
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
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
      </div>
    </DashboardLayout>
  );
};

export default Changelogs;
