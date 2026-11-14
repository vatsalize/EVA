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
    <div className="min-h-screen bg-[#0B1026] text-white selection:bg-purple-600 selection:text-white flex flex-col font-sans antialiased">
      {/* Top Navigation */}
      <LandingNavbar onOpenCredentials={() => setEvaluatorModalOpen(true)} />

      {/* Main Page Flow */}
      <main className="flex-1">
        {/* 1. Hero Section (Deep Navy + Twilight Campus Building) */}
        <HeroSection />

        {/* 2. Statistics Bar (Database-backed) */}
        <StatisticsSection stats={stats} loading={loading} />

        {/* 3. Core Capabilities / Features (6 dark glass cards) */}
        <FeaturesSection />

        {/* 4. The EVA Flow (6 steps in horizontal line with wave transition) */}
        <WorkflowSection />

        {/* 5. Role-Based Benefits (Students vs Coordinators cards with illustrations) */}
        <RoleBenefitsSection />

        {/* 6. Final Call to Action */}
        <FinalCTASection />
      </main>

      {/* Professional Footer */}
      <LandingFooter onOpenCredentials={() => setEvaluatorModalOpen(true)} />

      {/* Evaluator Credentials Modal for testing */}
      <EvaluatorModal
        isOpen={evaluatorModalOpen}
        onClose={() => setEvaluatorModalOpen(false)}
      />
    </div>
  );
}
