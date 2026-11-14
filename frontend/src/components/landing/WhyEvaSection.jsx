import React from 'react';
import { Zap, ShieldCheck, Rocket, Users2, Leaf } from 'lucide-react';

export function WhyEvaSection() {
  const pillars = [
    {
      id: 1,
      title: 'All-in-One Platform',
      subtitle: 'for events and venues',
      icon: Zap,
    },
    {
      id: 2,
      title: 'Secure & Reliable',
      subtitle: 'with role-based access',
      icon: ShieldCheck,
    },
    {
      id: 3,
      title: 'Faster & Easier',
      subtitle: 'for students and coordinators',
      icon: Rocket,
    },
    {
      id: 4,
      title: 'Greater Engagement',
      subtitle: 'in campus activities',
      icon: Users2,
    },
    {
      id: 5,
      title: 'Scalable & Sustainable',
      subtitle: 'for the growing campus community',
      icon: Leaf,
    },
  ];

  return (
    <section className="py-12 bg-[#F6F2EA] border-t border-b border-[#EAE2D5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Header with Centered Dashes */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center justify-center gap-3 w-full">
            <span className="w-12 sm:w-16 h-px bg-[#D6CBB8]" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#7D532B] tracking-tight">
              Why EVA?
            </h2>
            <span className="w-12 sm:w-16 h-px bg-[#D6CBB8]" />
          </div>
        </div>

        {/* 5 Pillars with Dividers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-0 items-center">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            const isLast = idx === pillars.length - 1;

            return (
              <div
                key={pillar.id}
                className={`flex items-center gap-3 px-3 lg:px-5 ${
                  !isLast ? 'lg:border-r lg:border-[#DFD7CA]' : ''
                }`}
              >
                {/* Icon */}
                <div className="text-[#8C633D] flex-shrink-0">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
                </div>

                {/* Text Content */}
                <div className="text-left">
                  <h4 className="text-sm font-bold text-[#1F242E] leading-tight">
                    {pillar.title}
                  </h4>
                  <p className="text-xs text-[#636C79] leading-tight mt-0.5">
                    {pillar.subtitle}
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
