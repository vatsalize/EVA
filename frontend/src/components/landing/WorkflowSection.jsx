import React from 'react';
import { Calendar, MapPin, UserPlus, QrCode, Star, BarChart3, ArrowRight } from 'lucide-react';

export function WorkflowSection() {
  const steps = [
    {
      title: 'Create Event',
      icon: Calendar,
    },
    {
      title: 'Book Venue\n(AI Match)',
      icon: MapPin,
    },
    {
      title: 'Student\nRegistration',
      icon: UserPlus,
    },
    {
      title: 'QR Check-in',
      icon: QrCode,
    },
    {
      title: 'Feedback',
      icon: Star,
    },
    {
      title: 'Analytics',
      icon: BarChart3,
    }
  ];

  return (
    <div className="relative bg-[#292E35] pt-12 sm:pt-14 overflow-hidden">
      
      {/* Content Container (Global Consistent Max Width) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pb-4 sm:pb-6">
        
        {/* Subsection Header: THE EVA FLOW */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 space-y-1.5">
          <div className="inline-flex items-center justify-center gap-2.5">
            <span className="w-8 h-px bg-[#EACBA5]/60" />
            <span className="text-[11px] font-semibold tracking-widest uppercase text-[#EACBA5]">
              THE EVA FLOW
            </span>
            <span className="w-8 h-px bg-[#EACBA5]/60" />
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-[2.2rem] font-extrabold text-white tracking-tight leading-tight">
            From Idea to Insights in 6 Simple Steps
          </h2>

          <p className="text-[#D5CFC7] text-xs sm:text-sm">
            A seamless, end-to-end event experience for the entire campus.
          </p>
        </div>

        {/* Desktop Connected Flow — Strictly Aligned Centerline */}
        <div className="hidden lg:flex items-start justify-between max-w-5xl mx-auto px-2">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isLast = idx === steps.length - 1;

            return (
              <React.Fragment key={idx}>
                {/* Step Item with Fixed Icon Box & Reserved Label Height */}
                <div className="flex flex-col items-center text-center group cursor-default">
                  {/* Champagne Gold Rounded Square Icon Box — 56x56px */}
                  <div className="w-14 h-14 rounded-2xl bg-[#EACBA5] text-[#292E35] flex items-center justify-center shadow-md group-hover:scale-105 group-hover:bg-[#DEB887] transition-all duration-300">
                    <Icon className="w-7 h-7 stroke-[2.2]" />
                  </div>

                  {/* Step Title with Reserved 2-Line Height for Baseline Stability */}
                  <div className="min-h-[36px] flex items-center justify-center text-[11px] sm:text-xs font-semibold text-white leading-tight whitespace-pre-line max-w-[105px] mt-2.5">
                    {step.title}
                  </div>
                </div>

                {/* Dashed Connecting Arrow Centered with Icon Box (h-14 / 2 = 28px) */}
                {!isLast && (
                  <div className="flex-1 flex items-center justify-center px-2 pt-6">
                    <div className="w-full border-t border-dashed border-[#EACBA5]/60 relative flex items-center justify-end">
                      <ArrowRight className="w-3.5 h-3.5 text-[#EACBA5] absolute -right-1 transform -translate-y-1/2 top-1/2" />
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Mobile / Tablet Responsive Grid */}
        <div className="lg:hidden grid grid-cols-2 sm:grid-cols-3 gap-3.5 max-w-2xl mx-auto">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-[#222426]/80 border border-[#EACBA5]/20 rounded-2xl p-3.5 flex flex-col items-center text-center shadow-sm"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#EACBA5] text-[#292E35] flex items-center justify-center mb-2 shadow-md">
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div className="text-xs font-semibold text-white whitespace-pre-line leading-tight">
                  {step.title}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Layered Organic Curved SVG Wave Transition directly into Cream */}
      <div className="w-full relative pointer-events-none -mb-1 leading-none overflow-hidden">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          preserveAspectRatio="none"
          className="w-full h-20 sm:h-24 md:h-28 block"
        >
          <defs>
            <linearGradient id="goldWaveRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#B49168" />
              <stop offset="50%" stopColor="#EACBA5" />
              <stop offset="100%" stopColor="#B49168" />
            </linearGradient>
            <linearGradient id="goldGlowLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C99B61" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#FFF0D4" stopOpacity="1" />
              <stop offset="100%" stopColor="#C99B61" stopOpacity="0.5" />
            </linearGradient>
          </defs>

          {/* Layer 1: Solid Charcoal Base */}
          <rect width="1440" height="120" fill="#292E35" />

          {/* Layer 2: Secondary Charcoal (#343A42) */}
          <path
            d="M 0,25 C 360,78 540,102 720,102 C 900,102 1080,78 1440,25 L 1440,120 L 0,120 Z"
            fill="#343A42"
            opacity="0.6"
          />

          {/* Layer 3: Muted Gold Ribbon Layer (#B49168) */}
          <path
            d="M 0,34 C 360,86 540,108 720,108 C 900,108 1080,86 1440,34 L 1440,120 L 0,120 Z"
            fill="url(#goldWaveRibbon)"
            opacity="0.85"
          />

          {/* Layer 4: Champagne Gold Accent Line (#EACBA5) */}
          <path
            d="M 0,33 C 360,85 540,107 720,107 C 900,107 1080,85 1440,33"
            stroke="url(#goldGlowLine)"
            strokeWidth="2.8"
            strokeLinecap="round"
          />

          {/* Layer 5: Warm Beige Transition Layer (#EDE5DA) */}
          <path
            d="M 0,44 C 360,94 540,114 720,114 C 900,114 1080,94 1440,44 L 1440,120 L 0,120 Z"
            fill="#EDE5DA"
            opacity="0.5"
          />

          {/* Layer 6: Final Warm Cream Layer matching the Portal Section below (#F8F5F1) */}
          <path
            d="M 0,52 C 360,100 540,120 720,120 C 900,120 1080,100 1440,52 L 1440,120 L 0,120 Z"
            fill="#F8F5F1"
          />
        </svg>
      </div>

    </div>
  );
}
