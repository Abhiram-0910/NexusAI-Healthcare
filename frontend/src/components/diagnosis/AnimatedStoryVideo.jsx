import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Maximize2, Volume2, Loader2 } from 'lucide-react';
import { apiClient } from '../../services/apiClient';

export default function AnimatedStoryVideo({ diagnosis, language = 'en', onComplete }) {
    const [storyData, setStoryData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    // Fetch story video on mount
    useEffect(() => {
        if (diagnosis) {
            generateStoryVideo();
        }
    }, [diagnosis, language]);

    // Build scenes from actual diagnosis results
    const buildScenesFromDiagnosis = () => {
        if (!diagnosis) return null;

        const diseaseName = diagnosis.diseases?.[0]?.name || diagnosis.reportType || 'your condition';
        const severity = diagnosis.severity || 5;
        const findings = diagnosis.reportFindings || [];
        const eatFoods = (diagnosis.recommended_foods || []).slice(0, 3).join(', ') || 'dal, sabzi, dahi';
        const avoidFoods = (diagnosis.avoid_foods || []).slice(0, 3).join(', ') || 'junk food, sweets';
        const explanation = diagnosis.reportExplanation || diagnosis.explanation || '';

        // Build a story that specifically references the diagnosis results
        return [
            { id: 1, duration: 9, visual: 'farm_field', narration: `Friend, your report shows: ${diseaseName}. Let me explain what this means for you.`, animation_type: 'fade_in' },
            { id: 2, duration: 9, visual: severity >= 7 ? 'weak_plant' : 'sugar_bowl', narration: findings.length > 0 ? `The report found: ${findings[0]}${findings.length > 1 ? '. Also: ' + findings[1] : '.'}` : `Your severity level is ${severity} out of 10. ${explanation.slice(0, 80)}.`, animation_type: 'grow' },
            { id: 3, duration: 9, visual: 'weak_plant', narration: severity >= 7 ? `This is serious, like a crop dying without water. Your severity is ${severity} out of 10. Please see a doctor soon.` : severity >= 4 ? `This needs attention, like a crop that needs more water. Your severity is ${severity} out of 10.` : `This is manageable, like a healthy crop that just needs a little care. Severity is ${severity} out of 10.`, animation_type: 'shake' },
            { id: 4, duration: 9, visual: 'food_plate', narration: `Eat these foods: ${eatFoods}. Avoid: ${avoidFoods}. This will help you get better.`, animation_type: 'bounce' },
            { id: 5, duration: 9, visual: 'farmer_happy', narration: severity >= 7 ? `Please consult a doctor soon. Take care of yourself and follow the diet plan.` : `You will get better! Follow the diet plan and take care of yourself.`, animation_type: 'fade_in' }
        ];
    };

    const generateStoryVideo = async () => {
        setLoading(true);
        try {
            const response = await apiClient.post('/api/generate-story-video', {
                diagnosis,
                language
            });

            console.log('📹 Story video generated:', response.data);
            setStoryData(response.data);
        } catch (error) {
            console.error('Story video generation error:', error);
            // Try building from actual diagnosis data first
            const diagnosisScenes = buildScenesFromDiagnosis();
            setStoryData({
                title: "Health Story",
                duration: 45,
                language,
                scenes: diagnosisScenes || getFallbackScenes(language)
            });
        } finally {
            setLoading(false);
        }
    };

    // Language codes for Web Speech API
    const voiceLangCodes = {
        en: 'en-IN', hi: 'hi-IN', te: 'te-IN', ta: 'ta-IN', kn: 'kn-IN', ml: 'ml-IN'
    };

    const getFallbackScenes = (lang) => {
        // Generic fallbacks only used when no diagnosis data is available
        const scenes = {
            en: [
                { id: 1, duration: 9, visual: 'farm_field', narration: 'Friend, listen to a story about your health...', animation_type: 'fade_in' },
                { id: 2, duration: 9, visual: 'sugar_bowl', narration: 'Your body needs balance and care.', animation_type: 'grow' },
                { id: 3, duration: 9, visual: 'weak_plant', narration: 'Like a crop that needs water and attention.', animation_type: 'shake' },
                { id: 4, duration: 9, visual: 'food_plate', narration: 'Eat healthy foods like dal, sabzi, and dahi.', animation_type: 'bounce' },
                { id: 5, duration: 9, visual: 'farmer_happy', narration: 'You will get better. Take care of yourself!', animation_type: 'fade_in' }
            ],
            hi: [
                { id: 1, duration: 9, visual: 'farm_field', narration: 'भाई, सुनो एक कहानी अपनी सेहत की...', animation_type: 'fade_in' },
                { id: 2, duration: 9, visual: 'sugar_bowl', narration: 'तुम्हारे शरीर को संतुलन चाहिए।', animation_type: 'grow' },
                { id: 3, duration: 9, visual: 'weak_plant', narration: 'जैसे फसल को पानी चाहिए, वैसे शरीर को ध्यान चाहिए।', animation_type: 'shake' },
                { id: 4, duration: 9, visual: 'food_plate', narration: 'सही खाना खाओ। दाल, पालक, दही खाओ। मिठाई से बचो।', animation_type: 'bounce' },
                { id: 5, duration: 9, visual: 'farmer_happy', narration: 'ठीक हो जाओगे। ध्यान रखो!', animation_type: 'fade_in' }
            ],
            te: [
                { id: 1, duration: 9, visual: 'farm_field', narration: 'అన్నా, మీ ఆరోగ్యం గురించి ఒక కథ వినండి...', animation_type: 'fade_in' },
                { id: 2, duration: 9, visual: 'sugar_bowl', narration: 'మీ శరీరానికి సమతుల్యత అవసరం.', animation_type: 'grow' },
                { id: 3, duration: 9, visual: 'weak_plant', narration: 'పంటకు నీరు కావాలి, అలాగే శరీరానికి శ్రద్ధ కావాలి.', animation_type: 'shake' },
                { id: 4, duration: 9, visual: 'food_plate', narration: 'మంచి ఆహారం తినండి. పప్పు, పాలకూర, పెరుగు తినండి.', animation_type: 'bounce' },
                { id: 5, duration: 9, visual: 'farmer_happy', narration: 'మీరు బాగవుతారు. జాగ్రత్తగా ఉండండి!', animation_type: 'fade_in' }
            ],
            ta: [
                { id: 1, duration: 9, visual: 'farm_field', narration: 'நண்பா, உன் உடல்நலம் பற்றி ஒரு கதை கேள்...', animation_type: 'fade_in' },
                { id: 2, duration: 9, visual: 'sugar_bowl', narration: 'உன் உடலுக்கு சமநிலை தேவை.', animation_type: 'grow' },
                { id: 3, duration: 9, visual: 'weak_plant', narration: 'பயிருக்கு தண்ணீர் தேவை, அதுபோல் உடலுக்கு கவனிப்பு தேவை.', animation_type: 'shake' },
                { id: 4, duration: 9, visual: 'food_plate', narration: 'நல்ல உணவு சாப்பிடுங்கள். பருப்பு, கீரை, தயிர் சாப்பிடுங்கள்.', animation_type: 'bounce' },
                { id: 5, duration: 9, visual: 'farmer_happy', narration: 'நீங்கள் குணமாவீர்கள். கவனமாக இருங்கள்!', animation_type: 'fade_in' }
            ],
            kn: [
                { id: 1, duration: 9, visual: 'farm_field', narration: 'ಅಣ್ಣಾ, ನಿಮ್ಮ ಆರೋಗ್ಯದ ಬಗ್ಗೆ ಒಂದು ಕಥೆ ಕೇಳಿ...', animation_type: 'fade_in' },
                { id: 2, duration: 9, visual: 'sugar_bowl', narration: 'ನಿಮ್ಮ ದೇಹಕ್ಕೆ ಸಮತೋಲನ ಬೇಕು.', animation_type: 'grow' },
                { id: 3, duration: 9, visual: 'weak_plant', narration: 'ಬೆಳೆಗೆ ನೀರು ಬೇಕು, ಹಾಗೆಯೇ ದೇಹಕ್ಕೆ ಆರೈಕೆ ಬೇಕು.', animation_type: 'shake' },
                { id: 4, duration: 9, visual: 'food_plate', narration: 'ಒಳ್ಳೆಯ ಆಹಾರ ತಿನ್ನಿ. ಬೇಳೆ, ಪಾಲಕ್, ಮೊಸರು ತಿನ್ನಿ.', animation_type: 'bounce' },
                { id: 5, duration: 9, visual: 'farmer_happy', narration: 'ನೀವು ಸರಿಯಾಗುತ್ತೀರಿ. ಜಾಗ್ರತೆ ವಹಿಸಿ!', animation_type: 'fade_in' }
            ],
            ml: [
                { id: 1, duration: 9, visual: 'farm_field', narration: 'ചേട്ടാ, നിങ്ങളുടെ ആരോഗ്യത്തെ കുറിച്ച് ഒരു കഥ കേൾക്കൂ...', animation_type: 'fade_in' },
                { id: 2, duration: 9, visual: 'sugar_bowl', narration: 'നിങ്ങളുടെ ശരീരത്തിന് സന്തുലിതാവസ്ഥ ആവശ്യമാണ്.', animation_type: 'grow' },
                { id: 3, duration: 9, visual: 'weak_plant', narration: 'വിളയ്ക്ക് വെള്ളം വേണം, അതുപോലെ ശരീരത്തിന് പരിചരണം വേണം.', animation_type: 'shake' },
                { id: 4, duration: 9, visual: 'food_plate', narration: 'നല്ല ഭക്ഷണം കഴിക്കുക. പരിപ്പ്, ചീര, തൈര് കഴിക്കുക.', animation_type: 'bounce' },
                { id: 5, duration: 9, visual: 'farmer_happy', narration: 'നിങ്ങൾ സുഖമാകും. ശ്രദ്ധിക്കുക!', animation_type: 'fade_in' }
            ]
        };
        return scenes[lang] || scenes.en;
    };

    const playStory = () => {
        setPlaying(true);
        setCurrentSceneIndex(0);
        setProgress(0);
        playSceneSequence(0);
    };

    const playSceneSequence = async (sceneIndex) => {
        if (!storyData || sceneIndex >= storyData.scenes.length) {
            setPlaying(false);
            if (onComplete) onComplete();
            return;
        }

        const scene = storyData.scenes[sceneIndex];
        setCurrentSceneIndex(sceneIndex);

        // Speak narration in correct language
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Cancel any ongoing speech
            const utterance = new SpeechSynthesisUtterance(scene.narration);
            utterance.lang = voiceLangCodes[language] || 'en-IN';
            utterance.rate = 0.9; // Slightly slower for clarity
            window.speechSynthesis.speak(utterance);
        }

        // Animate progress
        const duration = scene.duration * 1000;
        const interval = 50;
        let elapsed = 0;

        const progressInterval = setInterval(() => {
            elapsed += interval;
            const sceneProgress = (sceneIndex + (elapsed / duration)) / storyData.scenes.length;
            setProgress(sceneProgress * 100);

            if (elapsed >= duration) {
                clearInterval(progressInterval);
                setTimeout(() => {
                    playSceneSequence(sceneIndex + 1);
                }, 200);
            }
        }, interval);
    };

    const pauseStory = () => {
        setPlaying(false);
        window.speechSynthesis.cancel();
    };

    const restartStory = () => {
        pauseStory();
        setTimeout(() => playStory(), 300);
    };

    const getSceneVisual = (visualType, animationType) => {
        const animations = {
            fade_in: { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 1 } },
            grow: { initial: { scale: 0.5 }, animate: { scale: 1 }, transition: { duration: 1, type: 'spring' } },
            bounce: { animate: { y: [0, -20, 0] }, transition: { repeat: Infinity, duration: 2 } },
            shake: { animate: { rotate: [-5, 5, -5, 0] }, transition: { repeat: Infinity, duration: 1.5 } }
        };

        const visuals = {
            farm_field: (
                <motion.div className="scene-visual farm-field" {...(animations[animationType] || animations.fade_in)}>
                    <div className="sky">☀️</div>
                    <div className="field-ground">🌾🌾🌾🌾🌾</div>
                </motion.div>
            ),
            sugar_bowl: (
                <motion.div className="scene-visual sugar-bowl" {...(animations[animationType] || animations.grow)}>
                    <div className="bowl">🥣</div>
                    <div className="sugar">🍬🍬🍬</div>
                </motion.div>
            ),
            weak_plant: (
                <motion.div className="scene-visual plant" {...(animations[animationType] || animations.shake)}>
                    <div className="plant-sad">🥀</div>
                </motion.div>
            ),
            healthy_plant: (
                <motion.div className="scene-visual plant" {...(animations[animationType] || animations.grow)}>
                    <div className="plant-healthy">🌱</div>
                </motion.div>
            ),
            food_plate: (
                <motion.div className="scene-visual food-plate" {...(animations[animationType] || animations.bounce)}>
                    <div className="thali">🍽️</div>
                    <div className="foods">🥬🥛🫘</div>
                </motion.div>
            ),
            farmer_happy: (
                <motion.div className="scene-visual farmer" {...(animations[animationType] || animations.fade_in)}>
                    <div className="farmer-icon">👨‍🌾</div>
                    <div className="heart">❤️</div>
                </motion.div>
            ),
            farmer_sad: (
                <motion.div className="scene-visual farmer" {...(animations[animationType] || animations.fade_in)}>
                    <div className="farmer-icon">😔</div>
                </motion.div>
            )
        };

        return visuals[visualType] || visuals.farm_field;
    };

    // Localized labels
    const labels = {
        en: { loading: 'Creating your health story...', play: 'Play', pause: 'Pause', restart: 'Restart', tap: 'Tap to watch story' },
        hi: { loading: 'आपकी स्वास्थ्य कहानी बना रहे हैं...', play: 'चलाओ', pause: 'रुको', restart: 'फिर से', tap: 'कहानी देखने के लिए टैप करें' },
        te: { loading: 'మీ ఆరోగ్య కథ తయారు చేస్తున్నాం...', play: 'ప్లే', pause: 'ఆపు', restart: 'మళ్ళీ', tap: 'కథ చూడటానికి నొక్కండి' },
        ta: { loading: 'உங்கள் சுகாதார கதையை உருவாக்குகிறோம்...', play: 'ஓட்டு', pause: 'இடை', restart: 'மீண்டும்', tap: 'கதை பார்க்க தொடவும்' },
        kn: { loading: 'ನಿಮ್ಮ ಆರೋಗ್ಯ ಕಥೆಯನ್ನು ರಚಿಸುತ್ತಿದ್ದೇವೆ...', play: 'ಪ್ಲೇ', pause: 'ನಿಲ್ಲಿಸಿ', restart: 'ಮತ್ತೆ', tap: 'ಕಥೆ ನೋಡಲು ಸ್ಪರ್ಶಿಸಿ' },
        ml: { loading: 'നിങ്ങളുടെ ആരോഗ്യ കഥ ഉണ്ടാക്കുന്നു...', play: 'പ്ലേ', pause: 'നിർത്തുക', restart: 'വീണ്ടും', tap: 'കഥ കാണാൻ ടാപ്പ് ചെയ്യുക' }
    };
    const l = labels[language] || labels.en;

    if (loading) {
        return (
            <div className="story-video-loading">
                <Loader2 className="spin" size={40} />
                <p>{l.loading}</p>
            </div>
        );
    }

    if (!storyData) return null;

    const currentScene = storyData.scenes[currentSceneIndex];

    return (
        <div className="animated-story-video">
            <div className="video-header">
                <h3>🎬 {storyData.title}</h3>
                <span className="duration">⏱️ {storyData.duration}s</span>
            </div>

            <div className="video-player">
                <div className="video-screen">
                    <AnimatePresence mode="wait">
                        {currentScene && (
                            <motion.div
                                key={currentScene.id}
                                className="scene-container"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.5 }}
                            >
                                {getSceneVisual(currentScene.visual, currentScene.animation_type)}

                                <div className="narration-text">
                                    <Volume2 size={20} />
                                    <p>{currentScene.narration}</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!playing && currentSceneIndex === 0 && (
                        <div className="play-overlay" onClick={playStory}>
                            <Play size={60} />
                            <p>{l.tap}</p>
                        </div>
                    )}
                </div>

                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>

                <div className="video-controls">
                    {!playing ? (
                        <button onClick={playStory} className="control-btn play-btn">
                            <Play size={24} />
                            <span>{l.play}</span>
                        </button>
                    ) : (
                        <button onClick={pauseStory} className="control-btn pause-btn">
                            <Pause size={24} />
                            <span>{l.pause}</span>
                        </button>
                    )}

                    <button onClick={restartStory} className="control-btn">
                        <RotateCcw size={20} />
                        <span>{l.restart}</span>
                    </button>

                    <div className="scene-indicator">
                        Scene {currentSceneIndex + 1} / {storyData.scenes.length}
                    </div>
                </div>
            </div>

            <style jsx>{`
        .animated-story-video {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          padding: 24px;
          margin: 20px 0;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        
        .video-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          color: white;
        }
        
        .video-header h3 {
          font-size: 24px;
          margin: 0;
        }
        
        .duration {
          background: rgba(255,255,255,0.2);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 14px;
        }
        
        .video-player {
          background: #1a1a2e;
          border-radius: 16px;
          overflow: hidden;
        }
        
        .video-screen {
          position: relative;
          height: 400px;
          background: linear-gradient(180deg, #2d3561 0%, #1a1a2e 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .scene-container {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }
        
        .scene-visual {
          font-size: 80px;
          margin-bottom: 30px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }
        
        .narration-text {
          background: rgba(0,0,0,0.7);
          color: white;
          padding: 16px 24px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          max-width: 80%;
          text-align: center;
        }
        
        .narration-text p {
          margin: 0;
          font-size: 18px;
          line-height: 1.6;
        }
        
        .play-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: white;
          transition: background 0.3s;
        }
        
        .play-overlay:hover {
          background: rgba(0,0,0,0.7);
        }
        
        .play-overlay p {
          margin-top: 16px;
          font-size: 18px;
        }
        
        .progress-bar {
          height: 6px;
          background: rgba(255,255,255,0.1);
          position: relative;
        }
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          transition: width 0.05s linear;
        }
        
        .video-controls {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: rgba(0,0,0,0.3);
        }
        
        .control-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: rgba(255,255,255,0.1);
          border: none;
          border-radius: 8px;
          color: white;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .control-btn:hover {
          background: rgba(255,255,255,0.2);
          transform: scale(1.05);
        }
        
        .play-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .scene-indicator {
          margin-left: auto;
          color: rgba(255,255,255,0.7);
          font-size: 14px;
        }
        
        .story-video-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          color: white;
        }
        
        .spin {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}
