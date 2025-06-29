
import { supabase } from "@/integrations/supabase/client";

export interface AnalyticsEvent {
  announcementId: string;
  announcementType: 'changelog' | 'release';
  eventType: 'view' | 'time_spent' | 'email_open' | 'link_click';
  eventData?: Record<string, any>;
  source?: string;
  userId?: string;
  sessionId?: string;
}

export const trackAnnouncementEvent = async (event: AnalyticsEvent) => {
  try {
    const { error } = await supabase
      .from('announcement_analytics')
      .insert({
        announcement_id: event.announcementId,
        announcement_type: event.announcementType,
        event_type: event.eventType,
        event_data: event.eventData || {},
        source: event.source || 'direct',
        user_id: event.userId || null,
        session_id: event.sessionId || generateSessionId(),
        user_agent: navigator.userAgent,
      });

    if (error) {
      console.error('Error tracking analytics event:', error);
    }
  } catch (error) {
    console.error('Error tracking analytics event:', error);
  }
};

export const trackPageView = async (
  announcementId: string,
  announcementType: 'changelog' | 'release',
  source: string = 'website'
) => {
  await trackAnnouncementEvent({
    announcementId,
    announcementType,
    eventType: 'view',
    source,
  });
};

export const trackTimeSpent = async (
  announcementId: string,
  announcementType: 'changelog' | 'release',
  timeSpentSeconds: number
) => {
  await trackAnnouncementEvent({
    announcementId,
    announcementType,
    eventType: 'time_spent',
    eventData: { time_spent: timeSpentSeconds },
  });
};

export const trackLinkClick = async (
  announcementId: string,
  announcementType: 'changelog' | 'release',
  linkUrl: string
) => {
  await trackAnnouncementEvent({
    announcementId,
    announcementType,
    eventType: 'link_click',
    eventData: { link_url: linkUrl },
  });
};

export const addReaction = async (
  announcementId: string,
  announcementType: 'changelog' | 'release',
  reactionType: string = 'like',
  userId?: string
) => {
  try {
    const { error } = await supabase
      .from('announcement_reactions')
      .upsert({
        announcement_id: announcementId,
        announcement_type: announcementType,
        reaction_type: reactionType,
        user_id: userId || null,
      }, {
        onConflict: 'announcement_id,announcement_type,user_id,reaction_type'
      });

    if (error) {
      console.error('Error adding reaction:', error);
    }
  } catch (error) {
    console.error('Error adding reaction:', error);
  }
};

export const removeReaction = async (
  announcementId: string,
  announcementType: 'changelog' | 'release',
  reactionType: string = 'like',
  userId?: string
) => {
  try {
    const { error } = await supabase
      .from('announcement_reactions')
      .delete()
      .eq('announcement_id', announcementId)
      .eq('announcement_type', announcementType)
      .eq('reaction_type', reactionType)
      .eq('user_id', userId || null);

    if (error) {
      console.error('Error removing reaction:', error);
    }
  } catch (error) {
    console.error('Error removing reaction:', error);
  }
};

// Utility function to generate a session ID
const generateSessionId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Hook to track time spent on page
export const useTimeTracking = (
  announcementId: string,
  announcementType: 'changelog' | 'release'
) => {
  let startTime = Date.now();
  let lastActiveTime = Date.now();
  
  const trackTimeSpentOnPage = () => {
    const timeSpent = Math.round((lastActiveTime - startTime) / 1000);
    if (timeSpent > 5) { // Only track if user spent more than 5 seconds
      trackTimeSpent(announcementId, announcementType, timeSpent);
    }
  };

  // Update last active time on user interaction
  const updateLastActiveTime = () => {
    lastActiveTime = Date.now();
  };

  // Set up event listeners
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', trackTimeSpentOnPage);
    window.addEventListener('mousemove', updateLastActiveTime);
    window.addEventListener('keypress', updateLastActiveTime);
    window.addEventListener('scroll', updateLastActiveTime);
    
    // Cleanup function
    return () => {
      window.removeEventListener('beforeunload', trackTimeSpentOnPage);
      window.removeEventListener('mousemove', updateLastActiveTime);
      window.removeEventListener('keypress', updateLastActiveTime);
      window.removeEventListener('scroll', updateLastActiveTime);
      trackTimeSpentOnPage(); // Track time when component unmounts
    };
  }
};
