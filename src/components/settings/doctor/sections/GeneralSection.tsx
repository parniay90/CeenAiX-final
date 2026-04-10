import React, { useState } from 'react';
import { Settings, RefreshCw, Play } from 'lucide-react';
import SettingsCard from '../SettingsCard';
import SettingsRow from '../SettingsRow';
import SimpleModal from '../SimpleModal';

interface GeneralSectionProps {
  showToast: (msg: string, type?: 'success' | 'warning') => void;
}

const GeneralSection: React.FC<GeneralSectionProps> = ({ showToast }) => {
  const [homeScreen, setHomeScreen] = useState('Dashboard');
  const [logoutTimer, setLogoutTimer] = useState('15 minutes');
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  const [quickActions, setQuickActions] = useState(true);
  const [patientListView, setPatientListView] = useState('Table');
  const [dataDensity, setDataDensity] = useState('Dense');
  const [homeModal, setHomeModal] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);

  const homeOptions = ['Dashboard', "Today's Appointments", 'Patient Records', 'My Schedule', 'Messages'];
  const logoutOptions = ['5 minutes', '10 minutes', '15 minutes', '30 minutes', '1 hour', 'Never'];

  return (
    <>
      <SettingsCard id="general" title="General" icon={Settings} iconBg="bg-slate-100" iconColor="text-slate-600">
        <SettingsRow
          label="Default Home Screen"
          description="What you see first after logging in"
          type="value"
          value={homeScreen}
          onValueClick={() => setHomeModal(true)}
        />
        <SettingsRow
          label="Auto-Logout Timer"
          description="Security timeout after inactivity (protects patient data)"
          type="value"
          value={logoutTimer}
          onValueClick={() => setLogoutModal(true)}
        />
        <SettingsRow
          label="Stay Logged In"
          description="Remember login on this device (only enable on personal devices)"
          type="toggle"
          toggleValue={stayLoggedIn}
          onToggle={(v) => { setStayLoggedIn(v); showToast(v ? '✅ Stay logged in enabled' : '✅ Auto-login disabled'); }}
        />
        <SettingsRow
          label="Compact Mode"
          description="Reduce spacing for more clinical content on screen"
          type="toggle"
          toggleValue={compactMode}
          onToggle={(v) => { setCompactMode(v); showToast(`✅ Compact mode ${v ? 'enabled' : 'disabled'}`); }}
        />
        <SettingsRow
          label="Show Quick Actions"
          description="Quick action shortcuts throughout the portal"
          type="toggle"
          toggleValue={quickActions}
          onToggle={(v) => { setQuickActions(v); showToast(`✅ Quick actions ${v ? 'shown' : 'hidden'}`); }}
        />
        <SettingsRow
          label="Default Patient List View"
          description="How patient records load by default"
          type="pills"
          pills={[{ label: 'Table', value: 'Table' }, { label: 'Cards', value: 'Cards' }]}
          activePill={patientListView}
          onPillChange={(v) => { setPatientListView(v); showToast(`✅ Patient list view set to ${v}`); }}
        />
        <SettingsRow
          label="Clinical Data Density"
          description="How much information to show per card"
          type="pills"
          pills={[{ label: 'Comfortable', value: 'Comfortable' }, { label: 'Dense', value: 'Dense' }, { label: 'Compact', value: 'Compact' }]}
          activePill={dataDensity}
          onPillChange={(v) => { setDataDensity(v); showToast(`✅ Data density set to ${v}`); }}
        />
        <SettingsRow
          label="Restart Portal Tour"
          description="Re-run the guided tour of the doctor portal"
          type="link"
          onLinkClick={() => showToast('✅ Portal tour restarted')}
        />
        <SettingsRow
          label="Clear App Cache"
          description="Fixes display issues — no patient data deleted"
          type="danger"
          dangerous={false}
          onValueClick={() => showToast('✅ App cache cleared')}
          last
        />
      </SettingsCard>

      {homeModal && (
        <SimpleModal title="Default Home Screen" onClose={() => setHomeModal(false)}>
          <div className="space-y-2">
            {homeOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => { setHomeScreen(opt); setHomeModal(false); showToast(`✅ Home screen set to ${opt}`); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl border transition-colors ${
                  homeScreen === opt ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${homeScreen === opt ? 'border-teal-500 bg-teal-500' : 'border-slate-300'}`} />
                <span className="text-[14px]" style={{ fontFamily: 'Inter, sans-serif' }}>{opt}</span>
              </button>
            ))}
          </div>
        </SimpleModal>
      )}

      {logoutModal && (
        <SimpleModal title="Auto-Logout Timer" onClose={() => setLogoutModal(false)}>
          <div className="space-y-2">
            {logoutOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  setLogoutTimer(opt);
                  setLogoutModal(false);
                  showToast(`✅ Auto-logout set to ${opt}`);
                }}
                className={`w-full flex items-start space-x-3 px-4 py-3 rounded-xl border transition-colors ${
                  logoutTimer === opt ? 'border-teal-500 bg-teal-50' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 ${logoutTimer === opt ? 'border-teal-500 bg-teal-500' : 'border-slate-300'}`} />
                <div className="text-left">
                  <span className="text-[14px] text-slate-800 block" style={{ fontFamily: 'Inter, sans-serif' }}>{opt}</span>
                  {opt === '15 minutes' && <span className="text-[11px] text-teal-600">Recommended for clinical use</span>}
                  {opt === 'Never' && <span className="text-[11px] text-amber-600">⚠️ Not recommended</span>}
                </div>
              </button>
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-xl">
            <p className="text-[12px] text-blue-700" style={{ fontFamily: 'Inter, sans-serif' }}>
              DHA recommends ≤15 min on shared devices
            </p>
          </div>
        </SimpleModal>
      )}
    </>
  );
};

export default GeneralSection;
