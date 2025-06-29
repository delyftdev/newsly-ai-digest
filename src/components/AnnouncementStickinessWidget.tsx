
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Eye, Heart, MessageSquare, Clock, Mail, MousePointer } from "lucide-react";

const AnnouncementStickinessWidget = () => {
  // Mock data - in real implementation, this would come from the analytics API
  const metrics = [
    {
      label: "Open Rate",
      value: "68%",
      change: "+5%",
      trend: "up",
      icon: Mail,
      description: "Email opens"
    },
    {
      label: "Reactions",
      value: "234",
      change: "+12%",
      trend: "up",
      icon: Heart,
      description: "Total reactions"
    },
    {
      label: "Comments",
      value: "89",
      change: "+8%",
      trend: "up",
      icon: MessageSquare,
      description: "User comments"
    },
    {
      label: "Avg. Time",
      value: "2m 34s",
      change: "+15%",
      trend: "up",
      icon: Clock,
      description: "Time on page"
    },
    {
      label: "Click Rate",
      value: "12%",
      change: "-2%",
      trend: "down",
      icon: MousePointer,
      description: "Click-through rate"
    },
    {
      label: "Views",
      value: "1,247",
      change: "+18%",
      trend: "up",
      icon: Eye,
      description: "Total views"
    }
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="text-center space-y-2">
              <div className="flex justify-center">
                <metric.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <div className="text-lg font-semibold">{metric.value}</div>
                <div className="text-xs text-muted-foreground">{metric.label}</div>
              </div>
              <div className="flex justify-center">
                <Badge
                  variant={metric.trend === "up" ? "default" : "secondary"}
                  className="text-xs flex items-center gap-1"
                >
                  {metric.trend === "up" ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {metric.change}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnnouncementStickinessWidget;
