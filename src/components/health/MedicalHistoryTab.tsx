import { useState } from 'react';
import { HeartPulse, Scissors, Building2, Users, ChevronUp, ChevronDown } from 'lucide-react';
import {
  MOCK_PAST_CONDITIONS,
  MOCK_SURGERIES,
  MOCK_HOSPITALIZATIONS,
  MOCK_SOCIAL_HISTORY,
} from '../../types/healthRecords';

export default function MedicalHistoryTab() {
  // Past Medical Conditions open by default, others collapsed
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'past-conditions': true,
    'surgical-history': false,
    'hospitalization-history': false,
    'social-history': false,
  });

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const SectionHeader = ({
    sectionKey,
    icon,
    title,
    subtitle,
  }: {
    sectionKey: string;
    icon: React.ReactNode;
    title: string;
    subtitle: string;
  }) => (
    <button
      onClick={() => toggleSection(sectionKey)}
      className="w-full flex items-center gap-3 px-6 py-5 hover:bg-gray-50 transition-colors text-left"
    >
      <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-bold text-gray-900">{title}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
      </div>
      {openSections[sectionKey]
        ? <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
        : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
      }
    </button>
  );

  return (
    <div className="space-y-4">

      {/* Section 1 — Past Medical Conditions */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <SectionHeader
          sectionKey="past-conditions"
          icon={<HeartPulse className="w-5 h-5 text-teal-600" />}
          title="Past Medical Conditions"
          subtitle="Illnesses fully resolved — no longer active"
        />
        {openSections['past-conditions'] && (
          <div className="divide-y divide-gray-100 border-t border-gray-100">
            {MOCK_PAST_CONDITIONS.map((item, i) => (
              <div key={i} className="px-6 py-4 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <span className="font-semibold text-gray-900 text-sm">{item.condition}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">Resolved</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-1.5 flex-wrap">
                    <span>Diagnosed: <span className="text-gray-700 font-medium">{item.diagnosed}</span></span>
                    <span className="text-gray-300">•</span>
                    <span>Resolved: <span className="text-gray-700 font-medium">{item.resolved}</span></span>
                    <span className="text-gray-300">•</span>
                    <span className="text-teal-700 font-medium">{item.doctor}</span>
                  </div>
                  <p className="text-xs text-gray-500 italic">{item.notes}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2 — Surgical History */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <SectionHeader
          sectionKey="surgical-history"
          icon={<Scissors className="w-5 h-5 text-teal-600" />}
          title="Surgical History"
          subtitle="All past surgical procedures"
        />
        {openSections['surgical-history'] && (
          <div className="divide-y divide-gray-100 border-t border-gray-100">
            {MOCK_SURGERIES.map((item, i) => (
              <div key={i} className="px-6 py-4 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <span className="font-semibold text-gray-900 text-sm">{item.procedure}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">Successful</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-1.5 flex-wrap">
                    <span>{item.date}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-700 font-medium">{item.hospital}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-teal-700 font-medium">{item.surgeon}</span>
                  </div>
                  <p className="text-xs text-gray-500 italic">{item.notes}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 3 — Hospitalization History */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <SectionHeader
          sectionKey="hospitalization-history"
          icon={<Building2 className="w-5 h-5 text-teal-600" />}
          title="Hospitalization History"
          subtitle="Past inpatient hospital stays"
        />
        {openSections['hospitalization-history'] && (
          <div className="divide-y divide-gray-100 border-t border-gray-100">
            {MOCK_HOSPITALIZATIONS.map((item, i) => (
              <div key={i} className="px-6 py-4 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <span className="font-semibold text-gray-900 text-sm">{item.reason}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">Discharged — Recovered</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                    <span className="text-gray-700 font-medium">{item.hospital}</span>
                    <span className="text-gray-300">•</span>
                    <span>Admitted: <span className="text-gray-700 font-medium">{item.admitted}</span></span>
                    <span className="text-gray-300">•</span>
                    <span>Discharged: <span className="text-gray-700 font-medium">{item.discharged}</span></span>
                    <span className="text-gray-300">•</span>
                    <span className="text-teal-700 font-medium">{item.days} days</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 4 — Social History */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <SectionHeader
          sectionKey="social-history"
          icon={<Users className="w-5 h-5 text-teal-600" />}
          title="Social History"
          subtitle="Lifestyle and social factors"
        />
        {openSections['social-history'] && (
          <div className="px-6 py-5 border-t border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4">
              {MOCK_SOCIAL_HISTORY.map((item, i) => (
                <div key={i} className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{item.label}</span>
                  <span className="text-sm text-gray-800 font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}