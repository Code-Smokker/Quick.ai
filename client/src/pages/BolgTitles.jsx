import { Hash, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { toast } from 'react-toastify';

// Set base URL for axios
// axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BolgTitles = () => {
  const { getToken } = useAuth();
  const blogCategories = ['General', 'Business', 'Technology', 'Health', 'Travel', 'Food', 'Lifestyle'];

  const [selectedCategory, setSelectedCategory] = useState('General');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [titles, setTitles] = useState([]);



  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!input.trim()) {
      toast.error('Please enter a keyword');
      return;
    }

    try {
      setLoading(true);
      const prompt = `Generate 5 engaging blog title ideas about ${input} in the ${selectedCategory} category. Make them catchy and SEO-friendly.`;
      const token = await getToken();

      const { data } = await axios.post(
        '/api/ai/generate-blog-titles',
        { prompt },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (data.success) {
        // API may return a single string or an array. Normalise to array.
        const normalised = Array.isArray(data.content)
          ? data.content
          : String(data.content)
            .split(/\r?\n|,|\|/)
            .map(t => t.trim())
            .filter(Boolean);
        setTitles(normalised);
      } else {
        toast.error(data.message || 'Failed to generate titles');
      }
    } catch (error) {
      console.error('Error generating titles:', error);
      toast.error(error.response?.data?.message || 'An error occurred while generating titles');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='h-full overflow-y-scroll flex p-6 items-start flex-wrap gap-4 text-slate-200'>
      {/* Left column - Form */}
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg bg-slate-800 p-4 rounded-lg border border-slate-700'>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#8E37EB]' />
          <h1 className='text-xl font-semibold text-white'>AI Title Generator</h1>
        </div>

        <p className='mt-6 text-sm font-medium text-slate-300'>Keyword</p>
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-slate-600 bg-slate-900 text-slate-200 placeholder-slate-500'
          placeholder='The future of artificial intelligence is...'
          required
          disabled={loading}
        />

        <p className='mt-4 text-sm font-medium text-slate-300'>Category</p>
        <div className='mt-3 flex gap-3 flex-wrap sm:max-w-9/11'>
          {blogCategories.map((item) => (
            <span
              onClick={() => !loading && setSelectedCategory(item)}
              key={item}
              className={`text-sm px-4 py-1 border rounded-full cursor-pointer transition-colors
                ${selectedCategory === item ? 'bg-purple-500/20 text-purple-400 border-purple-500/50' : 'text-slate-400 border-slate-600 hover:bg-slate-700'}
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {item}
            </span>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading || !input.trim()}
          className={`w-full justify-center flex items-center gap-2 bg-gradient-to-r from-[#C341F6] to-[#8E37EB] text-white px-4 py-2 mt-6 
          text-sm rounded-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all ${loading || !input.trim() ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {loading ? (
            <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent border-white animate-spin' />
          ) : (
            <Hash className='w-5' />
          )}
          Generate Titles
        </button>
      </form>

      {/* Right column - Results */}
      <div className='w-full max-w-lg p-4 bg-slate-800 rounded-lg flex flex-col border border-slate-700 min-h-96'>
        <div className='flex items-center gap-3'>
          <Hash className='w-5 h-5 text-[#8E37EB]' />
          <h1 className='text-xl font-semibold text-white'>Generated Titles</h1>
        </div>

        {loading ? (
          <div className='flex flex-1 justify-center items-center'>
            <div className='animate-pulse text-slate-400'>Generating titles...</div>
          </div>
        ) : titles.length > 0 ? (
          <div className='mt-4 space-y-3'>
            {titles.map((title, index) => (
              <div
                key={index}
                className='p-3 border border-slate-700 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer bg-slate-900/50'
              >
                <h3 className='text-sm font-medium text-slate-200'>{title.replace(/^\d+\.\s*/, '')}</h3>
              </div>
            ))}
          </div>
        ) : (
          <div className='flex flex-1 justify-center items-center min-h-[300px]'>
            <div className='text-sm flex flex-col items-center gap-5 text-slate-500'>
              <Hash className='w-9 h-9 opacity-50' />
              <p>Enter a keyword and click "Generate Titles" to get started</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BolgTitles;