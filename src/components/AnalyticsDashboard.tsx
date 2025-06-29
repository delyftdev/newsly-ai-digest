import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  MessageSquare, 
  Lightbulb,
  Eye,
  ThumbsUp,
  Filter,
  Bell
} from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import AnnouncementStickinessWidget from "./AnnouncementStickinessWidget";

// Dummy data for analytics
const engagementData = [
  { month: "Jan", votes: 150, ideas: 45, comments: 230, users: 89 },
  { month: "Feb", votes: 180, ideas: 52, comments: 280, users: 95 },
  { month: "Mar", votes: 220, ideas: 61, comments: 320, users: 108 },
  { month: "Apr", votes: 260, ideas: 58, comments: 380, users: 125 },
  { month: "May", votes: 310, ideas: 67, comments: 420, users: 142 },
  { month: "Jun", votes: 380, ideas: 74, comments: 480, users: 158 },
];

const activityData = [
  { time: "2h ago", user: "Alex Chen", action: "voted on", item: "Dark mode for mobile app", type: "vote" },
  { time: "4h ago", user: "Sarah Kim", action: "commented on", item: "API rate limiting improvements", type: "comment" },
  { time: "6h ago", user: "Mike Johnson", action: "submitted idea", item: "Real-time collaboration features", type: "idea" },
  { time: "8h ago", user: "Emma Wilson", action: "mentioned you in", item: "User authentication revamp", type: "mention" },
  { time: "1d ago", user: "David Brown", action: "voted on", item: "Performance optimization", type: "vote" },
];

const chartConfig = {
  votes: {
    label: "Votes",
    color: "hsl(var(--chart-1))",
  },
  ideas: {
    label: "Ideas",
    color: "hsl(var(--chart-2))",
  },
  comments: {
    label: "Comments",
    color: "hsl(var(--chart-3))",
  },
  users: {
    label: "Users",
    color: "hsl(var(--chart-4))",
  },
};

const AnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeFilter, setTimeFilter] = useState("MTD");

  const metrics = [
    {
      title: "Active Ideas",
      value: "247",
      change: "+12.5%",
      trend: "up",
      icon: Lightbulb,
      color: "text-yellow-400"
    },
    {
      title: "Total Votes",
      value: "1,847",
      change: "+8.2%",
      trend: "up",
      icon: ThumbsUp,
      color: "text-green-400"
    },
    {
      title: "Comments",
      value: "892",
      change: "+15.3%",
      trend: "up",
      icon: MessageSquare,
      color: "text-blue-400"
    },
    {
      title: "Page Views",
      value: "12.4K",
      change: "+24.8%",
      trend: "up",
      icon: Eye,
      color: "text-cyan-400"
    }
  ];

  return (
    <div className="space-y-6 p-6 bg-black min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {["7D", "MTD", "YTD", "All"].map((period) => (
              <Button
                key={period}
                variant={timeFilter === period ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeFilter(period)}
                className="text-white hover:bg-gray-800"
              >
                {period}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm" className="text-white border-gray-700 hover:bg-gray-800">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Product Announcement Stickiness Widget */}
      <AnnouncementStickinessWidget />

      {/* Metrics Grid - Only 4 cards now */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={metric.title} className="bg-gray-900 border-gray-800 hover:bg-gray-800/50 transition-colors animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">{metric.title}</p>
                  <p className="text-2xl font-bold text-white">{metric.value}</p>
                  <div className="flex items-center mt-2">
                    {metric.trend === "up" ? (
                      <TrendingUp className="w-3 h-3 text-green-400 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-400 mr-1" />
                    )}
                    <span className={`text-xs ${metric.trend === "up" ? "text-green-400" : "text-red-400"}`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
                <metric.icon className={`w-8 h-8 ${metric.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-gray-900 border-gray-800">
          <TabsTrigger value="overview" className="text-white data-[state=active]:bg-gray-700">Overview</TabsTrigger>
          <TabsTrigger value="ideas" className="text-white data-[state=active]:bg-gray-700">Ideas</TabsTrigger>
          <TabsTrigger value="comments" className="text-white data-[state=active]:bg-gray-700">Comments</TabsTrigger>
          <TabsTrigger value="mentions" className="text-white data-[state=active]:bg-gray-700">Mentions</TabsTrigger>
          <TabsTrigger value="users" className="text-white data-[state=active]:bg-gray-700">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Engagement Trends Chart */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Engagement Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <LineChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="votes" 
                      stroke="hsl(var(--chart-1))" 
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 4 }}
                      className="animate-[drawLine_2s_ease-in-out]"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="ideas" 
                      stroke="hsl(var(--chart-2))" 
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 2, r: 4 }}
                      className="animate-[drawLine_2s_ease-in-out_0.5s]"
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* User Activity Chart */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">User Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <AreaChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area 
                      type="monotone" 
                      dataKey="users" 
                      stroke="hsl(var(--chart-4))" 
                      fill="hsl(var(--chart-4))" 
                      fillOpacity={0.3}
                      className="animate-[fillArea_2s_ease-in-out]"
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Comments vs Ideas Chart */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Comments vs Ideas</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <BarChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="comments" 
                    fill="hsl(var(--chart-3))" 
                    radius={[4, 4, 0, 0]}
                    className="animate-[slideUp_1.5s_ease-out]"
                  />
                  <Bar 
                    dataKey="ideas" 
                    fill="hsl(var(--chart-2))" 
                    radius={[4, 4, 0, 0]}
                    className="animate-[slideUp_1.5s_ease-out_0.3s]"
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ideas">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Ideas Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Ideas analytics content will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Comments Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Comments analytics content will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mentions">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Mentions Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Mentions analytics content will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Users Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Users analytics content will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recent Activity Feed */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Recent Activity</CardTitle>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activityData.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-800/50 transition-colors animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                  {activity.type === "vote" && <ThumbsUp className="w-4 h-4 text-green-400" />}
                  {activity.type === "comment" && <MessageSquare className="w-4 h-4 text-blue-400" />}
                  {activity.type === "idea" && <Lightbulb className="w-4 h-4 text-yellow-400" />}
                  {activity.type === "mention" && <Bell className="w-4 h-4 text-orange-400" />}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm">
                    <span className="font-semibold">{activity.user}</span>
                    <span className="text-gray-400 mx-1">{activity.action}</span>
                    <span className="text-white">{activity.item}</span>
                  </p>
                  <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
                </div>
                <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                  {activity.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
