import React from 'react';
import { motion } from 'framer-motion';
import { Copy, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';
import { useAGCR } from '../../context/AGCRContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const AdCopy = () => {
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
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button onClick={() => shareTo('Instagram')} className="p-1.5 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100 transition-colors" title="Share to Instagram"><Instagram size={14} /></button>
                <button onClick={() => shareTo('Twitter')} className="p-1.5 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors" title="Share to Twitter"><Twitter size={14} /></button>
                <button onClick={() => shareTo('LinkedIn')} className="p-1.5 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors" title="Share to LinkedIn"><Linkedin size={14} /></button>
                <button onClick={() => shareTo('YouTube')} className="p-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors" title="Share to YouTube"><Youtube size={14} /></button>
            </div>
        );
    };

    return (
        <div className="min-h-screen text-slate-200 p-6 md:p-12 font-sans">
            <div className="max-w-6xl mx-auto">
                <div className="space-y-8">
                    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-cyan-500">Headlines</h3>
                        </div>
                        <div className="space-y-3">
                            {result.ad_copy.headlines.map((headline, i) => (
                                <div key={i} className="flex items-center justify-between bg-slate-800 p-3 rounded border border-slate-700 group hover:border-cyan-500/50 transition-colors">
                                    <p className="font-medium text-slate-200 flex-1 mr-4">{headline}</p>
                                    <div className="flex items-center gap-2">
                                        <ShareActions content={headline} />
                                        <button onClick={() => copyToClipboard(headline)} className="text-slate-400 hover:text-cyan-400 p-1.5 hover:bg-slate-700 rounded-full transition-colors" title="Copy">
                                            <Copy className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-purple-500">Primary Text</h3>
                        </div>
                        <div className="space-y-4">
                            {result.ad_copy.primary_text.map((text, i) => (
                                <div key={i} className="bg-slate-800 p-4 rounded border border-slate-700 relative group hover:border-purple-500/50 transition-colors">
                                    <p className="text-slate-300 text-sm leading-relaxed pr-8">{text}</p>
                                    <div className="absolute top-2 right-2 flex items-center gap-2">
                                        <ShareActions content={text} />
                                        <button
                                            onClick={() => copyToClipboard(text)}
                                            className="text-slate-400 hover:text-purple-400 p-1.5 hover:bg-slate-700 rounded-full transition-colors"
                                            title="Copy"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdCopy;
