import React from 'react';

export function AboutSection() {
  return (
    <section id="about" className="py-14 sm:py-16 bg-[#FAF7F2] border-b border-[#EAE3D6] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Heading & Label */}
          <div className="lg:col-span-5 space-y-2">
            <div className="inline-flex items-center gap-2 text-[#8C5A2B] text-xs sm:text-sm font-bold tracking-widest uppercase">
              <span className="w-5 h-0.5 bg-[#8C5A2B]" />
              <span>ABOUT EVA</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1F242E] tracking-tight leading-tight">
              A Unified Platform for <br className="hidden sm:inline" />
              Campus Life at Thapar
            </h2>
          </div>

          {/* Right Column: Divider, Text, and Building Sketch */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 lg:border-l lg:border-[#DFD7CA] lg:pl-8">
            {/* Description Paragraph */}
            <p className="text-[#555E68] text-sm sm:text-base leading-relaxed flex-1">
              EVA (Event &amp; Venue Automation) streamlines the complete lifecycle of campus events and venue management, making it easier for students and coordinators to organize, participate, and analyze events efficiently.
            </p>

            {/* Architectural Building Line-art Illustration */}
            <div className="w-48 sm:w-56 lg:w-64 flex-shrink-0 opacity-85 select-none pointer-events-none">
              <svg
                viewBox="0 0 280 140"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto text-[#B08968]"
              >
                {/* Ground Line */}
                <line x1="10" y1="125" x2="270" y2="125" stroke="#B08968" strokeWidth="1.5" />
                
                {/* Main Academic Complex Outline */}
                <rect x="70" y="35" width="140" height="90" fill="#F4EFE6" stroke="#8C6A48" strokeWidth="1.8" />
                <rect x="40" y="65" width="50" height="60" fill="#F4EFE6" stroke="#8C6A48" strokeWidth="1.6" />
                <rect x="190" y="65" width="60" height="60" fill="#F4EFE6" stroke="#8C6A48" strokeWidth="1.6" />
                
                {/* Facade Windows & Horizontal Slits */}
                <line x1="85" y1="48" x2="195" y2="48" stroke="#8C6A48" strokeWidth="1.4" strokeDasharray="6 3" />
                <line x1="85" y1="58" x2="195" y2="58" stroke="#8C6A48" strokeWidth="1.4" strokeDasharray="6 3" />
                <line x1="85" y1="68" x2="195" y2="68" stroke="#8C6A48" strokeWidth="1.4" strokeDasharray="6 3" />
                <line x1="85" y1="78" x2="195" y2="78" stroke="#8C6A48" strokeWidth="1.4" strokeDasharray="6 3" />
                <line x1="85" y1="88" x2="195" y2="88" stroke="#8C6A48" strokeWidth="1.4" strokeDasharray="6 3" />

                {/* Main Entrance Column Arch */}
                <rect x="115" y="95" width="50" height="30" fill="#FAF7F2" stroke="#8C6A48" strokeWidth="1.6" />
                <line x1="130" y1="95" x2="130" y2="125" stroke="#8C6A48" strokeWidth="1.2" />
                <line x1="150" y1="95" x2="150" y2="125" stroke="#8C6A48" strokeWidth="1.2" />

                {/* Left & Right Wings Windows */}
                <rect x="50" y="75" width="12" height="15" fill="#FAF7F2" stroke="#8C6A48" strokeWidth="1.2" />
                <rect x="68" y="75" width="12" height="15" fill="#FAF7F2" stroke="#8C6A48" strokeWidth="1.2" />
                <rect x="200" y="75" width="14" height="15" fill="#FAF7F2" stroke="#8C6A48" strokeWidth="1.2" />
                <rect x="225" y="75" width="14" height="15" fill="#FAF7F2" stroke="#8C6A48" strokeWidth="1.2" />

                {/* Decorative Trees / Foliage Line Art */}
                <circle cx="28" cy="110" r="14" fill="#EAE2D4" stroke="#8C6A48" strokeWidth="1.2" />
                <line x1="28" y1="110" x2="28" y2="125" stroke="#8C6A48" strokeWidth="1.5" />
                <circle cx="258" cy="112" r="12" fill="#EAE2D4" stroke="#8C6A48" strokeWidth="1.2" />
                <line x1="258" y1="112" x2="258" y2="125" stroke="#8C6A48" strokeWidth="1.5" />
              </svg>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
