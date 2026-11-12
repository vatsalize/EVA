import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import { 
  Calendar, 
  Clock, 
  Users, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight,
  Check,
  Building2
} from 'lucide-react';

const AVAILABLE_FACILITIES = [
  { id: 'projector', label: 'Projector & Screen' },
  { id: 'sound_system', label: 'Sound System' },
  { id: 'microphone', label: 'Microphone Setup' },
  { id: 'air_conditioning', label: 'Air Conditioning' },
  { id: 'wifi', label: 'High-Speed Wi-Fi' },
  { id: 'stage', label: 'Performance Stage' },
  { id: 'worktables', label: 'Workshop / Lab Tables' },
  { id: 'power_outlets', label: 'High-Density Power Outlets' }
];

export function CreateEvent() {
  const { user } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technical',
    eventDate: '2026-11-28',
    startTime: '10:00',
    endTime: '15:00',
    expectedParticipants: '80',
    registrationCapacity: '90',
    registrationDeadline: '2026-11-26',
    requiredFacilities: ['projector', 'wifi']
  });

  const [submitting, setSubmitting] = useState(false);

  const toggleFacility = (facilityId) => {
    setFormData((prev) => {
      const exists = prev.requiredFacilities.includes(facilityId);
      return {
        ...prev,
        requiredFacilities: exists
          ? prev.requiredFacilities.filter((f) => f !== facilityId)
          : [...prev.requiredFacilities, facilityId]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.startTime >= formData.endTime) {
      error('End time must be later than start time.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/events', {
        ...formData,
        expectedParticipants: parseInt(formData.expectedParticipants, 10),
        registrationCapacity: parseInt(formData.registrationCapacity, 10),
        status: 'DRAFT'
      });

      if (res.data.success) {
        success('Event created in Draft! Proceeding to Smart Venue Allocation.');
        navigate(`/coordinator/booking/${res.data.event.event_id}`);
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to create event.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      <Link
        to="/coordinator/events"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Events</span>
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        
        <div className="mb-6 pb-6 border-b border-slate-100">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Step 1 of 2: Define Event Requirements
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Create Club Event
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Organized on behalf of <strong>{user?.clubName || 'Your Assigned Club'}</strong>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Event Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. AI Innovation Summit & Hackathon"
              className="w-full px-4 py-3 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-900 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-900 focus:outline-none bg-white"
              >
                <option value="Technical">Technical</option>
                <option value="Cultural">Cultural</option>
                <option value="Literary">Literary</option>
                <option value="Entrepreneurship">Entrepreneurship</option>
                <option value="Creative">Creative</option>
                <option value="Sports">Sports</option>
                <option value="Workshop">Workshop</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Event Date
              </label>
              <input
                type="date"
                required
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Start Time (24h)
              </label>
              <input
                type="time"
                required
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                End Time (24h)
              </label>
              <input
                type="time"
                required
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Expected Participants
              </label>
              <input
                type="number"
                min="10"
                required
                value={formData.expectedParticipants}
                onChange={(e) => setFormData({ ...formData, expectedParticipants: e.target.value })}
                placeholder="e.g. 100"
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Registration Capacity
              </label>
              <input
                type="number"
                min="10"
                required
                value={formData.registrationCapacity}
                onChange={(e) => setFormData({ ...formData, registrationCapacity: e.target.value })}
                placeholder="e.g. 120"
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Registration Deadline
              </label>
              <input
                type="date"
                required
                value={formData.registrationDeadline}
                onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Description & Objectives
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide a short description of the agenda and target audience..."
              className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-900 focus:outline-none"
            />
          </div>

          {/* Required Facilities Multi-Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Required Room Facilities (Used by AI Venue Matcher)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {AVAILABLE_FACILITIES.map((f) => {
                const selected = formData.requiredFacilities.includes(f.id);
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => toggleFacility(f.id)}
                    className={`p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between ${
                      selected
                        ? 'bg-brand-900 text-white border-brand-900 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{f.label}</span>
                    {selected && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <Link
              to="/coordinator/events"
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-brand-900 hover:bg-brand-800 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Proceed to Venue Booking</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
