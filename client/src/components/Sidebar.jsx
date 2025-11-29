import React from 'react';
import { useClerk, useUser } from '@clerk/clerk-react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    FileText,
    Image as ImageIcon,
    House,
    FileEdit,
    Hash,
    Scissors,
    Rocket,
    Film,
    Type,
    Share2
} from 'lucide-react';

const Sidebar = ({ sidebar, setSidebar }) => {
    const { user } = useUser();
    const { signOut } = useClerk();
    const navigate = useNavigate();

    // --- Branding Colors ---
    // Primary: Purple (Used for main icons and active text)
    // Accent: Cyan (Used for subtle highlights and gradients)
    const BRAND_PRIMARY = 'purple-600';
    const BRAND_ACCENT = 'cyan-500';

    const navItems = [
        { to: '/ai/dashboard', label: 'Dashboard', icon: House, defaultColor: 'text-slate-500' },

        // --- AGCR Engine Group ---
        { to: '/ai/agcr-engine', label: 'AI Video/Ads Generator', icon: Rocket, defaultColor: 'text-slate-500', gap: true },
        { to: '/ai/agcr/video', label: 'Video Script', icon: Film, defaultColor: 'text-slate-500' },
        { to: '/ai/agcr/titles', label: 'Titles & SEO', icon: Type, defaultColor: 'text-slate-500' },
        { to: '/ai/agcr/images', label: 'Image Prompts', icon: ImageIcon, defaultColor: 'text-slate-500' },

        // --- End AGCR Engine Group ---

        { to: '/ai/banner-generator', label: 'Banner Generator', icon: ImageIcon, defaultColor: 'text-slate-500', gap: true },
        { to: '/ai/generate-images', label: 'Generate Images', icon: ImageIcon, defaultColor: 'text-slate-500', gap: true },
        { to: '/ai/remove-object', label: 'Remove Object', icon: Scissors, defaultColor: 'text-slate-500' },
        { to: '/ai/write-article', label: 'Write Article', icon: FileEdit, defaultColor: 'text-slate-500' },
        { to: '/ai/blog-titles', label: 'Blog Titles', icon: Hash, defaultColor: 'text-slate-500' },

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
        <div className={`w-60 bg-slate-950 border-r border-slate-800 shadow-lg shadow-black/50 flex flex-col justify-between fixed md:static top-16 bottom-0 left-0 ${sidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            } transition-all duration-300 ease-in-out overflow-y-auto z-20`}>
            <div className="my-7 w-full">
                <div className="text-sm mt-4 px-3">
                    {navItems.map((item) => {
                        const { to, label, icon: Icon, onClick, defaultColor, indent, isShare, actionColor, gap } = item;

                        return (
                            <React.Fragment key={to || label}>
                                {to ? (
                                    <NavLink
                                        key={to}
                                        to={to}
                                        end={to === '/ai/dashboard' || to === '/ai/agcr-engine'}
                                        onClick={() => setSidebar(false)}
                                        className={({ isActive }) =>
                                            // Refined Active State: Purple-Cyan Gradient on Dark Background
                                            `relative px-4 py-3 flex items-center gap-3 rounded-xl mx-3 mb-3 transition-all duration-200 
                                        ${indent ? 'ml-8 text-xs border-l-2 border-slate-800 pl-4 hover:border-cyan-500' : 'font-medium'} 
                                        ${isActive
                                                ? `bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-md shadow-purple-500/30 ${indent ? 'border-transparent py-2' : ''}`
                                                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                                            }`
                                        }
                                    >
                                        {({ isActive }) => (
                                            <>
                                                {/* Conditional color for icon based on active state */}
                                                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : (defaultColor || 'text-slate-500')}`} />
                                                <span>{label}</span>
                                            </>
                                        )}
                                    </NavLink>
                                ) : null}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;