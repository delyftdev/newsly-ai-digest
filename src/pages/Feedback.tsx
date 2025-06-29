
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, ArrowUp, MessageSquare, Filter } from "lucide-react";
import { useFeedbackStore } from "@/stores/feedbackStore";
import { useToast } from "@/hooks/use-toast";
import SubmitIdeaModal from "@/components/feedback/SubmitIdeaModal";
import FilterDropdown from "@/components/feedback/FilterDropdown";
import FeedbackCard from "@/components/feedback/FeedbackCard";

const Feedback = () => {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const { ideas, isLoading, error, sortBy, filterBy, fetchIdeas, setSortBy, setFilterBy } = useFeedbackStore();
  const { toast } = useToast();

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const filteredIdeas = ideas.filter(idea => {
    if (filterBy === 'all') return true;
    if (filterBy === 'my-votes') return idea.user_has_voted;
    return idea.status === filterBy;
  });

  const sortedIdeas = [...filteredIdeas].sort((a, b) => {
    switch (sortBy) {
      case 'trending':
        return b.vote_count - a.vote_count;
      case 'new':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'top':
        return b.vote_count - a.vote_count;
      default:
        return 0;
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading feedback...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Feedback</h1>
          <p className="text-muted-foreground">
            Share your ideas and vote on features you'd like to see
          </p>
        </div>
        <Button onClick={() => setIsSubmitModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Submit Idea
        </Button>
      </div>

      {/* Filters and Sorting */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filter:</span>
          <FilterDropdown value={filterBy} onChange={setFilterBy} />
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <div className="flex gap-1">
            {(['trending', 'new', 'top'] as const).map((sort) => (
              <Button
                key={sort}
                variant={sortBy === sort ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy(sort)}
              >
                {sort === 'trending' && <ArrowUp className="h-3 w-3 mr-1" />}
                {sort.charAt(0).toUpperCase() + sort.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{ideas.length}</div>
            <div className="text-sm text-muted-foreground">Total Ideas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {ideas.filter(idea => idea.status === 'under-review').length}
            </div>
            <div className="text-sm text-muted-foreground">Under Review</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {ideas.filter(idea => idea.status === 'planned').length}
            </div>
            <div className="text-sm text-muted-foreground">Planned</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {ideas.filter(idea => idea.status === 'completed').length}
            </div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
      </div>

      {/* Ideas List */}
      <div className="space-y-4">
        {sortedIdeas.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No feedback found</h3>
              <p className="text-muted-foreground mb-4">
                {filterBy === 'all' 
                  ? "Be the first to submit an idea!"
                  : "Try adjusting your filters to see more results."
                }
              </p>
              <Button onClick={() => setIsSubmitModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Submit First Idea
              </Button>
            </CardContent>
          </Card>
        ) : (
          sortedIdeas.map((idea) => (
            <FeedbackCard key={idea.id} idea={idea} />
          ))
        )}
      </div>

      <SubmitIdeaModal 
        open={isSubmitModalOpen} 
        onOpenChange={setIsSubmitModalOpen} 
      />
    </div>
  );
};

export default Feedback;
