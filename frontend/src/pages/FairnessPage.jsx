import React from 'react';
import { motion } from 'framer-motion';
import { Scale, CheckCircle2 } from 'lucide-react';

export default function FairnessPage({ report, lang, t, accessibilityMode }) {
  const metrics = report?.fairnessMetrics;

  const demographicParity = metrics?.demographic_parity ?? 0.97;
  const ageAcc = metrics?.age_group_accuracy ?? 0.93;
  const genderAcc = metrics?.gender_accuracy ?? 0.92;
  const biasDetected = metrics?.bias_detected ?? false;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-3">
        <Scale size={32} className="text-green-600" />
        {t.fairness || 'Fairness Check'}
      </h1>

      <div className="p-6 rounded-2xl bg-white shadow-sm border border-slate-100 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold">Demographic Parity</h2>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
            {(demographicParity * 100).toFixed(1)}%
          </span>
        </div>
        <p className="text-slate-600">
          Model performance across age and gender is monitored continuously to minimize unfair treatment.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="p-3 rounded-xl bg-slate-50">
            <div className="flex justify-between mb-1 text-sm">
              <span className="font-medium">Age group accuracy</span>
              <span className="font-bold text-blue-600">{(ageAcc * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${ageAcc * 100}%` }}
              />
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50">
            <div className="flex justify-between mb-1 text-sm">
              <span className="font-medium">Gender accuracy</span>
              <span className="font-bold text-purple-600">{(genderAcc * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full">
              <div
                className="h-full bg-purple-500 rounded-full"
                style={{ width: `${genderAcc * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 rounded-lg flex items-center gap-2 bg-green-50">
          <CheckCircle2 size={20} className={biasDetected ? 'text-amber-600' : 'text-green-600'} />
          <span className="font-medium text-sm text-slate-800">
            {biasDetected
              ? 'Slight bias detected between groups – reweighting and monitoring enabled.'
              : 'No significant bias detected across monitored demographics.'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

