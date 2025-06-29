
import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronUp, MessageCircle, Calendar } from 'lucide-react';
import { FeedbackIdea } from '@/stores/feedbackStore';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface FeedbackCardProps {
  idea: FeedbackIdea;
  onVote: (ideaId: string) => void;
  onUnvote: (ideaId: string) => void;
  onStatusChange?: (ideaId: string, status: string) => void;
  showStatusActions?: boolean;
}

const FeedbackCard = ({ 
  idea, 
  onVote, 
  onUnvote, 
  onStatusChange, 
  showStatusActions = false 
}: FeedbackCardProps) => {
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async () => {
    setIsVoting(true);
    try {
      if (idea.user_has_voted) {
        await onUnvote(idea.id);
      } else {
        await onVote(idea.id);
      }
    } finally {
      setIsVoting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'in-development': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'planned': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'under-review': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'declined': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'feature': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'improvement': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'bug': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'integration': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {idea.title}
            </h3>
            {idea.description && (
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-3">
                {idea.description}
              </p>
            )}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={getCategoryColor(idea.category)}>
                {idea.category}
              </Badge>
              <Badge className={getStatusColor(idea.status)}>
                {idea.status.replace('-', ' ')}
              </Badge>
              {idea.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs dark:border-gray-600">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-3 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleVote}
              disabled={isVoting}
              className={cn(
                "flex flex-col items-center gap-1 h-auto py-2 px-3 min-w-[60px]",
                idea.user_has_voted 
                  ? "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20" 
                  : "text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              )}
            >
              <ChevronUp className={cn(
                "h-4 w-4 transition-transform",
                idea.user_has_voted && "scale-110"
              )} />
              <span className="text-xs font-medium">{idea.vote_count}</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDistanceToNow(new Date(idea.created_at), { addSuffix: true })}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-3 w-3" />
              <span>0 comments</span>
            </div>
          </div>
          
          {showStatusActions && onStatusChange && (
            <div className="flex gap-1">
              {['under-review', 'planned', 'in-development', 'completed', 'declined'].map((status) => (
                <Button
                  key={status}
                  variant="ghost"
                  size="sm"
                  onClick={() => onStatusChange(idea.id, status)}
                  className={cn(
                    "text-xs h-6 px-2",
                    idea.status === status && "bg-gray-200 dark:bg-gray-700"
                  )}
                >
                  {status.replace('-', ' ')}
                </Button>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackCard;
