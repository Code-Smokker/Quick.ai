import React from 'react';
import { motion } from 'framer-motion';
import { Film, Copy, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';
import { useAGCR } from '../../context/AGCRContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const VideoScript = () => {
    const { result } = useAGCR();

    if (!result) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">No content generated yet</h2>
                    <Link to="/ai/agcr-engine" className="text-purple-600 hover:text-purple-700 font-semibold">
                        Go to AGCR Engine to generate content
                    </Link>
                </div>
            </div>
        );
    }

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
    };

    const ShareActions = ({ content }) => {
        const shareTo = (platform) => {
            navigator.clipboard.writeText(content);
            toast.success(`Content copied! Opening ${platform}...`);

            let url = '';
            switch (platform) {
                case 'Instagram': url = 'https://www.instagram.com/'; break;
                case 'Twitter': url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(content.substring(0, 280))}`; break;
                case 'LinkedIn': url = 'https://www.linkedin.com/feed/'; break;
                case 'YouTube': url = 'https://studio.youtube.com/'; break;
                default: return;
            }
            window.open(url, '_blank');
        };

        return (
            <div className="flex gap-2">
                <button onClick={() => shareTo('Instagram')} className="p-2 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100 transition-colors" title="Share to Instagram"><Instagram size={18} /></button>
                <button onClick={() => shareTo('Twitter')} className="p-2 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors" title="Share to Twitter"><Twitter size={18} /></button>
                <button onClick={() => shareTo('LinkedIn')} className="p-2 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors" title="Share to LinkedIn"><Linkedin size={18} /></button>
                <button onClick={() => shareTo('YouTube')} className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors" title="Share to YouTube"><Youtube size={18} /></button>
            </div>
        );
    };

    return (
        <div className="min-h-screen text-slate-200 p-6 md:p-12 font-sans">
            <div className="max-w-6xl mx-auto">
                <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-slate-700 pb-4">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Film className="text-purple-500" /> Video Script ({result.video_script.duration})
                        </h2>
                        <div className="flex items-center gap-2">
                            <ShareActions content={JSON.stringify(result.video_script, null, 2)} />
                            <button
                                onClick={() => copyToClipboard(JSON.stringify(result.video_script, null, 2))}
                                className="text-slate-400 hover:text-purple-400 transition-colors p-2"
                                title="Copy JSON"
                            >
                                <Copy className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="grid gap-6">
                        {result.video_script.scenes.map((scene, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-cyan-500/50 transition-colors"
                            >
                                <div className="flex justify-between mb-4">
                                    <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm font-bold border border-purple-500/30">
                                        Scene {scene.scene} • {scene.duration}
                                    </span>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-sm uppercase tracking-wider text-slate-500 mb-2 font-bold">Visual</h4>
                                        <p className="text-slate-300 leading-relaxed">{scene.visual_prompt}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm uppercase tracking-wider text-slate-500 mb-2 font-bold">Voiceover</h4>
                                        <p className="text-cyan-400 font-medium italic">"{scene.voiceover}"</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoScript;
