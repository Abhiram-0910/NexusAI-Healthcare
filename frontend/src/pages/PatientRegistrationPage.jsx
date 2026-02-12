import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, Phone, MapPin, CheckCircle, CreditCard, Shield, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/apiClient';

export default function PatientRegistrationPage({ lang, t, accessibilityMode }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: 'Male',
        phone: '',
        address: '',
        abhaId: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const generateAbhaId = () => {
        // Simulate ABHA ID generation
        const randomId = Math.floor(10000000000000 + Math.random() * 90000000000000);
        setFormData(prev => ({ ...prev, abhaId: `${randomId}`.replace(/(.{4})/g, '$1-').slice(0, -1) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await apiClient.registerPatient(formData);
            setSuccess(true);
            setTimeout(() => {
                navigate('/diagnosis'); // Redirect to diagnosis after success
            }, 2000);
        } catch (error) {
            console.error('Registration failed', error);
            alert('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6 bg-white rounded-3xl shadow-xl border border-slate-100 max-w-lg mx-auto mt-10">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-green-200 shadow-lg"
                >
                    <CheckCircle size={48} strokeWidth={3} />
                </motion.div>
                <h2 className="text-3xl font-black text-slate-900 mb-2">{t.registrationSuccess}</h2>
                <p className="text-slate-500 font-medium">Redirecting to diagnosis module...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden min-h-[600px]">
            {/* Left Side - Visual */}
            <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-800 p-8 text-white flex flex-col justify-between relative overflow-hidden">
                <div className="relative z-10">
                    <div className="p-3 bg-white/10 w-fit rounded-xl backdrop-blur-md mb-6">
                        <Shield size={32} className="text-blue-100" />
                    </div>
                    <h1 className="text-4xl font-black mb-4 leading-tight">
                        {t.register || 'Patient Registration'}
                    </h1>
                    <p className="text-blue-100/80 text-lg">
                        Create a secure digital health profile linked to ABHA for seamless care.
                    </p>
                </div>

                <div className="relative z-10 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                    <div className="flex items-center gap-3 mb-2">
                        <CreditCard size={20} className="text-blue-200" />
                        <span className="font-bold text-sm uppercase tracking-wider text-blue-100">ABHA Integrated</span>
                    </div>
                    <p className="text-xs text-blue-100/70">
                        Automatically generates Government Health ID for insurance and benefits.
                    </p>
                </div>

                {/* Decorative Circles */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-blue-500/30 blur-3xl" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-indigo-500/30 blur-3xl" />
            </div>

            {/* Right Side - Form */}
            <div className="lg:col-span-3 p-8 lg:p-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 ml-1">{t.name || 'Full Name'}</label>
                        <div className="relative group">
                            <User size={18} className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-600 transition" />
                            <input
                                type="text"
                                required
                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-xl border-2 border-transparent focus:bg-white focus:border-blue-600 focus:shadow-lg focus:shadow-blue-100 outline-none transition font-semibold text-slate-800"
                                placeholder="e.g. Ramesh Kumar"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        {/* Age */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 ml-1">{t.age || 'Age'}</label>
                            <div className="relative group">
                                <Calendar size={18} className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-600 transition" />
                                <input
                                    type="number"
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-xl border-2 border-transparent focus:bg-white focus:border-blue-600 focus:shadow-lg focus:shadow-blue-100 outline-none transition font-semibold text-slate-800"
                                    value={formData.age}
                                    onChange={e => setFormData({ ...formData, age: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 ml-1">{t.gender || 'Gender'}</label>
                            <div className="relative">
                                <select
                                    className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border-2 border-transparent focus:bg-white focus:border-blue-600 focus:shadow-lg focus:shadow-blue-100 outline-none transition font-semibold text-slate-800 appearance-none"
                                    value={formData.gender}
                                    onChange={e => setFormData({ ...formData, gender: e.target.value })}
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                                <div className="absolute right-4 top-4 pointer-events-none text-slate-400">
                                    <ChevronRight size={18} className="rotate-90" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Phone */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 ml-1">{t.phone || 'Phone Number'}</label>
                            <div className="relative group">
                                <Phone size={18} className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-600 transition" />
                                <input
                                    type="tel"
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-xl border-2 border-transparent focus:bg-white focus:border-blue-600 focus:shadow-lg focus:shadow-blue-100 outline-none transition font-semibold text-slate-800"
                                    placeholder="98765 43210"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 ml-1">{t.address || 'Village/City'}</label>
                            <div className="relative group">
                                <MapPin size={18} className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-600 transition" />
                                <input
                                    type="text"
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-xl border-2 border-transparent focus:bg-white focus:border-blue-600 focus:shadow-lg focus:shadow-blue-100 outline-none transition font-semibold text-slate-800"
                                    placeholder="e.g. Rampur"
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* ABHA ID Generation */}
                    <div className="p-5 bg-orange-50 border border-orange-100 rounded-2xl flex items-center justify-between group hover:border-orange-200 transition">
                        <div>
                            <label className="text-xs font-bold text-orange-800 uppercase tracking-wide flex items-center gap-2 mb-1">
                                ABHA ID (Optional)
                            </label>
                            <input
                                type="text"
                                readOnly
                                className="bg-transparent text-orange-900 font-mono font-bold text-lg focus:outline-none w-full"
                                placeholder={formData.abhaId || "Click generate to create ID"}
                                value={formData.abhaId}
                            />
                        </div>
                        {!formData.abhaId && (
                            <button
                                type="button"
                                onClick={generateAbhaId}
                                className="px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg text-sm font-bold transition"
                            >
                                Generate
                            </button>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-xl font-bold text-lg bg-slate-900 text-white shadow-xl shadow-slate-900/20 hover:bg-slate-800 hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-70 disabled:transform-none"
                    >
                        {loading ? 'Processing...' : (t.submitRegistration || 'Register & Continue')}
                    </button>
                </form>
            </div>
        </div>
    );
}
