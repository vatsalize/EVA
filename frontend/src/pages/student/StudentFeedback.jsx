import React, { useEffect, useState } from 'react';
import { 
  Star, 
  MessageSquare, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Sparkles,
  Building2,
  Clock
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { LoadingSpinner, Badge, EmptyState, Modal } from '../../components/common/UIComponents';

export function StudentFeedback() {
  const [attendedEvents, setAttendedEvents] = useState([]);
  const [myFeedbackHistory, setMyFeedbackHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review Modal State
  const [activeReviewEvent, setActiveReviewEvent] = useState(null);
  const [overallRating, setOverallRating] = useState(5);
  const [orgRating, setOrgRating] = useState(5);
  const [venueRating, setVenueRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { success, error } = useToast();

  const loadData = async () => {
    try {
      const [regsRes, feedbackRes] = await Promise.all([
        api.get('/registrations/my-registrations'),
        api.get('/feedback/my-feedback')
      ]);

      const allRegs = regsRes.data.registrations || [];
      // Eligible events: completed + attended (hasCheckedIn) + NOT yet reviewed
      const reviewedEventIds = new Set((feedbackRes.data.feedback || []).map(f => f.event_id));
      
      const eligible = allRegs.filter(r => 
        r.event_status === 'COMPLETED' && 
        r.hasCheckedIn && 
        !reviewedEventIds.has(r.event_id)
      );

      setAttendedEvents(eligible);
      setMyFeedbackHistory(feedbackRes.data.feedback || []);
    } catch (err) {
      error('Failed to load feedback records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openReviewModal = (event) => {
    setActiveReviewEvent(event);
    setOverallRating(5);
    setOrgRating(5);
    setVenueRating(5);
    setComment('');
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!activeReviewEvent) return;

    setSubmitting(true);
    try {
      await api.post(`/feedback/events/${activeReviewEvent.event_id}`, {
        overallRating,
        organizationRating: orgRating,
        venueRating,
        comments: comment
      });
      success('Thank you! Your event feedback and ratings have been submitted.');
      setActiveReviewEvent(null);
      loadData();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to submit feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStarSelector = (value, onChange, label) => (
    <div>
      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="p-1 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none"
          >
            <Star
              className={`w-6 h-6 transition-colors ${
                star <= value
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-slate-300'
              }`}
            />
          </button>
        ))}
        <span className="text-xs font-bold text-slate-700 ml-2">{value} / 5</span>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSpinner message="Loading your event reviews and feedback..." />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Event Feedback & Ratings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Share your experience for events you attended to help campus clubs improve.
        </p>
      </div>

      {/* Events Pending Review */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span>Pending Feedback</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-900 border border-brand-200">
            {attendedEvents.length}
          </span>
        </h2>

        {attendedEvents.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center text-sm text-slate-500">
            No events pending your feedback. When you attend an event and it concludes, you can submit your rating here!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {attendedEvents.map((evt) => (
              <div
                key={evt.registration_id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:border-brand-400 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-brand-900 bg-brand-50 px-2.5 py-0.5 rounded-full">
                      {evt.event_category}
                    </span>
                    <Badge variant="success">Attended</Badge>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1 leading-snug">
                    {evt.event_title}
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">{evt.club_name}</p>

                  <div className="text-xs text-slate-600 space-y-1 mb-5">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{evt.event_date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{evt.venue_name || 'Campus Venue'}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => openReviewModal(evt)}
                  className="w-full py-2.5 px-4 bg-brand-900 hover:bg-brand-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Star className="w-4 h-4 fill-white" />
                  <span>Submit Rating & Review</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submitted Feedback History */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span>My Feedback History</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {myFeedbackHistory.length}
          </span>
        </h2>

        {myFeedbackHistory.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center text-sm text-slate-500">
            You haven't submitted any event reviews yet.
          </div>
        ) : (
          <div className="space-y-4">
            {myFeedbackHistory.map((fb) => (
              <div
                key={fb.feedback_id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{fb.event_title}</h4>
                    <p className="text-xs text-slate-500">{fb.club_name} • {fb.event_date}</p>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg text-amber-900 border border-amber-200">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>Overall: {fb.overall_rating}/5</span>
                    </div>
                    <div className="text-slate-500">Org: {fb.organization_rating}/5</div>
                    <div className="text-slate-500">Venue: {fb.venue_rating}/5</div>
                  </div>
                </div>

                {fb.comments && (
                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 italic">
                    "{fb.comments}"
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      <Modal
        isOpen={Boolean(activeReviewEvent)}
        onClose={() => setActiveReviewEvent(null)}
        title={`Review: ${activeReviewEvent?.event_title}`}
      >
        <form onSubmit={handleFeedbackSubmit} className="space-y-5">
          {renderStarSelector(overallRating, setOverallRating, 'Overall Event Rating')}
          {renderStarSelector(orgRating, setOrgRating, 'Club Organization Rating')}
          {renderStarSelector(venueRating, setVenueRating, 'Venue & Facilities Rating')}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Comments & Suggestions
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you enjoy? Any recommendations for future events?"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-900 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setActiveReviewEvent(null)}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-sm font-semibold text-white bg-brand-900 hover:bg-brand-800 rounded-xl shadow-sm transition-colors"
            >
              {submitting ? 'Submitting...' : 'Post Feedback'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
