import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  ArrowRight,
  Eye,
  EyeOff,
  Users,
  Lock,
  Unlock,
  Shield,
  ShieldCheck,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import api from '../../services/api';
import { DemoAccountModal } from '../../components/auth/DemoAccountModal';

export function CoordinatorLogin() {
  const [coordinatorId, setCoordinatorId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Demo Access States (stored in React state ONLY - never localStorage or sessionStorage)
  const [demoPassword, setDemoPassword] = useState('');
  const [showDemoPassword, setShowDemoPassword] = useState(false);
  const [demoUnlocking, setDemoUnlocking] = useState(false);
  const [demoError, setDemoError] = useState('');
  const [demoAccessToken, setDemoAccessToken] = useState(null);
  const [demoAccounts, setDemoAccounts] = useState([]);
  const [demoDefaultPassword, setDemoDefaultPassword] = useState('');
  const [demoExpiresAt, setDemoExpiresAt] = useState(null);
  const [remainingTime, setRemainingTime] = useState('');
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [isDemoConfigured, setIsDemoConfigured] = useState(true);

  const { loginCoordinator, isAuthenticated, isCoordinator, isStudent } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const timerRef = useRef(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (isCoordinator) {
        navigate('/coordinator/dashboard', { replace: true });
      } else if (isStudent) {
        navigate('/student/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, isCoordinator, isStudent, navigate]);

  // Check demo access configuration status on mount
  useEffect(() => {
    let isMounted = true;
    api.get('/auth/coordinator-demo-status')
      .then((res) => {
        if (isMounted && res.data) {
          setIsDemoConfigured(Boolean(res.data.isConfigured));
        }
      })
      .catch(() => {
        // Fallback: keep enabled on frontend, server enforces strict verification
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Expiration countdown & auto-lock mechanism
  useEffect(() => {
    if (!demoExpiresAt) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const diffMs = demoExpiresAt - now;

      if (diffMs <= 0) {
        // Authorization expired: lock demo section immediately
        handleLockDemo('Demo coordinator authorization has expired. Please unlock again.');
      } else {
        const totalSec = Math.floor(diffMs / 1000);
        const mins = Math.floor(totalSec / 60);
        const secs = totalSec % 60;
        setRemainingTime(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
      }
    };

    updateTimer();
    timerRef.current = setInterval(updateTimer, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [demoExpiresAt]);

  const handleLockDemo = (message = '') => {
    setDemoAccessToken(null);
    setDemoAccounts([]);
    setDemoDefaultPassword('');
    setDemoExpiresAt(null);
    setRemainingTime('');
    setDemoPassword('');
    setDemoModalOpen(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (message) {
      setDemoError(message);
    }
  };

  const handleUnlockDemo = async (e) => {
    e.preventDefault();
    setDemoError('');

    if (!demoPassword.trim()) {
      setDemoError('Please enter the demo access password.');
      return;
    }

    setDemoUnlocking(true);

    try {
      const res = await api.post('/auth/coordinator-demo-access', {
        password: demoPassword.trim()
      });

      if (res.data.success) {
        setDemoAccessToken(res.data.demoAccessToken);
        setDemoAccounts(res.data.accounts || []);
        setDemoDefaultPassword(res.data.defaultPassword || '');
        const expiresAt = Date.now() + (res.data.expiresIn || 900) * 1000;
        setDemoExpiresAt(expiresAt);
        setDemoPassword('');
        setDemoError('');
        setDemoModalOpen(true);
        success('Coordinator demo access unlocked.');
      } else {
        setDemoPassword('');
        setDemoError(res.data.message || 'Incorrect access password. Please try again.');
      }
    } catch (err) {
      setDemoPassword('');
      const serverMsg = err.response?.data?.message;
      setDemoError(serverMsg || 'Incorrect access password. Please try again.');
    } finally {
      setDemoUnlocking(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoading(true);

    try {
      await loginCoordinator(coordinatorId, password, demoAccessToken);
      success('Coordinator portal authenticated.');
      navigate('/coordinator/dashboard');
    } catch (err) {
      error(err.response?.data?.message || 'Authentication failed. Please verify Coordinator ID.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDemoCoordinator = (coord, defaultPass) => {
    const coordPass = defaultPass || demoDefaultPassword;
    setCoordinatorId(coord.id);
    setPassword(coordPass);
    setDemoModalOpen(false);
  };

  const handleQuickLogin = async (coord) => {
    const coordPass = demoDefaultPassword;
    setCoordinatorId(coord.id);
    setPassword(coordPass);
    setLoading(true);

    try {
      await loginCoordinator(coord.id, coordPass, demoAccessToken);
      success(`Logged in as ${coord.name} (${coord.club}).`);
      navigate('/coordinator/dashboard');
    } catch (err) {
      error(err.response?.data?.message || 'Demo authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const isUnlocked = Boolean(demoAccessToken && demoExpiresAt && Date.now() < demoExpiresAt);

  return (
    <div className="w-full max-w-[440px] mx-auto py-2">
      {/* Main Heading & Subtitle */}
      <div className="text-center mb-6">
        <h2 className="text-[32px] sm:text-[34px] lg:text-[36px] font-extrabold text-[#292E35] tracking-tight leading-tight">
          Coordinator Sign In
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-[#5A6068]">
          Sign in to access your coordinator portal.
        </p>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Coordinator ID or Assigned Email */}
        <div>
          <label className="block text-[11px] font-bold text-[#292E35] uppercase tracking-wider mb-1.5">
            COORDINATOR ID OR ASSIGNED EMAIL
          </label>
          <input
            type="text"
            required
            value={coordinatorId}
            onChange={(e) => setCoordinatorId(e.target.value)}
            placeholder="e.g. COO001 or coordinator@thapar.edu"
            className="w-full h-[48px] sm:h-[50px] px-4 bg-white border border-[#E4D9CB] rounded-xl text-sm sm:text-base text-[#292E35] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#B49168] focus:border-transparent transition-all shadow-xs"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-[11px] font-bold text-[#292E35] uppercase tracking-wider mb-1.5">
            PASSWORD
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full h-[48px] sm:h-[50px] pl-4 pr-11 bg-white border border-[#E4D9CB] rounded-xl text-sm sm:text-base text-[#292E35] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#B49168] focus:border-transparent transition-all shadow-xs"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#706A63] hover:text-[#292E35] p-1.5 transition-colors cursor-pointer"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Sign In Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-[50px] sm:h-[52px] px-4 bg-[#292E35] hover:bg-[#1E2227] text-white text-sm sm:text-base font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* ========================================================================= */}
      {/* Coordinator Demo Access — Password Protected Section                     */}
      {/* ========================================================================= */}
      <div className="mt-6 border border-[#E4D9CB] rounded-2xl bg-[#FAF5EE] p-4 sm:p-5 shadow-xs transition-all">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E4D9CB]/70">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${isUnlocked ? 'bg-emerald-500/10 text-emerald-700' : 'bg-[#B49168]/15 text-[#B49168]'}`}>
              {isUnlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#292E35] tracking-tight flex items-center gap-2">
                <span>Coordinator Demo Access</span>
                {isUnlocked && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Unlocked
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-[#706A63]">
                {isUnlocked
                  ? 'Demo coordinator accounts ready for quick evaluation'
                  : 'Protected owner access for predefined demo coordinators'}
              </p>
            </div>
          </div>

          {isUnlocked && (
            <button
              type="button"
              onClick={() => handleLockDemo()}
              className="px-2.5 py-1 text-xs font-semibold text-[#706A63] hover:text-[#292E35] hover:bg-black/5 rounded-lg border border-[#DECFC0] transition-colors cursor-pointer flex items-center gap-1"
              title="Lock demo access immediately"
            >
              <Lock className="w-3 h-3" />
              <span>Lock</span>
            </button>
          )}
        </div>

        {/* LOCKED STATE */}
        {!isUnlocked && (
          <form onSubmit={handleUnlockDemo} className="mt-3.5 space-y-3">
            <div>
              <label className="block text-[10px] font-bold text-[#706A63] uppercase tracking-wider mb-1">
                DEMO ACCESS PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showDemoPassword ? 'text' : 'password'}
                  value={demoPassword}
                  onChange={(e) => {
                    setDemoPassword(e.target.value);
                    if (demoError) setDemoError('');
                  }}
                  placeholder="Enter private demo access password"
                  className="w-full h-[42px] pl-3.5 pr-10 bg-white border border-[#DECFC0] rounded-xl text-xs sm:text-sm text-[#292E35] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#B49168] focus:border-transparent transition-all shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowDemoPassword(!showDemoPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#706A63] hover:text-[#292E35] p-1 transition-colors cursor-pointer"
                  aria-label={showDemoPassword ? 'Hide password' : 'Show password'}
                >
                  {showDemoPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {demoError && (
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 text-xs flex items-center gap-2 animate-in fade-in duration-150">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{demoError}</span>
              </div>
            )}

            {/* Unlock Button */}
            <button
              type="submit"
              disabled={demoUnlocking}
              className="w-full h-[42px] px-4 bg-[#B49168] hover:bg-[#9B774E] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {demoUnlocking ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Unlock Demo Access</span>
                </>
              )}
            </button>

            {!isDemoConfigured && (
              <p className="text-[10px] text-amber-700 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2 text-center">
                Demo access is unconfigured on this deployment.
              </p>
            )}
          </form>
        )}

        {/* UNLOCKED STATE */}
        {isUnlocked && (
          <div className="mt-3.5 space-y-3">
            {/* Active session & timer banner */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 text-xs">
              <div className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Authorization active</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-[11px] font-bold text-emerald-700 bg-emerald-500/15 px-2 py-0.5 rounded-md">
                <Clock className="w-3 h-3" />
                <span>{remainingTime}</span>
              </div>
            </div>

            {/* View Demo Coordinator Accounts Modal Trigger Button */}
            <button
              type="button"
              onClick={() => setDemoModalOpen(true)}
              className="w-full h-[44px] sm:h-[46px] px-4 bg-[#EDE5DA] hover:bg-[#E3D9CC] border border-[#DECFC0] text-[#292E35] font-semibold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all hover:scale-[1.01] cursor-pointer"
            >
              <Users className="w-4 h-4 text-[#706A63]" />
              <span>View Demo Coordinator Accounts</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#706A63]" />
            </button>
          </div>
        )}
      </div>

      {/* Student Sign In Navigation Link */}
      <div className="mt-5 text-center">
        <div className="text-xs sm:text-[13px] text-[#6B7280]">
          Are you a student looking for events?{' '}
          <Link
            to="/login"
            className="font-bold text-[#B49168] hover:text-[#926B3C] hover:underline transition-colors inline-flex items-center gap-1"
          >
            <span>Student Sign In</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Demo Coordinator Accounts Selection Modal */}
      <DemoAccountModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        type="coordinator"
        onSelectAccount={handleSelectDemoCoordinator}
        customAccounts={demoAccounts}
        customDefaultPassword={demoDefaultPassword}
      />
    </div>
  );
}
