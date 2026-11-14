import React from 'react';
import { Calendar, MapPin, Users, QrCode, MessageSquare, BarChart3 } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      id: 1,
      title: 'Event Management',
      description: 'Create, publish and manage events with ease.',
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
    <section id="features" className="py-16 sm:py-20 bg-[#FAF7F2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Centered Dashes */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
          <div className="inline-flex items-center justify-center gap-3 w-full">
            <span className="w-12 sm:w-16 h-px bg-[#D6CBB8]" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#7D532B] tracking-tight">
              Key Features
            </h2>
            <span className="w-12 sm:w-16 h-px bg-[#D6CBB8]" />
          </div>
        </div>

        {/* 6 Feature Cards in a responsive row/grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="bg-white rounded-2xl p-5 border border-[#ECE5D8] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-start text-left group"
              >
                {/* Icon Container with Warm Beige Background */}
                <div className="w-11 h-11 rounded-xl bg-[#F4EFE6] border border-[#E9E0D2] flex items-center justify-center text-[#8C633D] mb-4 group-hover:scale-105 transition-transform flex-shrink-0">
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-[#1F242E] mb-2 leading-snug">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#5F6773] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
