import React, { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Download, Loader2, Image as ImageIcon, Linkedin, Instagram, Twitter, Layout } from 'lucide-react';

const BannerGenerator = () => {
    const { getToken } = useAuth();
    const [topic, setTopic] = useState('');
    const [platform, setPlatform] = useState('LinkedIn Post');
    const [style, setStyle] = useState('Professional');
    const [loading, setLoading] = useState(false);
    const [generatedImage, setGeneratedImage] = useState(null);

    const styles = ['Professional', 'Minimalist', 'Creative', 'Corporate', 'Modern', 'Abstract', 'Geometric', 'Aesthetic', 'Bold'];

    const platforms = [
        { id: 'LinkedIn Post', label: 'LinkedIn Post', icon: Linkedin, color: 'blue' },
        { id: 'LinkedIn Banner', label: 'LinkedIn Banner', icon: Layout, color: 'blue' },
        { id: 'Instagram Post', label: 'Instagram Post', icon: Instagram, color: 'pink' },
        { id: 'Twitter Post', label: 'Twitter Post', icon: Twitter, color: 'sky' },
        { id: 'Twitter Banner', label: 'Twitter Banner', icon: Layout, color: 'sky' },
    ];

    const getAspectRatioClass = () => {
        if (platform.includes('Banner')) {
            return platform.includes('LinkedIn') ? 'aspect-[4/1]' : 'aspect-[3/1]';
        }
        if (platform.includes('Twitter Post')) {
            return 'aspect-video'; // 16:9
        }
        return 'aspect-square'; // Instagram & LinkedIn Post (defaulting to square for simplicity)
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!topic) {
            toast.error('Please enter a topic');
            return;
        }

        setLoading(true);
        setGeneratedImage(null);

        try {
            const token = await getToken();
            const response = await axios.post('/api/ai/generate-banner', {
                topic,
                platform,
                style
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setGeneratedImage(response.data.content);
                toast.success('Image generated successfully!');
            } else {
                toast.error(response.data.message || 'Failed to generate image');
            }
        } catch (error) {
            console.error('Error generating image:', error);
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!generatedImage) return;
        const link = document.createElement('a');
        link.href = generatedImage;
        link.download = `${platform.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="p-6 md:p-10 min-h-screen text-slate-200">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Social Media Images</h1>
                    <p className="text-slate-400">Create professional posts and banners for LinkedIn, Instagram, and Twitter.</p>
                </div>

                <div className="grid md:grid-cols-12 gap-8">
                    {/* Input Section */}
                    <div className="md:col-span-4 space-y-6">
                        <div className="bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-700">
                            <form onSubmit={handleGenerate} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Topic / Content</label>
                                    <textarea
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        placeholder="e.g., AI in Marketing, New Product Launch, Personal Branding..."
                                        className="w-full p-3 rounded-lg border border-slate-600 bg-slate-900 text-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none h-32 text-sm placeholder-slate-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Platform & Type</label>
                                    <div className="grid grid-cols-1 gap-2">
                                        {platforms.map((p) => (
                                            <button
                                                key={p.id}
                                                type="button"
                                                onClick={() => setPlatform(p.id)}
                                                className={`p-3 rounded-lg border flex items-center gap-3 transition-all text-left ${platform === p.id
                                                    ? `bg-${p.color}-500/20 border-${p.color}-500 text-${p.color}-400 ring-1 ring-${p.color}-500`
                                                    : 'border-slate-600 text-slate-400 hover:bg-slate-700'
                                                    }`}
                                            >
                                                <p.icon size={18} />
                                                <span className="text-sm font-medium">{p.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Style</label>
                                    <select
                                        value={style}
                                        onChange={(e) => setStyle(e.target.value)}
                                        className="w-full p-2.5 rounded-lg border border-slate-600 focus:ring-2 focus:ring-purple-500 outline-none text-sm bg-slate-900 text-slate-200"
                                    >
                                        {styles.map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !topic}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <ImageIcon className="w-5 h-5" />
                                            Generate Image
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Result Section */}
                    <div className="md:col-span-8">
                        <div className="bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-700 min-h-[600px] flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-semibold text-white">Preview</h2>
                                {generatedImage && (
                                    <button
                                        onClick={handleDownload}
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                                    >
                                        <Download size={16} />
                                        Download
                                    </button>
                                )}
                            </div>

                            <div className="flex-1 flex items-center justify-center bg-slate-900/50 rounded-lg border-2 border-dashed border-slate-700 overflow-hidden relative group p-8">
                                {loading ? (
                                    <div className="text-center">
                                        <Loader2 className="w-10 h-10 text-purple-500 animate-spin mx-auto mb-3" />
                                        <p className="text-slate-400 font-medium">Creating your masterpiece...</p>
                                    </div>
                                ) : generatedImage ? (
                                    <div className="relative w-full h-full flex items-center justify-center">
                                        <img
                                            src={generatedImage}
                                            alt="Generated Image"
                                            className={`max-w-full max-h-full object-contain shadow-2xl rounded-md ${getAspectRatioClass()}`}
                                        />
                                    </div>
                                ) : (
                                    <div className="text-center text-slate-500">
                                        <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
                                        <p className="text-lg font-medium text-slate-400">Ready to Create</p>
                                        <p className="text-sm mt-1">Select a platform and style to generate your social media image</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BannerGenerator;
