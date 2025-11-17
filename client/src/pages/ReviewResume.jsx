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
    <div className='h-full overflow-y-scroll flex p-6 items-start flex-wrap gap-4 text-slate-700'>
      {/* left col */}
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg bg-white p-4 rounded-lg border border-gray-200'> 
        <div className='flex items-center gap-3'>
          <Sparkles  className='w-6 text-[#00DA83]'/>
          <h1 className='text-xl font-semibold'>Resume Review</h1>
        </div>
        <p className='mt-6 text-sm font-medium'>Upload Resume</p>
        <input onChange={(e)=> setInput(e.target.files[0])} type="file" accept='application/pdf' className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600' 
         required/>
       
        <p className='text-xs text-gray-500 font-light mt-1'>Supports PDF resume only</p>
        
        <button className=' w-full justify-center flex items-center gap-2 bg-gradient-to-r from-[#00DA83] to-[#009BB3] text-white px-4 py-2 mt-6 
        text-sm rounded-lg cursor-pointer'>
          {
            loading ? <span className='w-4 h-4 my-1 rounded-b-full boarder-t-transparent animate-spin'></span>
            : <FileText className='w-5'/>
          }
          Review Resume
          
          
        </button>
      </form>
       {/* Right col */}
       <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]'>
        <div className='flex items-center gap-3'>
          <FileText  className='w-5 h-5 text-[#00DA83]'/>
          <h1 className='text-xl font-semibold'>Analysis Results</h1>
        </div>
        {
          !content ? (
            <div className='flex flex-1 justify-center items-center min-h-[300px]'>
          <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
            <FileText  className='w-9 h-9'/>
            <p>Upload a resume and click "Review Resume" to get started</p>

          </div>

        </div>
          ): 
          (
            <div className='mt-3 h-full overflow-y-scroll text-sm text-slate-600'>
              <div className='reset-tw'>
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