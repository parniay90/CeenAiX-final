import { useState } from 'react';
import { BarChart3, Brain } from 'lucide-react';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminTopBar from '../components/admin/AdminTopBar';
import AIPerformanceTab from '../components/analytics/AIPerformanceTab';
import PopulationHealthTab from '../components/analytics/PopulationHealthTab';
import PlatformAnalyticsTab from '../components/analytics/PlatformAnalyticsTab';
import PredictiveModelsTab from '../components/analytics/PredictiveModelsTab';

type TabId = 'ai-performance' | 'population-health' | 'platform-analytics' | 'predictive-models' | 'research';

export default function AIAnalytics() {
  const [activeSection, setActiveSection] = useState('analytics');
  const [activeTab, setActiveTab] = useState<TabId>('ai-performance');

  const tabs: { id: TabId; label: string; icon: any }[] = [
    { id: 'ai-performance', label: 'AI Performance', icon: Brain },
    { id: 'population-health', label: 'Population Health', icon: BarChart3 },
    { id: 'platform-analytics', label: 'Platform Analytics', icon: BarChart3 },
    { id: 'predictive-models', label: 'Predictive Models', icon: Brain },
    { id: 'research', label: 'Research Insights', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      <div className="flex-1 flex flex-col">
        <AdminTopBar />

        <div className="border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-violet-600 bg-opacity-20 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">AI & Analytics Hub</h1>
              <div className="text-sm text-slate-400">
                Platform intelligence, population health, and predictive models
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-slate-800 px-6 py-3 overflow-x-auto">
          <div className="flex items-center gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-violet-600 text-white'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'ai-performance' && <AIPerformanceTab />}
          {activeTab === 'population-health' && <PopulationHealthTab />}
          {activeTab === 'platform-analytics' && <PlatformAnalyticsTab />}
          {activeTab === 'predictive-models' && <PredictiveModelsTab />}
          {activeTab === 'research' && (
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 text-center">
              <div className="w-16 h-16 bg-violet-600 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-violet-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Research Insights</h3>
              <div className="text-sm text-slate-400 max-w-md mx-auto">
                Advanced research analytics and clinical insights dashboard coming soon.
                This section will provide aggregated research data, clinical trial insights,
                and evidence-based recommendations.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
