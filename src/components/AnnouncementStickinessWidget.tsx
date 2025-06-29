
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Eye, 
  Heart, 
  MessageSquare, 
  Clock,
  MousePointer,
  TrendingUp,
  TrendingDown,
  Calendar,
  ExternalLink
} from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/authStore";
import { useCompanyStore } from "@/stores/companyStore";

// Types for our analytics data
interface AnnouncementMetrics {
  totalAnnouncements: number;
  avgOpenRate: number;
  totalReactions: number;
  avgCommentsPerAnnouncement: number;
  avgTimeSpent: number;
  clickThroughRate: number;
}

interface AnnouncementPerformance {
  id: string;
  title: string;
  type: 'changelog' | 'release';
  published_at: string;
  view_count: number;
  unique_views: number;
  reaction_count: number;
  comment_count: number;
  avg_time_spent: number;
  email_open_rate: number;
  click_through_rate: number;
}

interface TrendData {
  date: string;
  views: number;
  reactions: number;
  comments: number;
}

const chartConfig = {
  views: {
    label: "Views",
    color: "hsl(var(--chart-1))",
  },
  reactions: {
    label: "Reactions",
    color: "hsl(var(--chart-2))",
  },
  comments: {
    label: "Comments",
    color: "hsl(var(--chart-3))",
  },
};

