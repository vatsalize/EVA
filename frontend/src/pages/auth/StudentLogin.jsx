import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ArrowRight, Eye, EyeOff, Users } from 'lucide-react';
import { DemoAccountModal } from '../../components/auth/DemoAccountModal';

export function StudentLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  const { loginStudent, isAuthenticated, isStudent, isCoordinator } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (isStudent) {
        navigate('/student/dashboard', { replace: true });
      } else if (isCoordinator) {
        navigate('/coordinator/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, isStudent, isCoordinator, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await loginStudent(email, password);
      success('Welcome back to EVA!');
      navigate('/student/dashboard');
    } catch (err) {
      error(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDemoStudent = (student, defaultPassword) => {
    setEmail(student.id);
    setPassword(defaultPassword);
    setDemoModalOpen(false);
  };

  return (
    <div className="w-full max-w-[420px] mx-auto py-2">
      {/* Main Heading & Subtitle */}
      <div className="text-center mb-6">
        <h2 className="text-[32px] sm:text-[34px] lg:text-[36px] font-extrabold text-[#292E35] tracking-tight leading-tight">
          Student Sign In
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-[#5A6068]">
          Sign in to access your student portal.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Institute Email or Student ID */}
        <div>
          <label className="block text-[11px] font-bold text-[#292E35] uppercase tracking-wider mb-1.5">
            INSTITUTE EMAIL OR STUDENT ID
          </label>
          <input
            type="text"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="rollno@thapar.edu or STU001"
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

      {/* View Demo Student Accounts Button */}
      <div className="mt-3.5">
        <button
          type="button"
          onClick={() => setDemoModalOpen(true)}
          className="w-full h-[44px] sm:h-[46px] px-4 bg-[#EDE5DA] hover:bg-[#E3D9CC] border border-[#DECFC0] text-[#292E35] font-semibold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all hover:scale-[1.01] cursor-pointer"
        >
          <Users className="w-4 h-4 text-[#706A63]" />
          <span>View Demo Student Accounts</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#706A63]" />
        </button>
      </div>

      {/* Secondary Registration & Coordinator Links */}
      <div className="mt-5 text-center space-y-1.5">
        <div className="text-xs sm:text-[13px] text-[#6B7280]">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="font-bold text-[#B49168] hover:text-[#926B3C] hover:underline transition-colors"
          >
            Create Student Account
          </Link>
        </div>
        <div>
          <Link
            to="/coordinator/login"
            className="text-xs sm:text-[13px] font-semibold text-[#B49168] hover:text-[#926B3C] hover:underline inline-flex items-center gap-1 transition-colors"
          >
            <span>Coordinator Login</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Demo Student Accounts Selection Modal (Centered Viewport Portal) */}
      <DemoAccountModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        type="student"
        onSelectAccount={handleSelectDemoStudent}
      />
    </div>
  );
}
