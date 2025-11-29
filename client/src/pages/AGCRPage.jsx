import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Upload, X, Mic, Image as ImageIcon, History, Clock, ChevronRight, Plus, Send, Loader2, Sparkles } from 'lucide-react';
import { useAGCR } from '../context/AGCRContext';
import { assets } from '../assets/assets';

export const AGCRPage = () => {
    // Branding Colors
    const PURPLE_ACCENT = 'purple-600';
    const CYAN_ACCENT = 'cyan-600';
    const GOLD_ACCENT = 'yellow-500'; // Added Gold/Yellow for variance

    const {
        topic, setTopic,
        videoStyle, setVideoStyle,
        voiceFile, setVoiceFile,
        imageFiles, setImageFiles,
        loading, generateContent,
        history, fetchHistory, loadHistoryItem, historyLoading
    } = useAGCR();

    const [showHistory, setShowHistory] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);

    const handleVoiceRecording = () => {
        if (isRecording) {
            setIsRecording(false);
            window.speechRecognitionInstance?.stop();
        } else {
            if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                const recognition = new SpeechRecognition();
                window.speechRecognitionInstance = recognition;

                recognition.continuous = false;
                recognition.interimResults = false;
                recognition.lang = 'en-US';

                recognition.onstart = () => setIsRecording(true);
                recognition.onend = () => setIsRecording(false);
                recognition.onerror = (event) => {
                    console.error('Speech recognition error', event.error);
                    setIsRecording(false);
                };
                recognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    setTopic((prev) => (prev ? prev + ' ' + transcript : transcript));
                };

                recognition.start();
            } else {
                alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
            }
        }
    };

    const handleVoiceChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                alert('File size must be less than 10MB');
                return;
            }
            setVoiceFile(file);
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + imageFiles.length > 5) {
            alert('Maximum 5 images allowed');
            return;
        }
        setImageFiles([...imageFiles, ...files]);
    };

    const removeImage = (index) => {
        setImageFiles(imageFiles.filter((_, i) => i !== index));
    };

    const toggleHistory = () => {
        if (!showHistory) {
            fetchHistory();
        }
        setShowHistory(!showHistory);
    };

    return (
        <div className="min-h-screen text-slate-200 p-4 md:p-8 font-sans relative">

            {/* History Drawer */}
            <AnimatePresence>
                {showHistory && (
                    <>
                        {/* Dimmer Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={toggleHistory}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        />
                        {/* Drawer Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 h-full w-full md:w-[480px] bg-slate-900 shadow-2xl z-50 border-l border-slate-800 flex flex-col"
                        >
                            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur-md">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <History className="text-purple-500" /> Generation History
                                </h2>
                                <button onClick={toggleHistory} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {historyLoading ? (
                                    <div className="flex justify-center py-12">
                                        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                                    </div>
                                ) : history.length > 0 ? (
                                    history.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-purple-500/50 transition-all group cursor-pointer"
                                            onClick={() => {
                                                loadHistoryItem(item);
                                                setShowHistory(false);
                                            }}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-xs font-medium text-purple-400 bg-purple-500/10 px-2 py-1 rounded-md border border-purple-500/20">
                                                    {item.type === 'agcr-engine' ? 'Campaign' : item.type}
                                                </span>
                                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                                    <Clock size={12} />
                                                    {new Date(item.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <h3 className="font-semibold text-slate-200 line-clamp-2 mb-2 group-hover:text-purple-400 transition-colors">
                                                {item.prompt}
                                            </h3>
                                            <div className="flex items-center text-xs text-slate-500 gap-1 group-hover:translate-x-1 transition-transform">
                                                View Details <ChevronRight size={12} />
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 text-slate-500">
                                        <History size={48} className="mx-auto mb-3 opacity-20" />
                                        <p>No history found yet.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <div className="max-w-5xl mx-auto pt-8">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12 relative"
                >
                    {/* ENHANCED HISTORY BUTTON STYLE */}
                    <button
                        onClick={toggleHistory}
                        className={`absolute right-0 top-0 p-3 bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg hover:bg-slate-800 hover:border-purple-500/50 transition-all group text-sm font-semibold flex items-center gap-2 backdrop-blur-sm`}
                        title="View History"
                    >
                        <History size={20} className="text-slate-400 group-hover:text-purple-400 transition-colors" />
                        <span className="hidden md:inline text-slate-400 group-hover:text-purple-400">History</span>
                    </button>

                    <div className="inline-block p-4 rounded-full bg-gradient-to-br from-cyan-500/10 to-purple-500/10 mb-6 shadow-2xl shadow-purple-500/20 border border-white/5">
                        <img src={assets.logo} alt="Quik.ai Logo" className="w-12 h-12 object-contain" />
                    </div>
                    {/* UPDATED TITLE GRADIENT for more color pop */}
                    <h1 className="text-5xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400 mb-4 tracking-tight drop-shadow-sm">
                        AI Content Generator
                    </h1>
                    {/* REMOVED HEALTHCARE REFERENCE */}
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">
                        Lift your marketing ideas into high-level content: scripts, visuals, and ads in one click.
                    </p>
                </motion.div>

                {/* Main Interaction Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative z-10"
                >
                    <div className="p-2">
                        <div className="mb-8">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 ml-2">
                                Content Topic / Prompt
                            </label>

                            {/* Gemini-style Chat Bar - Dark Mode */}
                            <div className={`relative bg-slate-900 border transition-all duration-300 rounded-3xl p-3 flex items-end gap-2 shadow-xl ${topic ? `border-purple-500 ring-2 ring-purple-500/20` : 'border-slate-800'
                                }`}>

                                {/* Attachment Button Dropdown (Purple & Cyan Accents) */}
                                <div className="relative group/attach">
                                    <button className={`p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 rounded-full transition-colors flex-shrink-0 ${voiceFile || imageFiles.length > 0 ? 'bg-purple-500/20 text-purple-400' : ''}`}>
                                        <Plus size={20} />
                                    </button>
                                    {/* Dropdown Menu for Attachments */}
                                    <div className="absolute bottom-full left-0 mb-3 w-52 bg-slate-900 rounded-xl shadow-2xl border border-slate-800 p-1 opacity-0 invisible group-hover/attach:opacity-100 group-hover/attach:visible transition-all transform origin-bottom-left z-10">
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className={`w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-${PURPLE_ACCENT} text-sm font-medium flex items-center gap-2 transition-colors`}
                                        >
                                            <Mic size={16} /> Upload Voice Sample
                                        </button>
                                        <button
                                            onClick={() => imageInputRef.current?.click()}
                                            className={`w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-${CYAN_ACCENT} text-sm font-medium flex items-center gap-2 transition-colors`}
                                        >
                                            <ImageIcon size={16} /> Upload Reference Images
                                        </button>
                                    </div>
                                </div>

                                {/* Main Text Input */}
                                <textarea
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    // REMOVED HEALTHCARE REFERENCE
                                    placeholder="Tell Quik.ai what video or ad content you need (e.g., 'A dramatic commercial script for a new software product')."
                                    className="w-full bg-transparent border-none focus:ring-0 text-slate-200 placeholder-slate-600 text-lg py-3 max-h-40 min-h-[64px] resize-none scrollbar-hide"
                                    rows={1}
                                    style={{ height: 'auto', minHeight: '64px' }}
                                    onInput={(e) => {
                                        e.target.style.height = 'auto';
                                        e.target.style.height = e.target.scrollHeight + 'px';
                                    }}
                                />

                                {/* Voice Recording Button (Red/White accent) */}
                                <button
                                    onClick={handleVoiceRecording}
                                    className={`p-2.5 rounded-full transition-all flex-shrink-0 ${isRecording
                                        ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30'
                                        : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'
                                        }`}
                                    title={isRecording ? "Stop Recording" : "Start Voice Input"}
                                >
                                    {isRecording ? <div className="w-5 h-5 bg-white rounded-sm" /> : <Mic size={22} />}
                                </button>

                                {/* Send / Generate Button (Purple-Cyan Gradient) */}
                                <button
                                    onClick={generateContent}
                                    disabled={loading || !topic.trim()}
                                    className={`p-2.5 rounded-full shadow-lg transition-all transform hover:scale-105 flex-shrink-0 ${loading || !topic.trim()
                                        ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:shadow-cyan-500/25'
                                        }`}
                                >
                                    {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={20} />}
                                </button>
                            </div>

                            {/* Active Attachments Indicators (Purple & Cyan) */}
                            {(voiceFile || imageFiles.length > 0) && (
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {voiceFile && (
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-xs font-semibold border border-purple-500/20`}>
                                            <Mic size={14} />
                                            <span className="truncate max-w-[120px]">{voiceFile.name}</span>
                                            <button onClick={() => setVoiceFile(null)} className="hover:text-purple-300"><X size={14} /></button>
                                        </div>
                                    )}
                                    {imageFiles.map((file, i) => (
                                        <div key={i} className={`inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-xs font-semibold border border-cyan-500/20`}>
                                            <ImageIcon size={14} />
                                            <span className="truncate max-w-[120px]">{file.name}</span>
                                            <button onClick={() => removeImage(i)} className="hover:text-cyan-300"><X size={14} /></button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Video Style Selector */}
                        <div className="mb-8">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 ml-2">
                                Select Video Style (Optional)
                            </label>
                            <div className="flex flex-wrap gap-3">
                                {['Cinematic', 'Cartoon', 'Professional', 'Social Media', 'Documentary', '3D Animation', 'Anime'].map((style) => (
                                    <button
                                        key={style}
                                        onClick={() => setVideoStyle(style)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm ${videoStyle === style
                                            // ENHANCED STYLE: Purple/Cyan Gradient
                                            ? `bg-gradient-to-r from-purple-500 to-${CYAN_ACCENT} text-white shadow-md shadow-cyan-500/30`
                                            // INACTIVE STYLE: Dark background, light text
                                            : `bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700`
                                            }`}
                                    >
                                        {style}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Main Generate Button */}
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={generateContent}
                            disabled={loading || !topic.trim()}
                            className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white font-bold py-5 rounded-2xl shadow-xl shadow-purple-600/20 hover:shadow-purple-600/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-xl tracking-wide"
                        >
                            {loading ? (
                                <>
                                    {/* ENHANCED LOADING VISUAL */}
                                    <Sparkles className="w-6 h-6 animate-pulse text-yellow-300" />
                                    <span>Synthesizing Campaign Assets...</span>
                                </>
                            ) : (
                                <>
                                    <Rocket className="w-6 h-6" />
                                    <span>Launch Generator</span>
                                </>
                            )}
                        </motion.button>
                    </div>
                </motion.div>
            </div>

            {/* Previously Generated Videos Section */}
            <div className="max-w-6xl mx-auto mt-20 mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h2 className="text-3xl font-bold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
                        Previously Generated Videos
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: "Avatar IV Concept", src: "/Avatar IV Video.mp4" },
                            { title: "Avatar IV Concept 2", src: "/Avatar IV Video (1).mp4" },
                            { title: "Image to Video Gen", src: "/Video_Generation_From_Images.mp4" },
                            { title: "AI Commercial Demo", src: "/WhatsApp Video 2025-11-29 at 16.02.06.mp4" }
                        ].map((video, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.02 }}
                                className="bg-slate-900/50 rounded-2xl overflow-hidden border border-slate-800 shadow-xl hover:border-purple-500/30 hover:shadow-purple-500/10 transition-all group"
                            >
                                {/* CHANGED: aspect-video (16:9) to aspect-[9/16] for vertical videos */}
                                <div className="aspect-[9/16] bg-slate-950 relative">
                                    <video
                                        src={video.src}
                                        controls
                                        className="w-full h-full object-contain" // Changed to object-contain to show full video content
                                        poster={assets.logo}
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-slate-200 group-hover:text-purple-400 transition-colors">
                                        {video.title}
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                        <Sparkles size={12} /> AI Generated
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Hidden Inputs for Attachments (kept unchanged) */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleVoiceChange}
                accept="audio/*"
                className="hidden"
                id="voice-upload-hidden"
            />
            <input
                type="file"
                ref={imageInputRef}
                onChange={handleImageChange}
                accept="image/*"
                multiple
                className="hidden"
                id="image-upload-hidden"
            />
        </div>
    );
};