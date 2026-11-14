import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Code2 } from 'lucide-react';
import thaparCampusCleanBg from '../../assets/redesign/thapar_campus_clean_bg.jpg';

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-[580px] sm:min-h-[620px] lg:min-h-[680px] bg-[#0E131A] overflow-hidden flex items-center"
      style={{
        backgroundImage: `url(${thaparCampusCleanBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center right',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark Gradient Overlay: Deep Charcoal/Dark Navy on Left -> Transparent on Right */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0C1017]/95 via-[#0C1017]/75 sm:via-[#0C1017]/55 to-transparent z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0C1017]/70 via-transparent to-black/20 z-0 pointer-events-none" />

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 sm:py-20 lg:py-24">
        <div className="max-w-xl lg:max-w-2xl space-y-4 sm:space-y-5 text-left">
          
          {/* UCS 503P Project Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/45 border border-white/20 backdrop-blur-md text-slate-200 text-xs font-mono shadow-sm">
            <Code2 className="w-3.5 h-3.5 text-amber-200/90" />
            <span>UCS 503P — Software Engineering Project</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-1 sm:space-y-2">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-none drop-shadow-md">
              EVA
            </h1>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold text-white tracking-tight leading-tight drop-shadow-sm">
              Smart College Event &amp; <br />
              Venue Management{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E5A869] via-[#F4CA98] to-[#E5A869]">
                Platform
              </span>
            </h2>
          </div>

          {/* Subtitle Description */}
          <p className="text-slate-200/90 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed drop-shadow font-normal pt-1">
            Plan, manage and experience campus events — from venue booking and registrations to QR check-ins, feedback and real-time analytics — all in one place.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-3">
            <Link
              to="/signup"
              className="px-6 sm:px-7 py-3 bg-[#F5E5D3] hover:bg-[#EBD6C0] text-[#2C2117] font-semibold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 group text-sm sm:text-base"
            >
              Get Started as Student
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/coordinator/login"
              className="px-6 sm:px-7 py-3 bg-black/40 hover:bg-black/60 border border-white/25 hover:border-white/40 text-white font-medium rounded-full backdrop-blur-md transition-all flex items-center justify-center gap-2 text-sm sm:text-base hover:scale-105"
            >
              <Users className="w-4 h-4 text-amber-200/90" />
              Coordinator Portal
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
