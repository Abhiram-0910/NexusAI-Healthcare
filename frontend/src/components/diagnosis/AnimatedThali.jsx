import { motion } from 'framer-motion';
import { Utensils } from 'lucide-react';

export default function AnimatedThali({ eatFoods = [], avoidFoods = [], language = 'en' }) {
    const translations = {
        en: {
            title: "🍽️ Living Thali Planner",
            subtitle: "Your personalized diet plan",
            eat: "✅ Eat These (खाओ)",
            avoid: "❌ Avoid These (मत खाओ)"
        },
        hi: {
            title: "🍽️ जीवित थाली योजना",
            subtitle: "आपका व्यक्तिगत भोजन योजना",
            eat: "✅ ये खाओ",
            avoid: "❌ ये मत खाओ"
        },
        te: {
            title: "🍽️ జీవన తళిక ప్లానర్",
            subtitle: "మీ వ్యక్తిగత ఆహార ప్లాన్",
            eat: "✅ ఇవి తినండి",
            avoid: "❌ ఇవి తినవద్దు"
        }
    };

    const t = translations[language] || translations.en;

    // Food emoji mapping
    const foodEmojis = {
        'bajra': '🌾', 'bajra roti': '🫓', 'jowar': '🌾',
        'palak': '🥬', 'spinach': '🥬',
        'dahi': '🥛', 'curd': '🥛', 'yogurt': '🥛',
        'dal': '🫘', 'moong': '🫘', 'pulses': '🫘',
        'doodh': '🥛', 'milk': '🥛',
        'chawal': '🍚', 'rice': '🍚',
        'aloo': '🥔', 'potato': '🥔',
        'mithai': '🍬', 'sweet': '🍬',
        'tel': '🛢️', 'oil': '🛢️',
        'sabzi': '🥗', 'vegetable': '🥗',
        'roti': '🫓', 'chapati': '🫓'
    };

    const getEmoji = (food) => {
        const lowerFood = food.toLowerCase();
        for (const [key, emoji] of Object.entries(foodEmojis)) {
            if (lowerFood.includes(key)) return emoji;
        }
        return '🍽️';
    };

    if (eatFoods.length === 0 && avoidFoods.length === 0) {
        return null;
    }

    return (
        <motion.div
            className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-2xl shadow-xl border-2 border-yellow-400"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="flex items-center gap-3 mb-6">
                <Utensils className="w-10 h-10 text-yellow-700" />
                <div>
                    <h3 className="text-2xl font-bold text-yellow-800">{t.title}</h3>
                    <p className="text-sm text-yellow-600">{t.subtitle}</p>
                </div>
            </div>

            {/* Animated Thali (Steel Plate) */}
            <motion.div
                className="relative mx-auto w-full max-w-2xl"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.8 }}
            >
                {/* Thali Base */}
                <div className="relative bg-gradient-to-br from-gray-300 to-gray-400 rounded-full p-8 shadow-2xl border-4 border-gray-500">

                    <div className="grid grid-cols-2 gap-6">
                        {/* Green Foods (Eat) */}
                        <div className="bg-white rounded-xl p-4 shadow-lg border-4 border-green-500">
                            <h4 className="font-bold text-green-800 mb-3 text-center">{t.eat}</h4>
                            <div className="space-y-2">
                                {eatFoods.map((food, idx) => (
                                    <motion.div
                                        key={idx}
                                        className="flex items-center gap-2 bg-green-100 p-2 rounded-lg"
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: idx * 0.1 }}
                                    >
                                        <span className="text-2xl">{getEmoji(food)}</span>
                                        <span className="font-medium text-green-900">{food}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Red Foods (Avoid) */}
                        <div className="bg-white rounded-xl p-4 shadow-lg border-4 border-red-500">
                            <h4 className="font-bold text-red-800 mb-3 text-center">{t.avoid}</h4>
                            <div className="space-y-2">
                                {avoidFoods.map((food, idx) => (
                                    <motion.div
                                        key={idx}
                                        className="flex items-center gap-2 bg-red-100 p-2 rounded-lg"
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: idx * 0.1 }}
                                    >
                                        <span className="text-2xl">{getEmoji(food)}</span>
                                        <span className="font-medium text-red-900">{food}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
