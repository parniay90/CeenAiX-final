import React from 'react';
import { X, MapPin, Navigation } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  clinic: string;
  location: string;
  doctorName: string;
  coordinates: { lat: number; lng: number };
}

const DirectionsModal: React.FC<Props> = ({ isOpen, onClose, clinic, location, doctorName, coordinates }) => {
  if (!isOpen) return null;

  const { lat, lng } = coordinates;
  const destination = `${lat},${lng}`;
  const destinationLabel = encodeURIComponent(`${clinic}, ${location}, Dubai`);

  const openGoogleMaps = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${destination}&destination_place_id=${destinationLabel}&travelmode=driving`,
      '_blank',
      'noopener,noreferrer'
    );
    onClose();
  };

  const openWaze = () => {
    window.open(
      `https://waze.com/ul?ll=${lat},${lng}&navigate=yes&zoom=17`,
      '_blank',
      'noopener,noreferrer'
    );
    onClose();
  };

  const openAppleMaps = () => {
    window.open(
      `https://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`,
      '_blank',
      'noopener,noreferrer'
    );
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-sm mx-0 sm:mx-4 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4" style={{ borderBottom: '1px solid #F1F5F9' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
              <Navigation className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">Get Directions</p>
              <p className="text-xs text-slate-400 mt-0.5">{doctorName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        <div className="px-6 py-4">
          <div className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-xl mb-5">
            <MapPin className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800 text-sm">{clinic}</p>
              <p className="text-xs text-slate-400 mt-0.5">{location}, Dubai, UAE</p>
            </div>
          </div>

          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-3">Open with</p>

          <div className="space-y-2.5">
            <button
              onClick={openGoogleMaps}
              className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all hover:shadow-sm active:scale-[0.98]"
              style={{ border: '1.5px solid #E2E8F0' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#0D9488'; e.currentTarget.style.background = '#F0FDF9'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.background = '#fff'; }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#E8F5E9' }}>
                <svg viewBox="0 0 48 48" className="w-5 h-5">
                  <path fill="#4caf50" d="M24 4C13 4 4 13 4 24s9 20 20 20 20-9 20-20S35 4 24 4z"/>
                  <path fill="#1e88e5" d="M24 4c-5.9 0-11.2 2.5-15 6.5L24 24l15-13.5C35.2 6.5 29.9 4 24 4z"/>
                  <path fill="#e53935" d="M9 10.5C5.5 14.2 3.5 19.1 3.5 24.5 3.5 35.3 12.2 44 23 44c5.4 0 10.3-2.1 14-5.5L24 24 9 10.5z"/>
                  <path fill="#fdd835" d="M44.5 24c0-5.4-2-10.3-5.5-14L24 24l13 14.5c3.5-3.7 5.5-8.6 5.5-13.5z"/>
                  <circle fill="#fff" cx="24" cy="24" r="7"/>
                  <circle fill="#1565c0" cx="24" cy="24" r="4"/>
                </svg>
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-slate-800 text-sm">Google Maps</p>
                <p className="text-xs text-slate-400">Open in Google Maps with driving directions</p>
              </div>
              <Navigation className="w-4 h-4 text-slate-300" />
            </button>

            <button
              onClick={openWaze}
              className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all hover:shadow-sm active:scale-[0.98]"
              style={{ border: '1.5px solid #E2E8F0' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#33CCC2'; e.currentTarget.style.background = '#F0FDFC'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.background = '#fff'; }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#E0F7FA' }}>
                <svg viewBox="0 0 48 48" className="w-5 h-5">
                  <ellipse cx="24" cy="26" rx="20" ry="18" fill="#33CCC2"/>
                  <ellipse cx="17" cy="22" rx="3" ry="3.5" fill="#fff"/>
                  <ellipse cx="31" cy="22" rx="3" ry="3.5" fill="#fff"/>
                  <circle cx="17" cy="22" r="1.5" fill="#1a1a1a"/>
                  <circle cx="31" cy="22" r="1.5" fill="#1a1a1a"/>
                  <path d="M18 30 q6 5 12 0" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round"/>
                  <path d="M14 10 q10-8 20 0" stroke="#33CCC2" strokeWidth="3" fill="none" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-slate-800 text-sm">Waze</p>
                <p className="text-xs text-slate-400">Real-time traffic & live navigation</p>
              </div>
              <Navigation className="w-4 h-4 text-slate-300" />
            </button>

            <button
              onClick={openAppleMaps}
              className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all hover:shadow-sm active:scale-[0.98]"
              style={{ border: '1.5px solid #E2E8F0' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#94A3B8'; e.currentTarget.style.background = '#F8FAFC'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.background = '#fff'; }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#F1F5F9' }}>
                <svg viewBox="0 0 48 48" className="w-5 h-5">
                  <rect width="48" height="48" rx="10" fill="#F1F5F9"/>
                  <path d="M24 8 L36 36 H12 Z" fill="#1E293B"/>
                  <circle cx="24" cy="36" r="3" fill="#EF4444"/>
                </svg>
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-slate-800 text-sm">Apple Maps</p>
                <p className="text-xs text-slate-400">Open in Apple Maps</p>
              </div>
              <Navigation className="w-4 h-4 text-slate-300" />
            </button>
          </div>
        </div>

        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DirectionsModal;
