import { FileText, Sparkles } from 'lucide-react';
import React, { useState } from 'react'
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { toast } from 'react-toastify';
import ReactMarkdown from 'react-markdown';



axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ReviewResume = () => {


  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = await getToken();

      const formData = new FormData();
      formData.append('resume', input);


      const { data } = await axios.post(
        '/api/ai/resume-review',
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
        toast.success('Resume reviewed successfully!');
      } else {
        toast.error(data.message || 'Failed to process resume');
      }
    } catch (error) {
      console.error('Error reviewing resume:', error);
      toast.error(error.response?.data?.message || 'An error occurred while processing your resume');
    } finally {
      setLoading(false);
    }
  }



  return (
    <div className='h-full overflow-y-scroll flex p-6 items-start flex-wrap gap-4 text-slate-200'>
      {/* left col */}
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg bg-slate-800 p-4 rounded-lg border border-slate-700'>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#00DA83]' />
          <h1 className='text-xl font-semibold text-white'>Resume Review</h1>
        </div>
        <p className='mt-6 text-sm font-medium text-slate-300'>Upload Resume</p>
        <input onChange={(e) => setInput(e.target.files[0])} type="file" accept='application/pdf' className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-slate-600 bg-slate-900 text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-500/20 file:text-green-400 hover:file:bg-green-500/30'
          required />

        <p className='text-xs text-slate-500 font-light mt-1'>Supports PDF resume only</p>

        <button className=' w-full justify-center flex items-center gap-2 bg-gradient-to-r from-[#00DA83] to-[#009BB3] text-white px-4 py-2 mt-6 
        text-sm rounded-lg cursor-pointer hover:shadow-lg hover:shadow-green-500/20 transition-all'>
          {
            loading ? <span className='w-4 h-4 my-1 rounded-b-full boarder-t-transparent animate-spin'></span>
              : <FileText className='w-5' />
          }
          Review Resume


        </button>
      </form>
      {/* Right col */}
      <div className='w-full max-w-lg p-4 bg-slate-800 rounded-lg flex flex-col border border-slate-700 min-h-96 max-h-[600px]'>
        <div className='flex items-center gap-3'>
          <FileText className='w-5 h-5 text-[#00DA83]' />
          <h1 className='text-xl font-semibold text-white'>Analysis Results</h1>
        </div>
        {
          !content ? (
            <div className='flex flex-1 justify-center items-center min-h-[300px]'>
              <div className='text-sm flex flex-col items-center gap-5 text-slate-500'>
                <FileText className='w-9 h-9 opacity-50' />
                <p>Upload a resume and click "Review Resume" to get started</p>

              </div>

            </div>
          ) :
            (
              <div className='mt-3 h-full overflow-y-scroll text-sm text-slate-300'>
                <div className='reset-tw prose prose-invert max-w-none'>
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
              </div>
            )

        }



      </div>
    </div>
  )
}

export default ReviewResume