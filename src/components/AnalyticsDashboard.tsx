
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, MessageSquare, Eye } from "lucide-react";
import AnnouncementStickinessWidget from "./AnnouncementStickinessWidget";

const AnalyticsDashboard = () => {
  // Mock data for demonstration
  const metrics = [
    {
      title: "Total Views",
      value: "12,543",
      change: "+12%",
      icon: Eye,
      trend: "up"
    },
    {
      title: "Active Users",
      value: "2,847",
      change: "+5%",
      icon: Users,
      trend: "up"
    },
    {
      title: "Engagement Rate",
      value: "68%",
      change: "+3%",
      icon: TrendingUp,
      trend: "up"
    },
    {
      title: "Feedback Items",
      value: "156",
      change: "+8%",
      icon: MessageSquare,
      trend: "up"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main metrics grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Badge variant={metric.trend === "up" ? "default" : "secondary"}>
                  {metric.change}
                </Badge>
                <span>from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Announcement Stickiness Widget - separate section */}
      <div className="mt-8">
        <AnnouncementStickinessWidget />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
