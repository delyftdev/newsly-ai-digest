
import { useEffect, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, TrendingUp, Clock, ThumbsUp, CheckCircle } from "lucide-react";
import { useFeedbackStore } from "@/stores/feedbackStore";
import FeedbackCard from "@/components/feedback/FeedbackCard";
import SubmitIdeaModal from "@/components/feedback/SubmitIdeaModal";
import FilterDropdown from "@/components/feedback/FilterDropdown";
import { useState } from "react";
import { toast } from "sonner";

const Feedback = () => {
  const {
    ideas,
    isLoading,
    error,
    sortBy,
    filterBy,
    fetchIdeas,
    createIdea,
    voteIdea,
    unvoteIdea,
    updateIdeaStatus,
    setSortBy,
    setFilterBy
  } = useFeedbackStore();

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  // Filter and sort ideas
  const filteredAndSortedIdeas = useMemo(() => {
    let filtered = ideas;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(idea =>
        idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply category/status filter
    if (filterBy !== 'all') {
      filtered = filtered.filter(idea => 
        idea.category === filterBy || idea.status === filterBy
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'trending':
        return filtered.sort((a, b) => {
          // Simple trending algorithm: combine votes and recency
          const aScore = a.vote_count + (new Date(a.updated_at).getTime() / 1000000000);
          const bScore = b.vote_count + (new Date(b.updated_at).getTime() / 1000000000);
          return bScore - aScore;
        });
      case 'new':
        return filtered.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case 'top':
        return filtered.sort((a, b) => b.vote_count - a.vote_count);
      default:
        return filtered;
    }
  }, [ideas, searchQuery, filterBy, sortBy]);

  const handleCreateIdea = async (ideaData: any) => {
    await createIdea(ideaData);
  };

  const handleVote = async (ideaId: string) => {
    await voteIdea(ideaId);
  };

  const handleUnvote = async (ideaId: string) => {
    await unvoteIdea(ideaId);
  };

  const handleStatusChange = async (ideaId: string, status: string) => {
    await updateIdeaStatus(ideaId, status);
    toast.success(`Status updated to ${status.replace('-', ' ')}`);
  };

  // Statistics
  const stats = useMemo(() => {
    const total = ideas.length;
    const underReview = ideas.filter(idea => idea.status === 'under-review').length;
    const planned = ideas.filter(idea => idea.status === 'planned').length;
    const completed = ideas.filter(idea => idea.status === 'completed').length;
    
    return { total, underReview, planned, completed };
  }, [ideas]);

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">Error loading feedback: {error}</p>
            <Button onClick={fetchIdeas}>Try Again</Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Feature Ideas</h1>
            <p className="text-gray-600 dark:text-gray-400">Collect and manage community feedback and feature requests</p>
          </div>
          <SubmitIdeaModal onSubmit={handleCreateIdea}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Submit Idea
            </Button>
          </SubmitIdeaModal>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Ideas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="text-2xl font-bold dark:text-gray-100">{stats.total}</div>
                <TrendingUp className="h-4 w-4 ml-2 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Under Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.underReview}</div>
                <Clock className="h-4 w-4 ml-2 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Planned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="text-2xl font-bold text-blue-600">{stats.planned}</div>
                <ThumbsUp className="h-4 w-4 ml-2 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                <CheckCircle className="h-4 w-4 ml-2 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search ideas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            />
          </div>
          <FilterDropdown
            sortBy={sortBy}
            filterBy={filterBy}
            onSortChange={setSortBy}
            onFilterChange={setFilterBy}
          />
        </div>

        {/* Ideas List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredAndSortedIdeas.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 mb-4">
                {searchQuery || filterBy !== 'all' 
                  ? "No ideas match your current filters." 
                  : "No ideas yet. Be the first to submit one!"
                }
              </div>
              <SubmitIdeaModal onSubmit={handleCreateIdea}>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Submit First Idea
                </Button>
              </SubmitIdeaModal>
            </div>
          ) : (
            filteredAndSortedIdeas.map((idea) => (
              <FeedbackCard
                key={idea.id}
                idea={idea}
                onVote={handleVote}
                onUnvote={handleUnvote}
                onStatusChange={handleStatusChange}
                showStatusActions={true}
              />
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Feedback;
