import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  MapPin, 
  TrendingUp, 
  ArrowLeft,
  Search
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { LoadingSpinner, Badge, EmptyState } from '../../components/common/UIComponents';

export function FootfallDashboard() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { error } = useToast();

  useEffect(() => {
    async function loadFootfall() {
      try {
        const res = await api.get(`/checkins/events/${id}/footfall`);
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        error('Failed to load event footfall report.');
      } finally {
        setLoading(false);
      }
    }

    loadFootfall();
  }, [id]);

  if (loading) {
    return <LoadingSpinner message="Calculating actual footfall from entrance check-ins..." />;
  }

  if (!data) {
    return (
      <div className="text-center py-16">
        <h2 className="text-lg font-bold text-slate-800">Footfall Record Not Available</h2>
        <Link to="/coordinator/events" className="text-sm text-brand-900 underline mt-2 inline-block">
          Return to Events
        </Link>
      </div>
    );
  }

  const attendees = data.attendees || [];
  const filteredAttendees = attendees.filter((a) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      a.student_name.toLowerCase().includes(s) ||
      a.student_id.toLowerCase().includes(s) ||
      (a.department && a.department.toLowerCase().includes(s))
    );
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      <Link
        to="/coordinator/events"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Events</span>
      </Link>

      {/* Header Context */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-brand-900 bg-brand-50 px-3 py-0.5 rounded-full">
                {data.event.category}
              </span>
              <Badge variant="primary">{data.event.status}</Badge>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900">{data.event.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                <Calendar className="w-3.5 h-3.5 text-brand-700" />
                {data.event.eventDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-brand-700" />
                {data.event.startTime} - {data.event.endTime}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-brand-700" />
                {data.event.venueName || 'Campus Venue'}
              </span>
            </div>
          </div>

          <Link
            to="/coordinator/scanner"
            className="px-5 py-2.5 bg-brand-900 hover:bg-brand-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-2"
          >
            <span>Scan Passes</span>
          </Link>
        </div>

        {/* Footfall vs Registration KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Registrations</div>
            <div className="text-3xl font-black text-slate-900 mt-1">{data.metrics.totalRegistrations}</div>
            <div className="text-[11px] text-slate-400 mt-1">Confirmed passes issued</div>
          </div>

          <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-200/80">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">Actual Footfall</div>
            <div className="text-3xl font-black text-emerald-700 mt-1">{data.metrics.actualFootfall}</div>
            <div className="text-[11px] text-emerald-600 mt-1">Scanned at venue entrance</div>
          </div>

          <div className="bg-purple-50/60 p-5 rounded-2xl border border-purple-200/80">
            <div className="text-xs font-bold uppercase tracking-wider text-purple-800">Turnout Rate</div>
            <div className="text-3xl font-black text-purple-700 mt-1">{data.metrics.turnoutRate}%</div>
            <div className="text-[11px] text-purple-600 mt-1">Footfall / Registrations</div>
          </div>
        </div>
      </div>

      {/* Attendee Roster */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Verified Attendee Roster</h2>
            <p className="text-xs text-slate-500 mt-0.5">Students who checked in through unique QR codes.</p>
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search attendee or roll no..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-900 focus:outline-none"
            />
          </div>
        </div>

        {filteredAttendees.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-500">
            No attendees recorded yet. Once check-ins are recorded via the QR scanner, they will appear here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-6">Student Name</th>
                  <th className="py-3 px-4">Student ID / Roll</th>
                  <th className="py-3 px-4">Department & Year</th>
                  <th className="py-3 px-4">Scan Timestamp</th>
                  <th className="py-3 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAttendees.map((att) => (
                  <tr key={att.checkin_id} className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-6 font-semibold text-slate-900">
                      {att.student_name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono">
                      {att.student_id}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {att.department} (Year {att.year_of_study})
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(att.scanned_at).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <Badge variant="success">Checked In</Badge>
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
