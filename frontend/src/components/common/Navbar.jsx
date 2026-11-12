import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar, 
  Compass, 
  Ticket, 
  MessageSquare, 
  User, 
  LogOut, 
  Menu, 
  X, 
  BarChart3, 
  Scan, 
  Building2, 
  PlusCircle, 
  Layers 
} from 'lucide-react';

export function Navbar() {
  const { user, isAuthenticated, isStudent, isCoordinator, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Name */}
          <Link to={isStudent ? '/student/dashboard' : isCoordinator ? '/coordinator/dashboard' : '/'} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-900 flex items-center justify-center text-white font-black text-xl shadow-md">
              E
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900">EVA</span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                TIET
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {isStudent && (
              <>
                <Link
                  to="/student/dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/student/dashboard')
                      ? 'bg-brand-50 text-brand-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/student/explore"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/student/explore')
                      ? 'bg-brand-50 text-brand-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Explore Events
                </Link>
                <Link
                  to="/student/registrations"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/student/registrations')
                      ? 'bg-brand-50 text-brand-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  My Passes
                </Link>
                <Link
                  to="/student/feedback"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/student/feedback')
                      ? 'bg-brand-50 text-brand-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Feedback
                </Link>
              </>
            )}

            {isCoordinator && (
              <>
                <Link
                  to="/coordinator/dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/coordinator/dashboard')
                      ? 'bg-brand-50 text-brand-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/coordinator/events"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/coordinator/events')
                      ? 'bg-brand-50 text-brand-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Club Events
                </Link>
                <Link
                  to="/coordinator/venues"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/coordinator/venues')
                      ? 'bg-brand-50 text-brand-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Venues
                </Link>
                <Link
                  to="/coordinator/scanner"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/coordinator/scanner')
                      ? 'bg-brand-50 text-brand-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  QR Scanner
                </Link>
                <Link
                  to="/coordinator/analytics"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/coordinator/analytics')
                      ? 'bg-brand-50 text-brand-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Analytics
                </Link>
              </>
            )}

            {!isAuthenticated && (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
                >
                  Student Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium text-brand-900 bg-brand-50 hover:bg-brand-100 rounded-xl transition-colors border border-brand-200"
                >
                  Student Sign Up
                </Link>
                <Link
                  to="/coordinator/login"
                  className="px-4 py-2 text-sm font-medium text-white bg-brand-900 hover:bg-brand-800 rounded-xl transition-colors shadow-sm"
                >
                  Coordinator Portal
                </Link>
              </div>
            )}
          </nav>

          {/* User Profile & Actions */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-3">
              <Link
                to={isStudent ? '/student/profile' : '/coordinator/profile'}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-slate-100 transition-colors border border-slate-200"
              >
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                  {user?.fullName?.charAt(0) || 'U'}
                </div>
                <div className="text-left text-xs">
                  <div className="font-semibold text-slate-900 leading-tight truncate max-w-[120px]">
                    {user?.fullName}
                  </div>
                  <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                    {user?.role === 'COORDINATOR' ? user.clubName || 'Coordinator' : 'Student'}
                  </div>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                title="Log Out"
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          {isStudent && (
            <>
              <Link
                to="/student/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                Dashboard
              </Link>
              <Link
                to="/student/explore"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                Explore Events
              </Link>
              <Link
                to="/student/registrations"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                My Passes
              </Link>
              <Link
                to="/student/feedback"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                Feedback
              </Link>
              <Link
                to="/student/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                My Profile
              </Link>
            </>
          )}

          {isCoordinator && (
            <>
              <Link
                to="/coordinator/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                Dashboard
              </Link>
              <Link
                to="/coordinator/events"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                Club Events
              </Link>
              <Link
                to="/coordinator/venues"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                Campus Venues
              </Link>
              <Link
                to="/coordinator/scanner"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                QR Entrance Scanner
              </Link>
              <Link
                to="/coordinator/analytics"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                Analytics Dashboard
              </Link>
              <Link
                to="/coordinator/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                Coordinator Profile
              </Link>
            </>
          )}

          {!isAuthenticated ? (
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-2.5 text-center text-sm font-semibold rounded-xl bg-slate-100 text-slate-800"
              >
                Student Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-2.5 text-center text-sm font-semibold rounded-xl bg-brand-50 text-brand-900 border border-brand-200"
              >
                Student Sign Up
              </Link>
              <Link
                to="/coordinator/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-2.5 text-center text-sm font-semibold rounded-xl bg-brand-900 text-white"
              >
                Coordinator Login
              </Link>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-red-600 bg-red-50 rounded-xl"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
