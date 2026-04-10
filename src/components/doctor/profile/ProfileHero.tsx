import React, { useEffect, useState } from 'react';
import { Camera } from 'lucide-react';

interface ProfileHeroProps {
  onPhotoClick: () => void;
}

const stats = [
  { value: '1,247', label: 'Consultations', color: 'text-white' },
  { value: '4.9 ★', label: 'Rating', color: 'text-amber-300' },
  { value: '24', label: 'Active Patients', color: 'text-teal-300' },
  { value: '22 yrs', label: 'Experience', color: 'text-white/70' },
];

const ProfileHero: React.FC<ProfileHeroProps> = ({ onPhotoClick }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

  return (
    <div
      className="rounded-2xl overflow-hidden mb-3"
      style={{ background: 'linear-gradient(135deg, #0A1628 60%, #0D9488 100%)' }}
    >
      <div className="flex items-center justify-between px-8 py-7">
        <div className="flex items-center space-x-5">
          <div className="relative group flex-shrink-0 cursor-pointer" onClick={onPhotoClick}>
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#0A1628] to-teal-600 border-2 border-white/20 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>AA</span>
            </div>
            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center">
              <Camera className="w-5 h-5 text-white mb-0.5" />
              <span className="text-white text-[9px]" style={{ fontFamily: 'Inter, sans-serif' }}>Change Photo</span>
            </div>
          </div>

          <div>
            <h1 className="text-white font-bold text-[22px] mb-0.5" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Dr. Ahmed Khalid Al Rashidi
            </h1>
            <p className="text-white/70 text-[14px] mb-2" style={{ fontFamily: 'Inter, sans-serif', direction: 'rtl', textAlign: 'left' }}>
              د. أحمد خالد الراشدي
            </p>
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              <span className="px-2 py-0.5 bg-emerald-600/80 text-white text-[10px] font-bold rounded-full">✅ DHA Verified</span>
              <span className="px-2 py-0.5 bg-white/10 text-white text-[10px] rounded-full">🇦🇪 Emirati</span>
              <span className="px-2 py-0.5 bg-teal-600/40 text-teal-200 text-[10px] rounded-full">Cardiology</span>
              <span className="px-2 py-0.5 bg-white/10 text-white text-[10px] rounded-full">FESC</span>
              <span className="px-2 py-0.5 bg-white/10 text-white text-[10px] rounded-full">ACC</span>
            </div>
            <p className="text-white/60 text-[13px]" style={{ fontFamily: 'Inter, sans-serif' }}>Al Noor Medical Center · Dubai</p>
            <p className="text-white/40 text-[11px]" style={{ fontFamily: 'DM Mono, monospace' }}>Member since March 2018 · 8 years</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`w-20 h-[72px] bg-white/10 rounded-xl flex flex-col items-center justify-center transition-opacity duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}
            >
              <span className={`font-bold text-[18px] ${stat.color}`} style={{ fontFamily: 'DM Mono, monospace' }}>
                {stat.value}
              </span>
              <span className="text-white/40 text-[10px] mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileHero;
