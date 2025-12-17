import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../constants';
import { Search, Map, ShieldCheck, ShieldAlert, History, User } from 'lucide-react';
import { LandRecord } from '../types';

const LandSearch: React.FC = () => {
  const { language, landRecords } = useApp();
  const t = TRANSLATIONS[language];
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState<LandRecord | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = () => {
    setIsLoading(true);
    setError('');
    setResult(null);

    // Simulate network delay
    setTimeout(() => {
        const found = landRecords.find(r => 
            r.landUid.toLowerCase() === searchTerm.toLowerCase() ||
            r.surveyNumber.toLowerCase() === searchTerm.toLowerCase() ||
            r.ownerAddress.toLowerCase() === searchTerm.toLowerCase()
        );

        if (found) {
            setResult(found);
        } else {
            setError(language === 'en' ? "No record found" : "কোন তথ্য পাওয়া যায়নি");
        }
        setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
        {/* Search Bar */}
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">{t.navSearch}</h2>
        <p className="text-gray-500 mb-6">Verify ownership and view history securely</p>
        
        <div className="relative max-w-xl mx-auto">
            <input 
                type="text" 
                className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-300 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all shadow-sm"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
            <button 
                onClick={handleSearch}
                className="absolute right-2 top-2 bottom-2 bg-green-600 hover:bg-green-700 text-white px-6 rounded-full font-bold transition-colors"
            >
                {isLoading ? "..." : t.searchButton}
            </button>
        </div>
        {error && <p className="text-red-500 mt-4 animate-shake">{error}</p>}
      </div>

      {/* Results */}
      {result && (
          <div className="grid md:grid-cols-3 gap-6 animate-slide-up">
            {/* Main Details Card */}
            <div className="md:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">{result.landUid}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Map size={14} /> {result.district}, {result.division}
                        </p>
                    </div>
                    <div className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 ${result.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {result.isVerified ? <ShieldCheck size={16} /> : <ShieldAlert size={16} />}
                        {result.isVerified ? t.verified : t.pending}
                    </div>
                </div>
                
                <div className="p-6 grid grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">{t.ownerName}</label>
                        <p className="font-semibold text-gray-800 text-lg">{result.ownerName}</p>
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">{t.surveyNo}</label>
                        <p className="font-semibold text-gray-800 text-lg font-mono">{result.surveyNumber}</p>
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">{t.area}</label>
                        <p className="font-semibold text-gray-800 text-lg">{result.area.value} {result.area.unit}</p>
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">Coordinates</label>
                        <p className="font-semibold text-gray-800 text-lg font-mono text-xs">{result.gpsCoordinates.lat}, {result.gpsCoordinates.lng}</p>
                    </div>
                    <div className="col-span-2">
                        <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">Owner Wallet</label>
                        <p className="font-mono text-sm bg-gray-50 p-2 rounded text-gray-600 break-all border border-gray-200">{result.ownerAddress}</p>
                    </div>
                </div>

                {/* Red Flag Warning */}
                {!result.isVerified && (
                    <div className="bg-red-50 p-4 border-t border-red-100 flex items-center gap-3 text-red-700">
                        <ShieldAlert className="shrink-0" />
                        <div>
                            <p className="font-bold text-sm">{t.redFlag}</p>
                            <p className="text-xs opacity-80">Multiple active transaction requests detected for this survey number.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* History Column */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <History className="text-blue-500" /> {t.ownershipHistory}
                </h3>
                
                <div className="relative border-l-2 border-gray-200 ml-3 space-y-6 pl-6 pb-2">
                    {/* Current */}
                    <div className="relative">
                        <div className="absolute -left-[31px] bg-green-500 w-4 h-4 rounded-full border-2 border-white ring-2 ring-green-100"></div>
                        <p className="text-xs text-gray-400 mb-0.5">Current Owner</p>
                        <p className="font-bold text-sm text-gray-800">{result.ownerName}</p>
                        <p className="text-xs text-gray-500">{new Date(result.registrationDate).toLocaleDateString()}</p>
                    </div>

                    {/* Historical (Mock) */}
                    {result.history?.map((h, i) => (
                        <div key={i} className="relative opacity-60">
                            <div className="absolute -left-[31px] bg-gray-300 w-4 h-4 rounded-full border-2 border-white"></div>
                            <p className="text-xs text-gray-400 mb-0.5">Previous Owner</p>
                            <p className="font-bold text-sm text-gray-800">{h.from.substring(0,8)}...</p>
                            <p className="text-xs text-gray-500">{new Date(h.date).toLocaleDateString()}</p>
                        </div>
                    ))}
                    
                    {!result.history && (
                        <div className="relative opacity-60">
                            <div className="absolute -left-[31px] bg-gray-300 w-4 h-4 rounded-full border-2 border-white"></div>
                            <p className="text-xs text-gray-400 mb-0.5">Original Registry</p>
                            <p className="font-bold text-sm text-gray-800">Govt. Record</p>
                            <p className="text-xs text-gray-500">1998</p>
                        </div>
                    )}
                </div>
            </div>
          </div>
      )}
    </div>
  );
};

export default LandSearch;
