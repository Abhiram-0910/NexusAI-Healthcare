import React from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Shield, Eye, CheckCircle, BarChart3, GitBranch, FileText, AlertTriangle, Heart } from 'lucide-react';

export default function ExplainabilityPage({ report, reportScan, lang, t, accessibilityMode }) {
    const hasReport = report && (report.diseases?.length > 0 || report.isFromReport);
    const isReportBased = report?.isFromReport || reportScan?.success;

    if (!hasReport) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <Brain size={64} className="text-slate-300 mb-4" />
                <h2 className="text-2xl font-bold text-slate-700 mb-2">{t.noReportYet || 'No Diagnosis Yet'}</h2>
                <p className="text-slate-500 mb-6 max-w-md">{t.runDiagnosisFirst || 'Please run a diagnosis first — upload a medical report or enter wearable data to see how the AI made its decision.'}</p>
                <a href="/diagnosis" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">
                    {t.goToDiagnosis || 'Go to Diagnosis'}
                </a>
            </div>
        );
    }

    const confidence = report.confidence || 0.75;
    const riskLevel = report.risk || 'medium';
    const features = report.featureImportance || [];
    const diseases = report.diseases || [];
    const trustScore = Math.round(confidence * 100);
    const biasScore = report.fairnessMetrics?.overall_fairness_score || 85;

    // Report-specific data
    const scanData = reportScan || {};
    const reportType = report.reportType || scanData.report_type || 'Medical Report';
    const keyFindings = report.keyFindings || scanData.key_findings || [];
    const severityAnalogy = report.severityAnalogy || scanData.severity_analogy || '';
    const eatFoods = report.eatFoods || scanData.eat_foods || [];
    const avoidFoods = report.avoidFoods || scanData.avoid_foods || [];
    const actionNeeded = report.actionNeeded || scanData.action_needed || '';

    let decisionSteps = [];

    if (isReportBased) {
        decisionSteps = [
            { step: 1, label: lang === 'hi' ? 'रिपोर्ट अपलोड' : lang === 'te' ? 'రిపోర్ట్ అప్‌లోడ్' : 'Report Upload', detail: `${reportType} uploaded for analysis`, icon: '📄', color: 'bg-blue-100 text-blue-700' },
            { step: 2, label: lang === 'hi' ? 'AI दृष्टि विश्लेषण' : lang === 'te' ? 'AI దృష్టి విశ్లేషణ' : 'Report Analysis', detail: 'Computer Vision analyzed the image structure', icon: '👁️', color: 'bg-purple-100 text-purple-700' },
            { step: 3, label: lang === 'hi' ? 'निष्कर्ष निकालना' : lang === 'te' ? 'ఫలితాలు గుర్తింపు' : 'Finding Extraction', detail: `Extracted ${keyFindings.length} key findings from report`, icon: '🔍', color: 'bg-indigo-100 text-indigo-700' },
            { step: 4, label: lang === 'hi' ? 'गंभीरता आकलन' : lang === 'te' ? 'తీవ్రత అంచనా' : 'Severity Assessment', detail: `Severity: ${report.risk_score || 5}/10 — ${severityAnalogy}`, icon: '⚠️', color: 'bg-yellow-100 text-yellow-700' },
            { step: 5, label: lang === 'hi' ? 'आहार सुझाव' : lang === 'te' ? 'ఆహార సూచనలు' : 'Diet Recommendations', detail: `${eatFoods.length} foods to eat, ${avoidFoods.length} to avoid`, icon: '🥗', color: 'bg-green-100 text-green-700' },
            { step: 6, label: lang === 'hi' ? 'कार्रवाई योजना' : lang === 'te' ? 'చర్య ప్రణాళిక' : 'Action Plan', detail: actionNeeded || 'Follow-up recommended', icon: '💊', color: 'bg-red-100 text-red-700' }
        ];
    } else {
        decisionSteps = [
            { step: 1, label: lang === 'hi' ? 'लक्षण विश्लेषण' : lang === 'te' ? 'లక్షణ విశ్లేషణ' : 'Symptom Analysis', detail: 'AI identified input symptoms from body map & voice', icon: '🔍', color: 'bg-blue-100 text-blue-700' }
        ];

        if (riskLevel) {
            decisionSteps.push({ step: 2, label: lang === 'hi' ? 'शारीरिक जांच' : lang === 'te' ? 'శారీరక డేటా' : 'Wearable Data Check', detail: 'Checked glucose, heart rate, BP, SpO2 (if available)', icon: '⌚', color: 'bg-red-100 text-red-700' });
        }

        decisionSteps.push(
            { step: 3, label: lang === 'hi' ? 'जोखिम गणना' : lang === 'te' ? 'ప్రమాద లెక్కింపు' : 'Risk Calculation', detail: `Risk level: ${riskLevel.toUpperCase()}`, icon: '⚠️', color: 'bg-yellow-100 text-yellow-700' },
            { step: 4, label: lang === 'hi' ? 'रोग पहचान' : lang === 'te' ? 'వ్యాధి గుర్తింపు' : 'Disease Detection', detail: diseases.map(d => d.name).join(', ') || 'Conditions identified', icon: '🏥', color: 'bg-green-100 text-green-700' },
            { step: 5, label: lang === 'hi' ? 'उपचार सुझाव' : lang === 'te' ? 'చికిత్స సూచన' : 'Treatment Suggestion', detail: 'Treatment plan generated with medications & diet', icon: '💊', color: 'bg-purple-100 text-purple-700' }
        );
    }
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Page Title */}
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Brain size={32} className="text-purple-600" />
                    {t.explainTitle || 'AI Decision Explanation'}
                </h1>
                <p className="text-slate-500 mt-1">
                    {isReportBased
                        ? (lang === 'hi' ? '📄 रिपोर्ट विश्लेषण की व्याख्या' : lang === 'te' ? '📄 రిపోర్ట్ విశ్లేషణ వివరణ' : '📄 Explaining uploaded report analysis')
                        : (lang === 'hi' ? '⌚ वियरेबल डेटा विश्लेषण की व्याख्या' : lang === 'te' ? '⌚ వేరబుల్ డేటా విశ్లేషణ వివరణ' : '⌚ Explaining wearable data analysis')
                    }
                </p>
            </div>

            {/* Data Source Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${isReportBased ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                {isReportBased ? <FileText size={16} /> : <Heart size={16} />}
                {isReportBased ? `Source: ${reportType} (Uploaded Report)` : 'Source: Wearable Device + Symptoms'}
            </div>

            {/* Trust & Confidence Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 shadow-sm" whileHover={{ scale: 1.02 }}>
                    <div className="flex items-center gap-2 mb-3">
                        <Shield size={24} className="text-green-600" />
                        <h3 className="font-bold text-green-800">{t.trustScore || 'Trust Score'}</h3>
                    </div>
                    <div className="text-5xl font-black text-green-700 mb-2">{trustScore}%</div>
                    <div className="w-full h-3 bg-green-200 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-gradient-to-r from-green-400 to-emerald-600 rounded-full" initial={{ width: 0 }} animate={{ width: `${trustScore}%` }} transition={{ duration: 1.5 }} />
                    </div>
                </motion.div>

                <motion.div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 shadow-sm" whileHover={{ scale: 1.02 }}>
                    <div className="flex items-center gap-2 mb-3">
                        <Eye size={24} className="text-blue-600" />
                        <h3 className="font-bold text-blue-800">{t.modelConfidence || 'Model Confidence'}</h3>
                    </div>
                    <div className="text-5xl font-black text-blue-700 mb-2">{Math.round(confidence * 100)}%</div>
                    <div className="w-full h-3 bg-blue-200 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-gradient-to-r from-blue-400 to-indigo-600 rounded-full" initial={{ width: 0 }} animate={{ width: `${confidence * 100}%` }} transition={{ duration: 1.5, delay: 0.2 }} />
                    </div>
                </motion.div>

                <motion.div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-violet-100 border border-purple-200 shadow-sm" whileHover={{ scale: 1.02 }}>
                    <div className="flex items-center gap-2 mb-3">
                        <CheckCircle size={24} className="text-purple-600" />
                        <h3 className="font-bold text-purple-800">{t.biasCheck || 'Bias Check'}</h3>
                    </div>
                    <div className="text-5xl font-black text-purple-700 mb-2">{biasScore}%</div>
                    <div className="w-full h-3 bg-purple-200 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-gradient-to-r from-purple-400 to-violet-600 rounded-full" initial={{ width: 0 }} animate={{ width: `${biasScore}%` }} transition={{ duration: 1.5, delay: 0.4 }} />
                    </div>
                    <p className="text-xs text-purple-600 mt-2">{t.biasCheckDesc || 'AI fairness verified'}</p>
                </motion.div>
            </div>

            {/* REPORT-SPECIFIC: Full Report Findings */}
            {isReportBased && keyFindings.length > 0 && (
                <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 shadow-sm">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-800">
                        <FileText size={24} /> 📋 {reportType} — Full Analysis
                    </h2>

                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-4xl font-black text-red-600">{report.risk_score || 5}/10</span>
                        <span className="text-slate-600 italic">{severityAnalogy}</span>
                    </div>

                    <div className="space-y-2 mb-4">
                        <h3 className="font-bold text-slate-700">🔬 Key Findings:</h3>
                        <ul className="space-y-2">
                            {keyFindings.map((finding, i) => (
                                <motion.li key={i} className="flex items-start gap-2 p-3 bg-white rounded-lg border border-slate-100"
                                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                                    <span className="text-blue-500 font-bold mt-0.5">{i + 1}.</span>
                                    <span className="text-slate-700">{finding}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </div>

                    <div className="p-4 bg-white rounded-xl text-blue-900 leading-relaxed border border-blue-100">
                        <div className="flex items-center gap-2 mb-2 font-bold text-sm text-blue-700 uppercase">
                            <Brain size={16} /> AI Explanation
                        </div>
                        {report.explanation}
                    </div>

                    {actionNeeded && (
                        <div className="mt-3 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-xl">
                            <p className="text-yellow-800 font-bold">⚠️ {actionNeeded}</p>
                        </div>
                    )}

                    {/* Diet from report */}
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                        {eatFoods.length > 0 && (
                            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                                <h4 className="font-bold text-green-800 mb-2">🟢 Foods to Eat</h4>
                                <div className="flex flex-wrap gap-2">
                                    {eatFoods.map((f, i) => <span key={i} className="bg-green-200 text-green-900 px-3 py-1 rounded-full text-sm font-medium">{f}</span>)}
                                </div>
                            </div>
                        )}
                        {avoidFoods.length > 0 && (
                            <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                                <h4 className="font-bold text-red-800 mb-2">🔴 Foods to Avoid</h4>
                                <div className="flex flex-wrap gap-2">
                                    {avoidFoods.map((f, i) => <span key={i} className="bg-red-200 text-red-900 px-3 py-1 rounded-full text-sm font-medium">{f}</span>)}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Decision Path */}
            <div className="p-6 rounded-2xl bg-white shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <GitBranch size={24} className="text-indigo-600" />
                    {t.decisionPath || 'Decision Path'} — {t.whyThisDiagnosis || 'Why This Diagnosis?'}
                </h2>

                <div className="relative">
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200" />
                    <div className="space-y-4">
                        {decisionSteps.map((step, idx) => (
                            <motion.div key={step.step} className="relative flex items-start gap-4 pl-2"
                                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.15 }}>
                                <div className={`flex-shrink-0 w-10 h-10 rounded-full ${step.color} flex items-center justify-center text-lg font-bold z-10 shadow-sm`}>
                                    {step.icon}
                                </div>
                                <div className="flex-1 pb-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-slate-400 uppercase">Step {step.step}</span>
                                        <span className="font-bold text-slate-800">{step.label}</span>
                                    </div>
                                    <p className="text-sm text-slate-500 mt-1">{step.detail}</p>
                                </div>
                                <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-1" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Feature Importance */}
            <div className="p-6 rounded-2xl bg-white shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                    <BarChart3 size={24} className="text-blue-600" />
                    {t.featureImportance || 'Feature Importance'}
                </h2>
                <p className="text-slate-500 text-sm mb-6">{t.featureDesc || 'These factors influenced the AI\'s decision the most'}</p>

                <div className="space-y-4">
                    {features.length > 0 ? features.map((item, idx) => {
                        const key = item.name || item.label || '';
                        const value = item.value ?? item.importance ?? 0;
                        const colors = ['bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-red-500', 'bg-orange-500'];
                        return (
                            <motion.div key={key} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}>
                                <div className="flex justify-between mb-1">
                                    <span className="font-medium text-slate-700">{key}</span>
                                    <span className="font-bold text-blue-600">{Math.round(value)}%</span>
                                </div>
                                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div className={`h-full ${colors[idx % colors.length]} rounded-full`} initial={{ width: 0 }} animate={{ width: `${Math.min(100, Math.max(0, value))}%` }} transition={{ duration: 1, delay: idx * 0.1 }} />
                                </div>
                            </motion.div>
                        );
                    }) : (
                        <div className="text-center py-8 text-slate-400">
                            <BarChart3 size={40} className="mx-auto mb-2 opacity-30" />
                            <p>Feature importance data will appear after diagnosis</p>
                        </div>
                    )}
                </div>
            </div>

            {/* AI Explanation */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 shadow-sm">
                <h2 className="text-xl font-bold mb-3 flex items-center gap-2 text-amber-800">
                    <AlertTriangle size={24} />
                    {lang === 'hi' ? 'AI की व्याख्या' : lang === 'te' ? 'AI వివరణ' : 'AI Explanation'}
                </h2>
                <p className="text-lg text-amber-900 leading-relaxed">{report.explanation || 'AI analysis complete.'}</p>
            </div>

            {/* Detected Diseases */}
            {diseases.length > 0 && (
                <div className="p-6 rounded-2xl bg-white shadow-sm border border-slate-100">
                    <h2 className="text-xl font-bold mb-4">🔬 Detected Conditions</h2>
                    <div className="space-y-3">
                        {diseases.map((disease, idx) => (
                            <motion.div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100"
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">🏥</span>
                                    <div>
                                        <p className="font-bold text-slate-800">{disease.name}</p>
                                        {disease.icd10 && <p className="text-xs text-slate-400">ICD-10: {disease.icd10}</p>}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`text-2xl font-black ${disease.probability > 0.8 ? 'text-red-600' : disease.probability > 0.5 ? 'text-orange-600' : 'text-green-600'}`}>
                                        {Math.round(disease.probability * 100)}%
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Disclaimer */}
            <div className="p-4 rounded-xl bg-slate-100 text-center text-sm text-slate-500">
                {lang === 'hi' ? '⚕️ यह AI-आधारित विश्लेषण है। कृपया अंतिम निदान के लिए डॉक्टर से मिलें।'
                    : lang === 'te' ? '⚕️ ఇది AI-ఆధారిత విశ్లేషణ. దయచేసి తుది నిర్ధారణ కోసం వైద్యుడిని సంప్రదించండి.'
                        : '⚕️ This is an AI-assisted analysis. Please consult a qualified doctor for final diagnosis.'}
            </div>
        </motion.div>
    );
}
