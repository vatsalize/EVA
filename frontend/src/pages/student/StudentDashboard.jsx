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
      <div className="bg-[#191F24] border border-[#262B32] rounded-3xl p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#EACBA5] border border-white/15 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#EACBA5]" />
            Thapar Institute Student Portal
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-white">
            Welcome back, {user?.fullName}!
          </h1>
          <p className="text-[#DFD0BE] text-sm leading-relaxed mb-6">
            Explore upcoming technical symposiums, workshops, and cultural fests. Access your digital QR event passes anytime.
          </p>

          <Link
            to="/student/explore"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#EACBA5] hover:bg-[#DFBF99] text-[#262B32] font-bold text-sm transition-all shadow-xs hover:scale-[1.01] cursor-pointer"
          >
            <span>Explore Campus Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Subtle accent glow */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-[#B8956B]/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-[#FFFDFC] p-6 rounded-2xl border border-[#DFD0BE] shadow-xs flex items-center justify-between">
          <div>
            <div className="text-2xl font-black text-[#262B32]">{stats.registered}</div>
            <div className="text-xs font-semibold text-[#68635D] mt-0.5">Events Registered</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#EDE5D9] text-[#87613B] flex items-center justify-center">
            <Ticket className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#FFFDFC] p-6 rounded-2xl border border-[#DFD0BE] shadow-xs flex items-center justify-between">
          <div>
            <div className="text-2xl font-black text-[#262B32]">{stats.attended}</div>
            <div className="text-xs font-semibold text-[#68635D] mt-0.5">Verified Footfall / Attended</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#237451]/10 text-[#237451] flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#FFFDFC] p-6 rounded-2xl border border-[#DFD0BE] shadow-xs flex items-center justify-between">
          <div>
            <div className="text-2xl font-black text-[#262B32]">{stats.feedback}</div>
            <div className="text-xs font-semibold text-[#68635D] mt-0.5">Reviews Submitted</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#EACBA5]/30 text-[#87613B] flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* My Upcoming Event Passes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#262B32]">My Registered Passes</h2>
          <Link
            to="/student/registrations"
            className="text-xs font-bold text-[#87613B] hover:underline flex items-center gap-1"
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
                className="bg-[#FFFDFC] rounded-2xl border border-[#DFD0BE] p-5 shadow-xs hover:border-[#B8956B] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-[#262B32] bg-[#EDE5D9] border border-[#DFD0BE] px-2.5 py-0.5 rounded-full">
                      {reg.event_category}
                    </span>
                    <Badge variant={reg.hasCheckedIn ? 'success' : 'primary'}>
                      {reg.hasCheckedIn ? 'Attended' : 'Pass Confirmed'}
                    </Badge>
                  </div>

                  <h3 className="text-base font-bold text-[#262B32] mb-1 leading-snug line-clamp-1">
                    {reg.event_title}
                  </h3>
                  <p className="text-xs text-[#68635D] mb-4">{reg.club_name}</p>

                  <div className="bg-[#F6F3EE] rounded-xl p-3 border border-[#DFD0BE]/60 text-xs text-[#68635D] space-y-1.5 mb-5">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#87613B]" />
                      <span className="text-[#262B32] font-medium">{reg.event_date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#87613B]" />
                      <span>{reg.start_time} - {reg.end_time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#87613B]" />
                      <span className="truncate">{reg.venue_name || 'Campus Venue'}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedQRPass(reg)}
                  className="w-full py-2.5 px-3 bg-[#262B32] hover:bg-[#191F24] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
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
          <h2 className="text-xl font-bold text-[#262B32]">Upcoming Events to Explore</h2>
          <Link
            to="/student/explore"
            className="text-xs font-bold text-[#87613B] hover:underline flex items-center gap-1"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {exploreEvents.map((evt) => (
            <div
              key={evt.event_id}
              className="bg-[#FFFDFC] rounded-2xl border border-[#DFD0BE] p-5 shadow-xs hover:border-[#B8956B] hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#262B32] bg-[#EDE5D9] border border-[#DFD0BE] px-2.5 py-0.5 rounded-full">
                    {evt.category}
                  </span>
                  <span className="text-xs font-semibold text-[#237451] bg-[#237451]/10 px-2.5 py-0.5 rounded-full border border-[#237451]/30">
                    {evt.remaining_capacity} seats left
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#262B32] mb-1 leading-snug line-clamp-1">
                  {evt.title}
                </h3>
                <p className="text-xs text-[#68635D] mb-4">{evt.club_name}</p>

                <div className="bg-[#F6F3EE] rounded-xl p-3 border border-[#DFD0BE]/60 text-xs text-[#68635D] space-y-1.5 mb-5">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#87613B]" />
                    <span className="text-[#262B32] font-medium">{evt.event_date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#87613B]" />
                    <span className="truncate">{evt.venue_name || 'Campus Venue'}</span>
                  </div>
                </div>
              </div>

              <Link
                to={`/student/events/${evt.event_id}`}
                className="w-full py-2.5 px-3 bg-[#EDE5D9] hover:bg-[#DFD0BE] text-[#262B32] border border-[#DFD0BE] text-xs font-bold rounded-xl text-center transition-colors block shadow-xs"
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
