import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { ExternalLink, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TokenCreation {
  id: string;
  token_address: string;
  token_name: string;
  token_symbol: string;
  token_image: string | null;
  creator_wallet: string;
  network: string;
  created_at: string;
}

export const LatestTokens = () => {
  const [tokens, setTokens] = useState<TokenCreation[]>([]);
  const [newTokenId, setNewTokenId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch initial tokens
    const fetchTokens = async () => {
      const { data } = await supabase
        .from('token_creations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (data) {
        setTokens(data);
      }
    };

    fetchTokens();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('token-creations-feed')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'token_creations'
        },
        (payload) => {
          const newToken = payload.new as TokenCreation;
          setTokens(prev => [newToken, ...prev.slice(0, 9)]);
          setNewTokenId(newToken.id);
          setTimeout(() => setNewTokenId(null), 3000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const formatTimeAgo = (dateString: string) => {
    const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            <h2 className="text-3xl font-bold">Live Token Feed</h2>
          </div>
          <p className="text-muted-foreground">
            Watch tokens being created in real-time on LunaForge
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tokens.map((token) => (
            <Card
              key={token.id}
              className={`p-4 transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                newTokenId === token.id ? 'ring-2 ring-primary animate-fade-in' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {token.token_image ? (
                  <img
                    src={token.token_image}
                    alt={token.token_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center text-white font-bold">
                    {token.token_symbol[0]}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold truncate">{token.token_name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {token.token_symbol}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-xs text-muted-foreground">
                      {truncateAddress(token.token_address)}
                    </code>
                    <a
                      href={`https://explorer.solana.com/address/${token.token_address}${
                        token.network === 'devnet' ? '?cluster=devnet' : ''
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(token.created_at)}
                    </span>
                    <Badge
                      variant={token.network === 'mainnet-beta' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {token.network === 'mainnet-beta' ? 'Mainnet' : 'Devnet'}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {tokens.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No tokens created yet. Be the first!</p>
          </div>
        )}
      </div>
    </section>
  );
};
