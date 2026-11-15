import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAuthTransition } from '../../context/AuthTransitionContext';
import { ArrowRight } from 'lucide-react';

export function FinalCTASection() {
  const { isAuthenticated, isStudent, isCoordinator } = useAuth();
  const { triggerSignupTransition } = useAuthTransition();
  return (
    <div className="pt-8 pb-14 sm:pt-10 sm:pb-16 relative bg-transparent">
      
      {/* Main Content Container (Global Consistent Max Width: max-w-6xl) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Large Rounded Deep Charcoal Banner with Native SVG Curves */}
        <div className="relative rounded-[32px] bg-[#292E35] border border-white/5 p-8 sm:p-10 lg:p-12 min-h-[200px] sm:min-h-[220px] overflow-hidden shadow-xl flex flex-col justify-center">
          
          {/* Custom Native SVG Decorative Curves in Bottom-Right Corner */}
          <div className="absolute right-0 bottom-0 w-3/5 h-full pointer-events-none overflow-hidden">
            <svg
              viewBox="0 0 600 160"
              fill="none"
              preserveAspectRatio="none"
              className="w-full h-full"
            >
              <defs>
                <linearGradient id="ctaGoldWaveLine" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#B49168" stopOpacity="0" />
                  <stop offset="25%" stopColor="#B49168" stopOpacity="0.4" />
                  <stop offset="65%" stopColor="#EACBA5" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#B49168" stopOpacity="0.75" />
                </linearGradient>
                <linearGradient id="ctaCharcoalUnder" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#343A42" stopOpacity="0" />
                  <stop offset="100%" stopColor="#343A42" stopOpacity="0.45" />
                </linearGradient>
                <linearGradient id="ctaGoldUnderGlow" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#B49168" stopOpacity="0" />
                  <stop offset="100%" stopColor="#EACBA5" stopOpacity="0.12" />
                </linearGradient>
              </defs>

              {/* Layer 1: Secondary Charcoal Shape */}
              <path
                d="M 0,160 C 200,155 380,115 600,35 L 600,160 L 0,160 Z"
                fill="url(#ctaCharcoalUnder)"
              />

              {/* Layer 2: Soft Gold Glow */}
              <path
                d="M 50,160 C 240,156 410,125 600,45 L 600,160 L 50,160 Z"
                fill="url(#ctaGoldUnderGlow)"
              />

              {/* Layer 3: Main Flowing Gold Curve */}
              <path
                d="M 0,158 C 200,155 380,115 600,35"
                stroke="url(#ctaGoldWaveLine)"
                strokeWidth="2.8"
                strokeLinecap="round"
              />

              {/* Layer 4: Champagne Gold Accent Echo Line */}
              <path
                d="M 40,160 C 230,157 410,125 600,52"
                stroke="url(#ctaGoldWaveLine)"
                strokeWidth="1.2"
                strokeOpacity="0.5"
              />
            </svg>
          </div>

          {/* Banner Foreground Content */}
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 sm:gap-8">
            {/* Left Content */}
            <div className="space-y-3.5 max-w-2xl text-left">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Ready to Elevate Campus <span className="text-[#EACBA5]">Events?</span>
              </h2>
              <p className="text-[#D5CFC7] text-xs sm:text-sm md:text-[15px] leading-relaxed">
                Join EVA and make event management at TIET simpler, smarter and more efficient.
              </p>
            </div>

            {/* Right Action Button */}
            <div className="flex-shrink-0 pt-1 lg:pt-0">
              <Link
                to={
                  isAuthenticated && isStudent
                    ? '/student/dashboard'
                    : isAuthenticated && isCoordinator
                    ? '/coordinator/dashboard'
                    : '/signup'
                }
                onClick={(e) => {
                  if (!isAuthenticated) {
                    e.preventDefault();
                    triggerSignupTransition();
                  }
                }}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#EACBA5] hover:bg-[#DEB887] text-[#292E35] font-bold rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-xs sm:text-sm group hover:scale-105"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}