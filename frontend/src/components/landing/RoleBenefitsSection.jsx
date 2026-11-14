import React from 'react';
import { Link } from 'react-router-dom';
import { User, Users, Check, ArrowRight } from 'lucide-react';

export function RoleBenefitsSection() {
  const studentBenefits = [
    'Discover and register for campus events',
    'Track your registrations and check-in status',
    'Share feedback and rate events',
  ];

  const coordinatorBenefits = [
    'Create and manage events',
    'Book and manage campus venues',
    'Track registrations, attendance and feedback',
    'Access real-time event analytics',
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#FAF7F2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
          
          {/* Card 1: For Students */}
          <div className="bg-[#FDFBF7] border border-[#EAE3D6] rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row items-center gap-6 sm:gap-8 group hover:shadow-md transition-shadow">
            
            {/* Student Illustration (Left) */}
            <div className="w-36 sm:w-44 lg:w-48 flex-shrink-0 select-none pointer-events-none">
              <svg
                viewBox="0 0 160 160"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto drop-shadow-sm"
              >
                {/* Background Soft Circle */}
                <circle cx="80" cy="80" r="70" fill="#F4EFE6" />
                
                {/* Student 1 (Male silhouette with backpack) */}
                <circle cx="60" cy="52" r="14" fill="#2E3440" />
                <path d="M42 98 C42 76 50 68 62 68 C74 68 82 76 82 98 L42 98 Z" fill="#4C566A" />
                {/* Backpack */}
                <rect x="36" y="74" width="12" height="26" rx="4" fill="#885E39" />
                <path d="M46 72 Q40 76 40 84" stroke="#D08770" strokeWidth="2" strokeLinecap="round" />

                {/* Student 2 (Female silhouette with pony/backpack) */}
                <circle cx="102" cy="56" r="13" fill="#3B4252" />
                <path d="M102 54 C112 50 116 58 114 66" fill="#3B4252" />
                <path d="M88 100 C88 80 94 72 104 72 C114 72 120 80 120 100 L88 100 Z" fill="#A37B55" />
                {/* Backpack */}
                <rect x="114" y="76" width="10" height="24" rx="3" fill="#D08770" />
              </svg>
            </div>

            {/* Content (Right) */}
            <div className="flex-1 space-y-4 text-left">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#EFE9DF] text-[#7A5533] flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#1F242E]">
                  For Students
                </h3>
              </div>

              {/* Checklist */}
              <ul className="space-y-2.5 text-sm sm:text-base text-[#4E5664]">
                {studentBenefits.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#8C633D] stroke-[2.5] flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/* Action Button */}
              <div className="pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 bg-[#1E232A] hover:bg-black text-white font-medium text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-sm hover:scale-105 transition-all"
                >
                  Student Login
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>

          {/* Card 2: For Coordinators */}
          <div className="bg-[#FDFBF7] border border-[#EAE3D6] rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row items-center gap-6 sm:gap-8 group hover:shadow-md transition-shadow">
            
            {/* Clipboard Illustration (Left) */}
            <div className="w-36 sm:w-44 lg:w-48 flex-shrink-0 select-none pointer-events-none">
              <svg
                viewBox="0 0 160 160"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto drop-shadow-sm"
              >
                {/* Background Soft Circle */}
                <circle cx="80" cy="80" r="70" fill="#F4EFE6" />

                {/* Clipboard Base */}
                <rect x="45" y="35" width="70" height="95" rx="7" fill="#A87B51" stroke="#845934" strokeWidth="2" />
                {/* Clip Mechanism */}
                <rect x="65" y="27" width="30" height="15" rx="3" fill="#D8D1C5" stroke="#7A5533" strokeWidth="1.5" />
                <circle cx="80" cy="33" r="3" fill="#FAF7F2" />

                {/* White Paper Sheet */}
                <rect x="52" y="44" width="56" height="78" rx="4" fill="#FFFFFF" />

                {/* Check items on paper */}
                <path d="M60 58 L63 61 L70 54" stroke="#8C633D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="74" y1="58" x2="98" y2="58" stroke="#D6CBB8" strokeWidth="2" strokeLinecap="round" />

                <path d="M60 74 L63 77 L70 70" stroke="#8C633D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="74" y1="74" x2="98" y2="74" stroke="#D6CBB8" strokeWidth="2" strokeLinecap="round" />

                <path d="M60 90 L63 93 L70 86" stroke="#8C633D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="74" y1="90" x2="98" y2="90" stroke="#D6CBB8" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>

            {/* Content (Right) */}
            <div className="flex-1 space-y-4 text-left">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#F4EFE6] text-[#7A5533] flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#1F242E]">
                  For Coordinators
                </h3>
              </div>

              {/* Checklist */}
              <ul className="space-y-2 text-sm sm:text-base text-[#4E5664]">
                {coordinatorBenefits.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#8C633D] stroke-[2.5] flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/* Action Button */}
              <div className="pt-2">
                <Link
                  to="/coordinator/login"
                  className="inline-flex items-center gap-2 bg-[#B58D67] hover:bg-[#A37B55] text-white font-medium text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-sm hover:scale-105 transition-all"
                >
                  Coordinator Login
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
