import { Scissors, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { toast } from 'react-toastify';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveObject = () => {

  const [input, setInput] = useState('');
  const [object, setObject] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!input) {
      return toast.error('Please select an image');
    }
    if (!object) {
      return toast.error('Please specify an object to remove');
    }

    try {
      setLoading(true);
      const token = await getToken();

      const formData = new FormData();
      formData.append('image', input);
      formData.append('object', object);

      if (object.split(' ').length > 1) {
        return toast.error('Please enter only one object name');
      }

      const { data } = await axios.post(
        '/api/ai/remove-image-object',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (data.success) {
        setContent(data.content);
        toast.success('Object removed successfully!');
      } else {
        toast.error(data.message || 'Failed to process image');
      }
    } catch (error) {
      console.error('Error removing object:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        toast.error(error.response.data?.message || 'Server error occurred');
      } else if (error.request) {
        // The request was made but no response was received
        toast.error('No response from server. Please try again.');
      } else {
        // Something happened in setting up the request
        toast.error('Error setting up the request');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='h-full overflow-y-scroll flex p-6 items-start flex-wrap gap-4 text-slate-200'>
      {/* left col */}
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg bg-slate-800 p-4 rounded-lg border border-slate-700'>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold text-white'>Remove Object</h1>
        </div>
        <p className='mt-6 text-sm font-medium text-slate-300'>Upload Image</p>
        <input onChange={(e) => setInput(e.target.files[0])} type="file" accept='image/*' className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-slate-600 bg-slate-900 text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500/20 file:text-blue-400 hover:file:bg-blue-500/30'
          required />
        <p className='mt-6 text-sm font-medium text-slate-300'>Describe object name to remove</p>
        <textarea onChange={(e) => setObject(e.target.value)} value={object} rows={4} className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-slate-600 bg-slate-900 text-slate-200 placeholder-slate-500'
          placeholder='e.g.,watch or spoon, Only single object name' required />
        <button disabled={loading} className=' w-full justify-center flex items-center gap-2 bg-gradient-to-r from-[#417DF6] to-[#8E37EB] text-white px-4 py-2 mt-6
      text-sm rounded-lg cursor-pointer hover:shadow-lg hover:shadow-blue-500/20 transition-all'>
          {loading ? <span className='w-4 h-4 my-1 rounded-b-full boarder-t-transparent animate-spin'></span>
            : <Scissors className='w-5' />
          }
          Remove Object
        </button>
      </form>
      {/* Right col */}
      <div className='w-full max-w-lg p-4 bg-slate-800 rounded-lg flex flex-col border border-slate-700 min-h-96 '>
        <div className='flex items-center gap-3'>
          <Scissors className='w-5 h-5 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold text-white'>Processed Image</h1>
        </div>
        {
          !content ? (
            <div className='flex flex-1 justify-center items-center min-h-[300px]'>
              <div className='text-sm flex flex-col items-center gap-5 text-slate-500'>
                <Scissors className='w-9 h-9 opacity-50' />
                <p>Upload an image and click "Remove Object" to get started</p>
              </div>
            </div>
          ) : (
            <img src={content} alt="Processed content" className='mt-3 w-full h-full rounded-md shadow-lg' />
          )
        }
      </div>
    </div>
  );
};

export default RemoveObject