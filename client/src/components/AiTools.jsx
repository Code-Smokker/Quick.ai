import React from 'react';
import { AiToolsData } from '../assets/assets.js';
import { useNavigate } from 'react-router-dom';
// import { useUser } from '@clerk/clerk-react'; // Uncomment if using Clerk

const AITools = () => {
  const navigate = useNavigate();
  // const { user } = useUser();

  return (
    <div className='px-4 sm:px-10 lg:px-20 xl:px-32 my-12 sm:my-24'>
      {/* Header Section */}
      <div className='text-center mb-16'>
        <h2 className='text-slate-200 text-3xl sm:text-[48px] font-semibold mb-4'>
          Powerful AI Tools
        </h2>
        <p className='text-slate-400 max-w-lg mx-auto text-base sm:text-lg'>
          Everything you need to create, enhance, and optimize your content with cutting-edge AI technology.
        </p>
      </div>

      {/* Grid Section */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center'>
        {AiToolsData.map((tools, index) => (
          <div
            key={index}
            onClick={() => navigate(tools.path)}
            className='w-full max-w-sm p-6 sm:p-8 rounded-2xl bg-slate-900/50
              shadow-lg border border-slate-800 hover:-translate-y-2 transition-all 
              duration-300 cursor-pointer group hover:border-purple-500/50 hover:shadow-purple-500/20'
          >
            {/* Icon Box with Gradient Background */}
            <div
              className='w-14 h-14 flex items-center justify-center rounded-xl mb-6 shadow-inner'
              style={{
                background: `linear-gradient(135deg, ${tools.bg.from}, ${tools.bg.to})`
              }}
            >
              <tools.Icon className='w-7 h-7 text-white' />
            </div>

            {/* Content */}
            <h3 className='mb-3 text-xl font-semibold text-white group-hover:text-purple-400 transition-colors'>
              {tools.title}
            </h3>
            <p className='text-slate-400 text-sm leading-relaxed'>
              {tools.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AITools;