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
        className="inline-flex items-center gap-2 text-xs font-bold text-[#87613B] hover:text-[#262B32] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Explore Events</span>
      </Link>

      {/* Main Event Card */}
      <div className="bg-[#FFFDFC] rounded-3xl border border-[#DFD0BE] p-8 shadow-xs">
        
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#262B32] bg-[#EDE5D9] px-3 py-1 rounded-full border border-[#DFD0BE]">
              {event.category}
            </span>
            <span className="text-xs font-medium text-[#68635D]">
              Organized by <strong className="text-[#262B32]">{event.club_name}</strong>
            </span>
          </div>

          <Badge variant={event.status === 'PUBLISHED' ? 'success' : 'default'}>
            {event.status}
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#262B32] tracking-tight mb-4">
          {event.title}
        </h1>

        <p className="text-base text-[#68635D] leading-relaxed mb-8">
          {event.description || 'Join your fellow students for this campus event.'}
        </p>

        {/* Schedule & Location Box */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-[#F6F3EE] border border-[#DFD0BE]/80 mb-8">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#FFFDFC] border border-[#DFD0BE] text-[#87613B] shadow-xs">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-[#68635D] uppercase tracking-wider">Date</div>
              <div className="text-sm font-bold text-[#262B32]">{event.event_date}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#FFFDFC] border border-[#DFD0BE] text-[#87613B] shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-[#68635D] uppercase tracking-wider">Time</div>
              <div className="text-sm font-bold text-[#262B32]">{event.start_time} - {event.end_time}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#FFFDFC] border border-[#DFD0BE] text-[#87613B] shadow-xs">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-[#68635D] uppercase tracking-wider">Venue</div>
              <div className="text-sm font-bold text-[#262B32] truncate">
                {event.venue_name || 'Campus Venue'}
              </div>
              <div className="text-xs text-[#68635D]">{event.venue_building || 'Campus'}</div>
            </div>
          </div>
        </div>

        {/* Registration & Capacity Progress */}
        <div className="border-t border-[#DFD0BE] pt-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-[#8C857D]" />
              <span className="text-sm font-bold text-[#262B32]">
                {event.registered_count} / {event.registration_capacity} registered
              </span>
              <span className="text-xs text-[#68635D]">
                ({event.remaining_capacity} seats available)
              </span>
            </div>
            <div className="w-64 bg-[#EDE5D9] rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  event.is_full ? 'bg-[#B83D3D]' : 'bg-[#237451]'
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
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#237451] bg-[#237451]/10 px-3 py-2 rounded-xl border border-[#237451]/30">
                  <CheckCircle2 className="w-4 h-4 text-[#237451]" />
                  Pass Confirmed
                </span>
                <button
                  onClick={() => setShowQRModal(true)}
                  className="px-5 py-2.5 bg-[#262B32] hover:bg-[#191F24] text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.01]"
                >
                  <Ticket className="w-4 h-4" />
                  <span>View Digital Pass</span>
                </button>
              </div>
            ) : event.is_full ? (
              <button
                disabled
                className="px-6 py-3 bg-[#EDE5D9] text-[#68635D] font-semibold text-sm rounded-xl cursor-not-allowed border border-[#DFD0BE]"
              >
                Event Capacity Reached
              </button>
            ) : (
              <button
                onClick={handleRegister}
                disabled={registering}
                className="px-8 py-3.5 bg-[#262B32] hover:bg-[#191F24] text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.01]"
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
        <div className="bg-[#FFFDFC] rounded-3xl p-6 border border-[#DFD0BE] shadow-xs">
          <h3 className="text-sm font-bold text-[#262B32] uppercase tracking-wider mb-3">
            Room Facilities
          </h3>
          {event.required_facilities && event.required_facilities.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {event.required_facilities.map((fac, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-[#EDE5D9] text-[#262B32] border border-[#DFD0BE] text-xs font-semibold rounded-lg capitalize"
                >
                  {fac.replace('_', ' ')}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#68635D]">Standard campus venue equipment provided.</p>
          )}
        </div>

        <div className="bg-[#FFFDFC] rounded-3xl p-6 border border-[#DFD0BE] shadow-xs">
          <h3 className="text-sm font-bold text-[#262B32] uppercase tracking-wider mb-3">
            Club In-Charge
          </h3>
          <div className="text-sm text-[#262B32] font-semibold">
            {event.coordinator_name || 'Club Coordinator'}
          </div>
          <div className="text-xs text-[#68635D]">
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
