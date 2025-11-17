import React from 'react';
import { useClerk, useUser } from '@clerk/clerk-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
    FileText, 
    Image as ImageIcon, 
    LogOut, 
    House, 
    FileEdit,
    Hash, 
    Eraser, 
    Scissors,
    User,
    Settings,
    UserCog
} from 'lucide-react';
import { Protect } from '@clerk/clerk-react';

const Sidebar = ({ sidebar, setSidebar }) => {
    const { user } = useUser();
    const { signOut, openUserProfile } = useClerk();
    const navigate = useNavigate();

    const navItems = [
        { to: '/ai/dashboard', label: 'Dashboard', icon: House },
        { to: '/ai/write-article', label: 'Write Article', icon: FileEdit },
        { to: '/ai/blog-titles', label: 'Blog Titles', icon: Hash },
        { to: '/ai/generate-images', label: 'Generate Images', icon: ImageIcon },,
        { to: '/ai/remove-object', label: 'Remove Object', icon: Scissors },
        { to: '/ai/review-resume', label: 'Review Resume', icon: FileText },
        { 
            label: 'Manage Profile', 
            icon: UserCog,
            onClick: () => openUserProfile()
        }
    ];

    const handleSignOut = async () => {
        try {
            await signOut();
            navigate('/');
        } catch (err) {
            console.error('Error signing out:', err);
        }
    };

    return (
        <div className={`w-60 bg-white border-r border-gray-200 flex flex-col justify-between max-sm:absolute top-14 bottom-0 ${
            sidebar ? 'translate-x-0' : 'max-sm:-translate-x-full'
        } transition-all duration-300 ease-in-out`}>
            <div className="my-7 w-full">
                <div className="text-sm mt-4 px-6">
                    {navItems.map((item) => {
                        const { to, label, icon: Icon, onClick } = item;
                        
                        if (to) {
                            return (
                                <NavLink 
                                    key={to} 
                                    to={to} 
                                    end={to === '/ai/dashboard'}
                                    onClick={() => setSidebar(false)} 
                                    className={({isActive}) => 
                                        `px-4 py-2.5 flex items-center gap-3 rounded-lg mx-2 mb-1 ${
                                            isActive
                                                ? 'bg-gradient-to-r from-[#3C81f6] to-[#9324EA] text-white' 
                                                : 'text-gray-600 hover:bg-gray-100'
                                        }`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                                            <span>{label}</span>
                                        </>
                                    )}
                                </NavLink>
                            );
                        }
                        
                        return (
                            <button
                                key={label}
                                onClick={() => {
                                    onClick?.();
                                    setSidebar(false);
                                }}
                                className='w-full px-4 py-2.5 flex items-center gap-3 rounded-lg mx-2 mb-1 text-gray-600 hover:bg-gray-100'
                            >
                                <Icon className='w-5 h-5 text-gray-500' />
                                <span>{label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
            
            <div className='w-full border-t border-gray-200 p-3 px-5 flex items-center justify-between bg-gray-50'>
                <div className='flex items-center gap-2 flex-1 min-w-0'>
                    <div className='relative'>
                        <img 
                            src={user.imageUrl} 
                            className='w-9 h-9 rounded-full border-2 border-white shadow-sm' 
                            alt={user.fullName} 
                        />
                        <div className='absolute -bottom-0.5 -right-0.5 bg-blue-500 rounded-full p-1'>
                            <User className='w-2.5 h-2.5 text-white' />
                        </div>
                    </div>
                    <div className='min-w-0'>
                        <h1 className='text-sm font-medium truncate' title={user.fullName}>
                            {user.fullName}
                        </h1>
                        <p className='text-xs text-gray-500'>
                            <Protect plan='premium' fallback='Free'>Premium</Protect> Plan
                        </p>
                    </div>
                </div>
                <button 
                    onClick={handleSignOut}
                    className='p-1.5 text-gray-500 hover:bg-gray-200 rounded-full transition-colors ml-2'
                    title='Sign out'
                >
                    <LogOut className='w-4 h-4' />
                </button>
            </div>
        </div>
    );
};

export default Sidebar;