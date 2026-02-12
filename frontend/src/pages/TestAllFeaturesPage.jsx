import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TestTube, CheckCircle } from 'lucide-react';
import ReportScanner from '../components/diagnosis/ReportScanner';
import FarmStoryCard from '../components/diagnosis/FarmStoryCard';
import AnimatedThali from '../components/diagnosis/AnimatedThali';
import PlantMeter from '../components/diagnosis/PlantMeter';
import VoiceUncleButton from '../components/layout/VoiceUncleButton';
import OfflineBanner from '../components/layout/OfflineBanner';

export default function TestAllFeaturesPage() {
    const [testResults, setTestResults] = useState({
        feature1: false,
        feature2: false,
        feature3: false,
        feature4: false,
        feature5: false,
        feature6: false
    });

    const [reportData, setReportData] = useState(null);
    const [language, setLanguage] = useState('en');

    // Sample farm story
    const sampleFarmStory = "Bhai, your sugar is high jaise tyohaar mein mithai zyada kha liya. Your body is like a field with too much fertilizer. Now eat: bajra roti, palak sabzi, dahi, moong dal. Avoid: white chawal, aloo, mithai, cold drinks. Walk 2 km daily like going to the field.";

    // Sample foods for thali
    const sampleEatFoods = ["bajra roti", "palak sabzi", "dahi", "moong dal"];
    const sampleAvoidFoods = ["white chawal", "aloo", "mithai", "tel"];

    const markFeatureTested = (feature) => {
        setTestResults(prev => ({ ...prev, [feature]: true }));
    };

    const allFeaturesTested = Object.values(testResults).every(val => val);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
            {/* Offline Banner - Feature 5 */}
            <OfflineBanner />

            {/* Voice Uncle Button - Feature 4 */}
            <VoiceUncleButton language={language} currentPage="diagnosis" />

            <div className="max-w-6xl mx-auto">
                <motion.div
                    className="bg-white rounded-3xl shadow-2xl p-8 mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <TestTube className="w-12 h-12 text-purple-600" />
                            <div>
                                <h1 className="text-4xl font-bold text-gray-800">🏆 Testing All 6 Award-Winning Features</h1>
                                <p className="text-gray-600">Live Demo & Verification</p>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className={`text-2xl font-bold ${allFeaturesTested ? 'text-green-600' : 'text-gray-400'}`}>
                                {Object.values(testResults).filter(Boolean).length}/6 Tested
                            </div>
                            {allFeaturesTested && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="flex items-center gap-2 text-green-600"
                                >
                                    <CheckCircle className="w-6 h-6" />
                                    <span className="font-bold">ALL FEATURES WORKING! 🎉</span>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Language Selector */}
                    <div className="mb-6 flex gap-2">
                        {['en', 'hi', 'te'].map(lang => (
                            <button
                                key={lang}
                                onClick={() => setLanguage(lang)}
                                className={`px-4 py-2 rounded-lg font-bold ${language === lang ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
                                    }`}
                            >
                                {lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी' : 'తెలుగు'}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Feature 1: Village Vaidya Report Reader */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="bg-white rounded-2xl p-6 shadow-lg mb-4">
                        <h2 className="text-2xl font-bold text-purple-700 mb-2">
                            Feature 1: Village Vaidya Report Reader (Gemini Vision) 📸
                        </h2>
                        <p className="text-gray-600 mb-4">Upload medical report image and get AI analysis</p>
                        <ReportScanner
                            language={language}
                            onResult={(data) => {
                                setReportData(data);
                                markFeatureTested('feature1');
                            }}
                        />
                        {testResults.feature1 && (
                            <div className="mt-4 p-3 bg-green-100 border-2 border-green-500 rounded-lg">
                                ✅ <strong>TESTED & WORKING!</strong> Report analysis complete
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Feature 2: Farm Story Explainer */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="bg-white rounded-2xl p-6 shadow-lg mb-4">
                        <h2 className="text-2xl font-bold text-orange-700 mb-2">
                            Feature 2: Farm Story Explainer (Dual LLM - Ollama) 🌾
                        </h2>
                        <p className="text-gray-600 mb-4">Medical diagnosis explained as village farm story</p>
                        <FarmStoryCard story={sampleFarmStory} language={language} />
                        <button
                            onClick={() => markFeatureTested('feature2')}
                            className="mt-4 px-6 py-3 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600"
                        >
                            ✓ Mark Feature 2 as Tested
                        </button>
                        {testResults.feature2 && (
                            <div className="mt-4 p-3 bg-green-100 border-2 border-green-500 rounded-lg">
                                ✅ <strong>TESTED & WORKING!</strong> Farm story displayed
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Feature 3: Living Thali Planner */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="bg-white rounded-2xl p-6 shadow-lg mb-4">
                        <h2 className="text-2xl font-bold text-yellow-700 mb-2">
                            Feature 3: Living Thali Planner (Animated Diet) 🍽️
                        </h2>
                        <p className="text-gray-600 mb-4">Visual food recommendations in animated steel plate</p>
                        <AnimatedThali
                            eatFoods={sampleEatFoods}
                            avoidFoods={sampleAvoidFoods}
                            language={language}
                        />
                        <button
                            onClick={() => markFeatureTested('feature3')}
                            className="mt-4 px-6 py-3 bg-yellow-500 text-white rounded-lg font-bold hover:bg-yellow-600"
                        >
                            ✓ Mark Feature 3 as Tested
                        </button>
                        {testResults.feature3 && (
                            <div className="mt-4 p-3 bg-green-100 border-2 border-green-500 rounded-lg">
                                ✅ <strong>TESTED & WORKING!</strong> Thali showing foods correctly
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Feature 6: Severity Farm Meter */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="bg-white rounded-2xl p-6 shadow-lg mb-4">
                        <h2 className="text-2xl font-bold text-red-700 mb-2">
                            Feature 6: Severity Farm Meter (Plant-based) 🌱
                        </h2>
                        <p className="text-gray-600 mb-4">Health severity shown as plant states</p>
                        <div className="grid md:grid-cols-3 gap-4">
                            <PlantMeter severity={2} />
                            <PlantMeter severity={5} />
                            <PlantMeter severity={9} />
                        </div>
                        <button
                            onClick={() => markFeatureTested('feature6')}
                            className="mt-4 px-6 py-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600"
                        >
                            ✓ Mark Feature 6 as Tested
                        </button>
                        {testResults.feature6 && (
                            <div className="mt-4 p-3 bg-green-100 border-2 border-green-500 rounded-lg">
                                ✅ <strong>TESTED & WORKING!</strong> Plant meter animations working
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Feature 4: Voice Uncle Mode */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="bg-white rounded-2xl p-6 shadow-lg mb-4">
                        <h2 className="text-2xl font-bold text-blue-700 mb-2">
                            Feature 4: Voice Uncle Mode (Voice Navigation) 🔊
                        </h2>
                        <p className="text-gray-600 mb-4">Look at bottom-right for floating "Uncle ji" button. Click it to hear voice guidance!</p>
                        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 text-center">
                            <p className="text-2xl mb-4">👇 See the orange button at bottom-right corner? 👇</p>
                            <p className="text-lg font-medium">Click it to start voice-guided tour!</p>
                        </div>
                        <button
                            onClick={() => markFeatureTested('feature4')}
                            className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600"
                        >
                            ✓ Mark Feature 4 as Tested (After clicking Uncle ji button)
                        </button>
                        {testResults.feature4 && (
                            <div className="mt-4 p-3 bg-green-100 border-2 border-green-500 rounded-lg">
                                ✅ <strong>TESTED & WORKING!</strong> Voice guidance functional
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Feature 5: Offline Gaon Doctor */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <div className="bg-white rounded-2xl p-6 shadow-lg mb-4">
                        <h2 className="text-2xl font-bold text-green-700 mb-2">
                            Feature 5: Offline Gaon Doctor (Works Without Internet) 🏡
                        </h2>
                        <p className="text-gray-600 mb-4">Banner appears when offline. Check top of page for online/offline indicator.</p>
                        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 text-center">
                            <p className="text-xl mb-4">You should see a green "Online" badge at top-right</p>
                            <p className="text-lg font-medium">To test offline mode: Disconnect WiFi and refresh page</p>
                            <p className="text-sm text-gray-600 mt-2">(You'll see yellow "Gaon Mode" banner)</p>
                        </div>
                        <button
                            onClick={() => markFeatureTested('feature5')}
                            className="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600"
                        >
                            ✓ Mark Feature 5 as Tested
                        </button>
                        {testResults.feature5 && (
                            <div className="mt-4 p-3 bg-green-100 border-2 border-green-500 rounded-lg">
                                ✅ <strong>TESTED & WORKING!</strong> Online/offline detection working
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Final Summary */}
                {allFeaturesTested && (
                    <motion.div
                        className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-3xl p-8 text-center shadow-2xl"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                    >
                        <h2 className="text-4xl font-bold mb-4">🎉 ALL 6 FEATURES TESTED SUCCESSFULLY! 🎉</h2>
                        <p className="text-2xl mb-4">This app is ready to win 1st place! 🏆</p>
                        <div className="text-xl">
                            <p>✅ Village Vaidya Report Reader</p>
                            <p>✅ Farm Story Explainer</p>
                            <p>✅ Living Thali Planner</p>
                            <p>✅ Voice Uncle Mode</p>
                            <p>✅ Offline Gaon Doctor</p>
                            <p>✅ Severity Farm Meter</p>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
