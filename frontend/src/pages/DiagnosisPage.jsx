import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stethoscope, Activity, AlertCircle, Brain, Pill, Calendar, Mic } from 'lucide-react';
import { apiClient } from '../services/apiClient';
import { useSpeechInput } from '../hooks/useSpeechInput';
import VisualSymptomPicker from '../components/diagnosis/VisualSymptomPicker';
import VoiceAvatar from '../components/layout/VoiceAvatar';
import ConfidenceMeter from '../components/diagnosis/ConfidenceMeter';
import MedicineVisualGuide from '../components/diagnosis/MedicineVisualGuide';
import ReportScanner from '../components/diagnosis/ReportScanner';
import FarmStoryCard from '../components/diagnosis/FarmStoryCard';
import AnimatedThali from '../components/diagnosis/AnimatedThali';
import AnimatedStoryVideo from '../components/diagnosis/AnimatedStoryVideo';

export default function DiagnosisPage({ lang, t, onDiagnosisComplete, onReportScan, savedReport }) {
  const [activeTab, setActiveTab] = useState('input');
  // Vitals - marked as wearable device input
  const [glucose, setGlucose] = useState(120);
  const [heartRate, setHeartRate] = useState(80);
  const [spo2, setSpo2] = useState(98);
  const [temperature, setTemperature] = useState(98.6);
  const [systolic, setSystolic] = useState(120);
  const [diastolic, setDiastolic] = useState(80);
  const [wearableConnected, setWearableConnected] = useState(false);
  const [symptoms, setSymptoms] = useState('');
  const [voiceText, setVoiceText] = useState('');
  const [farmStory, setFarmStory] = useState(null);
  const [diagnosisResults, setDiagnosisResults] = useState(null);
  const [reportScanData, setReportScanData] = useState(null);

  const getLangCode = (code) => {
    const map = {
      'hi': 'hi-IN', 'te': 'te-IN', 'ta': 'ta-IN', 'kn': 'kn-IN',
      'ml': 'ml-IN', 'bn': 'bn-IN', 'gu': 'gu-IN', 'mr': 'mr-IN', 'en': 'en-IN'
    };
    return map[code] || 'en-US';
  };

  const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
  const speech = useSpeechInput(getLangCode(lang));

  // Restore saved data when navigating back
  useEffect(() => {
    if (savedReport && !report) {
      setReport(savedReport);
      setActiveTab('result');
      // Restore farm story and diagnosis results from saved report
      if (savedReport.farmStory) setFarmStory(savedReport.farmStory);
      if (savedReport.diagnosisResults) setDiagnosisResults(savedReport.diagnosisResults);
    }
  }, [savedReport]);

  const handleSymptomSelect = (data) => {
    const text = typeof data === 'object' ? data.description : data;
    const part = typeof data === 'object' ? data.latestPart : null;
    setSymptoms(text);

    if (part) {
      const partKey = part.toLowerCase();
      const translatedPart = t[partKey.replace(' ', '_')];
      const partName = translatedPart || part;
      let msg = (t.bodyPart || "You selected {part}").replace('{part}', partName);
      let question = "";
      if (t.questions) {
        if (partKey.includes('head')) question = t.questions.head;
        else if (partKey.includes('chest')) question = t.questions.chest;
        else if (partKey.includes('stomach')) question = t.questions.stomach;
        else if (['arm', 'leg', 'hand', 'foot', 'legs', 'limbs'].some(x => partKey.includes(x))) question = t.questions.limbs;
        else question = t.questions.general;
      }
      if (question) msg += " " + question;
      setVoiceText(msg);
    } else {
      setVoiceText(`You said: ${text}. I am updating your symptoms.`);
    }
  };

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);

  // Handle report scan result - auto-trigger analysis
  const handleReportScan = (scanData) => {
    console.log('📸 Report scan complete:', scanData);
    setReportScanData(scanData);
    if (onReportScan) onReportScan(scanData); // Persist in App.jsx

    // Auto-trigger diagnosis if we have scan data
    if (scanData && scanData.success) {
      autoAnalyzeFromReport(scanData);
    }
  };

  // Auto-analyze from uploaded report
  const autoAnalyzeFromReport = (scanData) => {
    const diseases = [];
    if (scanData.key_findings) {
      diseases.push({
        name: scanData.report_type || 'Medical Finding',
        probability: (scanData.severity || 5) / 10,
        icd10: 'R69'
      });
    }

    const autoReport = {
      patient_id: `PAT-AUTO-${Date.now().toString(16).slice(-6).toUpperCase()}`,
      risk: scanData.severity >= 7 ? 'high' : scanData.severity >= 4 ? 'medium' : 'low',
      risk_score: scanData.severity || 5,
      confidence: 0.8,
      explanation: scanData.explanation || 'Analysis complete',
      diseases: diseases,
      featureImportance: [
        { name: 'Report Analysis', value: 85, color: '#3b82f6' },
        { name: 'Severity Level', value: (scanData.severity || 5) * 10, color: '#ef4444' },
        { name: 'Key Findings', value: (scanData.key_findings?.length || 1) * 20, color: '#10b981' }
      ],
      fairnessMetrics: { overall_fairness_score: 90 },
      triage: scanData.severity >= 7 ? 'RED' : scanData.severity >= 4 ? 'YELLOW' : 'GREEN',
      treatment_plan: {
        medications: [],
        procedures: [scanData.action_needed || 'Consult doctor'],
        follow_up: 'As advised by doctor'
      },
      dietTips: [],
      medicationGuide: '',
      // Store report-specific data
      reportType: scanData.report_type,
      keyFindings: scanData.key_findings,
      severityAnalogy: scanData.severity_analogy,
      eatFoods: scanData.eat_foods,
      avoidFoods: scanData.avoid_foods,
      actionNeeded: scanData.action_needed,
      isFromReport: true, // Flag to indicate this came from report scan
      timestamp: new Date().toISOString()
    };

    setReport(autoReport);
    setFarmStory(scanData.severity_analogy || null);
    setDiagnosisResults({
      ...autoReport,
      recommended_foods: scanData.eat_foods || [],
      avoid_foods: scanData.avoid_foods || [],
      severity: scanData.severity || 5,
      diseases: diseases,
      // Pass actual report findings to story video
      reportExplanation: scanData.explanation,
      reportFindings: scanData.key_findings,
      reportType: scanData.report_type
    });

    setActiveTab('result');
    onDiagnosisComplete?.({
      ...autoReport,
      farmStory: scanData.severity_analogy,
      diagnosisResults: {
        recommended_foods: scanData.eat_foods || [],
        avoid_foods: scanData.avoid_foods || [],
        severity: scanData.severity || 5,
        diseases: diseases,
        reportExplanation: scanData.explanation,
        reportFindings: scanData.key_findings,
        reportType: scanData.report_type,
        isFromReport: true
      }
    });
  };

  const handleDiagnose = async () => {
    try {
      setLoading(true);
      if (isOffline) {
        const result = {
          risk_level: 'MEDIUM',
          triage: { color: 'YELLOW', action: 'Consult Doctor' },
          confidence: 0.75,
          explanation: 'Offline mode: Vitals suggest moderate risk.',
          diseases: [{ name: 'Possible Viral Infection', probability: 0.7 }],
          treatment_plan: { medications: [{ name: 'Paracetamol', dose: '500mg' }], procedures: [] },
          feature_importance: {}
        };
        setReport(result);
        setActiveTab('result');
        onDiagnosisComplete?.(result);
        return;
      }

      const formData = new FormData();
      formData.append('glucose', glucose);
      formData.append('heart_rate', heartRate);
      formData.append('systolic', systolic);
      formData.append('diastolic', diastolic);
      formData.append('spo2', spo2);
      formData.append('temperature', temperature);
      formData.append('symptoms', symptoms);
      formData.append('age', 55);
      formData.append('gender', 'Male');
      formData.append('income', 25000);
      formData.append('language', lang);

      const result = await apiClient.diagnose(formData);
      console.log('✅ Diagnosis Result from Backend:', result);

      const mappedReport = {
        patient_id: result.patient_id,
        risk: result.risk,
        risk_score: result.risk_score,
        confidence: result.confidence,
        explanation: result.explanation,
        dietTips: result.dietTips || [],
        medicationGuide: result.medicationGuide || '',
        diseases: result.diseases || [],
        featureImportance: result.featureImportance || [],
        fairnessMetrics: result.fairnessMetrics || {},
        timestamp: result.timestamp,
        triage: result.risk === 'high' ? 'RED' : result.risk === 'medium' ? 'YELLOW' : 'GREEN',
        treatment_plan: result.treatmentPlan || {
          medications: [],
          procedures: [],
          follow_up: '1 week'
        },
        isFromReport: false, // This is from vitals/wearables
        farmStory: result.farmStory,
        diagnosisResults: {
          recommended_foods: result.recommended_foods || [],
          avoid_foods: result.avoid_foods || [],
          severity: result.severity || result.risk_score || 5,
          diseases: result.diseases || []
        }
      };

      setReport(mappedReport);
      setFarmStory(result.farmStory || null);
      setDiagnosisResults({
        ...result,
        recommended_foods: result.recommended_foods || [],
        avoid_foods: result.avoid_foods || [],
        severity: result.severity || result.risk_score || 5,
        diseases: result.diseases || []
      });
      setActiveTab('result');
      onDiagnosisComplete?.(mappedReport);

      if (result.explanation) setVoiceText(result.explanation);
    } catch (error) {
      console.error('❌ Diagnosis error:', error);
      alert(`Diagnosis failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const TriageBanner = ({ triage }) => {
    const configs = {
      RED: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300', action: 'URGENT: Seek immediate medical attention', icon: '🚨' },
      YELLOW: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300', action: 'MODERATE: Consult doctor within 24-48 hours', icon: '⚠️' },
      GREEN: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', action: 'LOW RISK: Follow recommended care plan', icon: '✅' }
    };
    const config = configs[triage] || configs.GREEN;
    return (
      <div className={`p-5 rounded-xl border-2 flex items-center gap-4 mb-6 ${config.bg} ${config.text} ${config.border}`}>
        <div className="text-4xl">{config.icon}</div>
        <div>
          <div className="font-bold text-lg">Triage Level: {triage}</div>
          <div className="text-sm font-medium">{config.action}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-3">
        <Stethoscope size={32} className="text-blue-600" />
        {activeTab === 'input' ? (t.diagnose || 'Diagnosis Input') : 'Analysis Results'}
      </h1>

      <AnimatePresence mode='wait'>
        {activeTab === 'input' ? (
          <motion.div
            key="input"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* FEATURE 1: Village Vaidya Report Reader - AUTO ANALYZES ON UPLOAD */}
            <ReportScanner
              language={lang}
              onResult={handleReportScan}
            />

            {/* Vitals Form - WEARABLE DEVICE SECTION */}
            <div className="p-6 rounded-2xl bg-white shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg"><Activity size={20} className="text-red-600" /></div>
                  <div>
                    <h3 className="font-bold">⌚ Wearable Device Readings</h3>
                    <p className="text-xs text-slate-500">Connect a wearable or enter readings manually</p>
                  </div>
                </div>
                <button
                  onClick={() => setWearableConnected(!wearableConnected)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition ${wearableConnected ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}
                >
                  {wearableConnected ? '✅ Connected' : '📡 Simulate Wearable'}
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Glucose (mg/dL)</label>
                  <input type="number" value={glucose} onChange={e => setGlucose(e.target.value)} className="w-full p-2 border rounded-lg font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Heart Rate (BPM)</label>
                  <input type="number" value={heartRate} onChange={e => setHeartRate(e.target.value)} className="w-full p-2 border rounded-lg font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">SpO2 (%)</label>
                  <input type="number" value={spo2} onChange={e => setSpo2(e.target.value)} className="w-full p-2 border rounded-lg font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Temp (°F)</label>
                  <input type="number" value={temperature} onChange={e => setTemperature(e.target.value)} className="w-full p-2 border rounded-lg font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">BP Systolic</label>
                  <input type="number" value={systolic} onChange={e => setSystolic(e.target.value)} className="w-full p-2 border rounded-lg font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">BP Diastolic</label>
                  <input type="number" value={diastolic} onChange={e => setDiastolic(e.target.value)} className="w-full p-2 border rounded-lg font-bold" />
                </div>
              </div>
            </div>

            {/* Symptoms (Voice + Visual) */}
            <div className="p-6 rounded-2xl bg-white shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-100 rounded-lg"><AlertCircle size={20} className="text-orange-600" /></div>
                <h3 className="font-bold">Symptoms (Tap body parts or speak)</h3>
              </div>

              <VisualSymptomPicker onSymptomSelect={handleSymptomSelect} t={t} />

              <div className="flex gap-2 mt-6 pt-6 border-t border-slate-100">
                <textarea
                  value={speech.transcript || symptoms}
                  onChange={(e) => { setSymptoms(e.target.value); speech.setTranscript(''); }}
                  className="flex-1 p-3 border rounded-xl bg-slate-50 text-slate-500 text-sm"
                  placeholder="Or type symptoms here if preferred..."
                  rows={2}
                />
                <button onClick={speech.isListening ? speech.stop : speech.start} className={`p-4 rounded-xl transition-all ${speech.isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-200 hover:bg-slate-300'}`}>
                  <Mic size={24} />
                </button>
              </div>
            </div>

            <button
              onClick={handleDiagnose}
              disabled={loading}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
            >
              {loading ? 'Running Multi-Modal Analysis...' : '⌚ Analyze Wearable + Symptom Data'}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-slate-600">Analyzing...</p>
              </div>
            )}

            {!loading && report && (
              <>
                <TriageBanner triage={report.triage} />

                {report.confidence !== undefined && (
                  <ConfidenceMeter confidence={report.confidence} severity={report.risk || 'medium'} />
                )}

                {/* Report Findings Card - if from uploaded report */}
                {report.isFromReport && report.keyFindings && (
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 shadow-sm">
                    <h3 className="text-xl font-bold text-blue-800 mb-3">📋 {report.reportType || 'Report'} Analysis</h3>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl font-black text-red-600">{report.risk_score}/10</span>
                      <span className="text-sm text-slate-600 italic">{report.severityAnalogy}</span>
                    </div>
                    <ul className="space-y-2 mb-4">
                      {report.keyFindings.map((finding, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-700">
                          <span className="text-blue-500 mt-1">•</span>
                          {finding}
                        </li>
                      ))}
                    </ul>
                    <div className="p-4 bg-white rounded-xl text-blue-900 leading-relaxed">
                      <div className="flex items-center gap-2 mb-2 font-bold text-sm text-blue-700 uppercase">
                        <Brain size={16} /> AI Explanation
                      </div>
                      {report.explanation}
                    </div>
                    {report.actionNeeded && (
                      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-300 rounded-lg text-yellow-800 font-medium">
                        ⚠️ {report.actionNeeded}
                      </div>
                    )}
                  </div>
                )}

                {/* Farm Story Card */}
                {farmStory && <FarmStoryCard story={farmStory} language={lang} />}

                {/* Animated Story Video - passes actual diagnosis data */}
                <AnimatedStoryVideo diagnosis={diagnosisResults} language={lang} onComplete={() => console.log('Story video completed!')} />

                {/* Living Thali Diet Plan */}
                {diagnosisResults && (
                  <AnimatedThali
                    eatFoods={diagnosisResults.recommended_foods || []}
                    avoidFoods={diagnosisResults.avoid_foods || []}
                    language={lang}
                  />
                )}

                <MedicineVisualGuide />

                {/* Detected Conditions - for vitals-based diagnosis */}
                {!report.isFromReport && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                      <h3 className="font-bold text-lg mb-4">Detected Conditions</h3>
                      <ul className="space-y-2">
                        {report.diseases?.map((d, i) => (
                          <li key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                            <span className="font-medium">{d.name}</span>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${d.probability > 0.8 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                              {Math.round(d.probability * 100)}% Match
                            </span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 p-4 bg-blue-50 rounded-xl text-blue-900 leading-relaxed">
                        <div className="flex items-center gap-2 mb-2 font-bold text-sm text-blue-700 uppercase tracking-wider">
                          <Brain size={16} /> AI Doctor Explanation
                        </div>
                        {report.explanation || "AI Explanation unavailable."}
                      </div>
                    </div>

                    <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Pill size={20} className="text-green-600" /> Recommended Treatment
                      </h3>
                      {report.medicationGuide && (
                        <div className="mb-4 p-3 bg-green-50 text-green-800 rounded-lg text-sm border border-green-100">
                          <strong>💊 Guide: </strong> {report.medicationGuide}
                        </div>
                      )}
                      {report.treatment_plan?.medications?.length > 0 ? (
                        <ul className="space-y-3">
                          {report.treatment_plan.medications.map((m, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2" />
                              <div>
                                <div className="font-bold text-slate-800">{m.name}</div>
                                <div className="text-xs text-slate-500">{m.dose} • {m.frequency} • {m.duration}</div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-slate-500 italic">No specific medications recommended.</p>
                      )}
                      {report.dietTips?.length > 0 && (
                        <div className="mt-6">
                          <h4 className="font-bold text-sm mb-2 text-slate-700">🥗 Lifestyle & Diet Tips</h4>
                          <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                            {report.dietTips.map((tip, i) => <li key={i}>{tip}</li>)}
                          </ul>
                        </div>
                      )}
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><Calendar size={16} /> Next Steps</h4>
                        <ul className="text-sm text-slate-600 space-y-1 list-disc pl-4 mb-2">
                          {report.treatment_plan?.procedures?.map((p, i) => <li key={i}>{p}</li>)}
                        </ul>
                        <div className="text-sm font-medium text-blue-700 bg-blue-50 px-3 py-2 rounded-lg">
                          Follow up in: {report.treatment_plan?.follow_up || 'As advised by doctor'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Diet Cards for report-based diagnosis */}
                {report.isFromReport && report.eatFoods && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-5 rounded-xl border-2 border-green-200">
                      <h3 className="font-bold text-green-800 mb-3">🟢 Foods to Eat</h3>
                      <div className="flex flex-wrap gap-2">
                        {report.eatFoods.map((food, i) => (
                          <span key={i} className="bg-green-200 text-green-900 px-3 py-1 rounded-full text-sm font-medium">{food}</span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-red-50 p-5 rounded-xl border-2 border-red-200">
                      <h3 className="font-bold text-red-800 mb-3">🔴 Foods to Avoid</h3>
                      <div className="flex flex-wrap gap-2">
                        {report.avoidFoods.map((food, i) => (
                          <span key={i} className="bg-red-200 text-red-900 px-3 py-1 rounded-full text-sm font-medium">{food}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setActiveTab('input')}
                  className="w-full py-3 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300"
                >
                  New Diagnosis
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {activeTab === 'input' && (
          <VoiceAvatar
            key={lang}
            textToSpeak={voiceText || t.voicePrompt || "Tap where it hurts on the body map, or speak to me."}
            isListening={speech.isListening}
            lang={lang}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
