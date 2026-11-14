import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Users2, Check, ArrowRight } from 'lucide-react';
import studentAvatarImg from '../../assets/redesign/student_avatar.png';
import coordinatorAvatarImg from '../../assets/redesign/coordinator_avatar.png';

export function RoleBenefitsSection() {
  const studentBenefits = [
    'Discover and register for campus events',
    'Get a unique digital QR pass',
    'Share feedback after attending',
    'Track your registered events'
  ];

  const coordinatorBenefits = [
    'Create and manage club events',
    'Book venues with AI recommendations',
    'Scan QR codes and track attendance',
    'View detailed event analytics'
  ];

  return (
    <section id="about" className="py-12 md:py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Card 1: For Students */}
          <div className="bg-gradient-to-br from-[#F5F0FF] via-[#EFE8FF] to-[#E5EAFF] border border-purple-200/90 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
            <div className="relative z-10 max-w-sm sm:max-w-md">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/30">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  For Students
                </h3>
              </div>

              {/* Checklist */}
              <ul className="space-y-3.5 mb-8">
                {studentBenefits.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-purple-200/80 text-purple-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    <span className="text-sm sm:text-base font-medium text-slate-700 leading-snug">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Action Button */}
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 text-sm font-bold text-purple-700 hover:text-purple-900 bg-white/80 hover:bg-white border border-purple-200 px-5 py-2.5 rounded-full shadow-sm hover:shadow transition-all group-hover:translate-x-1"
              >
                Explore Student Portal
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Illustration Avatar */}
            <div className="absolute right-2 bottom-0 sm:right-4 w-32 sm:w-40 md:w-44 pointer-events-none select-none">
              <img
                src={studentAvatarImg}
                alt="Student Illustration"
                className="w-full h-auto object-contain transform group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Card 2: For Club Coordinators */}
          <div className="bg-gradient-to-br from-[#EFF6FF] via-[#E6F0FA] to-[#E0E7FF] border border-blue-200/90 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
            <div className="relative z-10 max-w-sm sm:max-w-md">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/30">
                  <Users2 className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  For Club Coordinators
                </h3>
              </div>

              {/* Checklist */}
              <ul className="space-y-3.5 mb-8">
                {coordinatorBenefits.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-200/80 text-blue-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    <span className="text-sm sm:text-base font-medium text-slate-700 leading-snug">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Action Button */}
              <Link
                to="/coordinator/login"
                className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900 bg-white/80 hover:bg-white border border-blue-200 px-5 py-2.5 rounded-full shadow-sm hover:shadow transition-all group-hover:translate-x-1"
              >
                Open Coordinator Portal
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Illustration Avatar */}
            <div className="absolute right-2 bottom-0 sm:right-4 w-32 sm:w-40 md:w-44 pointer-events-none select-none">
              <img
                src={coordinatorAvatarImg}
                alt="Coordinator Illustration"
                className="w-full h-auto object-contain transform group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
