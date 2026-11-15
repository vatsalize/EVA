import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Users, ArrowRight, Info } from 'lucide-react';
import {
  DEMO_STUDENT_ACCOUNTS,
  DEMO_STUDENT_PASSWORD,
  DEMO_COORDINATOR_ACCOUNTS,
  DEMO_COORDINATOR_PASSWORD,
  getInitials,
} from '../../data/demoAccounts';

export function DemoAccountModal({ isOpen, onClose, type = 'student', onSelectAccount }) {
  const modalRef = useRef(null);
  const isCoordinator = type === 'coordinator';

  const accounts = isCoordinator ? DEMO_COORDINATOR_ACCOUNTS : DEMO_STUDENT_ACCOUNTS;
  const defaultPassword = isCoordinator ? DEMO_COORDINATOR_PASSWORD : DEMO_STUDENT_PASSWORD;
  const title = isCoordinator ? 'Demo Coordinator Accounts' : 'Demo Student Accounts';
  const subtitle = 'Choose an account to explore EVA.';

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/10 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-account-modal-title"
    >
      {/* Centered Modal Window Overlapping Both Photograph & Login Panel */}
      <div
        ref={modalRef}
        className="bg-[#FAF5EE] border border-[#EADCCB] rounded-[24px] max-w-[460px] w-full p-6 sm:p-7 shadow-[0_25px_60px_-15px_rgba(41,46,53,0.35),0_10px_25px_-5px_rgba(41,46,53,0.15)] relative animate-in zoom-in-95 duration-200 text-[#292E35]"
      >
        {/* Close Button in Upper-Right Corner */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 sm:top-6 sm:right-6 p-2 rounded-full text-[#706A63] hover:text-[#292E35] hover:bg-black/5 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-[#EACBA5]/50 border border-[#B49168]/30 flex items-center justify-center text-[#292E35] shadow-xs flex-shrink-0">
            <Users className="w-5 h-5 text-[#292E35]" />
          </div>
          <div>
            <h3 id="demo-account-modal-title" className="text-xl font-bold text-[#292E35] tracking-tight">
              {title}
            </h3>
            <p className="text-xs text-[#706A63]">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-b border-[#EADCCB] mb-4" />

        {/* Scrollable Account List */}
        <div className="max-h-[300px] sm:max-h-[330px] overflow-y-auto space-y-2.5 pr-1.5">
          {accounts.map((acc) => {
            const initials = getInitials(acc.name);
            return (
              <div
                key={acc.id}
                className="bg-white/85 border border-[#EADCCB] rounded-2xl p-3 sm:p-3.5 flex items-center justify-between hover:border-[#B49168] hover:bg-white transition-all shadow-xs group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Initials Avatar */}
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#EDE5DA] text-[#292E35] font-bold text-xs sm:text-sm flex items-center justify-center border border-[#DECFC0] flex-shrink-0 group-hover:bg-[#EACBA5] transition-colors">
                    {initials}
                  </div>

                  {/* Account Details */}
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-[#292E35] truncate">
                      {acc.name}
                    </div>
                    <div className="text-xs text-[#706A63] font-medium flex items-center gap-1.5 truncate">
                      <span className="font-semibold text-[#292E35]">{acc.id}</span>
                      <span>•</span>
                      <span>{isCoordinator ? acc.club : acc.role || 'Student'}</span>
                    </div>
                  </div>
                </div>

                {/* Use Account Action Button */}
                <button
                  type="button"
                  onClick={() => onSelectAccount(acc, defaultPassword)}
                  className="bg-[#292E35] hover:bg-[#1E2227] text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer flex-shrink-0 ml-3"
                >
                  <span>Use Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Informational Message */}
        <div className="flex items-center gap-2 text-xs text-[#5A6068] mt-4 mb-3.5 pt-1">
          <Info className="w-4 h-4 text-[#B49168] flex-shrink-0" />
          <span>Selecting an account will automatically fill in its demo credentials.</span>
        </div>

        {/* Full-width Outlined Cancel Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 sm:py-3 border border-[#292E35]/40 hover:border-[#292E35] hover:bg-[#292E35]/5 text-[#292E35] font-semibold text-xs sm:text-sm rounded-xl transition-all cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>,
    document.body
  );
}
