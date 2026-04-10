import { useState } from 'react';
import { Activity, Plug, Key, FileText } from 'lucide-react';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminTopBar from '../components/admin/AdminTopBar';
import SystemHealthTab from '../components/systemHealth/SystemHealthTab';
import IntegrationsTab from '../components/systemHealth/IntegrationsTab';
import APIManagementTab from '../components/systemHealth/APIManagementTab';
import ReleaseNotesTab from '../components/systemHealth/ReleaseNotesTab';

type TabId = 'system-health' | 'integrations' | 'api-management' | 'release-notes';

export default function SystemHealthIntegrations() {
  const [activeSection, setActiveSection] = useState('system');
  const [activeTab, setActiveTab] = useState<TabId>('system-health');

  const tabs: { id: TabId; label: string; icon: typeof Activity }[] = [
    { id: 'system-health', label: 'System Health', icon: Activity },
    { id: 'integrations', label: 'Integrations', icon: Plug },
    { id: 'api-management', label: 'API Management', icon: Key },
    { id: 'release-notes', label: 'Release Notes', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      <div className="flex-1 flex flex-col">
        <AdminTopBar />

        <div className="border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-teal-600 bg-opacity-20 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">System Health & Integrations</h1>
              <div className="text-sm text-slate-400">
                Monitor technical systems, APIs, and external integrations
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-slate-800 bg-slate-900">
          <div className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all relative ${
                    activeTab === tab.id
                      ? 'text-white bg-slate-950'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-950">
          {activeTab === 'system-health' && <SystemHealthTab />}
          {activeTab === 'integrations' && <IntegrationsTab />}
          {activeTab === 'api-management' && <APIManagementTab />}
          {activeTab === 'release-notes' && <ReleaseNotesTab />}
        </div>
      </div>
    </div>
  );
}
