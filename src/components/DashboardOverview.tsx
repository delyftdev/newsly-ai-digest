
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Users, 
  Eye, 
  TrendingUp, 
  Plus,
  Calendar,
  BarChart3
} from "lucide-react";
import { useReleaseStore } from "@/stores/releaseStore";
import { useCompanyStore } from "@/stores/companyStore";
import { Link } from "react-router-dom";

const DashboardOverview = () => {
  const { releases } = useReleaseStore();
  const { teamMembers } = useCompanyStore();

  const publishedReleases = releases.filter(r => r.status === 'published');
  const draftReleases = releases.filter(r => r.status === 'draft');
  const recentReleases = releases.slice(0, 5);

  const stats = [
    {
      title: "Total Releases",
      value: releases.length,
      description: `${publishedReleases.length} published, ${draftReleases.length} drafts`,
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Team Members",
      value: teamMembers.length,
      description: "Active collaborators",
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Total Views",
      value: "2.4K",
      description: "+12% from last month",
      icon: Eye,
      color: "text-purple-600",
    },
    {
      title: "Engagement",
      value: "89%",
      description: "Average read rate",
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-500 mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Get started with creating and managing your releases
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/releases/new">
              <Button className="w-full h-20 flex flex-col gap-2" variant="outline">
                <Plus className="h-6 w-6" />
                Create New Release
              </Button>
            </Link>
            <Link to="/settings">
              <Button className="w-full h-20 flex flex-col gap-2" variant="outline">
                <Users className="h-6 w-6" />
                Invite Team Members
              </Button>
            </Link>
            <Link to="/settings">
              <Button className="w-full h-20 flex flex-col gap-2" variant="outline">
                <BarChart3 className="h-6 w-6" />
                View Analytics
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Releases */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Releases</CardTitle>
            <CardDescription>
              Your latest release notes and updates
            </CardDescription>
          </div>
          <Link to="/releases">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentReleases.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No releases yet</h3>
              <p className="text-sm mb-4">
                Create your first release to get started with sharing updates
              </p>
              <Link to="/releases/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Release
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentReleases.map((release) => (
                <div
                  key={release.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium">{release.title}</h4>
                      <Badge 
                        variant={release.status === 'published' ? 'default' : 'secondary'}
                      >
                        {release.status}
                      </Badge>
                      <Badge variant="outline">
                        {release.release_type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(release.release_date).toLocaleDateString()}
                      </span>
                      {release.tags && release.tags.length > 0 && (
                        <span>
                          {release.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs mr-1">
                              {tag}
                            </Badge>
                          ))}
                        </span>
                      )}
                    </div>
                  </div>
                  <Link to={`/releases/${release.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
