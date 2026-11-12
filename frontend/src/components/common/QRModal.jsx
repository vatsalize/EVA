import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Calendar, Clock, MapPin, X, Download } from 'lucide-react';

export function QRModal({ isOpen, onClose, registration }) {
  if (!isOpen || !registration) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-sm w-full overflow-hidden transform animate-in zoom-in-95 text-center p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full p-1.5 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="inline-block px-3 py-1 rounded-full bg-brand-50 text-brand-900 text-xs font-semibold mb-3">
          Official Event Pass
        </div>

        <h3 className="text-xl font-bold text-slate-900 leading-snug mb-1">
          {registration.event_title || 'Campus Event'}
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Presented by {registration.club_name || 'College Club'}
        </p>

        {/* QR Code Container */}
        <div className="bg-white p-4 rounded-2xl border-2 border-dashed border-slate-200 inline-block shadow-inner mb-6">
          <QRCodeSVG
            value={registration.qr_token || 'INVALID_TOKEN'}
            size={220}
            level="H"
            includeMargin={true}
          />
        </div>

        {/* Event Details */}
        <div className="bg-slate-50 rounded-2xl p-4 text-left text-xs text-slate-600 space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-700" />
            <span className="font-medium text-slate-800">{registration.event_date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-700" />
            <span>{registration.start_time} - {registration.end_time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-700" />
            <span>{registration.venue_name || 'Campus Venue'} ({registration.venue_building || 'Campus'})</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400">
          Show this QR code at the entrance scanner to record your official attendance.
        </p>
      </div>
    </div>
  );
}
