import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Users, Check, ArrowRight } from 'lucide-react';
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
    <section id="about" className="py-12 md:py-16 bg-[#F8F5F1] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Card 1: For Students */}
          <div className="bg-[#F7EFE6] border border-[#E4D9CB] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
            <div className="relative z-10 max-w-sm sm:max-w-md">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#B49168] text-white flex items-center justify-center shadow-sm">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-bold text-[#292E35] tracking-tight">
                  For Students
                </h3>
              </div>

              {/* Checklist */}
              <ul className="space-y-3.5 mb-8">
                {studentBenefits.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#EACBA5] text-[#292E35] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className="text-sm sm:text-base font-medium text-[#292E35] leading-snug">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Action Button */}
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-[#292E35] hover:bg-[#1E2227] px-6 py-2.5 rounded-full shadow-sm hover:shadow transition-all group-hover:translate-x-0.5 hover:scale-105"
              >
                <span>Explore Student Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Illustration Avatar */}
            <div className="absolute right-0 bottom-0 sm:right-2 w-36 sm:w-44 md:w-52 pointer-events-none select-none">
              <img
                src={studentAvatarImg}
                alt="Student Illustration"
                className="w-full h-auto object-contain transform group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Card 2: For Club Coordinators */}
          <div className="bg-[#F7EFE6] border border-[#E4D9CB] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
            <div className="relative z-10 max-w-sm sm:max-w-md">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#B49168] text-white flex items-center justify-center shadow-sm">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-bold text-[#292E35] tracking-tight">
                  For Club Coordinators
                </h3>
              </div>

              {/* Checklist */}
              <ul className="space-y-3.5 mb-8">
                {coordinatorBenefits.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#EACBA5] text-[#292E35] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className="text-sm sm:text-base font-medium text-[#292E35] leading-snug">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Action Button */}
              <Link
                to="/coordinator/login"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#292E35] bg-[#EACBA5] hover:bg-[#DEB887] px-6 py-2.5 rounded-full shadow-sm hover:shadow transition-all group-hover:translate-x-0.5 hover:scale-105"
              >
                <span>Open Coordinator Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Illustration Avatar */}
            <div className="absolute right-0 bottom-0 sm:right-2 w-36 sm:w-44 md:w-52 pointer-events-none select-none">
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
