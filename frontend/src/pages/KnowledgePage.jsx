import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, BookOpenCheck } from 'lucide-react';

const conditions = [
  {
    name: 'Pneumonia',
    summary: 'Infection of the lungs that can cause cough, fever and breathing difficulty.',
    symptoms: ['High fever', 'Productive cough', 'Chest pain', 'Fast breathing'],
    advice: 'Visit a doctor within 24 hours if breathing is fast, lips are bluish, or fever is persistent.',
  },
  {
    name: 'Type 2 Diabetes',
    summary: 'High blood sugar over time that can damage organs if untreated.',
    symptoms: ['Increased thirst', 'Frequent urination', 'Weight loss', 'Tiredness'],
    advice: 'See a doctor for HbA1c test and start lifestyle changes and medicines if advised.',
  },
  {
    name: 'Hypertension',
    summary: 'Long-term high blood pressure that increases risk of stroke and heart attack.',
    symptoms: ['Often no symptoms', 'Headache', 'Blurred vision', 'Shortness of breath'],
    advice: 'Check BP regularly. If >180/120 with chest pain or confusion, go to emergency immediately.',
  },
];

export default function KnowledgePage() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-3">
        <BookOpenCheck size={32} className="text-indigo-600" />
        Health Information (Offline)
      </h1>

      <p className="text-sm text-slate-600">
        This built-in guide works fully offline. It is for education only and does not replace a
        qualified doctor.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {conditions.map((c) => (
          <div
            key={c.name}
            className="p-4 rounded-2xl bg-white shadow-sm border border-slate-100 flex flex-col gap-2"
          >
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-bold text-lg">{c.name}</h2>
              <AlertTriangle size={18} className="text-amber-500" />
            </div>
            <p className="text-xs text-slate-600">{c.summary}</p>
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase mt-1">Common symptoms</div>
              <ul className="mt-1 text-xs text-slate-600 list-disc pl-4 space-y-0.5">
                {c.symptoms.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <div className="mt-2 text-xs text-rose-600 font-medium">{c.advice}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

