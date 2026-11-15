import React from 'react';

export function Footer() {
  return (
    <footer className="bg-[#EDE5D9] border-t border-[#DFD0BE] mt-auto py-8 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#68635D]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#262B32]">EVA</span>
            <span className="text-[#B8956B]">•</span>
            <span>Smart College Event & Venue Management Platform</span>
          </div>

          <div className="font-medium text-[#262B32]">
            Thapar Institute of Engineering and Technology (UCS 503P)
          </div>

          <div className="text-[#68635D]">
            Software Engineering Project • July-Dec 2026
          </div>
        </div>
      </div>
    </footer>
  );
}
