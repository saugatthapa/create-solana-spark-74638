import heroImage from '@/assets/hero-solana.jpg';

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
        <div className="inline-block mb-8 px-5 py-2 rounded-full glass-card border border-accent/30">
          <p className="text-sm font-medium text-accent">
            Powered by Solana
          </p>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
            Create and Launch
          </span>
          <br />
          <span className="text-foreground">Memecoins in Minutes</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          Zero code. Full control. Your next big idea is just a few clicks away from the moon.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a 
            href="/create" 
            className="px-8 py-4 rounded-xl bg-primary hover:bg-primary/90 transition-all font-semibold text-base"
          >
            Create Your Token Now
          </a>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="glass-card rounded-2xl p-6 border border-border hover:border-primary transition-all">
            <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              &lt;1s
            </div>
            <div className="text-muted-foreground mt-2">Transaction Time</div>
          </div>
          <div className="glass-card rounded-2xl p-6 border border-border hover:border-accent transition-all">
            <div className="text-4xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              $0.15
            </div>
            <div className="text-muted-foreground mt-2">Average Cost</div>
          </div>
          <div className="glass-card rounded-2xl p-6 border border-border hover:border-primary transition-all">
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
