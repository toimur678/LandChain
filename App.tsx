import React from 'react';
import { useApp } from './context/AppContext';
import { TRANSLATIONS } from './constants';
import WalletConnect from './components/WalletConnect';
import LandRegistrationForm from './components/LandRegistrationForm';
import LandSearch from './components/LandSearch';
import AdminDashboard from './components/AdminDashboard';
import TransactionStatus from './components/TransactionStatus';
import { Home, PlusCircle, Search, Settings } from 'lucide-react';
import logo from './images/logo.png';
import { ViewState } from './types';

const AppContent: React.FC = () => {
  const { language, toggleLanguage, currentView, setCurrentView } = useApp();
  const t = TRANSLATIONS[language];

  const renderView = () => {
    switch (currentView) {
      case 'register':
        return <LandRegistrationForm />;
      case 'search':
        return <LandSearch />;
      case 'admin':
        return <AdminDashboard />;
      case 'home':
      default:
        return (
          <div className="text-center py-20 space-y-8 animate-fade-in">
             <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-800 to-green-600 tracking-tight">
               {language === 'en' ? 'Secure Land Registry' : 'নিরাপদ জমি নিবন্ধন'}
             </h1>
             <p className="text-xl text-gray-500 max-w-2xl mx-auto">
               {language === 'en' 
                 ? "Bangladesh's first decentralized land registry powered by Polygon blockchain. Transparent, immutable, and secure."
                 : "পলিগন ব্লকচেইন দ্বারা চালিত বাংলাদেশের প্রথম বিকেন্দ্রীভূত জমি নিবন্ধন ব্যবস্থা। স্বচ্ছ, অপরিবর্তনীয় এবং নিরাপদ।"}
             </p>
             <div className="flex justify-center gap-4 pt-4">
               <button 
                 onClick={() => setCurrentView('search')}
                 className="px-8 py-3 bg-white text-green-700 font-bold rounded-full shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2"
               >
                 <Search size={20} /> {t.navSearch}
               </button>
               <button 
                 onClick={() => setCurrentView('register')}
                 className="px-8 py-3 bg-green-700 text-white font-bold rounded-full shadow-lg shadow-green-700/30 hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2"
               >
                 <PlusCircle size={20} /> {t.navRegister}
               </button>
             </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-900 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setCurrentView('home')}
          >
            <img src={logo} alt="logo" className="w-14 h-14 object-cover rounded-lg transform rotate-3" />
            <span className="text-xl font-bold tracking-tight text-gray-800 hidden md:block">
              {t.appTitle}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <NavLink active={currentView === 'home'} onClick={() => setCurrentView('home')} icon={<Home size={18} />}>{t.navHome}</NavLink>
            <NavLink active={currentView === 'register'} onClick={() => setCurrentView('register')} icon={<PlusCircle size={18} />}>{t.navRegister}</NavLink>
            <NavLink active={currentView === 'search'} onClick={() => setCurrentView('search')} icon={<Search size={18} />}>{t.navSearch}</NavLink>
            <NavLink active={currentView === 'admin'} onClick={() => setCurrentView('admin')} icon={<Settings size={18} />}>{t.navAdmin}</NavLink>
          </div>

          <div className="flex items-center gap-4">
             <button 
               onClick={toggleLanguage}
               className="font-bold text-sm text-gray-600 hover:text-green-700 transition-colors px-3 py-1 rounded-full border border-gray-200"
             >
               {language === 'en' ? 'বাংলা' : 'ENG'}
             </button>
             <WalletConnect />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        {renderView()}
      </main>

      {/* Floating Elements */}
      <TransactionStatus />
    </div>
  );
};

const NavLink: React.FC<{ children: React.ReactNode, active: boolean, onClick: () => void, icon: React.ReactNode }> = ({ children, active, onClick, icon }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 font-medium transition-colors ${
      active ? 'text-green-700' : 'text-gray-500 hover:text-gray-900'
    }`}
  >
    {icon}
    {children}
  </button>
);

const App: React.FC = () => {
  return <AppContent />;
};

export default App;
