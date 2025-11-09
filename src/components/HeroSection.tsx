import heroImage from '@/assets/hero-solana.jpg';
import { CheckCircle } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Solana blockchain network visualization" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full glass-card border border-primary/30 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <p className="text-sm font-medium text-primary">
            🏆 #1 Solana Token Creator Platform
          </p>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent animate-gradient">
            Create and Launch
          </span>
          <br />
          <span className="text-foreground">Memecoins in Minutes</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
          The fastest, most trusted platform to launch your Solana token.<br />
          <span className="text-primary font-semibold">Zero code. Full control.</span> Your next big idea is just a few clicks away from the moon. 🚀
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a 
            href="/create" 
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all font-semibold text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40"
          >
            Create Your Token Now →
          </a>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Trusted by 1000+ creators</span>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="glass-card rounded-2xl p-6 border border-border hover:border-primary transition-all hover:scale-105">
            <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              &lt;1s
            </div>
            <div className="text-muted-foreground mt-2">Transaction Time</div>
          </div>
          <div className="glass-card rounded-2xl p-6 border border-border hover:border-accent transition-all hover:scale-105">
            <div className="text-4xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              $0.15
            </div>
            <div className="text-muted-foreground mt-2">Average Cost</div>
          </div>
          <div className="glass-card rounded-2xl p-6 border border-border hover:border-primary transition-all hover:scale-105">
            <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              65k TPS
            </div>
            <div className="text-muted-foreground mt-2">Network Speed</div>
          </div>
        </div>
      </div>
    </section>
  );
};
