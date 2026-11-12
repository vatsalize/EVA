import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import { User, Mail, GraduationCap, Building2, Ticket, CheckCircle2, Sparkles, Save } from 'lucide-react';
import { LoadingSpinner } from '../../components/common/UIComponents';

export function StudentProfile() {
  const { user, updateProfile } = useAuth();
  const { success, error } = useToast();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('2');

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get('/users/profile');
        if (res.data.success) {
          setProfile(res.data.profile);
          setFullName(res.data.profile.full_name || '');
          setDepartment(res.data.profile.department || 'Computer Engineering');
          setYearOfStudy(String(res.data.profile.year_of_study || '2'));
        }
      } catch (err) {
        error('Failed to load profile.');
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
      await updateProfile({
        fullName,
        department,
        yearOfStudy: parseInt(yearOfStudy, 10)
      });
      success('Profile updated successfully.');
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Student Profile
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your verified student credentials and view campus activity metrics.
        </p>
      </div>

      {/* Participation Badges */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center">
          <div className="text-2xl font-black text-slate-900">{profile?.totalRegistrations || 0}</div>
          <div className="text-xs font-medium text-slate-500 mt-1">Total Passes</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center">
          <div className="text-2xl font-black text-emerald-600">{profile?.totalAttended || 0}</div>
          <div className="text-xs font-medium text-slate-500 mt-1">Events Attended</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center">
          <div className="text-2xl font-black text-amber-600">{profile?.totalFeedback || 0}</div>
          <div className="text-xs font-medium text-slate-500 mt-1">Reviews Given</div>
        </div>
      </div>

      {/* Profile Form Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
            <div className="w-16 h-16 rounded-2xl bg-brand-900 text-white flex items-center justify-center font-bold text-2xl shadow-md">
              {fullName?.charAt(0) || 'S'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{fullName}</h2>
              <p className="text-xs text-slate-500">Student ID: {profile?.user_id}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                Institute Email (Verified)
              </label>
              <input
                type="email"
                disabled
                value={profile?.email || ''}
                className="w-full px-4 py-2.5 text-sm bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-900 focus:outline-none bg-white"
              >
                <option value="Computer Engineering">Computer Engineering</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Electrical & Instrumentation">Electrical & Instrumentation</option>
                <option value="Biotechnology">Biotechnology</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Year of Study
              </label>
              <select
                value={yearOfStudy}
                onChange={(e) => setYearOfStudy(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-900 focus:outline-none bg-white"
              >
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
                <option value="5">Postgraduate</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-brand-900 hover:bg-brand-800 text-white font-semibold text-sm rounded-xl shadow-sm transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
