
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { X, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Participant {
  id: string;
  user_id: string;
  role: string;
  profiles?: {
    full_name?: string;
  };
}

interface AvatarRowProps {
  changelogId: string;
  onParticipantsChange: () => void;
}

export const AvatarRow: React.FC<AvatarRowProps> = ({
  changelogId,
  onParticipantsChange,
}) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    getCurrentUser();
    fetchParticipants();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel(`changelog_participants_${changelogId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'changelog_participants',
        filter: `changelog_id=eq.${changelogId}`
      }, () => {
        fetchParticipants();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [changelogId]);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUserId(user?.id || null);
  };

  const fetchParticipants = async () => {
    try {
      const { data, error } = await supabase
        .from('changelog_participants')
        .select(`
          id,
          user_id,
          role,
          profiles (
            full_name
          )
        `)
        .eq('changelog_id', changelogId)
        .eq('status', 'active');

      if (error) throw error;
      setParticipants(data || []);
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  };

  const removeParticipant = async (participantId: string, userId: string) => {
    try {
      const { error } = await supabase
        .from('changelog_participants')
        .delete()
        .eq('id', participantId);

      if (error) throw error;

      // Log activity
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('changelog_activity')
          .insert({
            changelog_id: changelogId,
            user_id: user.id,
            activity_type: 'participant_removed',
            description: `Removed participant from collaboration`,
            activity_data: { removed_user_id: userId }
          });
      }

      toast({
        title: "Success",
        description: "Participant removed successfully",
      });

      onParticipantsChange();
    } catch (error) {
      console.error('Error removing participant:', error);
      toast({
        title: "Error",
        description: "Failed to remove participant",
        variant: "destructive",
      });
    }
  };

  const visibleParticipants = participants.slice(0, 5);
  const hiddenCount = Math.max(0, participants.length - 5);

  if (participants.length === 0) {
    return null;
  }

  return (
    <TooltipProvider>
      <div className="flex items-center space-x-2 py-2">
        <div className="flex items-center space-x-1">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Collaborators:</span>
        </div>
        
        <div className="flex items-center space-x-1">
          {visibleParticipants.map((participant) => (
            <div key={participant.id} className="relative group">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar className="h-8 w-8 border-2 border-background">
                    <AvatarFallback className="text-xs">
                      {participant.profiles?.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-center">
                    <div className="font-medium">
                      {participant.profiles?.full_name || 'Unknown User'}
                    </div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {participant.role}
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
              
              {currentUserId && currentUserId !== participant.user_id && (
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeParticipant(participant.id, participant.user_id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
          
          {hiddenCount > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                  <span className="text-xs font-medium">+{hiddenCount}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div>{hiddenCount} more participant{hiddenCount > 1 ? 's' : ''}</div>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};
