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
      <label className="block text-xs font-bold text-[#262B32] uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="p-1 rounded-lg hover:bg-[#EDE5D9] transition-colors focus:outline-none cursor-pointer"
          >
            <Star
              className={`w-6 h-6 transition-colors ${
                star <= value
                  ? 'fill-[#B8956B] text-[#B8956B]'
                  : 'text-[#DFD0BE]'
              }`}
            />
          </button>
        ))}
        <span className="text-xs font-bold text-[#262B32] ml-2">{value} / 5</span>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSpinner message="Loading your event reviews and feedback..." />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#262B32] tracking-tight">
          Event Feedback & Ratings
        </h1>
        <p className="text-sm text-[#68635D] mt-1">
          Share your experience for events you attended to help campus clubs improve.
        </p>
      </div>

      {/* Events Pending Review */}
      <div>
        <h2 className="text-lg font-bold text-[#262B32] mb-4 flex items-center gap-2">
          <span>Pending Feedback</span>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#EDE5D9] text-[#262B32] border border-[#DFD0BE]">
            {attendedEvents.length}
          </span>
        </h2>

        {attendedEvents.length === 0 ? (
          <div className="bg-[#FFFDFC] rounded-2xl p-6 border border-[#DFD0BE] text-center text-sm text-[#68635D] shadow-xs">
            No events pending your feedback. When you attend an event and it concludes, you can submit your rating here!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {attendedEvents.map((evt) => (
              <div
                key={evt.registration_id}
                className="bg-[#FFFDFC] rounded-3xl border border-[#DFD0BE] p-6 shadow-xs hover:border-[#B8956B] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#262B32] bg-[#EDE5D9] px-2.5 py-0.5 rounded-full border border-[#DFD0BE]">
                      {evt.event_category}
                    </span>
                    <Badge variant="success">Attended</Badge>
                  </div>

                  <h3 className="text-base font-bold text-[#262B32] mb-1 leading-snug">
                    {evt.event_title}
                  </h3>
                  <p className="text-xs text-[#68635D] mb-4">{evt.club_name}</p>

                  <div className="text-xs text-[#68635D] space-y-1 mb-5">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#87613B]" />
                      <span className="text-[#262B32]">{evt.event_date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#87613B]" />
                      <span className="text-[#262B32]">{evt.venue_name || 'Campus Venue'}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => openReviewModal(evt)}
                  className="w-full py-2.5 px-4 bg-[#262B32] hover:bg-[#191F24] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
                >
                  <Star className="w-4 h-4 fill-white text-white" />
                  <span>Submit Rating & Review</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submitted Feedback History */}
      <div>
        <h2 className="text-lg font-bold text-[#262B32] mb-4 flex items-center gap-2">
          <span>My Feedback History</span>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#EDE5D9] text-[#262B32] border border-[#DFD0BE]">
            {myFeedbackHistory.length}
          </span>
        </h2>

        {myFeedbackHistory.length === 0 ? (
          <div className="bg-[#FFFDFC] rounded-2xl p-6 border border-[#DFD0BE] text-center text-sm text-[#68635D] shadow-xs">
            You haven't submitted any event reviews yet.
          </div>
        ) : (
          <div className="space-y-4">
            {myFeedbackHistory.map((fb) => (
              <div
                key={fb.feedback_id}
                className="bg-[#FFFDFC] rounded-2xl border border-[#DFD0BE] p-5 shadow-xs space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="text-base font-bold text-[#262B32]">{fb.event_title}</h4>
                    <p className="text-xs text-[#68635D]">{fb.club_name} • {fb.event_date}</p>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-semibold">
                    <div className="flex items-center gap-1 bg-[#EACBA5]/30 px-2.5 py-1 rounded-lg text-[#87613B] border border-[#B8956B]/30 font-bold">
                      <Star className="w-3.5 h-3.5 fill-[#B8956B] text-[#B8956B]" />
                      <span>Overall: {fb.overall_rating}/5</span>
                    </div>
                    <div className="text-[#68635D]">Org: {fb.organization_rating}/5</div>
                    <div className="text-[#68635D]">Venue: {fb.venue_rating}/5</div>
                  </div>
                </div>

                {fb.comments && (
                  <p className="text-xs text-[#262B32] bg-[#F6F3EE] p-3 rounded-xl border border-[#DFD0BE]/60 italic">
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
            <label className="block text-xs font-bold text-[#262B32] uppercase tracking-wider mb-1.5">
              Comments & Suggestions
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you enjoy? Any recommendations for future events?"
              className="w-full px-3 py-2 text-sm bg-[#FFFDFC] border border-[#DFD0BE] rounded-xl text-[#262B32] placeholder:text-[#9CA3AF] focus:ring-2 focus:ring-[#B8956B] focus:outline-none transition-all"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setActiveReviewEvent(null)}
              className="px-4 py-2 text-sm text-[#68635D] hover:text-[#262B32] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-sm font-bold text-white bg-[#262B32] hover:bg-[#191F24] rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {submitting ? 'Submitting...' : 'Post Feedback'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
