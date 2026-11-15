import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import thaparCampusCleanBg from '../assets/redesign/thapar_campus_clean_bg.jpg';
import campusDecoImg from '../assets/redesign/eva-portal-campus-decoration.png';

export function AuthLayout() {
  const [isExiting, setIsExiting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Determine welcome heading based on current path
  const pathname = location.pathname;
  const isCoordinator = pathname.startsWith('/coordinator');
  const isSignup = pathname === '/signup';

  let welcomeLine1 = 'Welcome Back,';
  let welcomeLine2 = 'Student!';

  if (isCoordinator) {
    welcomeLine1 = 'Welcome Back,';
    welcomeLine2 = 'Coordinator!';
  } else if (isSignup) {
    welcomeLine1 = 'Welcome to EVA,';
    welcomeLine2 = 'Student!';
  }

  const handleBackToHome = () => {
    const isReduced = typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isReduced) {
      navigate('/', { replace: true, state: { returnedFromLogin: true } });
      return;
    }

    setIsExiting(true);
    // Reverse exit duration: 750ms matching the forward cinematic cubic-bezier curve
    setTimeout(() => {
      navigate('/', { replace: true, state: { returnedFromLogin: true } });
    }, 750);
  };

  return (
    <div className="min-h-[100dvh] w-full bg-[#F8F5F1] flex font-sans relative overflow-x-hidden m-0 p-0 border-none rounded-none shadow-none">
      {/* =========================================================================
          FULL-SCREEN EDGE-TO-EDGE AUTHENTICATION LAYOUT (STRICT 60:40 DESKTOP)
          - Left 60%: Campus photograph (touches top, left, bottom edges)
          - Right 40%: Modern SaaS login/registration panel (touches top, right, bottom edges)
          - Zero outer margins, zero outer padding, no rounded card, no shadows
         ========================================================================= */}
      <div className="w-full min-h-[100dvh] flex flex-col lg:flex-row m-0 p-0 border-none rounded-none shadow-none overflow-hidden">
        {/* =========================================================================
            LEFT SECTION: Campus Sunset Photograph (60% Width on Desktop)
            - Persists across /login, /coordinator/login, and /signup without jumping
           ========================================================================= */}
        <div
          className={`relative min-h-[340px] sm:min-h-[400px] lg:min-h-[100dvh] flex flex-col justify-between overflow-hidden select-none transition-all duration-[750ms] m-0 p-0 rounded-none border-none ${
            isExiting ? 'w-full' : 'w-full lg:w-[60%] lg:flex-none'
          }`}
          style={{
            backgroundImage: `url(${thaparCampusCleanBg})`,
            backgroundSize: 'cover',
            backgroundPosition: isExiting ? 'center' : '30% center',
            backgroundRepeat: 'no-repeat',
            transitionTimingFunction: 'cubic-bezier(0.65, 0, 0.25, 1)',
          }}
        >
          {/* Subtle Dark Charcoal Vignette Gradients for Legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/25 pointer-events-none z-0" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/15 to-transparent pointer-events-none z-0" />

          {/* Top-Left EVA Brand Header */}
          <div className="relative z-10 p-5 sm:p-7 lg:p-9 xl:p-10">
            <button
              type="button"
              onClick={handleBackToHome}
              className="inline-flex items-center gap-3 group cursor-pointer text-left"
            >
              {/* Rounded square gold logo containing the letter E */}
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#B49168] flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-sm group-hover:scale-105 transition-transform flex-shrink-0">
                <span className="leading-none">E</span>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  EVA
                </span>
                <span className="w-px h-5 bg-white/40" />
                <span className="text-[11px] sm:text-xs font-medium leading-tight text-white/95 max-w-[210px]">
                  Thapar Institute of Engineering<br />and Technology
                </span>
              </div>
            </button>
          </div>

          {/* Lower-Left Welcome Heading & Subtitle Block (Shifted 50–70px Upwards) */}
          <div
            className={`relative z-10 p-5 sm:p-7 lg:p-9 xl:p-10 pb-24 sm:pb-28 lg:pb-32 xl:pb-34 max-w-2xl transition-all duration-300 ease-out ${
              isExiting ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'
            }`}
          >
            {/* Accent Gold Bar */}
            <div className="w-12 h-1 bg-[#EACBA5] rounded-full mb-3.5 shadow-sm" />

            {/* Welcome Heading: Increased by ~25-30% (Targeting 72-80px on desktop) */}
            <div key={pathname} className="animate-in fade-in duration-300">
              <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] xl:text-[4.5rem] 2xl:text-[4.75rem] font-extrabold text-white tracking-tight leading-[1.04] mb-3">
                {welcomeLine1}<br />
                <span className="text-[#EACBA5]">{welcomeLine2}</span>
              </h1>
            </div>

            {/* Subline */}
            <div className="flex items-center gap-2.5 pt-1">
              <span className="w-5 h-0.5 bg-[#EACBA5]/70 rounded-full" />
              <p className="text-white/85 text-xs sm:text-sm font-medium tracking-wide">
                Thapar Institute of Engineering and Technology
              </p>
            </div>
          </div>

          {/* Flowing Champagne-Gold Curves along Bottom Edge of Photograph */}
          <div className="absolute left-0 right-0 bottom-0 pointer-events-none h-24 sm:h-28 overflow-hidden z-10">
            <svg
              viewBox="0 0 700 120"
              fill="none"
              preserveAspectRatio="none"
              className="w-full h-full"
            >
              <defs>
                <linearGradient id="authPhotoGoldWave" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#B49168" stopOpacity="0" />
                  <stop offset="25%" stopColor="#B49168" stopOpacity="0.4" />
                  <stop offset="65%" stopColor="#EACBA5" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#B49168" stopOpacity="0.65" />
                </linearGradient>
                <linearGradient id="authPhotoCharcoalUnder" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#292E35" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#292E35" stopOpacity="0.5" />
                </linearGradient>
              </defs>

              <path
                d="M 0,120 C 180,115 380,85 700,20 L 700,120 L 0,120 Z"
                fill="url(#authPhotoCharcoalUnder)"
              />
              <path
                d="M 0,118 C 180,115 380,85 700,20"
                stroke="url(#authPhotoGoldWave)"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <path
                d="M 40,120 C 220,118 420,92 700,35"
                stroke="url(#authPhotoGoldWave)"
                strokeWidth="1.2"
                strokeOpacity="0.55"
              />
              <path
                d="M 90,120 C 260,119 460,98 700,50"
                stroke="url(#authPhotoGoldWave)"
                strokeWidth="0.8"
                strokeOpacity="0.35"
              />
            </svg>
          </div>
        </div>

        {/* =========================================================================
            RIGHT SECTION: Modern SaaS Form Panel (40% Width on Desktop)
            - Renders the active child route (<Outlet />) with smooth slide-and-fade
           ========================================================================= */}
        <div
          className={`relative min-h-[100dvh] bg-[#F8F5F1] flex flex-col justify-between p-6 sm:p-8 lg:p-10 xl:p-12 transition-all duration-[750ms] overflow-y-auto m-0 rounded-none border-none ${
            isExiting ? 'translate-x-full opacity-0 lg:w-0 p-0' : 'translate-x-0 opacity-100 w-full lg:w-[40%] lg:flex-none'
          }`}
          style={{
            transitionTimingFunction: 'cubic-bezier(0.65, 0, 0.25, 1)',
          }}
        >
          {/* Subtle Campus Architectural Illustration & Curves in Bottom */}
          <div className="absolute inset-x-0 bottom-0 h-36 sm:h-44 pointer-events-none select-none overflow-hidden z-0 opacity-20">
            <img
              src={campusDecoImg}
              alt=""
              className="w-full h-full object-contain object-bottom"
            />
          </div>

          {/* Top Header: Back to Home Button in Top-Right Corner */}
          <div className="relative z-10 flex justify-end w-full">
            <button
              type="button"
              onClick={handleBackToHome}
              className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-[#292E35] border border-[#292E35]/40 hover:border-[#292E35] hover:bg-[#292E35]/5 rounded-full shadow-xs transition-all duration-200 cursor-pointer hover:scale-105"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>
          </div>

          {/* Center Dynamic Content Area (Smooth 350ms slide-and-fade between auth pages) */}
          <div
            key={pathname}
            className={`relative z-10 w-full my-auto transition-all duration-350 ease-out animate-in fade-in slide-in-from-right-3 ${
              isExiting ? 'opacity-0 translate-x-4 pointer-events-none' : 'opacity-100 translate-x-0'
            }`}
          >
            <Outlet />
          </div>

          {/* Bottom Spacer to keep form vertically balanced */}
          <div className="relative z-10 hidden lg:block" />
        </div>
      </div>
    </div>
  );
}
