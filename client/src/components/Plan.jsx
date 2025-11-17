import React from 'react'
import { PricingTable } from '@clerk/clerk-react'

const Plan = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full z-20 my-30">
      <div className='text-center'>
        <h2 className='text-slate-700 text-[42px] font-semibold'>Choose Your Plan</h2>
        <p className='text-gray-500 max-w-lg mx-auto'>Start for free and scale up as you grow. Find the perfect plan for your content creation needs.</p>
      </div>
      <div className='mt-14 w-full flex justify-center max-sm:mx-8'>
        <div className="max-w-2xl w-full flex justify-center">
          <PricingTable />
        </div>
      </div>
    </div>
  )
}

export default Plan