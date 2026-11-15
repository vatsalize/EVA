import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ArrowRight, Eye, EyeOff, ChevronDown } from 'lucide-react';

export function StudentSignup() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    studentId: '',
    department: 'Computer Engineering',
    yearOfStudy: '2',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signupStudent, isAuthenticated, isStudent, isCoordinator } = useAuth();
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      error('Password and confirm password do not match.');
      return;
    }

    if (formData.password.length < 6) {
      error('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await signupStudent(formData);
      success('Account created successfully! Welcome to EVA.');
      navigate('/student/dashboard');
    } catch (err) {
      error(err.response?.data?.message || 'Registration failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[420px] mx-auto py-2">
      {/* Main Heading & Subtitle */}
      <div className="text-center mb-6">
        <h2 className="text-[32px] sm:text-[34px] lg:text-[36px] font-extrabold text-[#292E35] tracking-tight leading-tight">
          Create Student Account
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-[#5A6068]">
          Join the Thapar campus event network with your institute details.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Row 1 — Full width: FULL NAME */}
        <div>
          <label className="block text-[11px] font-bold text-[#292E35] uppercase tracking-wider mb-1.5">
            FULL NAME
          </label>
          <input
            type="text"
            required
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="e.g. Rohan Sharma"
            className="w-full h-[48px] sm:h-[50px] px-4 bg-white border border-[#E4D9CB] rounded-xl text-sm sm:text-base text-[#292E35] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#B49168] focus:border-transparent transition-all shadow-xs"
          />
        </div>

        {/* Row 2 — Two equal columns: INSTITUTE EMAIL & STUDENT ID / ROLL NO. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
          <div>
            <label className="block text-[11px] font-bold text-[#292E35] uppercase tracking-wider mb-1.5">
              INSTITUTE EMAIL
            </label>
            <input
              type="email"
              required
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="rsharma@thapar.edu"
              className="w-full h-[48px] sm:h-[50px] px-4 bg-white border border-[#E4D9CB] rounded-xl text-sm sm:text-base text-[#292E35] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#B49168] focus:border-transparent transition-all shadow-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#292E35] uppercase tracking-wider mb-1.5">
              STUDENT ID / ROLL NO.
            </label>
            <input
              type="text"
              required
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              placeholder="e.g. 1024030626"
              className="w-full h-[48px] sm:h-[50px] px-4 bg-white border border-[#E4D9CB] rounded-xl text-sm sm:text-base text-[#292E35] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#B49168] focus:border-transparent transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Row 3 — Two equal columns: DEPARTMENT & YEAR OF STUDY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
          <div>
            <label className="block text-[11px] font-bold text-[#292E35] uppercase tracking-wider mb-1.5">
              DEPARTMENT
            </label>
            <div className="relative">
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full h-[48px] sm:h-[50px] px-4 bg-white border border-[#E4D9CB] rounded-xl text-sm sm:text-base text-[#292E35] focus:outline-none focus:ring-2 focus:ring-[#B49168] focus:border-transparent transition-all shadow-xs appearance-none pr-8 cursor-pointer"
              >
                <option value="Computer Engineering">Computer Engineering</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Electrical & Instrumentation">Electrical & Instrumentation</option>
                <option value="Biotechnology">Biotechnology</option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#706A63]">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#292E35] uppercase tracking-wider mb-1.5">
              YEAR OF STUDY
            </label>
            <div className="relative">
              <select
                name="yearOfStudy"
                value={formData.yearOfStudy}
                onChange={handleChange}
                className="w-full h-[48px] sm:h-[50px] px-4 bg-white border border-[#E4D9CB] rounded-xl text-sm sm:text-base text-[#292E35] focus:outline-none focus:ring-2 focus:ring-[#B49168] focus:border-transparent transition-all shadow-xs appearance-none pr-8 cursor-pointer"
              >
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
                <option value="5">Postgraduate</option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#706A63]">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Row 4 — Two equal columns: PASSWORD & CONFIRM PASSWORD */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
          <div>
            <label className="block text-[11px] font-bold text-[#292E35] uppercase tracking-wider mb-1.5">
              PASSWORD
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
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

          <div>
            <label className="block text-[11px] font-bold text-[#292E35] uppercase tracking-wider mb-1.5">
              CONFIRM PASSWORD
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full h-[48px] sm:h-[50px] pl-4 pr-11 bg-white border border-[#E4D9CB] rounded-xl text-sm sm:text-base text-[#292E35] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#B49168] focus:border-transparent transition-all shadow-xs"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#706A63] hover:text-[#292E35] p-1.5 transition-colors cursor-pointer"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Complete Registration Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-[50px] sm:h-[52px] px-4 bg-[#292E35] hover:bg-[#1E2227] text-white text-sm sm:text-base font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>Complete Registration</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Bottom Navigation */}
      <div className="mt-5 text-center">
        <div className="text-xs sm:text-[13px] text-[#6B7280]">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-bold text-[#B49168] hover:text-[#926B3C] hover:underline transition-colors inline-flex items-center gap-1"
          >
            <span>Sign In</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
