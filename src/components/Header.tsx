import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { NetworkSelector } from '@/components/NetworkSelector';
import { WalletBalance } from '@/components/WalletBalance';
import { LiveTokenCounter } from '@/components/LiveTokenCounter';
import { Button } from '@/components/ui/button';
import { Droplets, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import logo from '@/assets/lunaforge-logo.png';

export const Header = () => {
  const navigate = useNavigate();
  const { publicKey } = useWallet();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <a 
          href="/"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <img src={logo} alt="LunaForge logo" className="w-8 h-8 rounded-md" />
          <span className="text-xl font-bold">LunaForge</span>
        </a>
        <div className="flex items-center gap-3">
          <LiveTokenCounter />
          {publicKey && (
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="hidden md:flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => navigate('/create-liquidity')}
            className="hidden md:flex items-center gap-2"
          >
            <Droplets className="w-4 h-4" />
            Liquidity
          </Button>
          <WalletBalance />
          <NetworkSelector />
          <WalletMultiButton className="!bg-accent hover:!bg-accent/90 !rounded-lg !h-11 !px-6 !font-semibold !text-sm transition-all" />
        </div>
      </div>
    </header>
  );
};
