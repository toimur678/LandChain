import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../constants';
import { Search, Map, ShieldCheck, ShieldAlert, History, User } from 'lucide-react';
import { LandRecord } from '../types';
import { NeoButton, NeoCard, NeoInput, NeoBadge } from './NeoComponents';

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
    <div className="max-w-4xl mx-auto space-y-8">
        {/* Search Bar */}
      <NeoCard className="text-center">
        <h2 className="text-3xl font-black uppercase mb-2">{t.navSearch}</h2>
        <p className="text-gray-600 font-bold mb-6">Verify ownership and view history securely</p>
        
        <div className="relative max-w-xl mx-auto flex gap-2">
            <NeoInput 
                type="text" 
                className="flex-1"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <NeoButton 
                onClick={handleSearch}
                variant="primary"
                className="flex items-center justify-center"
            >
                {isLoading ? "..." : <Search size={20} />}
            </NeoButton>
        </div>
        {error && <p className="text-neo-secondary font-bold mt-4 animate-shake uppercase">{error}</p>}
      </NeoCard>

      {/* Results */}
      {result && (
          <div className="grid md:grid-cols-3 gap-8 animate-slide-up">
            {/* Main Details Card */}
            <div className="md:col-span-2">
                <NeoCard className="h-full p-0 overflow-hidden">
                    <div className="bg-neo-bg p-6 border-b-2 border-black flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-black uppercase">{result.landUid}</h3>
                            <p className="text-sm font-bold flex items-center gap-1">
                                <Map size={14} /> {result.district}, {result.division}
                            </p>
                        </div>
                        <NeoBadge variant={result.isVerified ? 'success' : 'warning'}>
                            <span className="flex items-center gap-1">
                                {result.isVerified ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                                {result.isVerified ? t.verified : t.pending}
                            </span>
                        </NeoBadge>
                    </div>
                    
                    <div className="p-6 grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-xs font-black uppercase tracking-wider block mb-1">{t.ownerName}</label>
                            <p className="font-bold text-lg border-b-2 border-black inline-block">{result.ownerName}</p>
                        </div>
                        <div>
                            <label className="text-xs font-black uppercase tracking-wider block mb-1">{t.surveyNo}</label>
                            <p className="font-bold text-lg font-mono border-b-2 border-black inline-block">{result.surveyNumber}</p>
                        </div>
                        <div>
                            <label className="text-xs font-black uppercase tracking-wider block mb-1">{t.area}</label>
                            <p className="font-bold text-lg">{result.area.value} {result.area.unit}</p>
                        </div>
                        <div>
                            <label className="text-xs font-black uppercase tracking-wider block mb-1">Coordinates</label>
                            <p className="font-bold text-lg font-mono text-xs">{result.gpsCoordinates.lat}, {result.gpsCoordinates.lng}</p>
                        </div>
                        <div className="col-span-2">
                            <label className="text-xs font-black uppercase tracking-wider block mb-1">Owner Wallet</label>
                            <p className="font-mono text-sm bg-neo-bg p-2 border-2 border-black break-all">{result.ownerAddress}</p>
                        </div>
                    </div>

                    {/* Red Flag Warning */}
                    {!result.isVerified && (
                        <div className="bg-neo-secondary p-4 border-t-2 border-black flex items-center gap-3 text-white">
                            <ShieldAlert className="shrink-0" />
                            <div>
                                <p className="font-black uppercase text-sm">{t.redFlag}</p>
                                <p className="text-xs font-bold">Multiple active transaction requests detected for this survey number.</p>
                            </div>
                        </div>
                    )}
                </NeoCard>
            </div>

            {/* History Column */}
            <NeoCard title={t.ownershipHistory}>
                <div className="relative border-l-4 border-black ml-3 space-y-8 pl-6 pb-2 mt-4">
                    {/* Current */}
                    <div className="relative">
                        <div className="absolute -left-[34px] bg-neo-primary w-5 h-5 border-2 border-black"></div>
                        <p className="text-xs font-bold uppercase mb-0.5">Current Owner</p>
                        <p className="font-black text-sm">{result.ownerName}</p>
                        <p className="text-xs font-bold">{new Date(result.registrationDate).toLocaleDateString()}</p>
                    </div>

                    {/* Historical (Mock) */}
                    {result.history?.map((h, i) => (
                        <div key={i} className="relative opacity-60">
                            <div className="absolute -left-[34px] bg-white w-5 h-5 border-2 border-black"></div>
                            <p className="text-xs font-bold uppercase mb-0.5">Previous Owner</p>
                            <p className="font-black text-sm">{h.from.substring(0,8)}...</p>
                            <p className="text-xs font-bold">{new Date(h.date).toLocaleDateString()}</p>
                        </div>
                    ))}
                    
                    {!result.history && (
                        <div className="relative opacity-60">
                            <div className="absolute -left-[34px] bg-white w-5 h-5 border-2 border-black"></div>
                            <p className="text-xs font-bold uppercase mb-0.5">Original Registry</p>
                            <p className="font-black text-sm">Govt. Record</p>
                            <p className="text-xs font-bold">1998</p>
                        </div>
                    )}
                </div>
            </NeoCard>
          </div>
      )}
    </div>
  );
};

export default LandSearch;
