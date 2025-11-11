import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletContextProvider } from '@/components/WalletContextProvider';
import { Header } from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { ExternalLink, TrendingUp, BarChart3, Copy, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

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

interface TokenPrice {
  [key: string]: {
    price: number;
    change24h: number;
  };
}

const Dashboard = () => {
  const { publicKey } = useWallet();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [tokens, setTokens] = useState<TokenCreation[]>([]);
  const [prices, setPrices] = useState<TokenPrice>({});
  const [loading, setLoading] = useState(true);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  useEffect(() => {
    if (publicKey) {
      fetchUserTokens();
    } else {
      setLoading(false);
    }
  }, [publicKey]);

  useEffect(() => {
    if (tokens.length > 0) {
      fetchPrices();
    }
  }, [tokens]);

  const fetchUserTokens = async () => {
    try {
      const { data, error } = await supabase
        .from('token_creations')
        .select('*')
        .eq('creator_wallet', publicKey!.toBase58())
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTokens(data || []);
    } catch (error) {
      console.error('Error fetching tokens:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your tokens',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPrices = async () => {
    try {
      // Fetch prices from Jupiter API for all tokens
      const mainnetTokens = tokens.filter(t => t.network === 'mainnet-beta');
      
      for (const token of mainnetTokens) {
        try {
          const response = await fetch(
            `https://price.jup.ag/v4/price?ids=${token.token_address}`
          );
          const data = await response.json();
          
          if (data.data && data.data[token.token_address]) {
            setPrices(prev => ({
              ...prev,
              [token.token_address]: {
                price: data.data[token.token_address].price,
                change24h: 0, // Jupiter v4 doesn't provide 24h change
              },
            }));
          }
        } catch (error) {
          console.error(`Error fetching price for ${token.token_address}:`, error);
        }
      }
    } catch (error) {
      console.error('Error fetching prices:', error);
    }
  };

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
    toast({
      title: 'Copied!',
      description: 'Token address copied to clipboard',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!publicKey) {
    return (
      <WalletContextProvider>
        <div className="min-h-screen">
          <Header />
          <div className="container mx-auto px-4 py-20 text-center">
            <h1 className="text-4xl font-bold mb-4">Connect Your Wallet</h1>
            <p className="text-muted-foreground">
              Please connect your wallet to view your token dashboard
            </p>
          </div>
        </div>
      </WalletContextProvider>
    );
  }

  return (
    <WalletContextProvider>
      <div className="min-h-screen">
        <Header />
        
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">My Token Dashboard</h1>
              <p className="text-muted-foreground">
                Manage and track all tokens you've created on LunaForge
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading your tokens...</p>
              </div>
            ) : tokens.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="max-w-md mx-auto">
                  <TrendingUp className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h2 className="text-2xl font-bold mb-2">No Tokens Yet</h2>
                  <p className="text-muted-foreground mb-6">
                    You haven't created any tokens yet. Start your journey by creating your first token!
                  </p>
                  <Button onClick={() => navigate('/create')} size="lg">
                    Create Your First Token
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="grid gap-6">
                {tokens.map((token) => {
                  const price = prices[token.token_address];
                  
                  return (
                    <Card key={token.id} className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start gap-6">
                        {/* Token Image */}
                        <div className="flex-shrink-0">
                          {token.token_image ? (
                            <img
                              src={token.token_image}
                              alt={token.token_name}
                              className="w-20 h-20 rounded-full object-cover border-2 border-border"
                            />
                          ) : (
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center text-white text-2xl font-bold">
                              {token.token_symbol[0]}
                            </div>
                          )}
                        </div>

                        {/* Token Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-2xl font-bold">{token.token_name}</h3>
                                <Badge variant="outline">{token.token_symbol}</Badge>
                                <Badge variant={token.network === 'mainnet-beta' ? 'default' : 'secondary'}>
                                  {token.network === 'mainnet-beta' ? 'Mainnet' : 'Devnet'}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Created {formatDate(token.created_at)}
                              </p>
                            </div>
                            
                            {price && (
                              <div className="text-right">
                                <div className="text-2xl font-bold text-green-500">
                                  ${price.price.toFixed(6)}
                                </div>
                                <div className="text-sm text-muted-foreground">Current Price</div>
                              </div>
                            )}
                          </div>

                          {/* Token Address */}
                          <div className="bg-muted/50 rounded-lg p-3 mb-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-xs text-muted-foreground">Mint Address:</span>
                                <code className="text-sm font-mono truncate">{token.token_address}</code>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => copyAddress(token.token_address)}
                                  className="h-8"
                                >
                                  {copiedAddress === token.token_address ? (
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </Button>
                                <a
                                  href={`https://explorer.solana.com/address/${token.token_address}${
                                    token.network === 'devnet' ? '?cluster=devnet' : ''
                                  }`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Button size="sm" variant="ghost" className="h-8">
                                    <ExternalLink className="w-4 h-4" />
                                  </Button>
                                </a>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap gap-3">
                            <Button
                              variant="outline"
                              onClick={() => navigate(`/analytics/${token.token_address}`, { 
                                state: { token } 
                              })}
                            >
                              <BarChart3 className="w-4 h-4 mr-2" />
                              View Analytics
                            </Button>
                            
                            {token.network === 'mainnet-beta' && (
                              <>
                                <Button
                                  variant="outline"
                                  onClick={() => window.open(`https://jup.ag/swap/SOL-${token.token_address}`, '_blank')}
                                >
                                  <TrendingUp className="w-4 h-4 mr-2" />
                                  Trade on Jupiter
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => window.open(`https://raydium.io/swap/?inputCurrency=sol&outputCurrency=${token.token_address}`, '_blank')}
                                >
                                  Trade on Raydium
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </WalletContextProvider>
  );
};

export default Dashboard;
