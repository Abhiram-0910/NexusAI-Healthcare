import { useState } from 'react';
import { Upload, Camera, FileImage, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReportScanner({ language = 'en', onResult }) {
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const translations = {
        en: {
            title: "📸 Village Vaidya Report Reader",
            subtitle: "Upload X-ray / Blood Report / Sugar Report",
            upload: "Click photo or choose file",
            analyzing: "Uncle ji is reading your report...",
            reportType: "Report Type",
            severity: "Severity",
            findings: "Key Findings",
            explanation: "Explanation",
            eatFoods: "🟢 Foods to Eat",
            avoidFoods: "🔴 Foods to Avoid",
            action: "Action Needed"
        },
        hi: {
            title: "📸 गाँव के वैद्य रिपोर्ट पाठक",
            subtitle: "X-ray / खून की रिपोर्ट / शुगर रिपोर्ट डालो",
            upload: "फोटो लो या फाइल चुनो",
            analyzing: "अंकल जी आपकी रिपोर्ट पढ़ रहे हैं...",
            reportType: "रिपोर्ट प्रकार",
            severity: "गंभीरता",
            findings: "मुख्य निष्कर्ष",
            explanation: "स्पष्टीकरण",
            eatFoods: "🟢 खाने योग्य",
            avoidFoods: "🔴 बचें",
            action: "क्या करें"
        },
        te: {
            title: "📸 గ్రామ వైద్య నివేదిక రీడర్",
            subtitle: "X-ray / రక్త పరీక్ష / షుగర్ రిపోర్ట్ పెట్టండి",
            upload: "ఫోటో తీయండి లేదా ఫైల్ ఎంచుకోండి",
            analyzing: "అంకుల్ జీ మీ రిపోర్ట్ చదువుతున్నారు...",
            reportType: "రిపోర్ట్ రకం",
            severity: "తీవ్రత",
            findings: "ముఖ్య పరిశోధనలు",
            explanation: "వివరణ",
            eatFoods: "🟢 తినాల్సినవి",
            avoidFoods: "🔴 తినకూడనివి",
            action: "ఏం చేయాలి"
        }
    };

    const t = translations[language] || translations.en;

    const handleFile = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        setPreview(url);
        setLoading(true);
        setResult(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('language', language);

        try {
            const response = await fetch('http://localhost:8000/api/analyze-report', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            console.log('Vision Analysis Result:', data);
            setResult(data);

            if (onResult) {
                onResult(data);
            }
        } catch (err) {
            console.error('Report analysis error:', err);
            alert(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-2xl shadow-xl border-2 border-green-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="flex items-center gap-3 mb-4">
                <Camera className="w-10 h-10 text-green-600" />
                <div>
                    <h2 className="text-2xl font-bold text-green-800">{t.title}</h2>
                    <p className="text-sm text-gray-600">{t.subtitle}</p>
                </div>
            </div>

            <label className="block border-4 border-dashed border-green-500 rounded-2xl p-8 text-center cursor-pointer hover:bg-green-100 transition-all">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFile}
                    className="hidden"
                />

                {!preview ? (
                    <>
                        <Upload className="mx-auto w-16 h-16 text-green-600 mb-3" />
                        <p className="text-xl font-bold text-green-700">{t.upload}</p>
                        <p className="text-sm text-gray-500 mt-2">X-ray, Blood Report, ECG, etc.</p>
                    </>
                ) : (
                    <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-xl shadow-lg" />
                )}
            </label>

            {loading && (
                <motion.div
                    className="mt-6 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <Loader className="w-12 h-12 mx-auto text-green-600 animate-spin" />
                    <p className="text-lg font-bold text-green-700 mt-3">{t.analyzing}</p>
                </motion.div>
            )}

            {result && result.success && (
                <motion.div
                    className="mt-6 bg-white p-6 rounded-xl shadow-lg"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <div className="mb-4">
                        <h3 className="font-bold text-lg text-gray-800">{t.reportType}</h3>
                        <p className="text-xl text-green-700">{result.report_type}</p>
                    </div>

                    <div className="mb-4">
                        <h3 className="font-bold text-lg text-gray-800">{t.severity}</h3>
                        <div className="flex items-center gap-3">
                            <div className="text-3xl font-bold text-red-600">{result.severity}/10</div>
                            <p className="text-sm text-gray-600 italic">{result.severity_analogy}</p>
                        </div>
                    </div>

                    {result.key_findings && result.key_findings.length > 0 && (
                        <div className="mb-4">
                            <h3 className="font-bold text-lg text-gray-800">{t.findings}</h3>
                            <ul className="list-disc list-inside space-y-1">
                                {result.key_findings.map((finding, idx) => (
                                    <li key={idx} className="text-gray-700">{finding}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="mb-4">
                        <h3 className="font-bold text-lg text-gray-800">{t.explanation}</h3>
                        <p className="text-gray-700 leading-relaxed">{result.explanation}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
                            <h3 className="font-bold text-green-800 mb-2">{t.eatFoods}</h3>
                            <div className="flex flex-wrap gap-2">
                                {result.eat_foods.map((food, idx) => (
                                    <span key={idx} className="bg-green-200 text-green-900 px-3 py-1 rounded-full text-sm font-medium">
                                        {food}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="bg-red-50 p-4 rounded-lg border-2 border-red-300">
                            <h3 className="font-bold text-red-800 mb-2">{t.avoidFoods}</h3>
                            <div className="flex flex-wrap gap-2">
                                {result.avoid_foods.map((food, idx) => (
                                    <span key={idx} className="bg-red-200 text-red-900 px-3 py-1 rounded-full text-sm font-medium">
                                        {food}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-yellow-50 border-2 border-yellow-400 p-4 rounded-lg">
                        <h3 className="font-bold text-yellow-900 mb-2">⚠️ {t.action}</h3>
                        <p className="text-yellow-800 font-medium">{result.action_needed}</p>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}
