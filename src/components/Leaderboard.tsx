
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Users, Coins } from 'lucide-react';

interface LeaderboardEntry {
  referrer_email: string;
  total_referrals: number;
  total_credits: number;
  referral_code: string;
}

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      console.log('Fetching leaderboard data...');
      const { data, error } = await supabase
        .from('referrals')
        .select('referrer_email, total_referrals, total_credits, referral_code')
        .not('referrer_email', 'eq', 'pending@temp.com')
        .gt('total_referrals', 0)
        .order('total_referrals', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching leaderboard:', error);
      } else {
        console.log('Leaderboard data:', data);
        setLeaderboard(data || []);
      }
    } catch (error) {
      console.error('Error in fetchLeaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const maskEmail = (email: string) => {
    if (!email || email === 'pending@temp.com') return 'Anonymous';
    const [username, domain] = email.split('@');
    if (username.length <= 2) return `${username}***@${domain}`;
    return `${username.substring(0, 2)}***@${domain}`;
  };

  if (isLoading) {
    return (
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-white/10 rounded mb-4 w-64 mx-auto"></div>
              <div className="h-4 bg-white/5 rounded mb-8 w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (leaderboard.length === 0) {
    return null; // Don't show leaderboard if no data
  }

  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Trophy className="h-6 w-6 text-yellow-400" />
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Referral Leaderboard
            </h2>
          </div>
          <p className="text-muted-foreground">
            Top referrers who are building their AI squad community
          </p>
        </div>

        <div className="glass-card border-primary/20 overflow-hidden">
          <div className="grid grid-cols-1 gap-0">
            {leaderboard.map((entry, index) => (
              <div 
                key={entry.referral_code} 
                className={`p-4 border-b border-white/[0.08] last:border-b-0 ${
                  index === 0 ? 'bg-gradient-to-r from-yellow-500/10 to-yellow-600/5' :
                  index === 1 ? 'bg-gradient-to-r from-gray-400/10 to-gray-500/5' :
                  index === 2 ? 'bg-gradient-to-r from-amber-600/10 to-amber-700/5' :
                  'hover:bg-white/[0.02]'
                } transition-colors`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
                      {index === 0 && <Trophy className="h-4 w-4 text-yellow-400" />}
                      {index === 1 && <Trophy className="h-4 w-4 text-gray-400" />}
                      {index === 2 && <Trophy className="h-4 w-4 text-amber-600" />}
                      {index > 2 && <span className="text-sm font-semibold text-white">#{index + 1}</span>}
                    </div>
                    <div>
                      <p className="font-medium text-white">{maskEmail(entry.referrer_email)}</p>
                      <p className="text-xs text-muted-foreground">Code: {entry.referral_code}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="text-white font-medium">{entry.total_referrals}</span>
                      <span className="text-muted-foreground">referred</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Coins className="h-4 w-4 text-yellow-400" />
                      <span className="text-white font-medium">{entry.total_credits}</span>
                      <span className="text-muted-foreground">credits</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Leaderboard;
