import { LayoutDashboard, FileCheck, Receipt, HeartPulse, TrendingUp, Building2, Shield, Settings } from 'lucide-react';

interface InsuranceSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function InsuranceSidebar({ activeSection, onSectionChange }: InsuranceSidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pre-auth', label: 'Pre-Authorizations', icon: FileCheck },
    { id: 'claims', label: 'Claims', icon: Receipt },
    { id: 'member-health', label: 'Member Health', icon: HeartPulse },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'network', label: 'Network Providers', icon: Building2 },
    { id: 'fraud', label: 'Fraud Detection', icon: Shield },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">Daman Insurance</div>
            <div className="text-xs text-slate-400">Partner Portal</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-lg transition-all ${
                  activeSection === item.id
                    ? 'bg-teal-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800 rounded-lg p-3">
          <div className="text-xs font-bold text-slate-400 uppercase mb-1">Support</div>
          <div className="text-sm text-white">+971 4 XXX XXXX</div>
          <div className="text-xs text-slate-500 mt-1">24/7 Claims Support</div>
        </div>
      </div>
    </div>
  );
}
