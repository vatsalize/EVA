import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, ExternalLink, Key } from 'lucide-react';

export function LandingFooter({ onOpenCredentials }) {
  const scrollTo = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#070A18] text-slate-400 py-14 border-t border-white/10 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-40 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-purple-600/30">
                E
              </div>
              <span className="text-xl font-bold text-white tracking-tight">EVA</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Smart College Event &amp; Venue Management Platform for Thapar Institute of Engineering and Technology (TIET).
            </p>
            <div className="text-xs text-purple-300/80 font-mono">
              UCS 503P — Software Engineering Course Project
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Platform Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => scrollTo('#home')} className="hover:text-white transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('#features')} className="hover:text-white transition-colors">
                  Features &amp; Capabilities
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('#how-it-works')} className="hover:text-white transition-colors">
                  How It Works (6 Steps)
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('#about')} className="hover:text-white transition-colors">
                  Role Benefits
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('#analytics')} className="hover:text-white transition-colors">
                  Campus Analytics
                </button>
              </li>
            </ul>
          </div>

          {/* Authentication Portals & Evaluator Tools */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Access Portals</h4>
            <div className="flex flex-col gap-2 text-sm">
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
                  className="inline-flex items-center gap-2 text-xs font-semibold text-purple-300 hover:text-white bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 px-3.5 py-2 rounded-xl transition-all"
                >
                  <Key className="w-3.5 h-3.5" />
                  View Predefined Demo Credentials
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Bottom Copyright & Status */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; 2026 EVA Platform • Thapar Institute of Engineering and Technology. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              API &amp; Database Connected
            </span>
            <span>•</span>
            <span>Patiala, Punjab, India</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
