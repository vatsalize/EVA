import React, { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { 
  Scan, 
  Camera, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  Calendar, 
  Clock, 
  Sparkles,
  Search,
  ArrowRight
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { LoadingSpinner, Badge } from '../../components/common/UIComponents';

export function QRScanner() {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [manualToken, setManualToken] = useState('');
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(true);

  // Scan Result State
  const [scanResult, setScanResult] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);

  const { success, error } = useToast();
  const scannerRef = useRef(null);

  useEffect(() => {
    async function fetchClubEvents() {
      try {
        const res = await api.get('/events/my-events?status=PUBLISHED');
        const list = res.data.events || [];
        setEvents(list);
        if (list.length > 0) {
          setSelectedEventId(list[0].event_id);
        }
      } catch (err) {
        error('Failed to load published club events for scanning.');
      } finally {
        setLoading(false);
      }
    }

    fetchClubEvents();
  }, []);

  // Initialize html5-qrcode scanner
  useEffect(() => {
    if (!selectedEventId) return;

    const qrScanner = new Html5QrcodeScanner(
      'qr-reader',
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true
      },
      false
    );

    qrScanner.render(
      (decodedText) => {
        handleProcessScan(decodedText);
      },
      (error) => {
        // scan frame errors are silent in loop
      }
    );

    scannerRef.current = qrScanner;

    return () => {
      try {
        qrScanner.clear();
      } catch (e) {
        // cleanup safe
      }
    };
  }, [selectedEventId]);

  const handleProcessScan = async (token) => {
    if (!token) return;

    try {
      const res = await api.post('/checkins/scan', {
        qrToken: token.trim(),
        eventId: selectedEventId,
        scannerId: 'WEB-SCANNER-CONSOLE'
      });

      if (res.data.success) {
        const checkinData = res.data.checkin;
        setScanResult({
          status: 'success',
          message: res.data.message,
          student: checkinData.student,
          timestamp: new Date(checkinData.scannedAt).toLocaleTimeString()
        });
        setScanHistory((prev) => [
          {
            id: checkinData.checkinId,
            name: checkinData.student.fullName,
            dept: checkinData.student.department,
            time: new Date(checkinData.scannedAt).toLocaleTimeString(),
            status: 'ACCEPTED'
          },
          ...prev
        ]);
        success(res.data.message);
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Check-in validation failed.';
      setScanResult({
        status: 'error',
        message: errMsg
      });
      error(errMsg);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualToken.trim()) return;
    handleProcessScan(manualToken.trim());
    setManualToken('');
  };

  if (loading) {
    return <LoadingSpinner message="Configuring entrance scanner interface..." />;
  }

  const activeEvent = events.find((e) => e.event_id === selectedEventId);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          QR Attendance & Footfall Scanner
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Scan student digital passes using camera or enter pass tokens to verify registration and record live footfall.
        </p>
      </div>

      {/* Event Selector */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Active Event for Check-in
          </label>
          {events.length === 0 ? (
            <div className="text-sm text-amber-700 font-semibold">
              No currently published events found. Please publish an event first.
            </div>
          ) : (
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-brand-900 focus:outline-none min-w-[280px]"
            >
              {events.map((evt) => (
                <option key={evt.event_id} value={evt.event_id}>
                  {evt.title} ({evt.event_date})
                </option>
              ))}
            </select>
          )}
        </div>

        {activeEvent && (
          <div className="text-left sm:text-right text-xs text-slate-600 space-y-1">
            <div className="font-semibold text-slate-900">{activeEvent.venue_name || 'Campus Venue'}</div>
            <div>{activeEvent.start_time} - {activeEvent.end_time}</div>
            <div className="text-emerald-700 font-bold">{activeEvent.actual_footfall} Checked In</div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Scanner Column */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Camera className="w-5 h-5 text-brand-900" />
              <h2 className="text-base font-bold text-slate-900">Live Camera Scanner</h2>
            </div>

            <div id="qr-reader" className="w-full rounded-2xl overflow-hidden border border-slate-200" />
          </div>

          {/* Manual Token Input Alternative */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Manual QR Token Entry (or Barcode Gun)
            </label>
            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <input
                type="text"
                value={manualToken}
                onChange={(e) => setManualToken(e.target.value)}
                placeholder="e.g. DEMO-REG0001-TOKEN or EVA-EVT..."
                className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-900 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-brand-900 hover:bg-brand-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
              >
                Verify
              </button>
            </form>
          </div>
        </div>

        {/* Verification Feedback Column */}
        <div className="space-y-6">
          
          {/* Result Alert Box */}
          {scanResult ? (
            <div
              className={`rounded-3xl p-6 border transition-all ${
                scanResult.status === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-red-50 border-red-200 text-red-950'
              }`}
            >
              <div className="flex items-start gap-3">
                {scanResult.status === 'success' ? (
                  <CheckCircle2 className="w-7 h-7 text-emerald-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-7 h-7 text-red-600 flex-shrink-0" />
                )}

                <div className="space-y-2 flex-1">
                  <h3 className="text-base font-extrabold">{scanResult.message}</h3>

                  {scanResult.student && (
                    <div className="text-xs space-y-1 bg-white/80 p-3 rounded-xl border border-emerald-200/50">
                      <div><strong>Student Name:</strong> {scanResult.student.fullName}</div>
                      <div><strong>Student ID:</strong> {scanResult.student.studentId}</div>
                      <div><strong>Department:</strong> {scanResult.student.department} (Year {scanResult.student.yearOfStudy})</div>
                      <div><strong>Scanned At:</strong> {scanResult.timestamp}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200/80 text-center text-slate-400 text-xs">
              Point student QR pass at the camera or enter token above to record entrance.
            </div>
          )}

          {/* Session Scan Log */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
              <span>Current Session Scans</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {scanHistory.length}
              </span>
            </h3>

            {scanHistory.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                Scanned attendees for this session will appear here in real time.
              </p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {scanHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 text-xs border border-slate-100"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-slate-500 text-[11px]">{item.dept}</div>
                    </div>
                    <div className="text-right">
                      <Badge variant="success">Accepted</Badge>
                      <div className="text-[10px] text-slate-400 mt-0.5">{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
