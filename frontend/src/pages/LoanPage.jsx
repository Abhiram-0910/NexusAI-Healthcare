import React from 'react';
import { motion } from 'framer-motion';
import { Landmark, CheckCircle2 } from 'lucide-react';

export default function LoanPage({ report, lang, t, accessibilityMode }) {
  const eligibility = report?.loanEligibility;
  const amount = eligibility?.max_amount ?? 75000;
  const status = eligibility?.status ?? 'PRE-APPROVED';

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-3">
        <Landmark size={32} className="text-emerald-600" />
        {t.loan || 'Financial Assistance'}
      </h1>
      
      <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-xl">
        <p className="text-sm opacity-80 uppercase tracking-wider">Eligibility Status</p>
        <h2 className="text-4xl font-black mt-2">{status}</h2>
        <p className="text-lg mt-2">Maximum Amount: ₹{amount.toLocaleString('en-IN')}</p>
      </div>
      
      <div className="p-6 rounded-2xl bg-white shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold mb-4">🏛️ Government Schemes</h2>
        <div className="space-y-3">
          <div className="p-4 bg-emerald-50 rounded-xl">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-600" />
              <span className="font-bold">Ayushman Bharat - PMJAY</span>
            </div>
            <p className="text-sm text-emerald-700 mt-1">Coverage: ₹5,00,000 • 0% Interest</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
