import React from 'react';
import { Calendar, Building2, Users2, BarChart3 } from 'lucide-react';

export function StatisticsSection({ stats, loading }) {
  const statItems = [
    {
      value: stats?.events || 9,
      label: 'Active Events',
      icon: Calendar,
      color: 'text-violet-400',
      bgColor: 'bg-violet-500/10',
      borderColor: 'border-violet-500/20'
    },
    {
      value: stats?.venues || 8,
      label: 'Campus Venues',
      icon: Building2,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      value: stats?.clubs || 6,
      label: 'College Clubs',
      icon: Users2,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    },
    {
      value: '100%',
      label: 'Digital & Paperless',
      icon: BarChart3,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20'
    }
  ];

  return (
    <section className="relative z-10 py-8 border-y border-white/5 bg-[#0B1026]/60 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {statItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 hover:bg-white/[0.04] transition-all duration-300 group"
              >
                <div className={`p-3 rounded-xl ${item.bgColor} ${item.borderColor} border ${item.color} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center">
                    {loading ? (
                      <span className="w-8 h-8 rounded bg-white/10 animate-pulse inline-block" />
                    ) : (
                      item.value
                    )}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-slate-400 mt-0.5">
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
