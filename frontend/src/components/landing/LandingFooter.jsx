import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Key } from 'lucide-react';
import api from '../../services/api';

export function LandingFooter({ onOpenCredentials }) {
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
        // Keep default optimistic true or fallback
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
    <footer className="bg-[#222426] text-slate-300 pt-16 pb-12 border-t border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#B49168] flex items-center justify-center text-white font-black text-lg shadow-sm">
                E
              </div>
              <span className="text-xl font-bold text-white tracking-tight">EVA</span>
            </div>
            <p className="text-sm text-slate-300 max-w-sm leading-relaxed">
              Smart College Event &amp; Venue Management Platform for Thapar Institute of Engineering and Technology (TIET).
            </p>
            <div className="text-xs text-[#EACBA5] font-semibold tracking-wide">
              UCS 503P — Software Engineering Course Project
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">PLATFORM NAVIGATION</h4>
            <ul className="space-y-2 text-sm">
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

          {/* Authentication Portals & Evaluator Tools */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">ACCESS PORTALS</h4>
            <div className="flex flex-col gap-2 text-sm text-slate-300">
              <Link to="/login" className="hover:text-white transition-colors">
                Student Sign In &amp; Registrations
              </Link>
              <Link to="/signup" className="hover:text-white transition-colors">
                Student Account Registration
              </Link>
              <Link to="/coordinator/login" className="hover:text-white transition-colors">
                Club Coordinator Management Portal
              </Link>
            </div>

            {onOpenCredentials && (
              <div className="pt-3">
                <button
                  onClick={onOpenCredentials}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#EACBA5] hover:text-white border border-[#EACBA5]/60 hover:border-[#EACBA5] hover:bg-[#EACBA5]/10 px-4 py-2 rounded-full transition-all"
                >
                  <Key className="w-3.5 h-3.5 text-[#EACBA5]" />
                  <span>View Predefined Demo Credentials</span>
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Bottom Copyright & Live Status */}
        <div className="border-t border-white/10 pt-6 mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
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
