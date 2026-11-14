import React from 'react';
import { MapPin, Key } from 'lucide-react';

export function LandingFooter({ onOpenCredentials }) {
  const scrollTo = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#181D24] text-slate-300 py-10 sm:py-12 border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center justify-between">
          
          {/* Left Column: Brand & Tagline */}
          <div className="md:col-span-5 space-y-2 text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white text-[#181D24] flex items-center justify-center font-black text-sm">
                E
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-white">EVA</span>
                <span className="text-slate-500 font-light">|</span>
                <span className="text-xs sm:text-sm font-medium text-slate-200">
                  Thapar Institute Of Engineering and Technology
                </span>
              </div>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-400">
              Event &amp; Venue Automation — Powering Campus Life at TIET
            </p>
          </div>

          {/* Center Column: Quick Links */}
          <div className="md:col-span-3 text-left md:text-center space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Quick Links
            </h4>
            <div className="flex items-center md:justify-center gap-4 text-xs sm:text-sm text-slate-200">
              <button
                onClick={() => scrollTo('#home')}
                className="hover:text-white transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => scrollTo('#features')}
                className="hover:text-white transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => scrollTo('#how-it-works')}
                className="hover:text-white transition-colors"
              >
                How it Works
              </button>
              <button
                onClick={() => scrollTo('#about')}
                className="hover:text-white transition-colors"
              >
                About
              </button>
            </div>
          </div>

          {/* Right Column: Location / Institute Address */}
          <div className="md:col-span-4 flex items-start md:justify-end gap-2.5 text-left md:text-right">
            <MapPin className="w-5 h-5 text-[#B58D67] flex-shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 leading-relaxed">
              <p className="font-semibold text-white">Thapar Institute of Engineering and Technology</p>
              <p className="text-slate-400">Patiala, Punjab — 147004, India</p>
            </div>
          </div>

        </div>

        {/* Bottom subtle copyright & evaluator key */}
        <div className="pt-8 mt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} EVA Platform • UCS 503P Software Engineering Project.</p>

          {onOpenCredentials && (
            <button
              onClick={onOpenCredentials}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Demo Credentials</span>
            </button>
          )}
        </div>

      </div>
    </footer>
  );
}
