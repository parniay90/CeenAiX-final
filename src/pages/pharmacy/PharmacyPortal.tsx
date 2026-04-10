import React, { useState } from 'react';
import PharmacySidebar from '../../components/pharmacy/new/PharmacySidebar';
import PharmacyTopBar from '../../components/pharmacy/new/PharmacyTopBar';
import PharmacyDashboardNew from './PharmacyDashboardNew';
import PharmacyPrescriptions from './PharmacyPrescriptions';
import PharmacyDispensingWorkspace from './PharmacyDispensingWorkspace';
import PharmacyInventory from './PharmacyInventory';
import PharmacyMessages from './PharmacyMessages';
import PharmacyReports from './PharmacyReports';

const pageTitles: Record<string, string> = {
  dashboard: 'Dashboard',
  prescriptions: 'Prescriptions',
  dispense: 'Dispensing Workspace',
  inventory: 'Inventory',
  messages: 'Messages',
  reports: 'Reports',
  revenue: 'Revenue',
  profile: 'My Pharmacy',
  settings: 'Settings',
  'new-rx': 'New Manual Prescription',
};

const PharmacyPortal: React.FC = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [activeRxId, setActiveRxId] = useState<string | undefined>(undefined);

  const handleNavigate = (page: string, rxId?: string) => {
    setActivePage(page);
    if (rxId) setActiveRxId(rxId);
    else setActiveRxId(undefined);
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <PharmacyDashboardNew onNavigate={handleNavigate} />;
      case 'prescriptions':
        return <PharmacyPrescriptions onNavigate={handleNavigate} />;
      case 'dispense':
        return <PharmacyDispensingWorkspace rxId={activeRxId} onNavigate={handleNavigate} />;
      case 'inventory':
        return <PharmacyInventory onNavigate={handleNavigate} />;
      case 'messages':
        return <PharmacyMessages onNavigate={handleNavigate} />;
      case 'reports':
      case 'revenue':
        return <PharmacyReports />;
      case 'pharmacy-profile':
        return <PharmacyProfilePage />;
      case 'pharmacy-settings':
        return <PharmacySettingsPage />;
      case 'new-rx':
        return <NewManualRxPage onNavigate={handleNavigate} />;
      default:
        return <PharmacyDashboardNew onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <PharmacySidebar
        activePage={activePage}
        onNavigate={handleNavigate}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {activePage !== 'dispense' && (
          <PharmacyTopBar
            pageTitle={pageTitles[activePage] || 'Pharmacy Portal'}
            onNavigate={handleNavigate}
          />
        )}
        <div className={`flex-1 overflow-auto ${activePage === 'dispense' ? 'flex flex-col' : ''}`}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
};

