import { WalletContextProvider } from '@/components/WalletContextProvider';
import { Header } from '@/components/Header';
import { TokenCreatorForm } from '@/components/TokenCreatorForm';

const Create = () => {
  return (
    <WalletContextProvider>
      <div className="min-h-screen">
        <Header />
        <TokenCreatorForm />
      </div>
    </WalletContextProvider>
  );
};

export default Create;
