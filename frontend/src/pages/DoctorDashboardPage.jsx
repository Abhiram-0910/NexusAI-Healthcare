import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, FileText, Activity } from 'lucide-react';
import { apiClient } from '../services/apiClient';

export default function DoctorDashboardPage({ lang, t, accessibilityMode }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const data = await apiClient.getAuditLogs();
        if (isMounted) setLogs(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-3">
        <Stethoscope size={32} className="text-blue-600" />
        Doctor Dashboard
      </h1>

      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-center gap-3 text-sm text-blue-900">
        <FileText size={18} />
        <span>Review recent AI-assisted diagnoses, risk levels, and override if needed.</span>
      </div>

      <div className="flex gap-4 mb-6">
        <button onClick={() => setFilter('ALL')} className={`px-4 py-2 rounded-xl font-bold transition ${filter === 'ALL' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600'}`}>All Patients</button>
        <button onClick={() => setFilter('HIGH')} className={`px-4 py-2 rounded-xl font-bold transition ${filter === 'HIGH' ? 'bg-red-600 text-white' : 'bg-white text-slate-600'}`}>High Risk / Emergency</button>
        <button onClick={() => setFilter('MEDIUM')} className={`px-4 py-2 rounded-xl font-bold transition ${filter === 'MEDIUM' ? 'bg-orange-500 text-white' : 'bg-white text-slate-600'}`}>Medium Risk</button>
      </div>

      <div className="p-6 rounded-2xl bg-white shadow-sm border border-slate-100">
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Activity size={16} className="animate-spin" />
            Loading recent patients...
          </div>
        ) : logs.filter(l => filter === 'ALL' || l.risk === filter).length === 0 ? (
          <p className="text-sm text-slate-500">No patients found for this category.</p>
        ) : (
          <div className="space-y-3">
            {logs.filter(l => filter === 'ALL' || l.risk === filter).map((entry) => (
              <div
                key={entry.patient_id + entry.timestamp}
                className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition hover:shadow-md ${entry.risk === 'HIGH' ? 'bg-red-50 border-red-100' :
                  entry.risk === 'MEDIUM' ? 'bg-orange-50 border-orange-100' : 'bg-slate-50 border-slate-100'
                  }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900">{entry.patient_id}</span>
                    {entry.risk === 'HIGH' && <span className="animate-pulse px-2 py-0.5 rounded text-[10px] font-black bg-red-600 text-white">EMERGENCY</span>}
                  </div>
                  <div className="text-xs text-slate-500 flex gap-2">
                    <span>{new Date(entry.timestamp).toLocaleString()}</span>
                    <span>•</span>
                    <span>{entry.demographics?.age ?? '--'}y / {entry.demographics?.gender ?? 'Unk'}</span>
                  </div>
                  <div className="mt-2 text-sm text-slate-700 font-medium">
                    {entry.diseases?.[0]?.name || 'Unknown Condition'}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right hidden md:block">
                    <div className="text-xs text-slate-500">Confidence</div>
                    <div className="font-bold text-slate-900">{(entry.confidence * 100).toFixed(0)}%</div>
                  </div>
                  <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 transition">
                    View Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

