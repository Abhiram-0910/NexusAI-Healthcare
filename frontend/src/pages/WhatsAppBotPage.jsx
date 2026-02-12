import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Mic, Camera, Phone, Check, CheckCheck } from 'lucide-react';

export default function WhatsAppBotPage({ lang = 'en', t = {} }) {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    // Demo conversation flow
    const demoConversation = [
        { type: 'user', text: '🎤 Voice Message: నాకు తల నొప్పి ఉంది', time: '10:30 AM' },
        { type: 'bot', text: 'నమస్కారం! మీ తల నొప్పి గురించి చెప్పండి. ఇది ఎప్పటి నుండి ఉంది?', time: '10:30 AM' },
        { type: 'user', text: '🎤 Voice: 2 రోజుల నుండి', time: '10:31 AM' },
        { type: 'bot', text: 'నొప్పి ఎంత తీవ్రంగా ఉంది? (1-10)', time: '10:31 AM' },
        { type: 'user', text: '🎤 Voice: 7', time: '10:32 AM' },
        { type: 'bot', text: '✅ విశ్లేషణ పూర్తయింది!\n\n📊 **నిర్ధారణ**: మైగ్రేన్ తలనొప్పి\n\n💊 **సిఫార్సు**:\n- పారాసిటమాల్ 500mg\n- విశ్రాంతి\n- నీరు ఎక్కువగా తాగండి\n\n⚠️ 3 రోజుల తర్వాత కూడా తగ్గకపోతే డాక్టర్ని కలవండి', time: '10:32 AM', isResult: true }
    ];

    useEffect(() => {
        // Auto-populate demo conversation
        let index = 0;
        const interval = setInterval(() => {
            if (index < demoConversation.length) {
                if (demoConversation[index].type === 'bot') {
                    setIsTyping(true);
                    setTimeout(() => {
                        setMessages(prev => [...prev, demoConversation[index]]);
                        setIsTyping(false);
                        index++;
                    }, 1500);
                } else {
                    setMessages(prev => [...prev, demoConversation[index]]);
                    index++;
                }
            } else {
                clearInterval(interval);
            }
        }, 2500);

        return () => clearInterval(interval);
    }, []);

    const sendMessage = () => {
        if (!inputText.trim()) return;

        const userMsg = {
            type: 'user',
            text: inputText,
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setInputText('');

        // Simulate bot response
        setIsTyping(true);
        setTimeout(() => {
            const botMsg = {
                type: 'bot',
                text: 'మీ సమస్య గురించి మరింత వివరాలు చెప్పగలరా? ఫోటో పంపవచ్చు లేదా వాయిస్ మెసేజ్ పంపవచ్చు.',
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header Card */}
                <div className="bg-white rounded-t-3xl shadow-xl p-6 border-b">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                AI
                            </div>
                            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="flex-1">
                            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                Seva AI Doctor
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Verified</span>
                            </h1>
                            <div className="flex items-center gap-2 text-sm text-green-600">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                Active now • Speaks Telugu
                            </div>
                        </div>
                        <Phone className="text-green-600" size={24} />
                    </div>
                </div>

                {/* Chat Container */}
                <div className="bg-[#e5ddd5] h-[500px] overflow-y-auto p-4 relative" style={{ backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJhIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0wIDAgTDYwIDYwIE02MCA2MCBMMCAxMjAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMDIiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==)' }}>
                    <div className="space-y-3">
                        <AnimatePresence>
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[80%] rounded-2xl px-4 py-2 shadow-md ${msg.type === 'user'
                                            ? 'bg-green-500 text-white rounded-br-none'
                                            : msg.isResult
                                                ? 'bg-blue-50 text-slate-900 border-2 border-blue-300 rounded-bl-none'
                                                : 'bg-white text-slate-900 rounded-bl-none'
                                        }`}>
                                        <p className="text-sm whitespace-pre-wrap font-medium">{msg.text}</p>
                                        <div className="flex items-center justify-end gap-1 mt-1">
                                            <span className="text-xs opacity-70">{msg.time}</span>
                                            {msg.type === 'user' && <CheckCheck size={14} />}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {isTyping && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex justify-start"
                            >
                                <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 shadow-md">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input Container */}
                <div className="bg-white rounded-b-3xl shadow-xl p-4">
                    <div className="flex items-center gap-2">
                        <button className="p-2 rounded-full hover:bg-slate-100 text-slate-600">
                            <Camera size={24} />
                        </button>
                        <div className="flex-1 bg-slate-100 rounded-full flex items-center px-4 py-2">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                placeholder="Type a message..."
                                className="flex-1 bg-transparent outline-none text-sm"
                            />
                        </div>
                        {inputText.trim() ? (
                            <button
                                onClick={sendMessage}
                                className="p-3 bg-green-500 rounded-full hover:bg-green-600 text-white shadow-lg"
                            >
                                <Send size={20} />
                            </button>
                        ) : (
                            <button className="p-3 bg-green-500 rounded-full hover:bg-green-600 text-white shadow-lg">
                                <Mic size={20} />
                            </button>
                        )}
                    </div>

                    {/* Info Banner */}
                    <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
                        <p className="text-xs text-blue-900 font-medium">
                            📱 <strong>WhatsApp Bot Demo</strong>: Farmers can send voice notes in local language. Works on ₹1000 JioPhones!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
