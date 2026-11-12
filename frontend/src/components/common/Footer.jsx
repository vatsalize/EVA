import React from 'react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">EVA</span>
            <span>•</span>
            <span>Smart College Event & Venue Management Platform</span>
          </div>

          <div>
            Thapar Institute of Engineering and Technology (UCS 503P)
          </div>

          <div className="text-slate-400">
            Software Engineering Project • July-Dec 2026
          </div>
        </div>
      </div>
    </footer>
  );
}
