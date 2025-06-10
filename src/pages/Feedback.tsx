
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, MessageSquare, ThumbsUp, AlertCircle } from "lucide-react";

const Feedback = () => {
  const feedbackItems = [
    {
      id: 1,
      title: "Add dark mode support",
      description: "It would be great to have a dark theme option for better user experience.",
      status: "under-review",
      votes: 24,
      category: "Feature Request",
      date: "2 days ago"
    },
    {
      id: 2,
      title: "Export functionality is slow",
      description: "Large exports take too long to process and sometimes timeout.",
      status: "planned",
      votes: 18,
      category: "Bug Report",
      date: "1 week ago"
    },
    {
      id: 3,
      title: "Mobile app improvements",
      description: "The mobile experience could be enhanced with better navigation.",
      status: "completed",
      votes: 32,
      category: "Enhancement",
      date: "2 weeks ago"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'planned': return 'bg-blue-100 text-blue-800';
      case 'under-review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Feedback</h1>
            <p className="text-gray-600">Collect and manage customer feedback and feature requests</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Feedback
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Under Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">23</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Planned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">18</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">115</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {feedbackItems.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <p className="text-gray-600">{item.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{item.category}</span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{item.votes}</span>
                    </div>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Feedback;
