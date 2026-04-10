import { useState } from 'react';
import { Shield, FileCheck } from 'lucide-react';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminTopBar from '../components/admin/AdminTopBar';
import DHAComplianceTab from '../components/compliance/DHAComplianceTab';
import NABIDHStatusTab from '../components/compliance/NABIDHStatusTab';
import AuditLogsTab from '../components/compliance/AuditLogsTab';
import SecurityEventsTab from '../components/compliance/SecurityEventsTab';

type TabId = 'dha-compliance' | 'nabidh-status' | 'data-privacy' | 'audit-logs' | 'security-events';

export default function ComplianceAudit() {
  const [activeSection, setActiveSection] = useState('compliance');
  const [activeTab, setActiveTab] = useState<TabId>('dha-compliance');

  const tabs: { id: TabId; label: string }[] = [
    { id: 'dha-compliance', label: 'DHA Compliance' },
    { id: 'nabidh-status', label: 'NABIDH Status' },
    { id: 'data-privacy', label: 'Data Privacy' },
    { id: 'audit-logs', label: 'Audit Logs' },
    { id: 'security-events', label: 'Security Events' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      <div className="flex-1 flex flex-col">
        <AdminTopBar />

        <div className="border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-teal-600 bg-opacity-20 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Compliance & Audit</h1>
              <div className="text-sm text-slate-400">
                DHA compliance, NABIDH reporting, data privacy, and audit trails
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-slate-800 px-6 py-3 overflow-x-auto">
          <div className="flex items-center gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-teal-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'dha-compliance' && <DHAComplianceTab />}
          {activeTab === 'nabidh-status' && <NABIDHStatusTab />}
          {activeTab === 'data-privacy' && (
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 text-center">
              <div className="w-16 h-16 bg-teal-600 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-teal-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Data Privacy</h3>
              <div className="text-sm text-slate-400 max-w-md mx-auto">
                Data privacy management dashboard coming soon. This section will include GDPR
                compliance, patient consent management, data retention policies, and privacy
                impact assessments.
              </div>
            </div>
          )}
          {activeTab === 'audit-logs' && <AuditLogsTab />}
          {activeTab === 'security-events' && <SecurityEventsTab />}
        </div>
      </div>
    </div>
  );
}
