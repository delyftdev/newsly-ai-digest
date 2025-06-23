
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Users, Coins, Search, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LeaderboardEntry {
  referrer_email: string;
  total_referrals: number;
  total_credits: number;
  referral_code: string;
}

interface LeaderboardPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LeaderboardPanel = ({ open, onOpenChange }: LeaderboardPanelProps) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [filteredLeaderboard, setFilteredLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const ITEMS_PER_PAGE = 20;

  const fetchLeaderboard = useCallback(async (resetData = false) => {
    if (resetData) {
      setIsLoading(true);
      setOffset(0);
    } else {
      setIsLoadingMore(true);
    }

    try {
      console.log('Fetching leaderboard data...');
      const currentOffset = resetData ? 0 : offset;
      
      const { data, error } = await supabase
        .from('referrals')
        .select('referrer_email, total_referrals, total_credits, referral_code')
        .not('referrer_email', 'eq', 'pending@temp.com')
        .gt('total_referrals', 0)
        .order('total_referrals', { ascending: false })
        .range(currentOffset, currentOffset + ITEMS_PER_PAGE - 1);

      if (error) {
        console.error('Error fetching leaderboard:', error);
      } else {
        console.log('Leaderboard data:', data);
        const newData = data || [];
        
        if (resetData) {
          setLeaderboard(newData);
        } else {
          setLeaderboard(prev => [...prev, ...newData]);
        }
        
        setHasMore(newData.length === ITEMS_PER_PAGE);
        setOffset(currentOffset + newData.length);
      }
    } catch (error) {
      console.error('Error in fetchLeaderboard:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [offset]);

  useEffect(() => {
    if (open) {
      fetchLeaderboard(true);
    }
  }, [open]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredLeaderboard(leaderboard);
    } else {
      const filtered = leaderboard.filter(entry => 
        entry.referrer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.referral_code.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredLeaderboard(filtered);
    }
  }, [leaderboard, searchQuery]);

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      fetchLeaderboard(false);
    }
  };

  const maskEmail = (email: string) => {
    if (!email || email === 'pending@temp.com') return 'Anonymous';
    const [username, domain] = email.split('@');
    if (username.length <= 2) return `${username}***@${domain}`;
    return `${username.substring(0, 2)}***@${domain}`;
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md bg-gray-900 border-white/[0.08]">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center space-x-2 text-white">
            <Trophy className="h-5 w-5 text-yellow-400" />
            <span>Referral Leaderboard</span>
          </SheetTitle>
        </SheetHeader>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by email or code..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 pr-10 bg-background/50 border-white/[0.08] text-white placeholder:text-muted-foreground"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-white/[0.05]"
            >
              <X className="h-3 w-3 text-muted-foreground" />
            </Button>
          )}
        </div>

        {/* Leaderboard Content */}
        <ScrollArea className="flex-1 h-[calc(100vh-200px)]">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.08]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-white/[0.1] rounded-full" />
                        <div className="space-y-2">
                          <div className="h-4 bg-white/[0.1] rounded w-32" />
                          <div className="h-3 bg-white/[0.05] rounded w-20" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-white/[0.1] rounded w-16" />
                        <div className="h-3 bg-white/[0.05] rounded w-12" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredLeaderboard.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">
                {searchQuery ? 'No referrers found matching your search.' : 'No referrers yet. Be the first!'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredLeaderboard.map((entry, index) => (
                <div
                  key={entry.referral_code}
                  className={`p-4 rounded-lg border border-white/[0.08] ${
                    index === 0 ? 'bg-gradient-to-r from-yellow-500/10 to-yellow-600/5' :
                    index === 1 ? 'bg-gradient-to-r from-gray-400/10 to-gray-500/5' :
                    index === 2 ? 'bg-gradient-to-r from-amber-600/10 to-amber-700/5' :
                    'bg-white/[0.01] hover:bg-white/[0.02]'
                  } transition-colors`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
                        {index === 0 && <Trophy className="h-4 w-4 text-yellow-400" />}
                        {index === 1 && <Trophy className="h-4 w-4 text-gray-400" />}
                        {index === 2 && <Trophy className="h-4 w-4 text-amber-600" />}
                        {index > 2 && <span className="text-sm font-semibold text-white">#{index + 1}</span>}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-white text-sm truncate">{maskEmail(entry.referrer_email)}</p>
                        <p className="text-xs text-muted-foreground truncate">Code: {entry.referral_code}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1 text-xs">
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3 text-primary" />
                        <span className="text-white font-medium">{entry.total_referrals}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Coins className="h-3 w-3 text-yellow-400" />
                        <span className="text-white font-medium">{entry.total_credits}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Load More Button */}
              {!searchQuery && hasMore && (
                <div className="pt-4">
                  <Button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    variant="outline"
                    className="w-full border-white/[0.08] hover:bg-white/[0.05] text-white"
                  >
                    {isLoadingMore ? 'Loading...' : 'Load More'}
                  </Button>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default LeaderboardPanel;
