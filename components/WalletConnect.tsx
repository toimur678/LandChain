import React from 'react';
import { useApp } from '../context/AppContext';
import { Wallet, LogOut, Loader2 } from 'lucide-react';
import { TRANSLATIONS } from '../constants';
import { NeoButton } from './NeoComponents';

const WalletConnect: React.FC = () => {
  const { wallet, connectWallet, disconnectWallet, language } = useApp();
  const [isLoading, setIsLoading] = React.useState(false);
  const t = TRANSLATIONS[language];

  const handleConnect = async () => {
    setIsLoading(true);
    await connectWallet();
    setIsLoading(false);
  };

  // Format address: 0x1234...5678
  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  if (wallet.isConnected && wallet.address) {
    return (
      <div className="flex items-center gap-3 bg-white border-2 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col items-end mr-2">
          <span className="text-xs font-bold uppercase tracking-wide">
            {wallet.balance} ETH
          </span>
          <span className="text-sm font-black font-mono">
            {formatAddress(wallet.address)}
          </span>
        </div>
        <div className="h-8 w-8 bg-black text-white rounded-none flex items-center justify-center border-2 border-black">
             <Wallet size={16} />
        </div>
        <button 
          onClick={disconnectWallet}
          className="ml-2 text-neo-secondary hover:text-neo-secondary-hover transition-colors p-1 border-2 border-transparent hover:border-black"
          title={t.disconnect}
        >
          <LogOut size={18} />
        </button>
      </div>
    );
  }

  return (
    <NeoButton
      onClick={handleConnect}
      disabled={isLoading}
      variant="primary"
      className="flex items-center gap-2"
    >
      {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Wallet size={20} />}
      <span>{t.connectWallet}</span>
    </NeoButton>
  );
};

export default WalletConnect;
