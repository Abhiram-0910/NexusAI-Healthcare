import { useEffect, useState } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OfflineBanner() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <AnimatePresence>
            {!isOnline && (
                <motion.div
                    className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-yellow-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3"
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                >
                    <WifiOff className="w-6 h-6" />
                    <div>
                        <p className="font-bold">🏡 Gaon Mode - Internet Nahi Hai</p>
                        <p className="text-xs">Using local diagnosis (Ollama)</p>
                    </div>
                </motion.div>
            )}

            {isOnline && (
                <motion.div
                    className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                >
                    <Wifi className="w-4 h-4" />
                    <span className="text-sm font-medium">Online</span>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
