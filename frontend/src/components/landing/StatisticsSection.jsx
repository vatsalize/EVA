import React from 'react';
import { Calendar, Building2, Users2, BarChart3 } from 'lucide-react';

export function StatisticsSection({ stats, loading }) {
  const statItems = [
    {
      value: stats?.events || 9,
      label: 'Active Events',
      icon: Calendar,
    },
    {
      value: stats?.venues || 8,
      label: 'Campus Venues',
      icon: Building2,
    },
    {
      value: stats?.clubs || 6,
      label: 'College Clubs',
      icon: Users2,
    },
    {
      value: '100%',
      label: 'Digital & Paperless',
      icon: BarChart3,
    }
  ];

  return (
    <section id="analytics" className="relative z-10 pt-16 pb-10 bg-[#F8F5F1] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Subsection Header: LIVE AT TIET */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-[#B49168]/60" />
            <span className="text-xs font-bold tracking-widest uppercase text-[#B49168]">
              LIVE AT TIET
            </span>
            <span className="w-8 h-px bg-[#B49168]/60" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#292E35] tracking-tight">
            Campus at a Glance
          </h2>

          <p className="text-[#706A63] text-sm sm:text-base leading-relaxed">
            Real-time data from EVA, keeping you updated on campus events and activity.
          </p>
        </div>

        {/* 4 Live Statistics Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-[#E4D9CB] p-5 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4.5 group"
              >
                {/* Gold Circle Icon Container */}
                <div className="w-13 h-13 rounded-full bg-[#F7EFE6] border border-[#EACBA5]/60 flex items-center justify-center flex-shrink-0 text-[#926B3C] group-hover:scale-105 transition-transform duration-300">
                  <Icon className="w-6 h-6 stroke-[2]" />
                </div>

                {/* Number & Label */}
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#292E35] tracking-tight flex items-center">
                    {loading ? (
                      <span className="w-10 h-8 rounded bg-[#EDE5DA] animate-pulse inline-block" />
                    ) : (
                      item.value
                    )}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-[#706A63] mt-0.5">
                    {item.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
