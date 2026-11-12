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

  const coordinators = [
    { id: 'COO001', name: 'Rohan Sharma', club: 'Coding Club' },
    { id: 'COO002', name: 'Simran Kaur', club: 'Robotics Society' },
    { id: 'COO003', name: 'Aarav Mehta', club: 'Music Club' },
    { id: 'COO004', name: 'Ananya Verma', club: 'Literary Society' },
    { id: 'COO005', name: 'Kabir Patel', club: 'E-Cell' },
    { id: 'COO006', name: 'Ishita Gupta', club: 'Fine Arts Club' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0F122B] border border-purple-500/30 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 text-white relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight text-white">Evaluator &amp; Demo Credentials</h3>
            <p className="text-xs text-slate-400">Pre-seeded accounts from UCS 503P SRS test fixtures</p>
          </div>
        </div>

        {/* Coordinator Accounts */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              Club Coordinators (All share password: EVA-Demo@2026)
            </div>
            <button
              onClick={() => copyToClipboard('EVA-Demo@2026', 'pass-coo')}
              className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-mono"
            >
              {copiedKey === 'pass-coo' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              Copy Password
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {coordinators.map((c) => (
              <div
                key={c.id}
                className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between hover:border-purple-500/40 transition-colors"
              >
                <div>
                  <div className="text-sm font-bold text-white font-mono flex items-center gap-2">
                    {c.id}
                    <span className="text-[11px] font-normal text-purple-300 px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
                      {c.club}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">{c.name}</div>
                </div>
                <button
                  onClick={() => copyToClipboard(c.id, c.id)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                  title="Copy Coordinator ID"
                >
                  {copiedKey === c.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-3 flex justify-end">
            <Link
              to="/coordinator/login"
              onClick={onClose}
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              Go to Coordinator Login <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Student Accounts */}
        <div className="border-t border-white/10 pt-5">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-blue-400" />
              Student Pre-seeded Accounts (Password: Student@2026)
            </div>
            <button
              onClick={() => copyToClipboard('Student@2026', 'pass-stu')}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-mono"
            >
              {copiedKey === 'pass-stu' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              Copy Password
            </button>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Sample Student 1:</span>
              <span className="font-mono text-white flex items-center gap-2">
                aman.sharma@thapar.edu
                <button
                  onClick={() => copyToClipboard('aman.sharma@thapar.edu', 'stu1')}
                  className="p-1 rounded bg-white/5 hover:bg-white/10"
                >
                  {copiedKey === 'stu1' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Sample Student 2:</span>
              <span className="font-mono text-white flex items-center gap-2">
                priya.patel@thapar.edu
                <button
                  onClick={() => copyToClipboard('priya.patel@thapar.edu', 'stu2')}
                  className="p-1 rounded bg-white/5 hover:bg-white/10"
                >
                  {copiedKey === 'stu2' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </span>
            </div>
            <div className="text-[11px] text-slate-400 pt-1">
              💡 Or click <Link to="/signup" onClick={onClose} className="text-purple-400 underline">Student Sign Up</Link> to create any new account with any name!
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
