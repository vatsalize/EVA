import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, ArrowRight, Key } from 'lucide-react';

export function LandingNavbar({ onOpenCredentials }) {
  const { isAuthenticated, isStudent, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'features', 'how-it-works'];
      const scrollPosition = window.scrollY + 140;

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

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home', id: 'home' },
    { name: 'Features', href: '#features', id: 'features' },
    { name: 'How it Works', href: '#how-it-works', id: 'how-it-works' },
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
    <header className="sticky top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#ECE6DB] shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
        
        {/* Left Section: Logo & Full Institute Title */}
        <div className="flex items-center gap-3">
          <a
            href="#home"
            onClick={(e) => scrollToSection(e, '#home')}
            className="flex items-center gap-2.5 sm:gap-3 group"
          >
            {/* Dark Rounded "E" Icon */}
            <div className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-lg bg-[#1E232A] flex items-center justify-center text-white font-extrabold text-lg shadow-sm group-hover:scale-105 transition-transform">
              <span className="tracking-tight leading-none">E</span>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-2.5">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-[#1E232A]">EVA</span>
              <span className="text-[#D0C8BC] font-light hidden sm:inline-block">|</span>
              <span className="hidden sm:inline-block text-xs sm:text-sm font-medium text-[#4B5563] tracking-normal">
                Thapar Institute Of Engineering and Technology
              </span>
            </div>
          </a>
        </div>

        {/* Center Section: Navigation Links */}
        <nav className="hidden md:flex items-center">
          <div className="flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className={`text-xs lg:text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#1E232A] text-white px-4 lg:px-5 py-1.5 rounded-full font-semibold shadow-sm'
                      : 'text-[#4B5563] hover:text-[#1E232A] px-3 lg:px-4 py-1.5 rounded-full hover:bg-gray-100/50'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </div>
        </nav>

        {/* Right Section: Auth Action Buttons (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <Link
              to={isStudent ? '/student/dashboard' : '/coordinator/dashboard'}
              className="px-5 py-2 text-xs lg:text-sm font-semibold text-white bg-[#1E232A] hover:bg-black rounded-full shadow-sm transition-all flex items-center gap-2 hover:scale-105"
            >
              Dashboard ({user?.full_name?.split(' ')[0] || (isStudent ? 'Student' : 'Coordinator')})
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 lg:px-5 py-1.5 text-xs lg:text-sm font-medium text-[#1E232A] bg-white hover:bg-gray-50 border border-[#2C323B] rounded-full transition-all hover:scale-105 shadow-sm"
              >
                Student Login
              </Link>
              <Link
                to="/coordinator/login"
                className="px-4 lg:px-5 py-1.5 text-xs lg:text-sm font-medium text-white bg-[#B58D67] hover:bg-[#A37B55] rounded-full shadow-sm transition-all hover:scale-105"
              >
                Coordinator Login
              </Link>
            </>
          )}

          {/* Evaluator Key Button (Discreet helper) */}
          {onOpenCredentials && (
            <button
              onClick={onOpenCredentials}
              title="View Demo Credentials"
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-gray-100 transition-colors"
            >
              <Key className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Mobile Menu Hamburger */}
        <div className="md:hidden flex items-center gap-2">
          {onOpenCredentials && (
            <button
              onClick={onOpenCredentials}
              className="p-2 rounded-lg bg-gray-100 text-gray-700"
              title="Demo Credentials"
            >
              <Key className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-gray-100 text-[#1E232A] hover:bg-gray-200 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#ECE6DB] px-4 pt-4 pb-6 space-y-4 shadow-lg animate-fadeIn">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  activeSection === link.id
                    ? 'bg-[#1E232A] text-white font-semibold'
                    : 'text-[#4B5563] hover:bg-gray-100'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-200 flex flex-col gap-2.5">
            {isAuthenticated ? (
              <Link
                to={isStudent ? '/student/dashboard' : '/coordinator/dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-sm font-semibold text-white bg-[#1E232A] rounded-full shadow-sm"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-sm font-medium text-[#1E232A] bg-white border border-[#2C323B] rounded-full"
                >
                  Student Login
                </Link>
                <Link
                  to="/coordinator/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-sm font-medium text-white bg-[#B58D67] rounded-full shadow-sm"
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
