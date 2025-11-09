import { WalletContextProvider } from '@/components/WalletContextProvider';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { FeaturesSection } from '@/components/FeaturesSection';

const Index = () => {
  return (
    <WalletContextProvider>
      <div className="min-h-screen">
        <Header />
        <HeroSection />
        <FeaturesSection />
        
        {/* Footer */}
        <footer className="py-12 px-4 border-t border-border">
          <div className="container mx-auto text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              © 2025 LunaForge. All Rights Reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Disclaimer: Creating and investing in memecoins involves high risk. LunaForge is a software tool and does not provide financial advice. Always do your own research before creating or investing in any token.
            </p>
          </div>
        </footer>
      </div>
    </WalletContextProvider>
  );
};

export default Index;
