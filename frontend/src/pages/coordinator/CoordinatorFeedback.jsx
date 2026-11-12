import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, 
  MessageSquare, 
  ArrowLeft, 
  Building2, 
  Users, 
  Sparkles 
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { LoadingSpinner, Badge, EmptyState } from '../../components/common/UIComponents';

export function CoordinatorFeedback() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { error } = useToast();

  useEffect(() => {
    async function loadFeedback() {
      try {
        const res = await api.get(`/feedback/events/${id}`);
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        error('Failed to load event reviews.');
      } finally {
        setLoading(false);
      }
    }

    loadFeedback();
  }, [id]);

  if (loading) {
    return <LoadingSpinner message="Aggregating attendee feedback and ratings..." />;
  }

  if (!data) {
    return (
      <div className="text-center py-16">
        <h2 className="text-lg font-bold text-slate-800">Event Feedback Not Found</h2>
        <Link to="/coordinator/events" className="text-sm text-brand-900 underline mt-2 inline-block">
          Return to Events
        </Link>
      </div>
    );
  }

  const reviews = data.reviews || [];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      <Link
        to="/coordinator/events"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Events</span>
      </Link>

      {/* Header & Averages */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <div className="mb-6">
          <span className="text-xs font-bold text-brand-900 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            Post-Event Evaluation
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {data.eventTitle} Feedback
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ratings and reviews submitted by verified event attendees.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-100">
          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 text-center">
            <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
              <Star className="w-5 h-5 fill-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-900">{data.stats.avgOverall || 0} / 5</div>
            <div className="text-[11px] font-semibold text-amber-800 mt-0.5">Overall Rating</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
            <div className="text-2xl font-black text-slate-900">{data.stats.avgOrganization || 0} / 5</div>
            <div className="text-[11px] font-semibold text-slate-500 mt-0.5">Organization Quality</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
            <div className="text-2xl font-black text-slate-900">{data.stats.avgVenue || 0} / 5</div>
            <div className="text-[11px] font-semibold text-slate-500 mt-0.5">Venue & Facilities</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
            <div className="text-2xl font-black text-slate-900">{data.stats.totalReviews || 0}</div>
            <div className="text-[11px] font-semibold text-slate-500 mt-0.5">Total Reviews</div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Attendee Reviews ({reviews.length})</h2>

        {reviews.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No reviews submitted yet"
            description="When eligible students submit feedback for this completed event, their responses will appear here."
          />
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div
                key={r.feedback_id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{r.student_name}</h3>
                    <p className="text-xs text-slate-500">{r.department} (Year {r.year_of_study})</p>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-semibold">
                    <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg text-amber-900 border border-amber-200">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>Overall: {r.overall_rating}/5</span>
                    </div>
                    <span className="text-slate-500">Org: {r.organization_rating}/5</span>
                    <span className="text-slate-500">Venue: {r.venue_rating}/5</span>
                  </div>
                </div>

                {r.comments && (
                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 italic">
                    "{r.comments}"
                  </p>
                )}

                <div className="text-[10px] text-slate-400">
                  Submitted: {new Date(r.submitted_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
