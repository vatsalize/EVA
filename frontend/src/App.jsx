import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Layouts
import { StudentLayout } from './layouts/StudentLayout';
import { CoordinatorLayout } from './layouts/CoordinatorLayout';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { StudentLogin } from './pages/auth/StudentLogin';
import { StudentSignup } from './pages/auth/StudentSignup';
import { CoordinatorLogin } from './pages/auth/CoordinatorLogin';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { ExploreEvents } from './pages/student/ExploreEvents';
import { EventDetails } from './pages/student/EventDetails';
import { MyRegistrations } from './pages/student/MyRegistrations';
import { StudentFeedback } from './pages/student/StudentFeedback';
import { StudentProfile } from './pages/student/StudentProfile';

// Coordinator Pages
import { CoordinatorDashboard } from './pages/coordinator/CoordinatorDashboard';
import { CoordinatorEvents } from './pages/coordinator/CoordinatorEvents';
import { CreateEvent } from './pages/coordinator/CreateEvent';
import { VenueDirectory } from './pages/coordinator/VenueDirectory';
import { VenueBooking } from './pages/coordinator/VenueBooking';
import { QRScanner } from './pages/coordinator/QRScanner';
import { EventRegistrations } from './pages/coordinator/EventRegistrations';
import { FootfallDashboard } from './pages/coordinator/FootfallDashboard';
import { CoordinatorFeedback } from './pages/coordinator/CoordinatorFeedback';
import { CoordinatorAnalytics } from './pages/coordinator/CoordinatorAnalytics';
import { CoordinatorProfile } from './pages/coordinator/CoordinatorProfile';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Public Entry Points */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<StudentLogin />} />
            <Route path="/signup" element={<StudentSignup />} />
            <Route path="/coordinator/login" element={<CoordinatorLogin />} />

            {/* Student Protected Portal */}
            <Route path="/student" element={<StudentLayout />}>
              <Route index element={<Navigate to="/student/dashboard" replace />} />
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="explore" element={<ExploreEvents />} />
              <Route path="events/:id" element={<EventDetails />} />
              <Route path="registrations" element={<MyRegistrations />} />
              <Route path="feedback" element={<StudentFeedback />} />
              <Route path="profile" element={<StudentProfile />} />
            </Route>

            {/* Coordinator Protected Portal */}
            <Route path="/coordinator" element={<CoordinatorLayout />}>
              <Route index element={<Navigate to="/coordinator/dashboard" replace />} />
              <Route path="dashboard" element={<CoordinatorDashboard />} />
              <Route path="events" element={<CoordinatorEvents />} />
              <Route path="events/create" element={<CreateEvent />} />
              <Route path="venues" element={<VenueDirectory />} />
              <Route path="booking/:eventId" element={<VenueBooking />} />
              <Route path="scanner" element={<QRScanner />} />
              <Route path="events/:id/registrations" element={<EventRegistrations />} />
              <Route path="events/:id/footfall" element={<FootfallDashboard />} />
              <Route path="events/:id/feedback" element={<CoordinatorFeedback />} />
              <Route path="analytics" element={<CoordinatorAnalytics />} />
              <Route path="profile" element={<CoordinatorProfile />} />
            </Route>

            {/* Fallback Catch-All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
