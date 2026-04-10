import React, { useState } from 'react';
import { Link2, CheckCircle2, Plus } from 'lucide-react';
import SettingsCard from '../SettingsCard';

interface Props {
  showToast: (msg: string, type?: 'success' | 'warning') => void;
}

const IntegrationsSection: React.FC<Props> = ({ showToast }) => {
  const [calendarExpanded, setCalendarExpanded] = useState(false);
  const [calendarOpt, setCalendarOpt] = useState('Manual .ics');

  return (
    <SettingsCard id="integrations" title="Integrations" icon={Link2} iconBg="bg-blue-100" iconColor="text-blue-700">
      <div className="p-6 space-y-4">
        <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🇦🇪</span>
              <div>
                <p className="text-[14px] font-semibold text-slate-900">Nabidh HIE — Connected</p>
                <p className="text-[12px] text-slate-500">National unified health record · FHIR R4</p>
                <div className="flex items-center space-x-1 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-[11px] text-emerald-600 font-medium">Active · Last sync: Today 2:03 PM</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => showToast('✅ Opening Nabidh sync settings')}
              className="text-[12px] text-teal-600 hover:text-teal-700 font-medium px-3 py-1.5 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors flex-shrink-0"
            >
              ⚙️ Manage
            </button>
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-[11px] font-bold">DHA</div>
              <div>
                <p className="text-[14px] font-semibold text-slate-900">DHA ePrescription System</p>
                <p className="text-[12px] text-slate-500">License: DHA-PRAC-2018-047821</p>
                <div className="flex items-center space-x-1 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-[11px] text-emerald-600 font-medium">Active · Ready to sign prescriptions</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => showToast('✅ Opening DHA ePrescription settings')}
              className="text-[12px] text-blue-600 hover:text-blue-700 font-medium px-3 py-1.5 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors flex-shrink-0"
            >
              ⚙️ Manage
            </button>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                <span className="text-lg">📅</span>
              </div>
              <div>
                <p className="text-[14px] font-semibold text-slate-900">Calendar Sync</p>
                <p className="text-[12px] text-slate-500">Sync appointments to external calendar</p>
                <span className="text-[11px] text-slate-400">Not connected</span>
              </div>
            </div>
            <button
              onClick={() => setCalendarExpanded(!calendarExpanded)}
              className="text-[12px] text-teal-600 hover:text-teal-700 font-medium px-3 py-1.5 border border-teal-200 rounded-lg hover:bg-teal-50 transition-colors"
            >
              Connect ▾
            </button>
          </div>
          {calendarExpanded && (
            <div className="border-t border-slate-100 pt-3 space-y-2">
              {['iCal (Apple Calendar)', 'Google Calendar', 'Outlook', 'Manual .ics download per appointment'].map((opt) => {
                const key = opt.includes('Manual') ? 'Manual .ics' : opt;
                return (
                  <button
                    key={opt}
                    onClick={() => setCalendarOpt(key)}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl border transition-colors ${
                      calendarOpt === key ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-100 hover:border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${calendarOpt === key ? 'border-teal-500 bg-teal-500' : 'border-slate-300'}`} />
                    <span className="text-[13px]">{opt}</span>
                  </button>
                );
              })}
              <button
                onClick={() => { setCalendarExpanded(false); showToast(`✅ Calendar connected: ${calendarOpt}`); }}
                className="w-full py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-[13px] font-medium transition-colors mt-2"
              >
                Connect →
              </button>
            </div>
          )}
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <p className="text-[13px] font-semibold text-slate-800 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>Connected Labs</p>
          <div className="space-y-2">
            {[
              { name: 'Dubai Medical Laboratory', type: 'ePrescription' },
              { name: 'Emirates Diagnostics', type: 'Results' },
            ].map((lab) => (
              <div key={lab.name} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-[13px] text-slate-700">{lab.name}</span>
                </div>
                <span className="text-[11px] text-slate-400">{lab.type}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => showToast('✅ Lab connection dialog opened')}
            className="flex items-center space-x-1 text-[13px] text-teal-600 hover:text-teal-700 font-medium mt-3 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lab Connection</span>
          </button>
        </div>
      </div>
    </SettingsCard>
  );
};

export default IntegrationsSection;
