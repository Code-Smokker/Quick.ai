import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
    return (
        <footer className="px-6 md:px-16 lg:px-24 xl:px-32 pt-8 w-full text-slate-400 mt-20 bg-slate-950 border-t border-slate-800">
            <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-slate-800 pb-6">
                <div className="md:max-w-96">
                    <img className="h-9" src={assets.logo} alt="Content App Logo" />
                    <p className="mt-6 text-sm text-slate-400">Experience the power of Al with QuickAi. <br />
                        Transform your content creation with our suite of premium Al tools. Write articles, generate images, and enhance your workflow.
                    </p>
                </div>
                <div className="flex-1 flex items-start md:justify-end gap-20">
                    <div>
                        <h2 className="font-semibold mb-5 text-white">Company</h2>
                        <ul className="text-sm space-y-2">
                            <li><a href="#" className="hover:text-purple-400 transition-colors">Home</a></li>
                            <li><a href="#" className="hover:text-purple-400 transition-colors">About us</a></li>
                            <li><a href="#" className="hover:text-purple-400 transition-colors">Contact us</a></li>
                            <li><a href="#" className="hover:text-purple-400 transition-colors">Privacy policy</a></li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="font-semibold text-white mb-5">Subscribe to our newsletter</h2>
                        <div className="text-sm space-y-2">
                            <p className="text-slate-400">The latest news, articles, and resources, sent to your inbox weekly.</p>
                            <div className="flex items-center gap-2 pt-4">
                                <input className="border border-slate-700 bg-slate-900 placeholder-slate-500 focus:ring-2 ring-purple-600 outline-none w-full max-w-64 h-9 rounded px-2 text-slate-200" type="email" placeholder="Enter your email" />
                                <button className="bg-gradient-to-r from-purple-600 to-cyan-600 cursor-pointer w-24 h-9 text-white rounded hover:shadow-lg hover:shadow-purple-500/20 transition-all">Subscribe</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <p className="pt-4 text-center text-xs md:text-sm pb-5 text-slate-500">
                Copyright 2025 © <a href="https://prebuiltui.com" className="hover:text-purple-400 transition-colors">Quick Ai</a>. All Right Reserved.
            </p>
        </footer>
    )
}

export default Footer