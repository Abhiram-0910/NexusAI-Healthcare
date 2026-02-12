import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Mic } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function VoiceAvatar({ textToSpeak, onSpeechEnd, isListening, lang = 'en' }) {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [useCloudTTS, setUseCloudTTS] = useState(true); // Prefer cloud TTS
    const audioRef = useRef(null);

    // Map short codes to BCP 47 tags for Speech Synthesis
    const getVoiceLang = (code) => {
        const map = {
            'hi': 'hi-IN', 'te': 'te-IN', 'ta': 'ta-IN', 'kn': 'kn-IN',
            'ml': 'ml-IN', 'bn': 'bn-IN', 'gu': 'gu-IN', 'mr': 'mr-IN', 'en': 'en-IN'
        };
        return map[code] || 'en-IN';
    };

    useEffect(() => {
        if (textToSpeak && !isMuted) {
            // Use browser TTS directly for now - it works reliably
            speakWithBrowserTTS(textToSpeak);
        }
    }, [textToSpeak, isMuted, lang]);

    const speakWithCloudTTS = async (text) => {
        try {
            const formData = new FormData();
            formData.append('text', text);
            formData.append('language', getVoiceLang(lang));

            console.log(`☁️ Using Google Cloud TTS for ${lang}...`);
            console.log(`📡 Calling: ${API_URL}/api/tts`);

            const response = await fetch(`${API_URL}/api/tts`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                console.error(`❌ TTS API error: ${response.status} ${response.statusText}`);
                return false;
            }

            const result = await response.json();
            console.log('☁️ TTS Response:', { success: result.success, hasAudio: !!result.audio_content, error: result.error });

            if (result.success && result.audio_content) {
                // Decode base64 and play audio
                const audioBlob = base64ToBlob(result.audio_content, 'audio/mp3');
                const audioUrl = URL.createObjectURL(audioBlob);

                if (audioRef.current) {
                    audioRef.current.pause();
                }

                const audio = new Audio(audioUrl);
                audioRef.current = audio;

                audio.onplay = () => {
                    setIsSpeaking(true);
                    console.log(`🔊 Playing Cloud TTS audio in ${result.language}`);
                };

                audio.onended = () => {
                    setIsSpeaking(false);
                    URL.revokeObjectURL(audioUrl);
                    onSpeechEnd?.();
                };

                audio.onerror = (e) => {
                    console.error('☁️ Cloud audio playback error:', e);
                    setIsSpeaking(false);
                    URL.revokeObjectURL(audioUrl);
                    // Fallback to browser TTS
                    console.log('🔄 Falling back to browser TTS...');
                    speakWithBrowserTTS(text);
                };

                audio.play().catch(err => {
                    console.error('☁️ Audio play() failed:', err);
                    setIsSpeaking(false);
                    URL.revokeObjectURL(audioUrl);
                    speakWithBrowserTTS(text);
                });

                return true;
            } else {
                console.warn('☁️ Cloud TTS returned no audio, error:', result.error);
                return false;
            }
        } catch (error) {
            console.error('Cloud TTS error:', error);
            return false;
        }
    };

    const speakWithBrowserTTS = (text) => {
        if (!('speechSynthesis' in window)) {
            console.error('Speech synthesis not supported');
            return;
        }

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        const langCode = getVoiceLang(lang);

        // CRITICAL: Set language BEFORE looking for voices
        // This tells browser to attempt Telugu/Hindi pronunciation even with English voice
        utterance.lang = langCode;

        const setVoice = () => {
            const voices = window.speechSynthesis.getVoices();
            if (voices.length === 0) return;

            // Try to find voice for target language
            let bestVoice = voices.find(v => v.lang === langCode);

            // Fallback: Try base lang (e.g., 'te' from 'te-IN')
            if (!bestVoice) {
                const baseLang = langCode.split('-')[0];
                bestVoice = voices.find(v => v.lang.startsWith(baseLang));
            }

            // Final fallback: Use any Indian voice or default
            if (!bestVoice) {
                bestVoice = voices.find(v => v.lang.includes('-IN')) || voices[0];
                console.log(`🎙️ No native ${langCode} voice, using: ${bestVoice?.name || 'default'}`);
                console.log(`ℹ️ Browser will attempt to pronounce ${langCode} text with available voice`);
            } else {
                console.log(`🎙️ Using voice: ${bestVoice.name} for ${langCode}`);
            }

            if (bestVoice) {
                utterance.voice = bestVoice;
            }
        };

        setVoice();

        if (window.speechSynthesis.getVoices().length === 0) {
            window.speechSynthesis.onvoiceschanged = () => setVoice();
        }

        utterance.rate = 0.85; // Slower for clarity, especially for non-native voices
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        utterance.onstart = () => {
            setIsSpeaking(true);
            console.log(`🔊 Speaking "${text.substring(0, 30)}..." in ${langCode}`);
        };

        utterance.onend = () => {
            setIsSpeaking(false);
            onSpeechEnd?.();
        };

        utterance.onerror = (e) => {
            console.error('❌ Speech error:', e);
            setIsSpeaking(false);
        };

        window.speechSynthesis.speak(utterance);
    };

    const speak = async (text) => {
        if (useCloudTTS) {
            const success = await speakWithCloudTTS(text);
            if (!success) {
                speakWithBrowserTTS(text);
            }
        } else {
            speakWithBrowserTTS(text);
        }
    };

    const stopSpeaking = () => {
        window.speechSynthesis.cancel();
        if (audioRef.current) {
            audioRef.current.pause();
        }
        setIsSpeaking(false);
    };

    // Helper function to convert base64 to Blob
    const base64ToBlob = (base64, mimeType) => {
        const byteCharacters = atob(base64);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, { type: mimeType });
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 pointer-events-none">
            <div className="pointer-events-auto">
                <AnimatePresence>
                    {textToSpeak && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="mb-4 mr-4 bg-white p-4 rounded-2xl rounded-tr-none shadow-xl border border-blue-100 max-w-xs"
                        >
                            <p className="text-sm font-medium text-slate-700 leading-relaxed">
                                {textToSpeak}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="relative group">
                    {/* Avatar Circle */}
                    <motion.div
                        animate={{
                            scale: isSpeaking ? [1, 1.05, 1] : 1,
                            boxShadow: isSpeaking
                                ? "0 0 0 4px rgba(59, 130, 246, 0.3)"
                                : "0 0 0 0px rgba(59, 130, 246, 0)"
                        }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className={`relative w-24 h-24 rounded-full border-4 border-white shadow-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center overflow-hidden cursor-pointer ${isSpeaking ? 'ring-4 ring-blue-200' : ''}`}
                        onClick={() => isSpeaking ? stopSpeaking() : speak(textToSpeak)}
                    >
                        {/* Animated Face */}
                        <svg viewBox="0 0 100 100" className="w-16 h-16 text-white fill-current">
                            {/* Eyes */}
                            <motion.circle
                                cx="35" cy="45" r="4"
                                animate={{ scaleY: isSpeaking ? [1, 0.1, 1] : 1 }}
                                transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
                            />
                            <motion.circle
                                cx="65" cy="45" r="4"
                                animate={{ scaleY: isSpeaking ? [1, 0.1, 1] : 1 }}
                                transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
                            />

                            {/* Mouth */}
                            <motion.path
                                d="M 30 65 Q 50 75 70 65"
                                strokeWidth="3"
                                strokeLinecap="round"
                                fill="none"
                                stroke="currentColor"
                                animate={{
                                    d: isSpeaking
                                        ? ["M 30 65 Q 50 75 70 65", "M 30 65 Q 50 85 70 65", "M 30 65 Q 50 75 70 65"]
                                        : "M 35 65 Q 50 70 65 65"
                                }}
                                transition={{ duration: 0.3, repeat: isSpeaking ? Infinity : 0 }}
                            />
                        </svg>

                        {/* Mic Indicator */}
                        {isListening && (
                            <div className="absolute inset-0 bg-red-500/80 backdrop-blur-[1px] flex items-center justify-center animate-pulse">
                                <Mic className="text-white w-8 h-8" />
                            </div>
                        )}

                        {/* Cloud TTS Indicator */}
                        {useCloudTTS && isSpeaking && (
                            <div className="absolute bottom-1 right-1 bg-white rounded-full p-1">
                                <span className="text-xs">☁️</span>
                            </div>
                        )}
                    </motion.div>

                    {/* Controls */}
                    <div className="absolute -left-12 bottom-0 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); stopSpeaking(); }}
                            className="p-2 bg-white rounded-full shadow-md text-slate-500 hover:text-blue-600"
                            title={isMuted ? "Unmute" : "Mute"}
                        >
                            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); setUseCloudTTS(!useCloudTTS); }}
                            className="p-2 bg-white rounded-full shadow-md text-slate-500 hover:text-blue-600 text-xs"
                            title={useCloudTTS ? "Using Cloud TTS" : "Using Browser TTS"}
                        >
                            {useCloudTTS ? '☁️' : '🌐'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
