import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Calendar, Clock, MapPin, X, Download } from 'lucide-react';

export function QRModal({ isOpen, onClose, registration }) {
  if (!isOpen || !registration) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[#FFFDFC] rounded-3xl shadow-2xl border border-[#DFD0BE] max-w-sm w-full overflow-hidden transform animate-in zoom-in-95 text-center p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#68635D] hover:text-[#262B32] bg-[#EDE5D9] hover:bg-[#E2D6C5] rounded-full p-1.5 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="inline-block px-3 py-1 rounded-full bg-[#EACBA5]/30 text-[#87613B] border border-[#B8956B]/30 text-xs font-bold mb-3">
          Official Event Pass
        </div>

        <h3 className="text-xl font-bold text-[#262B32] leading-snug mb-1">
          {registration.event_title || 'Campus Event'}
        </h3>
        <p className="text-xs text-[#68635D] mb-6">
          Presented by {registration.club_name || 'College Club'}
        </p>

        {/* QR Code Container */}
        <div className="bg-white p-4 rounded-2xl border-2 border-dashed border-[#DFD0BE] inline-block shadow-xs mb-6">
          <QRCodeSVG
            value={registration.qr_token || 'INVALID_TOKEN'}
            size={220}
            level="H"
            includeMargin={true}
          />
        </div>

        {/* Event Details */}
        <div className="bg-[#F6F3EE] rounded-2xl p-4 text-left text-xs text-[#68635D] space-y-2 mb-4 border border-[#DFD0BE]/60">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#87613B]" />
            <span className="font-semibold text-[#262B32]">{registration.event_date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#87613B]" />
            <span className="text-[#262B32]">{registration.start_time} - {registration.end_time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#87613B]" />
            <span className="text-[#262B32]">{registration.venue_name || 'Campus Venue'} ({registration.venue_building || 'Campus'})</span>
          </div>
        </div>

        <p className="text-[11px] text-[#68635D]">
          Show this QR code at the entrance scanner to record your official attendance.
        </p>
      </div>
    </div>
  );
}
