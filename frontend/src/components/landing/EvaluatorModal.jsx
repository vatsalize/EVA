import React, { useState } from 'react';
import { X, Check, Copy, ShieldCheck, UserCheck, Key, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export function EvaluatorModal({ isOpen, onClose }) {
  const [copiedKey, setCopiedKey] = useState(null);

  if (!isOpen) return null;

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#222426] border border-[#B49168]/30 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 text-white relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-[#B49168]/20 border border-[#B49168]/40 text-[#EACBA5]">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight text-white">Evaluator &amp; Demo Credentials</h3>
            <p className="text-xs text-slate-400">Pre-seeded accounts from UCS 503P SRS test fixtures</p>
          </div>
        </div>

        {/* Coordinator Accounts (Password-Protected) */}
        <div className="mb-6 p-4 rounded-2xl bg-white/[0.03] border border-[#B49168]/20">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-bold uppercase tracking-wider text-[#EACBA5] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#B49168]" />
              Club Coordinators (Protected Access)
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
              Password Protected
            </span>
          </div>

          <p className="text-xs text-slate-300 mb-3 leading-relaxed">
            Predefined coordinator demo accounts are restricted and protected with owner verification. To unlock and select demo coordinator accounts, visit the Coordinator Portal.
          </p>

          <div className="flex justify-end">
            <Link
              to="/coordinator/login"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#B49168]/20 hover:bg-[#B49168]/30 border border-[#B49168]/40 text-xs font-semibold text-[#EACBA5] hover:text-white transition-all"
            >
              <span>Unlock on Coordinator Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Student Accounts */}
        <div className="border-t border-white/10 pt-5">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[#EACBA5] flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-[#B49168]" />
              Student Pre-seeded Accounts (Password: Student@2026)
            </div>
            <button
              onClick={() => copyToClipboard('Student@2026', 'pass-stu')}
              className="text-xs text-[#EACBA5] hover:text-white flex items-center gap-1 font-mono"
            >
              {copiedKey === 'pass-stu' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              Copy Password
            </button>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Ishita Singh (STU001):</span>
              <span className="font-mono text-white flex items-center gap-2">
                STU001
                <button
                  onClick={() => copyToClipboard('STU001', 'stu1')}
                  className="p-1 rounded bg-white/5 hover:bg-white/10"
                  title="Copy Student ID"
                >
                  {copiedKey === 'stu1' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Aditya Khanna (STU002):</span>
              <span className="font-mono text-white flex items-center gap-2">
                STU002
                <button
                  onClick={() => copyToClipboard('STU002', 'stu2')}
                  className="p-1 rounded bg-white/5 hover:bg-white/10"
                  title="Copy Student ID"
                >
                  {copiedKey === 'stu2' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </span>
            </div>
            <div className="text-[11px] text-slate-400 pt-1">
              💡 Or click <Link to="/signup" onClick={onClose} className="text-[#EACBA5] underline">Student Sign Up</Link> to create any new account with any name!
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
