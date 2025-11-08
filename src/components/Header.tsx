import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Coins } from 'lucide-react';
import { NetworkSelector } from '@/components/NetworkSelector';

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
            <Coins className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">TokenLaunch</span>
        </div>
        <div className="flex items-center gap-3">
          <NetworkSelector />
          <WalletMultiButton className="!bg-accent hover:!bg-accent/90 !rounded-lg !h-11 !px-6 !font-semibold !text-sm transition-all" />
        </div>
      </div>
    </header>
  );
};
