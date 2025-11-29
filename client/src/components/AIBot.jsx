import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Minimize2, Maximize2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { toast } from 'react-toastify';

const AIBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hi! I\'m your Quick.ai assistant. How can I help you create today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const { getToken } = useAuth();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const token = await getToken();
            const response = await axios.post('http://localhost:5000/api/ai/chat', {
                message: userMessage.content,
                history: messages.slice(-10) // Send last 10 messages for context
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setMessages(prev => [...prev, { role: 'assistant', content: response.data.reply }]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            toast.error('Failed to get response');
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 w-80 sm:w-96 h-[500px] mb-4 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-purple-600 to-cyan-600 p-4 flex justify-between items-center text-white">
                            <div className="flex items-center gap-2">
                                <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
                                    <Bot size={20} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Quick.ai Assistant</h3>
                                    <p className="text-[10px] text-purple-100 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> Online
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                                    <Minimize2 size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                                            ? 'bg-purple-600 text-white rounded-tr-none'
                                            : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none shadow-sm'
                                            }`}
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-slate-800 border border-slate-700 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                                        <Loader2 size={16} className="animate-spin text-purple-500" />
                                        <span className="text-xs text-slate-400">Thinking...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-3 bg-slate-900 border-t border-slate-800">
                            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-500 transition-all">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder="Ask anything..."
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-slate-200 placeholder-slate-500"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className="p-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send size={14} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <div className="relative group">
                {!isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: 20, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ delay: 1, duration: 0.5 }}
                        className="absolute bottom-full right-0 mb-3 w-48 bg-slate-800 p-3 rounded-xl rounded-br-none shadow-xl border border-slate-700 mr-2"
                    >
                        <p className="text-xs text-slate-300 font-medium">
                            👋 Hi! I'm your AI Advisor. <br /> Need help creating?
                        </p>
                    </motion.div>
                )}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    animate={{
                        y: [0, -8, 0],
                        boxShadow: [
                            "0px 10px 20px rgba(147, 51, 234, 0.3)",
                            "0px 20px 30px rgba(147, 51, 234, 0.5)",
                            "0px 10px 20px rgba(147, 51, 234, 0.3)"
                        ]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    onClick={() => setIsOpen(!isOpen)}
                    className={`p-4 rounded-full transition-all ${isOpen
                        ? 'bg-slate-800 text-white rotate-90'
                        : 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white'
                        }`}
                >
                    {isOpen ? <X size={28} /> : <Bot size={32} />}
                </motion.button>
            </div>
        </div>
    );
};

export default AIBot;
