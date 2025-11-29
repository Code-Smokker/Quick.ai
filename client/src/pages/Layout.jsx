
import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useClerk, useUser } from '@clerk/clerk-react';
import { Menu, X, Share2, LogOut, UserCog, Instagram, Twitter, Linkedin, Youtube, Copy, Loader2 } from 'lucide-react';
import AIBot from '../components/AIBot';
import Sidebar from '../components/Sidebar'









const Layout = () => {

  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  const shareTo = (platform) => {
    const url = window.location.origin;
    const text = "Check out Quik.ai - The ultimate AI content creation tool!";

    if (platform === 'Copy') {
      navigator.clipboard.writeText(url);
      alert('App link copied to clipboard!');
      setShowShareOptions(false);
      return;
    }

    let shareUrl = '';
    switch (platform) {
      case 'Instagram': shareUrl = 'https://www.instagram.com/'; break;
      case 'Twitter': shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`; break;
      case 'LinkedIn': shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`; break;
      case 'YouTube': shareUrl = 'https://studio.youtube.com/'; break;
      default: return;
    }
    window.open(shareUrl, '_blank');
    setShowShareOptions(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  return user ? (
    <div className='flex flex-col h-screen justify-start items-start'>
      <nav className='w-full px-8 flex items-center justify-between h-16 bg-slate-900 z-30 relative'>
        <div className="flex items-center gap-4">
          {
            sidebar ? <X onClick={() => setSidebar(false)} className='w-6 h-6 text-slate-300 sm:hidden cursor-pointer' />
              : <Menu onClick={() => setSidebar(true)} className='w-6 h-6 text-slate-300 sm:hidden cursor-pointer' />
          }
          <img src={assets.logo} alt="Quick.ai Logo" className='w-32 sm:w-44 cursor-pointer brightness-0 invert' onClick={() => navigate('/')} />
        </div>

        <div className="flex items-center gap-4">
          {/* Share Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowShareOptions(!showShareOptions)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <Share2 className="w-5 h-5 text-cyan-400" />
              <span className="hidden md:inline font-medium">Share</span>
            </button>

            {showShareOptions && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 rounded-xl shadow-xl border border-slate-800 p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="grid grid-cols-5 gap-1">
                  <button onClick={() => shareTo('Instagram')} className="p-2 rounded-lg hover:bg-pink-900/30 text-pink-400 transition-colors flex justify-center" title="Instagram"><Instagram size={18} /></button>
                  <button onClick={() => shareTo('Twitter')} className="p-2 rounded-lg hover:bg-cyan-900/30 text-cyan-400 transition-colors flex justify-center" title="Twitter"><Twitter size={18} /></button>
                  <button onClick={() => shareTo('LinkedIn')} className="p-2 rounded-lg hover:bg-blue-900/30 text-blue-400 transition-colors flex justify-center" title="LinkedIn"><Linkedin size={18} /></button>
                  <button onClick={() => shareTo('YouTube')} className="p-2 rounded-lg hover:bg-red-900/30 text-red-400 transition-colors flex justify-center" title="YouTube"><Youtube size={18} /></button>
                  <button onClick={() => shareTo('Copy')} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 transition-colors flex justify-center" title="Copy Link"><Copy size={18} /></button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Manage */}
          <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
            <button
              onClick={() => openUserProfile()}
              className="flex items-center gap-2 group"
              title="Manage Profile"
            >
              <div className="relative">
                <img
                  src={user?.imageUrl}
                  className="w-9 h-9 rounded-full border-2 border-slate-700 shadow-sm group-hover:border-purple-500 transition-all"
                  alt={user?.fullName}
                />
                <div className="absolute -bottom-0.5 -right-0.5 bg-purple-600 rounded-full p-0.5 border border-slate-900">
                  <UserCog className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-slate-200 group-hover:text-purple-400 transition-colors">{user?.firstName}</p>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Premium</p>
              </div>
            </button>

            <button
              onClick={handleSignOut}
              className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-900/20 rounded-full transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>
      <div className='flex-1 w-full flex h-[calc(100vh-64px)] bg-slate-950'>
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
        <div className='flex-1 overflow-y-auto p-8'>
          <Outlet />
        </div>
      </div>
      <AIBot />
    </div>
  ) : (
    <div className='flex items-center justify-center h-screen'>
      <Loader2 className='w-8 h-8 animate-spin text-purple-600' />
    </div>
  );
};

export default Layout