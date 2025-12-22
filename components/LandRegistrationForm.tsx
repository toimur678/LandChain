import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../constants';
import { MapPin, User, FileText, CheckCircle, Upload, ChevronRight, ChevronLeft, Loader2, Scan } from 'lucide-react';
import { NeoButton, NeoCard, NeoInput } from './NeoComponents';
import Tesseract from 'tesseract.js';

const LandRegistrationForm: React.FC = () => {
  const { language, wallet, connectWallet, registerLand, setCurrentView } = useApp();
  const t = TRANSLATIONS[language];
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // OCR State
  const [isScanning, setIsScanning] = useState(false);
  const [ocrResult, setOcrResult] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    division: 'İstanbul',
    district: '',
    surveyNo: '',
    areaValue: '',
    areaUnit: 'metrekare',
    lat: '',
    lng: '',
    ownerName: '',
    nid: '',
    file: null as File | null
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleChange('file', e.target.files[0]);
      setOcrResult(null); // Reset OCR on new file
    }
  };

  const scanDocument = async () => {
    if (!formData.file) return;
    setIsScanning(true);
    setOcrResult(null);
    
    try {
        const result = await Tesseract.recognize(
            formData.file,
            'eng+tur', // English + Turkish
            { logger: m => console.log(m) }
        );
        setOcrResult(result.data.text);
    } catch (error) {
        console.error("OCR Error:", error);
        setOcrResult("Failed to extract text. Please try a clearer image.");
    } finally {
        setIsScanning(false);
    }
  };

  const handleSubmit = async () => {
    if (!wallet.isConnected) {
        alert("Please connect wallet first");
        return;
    }
    setIsSubmitting(true);
    const success = await registerLand(formData);
    setIsSubmitting(false);
    
    if (success) {
        alert("Success! Your land registration is being mined on the Sepolia Blockchain.");
        setCurrentView('home');
    }
  };

  if (!wallet.isConnected) {
    return (
      <NeoCard className="flex flex-col items-center justify-center p-12 text-center max-w-2xl mx-auto">
        <div className="bg-neo-accent p-4 border-2 border-black mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <User size={48} className="text-black" />
        </div>
        <h2 className="text-2xl font-black uppercase mb-2">{t.navRegister}</h2>
        <p className="text-gray-600 font-bold mb-6">Connect your wallet to write to the Sepolia Blockchain.</p>
        <NeoButton 
          onClick={connectWallet}
          variant="primary"
        >
          {t.connectWallet}
        </NeoButton>
      </NeoCard>
    );
  }

  // --- Step Renderers ---
  const renderStep1 = () => (
    <div className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold uppercase mb-1">{t.division}</label>
          <select className="w-full p-3 border-2 border-black font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow bg-white" value={formData.division} onChange={e => handleChange('division', e.target.value)}>
            <option>İstanbul</option><option>Ankara</option><option>İzmir</option><option>Antalya</option><option>Bursa</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold uppercase mb-1">{t.district}</label>
          <NeoInput type="text" value={formData.district} onChange={e => handleChange('district', e.target.value)} placeholder="e.g. Kadıköy" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-bold uppercase mb-1">{t.surveyNo}</label>
        <NeoInput type="text" value={formData.surveyNo} onChange={e => handleChange('surveyNo', e.target.value)} placeholder="TD-1234 / TS-5678" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
           <label className="block text-sm font-bold uppercase mb-1">{t.area}</label>
           <NeoInput type="number" value={formData.areaValue} onChange={e => handleChange('areaValue', e.target.value)} />
        </div>
        <div>
           <label className="block text-sm font-bold uppercase mb-1">{t.unit}</label>
           <select className="w-full p-3 border-2 border-black font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow bg-white" value={formData.areaUnit} onChange={e => handleChange('areaUnit', e.target.value)}>
            <option value="metrekare">Metrekare (m²)</option><option value="dönüm">Dönüm</option><option value="hektar">Hektar</option>
          </select>
        </div>
      </div>
      <div className="bg-neo-bg p-4 border-2 border-black">
        <h4 className="text-sm font-black uppercase mb-2 flex items-center gap-2"><MapPin size={16} /> GPS Coordinates</h4>
        <div className="grid grid-cols-2 gap-4">
            <NeoInput type="number" placeholder={t.lat} value={formData.lat} onChange={e => handleChange('lat', e.target.value)} />
            <NeoInput type="number" placeholder={t.lng} value={formData.lng} onChange={e => handleChange('lng', e.target.value)} />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4 animate-fade-in">
        <div>
          <label className="block text-sm font-bold uppercase mb-1">{t.ownerName}</label>
          <NeoInput type="text" value={formData.ownerName} onChange={e => handleChange('ownerName', e.target.value)} placeholder="Full Name as per NID" />
        </div>
        <div>
          <label className="block text-sm font-bold uppercase mb-1">{t.nid}</label>
          <NeoInput type="text" value={formData.nid} onChange={e => handleChange('nid', e.target.value)} placeholder="National ID Number" />
        </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 animate-fade-in">
        <div className="border-4 border-dashed border-black p-8 text-center bg-white relative hover:bg-gray-50 transition-colors">
            <input 
                type="file" 
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {formData.file ? (
                <div className="flex flex-col items-center">
                    <CheckCircle className="mx-auto text-neo-primary mb-3" size={48} />
                    <h3 className="font-black uppercase">{formData.file.name}</h3>
                    <p className="text-xs font-bold mt-1">Ready for upload</p>
                </div>
            ) : (
                <>
                    <Upload className="mx-auto text-black mb-3" size={48} />
                    <h3 className="font-black uppercase">{t.uploadDeed}</h3>
                    <p className="text-xs font-bold mt-1">Simulated IPFS Upload (Metadata Only)</p>
                    <p className="text-xs font-bold mt-1">Supported: PDF, PNG, JPG, JPEG</p>
                </>
            )}
        </div>
        
        {/* OCR Section */}
        {formData.file && (
            <div className="flex flex-col items-center gap-4">
                <NeoButton 
                    variant="secondary" 
                    onClick={scanDocument} 
                    disabled={isScanning}
                    className="flex items-center gap-2"
                >
                    {isScanning ? <Loader2 className="animate-spin" size={18} /> : <Scan size={18} />}
                    {isScanning ? "Taranıyor..." : "Belgeyi Tara (OCR)"}
                </NeoButton>
                
                {ocrResult && (
                    <div className="w-full bg-gray-100 p-4 border-2 border-black mt-2 max-h-60 overflow-y-auto">
                        <h4 className="font-black uppercase text-sm mb-2 border-b-2 border-gray-300 pb-1">Extracted Text:</h4>
                        <pre className="whitespace-pre-wrap text-xs font-mono">{ocrResult}</pre>
                    </div>
                )}
            </div>
        )}
    </div>
  );

  const renderStep4 = () => (
      <div className="space-y-4 animate-fade-in">
        <h3 className="font-black uppercase border-b-2 border-black pb-2">{t.reviewTitle}</h3>
        <div className="grid grid-cols-2 gap-y-4 text-sm font-bold">
            <div className="text-gray-600 uppercase">{t.division}:</div><div>{formData.division}</div>
            <div className="text-gray-600 uppercase">{t.surveyNo}:</div><div>{formData.surveyNo}</div>
            <div className="text-gray-600 uppercase">{t.area}:</div><div>{formData.areaValue} {formData.areaUnit}</div>
        </div>
        <div className="bg-neo-accent border-2 border-black p-3 flex justify-between items-center mt-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-sm font-black uppercase text-black">Est. Network Fee (Sepolia)</span>
            <span className="font-mono font-black text-black">~0.0004 ETH</span>
        </div>
      </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      {/* Stepper Header */}
      <div className="flex justify-between items-center mb-8 relative">
        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-200 -z-10"></div>
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className={`w-10 h-10 border-2 border-black flex items-center justify-center font-bold text-sm transition-colors duration-300 ${step >= s ? 'bg-neo-primary text-white' : 'bg-white text-black'}`}>
            {step > s ? <CheckCircle size={18} /> : s}
          </div>
        ))}
      </div>

      <NeoCard className="min-h-[400px]">
        <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-2 border-b-2 border-black pb-4">
            {step === 4 ? <><CheckCircle className="text-neo-primary" /> {t.step4}</> : `Step ${step}`}
        </h2>

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </NeoCard>

      <div className="flex justify-between mt-8">
        <NeoButton 
            variant="secondary"
            onClick={() => setStep(s => Math.max(1, s - 1))} 
            disabled={step === 1 || isSubmitting} 
            className="flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={18} /> {t.back}
        </NeoButton>
        
        {step < 4 ? (
            <NeoButton 
                variant="primary"
                onClick={() => setStep(s => Math.min(4, s + 1))} 
                className="flex items-center gap-2"
            >
            {t.next} <ChevronRight size={18} />
            </NeoButton>
        ) : (
            <NeoButton 
                variant="primary"
                onClick={handleSubmit} 
                disabled={isSubmitting} 
                className="flex items-center gap-2 disabled:opacity-70"
            >
            {isSubmitting ? <Loader2 className="animate-spin" /> : <CheckCircle size={18} />}
            {t.submit}
            </NeoButton>
        )}
      </div>
    </div>
  );
};

export default LandRegistrationForm;