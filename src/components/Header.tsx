import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { NetworkSelector } from '@/components/NetworkSelector';
import { WalletBalance } from '@/components/WalletBalance';
import { LiveTokenCounter } from '@/components/LiveTokenCounter';
import { Button } from '@/components/ui/button';
import { Droplets, LayoutDashboard, BookOpen, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import logo from '@/assets/lunaforge-logo.png';

export const Header = () => {
  const navigate = useNavigate();
  const { publicKey } = useWallet();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2">
          <a 
            href="/"
            className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <img src={logo} alt="LunaForge logo" className="w-7 h-7 sm:w-8 sm:h-8 rounded-md" />
            <span className="text-lg sm:text-xl font-bold">LunaForge</span>
          </a>
          
          <div className="flex items-center gap-1.5 sm:gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/how-to-create-meme-coin')}
              className="hidden md:flex items-center gap-2 h-9 sm:h-10"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden lg:inline">How to Create</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/blog')}
              className="hidden md:flex items-center gap-2 h-9 sm:h-10"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden lg:inline">Blog</span>
            </Button>
            
            <div className="hidden lg:block">
              <LiveTokenCounter />
            </div>
            
            {publicKey && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="hidden sm:flex items-center gap-2 h-9 sm:h-10"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden md:inline">Dashboard</span>
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/create-liquidity')}
              className="hidden sm:flex items-center gap-2 h-9 sm:h-10"
            >
              <Droplets className="w-4 h-4" />
              <span className="hidden md:inline">Liquidity</span>
            </Button>
            
            <div className="hidden sm:block">
              <WalletBalance />
            </div>
            
            <NetworkSelector />
            
            <WalletMultiButton className="!bg-accent hover:!bg-accent/90 !rounded-lg !h-9 sm:!h-11 !px-3 sm:!px-6 !font-semibold !text-xs sm:!text-sm transition-all" />
          </div>
        </div>
        
        {/* Mobile Token Counter and Balance */}
        <div className="flex lg:hidden items-center justify-between gap-2 mt-3 pt-3 border-t border-border">
          <LiveTokenCounter />
          <WalletBalance />
        </div>
      </div>
    </header>
  );
};
