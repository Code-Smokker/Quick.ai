import React, { useState } from 'react';
import { Sparkles, Image } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { toast } from 'react-toastify';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const GenerateImages = () => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('Realistic Style');
  const [input, setInput] = useState('');
  const [publish, setPublish] = useState(false);

  const imageStyles = [
    'Realistic Style',
    'Ghibli Style',
    '3D Style',
    'Anime Style',
    'Cartoon Style',
    'Fantasy Style',
    'Portrait Style'
  ];

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!input.trim()) {
      toast.error('Please enter a description for the image');
      return;
    }

    try {
      setLoading(true);
      const token = await getToken();
      const prompt = `Generate an image of ${input} in the style ${selectedStyle}`;

      const { data } = await axios.post(
        '/api/ai/generate-image',
        { prompt, publish },
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (data.success) {
        setImageUrl(data.content); 
        toast.success('Image generated successfully!');
      } else {
        toast.error(data.message || 'Failed to generate image');
      }
    } catch (error) {
      console.error('Error generating image:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data
        }
      });
      
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         error.message || 
                         'Failed to generate image. Please try again.';
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='h-full overflow-y-scroll flex p-6 items-start flex-wrap gap-4 text-slate-700'>
      {/* Left column - Form */}
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg bg-white p-4 rounded-lg border border-gray-200'>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#00AD25]' />
          <h1 className='text-xl font-semibold'>AI Image Generator</h1>
        </div>

        <p className='mt-6 text-sm font-medium'>Describe Your Image</p>
        <textarea
          onChange={(e) => setInput(e.target.value)}
          value={input}
          rows={4}
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300'
          placeholder='Describe what you want to see in the image ...'
          required
          disabled={loading}
        />

        <p className='mt-4 text-sm font-medium'>Style</p>
        <div className='mt-3 flex gap-3 flex-wrap sm:max-w-9/11'>
          {imageStyles.map((item) => (
            <span
              onClick={() => !loading && setSelectedStyle(item)}
              key={item}
              className={`text-sm px-4 py-1 border rounded-full cursor-pointer
                ${selectedStyle === item ? 'bg-green-50 text-green-700' : 'text-gray-500 border-gray-300'}
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {item}
            </span>
          ))}
        </div>

        <div className='my-6 items-center flex gap-2'>
          <label className='relative cursor-pointer'>
          <input
              type='checkbox'
              onChange={(e) => setPublish(e.target.checked)}
              checked={publish}
              disabled={loading}
              className='sr-only peer'
            />
            <div className='w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition'></div>
            <span className='absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-4'></span>
            </label>
          <p className='text-sm'>Make this image Publish</p>
        </div>

        <button
          type='submit'
          disabled={loading}
          className='w-full justify-center flex items-center gap-2 bg-gradient-to-r from-[#00AD25] to-[#00C72C] text-white px-4 py-2 mt-2 
          text-sm rounded-lg cursor-pointer'
        >
          {loading ? (
            <span className='w-4 h-4 my-1 border-2 rounded-b-full border-t-transparent animate-spin'></span>
          ) : (
            <Image className='w-5' />
          )}
          Generate Image
        </button>
      </form>

      {/* Right column - Preview */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>
        <div className='flex items-center gap-3'>
          <Image className='w-5 h-5 text-[#00AD25]' />
          <h1 className='text-xl font-semibold'>Generated Image</h1>
        </div>

        { !imageUrl ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
              <Image className='w-9 h-9' />
              <p>Enter a topic and click "Generate Image" to get started</p>
            </div>
          </div>
        ) : (
          <div className='mt-3 h-full'>
            <img src={imageUrl} alt='image' className='w-full h-full rounded-md' />
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateImages;