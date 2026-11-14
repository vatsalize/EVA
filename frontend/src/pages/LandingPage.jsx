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

export function LandingPage() {
  const [stats, setStats] = useState({ events: 9, venues: 8, clubs: 6 });
  const [loading, setLoading] = useState(true);
  const [evaluatorModalOpen, setEvaluatorModalOpen] = useState(false);

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
        <HeroSection />

        {/* SECTION 02 — Live Campus Statistics and Key Features */}
        <StatisticsSection stats={stats} loading={loading} />
        <FeaturesSection />

        {/* SECTION 03 — Six-Step EVA Workflow and Role-Based Portals */}
        <WorkflowSection />
        <RoleBenefitsSection />

        {/* SECTION 04 (Part 1) — Final Call to Action */}
        <FinalCTASection />
      </main>

      {/* SECTION 04 (Part 2) — Final Full-Width Footer */}
      <LandingFooter onOpenCredentials={() => setEvaluatorModalOpen(true)} />

      {/* Evaluator Credentials Modal */}
      <EvaluatorModal
        isOpen={evaluatorModalOpen}
        onClose={() => setEvaluatorModalOpen(false)}
      />
    </div>
  );
}
