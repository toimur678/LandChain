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
        return { icon: <CheckCircle2 className="text-green-500" />, color: 'border-green-500', bg: 'bg-green-50' };
      case 'failed':
        return { icon: <XCircle className="text-red-500" />, color: 'border-red-500', bg: 'bg-red-50' };
      default:
        return { icon: <Clock className="text-amber-500 animate-pulse" />, color: 'border-amber-500', bg: 'bg-amber-50' };
    }
  };

  const config = getStatusConfig(latestTx.status);

  return (
    <div className={`fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white rounded-lg shadow-xl border-l-4 ${config.color} p-4 animate-slide-up`}>
      <div className="flex items-start gap-3">
        <div className="mt-1">{config.icon}</div>
        <div className="flex-1">
          <h4 className="font-bold text-gray-800 text-sm">Transaction {latestTx.status}</h4>
          <p className="text-xs text-gray-500 mt-1 font-mono">{latestTx.hash}</p>
          <div className="mt-2 flex items-center justify-between">
             <span className="text-xs font-semibold text-gray-600">Land UID: {latestTx.landUid}</span>
             <a href="#" className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
               Dhaka Explorer <ExternalLink size={10} />
             </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionStatus;
