import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function FinalCTASection() {
  return (
    <section className="py-12 sm:py-16 bg-[#F8F5F1] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Large Rounded Deep Charcoal Banner */}
        <div className="relative rounded-3xl bg-[#292E35] border border-[#E4D9CB]/20 p-8 sm:p-12 lg:p-14 overflow-hidden shadow-lg">
          
          {/* Subtle Golden Accent Curve in Bottom Right */}
          <div className="absolute right-0 bottom-0 pointer-events-none opacity-40">
            <svg width="400" height="180" viewBox="0 0 400 180" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M400,180 C260,180 160,120 100,0"
                stroke="#B49168"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M400,180 C300,180 200,140 140,20"
                stroke="#EACBA5"
                strokeWidth="1"
                strokeOpacity="0.5"
              />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            {/* Left Content */}
            <div className="space-y-3 max-w-2xl text-left">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Ready to Elevate Campus <span className="text-[#EACBA5]">Events?</span>
              </h2>
              <p className="text-[#D5CFC7] text-sm sm:text-base leading-relaxed">
                Join EVA and make event management at TIET simpler, smarter and more efficient.
              </p>
            </div>

            {/* Right Action Button */}
            <div className="flex-shrink-0 pt-2 lg:pt-0">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#EACBA5] hover:bg-[#DEB887] text-[#292E35] font-bold rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-sm sm:text-base group hover:scale-105"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
