import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthTransitionContext = createContext(null);

export function AuthTransitionProvider({ children }) {
  const [transitionState, setTransitionState] = useState('idle'); // 'idle' | 'to-login' | 'to-home'
  const [transitionTarget, setTransitionTarget] = useState(null); // 'student' | 'coordinator' | null
  const navigate = useNavigate();

  const isReducedMotion = typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const triggerLoginTransition = useCallback(() => {
    if (isReducedMotion) {
      navigate('/login');
      return;
    }

    setTransitionTarget('student');
    setTransitionState('to-login');

    // Total cinematic animation duration: 800ms with cubic-bezier(0.65, 0, 0.25, 1)
    setTimeout(() => {
      navigate('/login', { state: { transitioned: true } });
      setTimeout(() => {
        setTransitionState('idle');
        setTransitionTarget(null);
      }, 100);
    }, 800);
  }, [navigate, isReducedMotion]);

  const triggerCoordinatorTransition = useCallback(() => {
    if (isReducedMotion) {
      navigate('/coordinator/login');
      return;
    }

    setTransitionTarget('coordinator');
    setTransitionState('to-login');

    setTimeout(() => {
      navigate('/coordinator/login', { state: { transitioned: true } });
      setTimeout(() => {
        setTransitionState('idle');
        setTransitionTarget(null);
      }, 100);
    }, 800);
  }, [navigate, isReducedMotion]);

  const triggerSignupTransition = useCallback(() => {
    if (isReducedMotion) {
      navigate('/signup');
      return;
    }

    setTransitionTarget('signup');
    setTransitionState('to-login');

    // Total cinematic animation duration: 800ms with cubic-bezier(0.65, 0, 0.25, 1)
    setTimeout(() => {
      navigate('/signup', { state: { transitioned: true } });
      setTimeout(() => {
        setTransitionState('idle');
        setTransitionTarget(null);
      }, 100);
    }, 800);
  }, [navigate, isReducedMotion]);

  const triggerHomeTransition = useCallback(() => {
    if (isReducedMotion) {
      navigate('/');
      return;
    }

    setTransitionState('to-home');

    // Total reverse animation duration: 750ms
    setTimeout(() => {
      navigate('/', { state: { returnedFromLogin: true }, replace: true });
      setTimeout(() => {
        setTransitionState('idle');
      }, 100);
    }, 750);
  }, [navigate, isReducedMotion]);

  const value = {
    transitionState,
    transitionTarget,
    isTransitioning: transitionState !== 'idle',
    isTransitioningToLogin: transitionState === 'to-login',
    isTransitioningToHome: transitionState === 'to-home',
    triggerLoginTransition,
    triggerCoordinatorTransition,
    triggerSignupTransition,
    triggerHomeTransition,
  };

  return (
    <AuthTransitionContext.Provider value={value}>
      {children}
    </AuthTransitionContext.Provider>
  );
}

export function useAuthTransition() {
  const context = useContext(AuthTransitionContext);
  if (!context) {
    throw new Error('useAuthTransition must be used within an AuthTransitionProvider');
  }
  return context;
}
