import React from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../constants';
import { ShieldCheck, XCircle, Eye, FileText, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard: React.FC = () => {
  const { language, landRecords, verifyRecord } = useApp();
  const t = TRANSLATIONS[language];

  // Mock Data for Charts
  const data = [
    { name: 'Dhaka', regs: 400 },
    { name: 'Ctg', regs: 300 },
    { name: 'Sylhet', regs: 200 },
    { name: 'Khulna', regs: 278 },
    { name: 'Raj', regs: 189 },
  ];

  const pendingRecords = landRecords.filter(r => !r.isVerified);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
             <h2 className="text-3xl font-bold text-gray-800">Government Dashboard</h2>
             <p className="text-gray-500">Ministry of Land, Bangladesh</p>
        </div>
        <div className="flex gap-4">
             <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
                 <p className="text-xs text-gray-500 uppercase font-bold">Total Verified</p>
                 <p className="text-2xl font-bold text-green-600">14,203</p>
             </div>
             <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
                 <p className="text-xs text-gray-500 uppercase font-bold">Pending</p>
                 <p className="text-2xl font-bold text-orange-500">{pendingRecords.length + 42}</p>
             </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Verification Queue */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-gray-700 flex items-center gap-2">
                    <FileText size={20} /> {t.adminQueue}
                </h3>
                <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-bold">
                    {pendingRecords.length} New
                </span>
            </div>
            <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                {pendingRecords.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">All records verified.</div>
                ) : (
                    pendingRecords.map((record) => (
                        <div key={record.landUid} className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="font-bold text-gray-800 text-sm">{record.landUid}</p>
                                    <p className="text-xs text-gray-500">{record.district}, {record.division}</p>
                                </div>
                                <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                                    {record.surveyNumber}
                                </span>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                                <div className="text-xs text-gray-500">Owner: {record.ownerName}</div>
                                <div className="flex gap-2">
                                    <button className="p-1.5 hover:bg-gray-200 rounded text-gray-500" title="View Details">
                                        <Eye size={16} />
                                    </button>
                                    <button 
                                        onClick={() => verifyRecord(record.landUid)}
                                        className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded text-xs font-bold flex items-center gap-1 transition-colors"
                                    >
                                        <ShieldCheck size={14} /> {t.approve}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>

        {/* Analytics Chart */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="font-bold text-gray-700 mb-6 flex items-center gap-2">
                <Activity size={20} /> Registration Analytics (2024)
            </h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Bar dataKey="regs" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
