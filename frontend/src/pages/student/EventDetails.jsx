import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle2, 
  Ticket, 
  Sparkles, 
  ShieldCheck, 
  ArrowLeft,
  Building2,
  AlertCircle
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { LoadingSpinner, Badge } from '../../components/common/UIComponents';
import { QRModal } from '../../components/common/QRModal';

export function EventDetails() {
  const { id } = useParams();
  const { user, isAuthenticated, isStudent } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [userState, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  useEffect(() => {
    async function loadEvent() {
      try {
        const res = await api.get(`/events/${id}`);
        if (res.data.success) {
          setEvent(res.data.event);
          setUserState(res.data.userState || null);
        }
      } catch (err) {
        error('Failed to load event details.');
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [id]);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setRegistering(true);
    try {
      const res = await api.post(`/registrations/events/${id}/register`);
      if (res.data.success) {
        success('Registration Confirmed! Your digital QR pass is ready.');
        setUserState({
          isRegistered: true,
          registration: {
            ...res.data.registration,
            event_title: event.title,
            event_date: event.event_date,
            start_time: event.start_time,
            end_time: event.end_time,
            venue_name: event.venue_name,
            venue_building: event.venue_building,
            club_name: event.club_name
          }
        });
        setShowQRModal(true);
        // Refresh event details
        const refreshed = await api.get(`/events/${id}`);
        setEvent(refreshed.data.event);
      }
    } catch (err) {
      error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading event details..." />;
  }

  if (!event) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold text-slate-800">Event Not Found</h2>
        <Link to="/student/explore" className="text-sm text-brand-900 underline mt-2 inline-block">
          Return to Explore Events
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Back button */}
      <Link
        to="/student/explore"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Explore Events</span>
      </Link>

      {/* Main Event Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-brand-900 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
              {event.category}
            </span>
            <span className="text-xs font-medium text-slate-500">
              Organized by <strong className="text-slate-800">{event.club_name}</strong>
            </span>
          </div>

          <Badge variant={event.status === 'PUBLISHED' ? 'success' : 'default'}>
            {event.status}
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
          {event.title}
        </h1>

        <p className="text-base text-slate-600 leading-relaxed mb-8">
          {event.description || 'Join your fellow students for this campus event.'}
        </p>

        {/* Schedule & Location Box */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80 mb-8">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-brand-900">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Date</div>
              <div className="text-sm font-bold text-slate-900">{event.event_date}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-brand-900">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Time</div>
              <div className="text-sm font-bold text-slate-900">{event.start_time} - {event.end_time}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-brand-900">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Venue</div>
              <div className="text-sm font-bold text-slate-900 truncate">
                {event.venue_name || 'Campus Venue'}
              </div>
              <div className="text-xs text-slate-500">{event.venue_building || 'Campus'}</div>
            </div>
          </div>
        </div>

        {/* Registration & Capacity Progress */}
        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-bold text-slate-800">
                {event.registered_count} / {event.registration_capacity} registered
              </span>
              <span className="text-xs text-slate-500">
                ({event.remaining_capacity} seats available)
              </span>
            </div>
            <div className="w-64 bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  event.is_full ? 'bg-red-500' : 'bg-emerald-500'
                }`}
                style={{
                  width: `${Math.min(100, Math.round((event.registered_count / event.registration_capacity) * 100))}%`
                }}
              />
            </div>
          </div>

          {/* Registration Action Buttons */}
          <div>
            {userState?.isRegistered ? (
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Pass Confirmed
                </span>
                <button
                  onClick={() => setShowQRModal(true)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <Ticket className="w-4 h-4" />
                  <span>View Digital Pass</span>
                </button>
              </div>
            ) : event.is_full ? (
              <button
                disabled
                className="px-6 py-3 bg-slate-100 text-slate-400 font-semibold text-sm rounded-xl cursor-not-allowed"
              >
                Event Capacity Reached
              </button>
            ) : (
              <button
                onClick={handleRegister}
                disabled={registering}
                className="px-8 py-3.5 bg-brand-900 hover:bg-brand-800 text-white font-bold text-sm rounded-2xl shadow-lg shadow-brand-900/10 transition-all flex items-center gap-2"
              >
                {registering ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Ticket className="w-4 h-4" />
                    <span>Confirm Event Registration</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Facilities & Coordinator Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
            Room Facilities
          </h3>
          {event.required_facilities && event.required_facilities.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {event.required_facilities.map((fac, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg capitalize"
                >
                  {fac.replace('_', ' ')}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">Standard campus venue equipment provided.</p>
          )}
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
            Club In-Charge
          </h3>
          <div className="text-sm text-slate-800 font-semibold">
            {event.coordinator_name || 'Club Coordinator'}
          </div>
          <div className="text-xs text-slate-500">
            {event.coordinator_email || 'coordinator@thapar.edu'}
          </div>
        </div>
      </div>

      {/* QR Modal */}
      <QRModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        registration={userState?.registration || {
          event_title: event.title,
          event_date: event.event_date,
          start_time: event.start_time,
          end_time: event.end_time,
          venue_name: event.venue_name,
          venue_building: event.venue_building,
          club_name: event.club_name,
          qr_token: userState?.registration?.qr_token || 'TOKEN'
        }}
      />
    </div>
  );
}
