import { Zap, Shield, Wallet, Code } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Create tokens in seconds with Solana\'s blazing-fast network',
    color: 'text-primary',
  },
  {
    icon: Shield,
    title: 'Secure & Audited',
    description: 'Built on battle-tested SPL token standards',
    color: 'text-accent',
  },
  {
    icon: Wallet,
    title: 'Wallet Integration',
    description: 'Seamlessly connect with Phantom, Solflare, and more',
    color: 'text-primary',
  },
  {
    icon: Code,
    title: 'No Code Required',
    description: 'User-friendly interface for everyone',
    color: 'text-accent',
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Choose Our Platform?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The easiest way to launch your token on Solana blockchain
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-card rounded-2xl p-6 border border-border hover:border-primary transition-all group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
