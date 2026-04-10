import React, { useState } from 'react';
import { Eye, CreditCard as Edit2, Star, MapPin, Clock, Calendar } from 'lucide-react';

interface PublicProfilePreviewProps {
  bio: string;
  showToast: (msg: string, type?: 'success' | 'warning') => void;
  onEditTab: () => void;
}

const reviews = [
  { name: 'Khalid Hassan Abdullah', rating: 5, date: '6 March 2026', text: 'Dr. Ahmed is exceptionally thorough. He takes time to explain everything clearly and I always leave the appointment feeling confident about my treatment.' },
  { name: 'Anonymous', rating: 5, date: '14 February 2026', text: 'Best cardiologist in Dubai in my opinion. Very knowledgeable, calm, and reassuring.' },
  { name: 'Sarah M.', rating: 4, date: '9 January 2026', text: 'Great doctor, very professional. Waiting time was a bit long but the consultation itself was excellent.' },
];

const StarRow: React.FC<{ rating: number; size?: number }> = ({ rating, size = 14 }) => (
  <div className="flex items-center">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star key={s} className={`text-amber-400 ${s <= rating ? 'fill-amber-400' : ''}`} style={{ width: size, height: size }} />
    ))}
  </div>
);

const PublicProfilePreview: React.FC<PublicProfilePreviewProps> = ({ bio, showToast, onEditTab }) => {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('mobile');
  const [expanded, setExpanded] = useState(false);

  const bioPreview = expanded ? bio : bio.slice(0, 220) + (bio.length > 220 ? '...' : '');

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Eye className="w-4 h-4 text-amber-600" />
          <p className="text-[13px] text-amber-800 font-medium">
            Preview Mode — This is your public-facing profile. Changes in 'My Profile' tab update here instantly.
          </p>
        </div>
        <button onClick={onEditTab} className="flex items-center space-x-1.5 text-[12px] text-teal-600 hover:text-teal-700 font-medium transition-colors flex-shrink-0 ml-4">
          <Edit2 className="w-3.5 h-3.5" /><span>Edit Profile</span>
        </button>
      </div>

      <div className="flex items-center justify-end space-x-2">
        {(['desktop', 'mobile'] as const).map((d) => (
          <button
            key={d}
            onClick={() => setDevice(d)}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${device === d ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            {d === 'desktop' ? '💻 Desktop' : '📱 Mobile'}
          </button>
        ))}
      </div>

      <div className="flex justify-center">
        <div
          className={`bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ${
            device === 'mobile' ? 'w-80' : 'w-full max-w-2xl'
          }`}
          style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.12)' }}
        >
          <div
            className="h-36 relative"
            style={{ background: 'linear-gradient(135deg, #0A1628 60%, #0D9488 100%)' }}
          >
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)'
            }} />
          </div>

          <div className="px-6 pb-6">
            <div className="flex flex-col items-center -mt-10 mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#0A1628] to-teal-600 border-4 border-white shadow-lg flex items-center justify-center relative">
                <span className="text-white font-bold text-xl" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>AA</span>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-emerald-600 rounded-full">
                  <span className="text-white text-[8px] font-bold whitespace-nowrap">✅ DHA</span>
                </div>
              </div>
              <h2 className="text-[20px] font-bold text-slate-900 mt-3 text-center" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Dr. Ahmed Al Rashidi</h2>
              <p className="text-[14px] text-slate-500 mb-2">د. أحمد خالد الراشدي</p>
              <div className="flex flex-wrap justify-center gap-1.5 mb-2">
                {['Consultant Cardiologist', 'Interventional Cardiology', 'FESC', 'ACC'].map((badge, i) => (
                  <span key={i} className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                    i === 0 ? 'bg-teal-50 text-teal-700' :
                    i === 1 ? 'bg-indigo-50 text-indigo-700' :
                    i === 2 ? 'bg-emerald-50 text-emerald-700' :
                    'bg-blue-50 text-blue-700'
                  }`}>
                    {badge}
                  </span>
                ))}
              </div>
              <p className="text-[13px] text-slate-500">Al Noor Medical Center · Dubai</p>
              <p className="text-[12px] text-slate-400">22 years experience · Arabic · English</p>
            </div>

            <div className="flex items-center justify-center space-x-3 mb-4">
              <StarRow rating={5} size={18} />
              <span className="text-[18px] font-bold text-amber-600" style={{ fontFamily: 'DM Mono, monospace' }}>4.9</span>
              <span className="text-[12px] text-slate-400">(186 verified reviews)</span>
              <span className="text-slate-300">|</span>
              <span className="text-[12px] text-slate-400">1,247 consultations</span>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {[['AED 400', 'In-Person Fee'], ['AED 300', 'Video Fee'], ['97%', 'Response Rate']].map(([val, label]) => (
                <div key={label} className="bg-slate-50 rounded-xl p-3 text-center">
                  <p className="text-[15px] font-bold text-slate-800" style={{ fontFamily: 'DM Mono, monospace' }}>{val}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            <button className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-[15px] transition-colors mb-2 flex items-center justify-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
            <button className="w-full py-3 bg-teal-100 hover:bg-teal-200 text-teal-700 rounded-xl font-semibold text-[13px] transition-colors mb-5 flex items-center justify-center space-x-2">
              <span>📹</span><span>Book Video Consultation</span>
            </button>

            <div className="mb-4">
              <h3 className="text-[14px] font-bold text-slate-800 mb-2">About Dr. Ahmed</h3>
              <p className="text-[13px] text-slate-600 leading-relaxed">{bioPreview}</p>
              {bio.length > 220 && (
                <button onClick={() => setExpanded(!expanded)} className="text-[12px] text-teal-600 hover:text-teal-700 font-medium mt-1 transition-colors">
                  {expanded ? 'Show less' : 'Read more...'}
                </button>
              )}
            </div>

            <div className="mb-4 space-y-1">
              <div className="flex items-center space-x-2 text-[13px] text-slate-600">
                <MapPin className="w-4 h-4 text-teal-500 flex-shrink-0" />
                <span>Al Noor Medical Center · Jumeirah, Dubai</span>
              </div>
              <div className="flex items-center space-x-2 text-[13px] text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>Dubai Heart Clinic · Thursdays PM</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-[13px] font-medium text-slate-700">Working Hours</span>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {[['Sun', '9-5'], ['Mon', '9-5'], ['Tue', '9-5'], ['Wed', '9-5'], ['Thu', '9-4'], ['Fri', 'Off'], ['Sat', 'Off']].map(([day, hrs]) => (
                  <div key={day} className={`text-center py-1.5 rounded-lg ${hrs === 'Off' ? 'bg-slate-50' : 'bg-teal-50'}`}>
                    <p className="text-[9px] text-slate-400 font-medium">{day}</p>
                    <p className={`text-[10px] font-semibold ${hrs === 'Off' ? 'text-slate-300' : 'text-teal-700'}`}>{hrs}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <p className="text-[12px] font-medium text-slate-600 mb-2">Accepted Insurance (7):</p>
              <div className="flex flex-wrap gap-1.5">
                {['Daman', 'AXA Gulf', 'ADNIC', 'Thiqa', '+3 more'].map((ins) => (
                  <span key={ins} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-medium rounded-full border border-emerald-100">{ins}</span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-[12px] font-medium text-slate-600 mb-2">Languages:</p>
              <div className="flex space-x-3">
                <span className="text-[13px] text-slate-600">🇦🇪 Arabic (Native)</span>
                <span className="text-[13px] text-slate-600">🇬🇧 English (Fluent)</span>
              </div>
            </div>

            <div>
              <h3 className="text-[14px] font-bold text-slate-800 mb-3">Reviews (186)</h3>
              <div className="space-y-3">
                {reviews.map((r, i) => (
                  <div key={i} className="border border-slate-100 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <StarRow rating={r.rating} size={13} />
                        <span className="text-[12px] font-semibold text-slate-800">{r.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400" style={{ fontFamily: 'DM Mono, monospace' }}>{r.date}</span>
                    </div>
                    <p className="text-[12px] text-slate-600 leading-relaxed">{r.text}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => showToast('✅ Loading more reviews')} className="w-full mt-3 py-2.5 text-teal-600 text-[13px] font-medium hover:bg-teal-50 rounded-xl transition-colors">
                Load more reviews ▼
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
        <p className="text-[12px] text-amber-700">
          Patients see this as your public profile. Reviews are verified — only patients who completed an appointment with you can leave reviews.
        </p>
      </div>
    </div>
  );
};

export default PublicProfilePreview;
