import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAuthTransition } from '../../context/AuthTransitionContext';
import { ArrowRight, Users, Calendar } from 'lucide-react';
import thaparCampusCleanBg from '../../assets/redesign/thapar_campus_clean_bg.jpg';

export function HeroSection() {
  const { isAuthenticated, isStudent, isCoordinator } = useAuth();
  const { triggerLoginTransition, triggerCoordinatorTransition, triggerSignupTransition } = useAuthTransition();
  const location = useLocation();
  const returnedFromLogin = location.state?.returnedFromLogin;
  return (
    <section
      id="home"
      className="relative min-h-screen bg-[#292E35] overflow-hidden flex items-center"
      style={{
        backgroundImage: `url(${thaparCampusCleanBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark Charcoal Gradient Overlay on Left to ensure 100% text legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30 z-0 pointer-events-none" />

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-28 pb-16 lg:pt-32 lg:pb-24">
        <div
          className={`max-w-xl lg:max-w-2xl space-y-6 text-left ${
            returnedFromLogin ? 'animate-in fade-in duration-700 ease-out fill-mode-both' : ''
          }`}
        >
          
          {/* Eyebrow Badge: EVENT & VENUE AUTOMATION with Calendar icon */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 border border-[#EACBA5]/60 backdrop-blur-sm shadow-sm">
            <Calendar className="w-4 h-4 text-[#EACBA5]" />
            <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#EACBA5] uppercase">
              EVENT &amp; VENUE AUTOMATION
            </span>
          </div>

          {/* Exact 3-line headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-extrabold text-white tracking-tight leading-[1.08]">
            Your Campus.<br />
            <span className="text-[#EACBA5]">Your Experiences.</span><br />
            One Platform.
          </h1>

          {/* Description */}
          <p className="text-slate-100 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed font-normal">
            Discover events, connect with your community and manage campus experiences — all in one place.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <Link
              to={isAuthenticated && isStudent ? '/student/dashboard' : '/signup'}
              onClick={(e) => {
                if (!isAuthenticated || !isStudent) {
                  e.preventDefault();
                  triggerSignupTransition();
                }
              }}
              className="px-6 sm:px-7 py-3 sm:py-3.5 bg-[#EACBA5] hover:bg-[#DEB887] text-[#292E35] font-bold rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group text-sm sm:text-base hover:scale-105"
            >
              <span>Get Started as Student</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to={isAuthenticated && isCoordinator ? '/coordinator/dashboard' : '/coordinator/login'}
              onClick={(e) => {
                if (!isAuthenticated || !isCoordinator) {
                  e.preventDefault();
                  triggerCoordinatorTransition();
                }
              }}
              className="px-6 sm:px-7 py-3 sm:py-3.5 bg-black/40 hover:bg-black/60 border border-[#EACBA5]/50 hover:border-[#EACBA5] text-white font-medium rounded-full backdrop-blur-md transition-all duration-200 flex items-center justify-center gap-2 group text-sm sm:text-base hover:scale-105"
            >
              <Users className="w-4 h-4 text-[#EACBA5]" />
              <span>Coordinator Portal</span>
              <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
