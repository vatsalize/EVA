import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Users, Check, ArrowRight } from 'lucide-react';
import studentCharacterImg from '../../assets/redesign/eva-student-matched.png';
import coordinatorCharacterImg from '../../assets/redesign/eva-coordinator-character.png';

export function RoleBenefitsSection() {
  const { isAuthenticated, isStudent, isCoordinator } = useAuth();
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
    <div className="pt-8 sm:pt-10 md:pt-12 pb-8 sm:pb-10 bg-transparent relative">
      
      {/* Main Content Container (Consistent Global Max Width) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          
          {/* Card 1: For Students */}
          <div className="bg-[#FAF5EE] border border-[#EADCCB] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group min-h-[310px] sm:min-h-[330px]">
            
            {/* Header: Full width on single line on desktop */}
            <div className="flex items-center gap-3 mb-5 relative z-20">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#B49168] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                <GraduationCap className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#292E35] tracking-tight whitespace-nowrap">
                For Students
              </h3>
            </div>

            {/* Checklist: Width-constrained to prevent overlapping illustration */}
            <ul className="space-y-3 sm:space-y-3.5 my-1 max-w-[270px] sm:max-w-[300px] relative z-20">
              {studentBenefits.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#EACBA5] text-[#292E35] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span className="text-xs sm:text-[13px] font-medium text-[#292E35] leading-snug">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            {/* Action Button: Anchored to identical baseline */}
            <div className="mt-auto pt-5 sm:pt-6 relative z-20">
              <Link
                to={isAuthenticated && isStudent ? '/student/dashboard' : '/signup'}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-white bg-[#292E35] hover:bg-[#1E2227] px-6 py-2.5 rounded-full shadow-sm hover:shadow transition-all group-hover:translate-x-0.5 hover:scale-105"
              >
                <span>Explore Student Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Character Illustration: Full Architectural Scenery & Trees, 1024x682 Companion Asset */}
            <div className="absolute right-0 bottom-0 h-48 sm:h-56 md:h-64 pointer-events-none select-none z-10 flex items-end justify-end">
              <img
                src={studentCharacterImg}
                alt="Student Illustration with Campus Architecture"
                className="h-full w-auto object-contain object-bottom transform group-hover:scale-102 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Card 2: For Club Coordinators */}
          <div className="bg-[#FAF5EE] border border-[#EADCCB] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group min-h-[310px] sm:min-h-[330px]">
            
            {/* Header: Full width on single line on desktop */}
            <div className="flex items-center gap-3 mb-5 relative z-20">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#B49168] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                <Users className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#292E35] tracking-tight whitespace-nowrap">
                For Club Coordinators
              </h3>
            </div>

            {/* Checklist: Width-constrained to prevent overlapping illustration */}
            <ul className="space-y-3 sm:space-y-3.5 my-1 max-w-[270px] sm:max-w-[300px] relative z-20">
              {coordinatorBenefits.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#EACBA5] text-[#292E35] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span className="text-xs sm:text-[13px] font-medium text-[#292E35] leading-snug">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            {/* Action Button: Anchored to identical baseline */}
            <div className="mt-auto pt-5 sm:pt-6 relative z-20">
              <Link
                to={isAuthenticated && isCoordinator ? '/coordinator/dashboard' : '/coordinator/login'}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#292E35] bg-[#EACBA5] hover:bg-[#DEB887] px-6 py-2.5 rounded-full shadow-sm hover:shadow transition-all group-hover:translate-x-0.5 hover:scale-105"
              >
                <span>Open Coordinator Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Character Illustration: Full Architectural Scenery & Trees, 1024x682 Companion Asset */}
            <div className="absolute right-0 bottom-0 h-48 sm:h-56 md:h-64 pointer-events-none select-none z-10 flex items-end justify-end">
              <img
                src={coordinatorCharacterImg}
                alt="Coordinator Illustration with Campus Architecture"
                className="h-full w-auto object-contain object-bottom transform group-hover:scale-102 transition-transform duration-500"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}