const AnnouncementStickinessWidget = () => {
  const { user } = useAuthStore();
  const { company } = useCompanyStore();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<AnnouncementMetrics>({
    totalAnnouncements: 0,
    avgOpenRate: 0,
    totalReactions: 0,
    avgCommentsPerAnnouncement: 0,
    avgTimeSpent: 0,
    clickThroughRate: 0,
  });
  const [recentPerformance, setRecentPerformance] = useState<AnnouncementPerformance[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);

  useEffect(() => {
    if (user && company) {
      fetchAnnouncementMetrics();
    }
  }, [user, company]);

  const fetchAnnouncementMetrics = async () => {
    try {
      setLoading(true);
      
      // Fetch changelogs and releases
      const { data: changelogs } = await supabase
        .from('changelogs')
        .select('*')
        .eq('company_id', company?.id)
        .not('published_at', 'is', null)
        .order('published_at', { ascending: false })
        .limit(10);

      const { data: releases } = await supabase
        .from('releases')
        .select('*')
        .eq('company_id', company?.id)
        .not('published_at', 'is', null)
        .order('published_at', { ascending: false })
        .limit(10);

      const allAnnouncements = [
        ...(changelogs || []).map(c => ({ ...c, type: 'changelog' as const })),
        ...(releases || []).map(r => ({ ...r, type: 'release' as const }))
      ].sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());

      // Calculate metrics
      const totalAnnouncements = allAnnouncements.length;
      const totalViews = allAnnouncements.reduce((sum, a) => sum + (a.view_count || 0), 0);
      const totalUniqueViews = allAnnouncements.reduce((sum, a) => sum + (a.unique_views || 0), 0);
      const totalReactions = allAnnouncements.reduce((sum, a) => sum + (a.reaction_count || 0), 0);
      const totalComments = allAnnouncements.reduce((sum, a) => sum + (a.comment_count || 0), 0);
      const avgTimeSpent = allAnnouncements.reduce((sum, a) => sum + (a.avg_time_spent || 0), 0) / Math.max(totalAnnouncements, 1);
      const avgOpenRate = totalAnnouncements > 0 ? (totalUniqueViews / totalAnnouncements) * 100 : 0;
      const avgCommentsPerAnnouncement = totalAnnouncements > 0 ? totalComments / totalAnnouncements : 0;
      const clickThroughRate = allAnnouncements.reduce((sum, a) => sum + (a.click_through_rate || 0), 0) / Math.max(totalAnnouncements, 1);

      setMetrics({
        totalAnnouncements,
        avgOpenRate,
        totalReactions,
        avgCommentsPerAnnouncement,
        avgTimeSpent,
        clickThroughRate,
      });

      // Set recent performance data
      setRecentPerformance(allAnnouncements.slice(0, 5).map(a => ({
        id: a.id,
        title: a.title,
        type: a.type,
        published_at: a.published_at,
        view_count: a.view_count || 0,
        unique_views: a.unique_views || 0,
        reaction_count: a.reaction_count || 0,
        comment_count: a.comment_count || 0,
        avg_time_spent: a.avg_time_spent || 0,
        email_open_rate: a.email_open_rate || 0,
        click_through_rate: a.click_through_rate || 0,
      })));

      // Generate trend data (last 7 days)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split('T')[0];
      });

      const trendData = last7Days.map(date => ({
        date: date,
        views: Math.floor(Math.random() * 100) + 20, // Mock data for now
        reactions: Math.floor(Math.random() * 30) + 5,
        comments: Math.floor(Math.random() * 15) + 2,
      }));

      setTrendData(trendData);

    } catch (error) {
      console.error('Error fetching announcement metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeSpent = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    return `${Math.round(seconds / 60)}m`;
  };

  const getPerformanceColor = (value: number, threshold: number) => {
    return value >= threshold ? "text-green-400" : "text-yellow-400";
  };

  if (loading) {
    return (
      <Card className="bg-gray-900 border-gray-800 animate-pulse">
        <CardHeader>
          <CardTitle className="text-white">Loading Announcement Analytics...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 bg-gray-800 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              Product Announcement Stickiness
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={fetchAnnouncementMetrics} className="text-gray-400 hover:text-white">
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-400">Total Published</span>
              </div>
              <p className="text-2xl font-bold text-white">{metrics.totalAnnouncements}</p>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-400">Avg Open Rate</span>
              </div>
              <p className={`text-2xl font-bold ${getPerformanceColor(metrics.avgOpenRate, 70)}`}>
                {metrics.avgOpenRate.toFixed(1)}%
              </p>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-red-400" />
                <span className="text-sm text-gray-400">Total Reactions</span>
              </div>
              <p className="text-2xl font-bold text-white">{metrics.totalReactions}</p>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-400">Avg Comments</span>
              </div>
              <p className="text-2xl font-bold text-white">{metrics.avgCommentsPerAnnouncement.toFixed(1)}</p>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-400">Avg Time</span>
              </div>
              <p className="text-2xl font-bold text-white">{formatTimeSpent(metrics.avgTimeSpent)}</p>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MousePointer className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-gray-400">Click Rate</span>
              </div>
              <p className={`text-2xl font-bold ${getPerformanceColor(metrics.clickThroughRate, 5)}`}>
                {metrics.clickThroughRate.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Engagement Trend Chart */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">7-Day Engagement Trend</h3>
            <div className="h-64">
              <ChartContainer config={chartConfig}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9CA3AF"
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis stroke="#9CA3AF" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="views" 
                    stroke="hsl(var(--chart-1))" 
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 3 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="reactions" 
                    stroke="hsl(var(--chart-2))" 
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 2, r: 3 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="comments" 
                    stroke="hsl(var(--chart-3))" 
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--chart-3))", strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </div>

          {/* Recent Announcements Performance */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Recent Announcement Performance</h3>
            <div className="space-y-3">
              {recentPerformance.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No published announcements yet</p>
                  <p className="text-sm">Publish your first changelog or release to see analytics</p>
                </div>
              ) : (
                recentPerformance.map((announcement) => (
                  <div key={announcement.id} className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-white truncate">{announcement.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {announcement.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400">
                          Published {new Date(announcement.published_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Views</span>
                        <p className="font-semibold text-white">{announcement.view_count}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Unique</span>
                        <p className="font-semibold text-white">{announcement.unique_views}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Reactions</span>
                        <p className="font-semibold text-white">{announcement.reaction_count}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Comments</span>
                        <p className="font-semibold text-white">{announcement.comment_count}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Avg Time</span>
                        <p className="font-semibold text-white">{formatTimeSpent(announcement.avg_time_spent)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnnouncementStickinessWidget;