const PharmacyProfilePage: React.FC = () => (
  <div className="p-6 bg-slate-50 min-h-full">
    <div className="max-w-2xl">
      <h2 className="font-bold text-slate-900 mb-5" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 20 }}>
        My Pharmacy
      </h2>
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 mb-4">
        <div className="flex items-center gap-5 mb-5">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl" style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}>
            AS
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Al Shifa Pharmacy</h3>
            <div className="text-slate-500 text-sm">الشفاء للصيدلة</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">DHA Licensed ✅</span>
              <span className="bg-teal-100 text-teal-700 text-xs font-bold px-2 py-0.5 rounded-full">NABIDH Connected ✅</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {[
            ['DHA License', 'DHA-PHARM-2019-003481'],
            ['License Valid Until', '31 December 2026'],
            ['Location', 'Al Barsha 1, Dubai, UAE'],
            ['Operating Hours', '8 AM – 10 PM (Sun–Sat)'],
            ['Pharmacist-in-Charge', 'Rania Hassan'],
            ['CeenAiX ePrescription', 'Connected ✅'],
          ].map(([k, v]) => (
            <div key={k} className="bg-slate-50 rounded-lg p-3">
              <div className="text-slate-400 text-xs mb-0.5">{k}</div>
              <div className="font-semibold text-slate-800" style={{ fontFamily: v.includes('DHA') ? 'DM Mono, monospace' : 'inherit' }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
        <h4 className="font-bold text-slate-800 mb-4" style={{ fontSize: 15 }}>Staff</h4>
        {[
          { name: 'Rania Hassan', role: 'Head Pharmacist', dha: 'DHA-PHAR-2017-001294', status: 'On shift' },
          { name: 'Khalid Al Ameri', role: 'Pharmacy Technician', dha: 'DHA-TECH-2020-007241', status: 'On shift' },
          { name: 'Maryam Ibrahim', role: 'Pharmacy Technician', dha: 'DHA-TECH-2021-008491', status: 'Off shift' },
        ].map(s => (
          <div key={s.name} className="flex items-center gap-3 py-3 border-b last:border-0 border-slate-100">
            <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
              {s.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-slate-800 text-sm">{s.name}</div>
              <div className="text-slate-500 text-xs">{s.role} · <span className="font-mono">{s.dha}</span></div>
            </div>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.status === 'On shift' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
              {s.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const PharmacySettingsPage: React.FC = () => (
  <div className="p-6 bg-slate-50 min-h-full">
    <h2 className="font-bold text-slate-900 mb-5" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 20 }}>
      Settings
    </h2>
    <div className="max-w-2xl space-y-4">
      {[
        { title: 'Prescription Notifications', desc: 'Receive alerts for new ePrescriptions', on: true },
        { title: 'Stock Alert Threshold', desc: 'Alert when stock falls below reorder level', on: true },
        { title: 'Auto-submit DHA Records', desc: 'Automatically submit dispensing records to DHA', on: true },
        { title: 'NABIDH Sync', desc: 'Sync dispensing data with NABIDH HIE', on: true },
        { title: 'Insurance Pre-auth Alerts', desc: 'Notify when pre-authorization is needed', on: false },
        { title: 'Expiry Alerts', desc: 'Alert 30 days before batch expiry', on: true },
      ].map(s => (
        <div key={s.title} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex items-center justify-between">
          <div>
            <div className="font-semibold text-slate-800 text-sm">{s.title}</div>
            <div className="text-slate-400 text-xs mt-0.5">{s.desc}</div>
          </div>
          <button className={`relative w-12 h-6 rounded-full transition-colors ${s.on ? 'bg-emerald-500' : 'bg-slate-200'}`}>
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${s.on ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>
      ))}
    </div>
  </div>
);

interface NewManualRxPageProps {
  onNavigate: (page: string) => void;
}

const NewManualRxPage: React.FC<NewManualRxPageProps> = ({ onNavigate }) => (
  <div className="p-6 bg-slate-50 min-h-full">
    <div className="flex items-center gap-3 mb-5">
      <button
        onClick={() => onNavigate('prescriptions')}
        className="text-slate-500 hover:text-slate-700 text-sm flex items-center gap-1"
      >
        ← Back
      </button>
      <h2 className="font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 20 }}>
        New Manual Prescription Entry
      </h2>
    </div>
    <div className="max-w-2xl bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
        ⚠️ Manual prescription entry — ensure you have the original paper prescription for DHA compliance records.
      </div>
      {[
        ['Patient Name', 'text', 'Full name as on Emirates ID'],
        ['Emirates ID', 'text', '784-XXXX-XXXXXXX-X'],
        ['Prescribing Doctor', 'text', 'Dr. name + DHA license'],
        ['Drug Name & Strength', 'text', 'e.g. Omeprazole 40mg'],
        ['Quantity', 'number', 'e.g. 30'],
        ['Instructions', 'text', 'e.g. Once daily before breakfast'],
        ['Insurance (optional)', 'text', 'Provider name / Cash'],
      ].map(([label, type, placeholder]) => (
        <div key={label as string}>
          <label className="text-slate-600 text-xs font-semibold block mb-1">{label as string}</label>
          <input
            type={type as string}
            placeholder={placeholder as string}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400"
          />
        </div>
      ))}
      <button className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl text-sm hover:bg-emerald-700 transition-colors">
        Create Prescription & Proceed to Dispensing
      </button>
    </div>
  </div>
);

export default PharmacyPortal;
