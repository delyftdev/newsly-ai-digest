
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Target, CheckCircle } from "lucide-react";

const Roadmap = () => {
  const roadmapItems = [
    {
      id: 1,
      title: "Advanced Analytics Dashboard",
      description: "Comprehensive analytics with user engagement metrics and performance insights.",
      quarter: "Q1 2024",
      status: "in-progress",
      priority: "high",
      features: ["User behavior tracking", "Custom reports", "Export functionality"]
    },
    {
      id: 2,
      title: "Mobile Application",
      description: "Native mobile apps for iOS and Android with full feature parity.",
      quarter: "Q2 2024",
      status: "planned",
      priority: "high",
      features: ["iOS app", "Android app", "Push notifications", "Offline support"]
    },
    {
      id: 3,
      title: "API v2.0",
      description: "Enhanced API with better performance, new endpoints, and improved documentation.",
      quarter: "Q2 2024",
      status: "research",
      priority: "medium",
      features: ["GraphQL support", "Webhooks", "Rate limiting", "Better documentation"]
    },
    {
      id: 4,
      title: "AI-Powered Insights",
      description: "Machine learning algorithms to provide intelligent recommendations and insights.",
      quarter: "Q3 2024",
      status: "planned",
      priority: "medium",
      features: ["Content recommendations", "Predictive analytics", "Smart categorization"]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'planned': return 'bg-purple-100 text-purple-800';
      case 'research': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product Roadmap</h1>
            <p className="text-gray-600">Plan and track your product development milestones</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Milestone
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Target className="w-4 h-4 mr-1" />
                Total Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                In Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">6</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">18</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">This Quarter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">8</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {roadmapItems.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status.replace('-', ' ')}
                      </Badge>
                      <Badge className={getPriorityColor(item.priority)}>
                        {item.priority} priority
                      </Badge>
                    </div>
                    <p className="text-gray-600">{item.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{item.quarter}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Key Features:</h4>
                  <div className="flex flex-wrap gap-2">
                    {item.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Roadmap;
