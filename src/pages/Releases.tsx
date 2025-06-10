
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, Calendar, User, Eye, Edit } from "lucide-react";
import { useReleaseStore } from "@/stores/releaseStore";
import DashboardLayout from "@/components/DashboardLayout";
import { format } from "date-fns";

const Releases = () => {
  const { releases, fetchReleases, isLoading } = useReleaseStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    fetchReleases();
  }, [fetchReleases]);

  const filteredReleases = releases.filter(release => {
    const matchesSearch = release.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || release.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Release Notes</h1>
            <p className="text-gray-600">Manage and publish your product updates</p>
          </div>
          <Link to="/releases/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Release
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search releases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Releases List */}
        {isLoading ? (
          <div className="text-center py-8">Loading releases...</div>
        ) : filteredReleases.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Plus className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No releases found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || filterStatus !== "all" 
                ? "Try adjusting your search or filters"
                : "Create your first release to get started"
              }
            </p>
            <Link to="/releases/new">
              <Button>Create Release</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredReleases.map((release) => (
              <Card key={release.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{release.title}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {format(new Date(release.created_at), 'MMM dd, yyyy')}
                        </div>
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          Release {release.release_type}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(release.status)}>
                        {release.status}
                      </Badge>
                      <div className="flex space-x-1">
                        {release.status === 'published' && (
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        <Link to={`/releases/${release.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                {release.ai_summary && (
                  <CardContent>
                    <p className="text-gray-600 line-clamp-2">{release.ai_summary}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Releases;
