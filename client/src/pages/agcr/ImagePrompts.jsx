import React from 'react';
import { motion } from 'framer-motion';
import { Image, Copy } from 'lucide-react';
import { useAGCR } from '../../context/AGCRContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const ImagePrompts = () => {
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

    return (
        <div className="min-h-screen text-slate-200 p-6 md:p-12 font-sans">
            <div className="max-w-6xl mx-auto">
                <div className="space-y-8">
                    {['thumbnails', 'banners', 'ads'].map((category) => (
                        <div key={category}>
                            <h3 className="text-xl font-bold text-white mb-4 capitalize flex items-center gap-2">
                                <Image className="text-purple-500" /> {category}
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {result.image_prompts[category].map((prompt, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 group hover:border-purple-500/50 transition-all"
                                    >
                                        <p className="text-slate-300 text-sm mb-3">{prompt}</p>
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => copyToClipboard(prompt)}
                                                className="text-slate-400 hover:text-purple-400 transition-colors flex items-center gap-1 text-xs font-medium"
                                            >
                                                <Copy className="w-3 h-3" /> Copy
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ImagePrompts;
