import { Shield, Zap, Users, TrendingUp } from 'lucide-react';

export const TrustSignals = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background to-card/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by <span className="text-primary">1000+ Creators</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join thousands of successful token creators who launched their projects with us
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="glass-card rounded-2xl p-6 text-center border border-border hover:border-primary transition-all">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div className="text-3xl font-bold text-primary mb-2">1,000+</div>
            <div className="text-sm text-muted-foreground">Tokens Created</div>
          </div>

          <div className="glass-card rounded-2xl p-6 text-center border border-border hover:border-accent transition-all">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-accent" />
            </div>
            <div className="text-3xl font-bold text-accent mb-2">$50M+</div>
            <div className="text-sm text-muted-foreground">Total Market Cap</div>
          </div>

          <div className="glass-card rounded-2xl p-6 text-center border border-border hover:border-primary transition-all">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <div className="text-3xl font-bold text-primary mb-2">&lt;1s</div>
            <div className="text-sm text-muted-foreground">Avg Deploy Time</div>
          </div>

          <div className="glass-card rounded-2xl p-6 text-center border border-border hover:border-accent transition-all">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-accent" />
            </div>
            <div className="text-3xl font-bold text-accent mb-2">100%</div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-primary text-lg">★</span>
              ))}
            </div>
            <p className="text-sm mb-4 text-foreground/90">
              "Launched my token in under 2 minutes! The process was incredibly smooth and professional."
            </p>
            <p className="text-xs text-muted-foreground font-semibold">- Alex M., Crypto Entrepreneur</p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-primary text-lg">★</span>
              ))}
            </div>
            <p className="text-sm mb-4 text-foreground/90">
              "Best token creator on Solana. Zero code needed and full control over my token. Highly recommend!"
            </p>
            <p className="text-xs text-muted-foreground font-semibold">- Sarah K., NFT Artist</p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-primary text-lg">★</span>
              ))}
            </div>
            <p className="text-sm mb-4 text-foreground/90">
              "Created 3 successful tokens already. The platform is reliable, fast, and extremely user-friendly."
            </p>
            <p className="text-xs text-muted-foreground font-semibold">- Mike R., DeFi Builder</p>
          </div>
        </div>
      </div>
    </section>
  );
};