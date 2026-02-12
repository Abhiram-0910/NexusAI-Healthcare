import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function VoiceUncleButton({ language = 'en', currentPage = 'diagnosis' }) {
    const [isActive, setIsActive] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    const guidance = {
        en: {
            diagnosis: [
                "Hello! Uncle ji here to help. Let's check your health together.",
                "First, if you have any medical report, take a photo by clicking the camera button at the top.",
                "Now, tap on the body part that hurts. Don't worry if you can't read.",
                "Good! Now I'll read the health numbers. Just listen, I'll speak everything.",
                "All done! Click the big 'Analyze' button. I'll tell you what the doctor says."
            ]
        },
        hi: {
            diagnosis: [
                "नमस्ते! अंकल जी यहाँ मदद के लिए। चलो साथ में सेहत चेक करते हैं।",
                "पहले, अगर कोई रिपोर्ट है, ऊपर कैमरा बटन दबाकर फोटो लो।",
                "अब, जहाँ दर्द है वहाँ शरीर पर दबाओ। पढ़ने की चिंता मत करो।",
                "बढ़िया! अब मैं सेहत के नंबर पढ़ूंगा। बस सुनो, मैं सब बोलूंगा।",
                "हो गया! बड़ा 'Analyze' बटन दबाओ। मैं बताऊंगा डॉक्टर क्या कहते हैं।"
            ]
        },
        te: {
            diagnosis: [
                "నమస్కారం! అంకుల్ జీ ఇక్కడ సహాయం చేయడానికి। మీ ఆరోగ్యాన్ని కలిసి చూద్దాం।",
                "మొదట, ఏదైనా రిపోర్ట్ ఉంటే, పైన ఉన్న కెమెరా బటన్ నొక్కి ఫోటో తీయండి।",
                "ఇప్పుడు, నొప్పి ఉన్న శరీర భాగంపై నొక్కండి। చదవడం గురించి ఆలోచించకండి।",
                "బాగుంది! ఇప్పుడు నేను ఆరోగ్య సంఖ్యలను చదువుతాను। వినండి, నేను అన్నీ చెప్తాను।",
                "అయిపోయింది! పెద్ద 'Analyze' బటన్ నొక్కండి। డాక్టర్ ఏమంటారో చెప్తాను."
            ]
        }
    };

    const steps = guidance[language]?.[currentPage] || guidance.en[currentPage];

    const speak = (text) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : 'en-IN';
            window.speechSynthesis.speak(utterance);
        }
    };

    const startGuidance = () => {
        setIsActive(true);
        setCurrentStep(0);
        speak(steps[0]);
    };

    const nextStep = () => {
        const next = currentStep + 1;
        if (next < steps.length) {
            setCurrentStep(next);
            speak(steps[next]);
        } else {
            setIsActive(false);
            setCurrentStep(0);
        }
    };

    useEffect(() => {
        if (isActive) {
            const timer = setTimeout(nextStep, 8000); // Next step after 8 seconds
            return () => clearTimeout(timer);
        }
    }, [isActive, currentStep]);

    return (
        <>
            {/* Big Round Button */}
            <motion.button
                className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full p-6 shadow-2xl"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={startGuidance}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
            >
                <div className="flex flex-col items-center">
                    {isActive ? (
                        <VolumeX className="w-12 h-12" />
                    ) : (
                        <Volume2 className="w-12 h-12 animate-pulse" />
                    )}
                    <span className="text-xs font-bold mt-1">Uncle ji</span>
                </div>
            </motion.button>

            {/* Voice Guidance Popup */}
            <AnimatePresence>
                {isActive && (
                    <motion.div
                        className="fixed bottom-32 right-8 z-50 bg-white rounded-2xl shadow-2xl p-6 max-w-sm border-4 border-orange-400"
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.8 }}
                    >
                        <div className="flex items-start gap-3">
                            <div className="text-4xl">👨‍⚕️</div>
                            <div className="flex-1">
                                <p className="text-lg font-medium text-gray-800 leading-relaxed">
                                    {steps[currentStep]}
                                </p>
                                <div className="mt-3 flex gap-2">
                                    {steps.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`h-2 flex-1 rounded-full ${idx <= currentStep ? 'bg-orange-500' : 'bg-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={nextStep}
                            className="mt-4 w-full bg-orange-500 text-white py-2 rounded-lg font-bold hover:bg-orange-600"
                        >
                            {currentStep < steps.length - 1 ? 'Next ▶️' : 'Finish ✓'}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
