import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Sparkles, 
  Building2, 
  Users, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowLeft, 
  ShieldCheck, 
  Check, 
  ArrowRight,
  Info
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { LoadingSpinner, Badge, Modal } from '../../components/common/UIComponents';

export function VenueBooking() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  const [recommendations, setRecommendations] = useState([]);
  const [unavailableVenues, setUnavailableVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    async function loadEventAndVenues() {
      try {
        const eventRes = await api.get(`/events/${eventId}`);
        if (!eventRes.data.success) {
          error('Event not found.');
          navigate('/coordinator/events');
          return;
        }

        const evt = eventRes.data.event;
        setEvent(evt);

        // Run Availability Check and AI Recommendation concurrently
        setAnalyzing(true);
        const [availRes, recsRes] = await Promise.all([
          api.post('/bookings/availability', {
            eventDate: evt.event_date,
            startTime: evt.start_time,
            endTime: evt.end_time,
            expectedParticipants: evt.expected_participants,
            requiredFacilities: evt.required_facilities,
            excludeEventId: evt.event_id
          }),
          api.post('/bookings/recommendations', {
            eventDate: evt.event_date,
            startTime: evt.start_time,
            endTime: evt.end_time,
            expectedParticipants: evt.expected_participants,
            requiredFacilities: evt.required_facilities,
            eventCategory: evt.category,
            excludeEventId: evt.event_id
          })
        ]);

        if (availRes.data.success) {
          setUnavailableVenues(availRes.data.unavailable || []);
        }

        if (recsRes.data.success) {
          const recs = recsRes.data.recommendations || [];
          setRecommendations(recs);
          if (recs.length > 0) {
            setSelectedVenue(recs[0]); // Default to top AI recommended venue
          }
        }
      } catch (err) {
        error('Failed to analyze venue availability.');
      } finally {
        setLoading(false);
        setAnalyzing(false);
      }
    }

    loadEventAndVenues();
  }, [eventId]);

  const handleConfirmBooking = async () => {
    if (!selectedVenue) return;
    setConfirming(true);

    try {
      const res = await api.post('/bookings', {
        eventId: event.event_id,
        venueId: selectedVenue.venueId || selectedVenue.venue_id,
        bookingDate: event.event_date,
        startTime: event.start_time,
        endTime: event.end_time
      });

      if (res.data.success) {
        success(`Booking Confirmed! ${selectedVenue.name} reserved successfully.`);
        setConfirmModal(false);
        navigate('/coordinator/events');
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to book venue. Conflict detected.');
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Consulting AI Venue Allocation Engine & Checking Availability..." size="lg" />;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      <Link
        to="/coordinator/events"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Events</span>
      </Link>

      {/* Event Context Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-brand-900 bg-brand-50 px-2.5 py-0.5 rounded-full">
              {event?.category}
            </span>
            <span className="text-xs text-slate-500 font-medium">{event?.event_id}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">{event?.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-2">
            <span className="flex items-center gap-1 font-semibold text-slate-800">
              <Calendar className="w-3.5 h-3.5 text-brand-700" />
              {event?.event_date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-brand-700" />
              {event?.start_time} - {event?.end_time}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-brand-700" />
              Expected: {event?.expected_participants} Attendees
            </span>
          </div>
        </div>

        {selectedVenue && (
          <button
            onClick={() => setConfirmModal(true)}
            className="px-6 py-3 bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 flex-shrink-0"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm Booking for {selectedVenue.name}</span>
          </button>
        )}
      </div>

      {/* AI Recommendation Engine Explainer */}
      <div className="bg-gradient-to-r from-blue-900 to-brand-900 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-blue-300" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-blue-200">
              Explainable AI Venue Recommendation Engine
            </h2>
          </div>
          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            Venues are first filtered deterministically for capacity, facilities, operating hours, and booking conflicts.
            The ranking layer evaluates capacity efficiency (avoiding under/over-capacity), facility bonuses, and 
            historical attendance patterns for <strong>{event?.category}</strong> events.
          </p>
        </div>
      </div>

      {/* Top Ranked Candidates Grid */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center justify-between">
          <span>Ranked Available Venues ({recommendations.length})</span>
          <span className="text-xs font-normal text-slate-500">Ranked by algorithm suitability score</span>
        </h2>

        {recommendations.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-3">
            <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Suitable Venues Available</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              All campus venues either have conflicting confirmed bookings or lack sufficient capacity/facilities for this time window.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec, index) => {
              const isSelected = (selectedVenue?.venueId || selectedVenue?.venue_id) === (rec.venueId || rec.venue_id);
              const isTopPick = index === 0;

              return (
                <div
                  key={rec.venueId || rec.venue_id}
                  onClick={() => setSelectedVenue(rec)}
                  className={`rounded-3xl p-6 border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-blue-50/50 border-brand-900 shadow-md ring-2 ring-brand-900/10'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  {isTopPick && (
                    <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Top Recommended Match
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-bold text-slate-900">{rec.name}</span>
                        <span className="text-xs text-slate-500 font-medium">{rec.building}</span>
                        <Badge variant="success">Available</Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                        <span className="font-semibold text-slate-800">
                          Capacity: {rec.capacity} Seats ({Math.round((event?.expected_participants / rec.capacity) * 100)}% utilization)
                        </span>
                        <span>•</span>
                        <span>Operating: {rec.operatingStart} - {rec.operatingEnd}</span>
                      </div>

                      {/* Plain-English Explanation */}
                      <div className="p-3 bg-white rounded-xl border border-blue-100 text-xs text-slate-700 space-y-1">
                        <div className="font-bold text-brand-900 flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5 text-blue-600" />
                          <span>Recommendation Analysis:</span>
                        </div>
                        <ul className="list-disc list-inside space-y-0.5 text-slate-600 pl-1 text-[11px]">
                          {rec.reasons?.map((r, rIdx) => (
                            <li key={rIdx}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Match Score Gauge */}
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0">
                      <div className="text-center md:text-right">
                        <div className="text-2xl font-black text-brand-900">{rec.score} <span className="text-xs font-normal text-slate-400">/ 100</span></div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Suitability</div>
                      </div>

                      <button
                        type="button"
                        className={`mt-3 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                          isSelected
                            ? 'bg-brand-900 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Select Venue'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Unavailable Venues Due to Conflicts or Rules */}
      {unavailableVenues.length > 0 && (
        <div className="border-t border-slate-200 pt-6">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
            <span>Unavailable Venues ({unavailableVenues.length})</span>
            <span className="text-[11px] font-normal text-slate-400 lowercase">(excluded by deterministic rules)</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unavailableVenues.map((unv) => (
              <div
                key={unv.venueId}
                className="bg-slate-100/70 rounded-2xl p-4 border border-slate-200 text-xs text-slate-500 space-y-2 opacity-80"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">{unv.name} ({unv.building})</span>
                  <Badge variant="warning">Unavailable</Badge>
                </div>
                <div className="text-[11px] text-amber-900 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                  {unv.reasons?.map((issue, idx) => (
                    <div key={idx}>• {issue}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmModal}
        onClose={() => setConfirmModal(false)}
        title="Confirm Venue Allocation"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Confirm venue reservation of <strong>{selectedVenue?.name}</strong> for event <strong>{event?.title}</strong>?
          </p>

          <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-700 space-y-1.5 border border-slate-200">
            <div><strong>Date:</strong> {event?.event_date}</div>
            <div><strong>Time:</strong> {event?.start_time} - {event?.end_time}</div>
            <div><strong>Capacity:</strong> {selectedVenue?.capacity} Seats</div>
            <div><strong>Location:</strong> {selectedVenue?.building}</div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setConfirmModal(false)}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={confirming}
              onClick={handleConfirmBooking}
              className="px-5 py-2 text-sm font-semibold text-white bg-brand-900 hover:bg-brand-800 rounded-xl shadow-sm transition-colors"
            >
              {confirming ? 'Locking Reservation...' : 'Confirm & Reserve Slot'}
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
