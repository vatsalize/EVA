import React, { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  Star, 
  Building2, 
  Calendar,
  Sparkles 
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { LoadingSpinner } from '../../components/common/UIComponents';

const COLORS = ['#0f1f38', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export function CoordinatorAnalytics() {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [eventsData, setEventsData] = useState([]);
  const [venuesData, setVenuesData] = useState([]);
  const [feedbackData, setFeedbackData] = useState(null);

  const { error } = useToast();

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const [ovRes, evRes, vnRes, fbRes] = await Promise.all([
          api.get('/analytics/overview'),
          api.get('/analytics/events'),
          api.get('/analytics/venues'),
          api.get('/analytics/feedback')
        ]);

        if (ovRes.data.success) setOverview(ovRes.data.kpi);
        if (evRes.data.success) setEventsData(evRes.data.events || []);
        if (vnRes.data.success) setVenuesData(vnRes.data.venues || []);
        if (fbRes.data.success) setFeedbackData(fbRes.data);
      } catch (err) {
        error('Failed to load coordinator analytics.');
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Calculating college event lifecycle analytics..." size="lg" />;
  }

  // Format chart data for events comparison
  const eventComparisonChartData = eventsData.map((e) => ({
    name: e.title.length > 15 ? e.title.slice(0, 15) + '...' : e.title,
    Registrations: e.registrations,
    Footfall: e.actual_footfall,
    Turnout: e.turnout_rate
  }));

  // Format star rating distribution
  const starData = [
    { star: '5 Stars', count: 0 },
    { star: '4 Stars', count: 0 },
    { star: '3 Stars', count: 0 },
    { star: '2 Stars', count: 0 },
    { star: '1 Star', count: 0 }
  ];

  if (feedbackData?.distribution) {
    feedbackData.distribution.forEach((d) => {
      const idx = 5 - d.star;
      if (idx >= 0 && idx < 5) {
        starData[idx].count = d.count;
      }
    });
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Club Performance & Lifecycle Analytics
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Connected metrics spanning event registration capacity, actual entrance footfall, ratings, and venue efficiency.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Registrations</div>
          <div className="text-3xl font-black text-slate-900 mt-1">{overview?.totalRegistrations || 0}</div>
          <div className="text-xs text-slate-500 mt-1">Digital passes claimed</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">Actual Footfall</div>
          <div className="text-3xl font-black text-emerald-600 mt-1">{overview?.actualFootfall || 0}</div>
          <div className="text-xs text-emerald-700 mt-1">Verified check-ins</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-purple-800">Turnout Rate</div>
          <div className="text-3xl font-black text-purple-600 mt-1">{overview?.turnoutRate || 0}%</div>
          <div className="text-xs text-purple-700 mt-1">Footfall / Registrations</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-800">Average Rating</div>
          <div className="text-3xl font-black text-amber-600 mt-1">
            {overview?.averageRating ? `${overview.averageRating} ★` : 'N/A'}
          </div>
          <div className="text-xs text-amber-700 mt-1">{overview?.totalFeedback || 0} Reviews submitted</div>
        </div>
      </div>

      {/* Primary Chart: Registrations vs Actual Footfall */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Registrations vs. Actual Footfall</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Empirical verification of student participation across club events.
            </p>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={eventComparisonChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                labelStyle={{ fontWeight: 'bold', color: '#0f172a' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="Registrations" fill="#94b5d7" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Footfall" fill="#0f1f38" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Secondary Row: Venue Utilization & Star Ratings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Venue Booking Utilization */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Campus Venue Usage</h3>
            <p className="text-xs text-slate-500 mb-6">Venues frequently selected for your club events.</p>

            <div className="space-y-3">
              {venuesData.map((v, idx) => (
                <div key={v.venue_id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{v.venue_name}</div>
                    <div className="text-slate-500 text-[11px]">{v.building} • {v.capacity} Seats</div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-brand-900">{v.bookings_count} Bookings</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">{v.total_footfall || 0} Total Footfall</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feedback Star Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Attendee Ratings Breakdown</h3>
            <p className="text-xs text-slate-500 mb-6">Distribution of feedback ratings across all events.</p>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={starData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis type="category" dataKey="star" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#f59e0b" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-around text-center text-xs text-slate-600">
            <div>
              <div className="font-bold text-slate-900">{feedbackData?.averages.organization || 0} / 5</div>
              <div className="text-[10px] text-slate-400">Organization Score</div>
            </div>
            <div>
              <div className="font-bold text-slate-900">{feedbackData?.averages.venue || 0} / 5</div>
              <div className="text-[10px] text-slate-400">Venue Score</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
