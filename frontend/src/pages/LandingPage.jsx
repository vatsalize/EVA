import React, { useState } from 'react';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { HeroSection } from '../components/landing/HeroSection';
import { AboutSection } from '../components/landing/AboutSection';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { WorkflowSection } from '../components/landing/WorkflowSection';
import { RoleBenefitsSection } from '../components/landing/RoleBenefitsSection';
import { WhyEvaSection } from '../components/landing/WhyEvaSection';
import { LandingFooter } from '../components/landing/LandingFooter';
import { EvaluatorModal } from '../components/landing/EvaluatorModal';

export function LandingPage() {
  const [evaluatorModalOpen, setEvaluatorModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1F242E] flex flex-col font-sans antialiased selection:bg-[#B58D67] selection:text-white">
      {/* 1. Sticky Navigation Bar */}
      <LandingNavbar onOpenCredentials={() => setEvaluatorModalOpen(true)} />

      {/* Main Content Flow — Fully Scrollable */}
      <main className="flex-1 w-full">
        {/* 2. Hero Section with Thapar Campus Background & Sunset Golden Hour */}
        <HeroSection />

        {/* 3. About EVA — Unified Platform for Campus Life */}
        <AboutSection />

        {/* 4. Key Features — 6 Core Capabilities */}
        <FeaturesSection />

        {/* 5. How EVA Works — 5-Step Connected Flow in Dark Wave Banner */}
        <WorkflowSection />

        {/* 6. Role Benefits — For Students & For Coordinators Cards */}
        <RoleBenefitsSection />

        {/* 7. Why EVA? — 5 Core Value Pillars Bar */}
        <WhyEvaSection />
      </main>

      {/* 8. Dark Platform Footer */}
      <LandingFooter onOpenCredentials={() => setEvaluatorModalOpen(true)} />

      {/* Evaluator Credentials Modal for Testing & Demos */}
      <EvaluatorModal
        isOpen={evaluatorModalOpen}
        onClose={() => setEvaluatorModalOpen(false)}
      />
    </div>
  );
}
