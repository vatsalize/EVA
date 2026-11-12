import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import { Shield, Building2, Mail, KeyRound, Calendar, CheckCircle2, Save } from 'lucide-react';
import { LoadingSpinner } from '../../components/common/UIComponents';

export function CoordinatorProfile() {
  const { user, updateProfile, changePassword } = useAuth();
  const { success, error } = useToast();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState('');

  // Password Change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPw, setChangingPw] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get('/users/profile');
        if (res.data.success) {
          setProfile(res.data.profile);
          setFullName(res.data.profile.full_name || '');
        }
      } catch (err) {
        error('Failed to load coordinator profile.');
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ fullName });
      success('Coordinator name updated successfully.');
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      error('New password and confirmation do not match.');
      return;
    }
    if (newPassword.length < 6) {
      error('Password must be at least 6 characters.');
      return;
    }

    setChangingPw(true);
    try {
      await changePassword(currentPassword, newPassword);
      success('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      error(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setChangingPw(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading coordinator profile..." />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Coordinator Profile
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Authorized club lead credentials and security settings.
        </p>
      </div>

      {/* Club Assignment Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-brand-900 text-white flex items-center justify-center font-bold text-2xl shadow-md">
            {fullName?.charAt(0) || 'C'}
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-900 text-xs font-semibold mb-1">
              <Shield className="w-3 h-3 text-blue-600" />
              Predefined Coordinator ({profile?.user_id})
            </div>
            <h2 className="text-xl font-bold text-slate-900">{fullName}</h2>
            <p className="text-xs text-slate-500">
              Assigned to: <strong className="text-slate-800">{profile?.club_name}</strong> ({profile?.club_category})
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Coordinator Email
              </label>
              <input
                type="email"
                disabled
                value={profile?.email || ''}
                className="w-full px-4 py-2.5 text-sm bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-brand-900 hover:bg-brand-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Update Details'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Password Management Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-brand-900" />
          <span>Change Account Password</span>
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Update your coordinator password to replace the seeded default.
        </p>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-900 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={changingPw}
              className="px-5 py-2.5 bg-brand-900 hover:bg-brand-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors"
            >
              {changingPw ? 'Updating...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
