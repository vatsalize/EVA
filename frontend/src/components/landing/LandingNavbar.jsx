import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, ArrowRight, Sparkles, Key } from 'lucide-react';

export function LandingNavbar({ onOpenCredentials }) {
  const { isAuthenticated, isStudent, isCoordinator, user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['home', 'features', 'how-it-works', 'analytics', 'about'];
      const scrollPosition = window.scrollY + 120;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home', id: 'home' },
    { name: 'Features', href: '#features', id: 'features' },
    { name: 'How it Works', href: '#how-it-works', id: 'how-it-works' },
    { name: 'Analytics', href: '#analytics', id: 'analytics' },
    { name: 'About', href: '#about', id: 'about' },
  ];

  const scrollToSection = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0B1026]/90 backdrop-blur-md border-b border-purple-500/15 shadow-lg shadow-black/40'
          : 'bg-transparent border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left Section: Logo & Full Institute Title */}
        <div className="flex items-center gap-3">
          <a
            href="#home"
            onClick={(e) => scrollToSection(e, '#home')}
            className="flex items-center gap-3 group"
          >
            {/* Stylized Violet/Purple "E" Icon */}
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-violet-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-lg sm:text-xl shadow-[0_0_15px_rgba(168,85,247,0.4)] group-hover:scale-105 transition-transform">
              <span className="tracking-tight">E</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white">EVA</span>
              <span className="text-slate-400 font-light hidden sm:inline-block">|</span>
              <span className="hidden sm:inline-block text-xs sm:text-sm font-medium text-slate-100/90 tracking-normal">
                Thapar Institute Of Engineering and Technology
              </span>
            </div>
          </a>
        </div>

        {/* Center Section: Navigation Links */}
        <nav className="hidden md:flex items-center">
          <div className="flex items-center gap-1 sm:gap-2">
            {navLinks.filter(l => l.id !== 'analytics').map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className={`px-3.5 py-1 rounded-full text-xs lg:text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-purple-900/60 text-white border border-purple-500/40 shadow-sm font-semibold'
                      : 'text-slate-200 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </div>
        </nav>

        {/* Right Section: Auth Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <Link
              to={isStudent ? '/student/dashboard' : '/coordinator/dashboard'}
              className="px-5 py-2 text-xs lg:text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.35)] transition-all flex items-center gap-2 hover:scale-105"
            >
              Dashboard ({user?.full_name?.split(' ')[0] || (isStudent ? 'Student' : 'Coordinator')})
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-5 py-2 text-xs lg:text-sm font-medium text-white bg-black/40 hover:bg-black/60 border border-white/30 hover:border-white/50 rounded-full backdrop-blur-md transition-all hover:scale-105"
              >
                Student Login
              </Link>
              <Link
                to="/coordinator/login"
                className="px-5 py-2 text-xs lg:text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] transition-all hover:scale-105"
              >
                Coordinator Login
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center gap-2">
          {onOpenCredentials && (
            <button
              onClick={onOpenCredentials}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300"
            >
              <Key className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B1026]/95 backdrop-blur-xl border-b border-purple-500/20 px-4 pt-4 pb-6 space-y-4">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  activeSection === link.id
                    ? 'bg-purple-600/20 text-purple-300 font-semibold border border-purple-500/30'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
            {isAuthenticated ? (
              <Link
                to={isStudent ? '/student/dashboard' : '/coordinator/dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-sm font-medium text-slate-200 bg-white/5 border border-white/10 rounded-xl"
                >
                  Student Login
                </Link>
                <Link
                  to="/coordinator/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl"
                >
                  Coordinator Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
