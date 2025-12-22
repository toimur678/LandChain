import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Clock, XCircle, ExternalLink } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

const TransactionStatus: React.FC = () => {
  const { recentTransactions, language } = useApp();
  const t = TRANSLATIONS[language];

  // Only show the most recent transaction if it happened in the last 2 minutes for demo
  const latestTx = recentTransactions[0];
  if (!latestTx || (Date.now() - latestTx.timestamp > 120000)) return null;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { icon: <CheckCircle2 className="text-neo-primary" />, color: 'border-neo-primary', bg: 'bg-neo-primary/10' };
      case 'failed':
        return { icon: <XCircle className="text-neo-secondary" />, color: 'border-neo-secondary', bg: 'bg-neo-secondary/10' };
      default:
        return { icon: <Clock className="text-black animate-pulse" />, color: 'border-neo-accent', bg: 'bg-neo-accent/10' };
    }
  };

  const config = getStatusConfig(latestTx.status);

  return (
    <div className={`fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 animate-slide-up`}>
      <div className="flex items-start gap-3">
        <div className="mt-1 border-2 border-black p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">{config.icon}</div>
        <div className="flex-1">
          <h4 className="font-black uppercase text-sm">Transaction {latestTx.status}</h4>
          <p className="text-xs font-bold text-gray-600 mt-1 font-mono">{latestTx.hash}</p>
          <div className="mt-2 flex items-center justify-between">
             <span className="text-xs font-black uppercase text-gray-800">Land UID: {latestTx.landUid}</span>
             <a href="#" className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline uppercase">
               Block Explorer <ExternalLink size={10} />
             </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionStatus;
