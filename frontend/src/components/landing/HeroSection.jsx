import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users } from 'lucide-react';
import thaparCampusCleanBg from '../../assets/redesign/thapar_campus_clean_bg.jpg';

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-[640px] md:min-h-[720px] lg:min-h-[780px] bg-[#0B1026] overflow-hidden flex items-center"
      style={{
        backgroundImage: `url(${thaparCampusCleanBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Subtle Vignette & Left-Side Dark Shadow to Ensure 100% Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 z-0 pointer-events-none" />

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-28 pb-16 lg:pt-36 lg:pb-24">
        <div className="max-w-xl lg:max-w-2xl space-y-5 text-left">
          
          {/* Giant EVA Title with Violet Gradient */}
          <div className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#C084FC] via-[#E879F9] to-[#818CF8] leading-none drop-shadow-md">
            EVA
          </div>

          {/* Heading Lines */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-white tracking-tight leading-[1.12] drop-shadow-sm">
            Smart College Event &amp; <br />
            Venue Management <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A855F7] via-[#C084FC] to-[#EC4899]">
              Platform
            </span>
          </h1>

          {/* Description */}
          <p className="text-slate-100 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed drop-shadow-sm font-normal pt-1">
            Plan, manage and experience campus events — from venue booking and registrations to QR check-ins, feedback and real-time analytics — all in one place.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-3">
            <Link
              to="/signup"
              className="px-6 sm:px-7 py-3 sm:py-3.5 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-full shadow-[0_4px_20px_rgba(168,85,247,0.4)] hover:shadow-[0_6px_25px_rgba(168,85,247,0.6)] hover:scale-105 transition-all flex items-center justify-center gap-2 group text-sm sm:text-base"
            >
              Get Started as Student
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/coordinator/login"
              className="px-6 sm:px-7 py-3 sm:py-3.5 bg-black/40 hover:bg-black/60 border border-white/25 hover:border-white/40 text-white font-medium rounded-full backdrop-blur-md transition-all flex items-center justify-center gap-2 text-sm sm:text-base hover:scale-105"
            >
              <Users className="w-4 h-4 text-purple-300" />
              Coordinator Portal
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
