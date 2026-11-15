import React, { useEffect, useState } from 'react';
import { useAuthTransition } from '../../context/AuthTransitionContext';
import thaparCampusCleanBg from '../../assets/redesign/thapar_campus_clean_bg.jpg';
import campusDecoImg from '../../assets/redesign/eva-portal-campus-decoration.png';
import { ArrowLeft, ArrowRight, Eye, Users, Lock, User, UserPlus, ChevronDown } from 'lucide-react';

export function SwipeTransitionOverlay() {
  const { isTransitioningToLogin, transitionTarget } = useAuthTransition();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isTransitioningToLogin) {
      const timer = requestAnimationFrame(() => {
        setIsAnimating(true);
      });
      return () => cancelAnimationFrame(timer);
    } else {
      setIsAnimating(false);
    }
  }, [isTransitioningToLogin]);

  if (!isTransitioningToLogin) return null;

  const isCoordinator = transitionTarget === 'coordinator';
  const isSignup = transitionTarget === 'signup';

  let welcomeLine1 = 'Welcome Back,';
  let welcomeLine2 = 'Student!';

  if (isCoordinator) {
    welcomeLine1 = 'Welcome Back,';
    welcomeLine2 = 'Coordinator!';
  } else if (isSignup) {
    welcomeLine1 = 'Welcome to EVA,';
    welcomeLine2 = 'Student!';
  }

  return (
    <div
      className="fixed inset-0 z-[100] bg-[#F8F5F1] pointer-events-auto flex flex-col lg:flex-row overflow-hidden m-0 p-0 border-none rounded-none shadow-none"
    >
      {/* =========================================================================
          LEFT SECTION: Campus Sunset Photograph (Animates from 100% to 60%)
          - Touches top, left and bottom edges of the viewport
         ========================================================================= */}
      <div
        className="relative h-full flex flex-col justify-between overflow-hidden select-none transition-all duration-[800ms] m-0 p-0 rounded-none border-none flex-none"
        style={{
          width: isAnimating ? '60%' : '100%',
          backgroundImage: `url(${thaparCampusCleanBg})`,
          backgroundSize: 'cover',
          backgroundPosition: isAnimating ? '30% center' : 'center',
          backgroundRepeat: 'no-repeat',
          transitionTimingFunction: 'cubic-bezier(0.65, 0, 0.25, 1)',
        }}
      >
        {/* Subtle Dark Charcoal Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/25 pointer-events-none z-0" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/15 to-transparent pointer-events-none z-0" />

        {/* Top-Left EVA Brand Header */}
        <div className="relative z-10 p-6 sm:p-8 lg:p-10 xl:p-12">
          <div className="inline-flex items-center gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#B49168] flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-sm flex-shrink-0">
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
          </div>
        </div>

        {/* Lower-Left Welcome Heading & Subtitle Block (Shifted 50–70px Upwards) */}
        <div
          className={`relative z-10 p-6 sm:p-8 lg:p-10 xl:p-12 pb-24 sm:pb-28 lg:pb-32 xl:pb-34 max-w-2xl transition-all duration-500 ease-out ${
            isAnimating ? 'opacity-100 translate-y-0 delay-300' : 'opacity-0 translate-y-4'
          }`}
        >
          {/* Accent Gold Bar */}
          <div className="w-12 h-1 bg-[#EACBA5] rounded-full mb-3.5 shadow-sm" />

          {/* Welcome Heading: Increased by ~25-30% (Targeting 72-80px on desktop) */}
          <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] xl:text-[4.5rem] 2xl:text-[4.75rem] font-extrabold text-white tracking-tight leading-[1.04] mb-3">
            Welcome Back,<br />
            <span className="text-[#EACBA5]">
              {isCoordinator ? 'Coordinator!' : 'Student!'}
            </span>
          </h1>

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
              <linearGradient id="overlayPhotoGoldWave" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#B49168" stopOpacity="0" />
                <stop offset="25%" stopColor="#B49168" stopOpacity="0.4" />
                <stop offset="65%" stopColor="#EACBA5" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#B49168" stopOpacity="0.65" />
              </linearGradient>
              <linearGradient id="overlayPhotoCharcoalUnder" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#292E35" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#292E35" stopOpacity="0.5" />
              </linearGradient>
            </defs>

            <path
              d="M 0,120 C 180,115 380,85 700,20 L 700,120 L 0,120 Z"
              fill="url(#overlayPhotoCharcoalUnder)"
            />
            <path
              d="M 0,118 C 180,115 380,85 700,20"
              stroke="url(#overlayPhotoGoldWave)"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            <path
              d="M 40,120 C 220,118 420,92 700,35"
              stroke="url(#overlayPhotoGoldWave)"
              strokeWidth="1.2"
              strokeOpacity="0.55"
            />
            <path
              d="M 90,120 C 260,119 460,98 700,50"
              stroke="url(#overlayPhotoGoldWave)"
              strokeWidth="0.8"
              strokeOpacity="0.35"
            />
          </svg>
        </div>
      </div>

      {/* =========================================================================
          RIGHT SECTION: Modern SaaS Login Panel (Slides in to occupy 40%)
          - Touches top, right and bottom edges of the viewport
         ========================================================================= */}
      <div
        className="relative h-full bg-[#F8F5F1] flex flex-col justify-between p-6 sm:p-8 lg:p-10 xl:p-12 transition-all duration-[800ms] overflow-hidden m-0 rounded-none border-none flex-none"
        style={{
          width: '40%',
          transform: isAnimating ? 'translateX(0)' : 'translateX(100%)',
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-[#292E35] border border-[#292E35]/40 rounded-full shadow-xs">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </div>
        </div>

        {/* Center: Compact Form Preview */}
        <div
          className={`relative z-10 w-full max-w-[420px] mx-auto py-2 transition-all duration-500 ease-out ${
            isAnimating ? 'opacity-100 translate-y-0 delay-300' : 'opacity-0 translate-y-4'
          }`}
        >
          {isSignup ? (
            /* Signup Preview */
            <>
              <div className="w-12 h-12 rounded-2xl bg-[#EACBA5]/40 border border-[#B49168]/30 flex items-center justify-center text-[#926B3C] shadow-xs mx-auto mb-3">
                <UserPlus className="w-6 h-6 text-[#926B3C]" />
              </div>

              <div className="text-center mb-6">
                <h2 className="text-[32px] sm:text-[34px] lg:text-[36px] font-extrabold text-[#292E35] tracking-tight leading-tight">
                  Create Student Account
                </h2>
                <p className="mt-1.5 text-xs sm:text-sm text-[#5A6068]">
                  Join the Thapar campus event network with your institute details.
                </p>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-[#292E35] uppercase tracking-wider mb-1.5">
                    FULL NAME
                  </label>
                  <div className="h-[48px] sm:h-[50px] w-full px-4 bg-white border border-[#E4D9CB] rounded-xl flex items-center text-sm sm:text-base text-[#9CA3AF] shadow-xs">
                    e.g. Rohan Sharma
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-[#292E35] uppercase tracking-wider mb-1.5">
                      INSTITUTE EMAIL
                    </label>
                    <div className="h-[48px] sm:h-[50px] w-full px-4 bg-white border border-[#E4D9CB] rounded-xl flex items-center text-sm text-[#9CA3AF] shadow-xs">
                      rsharma@thapar.edu
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#292E35] uppercase tracking-wider mb-1.5">
                      STUDENT ID / ROLL NO.
                    </label>
                    <div className="h-[48px] sm:h-[50px] w-full px-4 bg-white border border-[#E4D9CB] rounded-xl flex items-center text-sm text-[#9CA3AF] shadow-xs">
                      e.g. 1024030626
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-[#292E35] uppercase tracking-wider mb-1.5">
                      DEPARTMENT
                    </label>
                    <div className="h-[48px] sm:h-[50px] w-full px-4 bg-white border border-[#E4D9CB] rounded-xl flex items-center justify-between text-sm text-[#292E35] shadow-xs">
                      <span>Computer Engineering</span>
                      <ChevronDown className="w-4 h-4 text-[#706A63]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#292E35] uppercase tracking-wider mb-1.5">
                      YEAR OF STUDY
                    </label>
                    <div className="h-[48px] sm:h-[50px] w-full px-4 bg-white border border-[#E4D9CB] rounded-xl flex items-center justify-between text-sm text-[#292E35] shadow-xs">
                      <span>2nd Year</span>
                      <ChevronDown className="w-4 h-4 text-[#706A63]" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-[#292E35] uppercase tracking-wider mb-1.5">
                      PASSWORD
                    </label>
                    <div className="h-[48px] sm:h-[50px] w-full px-4 bg-white border border-[#E4D9CB] rounded-xl flex items-center justify-between text-sm text-[#9CA3AF] shadow-xs">
                      <span>••••••••</span>
                      <Eye className="w-4 h-4 text-[#706A63]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#292E35] uppercase tracking-wider mb-1.5">
                      CONFIRM PASSWORD
                    </label>
                    <div className="h-[48px] sm:h-[50px] w-full px-4 bg-white border border-[#E4D9CB] rounded-xl flex items-center justify-between text-sm text-[#9CA3AF] shadow-xs">
                      <span>••••••••</span>
                      <Eye className="w-4 h-4 text-[#706A63]" />
                    </div>
                  </div>
                </div>

                <div className="h-[50px] sm:h-[52px] w-full bg-[#292E35] text-white text-sm sm:text-base font-bold rounded-xl shadow-md flex items-center justify-center gap-2 mt-2">
                  <span>Complete Registration</span>
                  <UserPlus className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-5 text-center">
                <div className="text-xs sm:text-[13px] text-[#6B7280]">
                  Already have an account?{' '}
                  <span className="font-bold text-[#B49168]">Sign In →</span>
                </div>
              </div>
            </>
          ) : (
            /* Login Preview (Student or Coordinator) */
            <>
              {isCoordinator && (
                <div className="w-12 h-12 rounded-2xl bg-[#EACBA5]/40 border border-[#B49168]/30 flex items-center justify-center text-[#926B3C] shadow-xs mx-auto mb-3">
                  <Users className="w-6 h-6 text-[#926B3C]" />
                </div>
              )}

              <div className="text-center mb-6">
                <h2 className="text-[32px] sm:text-[34px] lg:text-[36px] font-extrabold text-[#292E35] tracking-tight leading-tight">
                  {isCoordinator ? 'Coordinator Sign In' : 'Student Sign In'}
                </h2>
                <p className="mt-1.5 text-xs sm:text-sm text-[#5A6068]">
                  {isCoordinator
                    ? 'Sign in to access your coordinator portal.'
                    : 'Sign in to access your student portal.'}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#292E35] uppercase tracking-wider mb-1.5">
                    {isCoordinator ? 'COORDINATOR ID OR ASSIGNED EMAIL' : 'INSTITUTE EMAIL OR STUDENT ID'}
                  </label>
                  <div className="h-[48px] sm:h-[50px] w-full px-4 bg-white border border-[#E4D9CB] rounded-xl flex items-center text-sm text-[#9CA3AF] shadow-xs gap-2.5">
                    {isCoordinator && <User className="w-4 h-4 text-[#706A63]" />}
                    <span>
                      {isCoordinator ? 'e.g. COO001 or coordinator@thapar.edu' : 'rollno@thapar.edu or STU001'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#292E35] uppercase tracking-wider mb-1.5">
                    PASSWORD
                  </label>
                  <div className="h-[48px] sm:h-[50px] w-full px-4 bg-white border border-[#E4D9CB] rounded-xl flex items-center justify-between text-sm text-[#9CA3AF] shadow-xs">
                    <div className="flex items-center gap-2.5">
                      {isCoordinator && <Lock className="w-4 h-4 text-[#706A63]" />}
                      <span>Enter your password</span>
                    </div>
                    <Eye className="w-4 h-4 text-[#706A63]" />
                  </div>
                </div>

                <div className="h-[50px] sm:h-[52px] w-full bg-[#292E35] text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 mt-2 text-sm sm:text-base">
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-3.5">
                <div className="h-[44px] sm:h-[46px] w-full bg-[#EDE5DA] border border-[#DECFC0] text-[#292E35] font-semibold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs">
                  <Users className="w-4 h-4 text-[#706A63]" />
                  <span>
                    {isCoordinator ? 'View Demo Coordinator Accounts' : 'View Demo Student Accounts'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#706A63]" />
                </div>
              </div>

              <div className="mt-5 text-center space-y-1.5">
                {isCoordinator ? (
                  <div className="text-xs sm:text-[13px] text-[#6B7280]">
                    Are you a student looking for events?{' '}
                    <span className="font-bold text-[#B49168]">Student Sign In →</span>
                  </div>
                ) : (
                  <>
                    <div className="text-xs sm:text-[13px] text-[#6B7280]">
                      Don't have an account?{' '}
                      <span className="font-bold text-[#B49168]">Create Student Account</span>
                    </div>
                    <div className="text-xs sm:text-[13px] font-semibold text-[#B49168] inline-flex items-center gap-1">
                      <span>Coordinator Login</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        <div className="relative z-10 hidden lg:block" />
      </div>
    </div>
  );
}
