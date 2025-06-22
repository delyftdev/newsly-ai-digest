
import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const SocialProofCounter = () => {
  const [subscriberCount, setSubscriberCount] = useState(30); // Starting with 30 for realistic social proof
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriberCount = async () => {
      try {
        const { count } = await supabase
          .from('subscribers')
          .select('*', { count: 'exact', head: true });
        
        if (count !== null) {
          // Add base number for social proof (starting at 30)
          setSubscriberCount(Math.max(count + 30, 30));
        }
      } catch (error) {
        console.error('Error fetching subscriber count:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriberCount();

    // Set up real-time subscription for new signups
    const channel = supabase
      .channel('subscriber-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'subscribers'
        },
        () => {
          setSubscriberCount(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const generateAvatars = () => {
    const avatars = [];
    const avatarImages = [
      'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=64&h=64&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=64&h=64&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=64&h=64&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108755-2616b332c1ad?w=64&h=64&fit=crop&crop=face'
    ];

    for (let i = 0; i < 5; i++) {
      avatars.push(
        <div
          key={i}
          className="w-8 h-8 rounded-full border-2 border-white overflow-hidden"
          style={{ marginLeft: i > 0 ? '-8px' : '0' }}
        >
          <img
            src={avatarImages[i]}
            alt={`User ${i + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      );
    }
    return avatars;
  };

  return (
    <div className="flex items-center justify-center space-x-4 mb-8">
      <div className="flex items-center">
        {generateAvatars()}
      </div>
      <div className="text-center">
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-primary" />
          <span className="text-2xl font-bold text-white">
            {isLoading ? '...' : subscriberCount.toLocaleString()}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">AI professionals already building their squad</p>
      </div>
    </div>
  );
};

export default SocialProofCounter;
