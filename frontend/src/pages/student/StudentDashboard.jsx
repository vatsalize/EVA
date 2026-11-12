import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar, 
  MapPin, 
  Ticket, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  QrCode,
  Users
} from 'lucide-react';
import api from '../../services/api';
import { LoadingSpinner, Badge, EmptyState } from '../../components/common/UIComponents';
import { QRModal } from '../../components/common/QRModal';

export function StudentDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ registered: 0, attended: 0, feedback: 0 });
  const [myUpcoming, setMyUpcoming] = useState([]);
  const [exploreEvents, setExploreEvents] = useState([]);
  const [selectedQRPass, setSelectedQRPass] = useState(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [profileRes, regsRes, eventsRes] = await Promise.all([
          api.get('/users/profile'),
          api.get('/registrations/my-registrations'),
          api.get('/events')
        ]);

        if (profileRes.data.success) {
          setStats({
            registered: profileRes.data.profile.totalRegistrations || 0,
            attended: profileRes.data.profile.totalAttended || 0,
            feedback: profileRes.data.profile.totalFeedback || 0
          });
        }

        if (regsRes.data.success) {
          setMyUpcoming(regsRes.data.registrations.slice(0, 3));
        }

        if (eventsRes.data.success) {
          setExploreEvents(eventsRes.data.events.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load student dashboard', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading your student campus dashboard..." />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-brand-200 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Thapar Institute Student Portal
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Welcome back, {user?.fullName}!
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            Explore upcoming technical symposiums, workshops, and cultural fests. Access your digital QR event passes anytime.
          </p>

          <Link
            to="/student/explore"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-md"
          >
            <span>Explore Campus Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Background accent ring */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-slate-900">{stats.registered}</div>
            <div className="text-xs font-medium text-slate-500 mt-0.5">Events Registered</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Ticket className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-slate-900">{stats.attended}</div>
            <div className="text-xs font-medium text-slate-500 mt-0.5">Verified Footfall / Attended</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-slate-900">{stats.feedback}</div>
            <div className="text-xs font-medium text-slate-500 mt-0.5">Reviews Submitted</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* My Upcoming Event Passes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">My Registered Passes</h2>
          <Link
            to="/student/registrations"
            className="text-xs font-semibold text-brand-900 hover:underline flex items-center gap-1"
          >
            <span>View All ({stats.registered})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {myUpcoming.length === 0 ? (
          <EmptyState
            icon={Ticket}
            title="No event registrations yet"
            description="You haven't signed up for any events yet. Check out the campus schedule!"
            actionText="Browse Events"
            onAction={() => (window.location.href = '/student/explore')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {myUpcoming.map((reg) => (
              <div
                key={reg.registration_id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-brand-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold text-brand-900 bg-brand-50 px-2 py-0.5 rounded-full">
                      {reg.event_category}
                    </span>
                    <Badge variant={reg.hasCheckedIn ? 'success' : 'primary'}>
                      {reg.hasCheckedIn ? 'Attended' : 'Pass Confirmed'}
                    </Badge>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1 leading-snug line-clamp-1">
                    {reg.event_title}
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">{reg.club_name}</p>

                  <div className="text-xs text-slate-600 space-y-1.5 mb-5">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{reg.event_date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{reg.start_time} - {reg.end_time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{reg.venue_name || 'Campus Venue'}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedQRPass(reg)}
                  className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Show Digital Pass</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Featured / Explore Events */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">Upcoming Events to Explore</h2>
          <Link
            to="/student/explore"
            className="text-xs font-semibold text-brand-900 hover:underline flex items-center gap-1"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {exploreEvents.map((evt) => (
            <div
              key={evt.event_id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-brand-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    {evt.category}
                  </span>
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    {evt.remaining_capacity} seats left
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1 leading-snug line-clamp-1">
                  {evt.title}
                </h3>
                <p className="text-xs text-slate-500 mb-4">{evt.club_name}</p>

                <div className="text-xs text-slate-600 space-y-1.5 mb-5">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{evt.event_date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{evt.venue_name || 'Campus Venue'}</span>
                  </div>
                </div>
              </div>

              <Link
                to={`/student/events/${evt.event_id}`}
                className="w-full py-2.5 px-3 bg-brand-50 hover:bg-brand-100 text-brand-900 text-xs font-semibold rounded-xl text-center transition-colors border border-brand-200 block"
              >
                View Details & Register
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* QR Pass Modal */}
      <QRModal
        isOpen={Boolean(selectedQRPass)}
        onClose={() => setSelectedQRPass(null)}
        registration={selectedQRPass}
      />
    </div>
  );
}
