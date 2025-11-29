import React from 'react';
import { FileText, ImageIcon, ArrowRight, CheckCircle, Zap, TrendingUp, Scissors, Hash, Rocket } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const DashBoard = () => {
  // --- Branding Colors (Purple & Cyan) ---
  const PURPLE_ACCENT = 'purple-600';
  const CYAN_ACCENT = 'cyan-600';

  // Animation variants for card slide-in effect
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08, // Faster stagger for more items
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  // Data for ALL key features, matching the sidebar content
  const allFeatures = [
    {
      title: 'AI Video/Ads Generator',
      description: 'Create full content packages: scripts, titles, and visual prompts in one go.',
      icon: Rocket, // Changed to Rocket for the main tool
      path: '/ai/agcr-engine',
      iconBg: 'bg-purple-100',
      iconColor: `text-${PURPLE_ACCENT}`,
      linkText: 'Start Generating',
    },
    {
      title: 'Image & Banner Generator',
      description: 'Generate marketing visuals, social media images, and stunning photos from scratch.',
      icon: ImageIcon,
      path: '/ai/generate-images',
      iconBg: 'bg-cyan-100',
      iconColor: `text-${CYAN_ACCENT}`,
      linkText: 'Create Images',
    },
    {
      title: 'Professional Article Writer',
      description: 'Generate engaging blog posts and detailed long-form content instantly.',
      icon: FileText,
      path: '/ai/write-article',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      linkText: 'Start Writing',
    },
    {
      title: 'Edit & Remove Objects',
      description: 'Clean up photos, remove backgrounds, or erase unwanted elements easily.',
      icon: Scissors,
      path: '/ai/remove-object',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      linkText: 'Edit Photos',
    },
    {
      title: 'Blog Titles & SEO',
      description: 'Quickly generate catchy, SEO-friendly titles and hashtags for your articles.',
      icon: Hash,
      path: '/ai/blog-titles',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      linkText: 'Generate Titles',
    },
    {
      title: 'Review Resume (NEW)',
      description: 'Use AI to analyze your resume and get instant feedback on clarity and impact.',
      icon: FileText, // Reused icon for resume/text
      path: '/ai/review-resume',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      linkText: 'Analyze Resume',
    },
  ];

  return (
    // Changed main background to dark slate
    <div className='p-6 max-w-7xl mx-auto min-h-[calc(100vh-60px)] text-slate-200'>
      {/* Header */}
      <div className='mb-8 border-b border-slate-800 pb-4'>
        <h1 className='text-3xl font-extrabold text-white flex items-center gap-2'>
          Welcome to <span className={`bg-clip-text text-transparent bg-gradient-to-r from-${PURPLE_ACCENT} to-${CYAN_ACCENT}`}>Quick.ai</span>
        </h1>
        <p className='text-slate-400 text-lg'>Start creating amazing content with our AI-powered tools</p>
      </div>

      {/* Sliding Banners Section (Main Call to Action) */}
      <div className='mb-10'>
        <h2 className='text-xl font-bold text-white mb-4'>🚀 Focus Feature: AI Video Generation</h2>

        {/* Single prominent card for the main AGCR tool */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className={`flex-shrink-0 w-full h-auto bg-gradient-to-r from-purple-600 to-indigo-600 p-8 rounded-2xl shadow-2xl shadow-purple-500/20 border border-white/10`}
        >
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <div>
              <Rocket className='w-10 h-10 text-yellow-300 mb-2' />
              <h3 className='text-3xl font-extrabold text-white mb-2'>The AI Video/Ads Generator</h3>
              <p className='text-purple-100 text-lg'>
                Generate entire campaigns in seconds: Video Scripts, Titles & SEO, Image Prompts, and Ad Copy.
              </p>
            </div>
            <NavLink
              to='/ai/agcr-engine'
              className='mt-4 md:mt-0 flex-shrink-0 inline-flex items-center text-lg text-white bg-white/20 hover:bg-white/30 font-bold px-6 py-3 rounded-xl transition-colors transform hover:scale-[1.03] border border-white/50 backdrop-blur-sm'
            >
              Start AI Generation <ArrowRight className='w-5 h-5 ml-2' />
            </NavLink>
          </div>
        </motion.div>
      </div>

      <div className='border-t border-slate-800 pt-8'>
        <h2 className='text-xl font-bold text-white mb-6'>All AI Tools Overview</h2>

        {/* Main Feature Cards - Now including all sidebar items */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'
        >
          {allFeatures.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className={`bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-lg hover:shadow-purple-500/10 transition-all duration-300 transform hover:-translate-y-0.5 hover:border-slate-600`}
            >
              <div className={`${feature.iconBg.replace('bg-', 'bg-opacity-20 bg-')} w-12 h-12 rounded-xl flex items-center justify-center mb-4 border border-white/5`}>
                <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
              </div>
              <h3 className='font-bold text-xl mb-2 text-slate-100'>{feature.title}</h3>
              <p className='text-slate-400 mb-6 text-sm'>{feature.description}</p>
              <NavLink
                to={feature.path}
                // Branded link style
                className={`text-${PURPLE_ACCENT} hover:text-cyan-400 font-semibold inline-flex items-center transition-colors`}
              >
                {feature.linkText} <ArrowRight className='w-4 h-4 ml-1' />
              </NavLink>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Tips Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`mt-12 bg-gradient-to-r from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700 shadow-xl`}
        >
          <h3 className='font-bold text-xl text-white mb-4 flex items-center gap-2'>
            <TrendingUp className={`w-5 h-5 text-${PURPLE_ACCENT}`} /> Optimize Your Output
          </h3>
          <ul className='space-y-3 text-slate-300'>
            <li className='flex items-start'>
              <CheckCircle className='w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0' />
              <span>Be **specific and descriptive** in your prompts for optimal results.</span>
            </li>
            <li className='flex items-start'>
              <CheckCircle className='w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0' />
              <span>Use **high-resolution** source images for superior editing results.</span>
            </li>
            <li className='flex items-start'>
              <CheckCircle className='w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0' />
              <span>Hit the **save button** to keep track of your best creations in the dashboard.</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default DashBoard;