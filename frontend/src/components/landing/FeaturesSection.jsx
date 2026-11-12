import React from 'react';
import { Calendar, Layers, ScanLine, Users, Star, BarChart3 } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      id: 1,
      title: 'Event Management',
      description: 'Create, publish and manage events with a simple workflow.',
      icon: Calendar,
      color: 'text-violet-400',
      bgColor: 'bg-violet-500/15',
      borderColor: 'border-violet-500/30',
      glow: 'group-hover:shadow-[0_10px_30px_rgba(139,92,246,0.2)]'
    },
    {
      id: 2,
      title: 'AI Venue Recommendation',
      description: 'Get the best venue with an explainable match score.',
      icon: Layers,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/15',
      borderColor: 'border-blue-500/30',
      glow: 'group-hover:shadow-[0_10px_30px_rgba(59,130,246,0.2)]'
    },
    {
      id: 3,
      title: 'QR-Based Attendance',
      description: 'Secure check-ins with instant footfall tracking.',
      icon: ScanLine,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/15',
      borderColor: 'border-emerald-500/30',
      glow: 'group-hover:shadow-[0_10px_30px_rgba(16,185,129,0.2)]'
    },
    {
      id: 4,
      title: 'Student Registration',
      description: 'Discover and register for events with real-time capacity updates.',
      icon: Users,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/15',
      borderColor: 'border-amber-500/30',
      glow: 'group-hover:shadow-[0_10px_30px_rgba(245,158,11,0.2)]'
    },
    {
      id: 5,
      title: 'Feedback & Ratings',
      description: 'Share your experience and help improve future events.',
      icon: Star,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/15',
      borderColor: 'border-pink-500/30',
      glow: 'group-hover:shadow-[0_10px_30px_rgba(236,72,153,0.2)]'
    },
    {
      id: 6,
      title: 'Analytics Dashboard',
      description: 'Track registrations, footfall, feedback and venue utilization in real time.',
      icon: BarChart3,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/15',
      borderColor: 'border-purple-500/30',
      glow: 'group-hover:shadow-[0_10px_30px_rgba(168,85,247,0.2)]'
    }
  ];

  return (
    <section id="features" className="py-20 md:py-28 relative overflow-hidden bg-[#0B1026]">
      {/* Subtle Ambient Background Gradients */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-3">
            <span className="w-8 h-px bg-purple-500/50" />
            <span className="text-xs font-bold tracking-widest uppercase text-purple-400">
              Core Capabilities
            </span>
            <span className="w-8 h-px bg-purple-500/50" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Everything You Need for Campus Events
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            A unified, intelligent and secure platform for students and club coordinators.
          </p>
        </div>

        {/* 3x2 Grid of Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className={`bg-[#15142F]/90 backdrop-blur-md rounded-2xl p-7 border border-purple-500/20 hover:border-purple-400/50 transition-all duration-300 transform hover:-translate-y-1.5 group shadow-[0_10px_25px_rgba(0,0,0,0.3)] ${feature.glow}`}
              >
                {/* Icon Container */}
                <div className={`w-12 h-12 rounded-xl ${feature.bgColor} ${feature.borderColor} border ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>

                {/* Card Title */}
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-200 transition-colors">
                  {feature.title}
                </h3>

                {/* Card Description */}
                <p className="text-sm text-slate-300 leading-relaxed">
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
