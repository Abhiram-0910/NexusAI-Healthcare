import { motion } from 'framer-motion';
import { Leaf, Droplet, AlertTriangle } from 'lucide-react';

export default function PlantMeter({ severity = 5 }) {
    // Map severity (1-10) to plant states
    const getPlantState = (sev) => {
        if (sev <= 3) return 'healthy';
        if (sev <= 6) return 'wilting';
        return 'dying';
    };

    const state = getPlantState(severity);

    const states = {
        healthy: {
            color: 'text-green-600',
            bg: 'bg-green-100',
            border: 'border-green-500',
            icon: Leaf,
            message: 'LOW RISK - Your health is like a green plant 🌱',
            plant: '🌿',
            emoji: '😊'
        },
        wilting: {
            color: 'text-yellow-600',
            bg: 'bg-yellow-100',
            border: 'border-yellow-500',
            icon: Droplet,
            message: 'MEDIUM RISK - Needs care like a thirsty field 🌾',
            plant: '🍂',
            emoji: '😟'
        },
        dying: {
            color: 'text-red-600',
            bg: 'bg-red-100',
            border: 'border-red-500',
            icon: AlertTriangle,
            message: 'HIGH RISK - Urgent care needed! 🚨',
            plant: '🥀',
            emoji: '😰'
        }
    };

    const currentState = states[state];
    const Icon = currentState.icon;

    return (
        <motion.div
            className={`${currentState.bg} border-4 ${currentState.border} rounded-2xl p-6 shadow-xl`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            <div className="text-center">
                <h3 className={`text-2xl font-bold ${currentState.color} mb-4`}>Severity Farm Meter</h3>

                {/* Animated Plant */}
                <motion.div
                    className="text-8xl mb-4"
                    animate={{
                        scale: state === 'dying' ? [1, 1.1, 1] : [1, 1.05, 1],
                        rotate: state === 'wilting' ? [0, -5, 5, 0] : 0
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity
                    }}
                >
                    {currentState.plant}
                </motion.div>

                {/* Severity Score */}
                <div className="flex items-center justify-center gap-4 mb-4">
                    <Icon className={`w-12 h-12 ${currentState.color}`} />
                    <div className="text-6xl font-bold ${currentState.color}">{severity}/10</div>
                    <span className="text-4xl">{currentState.emoji}</span>
                </div>

                {/* Message */}
                <p className={`text-lg font-bold ${currentState.color}`}>
                    {currentState.message}
                </p>
            </div>
        </motion.div>
    );
}
