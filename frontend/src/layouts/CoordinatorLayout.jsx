import React, { useState } from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { LoadingSpinner, Modal } from '../components/common/UIComponents';
import { useToast } from '../context/ToastContext';
import { KeyRound, ShieldAlert } from 'lucide-react';

export function CoordinatorLayout() {
  const { user, isAuthenticated, loading, isCoordinator, changePassword } = useAuth();
  const { success, error } = useToast();

  const [pwModalOpen, setPwModalOpen] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F3EE]">
        <LoadingSpinner message="Verifying Coordinator Credentials..." size="lg" />
      </div>
    );
  }

  if (!isAuthenticated || !isCoordinator) {
    return <Navigate to="/coordinator/login" replace />;
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPw !== confirmPw) {
      error('New password and confirmation do not match.');
      return;
    }
    if (newPw.length < 6) {
      error('Password must be at least 6 characters.');
      return;
    }

    try {
      setSubmitting(true);
      await changePassword(currentPw, newPw);
      success('Password changed successfully! Next login will require your new password.');
      setPwModalOpen(false);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F3EE]">
      <Navbar />

      {/* Reminder Banner for demo password */}
      {user.mustChangePassword && (
        <div className="bg-[#EDE5D9] border-b border-[#DFD0BE] px-4 py-2.5 text-xs text-[#966014] flex items-center justify-between max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#966014] flex-shrink-0" />
            <span>
              <strong>Security Notice:</strong> You are using default demo credentials. Please update your password.
            </span>
          </div>
          <button
            onClick={() => setPwModalOpen(true)}
            className="px-3 py-1 bg-[#262B32] hover:bg-[#191F24] text-white font-medium rounded-lg transition-colors ml-4 cursor-pointer"
          >
            Change Password
          </button>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <Footer />

      {/* Password Change Modal */}
      <Modal
        isOpen={pwModalOpen}
        onClose={() => setPwModalOpen(false)}
        title="Update Coordinator Password"
      >
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#262B32] uppercase tracking-wider mb-1">
              Current Temporary Password
            </label>
            <input
              type="password"
              required
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              placeholder="Enter current password"
              className="w-full px-3 py-2 text-sm bg-[#FFFDFC] border border-[#DFD0BE] rounded-xl text-[#262B32] focus:ring-2 focus:ring-[#B8956B] focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#262B32] uppercase tracking-wider mb-1">
              New Password
            </label>
            <input
              type="password"
              required
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full px-3 py-2 text-sm bg-[#FFFDFC] border border-[#DFD0BE] rounded-xl text-[#262B32] focus:ring-2 focus:ring-[#B8956B] focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#262B32] uppercase tracking-wider mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              placeholder="Repeat new password"
              className="w-full px-3 py-2 text-sm bg-[#FFFDFC] border border-[#DFD0BE] rounded-xl text-[#262B32] focus:ring-2 focus:ring-[#B8956B] focus:outline-none transition-all"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setPwModalOpen(false)}
              className="px-4 py-2 text-sm text-[#68635D] hover:text-[#262B32] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-sm font-semibold text-white bg-[#262B32] hover:bg-[#191F24] rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {submitting ? 'Updating...' : 'Save New Password'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
