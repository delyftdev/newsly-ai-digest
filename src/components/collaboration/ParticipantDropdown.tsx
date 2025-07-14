
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TeamMember {
  id: string;
  user_id: string;
  role: string;
  profiles?: {
    full_name?: string;
  };
}

interface Participant {
  user_id: string;
  role: string;
}

interface ParticipantDropdownProps {
  changelogId: string;
  onClose: () => void;
  onParticipantsChange: () => void;
}

export const ParticipantDropdown: React.FC<ParticipantDropdownProps> = ({
  changelogId,
  onClose,
  onParticipantsChange,
}) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [currentParticipants, setCurrentParticipants] = useState<Participant[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTeamMembers();
    fetchCurrentParticipants();
  }, [changelogId]);

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          id,
          user_id,
          role,
          profiles (
            full_name
          )
        `)
        .eq('status', 'active');

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast({
        title: "Error",
        description: "Failed to load team members",
        variant: "destructive",
      });
    }
  };

  const fetchCurrentParticipants = async () => {
    try {
      const { data, error } = await supabase
        .from('changelog_participants')
        .select('user_id, role')
        .eq('changelog_id', changelogId)
        .eq('status', 'active');

      if (error) throw error;
      setCurrentParticipants(data || []);
      setSelectedMembers((data || []).map(p => p.user_id));
    } catch (error) {
      console.error('Error fetching participants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMemberToggle = (userId: string) => {
    setSelectedMembers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Remove participants who are no longer selected
      const toRemove = currentParticipants
        .filter(p => !selectedMembers.includes(p.user_id))
        .map(p => p.user_id);

      if (toRemove.length > 0) {
        await supabase
          .from('changelog_participants')
          .delete()
          .eq('changelog_id', changelogId)
          .in('user_id', toRemove);
      }

      // Add new participants
      const toAdd = selectedMembers.filter(
        userId => !currentParticipants.some(p => p.user_id === userId)
      );

      if (toAdd.length > 0) {
        const newParticipants = toAdd.map(userId => ({
          changelog_id: changelogId,
          user_id: userId,
          role: 'collaborator',
          invited_by: user.id,
        }));

        await supabase
          .from('changelog_participants')
          .insert(newParticipants);
      }

      // Log activity
      await supabase
        .from('changelog_activity')
        .insert({
          changelog_id: changelogId,
          user_id: user.id,
          activity_type: 'participants_updated',
          description: `Updated participants (${selectedMembers.length} total)`,
          activity_data: { participant_count: selectedMembers.length }
        });

      toast({
        title: "Success",
        description: "Participants updated successfully",
      });

      onParticipantsChange();
      onClose();
    } catch (error) {
      console.error('Error updating participants:', error);
      toast({
        title: "Error",
        description: "Failed to update participants",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card className="absolute top-full left-0 mt-2 w-80 z-50">
        <CardContent className="p-4">
          <div className="text-center">Loading team members...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="absolute top-full left-0 mt-2 w-80 z-50">
      <CardContent className="p-4">
        <div className="space-y-3">
          <h4 className="font-medium">Add Team Members</h4>
          
          <div className="max-h-60 overflow-y-auto space-y-2">
            {teamMembers.map((member) => (
              <div key={member.user_id} className="flex items-center space-x-3">
                <Checkbox
                  checked={selectedMembers.includes(member.user_id)}
                  onCheckedChange={() => handleMemberToggle(member.user_id)}
                />
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {member.profiles?.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="text-sm font-medium">
                    {member.profiles?.full_name || 'Unknown User'}
                  </div>
                  <div className="text-xs text-muted-foreground capitalize">
                    {member.role}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
