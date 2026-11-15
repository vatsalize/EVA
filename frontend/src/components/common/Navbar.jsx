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

  const isActive = (path) => {
    if (path === '/student/dashboard') {
      return location.pathname === '/student/dashboard' || location.pathname === '/student';
    }
    if (path === '/coordinator/dashboard') {
      return location.pathname === '/coordinator/dashboard' || location.pathname === '/coordinator';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#191F24] border-b border-[#262B32] shadow-sm select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left Section: Logo & Full Institute Title (Matching Landing Page Proportions) */}
          <Link
            to={isStudent ? '/student/dashboard' : isCoordinator ? '/coordinator/dashboard' : '/'}
            className="flex items-center gap-3 group cursor-pointer"
          >
            {/* Rounded square gold logo containing the letter E */}
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#B8956B] flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-xs group-hover:scale-105 transition-transform flex-shrink-0">
              <span className="leading-none">E</span>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
                EVA
              </span>
              <span className="w-px h-5 hidden sm:inline-block bg-white/30" />
              <span className="hidden sm:inline-block text-[11px] sm:text-xs font-medium leading-tight text-white/95 max-w-[210px]">
                Thapar Institute of Engineering<br />and Technology
              </span>
            </div>
          </Link>

          {/* Center Section: Navigation Links with Pill-Shaped Active Indicator */}
          <nav className="hidden md:flex items-center justify-center flex-1 mx-4">
            <div className="flex items-center gap-1.5 lg:gap-2">
              {isStudent && (
                <>
                  <Link
                    to="/student/dashboard"
                    className={`text-xs lg:text-sm transition-all duration-200 inline-flex items-center justify-center ${
                      isActive('/student/dashboard')
                        ? 'px-4 py-1.5 rounded-full bg-[#EACBA5] text-[#262B32] font-semibold shadow-sm'
                        : 'px-3.5 py-1.5 rounded-full text-white/80 hover:text-white font-medium'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/student/explore"
                    className={`text-xs lg:text-sm transition-all duration-200 inline-flex items-center justify-center ${
                      isActive('/student/explore')
                        ? 'px-4 py-1.5 rounded-full bg-[#EACBA5] text-[#262B32] font-semibold shadow-sm'
                        : 'px-3.5 py-1.5 rounded-full text-white/80 hover:text-white font-medium'
                    }`}
                  >
                    Explore Events
                  </Link>
                  <Link
                    to="/student/registrations"
                    className={`text-xs lg:text-sm transition-all duration-200 inline-flex items-center justify-center ${
                      isActive('/student/registrations')
                        ? 'px-4 py-1.5 rounded-full bg-[#EACBA5] text-[#262B32] font-semibold shadow-sm'
                        : 'px-3.5 py-1.5 rounded-full text-white/80 hover:text-white font-medium'
                    }`}
                  >
                    My Passes
                  </Link>
                  <Link
                    to="/student/feedback"
                    className={`text-xs lg:text-sm transition-all duration-200 inline-flex items-center justify-center ${
                      isActive('/student/feedback')
                        ? 'px-4 py-1.5 rounded-full bg-[#EACBA5] text-[#262B32] font-semibold shadow-sm'
                        : 'px-3.5 py-1.5 rounded-full text-white/80 hover:text-white font-medium'
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
                    className={`text-xs lg:text-sm transition-all duration-200 inline-flex items-center justify-center ${
                      isActive('/coordinator/dashboard')
                        ? 'px-4 py-1.5 rounded-full bg-[#EACBA5] text-[#262B32] font-semibold shadow-sm'
                        : 'px-3.5 py-1.5 rounded-full text-white/80 hover:text-white font-medium'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/coordinator/events"
                    className={`text-xs lg:text-sm transition-all duration-200 inline-flex items-center justify-center ${
                      isActive('/coordinator/events')
                        ? 'px-4 py-1.5 rounded-full bg-[#EACBA5] text-[#262B32] font-semibold shadow-sm'
                        : 'px-3.5 py-1.5 rounded-full text-white/80 hover:text-white font-medium'
                    }`}
                  >
                    Club Events
                  </Link>
                  <Link
                    to="/coordinator/venues"
                    className={`text-xs lg:text-sm transition-all duration-200 inline-flex items-center justify-center ${
                      isActive('/coordinator/venues')
                        ? 'px-4 py-1.5 rounded-full bg-[#EACBA5] text-[#262B32] font-semibold shadow-sm'
                        : 'px-3.5 py-1.5 rounded-full text-white/80 hover:text-white font-medium'
                    }`}
                  >
                    Venues
                  </Link>
                  <Link
                    to="/coordinator/scanner"
                    className={`text-xs lg:text-sm transition-all duration-200 inline-flex items-center justify-center ${
                      isActive('/coordinator/scanner')
                        ? 'px-4 py-1.5 rounded-full bg-[#EACBA5] text-[#262B32] font-semibold shadow-sm'
                        : 'px-3.5 py-1.5 rounded-full text-white/80 hover:text-white font-medium'
                    }`}
                  >
                    QR Scanner
                  </Link>
                  <Link
                    to="/coordinator/analytics"
                    className={`text-xs lg:text-sm transition-all duration-200 inline-flex items-center justify-center ${
                      isActive('/coordinator/analytics')
                        ? 'px-4 py-1.5 rounded-full bg-[#EACBA5] text-[#262B32] font-semibold shadow-sm'
                        : 'px-3.5 py-1.5 rounded-full text-white/80 hover:text-white font-medium'
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
                    className="px-4 py-1.5 text-xs lg:text-sm font-medium text-white/90 hover:text-white transition-colors"
                  >
                    Student Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-1.5 text-xs lg:text-sm font-medium text-[#262B32] bg-[#EACBA5] hover:bg-[#DFBF99] rounded-full transition-colors shadow-xs"
                  >
                    Student Sign Up
                  </Link>
                  <Link
                    to="/coordinator/login"
                    className="px-4 py-1.5 text-xs lg:text-sm font-medium text-white border border-white/40 hover:border-white rounded-full transition-colors"
                  >
                    Coordinator Portal
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Right Section: User Profile Badge & Logout */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-3">
              <Link
                to={isStudent ? '/student/profile' : '/coordinator/profile'}
                className="flex items-center gap-2.5 p-1.5 pr-3.5 rounded-full hover:bg-white/10 transition-colors border border-white/15"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#B8956B] text-white flex items-center justify-center text-xs font-bold shadow-xs flex-shrink-0">
                  {user?.fullName?.charAt(0) || 'U'}
                </div>
                <div className="text-left text-xs">
                  <div className="font-semibold text-white leading-tight truncate max-w-[120px]">
                    {user?.fullName}
                  </div>
                  <div className="text-[#EACBA5] text-[10px] uppercase font-bold tracking-wider">
                    {user?.role === 'COORDINATOR' ? user.clubName || 'Coordinator' : 'Student'}
                  </div>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                title="Log Out"
                className="p-2 text-white/70 hover:text-[#B83D3D] hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Mobile menu toggle */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white/80 hover:text-white rounded-lg cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#262B32] bg-[#191F24] px-4 pt-3 pb-6 space-y-2">
          {isStudent && (
            <>
              <Link
                to="/student/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                  isActive('/student/dashboard')
                    ? 'bg-[#EACBA5] text-[#262B32] font-semibold'
                    : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/student/explore"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                  isActive('/student/explore')
                    ? 'bg-[#EACBA5] text-[#262B32] font-semibold'
                    : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
              >
                Explore Events
              </Link>
              <Link
                to="/student/registrations"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                  isActive('/student/registrations')
                    ? 'bg-[#EACBA5] text-[#262B32] font-semibold'
                    : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
              >
                My Passes
              </Link>
              <Link
                to="/student/feedback"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                  isActive('/student/feedback')
                    ? 'bg-[#EACBA5] text-[#262B32] font-semibold'
                    : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
              >
                Feedback
              </Link>
              <Link
                to="/student/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                  isActive('/student/profile')
                    ? 'bg-[#EACBA5] text-[#262B32] font-semibold'
                    : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
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
                className={`block px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                  isActive('/coordinator/dashboard')
                    ? 'bg-[#EACBA5] text-[#262B32] font-semibold'
                    : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/coordinator/events"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                  isActive('/coordinator/events')
                    ? 'bg-[#EACBA5] text-[#262B32] font-semibold'
                    : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
              >
                Club Events
              </Link>
              <Link
                to="/coordinator/venues"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                  isActive('/coordinator/venues')
                    ? 'bg-[#EACBA5] text-[#262B32] font-semibold'
                    : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
              >
                Campus Venues
              </Link>
              <Link
                to="/coordinator/scanner"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                  isActive('/coordinator/scanner')
                    ? 'bg-[#EACBA5] text-[#262B32] font-semibold'
                    : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
              >
                QR Entrance Scanner
              </Link>
              <Link
                to="/coordinator/analytics"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                  isActive('/coordinator/analytics')
                    ? 'bg-[#EACBA5] text-[#262B32] font-semibold'
                    : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
              >
                Analytics Dashboard
              </Link>
              <Link
                to="/coordinator/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                  isActive('/coordinator/profile')
                    ? 'bg-[#EACBA5] text-[#262B32] font-semibold'
                    : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
              >
                Coordinator Profile
              </Link>
            </>
          )}

          {isAuthenticated ? (
            <div className="pt-4 border-t border-[#262B32]">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-[#B83D3D] bg-[#B83D3D]/10 hover:bg-[#B83D3D]/20 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-[#262B32] space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-2.5 text-center text-sm font-semibold rounded-xl bg-white/10 text-white"
              >
                Student Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-2.5 text-center text-sm font-semibold rounded-xl bg-[#EACBA5] text-[#262B32]"
              >
                Student Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
