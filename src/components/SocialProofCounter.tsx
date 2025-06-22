
import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const SocialProofCounter = () => {
  const [subscriberCount, setSubscriberCount] = useState(1247); // Starting with a higher number for social proof
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriberCount = async () => {
      try {
        const { count } = await supabase
          .from('subscribers')
          .select('*', { count: 'exact', head: true });
        
        if (count !== null) {
          // Add some base number for social proof
          setSubscriberCount(Math.max(count + 1200, 1247));
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
    for (let i = 0; i < 5; i++) {
      avatars.push(
        <div
          key={i}
          className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-cyan-400/80 border-2 border-white flex items-center justify-center text-white text-xs font-semibold"
          style={{ marginLeft: i > 0 ? '-8px' : '0' }}
        >
          {String.fromCharCode(65 + i)}
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
