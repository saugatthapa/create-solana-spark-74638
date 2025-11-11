import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { WalletContextProvider } from '@/components/WalletContextProvider';
import { Header } from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, TrendingUp, Users, Activity, ExternalLink } from 'lucide-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

interface TokenData {
  token_address: string;
  token_name: string;
  token_symbol: string;
  token_image: string | null;
  network: string;
  created_at: string;
}

interface TokenStats {
  holders: number;
  transactions24h: number;
  volume24h: number;
  price: number;
}

const TokenAnalytics = () => {
  const { tokenAddress } = useParams<{ tokenAddress: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { connection } = useConnection();
  const [tokenData, setTokenData] = useState<TokenData | null>(location.state?.token || null);
  const [stats, setStats] = useState<TokenStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tokenAddress) {
      fetchTokenStats();
    }
  }, [tokenAddress]);

  const fetchTokenStats = async () => {
    try {
      setLoading(true);
      
      // Fetch price from Jupiter
      try {
        const priceResponse = await fetch(
          `https://price.jup.ag/v4/price?ids=${tokenAddress}`
        );
        const priceData = await priceResponse.json();
        
        if (priceData.data && priceData.data[tokenAddress!]) {
          setStats(prev => ({
            ...prev!,
            price: priceData.data[tokenAddress!].price,
          }));
        }
      } catch (error) {
        console.error('Error fetching price:', error);
      }

      // Fetch holder count using Solana RPC
      try {
        const mintPubkey = new PublicKey(tokenAddress!);
        const largestAccounts = await connection.getTokenLargestAccounts(mintPubkey);
        
        // This is an approximation - for accurate holder count, you'd need an indexer
        setStats(prev => ({
          holders: largestAccounts.value.length,
          transactions24h: prev?.transactions24h || 0,
          volume24h: prev?.volume24h || 0,
          price: prev?.price || 0,
        }));
      } catch (error) {
        console.error('Error fetching token accounts:', error);
        setStats({
          holders: 0,
          transactions24h: 0,
          volume24h: 0,
          price: 0,
        });
      }
    } catch (error) {
      console.error('Error fetching token stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!tokenData && !tokenAddress) {
    return (
      <WalletContextProvider>
        <div className="min-h-screen">
          <Header />
          <div className="container mx-auto px-4 py-20 text-center">
            <h1 className="text-4xl font-bold mb-4">Token Not Found</h1>
            <Button onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
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
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>

            {/* Token Header */}
            <Card className="p-6 mb-6">
              <div className="flex items-center gap-6">
                {tokenData?.token_image ? (
                  <img
                    src={tokenData.token_image}
                    alt={tokenData.token_name}
                    className="w-24 h-24 rounded-full object-cover border-2 border-border"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center text-white text-3xl font-bold">
                    {tokenData?.token_symbol[0] || tokenAddress?.[0]}
                  </div>
                )}
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">
                      {tokenData?.token_name || 'Token Analytics'}
                    </h1>
                    {tokenData && (
                      <>
                        <Badge variant="outline">{tokenData.token_symbol}</Badge>
                        <Badge variant={tokenData.network === 'mainnet-beta' ? 'default' : 'secondary'}>
                          {tokenData.network === 'mainnet-beta' ? 'Mainnet' : 'Devnet'}
                        </Badge>
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <code className="bg-muted px-2 py-1 rounded">{tokenAddress}</code>
                    <a
                      href={`https://explorer.solana.com/address/${tokenAddress}${
                        tokenData?.network === 'devnet' ? '?cluster=devnet' : ''
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </Card>

            {/* Stats Grid */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading analytics...</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-8 h-8 text-green-500" />
                    <h3 className="text-sm font-medium text-muted-foreground">Price</h3>
                  </div>
                  <p className="text-3xl font-bold">
                    {stats?.price ? `$${stats.price.toFixed(6)}` : 'N/A'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Current market price</p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-8 h-8 text-blue-500" />
                    <h3 className="text-sm font-medium text-muted-foreground">Holders</h3>
                  </div>
                  <p className="text-3xl font-bold">
                    {stats?.holders.toLocaleString() || '0'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Token accounts</p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Activity className="w-8 h-8 text-purple-500" />
                    <h3 className="text-sm font-medium text-muted-foreground">24h Transactions</h3>
                  </div>
                  <p className="text-3xl font-bold">
                    {stats?.transactions24h.toLocaleString() || 'N/A'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Past 24 hours</p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-8 h-8 text-orange-500" />
                    <h3 className="text-sm font-medium text-muted-foreground">24h Volume</h3>
                  </div>
                  <p className="text-3xl font-bold">
                    {stats?.volume24h ? `$${stats.volume24h.toLocaleString()}` : 'N/A'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Trading volume</p>
                </Card>
              </div>
            )}

            {/* Additional Info */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">About Analytics</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  <strong className="text-foreground">Price Data:</strong> Real-time price information
                  is fetched from Jupiter aggregator, which tracks prices across multiple Solana DEXs.
                </p>
                <p>
                  <strong className="text-foreground">Holder Count:</strong> Shows the number of token
                  accounts. For precise analytics including wallet holders, transaction history, and
                  volume data, consider using specialized blockchain indexing services.
                </p>
                <p className="text-sm">
                  💡 <strong>Pro Tip:</strong> For comprehensive on-chain analytics including detailed
                  holder distribution, transaction history, and trading patterns, you can use services
                  like Solscan, Birdeye, or DexScreener.
                </p>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => window.open(`https://solscan.io/token/${tokenAddress}`, '_blank')}
                >
                  View on Solscan
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open(`https://birdeye.so/token/${tokenAddress}`, '_blank')}
                >
                  View on Birdeye
                </Button>
                {tokenData?.network === 'mainnet-beta' && (
                  <Button
                    variant="outline"
                    onClick={() => window.open(`https://dexscreener.com/solana/${tokenAddress}`, '_blank')}
                  >
                    View on DexScreener
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </section>
      </div>
    </WalletContextProvider>
  );
};

export default TokenAnalytics;
