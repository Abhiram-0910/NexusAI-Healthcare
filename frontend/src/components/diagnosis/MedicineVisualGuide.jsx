import React from 'react';
import { Sun, Moon, Coffee, Clock } from 'lucide-react';

export default function MedicineVisualGuide({ medicines = [] }) {
    // Default demo medicines if none provided
    const defaultMedicines = [
        {
            name: 'Paracetamol 500mg',
            dosage: '1 tablet',
            times: ['morning', 'evening'],
            duration: '3 days',
            instructions: 'After meals'
        },
        {
            name: 'Vitamin D3',
            dosage: '1 capsule',
            times: ['morning'],
            duration: '30 days',
            instructions: 'With breakfast'
        }
    ];

    const meds = medicines.length > 0 ? medicines : defaultMedicines;

    const getTimeIcon = (time) => {
        switch (time) {
            case 'morning': return <Sun className="text-yellow-500" size={32} />;
            case 'afternoon': return <Coffee className="text-orange-500" size={32} />;
            case 'evening': return <Moon className="text-blue-500" size={32} />;
            case 'night': return <Moon className="text-indigo-600" size={32} />;
            default: return <Clock className="text-slate-500" size={32} />;
        }
    };

    const getTimeLabel = (time) => {
        const labels = {
            'morning': 'ఉదయం (Morning)',
            'afternoon': 'మధ్యాహ్నం (Afternoon)',
            'evening': 'సాయంత్రం (Evening)',
            'night': 'రాత్రి (Night)'
        };
        return labels[time] || time;
    };

    return (
        <div className="bg-white rounded-2xl border-2 border-blue-200 p-6 space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">💊</span>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-900">Medicine Guide</h3>
                    <p className="text-sm text-slate-600">Visual dosage instructions</p>
                </div>
            </div>

            {/* Medicine Cards */}
            <div className="space-y-4">
                {meds.map((med, idx) => (
                    <div key={idx} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border-2 border-blue-200 space-y-4">
                        {/* Medicine Header */}
                        <div className="flex items-start gap-3">
                            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-md border-2 border-blue-300">
                                <span className="text-3xl">💊</span>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-lg text-slate-900">{med.name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                                        {med.dosage}
                                    </span>
                                    <span className="text-sm text-slate-600">• {med.duration}</span>
                                </div>
                            </div>
                        </div>

                        {/* Visual Dosage Times */}
                        <div className="bg-white rounded-xl p-4 border border-blue-200">
                            <p className="text-xs text-slate-600 font-semibold mb-3">ఎప్పుడు తీసుకోవాలి (When to take):</p>
                            <div className="flex gap-3">
                                {med.times.map((time, timeIdx) => (
                                    <div key={timeIdx} className="flex flex-col items-center gap-2 flex-1">
                                        <div className="w-16 h-16 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl flex items-center justify-center shadow-md border-2 border-slate-200">
                                            {getTimeIcon(time)}
                                        </div>
                                        <span className="text-xs font-bold text-slate-700 text-center">{getTimeLabel(time)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Instructions */}
                        {med.instructions && (
                            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3">
                                <p className="text-sm text-yellow-900 font-medium">
                                    ⚠️ <strong>గమనిక (Note):</strong> {med.instructions}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Footer Note */}
            <div className="bg-green-50 border border-green-300 rounded-xl p-4">
                <p className="text-sm text-green-900 font-medium">
                    ✅ <strong>Zero Literacy Design:</strong> Farmers can understand using only icons. No reading required!
                </p>
            </div>
        </div>
    );
}
