import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Shield, LogIn, ArrowRight } from 'lucide-react';

export function CoordinatorLogin() {
  const [coordinatorId, setCoordinatorId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginCoordinator } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await loginCoordinator(coordinatorId, password);
      success('Coordinator portal authenticated.');
      navigate('/coordinator/dashboard');
    } catch (err) {
      error(err.response?.data?.message || 'Authentication failed. Please verify Coordinator ID.');
    } finally {
      setLoading(false);
    }
  };

  const selectDemoCoord = (id) => {
    setCoordinatorId(id);
    setPassword('EVA-Demo@2026');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-2xl shadow-lg">
            E
          </div>
        </Link>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-3">
          <Shield className="w-3.5 h-3.5" />
          Pre-Authorized Staff & Coordinators Only
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight">Coordinator Portal</h2>
        <p className="mt-2 text-sm text-slate-400">
          Sign in to manage club events, book venues, and monitor live attendance.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-800/90 py-8 px-6 shadow-2xl rounded-3xl border border-slate-700 sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Coordinator ID or Assigned Email
              </label>
              <input
                type="text"
                required
                value={coordinatorId}
                onChange={(e) => setCoordinatorId(e.target.value)}
                placeholder="e.g. COO001 or aarav.sharma@eva-demo.test"
                className="w-full px-4 py-3 text-sm bg-slate-900/80 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 text-sm bg-slate-900/80 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Authenticate Portal</span>
                  <LogIn className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Predefined Coordinators Selector */}
          <div className="mt-6 pt-5 border-t border-slate-700/60">
            <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Quick Test: Select Predefined Coordinator
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => selectDemoCoord('COO001')}
                className="py-1.5 px-2 text-xs bg-slate-700/70 hover:bg-slate-700 text-slate-200 rounded-lg text-center transition-colors"
              >
                COO001<br /><span className="text-[10px] text-slate-400">Coding Club</span>
              </button>
              <button
                type="button"
                onClick={() => selectDemoCoord('COO002')}
                className="py-1.5 px-2 text-xs bg-slate-700/70 hover:bg-slate-700 text-slate-200 rounded-lg text-center transition-colors"
              >
                COO002<br /><span className="text-[10px] text-slate-400">Robotics</span>
              </button>
              <button
                type="button"
                onClick={() => selectDemoCoord('COO003')}
                className="py-1.5 px-2 text-xs bg-slate-700/70 hover:bg-slate-700 text-slate-200 rounded-lg text-center transition-colors"
              >
                COO003<br /><span className="text-[10px] text-slate-400">Cultural</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-2">
              Default password for all test coordinators is <code>EVA-Demo@2026</code>
            </p>
          </div>

          <div className="mt-6 text-center text-xs text-slate-400">
            Are you a student looking for events?{' '}
            <Link to="/login" className="font-semibold text-blue-400 hover:underline">
              Student Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
