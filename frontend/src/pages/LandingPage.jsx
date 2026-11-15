import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { HeroSection } from '../components/landing/HeroSection';
import { StatisticsSection } from '../components/landing/StatisticsSection';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { WorkflowSection } from '../components/landing/WorkflowSection';
import { RoleBenefitsSection } from '../components/landing/RoleBenefitsSection';
import { FinalCTASection } from '../components/landing/FinalCTASection';
import { LandingFooter } from '../components/landing/LandingFooter';
import { EvaluatorModal } from '../components/landing/EvaluatorModal';
import statsFeaturesBg from '../assets/redesign/eva-statistics-features-bg.jpg';
import ctaSectionBg from '../assets/redesign/eva-cta-section-bg.jpg';
import campusDecoImg from '../assets/redesign/eva-portal-campus-decoration.png';

export function LandingPage() {
  const [stats, setStats] = useState({ events: 9, venues: 8, clubs: 6 });
  const [loading, setLoading] = useState(true);
  const [evaluatorModalOpen, setEvaluatorModalOpen] = useState(false);

  // Remove visible vertical scrollbar on landing page only while preserving all scrolling
  useEffect(() => {
    document.documentElement.classList.add('landing-page-active');
    return () => {
      document.documentElement.classList.remove('landing-page-active');
    };
  }, []);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [eventsRes, venuesRes, clubsRes] = await Promise.allSettled([
          api.get('/events'),
          api.get('/venues'),
          api.get('/clubs')
        ]);

        const eventsCount = eventsRes.status === 'fulfilled' ? (eventsRes.value.data.count || eventsRes.value.data.events?.length || 9) : 9;
        const venuesCount = venuesRes.status === 'fulfilled' ? (venuesRes.value.data.count || venuesRes.value.data.venues?.length || 8) : 8;
        const clubsCount = clubsRes.status === 'fulfilled' ? (clubsRes.value.data.clubs?.length || clubsRes.value.data.count || 6) : 6;

        setStats({
          events: eventsCount,
          venues: venuesCount,
          clubs: clubsCount
        });
      } catch (err) {
        console.warn('Using default demo statistics for landing page:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F5F1] text-[#292E35] selection:bg-[#EACBA5] selection:text-[#292E35] flex flex-col font-sans antialiased overflow-x-hidden">
      {/* 1. Global Sticky Navigation Header */}
      <LandingNavbar onOpenCredentials={() => setEvaluatorModalOpen(true)} />

      {/* Main Vertically Scrollable Content Flow */}
      <main className="flex-1">
        {/* SECTION 01 — Cinematic Campus Hero */}
        <section id="home" className="relative">
          <HeroSection />
        </section>

        {/* SECTION 02 — Live Campus Statistics and Key Features (One Continuous Background) */}
        <section id="features" className="relative bg-[#F8F5F1] overflow-hidden scroll-mt-14">
          <div
            className="absolute inset-0 bg-cover bg-bottom sm:bg-center bg-no-repeat pointer-events-none opacity-90 z-0"
            style={{ backgroundImage: `url(${statsFeaturesBg})` }}
          />
          <div className="relative z-10">
            <StatisticsSection stats={stats} loading={loading} />
            <FeaturesSection />
          </div>
        </section>

        {/* SECTION 03 (Part 1) — Six-Step EVA Workflow (Charcoal + Bottom Gold Wave Transition) */}
        <section id="how-it-works" className="relative bg-[#292E35] scroll-mt-14">
          <WorkflowSection />
        </section>

        {/* SHARED CONTINUOUS ARCHITECTURAL BACKGROUND WRAPPER (Page 3 Portals + Page 4 CTA) */}
        <div className="relative bg-[#F8F5F1] overflow-hidden">
          {/* Layer 1: Continuous Campus Architecture & Flowing Curves across entire wrapper */}
          <div
            className="absolute inset-0 bg-cover bg-bottom bg-no-repeat pointer-events-none opacity-40 z-0"
            style={{ backgroundImage: `url(${ctaSectionBg})` }}
          />

          {/* Layer 2: Subtle Campus Buildings in the outer margins alongside the portal cards */}
          <div
            className="absolute inset-x-0 top-0 h-[480px] sm:h-[540px] bg-cover sm:bg-contain bg-top bg-no-repeat pointer-events-none opacity-35 z-0"
            style={{ backgroundImage: `url(${campusDecoImg})` }}
          />

          {/* Layer 3: Foreground Content Flow */}
          <div className="relative z-10">
            <RoleBenefitsSection />
            <section id="about" className="relative scroll-mt-14">
              <FinalCTASection />
            </section>
          </div>
        </div>

        {/* SECTION 04 (Part 2) — Footer (Dark Charcoal) */}
        <LandingFooter onOpenCredentials={() => setEvaluatorModalOpen(true)} />
      </main>

      {/* Evaluator Credentials Modal */}
      <EvaluatorModal
        isOpen={evaluatorModalOpen}
        onClose={() => setEvaluatorModalOpen(false)}
      />
    </div>
  );
}