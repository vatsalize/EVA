import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar, 
  Users, 
  CheckCircle2, 
  BarChart3, 
  Sparkles, 
  PlusCircle, 
  QrCode, 
  Building2, 
  ArrowRight,
  TrendingUp,
  Ticket
} from 'lucide-react';
import api from '../../services/api';
import { LoadingSpinner, Badge, EmptyState } from '../../components/common/UIComponents';

export function CoordinatorDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [kpi, setKpi] = useState({
    totalEvents: 0,
    publishedEvents: 0,
    completedEvents: 0,
    totalRegistrations: 0,
    actualFootfall: 0,
    turnoutRate: 0,
    averageRating: 0
  });
  const [recentEvents, setRecentEvents] = useState([]);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [kpiRes, eventsRes] = await Promise.all([
          api.get('/analytics/overview'),
          api.get('/events/my-events')
        ]);

        if (kpiRes.data.success) {
          setKpi(kpiRes.data.kpi);
        }

        if (eventsRes.data.success) {
          setRecentEvents(eventsRes.data.events.slice(0, 5));
        }
      } catch (err) {
        console.error('Failed to load coordinator dashboard', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading coordinator management console..." />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-500/30">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Club Coordinator Console • {user?.clubName || 'Assigned Club'}
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Welcome back, {user?.fullName}!
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            You are managing events for <strong>{user?.clubName}</strong>. Schedule new activities, 
            book campus venues with conflict prevention, scan QR codes, and monitor footfall.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/coordinator/events/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Event</span>
            </Link>

            <Link
              to="/coordinator/scanner"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all border border-white/20"
            >
              <QrCode className="w-4 h-4" />
              <span>Launch QR Scanner</span>
            </Link>
          </div>
        </div>

        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Club Events</span>
            <Calendar className="w-4 h-4 text-brand-700" />
          </div>
          <div className="text-2xl font-black text-slate-900">{kpi.totalEvents}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            {kpi.publishedEvents} active, {kpi.completedEvents} completed
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Registrations</span>
            <Ticket className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{kpi.totalRegistrations}</div>
          <div className="text-[11px] text-slate-500 mt-1">Across all club events</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Actual Footfall</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{kpi.actualFootfall}</div>
          <div className="text-[11px] text-slate-500 mt-1">Verified entrance scans</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Turnout Rate</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-600">{kpi.turnoutRate}%</div>
          <div className="text-[11px] text-slate-500 mt-1">Footfall / Registrations</div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Link
          to="/coordinator/events"
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-brand-400 hover:shadow-md transition-all group flex items-start justify-between"
        >
          <div>
            <h3 className="font-bold text-slate-900 group-hover:text-brand-900 transition-colors">Manage Club Events</h3>
            <p className="text-xs text-slate-500 mt-1">Draft, publish, cancel, and oversee bookings.</p>
          </div>
          <Calendar className="w-5 h-5 text-slate-400 group-hover:text-brand-900 transition-colors" />
        </Link>

        <Link
          to="/coordinator/venues"
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-brand-400 hover:shadow-md transition-all group flex items-start justify-between"
        >
          <div>
            <h3 className="font-bold text-slate-900 group-hover:text-brand-900 transition-colors">Campus Venues</h3>
            <p className="text-xs text-slate-500 mt-1">View halls, capacities, and technical facilities.</p>
          </div>
          <Building2 className="w-5 h-5 text-slate-400 group-hover:text-brand-900 transition-colors" />
        </Link>

        <Link
          to="/coordinator/analytics"
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-brand-400 hover:shadow-md transition-all group flex items-start justify-between"
        >
          <div>
            <h3 className="font-bold text-slate-900 group-hover:text-brand-900 transition-colors">Event Analytics</h3>
            <p className="text-xs text-slate-500 mt-1">Turnout charts, feedback scores, and reports.</p>
          </div>
          <BarChart3 className="w-5 h-5 text-slate-400 group-hover:text-brand-900 transition-colors" />
        </Link>
      </div>

      {/* Recent Club Events Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Recent Club Events</h2>
          <Link
            to="/coordinator/events"
            className="text-xs font-semibold text-brand-900 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentEvents.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            No events scheduled yet. Click "Create New Event" to get started!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-6">Event Title</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Venue</th>
                  <th className="py-3 px-4">Registrations</th>
                  <th className="py-3 px-4">Footfall</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentEvents.map((evt) => (
                  <tr key={evt.event_id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900">
                      {evt.title}
                    </td>
                    <td className="py-4 px-4 text-slate-600">
                      {evt.event_date} <br />
                      <span className="text-[11px] text-slate-400">{evt.start_time} - {evt.end_time}</span>
                    </td>
                    <td className="py-4 px-4 text-slate-600">
                      {evt.venue_name || <span className="text-amber-600 font-medium">Unbooked</span>}
                    </td>
                    <td className="py-4 px-4 text-slate-800 font-medium">
                      {evt.registered_count} / {evt.registration_capacity}
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-emerald-600">{evt.actual_footfall}</span>
                      {evt.registered_count > 0 && (
                        <span className="text-[11px] text-slate-400 ml-1">({evt.turnout_rate}%)</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
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
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      {!evt.venue_id && evt.status === 'DRAFT' && (
                        <Link
                          to={`/coordinator/booking/${evt.event_id}`}
                          className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-xs font-semibold transition-colors"
                        >
                          Book Venue
                        </Link>
                      )}
                      {evt.status === 'PUBLISHED' && (
                        <Link
                          to={`/coordinator/events/${evt.event_id}/footfall`}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors"
                        >
                          Footfall
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
