
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';

interface OnlineUser {
  user_id: string;
  full_name?: string;
  online_at: string;
}

interface PresenceIndicatorProps {
  changelogId: string;
}

export const PresenceIndicator: React.FC<PresenceIndicatorProps> = ({
  changelogId,
}) => {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    let channel: any;

    const setupPresence = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      setCurrentUserId(user.id);

      // Create a unique channel for this changelog
      channel = supabase.channel(`changelog_presence_${changelogId}`)
        .on('presence', { event: 'sync' }, () => {
          const newState = channel.presenceState();
          const users: OnlineUser[] = [];
          
          Object.keys(newState).forEach(key => {
            const presence = newState[key];
            if (presence && presence.length > 0) {
              users.push(presence[0] as OnlineUser);
            }
          });
          
          setOnlineUsers(users.filter(u => u.user_id !== user.id));
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          console.log('User joined:', key, newPresences);
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          console.log('User left:', key, leftPresences);
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            // Get user profile info
            const { data: profile } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', user.id)
              .single();

            // Track current user's presence
            await channel.track({
              user_id: user.id,
              full_name: profile?.full_name || 'Unknown User',
              online_at: new Date().toISOString(),
            });
          }
        });
    };

    setupPresence();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [changelogId]);

  if (onlineUsers.length === 0) {
    return null;
  }

  return (
    <TooltipProvider>
      <div className="flex items-center space-x-1">
        {onlineUsers.slice(0, 3).map((user) => (
          <Tooltip key={user.user_id}>
            <TooltipTrigger asChild>
              <div className="relative">
                <Avatar className="h-6 w-6 border border-background">
                  <AvatarFallback className="text-xs">
                    {user.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div>{user.full_name} is online</div>
            </TooltipContent>
          </Tooltip>
        ))}
        
        {onlineUsers.length > 3 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="h-6 w-6 rounded-full bg-muted border border-background flex items-center justify-center">
                <span className="text-xs font-medium">+{onlineUsers.length - 3}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div>{onlineUsers.length - 3} more online</div>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
};
