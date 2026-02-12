import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Heart, Droplets } from 'lucide-react';

export default function ProfilePage({ lang, t, accessibilityMode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-3">
        <User size={32} className="text-orange-600" />
        {t.profile || 'Patient Profile'}
      </h1>
      
      <div className="p-6 rounded-2xl bg-white shadow-sm border border-slate-100">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold">
            RK
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">Ramesh Kumar</h2>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="flex items-center gap-2 text-sm">
                <User size={14} className="text-slate-400" />
                <span>65 years, Male</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Droplets size={14} className="text-red-400" />
                <span>Blood Group: B+</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail size={14} className="text-slate-400" />
                <span>ramesh.k@example.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone size={14} className="text-slate-400" />
                <span>+91 98765 43210</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
