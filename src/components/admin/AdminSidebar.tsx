import {
  LayoutDashboard,
  Building2,
  Users,
  Monitor,
  Brain,
  Link2,
  Shield,
  CreditCard,
  FileText,
  Activity,
  Settings,
} from 'lucide-react';

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function AdminSidebar({ activeSection, onSectionChange }: AdminSidebarProps) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'organizations', label: 'Organizations', icon: Building2 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'portals', label: 'Portals', icon: Monitor },
    { id: 'ai-analytics', label: 'AI & Analytics', icon: Brain },
    { id: 'integrations', label: 'Integrations', icon: Link2 },
    { id: 'compliance', label: 'Compliance', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'audit-logs', label: 'Audit Logs', icon: FileText },
    { id: 'system-health', label: 'System Health', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-60 bg-slate-900 border-r border-slate-800 h-screen flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-base">CeenAiX</div>
            <div className="text-xs text-slate-400 font-semibold">Admin Portal</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/50'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="text-xs text-slate-500 font-semibold">
          <div>Platform Version</div>
          <div className="text-slate-400 mt-1 font-mono">v2.4.1</div>
        </div>
      </div>
    </div>
  );
}
