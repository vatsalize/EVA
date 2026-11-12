import React from 'react';
import { Calendar, MapPin, UserPlus, QrCode, Star, BarChart3, ArrowRight } from 'lucide-react';

export function WorkflowSection() {
  const steps = [
    {
      number: '01',
      title: 'Create Event',
      icon: Calendar,
      color: 'text-violet-600',
      bgColor: 'bg-violet-100',
      borderColor: 'border-violet-200'
    },
    {
      number: '02',
      title: 'Book Venue\n(AI Match)',
      icon: MapPin,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      borderColor: 'border-indigo-200'
    },
    {
      number: '03',
      title: 'Student\nRegistration',
      icon: UserPlus,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-200'
    },
    {
      number: '04',
      title: 'QR Check-in',
      icon: QrCode,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100',
      borderColor: 'border-cyan-200'
    },
    {
      number: '05',
      title: 'Feedback',
      icon: Star,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
      borderColor: 'border-amber-200'
    },
    {
      number: '06',
      title: 'Analytics',
      icon: BarChart3,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      borderColor: 'border-emerald-200'
    }
  ];

  return (
    <section id="how-it-works" className="relative bg-white pt-6 pb-20 md:pb-24 overflow-hidden">
      
      {/* Curved Wave Divider Transitioning from Navy to White */}
      <div className="w-full overflow-hidden leading-none -mt-1 pointer-events-none">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-14 sm:h-20 md:h-24 object-cover"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C480,120 960,120 1440,0 L1440,0 L0,0 Z"
            fill="#0B1026"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-4">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-3">
            <span className="w-8 h-px bg-purple-400" />
            <span className="text-xs font-bold tracking-widest uppercase text-purple-600">
              The EVA Flow
            </span>
            <span className="w-8 h-px bg-purple-400" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            From Idea to Insights in 6 Simple Steps
          </h2>
        </div>

        {/* Desktop Connected Flow */}
        <div className="hidden lg:flex items-center justify-between relative max-w-6xl mx-auto px-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isLast = idx === steps.length - 1;

            return (
              <React.Fragment key={idx}>
                {/* Step Item */}
                <div className="flex flex-col items-center text-center group cursor-default">
                  {/* Icon Card */}
                  <div
                    className={`w-16 h-16 rounded-2xl ${step.bgColor} ${step.borderColor} border flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300 mb-3`}
                  >
                    <Icon className={`w-8 h-8 ${step.color}`} />
                  </div>

                  {/* Step Title */}
                  <div className="text-sm font-bold text-slate-800 leading-tight whitespace-pre-line">
                    {step.title}
                  </div>
                </div>

                {/* Dashed Connecting Arrow */}
                {!isLast && (
                  <div className="flex-1 flex items-center justify-center px-2">
                    <div className="w-full border-t-2 border-dashed border-slate-300 relative flex items-center justify-end">
                      <ArrowRight className="w-4 h-4 text-slate-400 absolute -right-2 transform -translate-y-1/2 top-1/2" />
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Mobile / Tablet Responsive Timeline */}
        <div className="lg:hidden grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col items-center text-center shadow-sm hover:border-purple-300 transition-all"
              >
                <div className="text-xs font-black text-purple-600 mb-1">STEP {step.number}</div>
                <div
                  className={`w-14 h-14 rounded-2xl ${step.bgColor} ${step.borderColor} border flex items-center justify-center mb-3 shadow-inner`}
                >
                  <Icon className={`w-7 h-7 ${step.color}`} />
                </div>
                <div className="text-sm font-bold text-slate-800 whitespace-pre-line leading-tight">
                  {step.title}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
