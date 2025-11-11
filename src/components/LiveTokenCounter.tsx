import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp } from 'lucide-react';

export const LiveTokenCounter = () => {
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Initial count fetch
    const fetchCount = async () => {
      const { count: initialCount } = await supabase
        .from('token_creations')
        .select('*', { count: 'exact', head: true });
      
      if (initialCount !== null) {
        setCount(initialCount);
      }
    };

    fetchCount();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('token-creations-counter')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'token_creations'
        },
        () => {
          setIsAnimating(true);
          setCount(prev => prev + 1);
          setTimeout(() => setIsAnimating(false), 500);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-primary/10 border border-primary/20 rounded-lg">
      <TrendingUp className={`w-3 h-3 sm:w-4 sm:h-4 text-primary transition-transform ${isAnimating ? 'scale-125' : ''}`} />
      <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
        <span className={`transition-all ${isAnimating ? 'scale-110 text-primary' : ''}`}>
          {count.toLocaleString()}
        </span>
        <span className="text-muted-foreground ml-1 hidden sm:inline">tokens created</span>
        <span className="text-muted-foreground ml-1 sm:hidden">tokens</span>
      </span>
    </div>
  );
};
