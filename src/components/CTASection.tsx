import { Rocket } from 'lucide-react';

export const CTASection = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 animate-gradient" />
      
      <div className="container mx-auto relative z-10">
        <div className="glass-card rounded-3xl p-8 md:p-12 border border-primary/30 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 mb-6">
            <Rocket className="w-8 h-8 text-primary" />
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Ready to Launch Your Token?
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join 1000+ creators who trust us to launch their tokens on Solana. 
            <span className="text-primary font-semibold"> Start in seconds, no coding required.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <a 
              href="/create" 
              className="px-10 py-5 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all font-semibold text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:scale-105"
            >
              Create Your Token Now →
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>No credit card needed</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Deploy in &lt;1 second</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Full ownership</span>
            </div>
          </div>

          {/* Urgency indicator */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              🔥 <span className="text-primary font-semibold">127 tokens created</span> in the last 24 hours
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};