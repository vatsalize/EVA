import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthTransition } from '../../context/AuthTransitionContext';
import { Key } from 'lucide-react';
import api from '../../services/api';

export function LandingFooter({ onOpenCredentials }) {
  const { triggerLoginTransition, triggerCoordinatorTransition, triggerSignupTransition } = useAuthTransition();
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function checkHealth() {
      try {
        const res = await api.get('/health');
        if (isMounted && res.data?.status === 'healthy') {
          setIsConnected(true);
        }
      } catch (err) {
        if (isMounted) setIsConnected(true);
      }
    }
    checkHealth();
    return () => { isMounted = false; };
  }, []);

  const scrollTo = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#202326] text-slate-300 pt-14 pb-7 sm:pt-16 sm:pb-8 border-t border-white/10 relative overflow-hidden">
      
      {/* Decorative Gold Wave Accents in Corners (Custom Native Transparent SVGs) */}
      <div className="absolute left-0 bottom-0 pointer-events-none w-72 sm:w-88 md:w-[420px] h-28 sm:h-36 z-0 overflow-hidden transform scale-x-[-1]">
        <svg viewBox="0 0 420 140" fill="none" className="w-full h-full object-cover">
          <defs>
            <linearGradient id="footerGoldGradLeft" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#B49168" stopOpacity="0" />
              <stop offset="30%" stopColor="#B49168" stopOpacity="0.45" />
              <stop offset="70%" stopColor="#EACBA5" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#B49168" stopOpacity="0.65" />
            </linearGradient>
          </defs>
          <path d="M 0,140 C 130,135 250,95 420,20 L 420,140 L 0,140 Z" fill="#292E35" opacity="0.5" />
          <path d="M 0,140 C 130,135 250,95 420,20" stroke="url(#footerGoldGradLeft)" strokeWidth="2.5" />
          <path d="M 45,140 C 170,135 280,105 420,40" stroke="url(#footerGoldGradLeft)" strokeWidth="1.2" strokeOpacity="0.5" />
          <path d="M 95,140 C 210,136 310,115 420,60" stroke="url(#footerGoldGradLeft)" strokeWidth="1" strokeOpacity="0.3" />
        </svg>
      </div>

      <div className="absolute right-0 bottom-0 pointer-events-none w-72 sm:w-88 md:w-[420px] h-28 sm:h-36 z-0 overflow-hidden">
        <svg viewBox="0 0 420 140" fill="none" className="w-full h-full object-cover">
          <defs>
            <linearGradient id="footerGoldGradRight" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#B49168" stopOpacity="0" />
              <stop offset="30%" stopColor="#B49168" stopOpacity="0.45" />
              <stop offset="70%" stopColor="#EACBA5" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#B49168" stopOpacity="0.65" />
            </linearGradient>
          </defs>
          <path d="M 0,140 C 130,135 250,95 420,20 L 420,140 L 0,140 Z" fill="#292E35" opacity="0.5" />
          <path d="M 0,140 C 130,135 250,95 420,20" stroke="url(#footerGoldGradRight)" strokeWidth="2.5" />
          <path d="M 45,140 C 170,135 280,105 420,40" stroke="url(#footerGoldGradRight)" strokeWidth="1.2" strokeOpacity="0.5" />
          <path d="M 95,140 C 210,136 310,115 420,60" stroke="url(#footerGoldGradRight)" strokeWidth="1" strokeOpacity="0.3" />
        </svg>
      </div>

      {/* Main Content Container (Global Consistent Max Width: max-w-6xl) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 pb-2">
          
          {/* Column 1: Brand Info */}
          <div className="md:col-span-5 space-y-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#B49168] flex items-center justify-center text-white font-black text-lg shadow-sm">
                E
              </div>
              <span className="text-xl font-bold text-white tracking-tight">EVA</span>
            </div>
            <p className="text-xs sm:text-[13px] text-slate-300 max-w-sm leading-relaxed">
              Smart College Event &amp; Venue Management Platform for Thapar Institute of Engineering and Technology (TIET).
            </p>
            <div className="text-[11px] sm:text-xs text-[#EACBA5] font-semibold tracking-wide pt-0.5">
              UCS 503P — Software Engineering Course Project
            </div>
          </div>

          {/* Column 2: Quick Navigation Links */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">PLATFORM NAVIGATION</h4>
            <ul className="space-y-2 text-xs sm:text-[13px]">
              <li>
                <button onClick={() => scrollTo('#home')} className="hover:text-white transition-colors text-slate-300">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('#features')} className="hover:text-white transition-colors text-slate-300">
                  Features &amp; Capabilities
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('#how-it-works')} className="hover:text-white transition-colors text-slate-300">
                  How It Works (6 Steps)
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('#about')} className="hover:text-white transition-colors text-slate-300">
                  Role Benefits
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('#analytics')} className="hover:text-white transition-colors text-slate-300">
                  Campus Analytics
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Authentication Portals & Evaluator Tools */}
          <div className="md:col-span-4 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">ACCESS PORTALS</h4>
            <div className="flex flex-col gap-2 text-xs sm:text-[13px] text-slate-300">
              <Link
                to="/login"
                onClick={(e) => {
                  e.preventDefault();
                  triggerLoginTransition();
                }}
                className="hover:text-white transition-colors"
              >
                Student Sign In &amp; Registrations
              </Link>
              <Link
                to="/signup"
                onClick={(e) => {
                  e.preventDefault();
                  triggerSignupTransition();
                }}
                className="hover:text-white transition-colors"
              >
                Student Account Registration
              </Link>
              <Link
                to="/coordinator/login"
                onClick={(e) => {
                  e.preventDefault();
                  triggerCoordinatorTransition();
                }}
                className="hover:text-white transition-colors"
              >
                Club Coordinator Management Portal
              </Link>
            </div>

            {onOpenCredentials && (
              <div className="pt-2.5">
                <button
                  onClick={onOpenCredentials}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#EACBA5] hover:text-white border border-[#EACBA5]/60 hover:border-[#EACBA5] hover:bg-[#EACBA5]/10 px-4 py-2 rounded-full transition-all"
                >
                  <Key className="w-3.5 h-3.5 text-[#EACBA5]" />
                  <span>View Predefined Demo Credentials</span>
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Horizontal Divider */}
        <div className="border-t border-white/10 my-7 sm:my-8" />

        {/* Bottom Copyright & Live Status */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] sm:text-xs text-slate-400">
          <div>
            &copy; 2026 EVA Platform • Thapar Institute of Engineering and Technology. All rights reserved.
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 text-emerald-400 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              API &amp; Database Connected
            </span>
            <span className="text-slate-500">•</span>
            <span>Patiala, Punjab, India</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
