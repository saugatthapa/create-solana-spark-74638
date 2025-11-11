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
    <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-card border border-border rounded-lg">
      <Wallet className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
      <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
        {loading ? (
          <span className="text-muted-foreground">Loading...</span>
        ) : balance !== null ? (
          <span className={balance < 0.1 ? 'text-destructive' : 'text-foreground'}>
            <span className="hidden sm:inline">Balance: </span>
            {balance.toFixed(4)} SOL
          </span>
        ) : (
          <span className="text-muted-foreground">--</span>
        )}
      </span>
    </div>
  );
};
