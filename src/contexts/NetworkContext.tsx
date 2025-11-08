import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Network = 'mainnet-beta' | 'devnet';

interface NetworkContextValue {
  network: Network;
  setNetwork: (n: Network) => void;
}

const NetworkContext = createContext<NetworkContextValue | undefined>(undefined);

export const useNetwork = () => {
  const ctx = useContext(NetworkContext);
  if (!ctx) throw new Error('useNetwork must be used within NetworkProvider');
  return ctx;
};

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [network, setNetworkState] = useState<Network>('mainnet-beta');

  useEffect(() => {
    const stored = (typeof window !== 'undefined' && window.localStorage.getItem('network')) as Network | null;
    if (stored === 'mainnet-beta' || stored === 'devnet') setNetworkState(stored);
  }, []);

  const setNetwork = (n: Network) => {
    setNetworkState(n);
    if (typeof window !== 'undefined') window.localStorage.setItem('network', n);
  };

  const value = useMemo(() => ({ network, setNetwork }), [network]);

  return <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>;
};
