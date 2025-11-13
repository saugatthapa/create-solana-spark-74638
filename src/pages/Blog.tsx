import { Header } from '@/components/Header';
import { WalletContextProvider } from '@/components/WalletContextProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

const blogPosts = [
  {
    slug: 'how-to-create-meme-coin-on-solana',
    title: 'How to Create a Meme Coin on Solana in 2025 - Complete Guide',
    description: 'Learn how to create your own meme coin on Solana blockchain in minutes. Step-by-step tutorial for beginners with no coding required.',
    date: '2025-01-10',
    readTime: '8 min read',
    category: 'Tutorial',
    image: '/favicon.png',
  },
  {
    slug: 'create-meme-coin-pump-fun-vs-lunaforge',
    title: 'Create Meme Coin: Pump.fun vs LunaForge Comparison 2025',
    description: 'Comparing the top platforms to create meme coins on Solana. Which is better - Pump.fun, Raydium, or LunaForge?',
    date: '2025-01-09',
    readTime: '10 min read',
    category: 'Comparison',
    image: '/favicon.png',
  },
  {
    slug: 'how-much-does-it-cost-to-create-meme-coin',
    title: 'How Much Does It Cost to Create a Meme Coin? [2025 Pricing Guide]',
    description: 'Complete breakdown of meme coin creation costs on Solana, Ethereum, and Base. Compare fees, gas costs, and platform charges.',
    date: '2025-01-08',
    readTime: '6 min read',
    category: 'Guide',
    image: '/favicon.png',
  },
  {
    slug: 'create-meme-coin-free-methods',
    title: 'How to Create a Meme Coin for Free - 5 Working Methods',
    description: 'Discover legitimate ways to create your own meme coin for free or with minimal costs. No hidden fees guide.',
    date: '2025-01-07',
    readTime: '7 min read',
    category: 'Tutorial',
    image: '/favicon.png',
  },
  {
    slug: 'solana-meme-coin-creator-tools-2025',
    title: 'Best Solana Meme Coin Creator Tools in 2025',
    description: 'Top 10 platforms to create Solana meme coins. Compare features, pricing, and success rates.',
    date: '2025-01-06',
    readTime: '12 min read',
    category: 'Reviews',
    image: '/favicon.png',
  },
  {
    slug: 'create-meme-coin-and-make-money',
    title: 'How to Create a Meme Coin and Make Money [Beginner Guide]',
    description: 'Learn the complete process of creating and monetizing meme coins. Real strategies that work in 2025.',
    date: '2025-01-05',
    readTime: '15 min read',
    category: 'Strategy',
    image: '/favicon.png',
  },
];

const Blog = () => {
  return (
    <WalletContextProvider>
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Hero Section */}
        <section className="py-20 px-4 border-b border-border">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              LunaForge Blog: Create Meme Coins on Solana
            </h1>
            <p className="text-xl text-muted-foreground">
              Guides, tutorials, and tips for creating successful meme coins on Solana blockchain
            </p>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post) => (
                <Link key={post.slug} to={`/blog/${post.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardHeader>
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-4 flex items-center justify-center">
                        <img src={post.image} alt={post.title} className="w-20 h-20 object-contain" />
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                          {post.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime}
                        </span>
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-4">{post.description}</CardDescription>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.date).toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </span>
                        <Button variant="ghost" size="sm" className="group-hover:translate-x-1 transition-transform">
                          Read More <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Create Your Meme Coin?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Start building your Solana token in minutes with LunaForge
            </p>
            <Link to="/create">
              <Button size="lg" className="text-lg px-8">
                Create Token Now
              </Button>
            </Link>
          </div>
        </section>

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

export default Blog;