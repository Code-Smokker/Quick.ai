// In Hero.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import gradientBackground from '../assets/gradientBackground.png';
import { assets } from '../assets/assets';
import { useClerk, useUser } from '@clerk/clerk-react';

const Hero = () => {
    const navigate = useNavigate();
    const { openSignIn } = useClerk();
    const { isSignedIn, isLoaded } = useUser();

    const handleGetStarted = () => {
        if (isSignedIn) {
            navigate('/ai/dashboard');
        } else {
            openSignIn({
                afterSignInUrl: '/ai/dashboard',
                afterSignUpUrl: '/ai/dashboard'
            });
        }
    };

    if (!isLoaded) {
        return null; // or a loading spinner
    }

    return (
        <div
            className="px-4 sm:px-20 xl:px-32 relative inline-flex flex-col w-full justify-center bg-cover bg-no-repeat min-h-screen bg-slate-950"
        // style={{ backgroundImage: `url(${gradientBackground})` }} // Removed light gradient background
        >
            <div className='text-center mb-6 pt-20'>
                <h1 className='text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl font-semibold mx-auto leading-[1.2] text-white'>
                    Create amazing content <br />
                    with <span className='bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500'>AI tools</span>
                </h1>
                <p className='mt-4 max-w-xs sm:max-w-lg 2xl:max-w-xl m-auto max-sm:text-xs text-slate-400'>
                    Transform your content creation with our suite of premium AI tools. Write articles, generate images, and enhance your workflow.
                </p>
            </div>

            <div className='flex flex-wrap justify-center gap-4 text-sm max-sm:text-xs'>
                <button
                    onClick={handleGetStarted}
                    className='bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-10 py-3 rounded-lg hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg shadow-purple-500/20'
                >
                    {isSignedIn ? 'Go to Dashboard' : 'Start Creating Now'}
                </button>
            </div>
            <div className='flex items-center gap-4 mt-8 mx-auto text-slate-500'>
                <img src={assets.user_group} alt="" className='h-8 opacity-70' />
                Trusted by 10k+ people
            </div>
        </div>
    );
};

export default Hero;