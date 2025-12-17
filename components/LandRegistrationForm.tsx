import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../constants';
import { MapPin, User, FileText, CheckCircle, Upload, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { LandRecord, Transaction } from '../types';

const LandRegistrationForm: React.FC = () => {
  const { language, wallet, connectWallet, addLandRecord, addTransaction, setCurrentView } = useApp();
  const t = TRANSLATIONS[language];
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    division: 'Dhaka',
    district: '',
    surveyNo: '',
    areaValue: '',
    areaUnit: 'katha',
    lat: '',
    lng: '',
    ownerName: '',
    nid: '',
    file: null as File | null
  });

  if (!wallet.isConnected) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-xl border border-gray-100 text-center">
        <div className="bg-green-100 p-4 rounded-full mb-4">
            <User size={48} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{t.navRegister}</h2>
        <p className="text-gray-500 mb-6 max-w-md">
          {language === 'en' 
            ? "Please connect your wallet to proceed with land registration on the Blockchain." 
            : "ব্লকচেইনে জমি নিবন্ধনের জন্য অনুগ্রহ করে আপনার ওয়ালেট সংযুক্ত করুন।"}
        </p>
        <button 
          onClick={connectWallet}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold shadow-lg transition-all"
        >
          {t.connectWallet}
        </button>
      </div>
    );
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate Blockchain Transaction
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newRecord: LandRecord = {
      landUid: `LND-${Math.floor(Math.random() * 10000)}-${formData.division.substring(0,3).toUpperCase()}`,
      ownerAddress: wallet.address!,
      ownerName: formData.ownerName,
      division: formData.division,
      district: formData.district,
      surveyNumber: formData.surveyNo,
      area: { value: Number(formData.areaValue), unit: formData.areaUnit as any },
      gpsCoordinates: { lat: Number(formData.lat), lng: Number(formData.lng) },
      documentHash: "QmHash" + Date.now().toString(),
      registrationDate: Date.now(),
      isVerified: false
    };

    const newTx: Transaction = {
        hash: "0x" + Math.random().toString(16).slice(2) + "...",
        from: wallet.address!,
        to: "0xContract...",
        landUid: newRecord.landUid,
        status: 'pending',
        timestamp: Date.now()
    };

    addLandRecord(newRecord);
    addTransaction(newTx);
    
    // Simulate transaction confirmation after delay
    setTimeout(() => {
        newTx.status = 'confirmed';
    }, 4000);

    setIsSubmitting(false);
    setCurrentView('home'); // Redirect to home/dashboard
  };

  const renderStep1 = () => (
    <div className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.division}</label>
          <select 
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            value={formData.division}
            onChange={(e) => handleChange('division', e.target.value)}
          >
            <option>Dhaka</option>
            <option>Chittagong</option>
            <option>Rajshahi</option>
            <option>Khulna</option>
            <option>Sylhet</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.district}</label>
          <input 
            type="text" 
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            value={formData.district}
            onChange={(e) => handleChange('district', e.target.value)}
            placeholder="e.g. Gulshan"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t.surveyNo}</label>
        <input 
          type="text" 
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          value={formData.surveyNo}
          onChange={(e) => handleChange('surveyNo', e.target.value)}
          placeholder="CS-1234 / RS-5678"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">{t.area}</label>
           <input 
            type="number" 
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            value={formData.areaValue}
            onChange={(e) => handleChange('areaValue', e.target.value)}
          />
        </div>
        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">{t.unit}</label>
           <select 
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            value={formData.areaUnit}
            onChange={(e) => handleChange('areaUnit', e.target.value)}
          >
            <option value="katha">Katha</option>
            <option value="bigha">Bigha</option>
            <option value="acre">Acre</option>
          </select>
        </div>
      </div>
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h4 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
            <MapPin size={16} /> GPS Coordinates
        </h4>
        <div className="grid grid-cols-2 gap-4">
            <input 
                type="number" 
                placeholder={t.lat}
                className="w-full p-2 border border-blue-200 rounded text-sm"
                value={formData.lat}
                onChange={(e) => handleChange('lat', e.target.value)}
            />
            <input 
                type="number" 
                placeholder={t.lng}
                className="w-full p-2 border border-blue-200 rounded text-sm"
                value={formData.lng}
                onChange={(e) => handleChange('lng', e.target.value)}
            />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4 animate-fade-in">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.ownerName}</label>
          <input 
            type="text" 
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            value={formData.ownerName}
            onChange={(e) => handleChange('ownerName', e.target.value)}
            placeholder="Full Name as per NID"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.nid}</label>
          <input 
            type="text" 
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            value={formData.nid}
            onChange={(e) => handleChange('nid', e.target.value)}
            placeholder="National ID Number"
          />
        </div>
        <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
            <p>{language === 'en' ? "Connected Wallet Address:" : "সংযুক্ত ওয়ালেট ঠিকানা:"}</p>
            <p className="font-mono font-semibold text-gray-800 break-all">{wallet.address}</p>
        </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 animate-fade-in">
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-500 hover:bg-green-50 transition-colors cursor-pointer">
            <Upload className="mx-auto text-gray-400 mb-3" size={48} />
            <h3 className="font-medium text-gray-700">{t.uploadDeed}</h3>
            <p className="text-xs text-gray-500 mt-1">IPFS Secure Storage • PDF only • Max 5MB</p>
            <input 
                type="file" 
                className="hidden" 
                id="doc-upload" 
                onChange={(e) => handleChange('file', e.target.files ? e.target.files[0] : null)}
            />
            <label htmlFor="doc-upload" className="mt-4 inline-block bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 cursor-pointer">
                {formData.file ? formData.file.name : "Select File"}
            </label>
        </div>
    </div>
  );

  const renderStep4 = () => (
      <div className="space-y-4 animate-fade-in">
        <h3 className="font-bold text-gray-800 border-b pb-2">{t.reviewTitle}</h3>
        
        <div className="grid grid-cols-2 gap-y-4 text-sm">
            <div className="text-gray-500">{t.division}:</div>
            <div className="font-medium">{formData.division}</div>

            <div className="text-gray-500">{t.surveyNo}:</div>
            <div className="font-medium">{formData.surveyNo}</div>

            <div className="text-gray-500">{t.ownerName}:</div>
            <div className="font-medium">{formData.ownerName}</div>

            <div className="text-gray-500">{t.area}:</div>
            <div className="font-medium">{formData.areaValue} {formData.areaUnit}</div>
            
            <div className="text-gray-500">Document:</div>
            <div className="font-medium text-green-600">{formData.file?.name || "No file"}</div>
        </div>

        <div className="bg-orange-50 border border-orange-100 p-3 rounded-lg flex justify-between items-center mt-4">
            <span className="text-sm text-orange-800 font-medium">{t.gasFee}</span>
            <span className="font-mono font-bold text-orange-900">~0.0025 MATIC</span>
        </div>
      </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      {/* Stepper */}
      <div className="flex justify-between items-center mb-8 relative">
        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-200 -z-10"></div>
        {[1, 2, 3, 4].map((s) => (
          <div 
            key={s} 
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
              step >= s ? 'bg-green-600 text-white shadow-lg' : 'bg-white border-2 border-gray-200 text-gray-400'
            }`}
          >
            {step > s ? <CheckCircle size={18} /> : s}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 min-h-[400px]">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            {step === 1 && <><MapPin className="text-green-600" /> {t.step1}</>}
            {step === 2 && <><User className="text-green-600" /> {t.step2}</>}
            {step === 3 && <><FileText className="text-green-600" /> {t.step3}</>}
            {step === 4 && <><CheckCircle className="text-green-600" /> {t.step4}</>}
        </h2>

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => setStep(s => Math.max(1, s - 1))}
          disabled={step === 1 || isSubmitting}
          className="px-6 py-2.5 rounded-lg font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
        >
          <ChevronLeft size={18} /> {t.back}
        </button>
        
        {step < 4 ? (
            <button
            onClick={() => setStep(s => Math.min(4, s + 1))}
            className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-2.5 rounded-lg font-bold shadow-lg flex items-center gap-2 transition-colors"
            >
            {t.next} <ChevronRight size={18} />
            </button>
        ) : (
            <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white px-8 py-2.5 rounded-lg font-bold shadow-lg flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-80"
            >
            {isSubmitting ? <Loader2 className="animate-spin" /> : <CheckCircle size={18} />}
            {t.submit}
            </button>
        )}
      </div>
    </div>
  );
};

export default LandRegistrationForm;
