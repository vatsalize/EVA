import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Users, 
  Search, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Download,
  Ticket
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { LoadingSpinner, Badge, EmptyState } from '../../components/common/UIComponents';

export function EventRegistrations() {
  const { id } = useParams();
  const [registrations, setRegistrations] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { error } = useToast();

  useEffect(() => {
    async function loadData() {
      try {
        const [eventRes, regsRes] = await Promise.all([
          api.get(`/events/${id}`),
          api.get(`/registrations/events/${id}`)
        ]);

        if (eventRes.data.success) {
          setEvent(eventRes.data.event);
        }
        if (regsRes.data.success) {
          setRegistrations(regsRes.data.registrations || []);
        }
      } catch (err) {
        error('Failed to load event registrations.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  if (loading) {
    return <LoadingSpinner message="Loading registration roster..." />;
  }

  const filtered = registrations.filter((r) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      r.student_name.toLowerCase().includes(s) ||
      r.student_id.toLowerCase().includes(s) ||
      (r.department && r.department.toLowerCase().includes(s))
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      <Link
        to="/coordinator/events"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Events</span>
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-brand-900 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
              Registration Roster
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              {event?.title}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {event?.event_date} • {event?.start_time} - {event?.end_time} • {event?.venue_name || 'Campus Venue'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-center">
              <div className="font-bold text-slate-900">{registrations.length} / {event?.registration_capacity}</div>
              <div className="text-[10px] text-slate-400">Total Registered</div>
            </div>
          </div>
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Registered Students</h2>
            <p className="text-xs text-slate-500">Students with confirmed digital passes.</p>
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name or roll..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-900 focus:outline-none"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-500">
            No registrations found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-6">Student Name</th>
                  <th className="py-3 px-4">Student ID / Roll</th>
                  <th className="py-3 px-4">Department & Year</th>
                  <th className="py-3 px-4">Registration Date</th>
                  <th className="py-3 px-4">Pass Token</th>
                  <th className="py-3 px-6 text-right">Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((r) => (
                  <tr key={r.registration_id} className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-6 font-semibold text-slate-900">
                      {r.student_name}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {r.student_id}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {r.department} (Year {r.year_of_study})
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(r.registered_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[10px] text-slate-400 truncate max-w-[140px]">
                      {r.qr_token}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      {r.isCheckedIn ? (
                        <Badge variant="success">Attended</Badge>
                      ) : (
                        <Badge variant="default">Pass Issued</Badge>
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
