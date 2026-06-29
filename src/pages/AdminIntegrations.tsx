import { useState } from 'react';
import {
  Link2, Plus, Download, RefreshCw, Bell, AlertTriangle,
} from 'lucide-react';
import AdminPageLayout from '../components/admin/AdminPageLayout';
import IntegrationHealthOverview from '../components/adminIntegrations/IntegrationHealthOverview';
import AllIntegrationsTab from '../components/adminIntegrations/AllIntegrationsTab';
import APIMonitorTab from '../components/adminIntegrations/APIMonitorTab';
import APIKeysWebhooksTab from '../components/adminIntegrations/APIKeysWebhooksTab';
import LogsEventsTab from '../components/adminIntegrations/LogsEventsTab';
import IntegrationDetailDrawer from '../components/adminIntegrations/IntegrationDetailDrawer';
import TestAllModal from '../components/adminIntegrations/TestAllModal';
import AddIntegrationModal from '../components/adminIntegrations/AddIntegrationModal';
import { Integration } from '../components/adminIntegrations/types';

type Tab = 'all' | 'monitor' | 'keys' | 'logs';

interface Toast { id: number; msg: string; type: 'success' | 'warning' }

export default function AdminIntegrations() {
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [selectedInteg, setSelectedInteg] = useState<Integration | null>(null);
  const [showTestAll, setShowTestAll] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  function toast(msg: string, type: Toast['type'] = 'success') {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'all',     label: '🔗 All Integrations (23)' },
    { id: 'monitor', label: '📊 API Monitor' },
    { id: 'keys',    label: '🔑 API Keys & Webhooks' },
    { id: 'logs',    label: '📋 Logs & Events' },
  ];

  return (
    <AdminPageLayout activeSection="integrations">
      <div className="flex flex-col min-h-full" style={{ background: '#0F172A' }}>

        {/* Top bar */}
        <div className="sticky top-0 z-30 h-16 flex items-center justify-between px-6" style={{ background: '#1E293B', borderBottom: '1px solid #334155' }}>
          {/* Breadcrumb */}
          <div className="flex items-center gap-3">
            <Link2 size={20} style={{ color: '#0D9488' }} />
            <div className="flex items-center gap-2 text-sm">
              <span style={{ color: '#64748B', fontFamily: 'Inter, sans-serif' }}>Admin Portal ›</span>
              <span className="font-bold text-slate-200" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Integrations</span>
            </div>
          </div>

          {/* Health pill center */}
          <div className="flex items-center gap-4 absolute left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-xs text-emerald-300 font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>19/20 integrations healthy</span>
            </div>
            <div className="flex items-center gap-1.5">
              <AlertTriangle size={11} style={{ color: '#F59E0B' }} />
              <span className="text-xs text-amber-400" style={{ fontFamily: 'Inter, sans-serif' }}>1 degraded (Shafafiya)</span>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setShowTestAll(true); toast('Testing all 20 integrations…', 'success'); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
              style={{ background: 'rgba(51,65,85,0.5)', color: '#94A3B8', border: '1px solid #334155' }}>
              <RefreshCw size={13} /> Test All
            </button>
            <button onClick={() => toast('Config exported', 'success')} className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors" style={{ background: 'rgba(51,65,85,0.5)', color: '#94A3B8', border: '1px solid #334155' }}>
              <Download size={14} />
            </button>
            <button className="w-9 h-9 rounded-xl flex items-center justify-center relative transition-colors" style={{ background: 'rgba(51,65,85,0.5)', color: '#94A3B8', border: '1px solid #334155' }}>
              <Bell size={14} />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-400 rounded-full" />
            </button>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold" style={{ background: '#0D9488', color: '#fff', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              PY
            </div>
          </div>
        </div>

        {/* Alert strip */}
        <div className="flex items-center gap-4 px-6 py-2.5" style={{ background: '#1A2332', borderBottom: '1px solid #334155' }}>
          <AlertTriangle size={13} style={{ color: '#F59E0B', flexShrink: 0 }} />
          <span className="text-xs text-amber-300 flex-1" style={{ fontFamily: 'Inter, sans-serif' }}>
            Shafafiya (Insurance Claims API) degraded — 3.2s response time (normal &lt;0.8s) due to Daman Insurance upstream issue · Since 1:20 PM today
          </span>
          <button onClick={() => toast('Daman IT team alerted via WhatsApp', 'warning')} className="px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0" style={{ background: 'rgba(245,158,11,0.15)', color: '#FCD34D', border: '1px solid rgba(245,158,11,0.25)' }}>
            Check Status
          </button>
          <button onClick={() => setActiveTab('logs')} className="px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0" style={{ background: 'rgba(51,65,85,0.4)', color: '#94A3B8' }}>
            View Logs
          </button>
        </div>

        {/* Main content */}
        <div className="flex-1 px-6 py-5 flex flex-col gap-5">

          {/* Page header */}
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Link2 size={28} style={{ color: '#0D9488' }} />
              <div>
                <h1 className="font-bold text-slate-100" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 22 }}>Integrations</h1>
                <p className="text-xs text-slate-400 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                  23 connected systems · API management · Webhooks
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={() => { setShowTestAll(true); }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                style={{ background: '#0D9488', color: '#fff' }}>
                <RefreshCw size={14} /> Test All Connections
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                style={{ background: 'rgba(51,65,85,0.5)', color: '#94A3B8', border: '1px solid #334155' }}>
                <Plus size={14} /> Add Integration
              </button>
              <button
                onClick={() => toast('Integration config exported', 'success')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                style={{ background: 'rgba(51,65,85,0.5)', color: '#94A3B8', border: '1px solid #334155' }}>
                <Download size={14} /> Export Config
              </button>
            </div>
          </div>

          {/* Health overview card */}
          <IntegrationHealthOverview />

          {/* Tabs */}
          <div className="flex gap-0" style={{ borderBottom: '1px solid #334155' }}>
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className="px-5 py-3 text-sm font-semibold transition-all"
                style={{
                  color: activeTab === t.id ? '#2DD4BF' : '#64748B',
                  borderBottom: activeTab === t.id ? '3px solid #0D9488' : '3px solid transparent',
                  fontFamily: 'Inter, sans-serif',
                  marginBottom: -1,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === 'all' && (
            <AllIntegrationsTab onSelectIntegration={i => setSelectedInteg(i)} />
          )}
          {activeTab === 'monitor' && (
            <APIMonitorTab onSelectIntegration={i => setSelectedInteg(i)} />
          )}
          {activeTab === 'keys' && <APIKeysWebhooksTab />}
          {activeTab === 'logs' && <LogsEventsTab />}
        </div>

        {/* Toasts */}
        <div className="fixed bottom-6 right-6 z-[500] flex flex-col gap-2">
          {toasts.map(t => (
            <div key={t.id} className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold shadow-2xl animate-fade-in" style={{
              background: '#1E293B', border: `1px solid ${t.type === 'success' ? 'rgba(13,148,136,0.4)' : 'rgba(245,158,11,0.4)'}`,
              color: t.type === 'success' ? '#2DD4BF' : '#FCD34D',
              fontFamily: 'Inter, sans-serif',
            }}>
              {t.type === 'success' ? '✅' : '⚠️'} {t.msg}
            </div>
          ))}
        </div>
      </div>

      {/* Drawer */}
      {selectedInteg && (
        <IntegrationDetailDrawer integration={selectedInteg} onClose={() => setSelectedInteg(null)} />
      )}

      {/* Test All Modal */}
      {showTestAll && <TestAllModal onClose={() => setShowTestAll(false)} />}

      {/* Add Integration Modal */}
      {showAddModal && <AddIntegrationModal onClose={() => { setShowAddModal(false); toast('Integration activated — connection verified'); }} />}
    </AdminPageLayout>
  );
}
