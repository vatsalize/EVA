import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  PlusCircle, 
  Users, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  MoreVertical,
  QrCode,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { LoadingSpinner, Badge, EmptyState, Modal } from '../../components/common/UIComponents';

export function CoordinatorEvents() {
  const [events, setEvents] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Status Action Modal State
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, event: null, action: null });
  const [processing, setProcessing] = useState(false);

  const { success, error } = useToast();

  const loadEvents = async () => {
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const res = await api.get('/events/my-events', { params });
      setEvents(res.data.events || []);
    } catch (err) {
      error('Failed to load club events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [statusFilter]);

  const handleStatusChange = async () => {
    if (!confirmModal.event || !confirmModal.action) return;
    setProcessing(true);

    try {
      await api.patch(`/events/${confirmModal.event.event_id}/status`, {
        status: confirmModal.action
      });
      success(`Event successfully updated to ${confirmModal.action}.`);
      setConfirmModal({ isOpen: false, event: null, action: null });
      loadEvents();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update event status.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Club Event Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Oversee event scheduling, venue reservations, publishing, and lifecycle transitions.
          </p>
        </div>

        <Link
          to="/coordinator/events/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-900 hover:bg-brand-800 text-white font-semibold text-sm rounded-xl shadow-md transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Event</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {['', 'DRAFT', 'PUBLISHED', 'COMPLETED', 'CANCELLED'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              statusFilter === st
                ? 'bg-brand-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {st ? st.charAt(0) + st.slice(1).toLowerCase() : 'All Events'}
          </button>
        ))}
      </div>

      {/* Events Table / Cards */}
      {loading ? (
        <LoadingSpinner message="Loading events..." />
      ) : events.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No events found"
          description="Create your club's next event or adjust your filter selection."
          actionText="Create New Event"
          onAction={() => (window.location.href = '/coordinator/events/create')}
        />
      ) : (
        <div className="space-y-4">
          {events.map((evt) => (
            <div
              key={evt.event_id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    {evt.category}
                  </span>
                  <Badge
                    variant={
                      evt.status === 'PUBLISHED'
                        ? 'success'
                        : evt.status === 'COMPLETED'
                        ? 'primary'
                        : evt.status === 'CANCELLED'
                        ? 'danger'
                        : 'default'
                    }
                  >
                    {evt.status}
                  </Badge>
                  {evt.average_rating && (
                    <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                      ★ {evt.average_rating} / 5
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-900">{evt.title}</h3>
                
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>{evt.event_date} ({evt.start_time} - {evt.end_time})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{evt.venue_name ? `${evt.venue_name} (${evt.venue_building})` : <strong className="text-amber-600">No Venue Booked</strong>}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span>Regs: {evt.registered_count} / {evt.registration_capacity}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Footfall: {evt.actual_footfall} ({evt.turnout_rate}%)</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 border-t md:border-t-0 pt-4 md:pt-0">
                
                {/* DRAFT Actions */}
                {evt.status === 'DRAFT' && (
                  <>
                    <Link
                      to={`/coordinator/booking/${evt.event_id}`}
                      className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold rounded-xl transition-colors"
                    >
                      {evt.venue_id ? 'Change Venue' : 'Book Venue (AI Match)'}
                    </Link>

                    {evt.venue_id && (
                      <button
                        onClick={() => setConfirmModal({ isOpen: true, event: evt, action: 'PUBLISHED' })}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
                      >
                        Publish Event
                      </button>
                    )}
                  </>
                )}

                {/* PUBLISHED Actions */}
                {evt.status === 'PUBLISHED' && (
                  <>
                    <Link
                      to={`/coordinator/events/${evt.event_id}/registrations`}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors"
                    >
                      Registrations ({evt.registered_count})
                    </Link>

                    <Link
                      to={`/coordinator/events/${evt.event_id}/footfall`}
                      className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-semibold rounded-xl transition-colors"
                    >
                      Footfall ({evt.actual_footfall})
                    </Link>

                    <button
                      onClick={() => setConfirmModal({ isOpen: true, event: evt, action: 'COMPLETED' })}
                      className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors"
                    >
                      Mark Completed
                    </button>

                    <button
                      onClick={() => setConfirmModal({ isOpen: true, event: evt, action: 'CANCELLED' })}
                      className="px-3 py-2 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      Cancel Event
                    </button>
                  </>
                )}

                {/* COMPLETED Actions */}
                {evt.status === 'COMPLETED' && (
                  <>
                    <Link
                      to={`/coordinator/events/${evt.event_id}/footfall`}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors"
                    >
                      Footfall Report
                    </Link>
                    <Link
                      to={`/coordinator/events/${evt.event_id}/feedback`}
                      className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold rounded-xl transition-colors"
                    >
                      Reviews & Feedback
                    </Link>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, event: null, action: null })}
        title={`Confirm Action: Mark as ${confirmModal.action}`}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            {confirmModal.action === 'PUBLISHED' && (
              <>Are you ready to publish <strong>{confirmModal.event?.title}</strong>? Students across campus will be able to discover and register for it immediately.</>
            )}
            {confirmModal.action === 'COMPLETED' && (
              <>Mark <strong>{confirmModal.event?.title}</strong> as completed? This will conclude registrations and allow verified attendees to submit ratings and feedback.</>
            )}
            {confirmModal.action === 'CANCELLED' && (
              <>Are you sure you want to cancel <strong>{confirmModal.event?.title}</strong>? The booked venue will be released immediately, and registrations will be closed.</>
            )}
          </p>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setConfirmModal({ isOpen: false, event: null, action: null })}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={processing}
              onClick={handleStatusChange}
              className={`px-5 py-2 text-sm font-semibold text-white rounded-xl shadow-sm transition-colors ${
                confirmModal.action === 'CANCELLED' ? 'bg-red-600 hover:bg-red-700' : 'bg-brand-900 hover:bg-brand-800'
              }`}
            >
              {processing ? 'Processing...' : `Yes, Set to ${confirmModal.action}`}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
