import { Header } from '@/components/Header';
import { WalletContextProvider } from '@/components/WalletContextProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { CheckCircle, Zap, DollarSign, Shield, Users, Rocket } from 'lucide-react';

const HowToCreateMemeCoin = () => {
  return (
    <WalletContextProvider>
      <Helmet>
        <title>How to Create a Meme Coin on Solana - Complete Guide 2025 | LunaForge</title>
        <meta name="description" content="Learn how to create a meme coin on Solana in minutes. Complete step-by-step guide for beginners. No coding required. Create your token for just 0.1 SOL." />
        <meta name="keywords" content="how to create meme coin, create meme coin on solana, how to make meme coin, create meme coin free, meme coin creator, solana token creator" />
        <link rel="canonical" href="https://www.lunaforge.online/how-to-create-meme-coin" />
        <meta property="og:title" content="How to Create a Meme Coin on Solana - Complete Guide" />
        <meta property="og:description" content="Step-by-step guide to creating your own meme coin on Solana. No coding required. Launch in under 60 seconds." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                How to Create a Meme Coin on Solana
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Complete step-by-step guide to launching your own meme coin in 2025. No coding skills required.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/create">
                  <Button size="lg" className="text-lg px-8">
                    <Rocket className="w-5 h-5 mr-2" />
                    Create Meme Coin Now
                  </Button>
                </Link>
                <Link to="/blog">
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    Read Full Guides
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <Card>
                <CardHeader className="pb-2">
                  <Zap className="w-8 h-8 text-primary mb-2" />
                  <CardTitle className="text-2xl">60s</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Deploy Time</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <DollarSign className="w-8 h-8 text-primary mb-2" />
                  <CardTitle className="text-2xl">0.1 SOL</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Total Cost</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <Shield className="w-8 h-8 text-primary mb-2" />
                  <CardTitle className="text-2xl">100%</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Ownership</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <Users className="w-8 h-8 text-primary mb-2" />
                  <CardTitle className="text-2xl">10K+</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Tokens Created</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Step-by-Step Guide */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              5 Simple Steps to Create Your Meme Coin
            </h2>

            <div className="space-y-8">
              {[
                {
                  step: 1,
                  title: 'Connect Your Wallet',
                  description: 'Install Phantom, Solflare, or any Solana wallet and connect it to LunaForge. Make sure you have at least 0.15 SOL for creation and fees.',
                  tips: ['Download Phantom from phantom.app', 'Fund wallet with SOL from exchange', 'Connect wallet to lunaforge.online'],
                },
                {
                  step: 2,
                  title: 'Design Your Token',
                  description: 'Choose a catchy name, symbol, and total supply for your meme coin. Create a unique logo that represents your brand.',
                  tips: ['Name: Short and memorable', 'Symbol: 3-5 characters (e.g., $DOGE)', 'Supply: 1M - 1B tokens typical', 'Logo: Use Canva or AI tools'],
                },
                {
                  step: 3,
                  title: 'Fill in Token Details',
                  description: 'Enter your token name, symbol, decimals (usually 9), total supply, and upload your logo. Add optional description and social links.',
                  tips: ['Name: Your token\'s full name', 'Symbol: Trading ticker', 'Decimals: Keep at 9 for Solana standard', 'Description: Brief project summary'],
                },
                {
                  step: 4,
                  title: 'Deploy to Solana',
                  description: 'Click "Create Token" and confirm the transaction in your wallet. Your token will be deployed to Solana mainnet in seconds.',
                  tips: ['Review all details carefully', 'Confirm transaction in wallet', 'Wait for blockchain confirmation', 'Save your token address'],
                },
                {
                  step: 5,
                  title: 'Add Liquidity & Market',
                  description: 'Create a liquidity pool on Raydium or Orca to make your token tradeable. Start marketing to grow your community.',
                  tips: ['Add liquidity on Raydium', 'List on Jupiter Aggregator', 'Create social media accounts', 'Build your community'],
                },
              ].map((item) => (
                <Card key={item.step} className="border-l-4 border-l-primary">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold flex-shrink-0">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2">{item.title}</CardTitle>
                        <CardDescription className="text-base">{item.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 ml-16">
                      {item.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              {[
                {
                  q: 'How much does it cost to create a meme coin on Solana?',
                  a: 'With LunaForge, it costs just 0.1 SOL (approximately $10-15) to create and deploy your meme coin on Solana. This includes all fees.',
                },
                {
                  q: 'Can I create a meme coin for free?',
                  a: 'While completely free isn\'t possible due to blockchain transaction fees, Solana is the cheapest option at around $10-15 total cost using LunaForge.',
                },
                {
                  q: 'Do I need coding skills to create a meme coin?',
                  a: 'No! LunaForge is a no-code platform designed for everyone. You can create a professional Solana token without writing any code.',
                },
                {
                  q: 'How long does it take to create a meme coin?',
                  a: 'With LunaForge, you can create and deploy your meme coin in under 60 seconds once you have your details and logo ready.',
                },
                {
                  q: 'What\'s the difference between creating on Solana vs Ethereum?',
                  a: 'Solana is much cheaper ($10-15 vs $100-500) and faster (seconds vs minutes). Solana\'s low fees make it ideal for meme coins.',
                },
                {
                  q: 'Can I make money creating meme coins?',
                  a: 'While some meme coin creators have been successful, most don\'t generate significant returns. Focus on building real value and community rather than quick profits.',
                },
              ].map((faq, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="text-xl">{faq.q}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Launch Your Meme Coin?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of creators who have launched successful tokens on Solana with LunaForge
            </p>
            <Link to="/create">
              <Button size="lg" className="text-lg px-12">
                <Rocket className="w-5 h-5 mr-2" />
                Create Your Token Now
              </Button>
            </Link>
          </div>
        </section>

        <footer className="py-12 px-4 border-t border-border">
          <div className="container mx-auto text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              © 2025 LunaForge. All Rights Reserved.
            </p>
          </div>
        </footer>
      </div>
    </WalletContextProvider>
  );
};

export default HowToCreateMemeCoin;