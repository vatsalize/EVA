import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Ticket, 
  Calendar, 
  Clock, 
  MapPin, 
  QrCode, 
  CheckCircle2, 
  X, 
  AlertTriangle 
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { LoadingSpinner, Badge, EmptyState, Modal } from '../../components/common/UIComponents';
import { QRModal } from '../../components/common/QRModal';

export function MyRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQR, setSelectedQR] = useState(null);
  const [cancelModalItem, setCancelModalItem] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const { success, error } = useToast();

  const fetchRegistrations = async () => {
    try {
      const res = await api.get('/registrations/my-registrations');
      setRegistrations(res.data.registrations || []);
    } catch (err) {
      error('Failed to load registered events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleCancelRegistration = async () => {
    if (!cancelModalItem) return;
    setCancelling(true);

    try {
      await api.delete(`/registrations/${cancelModalItem.registration_id}`);
      success('Registration cancelled successfully.');
      setCancelModalItem(null);
      fetchRegistrations();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to cancel registration.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Retrieving your digital event passes..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          My Registered Passes
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Access your unique digital QR tickets to scan at venue entrances.
        </p>
      </div>

      {registrations.length === 0 ? (
        <EmptyState
          icon={Ticket}
          title="No Active Registrations"
          description="You haven't registered for any events yet. Explore upcoming campus events to get your first pass!"
          actionText="Explore Campus Events"
          onAction={() => (window.location.href = '/student/explore')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {registrations.map((reg) => (
            <div
              key={reg.registration_id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:border-brand-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-brand-900 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
                    {reg.event_category}
                  </span>

                  {reg.hasCheckedIn ? (
                    <Badge variant="success">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Attended
                    </Badge>
                  ) : (
                    <Badge variant="primary">Pass Confirmed</Badge>
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-1 leading-snug line-clamp-1">
                  {reg.event_title}
                </h3>
                <p className="text-xs font-medium text-slate-500 mb-4">{reg.club_name}</p>

                <div className="bg-slate-50 rounded-2xl p-4 text-xs text-slate-600 space-y-2 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-brand-700" />
                    <span className="font-semibold text-slate-800">{reg.event_date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-brand-700" />
                    <span>{reg.start_time} - {reg.end_time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brand-700" />
                    <span className="truncate">{reg.venue_name || 'Campus Venue'} ({reg.venue_building || 'Campus'})</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setSelectedQR(reg)}
                  className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-2xl shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Show Digital QR Ticket</span>
                </button>

                {!reg.hasCheckedIn && reg.event_status !== 'COMPLETED' && (
                  <button
                    onClick={() => setCancelModalItem(reg)}
                    className="w-full py-2 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    Cancel Registration
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QR Modal */}
      <QRModal
        isOpen={Boolean(selectedQR)}
        onClose={() => setSelectedQR(null)}
        registration={selectedQR}
      />

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={Boolean(cancelModalItem)}
        onClose={() => setCancelModalItem(null)}
        title="Cancel Event Registration?"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to cancel your pass for{' '}
            <strong>{cancelModalItem?.event_title}</strong>? Your seat will be released back to other students.
          </p>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setCancelModalItem(null)}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800"
            >
              Keep My Pass
            </button>
            <button
              type="button"
              disabled={cancelling}
              onClick={handleCancelRegistration}
              className="px-5 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm transition-colors"
            >
              {cancelling ? 'Cancelling...' : 'Yes, Cancel Pass'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
