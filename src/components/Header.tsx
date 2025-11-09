import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { NetworkSelector } from '@/components/NetworkSelector';
import { WalletBalance } from '@/components/WalletBalance';
import logo from '@/assets/lunaforge-logo.png';

export const Header = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <button 
          onClick={scrollToTop}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <img src={logo} alt="LunaForge logo" className="w-8 h-8 rounded-md" />
          <span className="text-xl font-bold">LunaForge</span>
        </button>
        <div className="flex items-center gap-3">
          <WalletBalance />
          <NetworkSelector />
          <WalletMultiButton className="!bg-accent hover:!bg-accent/90 !rounded-lg !h-11 !px-6 !font-semibold !text-sm transition-all" />
        </div>
      </div>
    </header>
  );
};
