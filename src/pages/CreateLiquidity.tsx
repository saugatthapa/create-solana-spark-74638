import { WalletContextProvider } from '@/components/WalletContextProvider';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ExternalLink, Droplets, Info } from 'lucide-react';

const CreateLiquidity = () => {
  const raydiumUrl = 'https://raydium.io/liquidity/create-pool/';
  
  return (
    <WalletContextProvider>
      <div className="min-h-screen">
        <Header />
        
        <section className="py-20 px-4 min-h-[calc(100vh-80px)] flex items-center">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Droplets className="w-12 h-12 text-primary" />
                <h1 className="text-4xl font-bold">Create Liquidity Pool</h1>
              </div>
              <p className="text-muted-foreground text-lg">
                Add liquidity to your token and enable trading on Raydium DEX
              </p>
            </div>

            <Card className="p-8 space-y-6">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex gap-3">
                <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="mb-2">
                    Creating a liquidity pool allows traders to buy and sell your token on Raydium, 
                    Solana's leading decentralized exchange.
                  </p>
                  <p>
                    You'll need to provide both your token and SOL to create the initial liquidity pool.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Steps to Create Liquidity:</h3>
                <ol className="space-y-3 text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-semibold">
                      1
                    </span>
                    <span>Connect your wallet on Raydium (the wallet that holds your tokens)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-semibold">
                      2
                    </span>
                    <span>Enter your token's mint address</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-semibold">
                      3
                    </span>
                    <span>Choose how much of your token and SOL to provide as initial liquidity</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-semibold">
                      4
                    </span>
                    <span>Set the initial price ratio between your token and SOL</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-semibold">
                      5
                    </span>
                    <span>Confirm the transaction in your wallet</span>
                  </li>
                </ol>
              </div>

              <div className="pt-4">
                <Button
                  onClick={() => window.open(raydiumUrl, '_blank')}
                  className="w-full h-14 text-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90"
                >
                  <Droplets className="w-5 h-5 mr-2" />
                  Open Raydium Liquidity Pool Creator
                  <ExternalLink className="w-5 h-5 ml-2" />
                </Button>
              </div>

              <div className="text-sm text-muted-foreground text-center pt-4 border-t">
                <p>
                  💡 Tip: Start with a smaller liquidity amount to test, you can always add more later
                </p>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </WalletContextProvider>
  );
};

export default CreateLiquidity;
