
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, ArrowUp, MessageSquare, Filter, ThumbsUp } from "lucide-react";
import { useFeedbackStore } from "@/stores/feedbackStore";
import { useToast } from "@/hooks/use-toast";
import SubmitIdeaModal from "@/components/feedback/SubmitIdeaModal";
import FilterDropdown from "@/components/feedback/FilterDropdown";
import DashboardLayout from "@/components/DashboardLayout";

const Feedback = () => {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const { ideas, isLoading, error, sortBy, filterBy, fetchIdeas, setSortBy, setFilterBy, createIdea, voteIdea, unvoteIdea } = useFeedbackStore();
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
    return idea.status === filterBy || idea.category === filterBy;
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

  const handleVote = async (ideaId: string, hasVoted: boolean) => {
    if (hasVoted) {
      await unvoteIdea(ideaId);
    } else {
      await voteIdea(ideaId);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading feedback...</p>
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
            <h1 className="text-2xl font-bold text-foreground">Feedback</h1>
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

        {/* Ideas List */}
        <div className="space-y-4">
          {sortedIdeas.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-foreground">No feedback found</h3>
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
              <Card key={idea.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Vote Button */}
                    <div className="flex flex-col items-center gap-1">
                      <Button
                        variant={idea.user_has_voted ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleVote(idea.id, idea.user_has_voted || false)}
                        className="h-8 w-8 p-0"
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium text-foreground">
                        {idea.vote_count}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="text-lg font-semibold text-foreground line-clamp-2">
                          {idea.title}
                        </h3>
                        <div className="flex gap-2 flex-shrink-0">
                          <Badge 
                            variant={idea.status === 'completed' ? 'default' : 'secondary'}
                            className="capitalize"
                          >
                            {idea.status.replace('-', ' ')}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {idea.category.replace('-', ' ')}
                          </Badge>
                        </div>
                      </div>
                      
                      {idea.description && (
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-3">
                          {idea.description}
                        </p>
                      )}

                      {idea.tags && idea.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {idea.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <SubmitIdeaModal 
          isOpen={isSubmitModalOpen} 
          onClose={() => setIsSubmitModalOpen(false)}
          onSubmit={createIdea}
        />
      </div>
    </DashboardLayout>
  );
};

export default Feedback;
