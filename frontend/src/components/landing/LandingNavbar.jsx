import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, ArrowRight, GraduationCap, Users, Key } from 'lucide-react';

export function LandingNavbar({ onOpenCredentials }) {
  const { isAuthenticated, isStudent, isCoordinator, user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const isClickScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);

      // Do not override active highlight while smooth scrolling from click
      if (isClickScrollingRef.current) return;

      // When at or near the very bottom of the page, activate 'about'
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60) {
        setActiveSection('about');
        return;
      }

      // Calculate effective scroll anchor point (viewport top + header offset)
      const scrollPosition = window.scrollY + 180;

      const getTop = (id) => {
        const el = document.getElementById(id);
        if (!el) return Infinity;
        return el.getBoundingClientRect().top + window.scrollY;
      };

      const featuresTop = getTop('features');
      const howItWorksTop = getTop('how-it-works');
      const aboutTop = getTop('about');

      if (scrollPosition >= aboutTop) {
        setActiveSection('about');
      } else if (scrollPosition >= howItWorksTop) {
        setActiveSection('how-it-works');
      } else if (scrollPosition >= featuresTop) {
        setActiveSection('features');
      } else {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home', id: 'home' },
    { name: 'Features', href: '#features', id: 'features' },
    { name: 'How It Works', href: '#how-it-works', id: 'how-it-works' },
    { name: 'About', href: '#about', id: 'about' },
  ];

  const scrollToSection = (e, linkId, href) => {
    e.preventDefault();
    if (linkId) {
      setActiveSection(linkId);
      isClickScrollingRef.current = true;
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        isClickScrollingRef.current = false;
      }, 1000);
    }
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
          ? 'bg-[#F8F5F1]/95 backdrop-blur-md border-b border-[#E4D9CB] shadow-sm py-2.5'
          : 'bg-transparent border-b border-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Left Section: Logo & Full Institute Title */}
        <div className="flex items-center gap-3">
          <a
            href="#home"
            onClick={(e) => scrollToSection(e, 'home', '#home')}
            className="flex items-center gap-3 group cursor-pointer"
          >
            {/* Rounded square gold logo containing the letter E */}
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#B49168] flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-sm group-hover:scale-105 transition-transform flex-shrink-0">
              <span className="leading-none">E</span>
            </div>

            <div className="flex items-center gap-2.5">
              <span
                className={`text-xl sm:text-2xl font-black tracking-tight transition-colors ${
                  isScrolled ? 'text-[#292E35]' : 'text-white'
                }`}
              >
                EVA
              </span>
              <span
                className={`w-px h-5 hidden sm:inline-block transition-colors ${
                  isScrolled ? 'bg-[#E4D9CB]' : 'bg-white/30'
                }`}
              />
              <span
                className={`hidden sm:inline-block text-[11px] sm:text-xs font-medium leading-tight max-w-[210px] transition-colors ${
                  isScrolled ? 'text-[#292E35]' : 'text-white/95'
                }`}
              >
                Thapar Institute of Engineering<br />and Technology
              </span>
            </div>
          </a>
        </div>

        {/* Center Section: Navigation Links with Exact Equal Visual Gaps */}
        <nav className="hidden md:flex items-center">
          <div className="flex items-center gap-7 lg:gap-8">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.id, link.href)}
                  className={`text-xs lg:text-sm transition-all duration-200 inline-flex items-center justify-center cursor-pointer ${
                    isActive
                      ? 'px-4 py-1.5 rounded-full bg-[#EACBA5] text-[#292E35] font-semibold shadow-sm'
                      : isScrolled
                      ? 'px-0 py-1.5 text-[#292E35] hover:text-[#B49168] font-medium'
                      : 'px-0 py-1.5 text-white/90 hover:text-white font-medium'
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
              className="px-5 py-2 text-xs lg:text-sm font-semibold text-[#292E35] bg-[#EACBA5] hover:bg-[#DEB887] rounded-full shadow-sm transition-all flex items-center gap-2 hover:scale-105"
            >
              Dashboard ({user?.full_name?.split(' ')[0] || (isStudent ? 'Student' : 'Coordinator')})
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              {/* Student Login - Outlined Pill */}
              <Link
                to="/login"
                className={`px-4 lg:px-5 py-2 text-xs lg:text-sm font-medium rounded-full transition-all flex items-center gap-1.5 hover:scale-105 ${
                  isScrolled
                    ? 'text-[#292E35] border border-[#292E35] hover:bg-[#292E35]/5'
                    : 'text-white border border-white/60 hover:border-white hover:bg-white/10'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Student Login</span>
              </Link>

              {/* Coordinator Portal / Login - Filled Gold Pill */}
              <Link
                to="/coordinator/login"
                className="px-4 lg:px-5 py-2 text-xs lg:text-sm font-medium text-white bg-[#B49168] hover:bg-[#9E7D58] rounded-full shadow-sm transition-all flex items-center gap-1.5 hover:scale-105"
              >
                <Users className="w-4 h-4" />
                <span>Coordinator Login</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center gap-2">
          {onOpenCredentials && (
            <button
              onClick={onOpenCredentials}
              className={`p-2 rounded-lg border text-xs font-semibold ${
                isScrolled
                  ? 'border-[#E4D9CB] text-[#292E35] bg-white'
                  : 'border-white/20 text-white bg-black/20'
              }`}
              title="Demo Credentials"
            >
              <Key className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-xl border focus:outline-none ${
              isScrolled
                ? 'border-[#E4D9CB] text-[#292E35] bg-white'
                : 'border-white/20 text-white bg-black/20'
            }`}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#F8F5F1] border-b border-[#E4D9CB] px-4 pt-4 pb-6 space-y-4 shadow-xl">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.id, link.href)}
                className={`px-4 py-2.5 rounded-xl text-sm transition-colors ${
                  activeSection === link.id
                    ? 'bg-[#EACBA5] text-[#292E35] font-bold shadow-sm'
                    : 'text-[#292E35] hover:bg-[#EDE5DA] font-medium'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-[#E4D9CB] flex flex-col gap-2.5">
            {isAuthenticated ? (
              <Link
                to={isStudent ? '/student/dashboard' : '/coordinator/dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-sm font-semibold text-[#292E35] bg-[#EACBA5] rounded-full shadow-sm"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-sm font-semibold text-[#292E35] border border-[#292E35] rounded-full flex items-center justify-center gap-2"
                >
                  <GraduationCap className="w-4 h-4" />
                  Student Login
                </Link>
                <Link
                  to="/coordinator/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-sm font-semibold text-white bg-[#B49168] rounded-full flex items-center justify-center gap-2 shadow-sm"
                >
                  <Users className="w-4 h-4" />
                  Coordinator Portal
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
