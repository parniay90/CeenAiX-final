import {
  LayoutDashboard,
  TestTube,
  ClipboardList,
  FileText,
  ShieldCheck,
  Settings,
  Activity,
  BarChart3,
  Database,
} from 'lucide-react';

interface LabSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function LabSidebar({ activeSection, onSectionChange }: LabSidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'sample-queue', label: 'Sample Queue', icon: TestTube },
    { id: 'test-orders', label: 'Test Orders', icon: ClipboardList },
    { id: 'results', label: 'Results Management', icon: FileText },
    { id: 'quality-control', label: 'Quality Control', icon: ShieldCheck },
    { id: 'equipment', label: 'Equipment', icon: Activity },
    { id: 'reporting', label: 'Reporting', icon: BarChart3 },
    { id: 'nabidh', label: 'NABIDH Submission', icon: Database },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-slate-900 h-screen flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold text-white">CeenAiX</h1>
        <p className="text-sm text-teal-400 font-semibold">Laboratory Portal</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-teal-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="bg-slate-800 rounded-lg p-3">
          <p className="text-xs font-bold text-slate-400 uppercase mb-1">DHA Compliance</p>
          <p className="text-sm text-white font-semibold">Active & Certified</p>
        </div>
      </div>
    </div>
  );
}
