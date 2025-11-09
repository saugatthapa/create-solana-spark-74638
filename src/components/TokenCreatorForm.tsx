import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL, Keypair } from '@solana/web3.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Loader2, Upload, ChevronDown, ExternalLink, CheckCircle } from 'lucide-react';
import { FullScreenLoader } from '@/components/FullScreenLoader';
import { useNetwork } from '@/contexts/NetworkContext';

export const TokenCreatorForm = () => {
  const { connection } = useConnection();
  const { network } = useNetwork();
  const { publicKey, sendTransaction } = useWallet();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [imageFile, setImageFile] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [tokenCreated, setTokenCreated] = useState<{
    mintAddress: string;
    signature: string;
    metadataUri: string;
  } | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    decimals: '9',
    supply: '1000000000',
    description: '',
    revokeFreeze: false,
    revokeMint: false,
    telegram: '',
    website: '',
    twitter: '',
  });

  // Base cost 0.1 SOL, +0.05 SOL if revoke mint is enabled
  const calculateCost = () => {
    const baseCost = 0.1;
    const revokeMintCost = formData.revokeMint ? 0.05 : 0;
    return baseCost + revokeMintCost;
  };

  const getOriginalPrice = () => {
    const currentCost = calculateCost();
    // 75% discount: current = original * 0.25, so original = current / 0.25
    return currentCost / 0.25;
  };

  const getDiscountPercentage = () => {
    return 75; // 75% launch discount
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImageFile(base64);
        setImagePreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!publicKey || !sendTransaction) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a token",
        variant: "destructive",
      });
      return;
    }

    if (!imageFile) {
      toast({
        title: "Image required",
        description: "Please upload a token image",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      console.log('🚀 Starting token creation...');
      
      // Check wallet balance first
      const balance = await connection.getBalance(publicKey);
      const balanceInSOL = balance / LAMPORTS_PER_SOL;
      const totalCost = calculateCost();
      const requiredBalance = totalCost + 0.01; // Add 0.01 SOL for transaction fees
      
      console.log(`💰 Wallet balance: ${balanceInSOL.toFixed(4)} SOL`);
      console.log(`💳 Required: ${requiredBalance.toFixed(4)} SOL (${totalCost} SOL + fees)`);
      
      if (balanceInSOL < requiredBalance) {
        throw new Error(`Insufficient balance. You have ${balanceInSOL.toFixed(4)} SOL but need at least ${requiredBalance.toFixed(4)} SOL (${totalCost} SOL + transaction fees)`);
      }
      
      // Step 1: Send payment to platform wallet
      // Platform wallet derived from PLATFORM_WALLET_PRIVATE_KEY secret
      const platformWalletAddress = new PublicKey('FYno4cE4oaUVjoorFthLcfu4MQHJFg6ocotrZkwUqaLA');
      const platformFee = Math.round(totalCost * LAMPORTS_PER_SOL);
      
      const paymentTransaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: platformWalletAddress,
          lamports: platformFee,
        })
      );

      paymentTransaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      paymentTransaction.feePayer = publicKey;

      console.log('💰 Sending payment to platform...');
      console.log(`📡 Network: ${network}`);
      console.log(`🔗 RPC Endpoint: ${connection.rpcEndpoint}`);
      
      const paymentSignature = await sendTransaction(paymentTransaction, connection, {
        skipPreflight: false,
        maxRetries: 3,
      });
      
      console.log('⏳ Confirming payment...');
      await connection.confirmTransaction(paymentSignature, 'confirmed');
      
      console.log('✅ Payment confirmed:', paymentSignature);

      toast({
        title: "Payment Confirmed 💰",
        description: "Creating your token on Solana...",
      });

      // Step 2: Call backend to create token
      console.log('🔨 Calling backend to create token...');
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          userWallet: publicKey.toBase58(),
          paymentSignature,
          network,
          tokenData: {
            name: formData.name,
            symbol: formData.symbol,
            decimals: parseInt(formData.decimals),
            supply: formData.supply,
            description: formData.description,
            imageBase64: imageFile,
            revokeFreeze: formData.revokeFreeze,
            revokeMint: formData.revokeMint,
            telegram: formData.telegram,
            website: formData.website,
            twitter: formData.twitter,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create token');
      }

      const result = await response.json();
      console.log('✅ Token created successfully!');
      console.log('Mint address:', result.mintAddress);
      console.log('Mint signature:', result.mintSignature);

      setTokenCreated({
        mintAddress: result.mintAddress,
        signature: result.mintSignature,
        metadataUri: result.metadataUri,
      });

      toast({
        title: "Token Created Successfully! 🎉",
        description: `Your ${formData.symbol} token is now live on Solana!`,
      });

    } catch (error) {
      console.error('❌ Error creating token:', error);
      toast({
        title: "Error Creating Token",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Success Screen
  if (tokenCreated) {
    return (
      <section id="create" className="py-20 px-4 min-h-screen">
        <div className="container mx-auto max-w-2xl">
          <Card className="bg-card border-border p-8 text-center space-y-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h2 className="text-3xl font-bold">Token Created Successfully! 🎉</h2>
            
            <div className="space-y-4 text-left">
              <div className="bg-background p-4 rounded-lg">
                <Label className="text-xs text-muted-foreground">Mint Address</Label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-sm break-all">{tokenCreated.mintAddress}</code>
                  <a 
                    href={`https://explorer.solana.com/address/${tokenCreated.mintAddress}${network === 'devnet' ? '?cluster=devnet' : ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="bg-background p-4 rounded-lg">
                <Label className="text-xs text-muted-foreground">Transaction</Label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-sm break-all">{tokenCreated.signature}</code>
                  <a 
                    href={`https://explorer.solana.com/tx/${tokenCreated.signature}${network === 'devnet' ? '?cluster=devnet' : ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

                {/* Metadata URI hidden as requested */}
            </div>

            <div className="space-y-3">
              <Button 
                onClick={() => window.open('https://raydium.io/liquidity/create-pool/', '_blank')}
                className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90"
              >
                Create Liquidity Pool
              </Button>
              
              <Button 
                onClick={() => {
                  setTokenCreated(null);
                  setFormData({
                    name: '',
                    symbol: '',
                    decimals: '9',
                    supply: '1000000000',
                    description: '',
                    revokeFreeze: false,
                    revokeMint: false,
                    telegram: '',
                    website: '',
                    twitter: '',
                  });
                  setImageFile('');
                  setImagePreview('');
                }}
                className="w-full h-12 bg-gradient-to-r from-primary to-cyan-500 hover:opacity-90"
              >
                Create Another Token
              </Button>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="create" className="py-20 px-4 min-h-screen">
      {loading && <FullScreenLoader />}
      <div className="container mx-auto max-w-7xl">
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-[1fr,400px] gap-8">
            {/* Left Column - Form */}
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-input border-border h-12 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="symbol" className="text-sm">Symbol</Label>
                  <Input
                    id="symbol"
                    value={formData.symbol}
                    onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                    required
                    maxLength={10}
                    className="bg-input border-border h-12 rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="decimals" className="text-sm">Decimals</Label>
                  <Input
                    id="decimals"
                    type="number"
                    min="0"
                    max="9"
                    value={formData.decimals}
                    onChange={(e) => setFormData({ ...formData, decimals: e.target.value })}
                    required
                    className="bg-input border-border h-12 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image" className="text-sm">Image</Label>
                  <div className="relative">
                    <Input id="image" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    <label htmlFor="image" className={`flex items-center justify-center gap-2 border h-12 rounded-lg cursor-pointer transition-colors overflow-hidden ${imagePreview ? 'border-primary bg-primary/5 p-1' : 'bg-input border-border hover:border-primary'}`}>
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="h-full w-full object-cover rounded" />
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          <span className="text-sm">Upload</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="supply" className="text-sm">Supply</Label>
                <Input id="supply" type="number" min="1" value={formData.supply} onChange={(e) => setFormData({ ...formData, supply: e.target.value })} required className="bg-input border-border h-12 rounded-lg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm">Description</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} className="bg-input border-border rounded-lg resize-none" />
              </div>
              {/* Advanced Options */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Freeze Authority (0.1 SOL)</span>
                      <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">Required</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Freeze authority will be assigned to your wallet after creation.</p>
                  </div>
                  <Switch 
                    checked={true} 
                    disabled={true}
                    className="data-[state=checked]:bg-primary opacity-50 cursor-not-allowed"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
                  <div>
                    <span className="font-medium">Revoke Mint (+0.05 SOL)</span>
                    <p className="text-xs text-muted-foreground mt-1">Permanently disable minting more tokens (recommended for fairness)</p>
                  </div>
                  <Switch 
                    checked={formData.revokeMint} 
                    onCheckedChange={(checked) => setFormData({ ...formData, revokeMint: checked })}
                    className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted"
                  />
                </div>
                <button type="button" onClick={() => setShowMoreOptions(!showMoreOptions)} className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors">
                  {showMoreOptions ? 'Hide More Options' : 'Show More Options'}
                  <ChevronDown className={`w-4 h-4 transition-transform ${showMoreOptions ? 'rotate-180' : ''}`} />
                </button>
                {/* Social Media Links */}
                {showMoreOptions && (
                  <div className="space-y-3 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="telegram" className="text-sm">Telegram link</Label>
                      <Input id="telegram" placeholder="(Optional)" value={formData.telegram} onChange={(e) => setFormData({ ...formData, telegram: e.target.value })} className="bg-input border-border h-12 rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website" className="text-sm">Website link</Label>
                      <Input id="website" placeholder="(Optional)" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} className="bg-input border-border h-12 rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="twitter" className="text-sm">Twitter or X link</Label>
                      <Input id="twitter" placeholder="(Optional)" value={formData.twitter} onChange={(e) => setFormData({ ...formData, twitter: e.target.value })} className="bg-input border-border h-12 rounded-lg" />
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs text-center text-muted-foreground">tip: coin data cannot be changed after creation</p>
              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <div className="relative">
                  <Button type="submit" disabled={loading || !publicKey} className="w-full h-20 bg-gradient-to-r from-accent to-purple-600 hover:opacity-90 text-base font-semibold rounded-xl">
                    {loading ? (
                      <div className="flex flex-col items-center gap-1">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Creating Token...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-lg">Total Creation Cost</span>
                        <div className="flex items-center gap-2">
                          <span className="line-through text-sm opacity-60">{getOriginalPrice().toFixed(2)} SOL</span>
                          <span className="text-2xl font-bold text-green-400">{calculateCost().toFixed(2)} SOL</span>
                        </div>
                        <span className="text-xs text-yellow-400">🎉 {getDiscountPercentage()}% Launch Discount!</span>
                      </div>
                    )}
                  </Button>
                </div>
              </div>
              {!publicKey && (
                <p className="text-center text-sm text-muted-foreground">Connect your wallet to create a token</p>
              )}
            </div>
            {/* Right Column - Live Preview */}
            <div className="lg:sticky lg:top-24 h-fit">
              <Card className="bg-card border-border p-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-muted-foreground mb-6">Live Preview</h3>
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center overflow-hidden">
                      {imagePreview ? <img src={imagePreview} alt="Token logo" className="w-full h-full object-cover" /> : <span className="text-3xl font-bold text-white">?</span>}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold">{formData.name || 'Token Name'}</h4>
                      <p className="text-sm text-muted-foreground uppercase tracking-wider">${formData.symbol || 'TICKER'}</p>
                    </div>
                    <div className="w-full pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-2">Your token description will appear here...</p>
                      {formData.description && <p className="text-sm">{formData.description}</p>}
                      <p className="text-xs text-muted-foreground mt-2">Preview</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};
