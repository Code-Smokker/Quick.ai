import React from 'react';
import { motion } from 'framer-motion';
import { Copy } from 'lucide-react';
import { useAGCR } from '../../context/AGCRContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const TitlesSEO = () => {
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
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid md:grid-cols-2 gap-8"
                >
                    <div className="space-y-6">
                        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-cyan-500">#</span> Title
                            </h3>
                            <div className="flex items-start gap-3 group">
                                <span className="text-slate-200 text-lg font-medium">{result.title}</span>
                                <button
                                    onClick={() => copyToClipboard(result.title)}
                                    className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-cyan-400 transition-all ml-auto"
                                >
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                            <h3 className="text-xl font-bold text-white mb-4">Description</h3>
                            <p className="text-slate-400 text-sm whitespace-pre-wrap">{result.description}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                            <h3 className="text-xl font-bold text-white mb-4">SEO & Hashtags</h3>

                            <div className="mb-6">
                                <h4 className="text-sm uppercase tracking-wider text-slate-500 mb-2 font-bold">Keywords</h4>
                                <div className="flex flex-wrap gap-2">
                                    {result.keywords?.length > 0 ? (
                                        result.keywords.map((kw, i) => (
                                            <span key={i} className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs border border-slate-600">
                                                {kw}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-slate-500 text-sm italic">No keywords generated</span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm uppercase tracking-wider text-slate-500 mb-2 font-bold">Hashtags</h4>
                                <div className="flex flex-wrap gap-2">
                                    {result.hashtags?.length > 0 ? (
                                        result.hashtags.map((tag, i) => (
                                            <span key={i} className="text-purple-400 text-sm">
                                                {tag}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-slate-500 text-sm italic">No hashtags generated</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default TitlesSEO;
