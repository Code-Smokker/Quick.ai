import React from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';

const Navbar = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const { openSignIn } = useClerk();

    return (
        // CHANGED: Background color set to a light purple tint (bg-purple-50) with 80% opacity.
        <div className='fixed z-50 w-full bg-slate-950/80 backdrop-blur-2xl flex justify-between items-center py-3 px-4 sm:px-20 xl:px-32 border-b border-slate-800'>
            <NavLink to="/" className='flex items-center w-32 sm:w-44'>
                <img
                    src={assets.logo}
                    alt="logo"
                    className='w-full h-auto'
                />
            </NavLink>

            {user ? (
                <UserButton afterSignOutUrl="/" />
            ) : (
                <button
                    // Assuming 'bg-primary' maps to your brand's purple/cyan color
                    className="flex items-center gap-2 rounded-full text-sm cursor-pointer bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-10 py-2.5 hover:shadow-lg hover:shadow-purple-500/20 transition-all"
                    onClick={() => openSignIn()}
                >
                    Get Started <ArrowRight className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}

export default Navbar;