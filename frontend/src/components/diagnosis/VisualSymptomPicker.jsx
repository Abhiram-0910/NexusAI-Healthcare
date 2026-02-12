import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Thermometer, Mic } from 'lucide-react';

export default function VisualSymptomPicker({ onSymptomSelect, t = {} }) {
    const [selectedParts, setSelectedParts] = useState([]);
    const [painLevel, setPainLevel] = useState(5);
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);

    // Mock Body Part Coordinates (Simplified)
    const bodyParts = [
        { id: 'Head', cx: 150, cy: 50, r: 25 },
        { id: 'Chest', cx: 150, cy: 110, r: 35 },
        { id: 'Stomach', cx: 150, cy: 190, r: 30 },
        { id: 'Left Arm', cx: 80, cy: 130, r: 20 },
        { id: 'Right Arm', cx: 220, cy: 130, r: 20 },
        { id: 'Legs', cx: 150, cy: 300, r: 40 },
    ];

    const commonSymptoms = [
        { id: 'Fever', label: 'Fever', icon: <Thermometer className="text-orange-500" /> },
        { id: 'Cough', label: 'Cough', icon: <AlertCircle className="text-blue-500" /> },
        { id: 'Vomit', label: 'Vomit', icon: <AlertCircle className="text-green-500" /> },
        { id: 'Weakness', label: 'Weakness', icon: <AlertCircle className="text-purple-500" /> },
    ];

    const updateDiagnosis = (parts, symps, pain, latestInteraction = null) => {
        const text = `Pain in: ${parts.join(', ')}. Symptoms: ${symps.join(', ')}. Pain Level: ${pain}/10.`;

        // Pass object back to parent
        onSymptomSelect({
            description: text,
            latestPart: latestInteraction,
            parts: parts,
            pain: pain
        });
    };

    const togglePart = (id) => {
        const newParts = selectedParts.includes(id)
            ? selectedParts.filter(p => p !== id)
            : [...selectedParts, id];
        setSelectedParts(newParts);
        updateDiagnosis(newParts, selectedSymptoms, painLevel, selectedParts.includes(id) ? null : id);
    };

    const toggleSymptom = (id) => {
        const newSymps = selectedSymptoms.includes(id)
            ? selectedSymptoms.filter(s => s !== id)
            : [...selectedSymptoms, id];
        setSelectedSymptoms(newSymps);
        updateDiagnosis(selectedParts, newSymps, painLevel);
    };

    return (
        <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* 1. Interactive Body Map */}
            <div className="relative mx-auto bg-slate-50 rounded-3xl p-6 border border-slate-200 shadow-inner">
                <svg width="300" height="400" viewBox="0 0 300 400" className="drop-shadow-xl">
                    {/* Silhouette */}
                    <path
                        d="M150 20 C130 20 115 35 115 55 C115 70 125 85 130 90 L110 100 L90 170 L70 150 L60 160 L90 190 L110 180 L115 240 L125 340 L145 360 L155 340 L165 360 L185 340 L195 240 L200 180 L220 190 L250 160 L240 150 L220 170 L200 100 L180 90 C185 85 195 70 195 55 C195 35 180 20 150 20 Z"
                        className="fill-slate-200 stroke-slate-300" strokeWidth="2"
                    />

                    {/* Interactive Zones */}
                    {bodyParts.map((part) => (
                        <g key={part.id} onClick={() => togglePart(part.id)} className="cursor-pointer group">
                            <circle
                                cx={part.cx}
                                cy={part.cy}
                                r={part.r}
                                className={`transition-all duration-300 ${selectedParts.includes(part.id)
                                    ? 'fill-red-500/80 stroke-red-600 animate-pulse'
                                    : 'fill-blue-400/20 stroke-blue-400/50 group-hover:fill-blue-400/40'
                                    }`}
                                strokeWidth="2"
                            />
                            <text
                                x={part.cx}
                                y={part.cy}
                                dy={5}
                                textAnchor="middle"
                                className={`text-[10px] font-bold pointer-events-none uppercase tracking-wider ${selectedParts.includes(part.id) ? 'fill-white' : 'fill-slate-600'
                                    }`}
                            >
                                {/* Translate Label if available, else fallback to ID */}
                                {t[part.id.toLowerCase().replace(' ', '_')] || part.id}
                            </text>
                        </g>
                    ))}
                </svg>
                <p className="text-center text-sm font-medium text-slate-500 mt-4 bg-white py-2 rounded-full shadow-sm">
                    👇 {t.voicePrompt ? t.voicePrompt.split(',')[0] : "Tap where it hurts"}
                </p>
            </div>

            {/* 2. Controls & Symptoms */}
            <div className="flex-1 w-full space-y-8">
                {/* Pain Slider */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <label className="block text-sm font-bold text-slate-700 mb-4">{t.painLevel ? t.painLevel.split('{')[0] : "Pain Intensity"}</label>
                    <div className="flex items-center gap-4">
                        <span className="text-3xl filter grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition">🙂</span>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={painLevel}
                            onChange={(e) => {
                                setPainLevel(e.target.value);
                                updateDiagnosis(selectedParts, selectedSymptoms, e.target.value);
                            }}
                            className="w-full h-4 bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 rounded-lg appearance-none cursor-pointer accent-white"
                        />
                        <span className="text-3xl filter grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition">😫</span>
                    </div>
                    <div className={`text-center mt-3 font-black text-xl ${painLevel > 7 ? 'text-red-600' : painLevel > 4 ? 'text-orange-500' : 'text-green-600'
                        }`}>
                        Level {painLevel}
                    </div>
                </div>

                {/* Symptoms Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {commonSymptoms.map((s) => (
                        <button
                            key={s.id}
                            onClick={() => toggleSymptom(s.id)}
                            className={`relative p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all duration-200 ${selectedSymptoms.includes(s.id)
                                ? 'bg-blue-50 border-blue-500 shadow-lg scale-105'
                                : 'bg-white border-slate-100 hover:border-blue-200 hover:bg-slate-50'
                                }`}
                        >
                            <div className="p-3 bg-white rounded-full shadow-sm">{s.icon}</div>
                            <span className={`font-bold ${selectedSymptoms.includes(s.id) ? 'text-blue-700' : 'text-slate-600'}`}>
                                {s.label}
                            </span>
                            {selectedSymptoms.includes(s.id) && (
                                <div className="absolute top-2 right-2">
                                    <CheckCircle2 size={18} className="text-blue-500 fill-white" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
