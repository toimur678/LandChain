import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, WalletState, LandRecord, Transaction, ViewState } from '../types';
import { MOCK_LAND_RECORDS, MOCK_TRANSACTIONS } from '../constants';

interface AppContextType {
  language: Language;
  toggleLanguage: () => void;
  wallet: WalletState;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;
  landRecords: LandRecord[];
  addLandRecord: (record: LandRecord) => void;
  verifyRecord: (uid: string) => void;
  recentTransactions: Transaction[];
  addTransaction: (tx: Transaction) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [landRecords, setLandRecords] = useState<LandRecord[]>(MOCK_LAND_RECORDS);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    balance: '0',
    isConnected: false
  });

  // Load language preference
  useEffect(() => {
    const savedLang = localStorage.getItem('app_lang') as Language;
    if (savedLang) setLanguage(savedLang);
  }, []);

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'bn' : 'en';
    setLanguage(newLang);
    localStorage.setItem('app_lang', newLang);
  };

  const connectWallet = async () => {
    // Simulation of Wagmi/MetaMask connection
    // In a real app, this would use useConnect() from wagmi
    setTimeout(() => {
      setWallet({
        address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
        balance: "15.42", // MATIC
        isConnected: true,
        chainId: 80001 // Dhaka Testnet
      });
    }, 800);
  };

  const disconnectWallet = () => {
    setWallet({
      address: null,
      balance: '0',
      isConnected: false
    });
  };

  const addLandRecord = (record: LandRecord) => {
    setLandRecords(prev => [record, ...prev]);
  };

  const verifyRecord = (uid: string) => {
    setLandRecords(prev => prev.map(r => r.landUid === uid ? { ...r, isVerified: true } : r));
  };

  const addTransaction = (tx: Transaction) => {
    setRecentTransactions(prev => [tx, ...prev]);
  };

  return (
    <AppContext.Provider value={{
      language,
      toggleLanguage,
      wallet,
      connectWallet,
      disconnectWallet,
      currentView,
      setCurrentView,
      landRecords,
      addLandRecord,
      verifyRecord,
      recentTransactions,
      addTransaction
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
