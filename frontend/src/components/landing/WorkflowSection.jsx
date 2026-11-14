import React from 'react';
import { Calendar, CalendarCheck, Users, QrCode, BarChart3, ArrowRight } from 'lucide-react';

export function WorkflowSection() {
  const steps = [
    {
      id: 1,
      title: 'Create Event',
      description: 'Coordinators set up event details.',
      icon: Calendar,
    },
    {
      id: 2,
      title: 'Book Venue',
      description: 'Reserve the right venue based on availability.',
      icon: CalendarCheck,
    },
    {
      id: 3,
      title: 'Register',
      description: 'Students discover and register for events.',
      icon: Users,
    },
    {
      id: 4,
      title: 'Check-In',
      description: 'Verify attendance via QR codes.',
      icon: QrCode,
    },
    {
      id: 5,
      title: 'Analyze',
      description: 'View feedback and performance insights.',
      icon: BarChart3,
    }
  ];

  return (
    <section id="how-it-works" className="relative bg-[#1C2127] text-white py-16 sm:py-20 overflow-hidden">
      
      {/* Top Wave Divider Transitioning from Warm Cream to Dark Charcoal */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none pointer-events-none">
        <svg
          viewBox="0 0 1200 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-8 sm:h-12 object-cover"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C300,50 600,0 900,40 C1050,60 1150,20 1200,0 L1200,0 L0,0 Z"
            fill="#FAF7F2"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-4">
        
        {/* Section Header with Dashes */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center justify-center gap-3 w-full">
            <span className="w-12 sm:w-16 h-px bg-slate-600" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#FAF7F2] tracking-tight">
              How EVA Works
            </h2>
            <span className="w-12 sm:w-16 h-px bg-slate-600" />
          </div>
        </div>

        {/* 5 Connected Steps in Flowchart */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4 items-start max-w-6xl mx-auto">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isLast = idx === steps.length - 1;

            return (
              <div key={step.id} className="relative flex flex-col items-center text-center group">
                
                {/* Horizontal Connecting Arrow on Desktop */}
                {!isLast && (
                  <div className="hidden lg:block absolute top-7 -right-3 sm:-right-4 w-7 sm:w-8 z-0 text-slate-500 opacity-60">
                    <ArrowRight className="w-6 h-6 stroke-[1.5]" />
                  </div>
                )}

                {/* Circle Icon Badge */}
                <div className="w-15 h-15 sm:w-16 sm:h-16 rounded-full bg-[#352D26] border border-[#5C4A3B] flex items-center justify-center text-[#E2CEB9] mb-4 shadow-lg group-hover:scale-110 group-hover:border-[#A27B55] transition-all duration-300 z-10">
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.8]" />
                </div>

                {/* Step Title */}
                <h3 className="text-base sm:text-lg font-bold text-white mb-1.5">
                  {step.title}
                </h3>

                {/* Step Description */}
                <p className="text-xs sm:text-sm text-slate-400 max-w-[170px] leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>

      {/* Bottom Wave Divider Transitioning from Dark Charcoal to Warm Cream */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none pointer-events-none">
        <svg
          viewBox="0 0 1200 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-8 sm:h-12 object-cover rotate-180"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C300,50 600,0 900,40 C1050,60 1150,20 1200,0 L1200,0 L0,0 Z"
            fill="#FAF7F2"
          />
        </svg>
      </div>

    </section>
  );
}
