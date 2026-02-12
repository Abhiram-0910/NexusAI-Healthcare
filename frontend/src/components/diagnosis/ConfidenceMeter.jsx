import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle, Sun, Moon, Coffee } from 'lucide-react';

export default function ConfidenceMeter({ confidence = 0.85, severity = 'medium' }) {
    const getColor = () => {
        if (confidence >= 0.8) return { bg: 'bg-green-100', border: 'border-green-500', text: 'text-green-700', icon: CheckCircle };
        if (confidence >= 0.6) return { bg: 'bg-yellow-100', border: 'border-yellow-500', text: 'text-yellow-700', icon: AlertCircle };
        return { bg: 'bg-red-100', border: 'border-red-500', text: 'text-red-700', icon: AlertTriangle };
    };

    const getMessage = () => {
        if (confidence >= 0.8) return 'High Confidence - Follow recommendations';
        if (confidence >= 0.6) return 'Moderate - Monitor symptoms for 2 days';
        return 'Low Confidence - See doctor immediately';
    };

    const color = getColor();
    const Icon = color.icon;

    return (
        <div className={`${color.bg} border-2 ${color.border} rounded-2xl p-6 space-y-4`}>
            <div className="flex items-center gap-3">
                <Icon className={color.text} size={32} />
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className={`text-lg font-bold ${color.text}`}>AI Confidence</h3>
                        <span className={`text-2xl font-bold ${color.text}`}>{Math.round(confidence * 100)}%</span>
                    </div>
                    <p className={`text-sm ${color.text} font-medium`}>{getMessage()}</p>
                </div>
            </div>

            {/* Visual Traffic Light */}
            <div className="flex items-center justify-center gap-3 py-4">
                <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center ${confidence < 0.6 ? 'bg-red-500 border-red-600 shadow-lg shadow-red-300' : 'bg-slate-200 border-slate-300'
                    }`}>
                    {confidence < 0.6 && <span className="text-white text-2xl font-bold">!</span>}
                </div>
                <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center ${confidence >= 0.6 && confidence < 0.8 ? 'bg-yellow-500 border-yellow-600 shadow-lg shadow-yellow-300' : 'bg-slate-200 border-slate-300'
                    }`}>
                    {confidence >= 0.6 && confidence < 0.8 && <span className="text-white text-2xl font-bold">?</span>}
                </div>
                <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center ${confidence >= 0.8 ? 'bg-green-500 border-green-600 shadow-lg shadow-green-300' : 'bg-slate-200 border-slate-300'
                    }`}>
                    {confidence >= 0.8 && <CheckCircle className="text-white" size={32} />}
                </div>
            </div>

            {confidence < 0.8 && (
                <div className={`${color.bg} border ${color.border} rounded-xl p-3`}>
                    <p className={`text-xs ${color.text} font-medium`}>
                        🏥 <strong>Recommendation:</strong> {confidence < 0.6 ? 'Visit doctor within 24 hours' : 'Monitor symptoms, visit doctor if worsens'}
                    </p>
                </div>
            )}
        </div>
    );
}
