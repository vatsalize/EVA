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
    <section id="how-it-works" className="relative bg-[#292E35] pt-20 overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pb-12">
        
        {/* Subsection Header: THE EVA FLOW */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <div className="inline-flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-[#EACBA5]/60" />
            <span className="text-xs font-semibold tracking-widest uppercase text-[#EACBA5]">
              THE EVA FLOW
            </span>
            <span className="w-8 h-px bg-[#EACBA5]/60" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            From Idea to Insights in 6 Simple Steps
          </h2>

          <p className="text-[#D5CFC7] text-sm sm:text-base leading-relaxed">
            A seamless, end-to-end event experience for the entire campus.
          </p>
        </div>

        {/* Desktop Connected Flow */}
        <div className="hidden lg:flex items-center justify-between max-w-5xl mx-auto px-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isLast = idx === steps.length - 1;

            return (
              <React.Fragment key={idx}>
                {/* Step Item */}
                <div className="flex flex-col items-center text-center group cursor-default">
                  {/* Champagne Gold Rounded Square Icon Container */}
                  <div className="w-16 h-16 rounded-2xl bg-[#EACBA5] text-[#292E35] flex items-center justify-center shadow-md group-hover:scale-110 group-hover:bg-[#DEB887] transition-all duration-300 mb-3">
                    <Icon className="w-8 h-8 stroke-[2.2]" />
                  </div>

                  {/* Step Title in White */}
                  <div className="text-xs sm:text-sm font-semibold text-white leading-tight whitespace-pre-line max-w-[110px]">
                    {step.title}
                  </div>
                </div>

                {/* Dashed Connecting Arrow */}
                {!isLast && (
                  <div className="flex-1 flex items-center justify-center px-2 mb-6">
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
        <div className="lg:hidden grid grid-cols-2 sm:grid-cols-3 gap-5 max-w-2xl mx-auto">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-[#222426]/70 border border-[#EACBA5]/20 rounded-2xl p-4 flex flex-col items-center text-center shadow-sm"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#EACBA5] text-[#292E35] flex items-center justify-center mb-3 shadow-md">
                  <Icon className="w-7 h-7 stroke-[2.2]" />
                </div>
                <div className="text-xs sm:text-sm font-semibold text-white whitespace-pre-line leading-tight">
                  {step.title}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Elegant Curved Wave Transition to Warm Cream (#F8F5F1) */}
      <div className="w-full overflow-hidden leading-none pointer-events-none -mb-1">
        <svg
          viewBox="0 0 1440 90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-12 sm:h-16 md:h-20 object-cover"
          preserveAspectRatio="none"
        >
          {/* Subtle gold accent ribbon curve */}
          <path
            d="M0,35 C360,85 1080,5 1440,45 L1440,90 L0,90 Z"
            fill="#B49168"
            fillOpacity="0.3"
          />
          <path
            d="M0,45 C380,95 1060,15 1440,55 L1440,90 L0,90 Z"
            fill="#F8F5F1"
          />
        </svg>
      </div>

    </section>
  );
}
