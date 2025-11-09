import { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Wallet } from 'lucide-react';

export const WalletBalance = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!publicKey) {
      setBalance(null);
      return;
    }

    const fetchBalance = async () => {
      try {
        setLoading(true);
        const bal = await connection.getBalance(publicKey);
        setBalance(bal / LAMPORTS_PER_SOL);
      } catch (error) {
        console.error('Error fetching balance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();

    // Update balance every 30 seconds
    const interval = setInterval(fetchBalance, 30000);

    return () => clearInterval(interval);
  }, [publicKey, connection]);

  if (!publicKey) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg">
      <Wallet className="w-4 h-4 text-muted-foreground" />
      <span className="text-sm font-medium">
        {loading ? (
          <span className="text-muted-foreground">Loading...</span>
        ) : balance !== null ? (
          <span className={balance < 0.1 ? 'text-destructive' : 'text-foreground'}>
            {balance.toFixed(4)} SOL
          </span>
        ) : (
          <span className="text-muted-foreground">--</span>
        )}
      </span>
    </div>
  );
};
