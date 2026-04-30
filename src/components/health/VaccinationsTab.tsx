import { useState } from 'react';
import { Syringe, CheckCircle2, Clock, ShieldCheck, CalendarClock, Info, ChevronUp, ChevronDown } from 'lucide-react';
import {
  MOCK_RECEIVED_VACCINES,
  MOCK_UPCOMING_VACCINES,
} from '../../types/healthRecords';

const PRIORITY_CONFIG = {
  overdue: { label: 'Overdue', cls: 'bg-red-100 text-red-700 border-red-200' },
  'due-soon': { label: 'Due Soon', cls: 'bg-amber-100 text-amber-700 border-amber-200' },
  recommended: { label: 'Recommended', cls: 'bg-blue-100 text-blue-700 border-blue-200' },
};

export default function VaccinationsTab() {
  // Only UAE Vaccine Certificate open by default
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'received': false,
    'upcoming': false,
    'certificate': true,
  });

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const SectionHeader = ({
    sectionKey,
    icon,
    title,
    subtitle,
    badge,
  }: {
    sectionKey: string;
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    badge?: React.ReactNode;
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
      {badge && <div className="mr-2">{badge}</div>}
      {openSections[sectionKey]
        ? <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
        : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
      }
    </button>
  );

  return (
    <div className="space-y-6">

      {/* Summary Bar — always visible */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Total Vaccines</p>
          <p className="text-3xl font-bold text-gray-900">{MOCK_RECEIVED_VACCINES.length}</p>
          <p className="text-xs text-gray-500 mt-1">Vaccines received</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Status</p>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200 mt-0.5">
            <CheckCircle2 className="w-3.5 h-3.5" />Up to Date
          </span>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Last Vaccine</p>
          <p className="text-sm font-bold text-gray-900">Influenza</p>
          <p className="text-xs text-gray-500 mt-0.5">Oct 2025</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Next Due</p>
          <p className="text-sm font-bold text-gray-900">Influenza</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-500">Oct 2026</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">Due in 5 months</span>
          </div>
        </div>
      </div>

      {/* Section 1 — Received Vaccines */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <SectionHeader
          sectionKey="received"
          icon={<Syringe className="w-5 h-5 text-teal-600" />}
          title="Received Vaccines"
          subtitle="Complete vaccination history"
          badge={
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
              {MOCK_RECEIVED_VACCINES.length} vaccines
            </span>
          }
        />
        {openSections['received'] && (
          <div className="divide-y divide-gray-100 border-t border-gray-100">
            {MOCK_RECEIVED_VACCINES.map((v, i) => (
              <div key={i} className="px-6 py-4">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-semibold text-gray-900 text-sm">{v.name}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">{v.dose}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">Completed</span>
                </div>
                <p className="text-xs text-gray-500 mb-1.5">
                  Protects against: <span className="text-gray-700 font-medium">{v.protects}</span>
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{v.date}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-700 font-medium">{v.clinic}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-teal-700 font-medium">{v.admin}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-400">Lot: {v.lot}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2 — Upcoming & Due Vaccines */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <SectionHeader
          sectionKey="upcoming"
          icon={<CalendarClock className="w-5 h-5 text-teal-600" />}
          title="Upcoming & Due Vaccines"
          subtitle="Vaccines recommended or due for this patient"
        />
        {openSections['upcoming'] && (
          <div className="divide-y divide-gray-100 border-t border-gray-100">
            {MOCK_UPCOMING_VACCINES.map((v, i) => {
              const cfg = PRIORITY_CONFIG[v.priority];
              return (
                <div key={i} className="px-6 py-4 flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-semibold text-gray-900 text-sm">{v.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${cfg.cls}`}>{cfg.label}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">{v.reason}</p>
                    <p className="text-xs text-gray-600 font-medium">Due: {v.due}</p>
                  </div>
                  <button disabled className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-400 text-xs font-medium cursor-not-allowed border border-gray-200">
                    Schedule Now — Coming Soon
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Section 3 — UAE Vaccine Certificate */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <SectionHeader
          sectionKey="certificate"
          icon={<ShieldCheck className="w-5 h-5 text-teal-600" />}
          title="UAE Vaccine Certificate"
          subtitle="Official vaccination compliance status"
        />
        {openSections['certificate'] && (
          <div className="px-6 py-6 border-t border-gray-100">
            <div className="flex items-start gap-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl mb-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="text-sm font-semibold text-emerald-800">
                    Vaccinations up to date — Compliant with UAE health requirements
                  </p>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                    Compliant
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2 text-xs text-gray-600 mb-3">
              <Info className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <p>
                To download your official UAE vaccine certificate, please visit the{' '}
                <span className="font-semibold text-teal-700">Al Hosn app</span> or the{' '}
                <span className="font-semibold text-teal-700">MOHAP patient portal</span>.
              </p>
            </div>
            <p className="text-xs text-gray-400">Last verified: October 5, 2025</p>
          </div>
        )}
      </div>

    </div>
  );
}