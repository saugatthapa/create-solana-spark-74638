import { useNetwork } from '@/contexts/NetworkContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const NetworkSelector = () => {
  const { network, setNetwork } = useNetwork();
  return (
    <div className="relative z-50">
      <Select value={network} onValueChange={(v) => setNetwork(v as any)}>
        <SelectTrigger className="w-36 h-11 rounded-lg bg-card border-border">
          <SelectValue placeholder="Network" />
        </SelectTrigger>
        <SelectContent className="z-[60] bg-popover border-border">
          <SelectItem value="mainnet-beta">Mainnet</SelectItem>
          <SelectItem value="devnet">Devnet</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
