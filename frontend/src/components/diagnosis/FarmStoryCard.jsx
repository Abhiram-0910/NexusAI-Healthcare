import { motion } from 'framer-motion';
import { Sprout, User } from 'lucide-react';

export default function FarmStoryCard({ story, language = 'en' }) {
    const translations = {
        en: {
            title: "🌾 Village Uncle's Story",
            subtitle: "Understanding your health through farm wisdom"
        },
        hi: {
            title: "🌾 गाँव के अंकल की कहानी",
            subtitle: "खेती की समझ से अपनी सेहत समझें"
        },
        te: {
            title: "🌾 గ్రామ అంకుల్ కథ",
            subtitle: "వ్యవసాయ జ్ఞానం ద్వారా మీ ఆరోగ్యాన్ని అర్థం చేసుకోండి"
        }
    };

    const t = translations[language] || translations.en;

    if (!story) return null;

    return (
        <motion.div
            className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl shadow-xl border-2 border-orange-300"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-orange-200 rounded-full">
                    <User className="w-8 h-8 text-orange-700" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-orange-800">{t.title}</h3>
                    <p className="text-sm text-orange-600">{t.subtitle}</p>
                </div>
            </div>

            <motion.div
                className="bg-white p-6 rounded-xl shadow-inner border-2 border-orange-200"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <div className="flex items-start gap-4">
                    <Sprout className="w-12 h-12 text-green-600 flex-shrink-0" />
                    <p className="text-lg leading-relaxed text-gray-800 font-medium whitespace-pre-wrap">
                        {story}
                    </p>
                </div>
            </motion.div>

            {/* Animated farmer walking */}
            <motion.div
                className="mt-4 flex justify-center"
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <span className="text-4xl">🚶‍♂️</span>
            </motion.div>
        </motion.div>
    );
}
