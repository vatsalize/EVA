import React from 'react';
import { Calendar, MapPin, Users, QrCode, MessageSquare, BarChart3 } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      id: 1,
      title: 'Event Management',
      description: 'Create, publish and manage campus events with ease.',
      icon: Calendar,
    },
    {
      id: 2,
      title: 'Venue Booking',
      description: 'Check availability and book campus venues seamlessly.',
      icon: MapPin,
    },
    {
      id: 3,
      title: 'Student Registration',
      description: 'Simple and secure event registrations for students.',
      icon: Users,
    },
    {
      id: 4,
      title: 'QR Check-In',
      description: 'Fast, contactless and accurate attendance tracking.',
      icon: QrCode,
    },
    {
      id: 5,
      title: 'Feedback & Ratings',
      description: 'Collect feedback and measure event impact.',
      icon: MessageSquare,
    },
    {
      id: 6,
      title: 'Analytics & Insights',
      description: 'Real-time dashboards for events and venue usage.',
      icon: BarChart3,
    }
  ];

  return (
    <section id="features" className="relative pt-8 pb-20 bg-[#F8F5F1] overflow-hidden">
      
      {/* Subtle Background Architectural Silhouettes (Left & Right) */}
      <div className="absolute left-0 bottom-0 pointer-events-none opacity-25 hidden sm:block">
        <svg width="240" height="150" viewBox="0 0 240 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 150 L0 100 L40 100 L40 60 L90 60 L90 40 L150 40 L150 80 L200 80 L200 120 L240 120 L240 150 Z" stroke="#B49168" strokeWidth="1" fill="#EDE5DA" fillOpacity="0.4"/>
          <line x1="20" y1="100" x2="20" y2="150" stroke="#B49168" strokeWidth="0.8" />
          <line x1="65" y1="60" x2="65" y2="150" stroke="#B49168" strokeWidth="0.8" />
          <line x1="120" y1="40" x2="120" y2="150" stroke="#B49168" strokeWidth="0.8" />
          <line x1="175" y1="80" x2="175" y2="150" stroke="#B49168" strokeWidth="0.8" />
        </svg>
      </div>

      <div className="absolute right-0 bottom-0 pointer-events-none opacity-25 hidden sm:block">
        <svg width="240" height="150" viewBox="0 0 240 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M240 150 L240 100 L200 100 L200 50 L140 50 L140 70 L90 70 L90 110 L40 110 L40 130 L0 130 L0 150 Z" stroke="#B49168" strokeWidth="1" fill="#EDE5DA" fillOpacity="0.4"/>
          <line x1="220" y1="100" x2="220" y2="150" stroke="#B49168" strokeWidth="0.8" />
          <line x1="170" y1="50" x2="170" y2="150" stroke="#B49168" strokeWidth="0.8" />
          <line x1="115" y1="70" x2="115" y2="150" stroke="#B49168" strokeWidth="0.8" />
          <line x1="65" y1="110" x2="65" y2="150" stroke="#B49168" strokeWidth="0.8" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Subsection Header: KEY FEATURES */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-[#B49168]/60" />
            <span className="text-xs font-bold tracking-widest uppercase text-[#B49168]">
              KEY FEATURES
            </span>
            <span className="w-8 h-px bg-[#B49168]/60" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#292E35] tracking-tight">
            Everything campus life needs.
          </h2>

          <p className="text-[#706A63] text-sm sm:text-base leading-relaxed">
            From discovering events to managing venues, EVA has you covered.
          </p>
        </div>

        {/* 3x2 Grid of Feature Cards (Horizontal layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="bg-white rounded-2xl p-6 border border-[#E4D9CB] shadow-sm hover:shadow-md transition-all duration-300 flex items-start gap-4.5 hover:-translate-y-0.5 group"
              >
                {/* Gold Rounded Square Container */}
                <div className="w-12 h-12 rounded-2xl bg-[#F7EFE6] border border-[#EACBA5]/60 flex items-center justify-center flex-shrink-0 text-[#926B3C] group-hover:scale-105 transition-transform duration-300 shadow-xs">
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>

                {/* Card Title & Description */}
                <div>
                  <h3 className="text-base font-bold text-[#292E35] mb-1 group-hover:text-[#926B3C] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#706A63] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
