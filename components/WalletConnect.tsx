import React from 'react';
import { useApp } from '../context/AppContext';
import { Wallet, LogOut, Loader2 } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

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
      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-green-200/20 shadow-lg">
        <div className="flex flex-col items-end mr-2">
          <span className="text-xs text-green-200 font-mono font-medium tracking-wide">
            {wallet.balance} MATIC
          </span>
          <span className="text-sm font-bold text-white font-mono">
            {formatAddress(wallet.address)}
          </span>
        </div>
        <div className="h-8 w-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-inner">
             <Wallet size={16} className="text-white" />
        </div>
        <button 
          onClick={disconnectWallet}
          className="ml-2 text-red-300 hover:text-red-400 transition-colors p-1"
          title={t.disconnect}
        >
          <LogOut size={18} />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isLoading}
      className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white px-6 py-2.5 rounded-full font-semibold shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Wallet size={20} />}
      <span>{t.connectWallet}</span>
    </button>
  );
};

export default WalletConnect;
