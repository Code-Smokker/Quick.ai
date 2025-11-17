import React from 'react';
import { AiToolsData } from '../assets/assets.js';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';


const AITools = () => {

    const navigate = useNavigate();
    const {user} = useUser();

  return (
    <div className='px-4 sm:px-20 xl:px-32 my-24' >
      <div className='text-center'>
        <h2 className='text-slate-700 text-[48px] font-semibold'>Powerful Al Tools</h2>
        <p className='text-gray-500 max-w-lg mx-auto'>Everything you need to create, enhance, and optimize your content with cutting-edge Al technology.</p>
      </div>

      <div className='flex flex-wrap mt-10 justify-center'>
        {AiToolsData.map((tools, index) =>(
            <div key={index} className='p-8 m-4 max-w-xs rounded-lg bg-[#FDFDFE]
            shadow-lg border border-gray-200 hover:translate-y-1 transition-all 
            duration-300 cursor-pointer' onClick={()=> navigate(tools.path)}>
                <tools.Icon  className='w-12 h-12 p-3 text-white rounded-xl ' style={{background: `linear-gradient(to bottom, ${tools.bg.from},
                ${tools.bg.to})`
                }}/>
                <h3 className='mt-6 mb-3 text-lg font-semibold '>{tools.title}</h3>
                <p className='text-gray-500 text-sm max-w-[95%]'>{tools.description}</p>
            </div>
        ))}

      </div>
    </div>
  )
}

export default AITools