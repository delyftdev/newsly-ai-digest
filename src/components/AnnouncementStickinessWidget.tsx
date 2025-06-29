
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Eye, Users, Clock } from "lucide-react";

const AnnouncementStickinessWidget = () => {
  // Mock data for demonstration
  const stickinessData = {
    totalViews: 2847,
    uniqueViewers: 1234,
    avgTimeSpent: "2m 34s",
    returnRate: 18.5,
    engagementScore: 72,
    trend: "up" as const
  };

  const metrics = [
    {
      label: "Total Views",
      value: stickinessData.totalViews.toLocaleString(),
      icon: Eye,
      color: "text-blue-400"
    },
    {
      label: "Unique Viewers", 
      value: stickinessData.uniqueViewers.toLocaleString(),
      icon: Users,
      color: "text-green-400"
    },
    {
      label: "Avg. Time Spent",
      value: stickinessData.avgTimeSpent,
      icon: Clock,
      color: "text-yellow-400"
    },
    {
      label: "Return Rate",
      value: `${stickinessData.returnRate}%`,
      icon: stickinessData.trend === "up" ? TrendingUp : TrendingDown,
      color: stickinessData.trend === "up" ? "text-green-400" : "text-red-400"
    }
  ];

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="text-xs border-blue-500 text-blue-400">
              Engagement Analytics
            </Badge>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${stickinessData.engagementScore >= 70 ? 'bg-green-400' : stickinessData.engagementScore >= 50 ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
              <span className="text-sm text-gray-300">
                Score: {stickinessData.engagementScore}/100
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <div key={metric.label} className="text-center p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors">
              <metric.icon className={`w-6 h-6 mx-auto mb-2 ${metric.color}`} />
              <p className="text-lg font-bold text-white mb-1">{metric.value}</p>
              <p className="text-xs text-gray-400">{metric.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnnouncementStickinessWidget;
