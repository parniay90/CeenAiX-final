import {
  LayoutDashboard,
  ClipboardList,
  Package,
  AlertTriangle,
  MessageCircle,
  ShoppingCart,
  BarChart3,
  Settings,
  Pill,
} from 'lucide-react';

interface PharmacySidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'prescriptions', label: 'Prescription Queue', icon: ClipboardList },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'interactions', label: 'Drug Interaction Checker', icon: AlertTriangle },
  { id: 'counseling', label: 'Patient Counseling', icon: MessageCircle },
  { id: 'orders', label: 'Orders & Procurement', icon: ShoppingCart },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function PharmacySidebar({ activeTab, onTabChange }: PharmacySidebarProps) {
  return (
    <div className="w-64 bg-slate-900 min-h-screen flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-teal-600 rounded-lg">
            <Pill className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">CeenAiX Pharmacy</h1>
          </div>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          DHA License: <span className="text-teal-400 font-semibold">PH-2024-007892</span>
        </div>
      </div>

      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full px-6 py-3 flex items-center gap-3 text-sm font-semibold transition-colors ${
                isActive
                  ? 'bg-teal-600 text-white border-l-4 border-teal-400'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-700">
        <div className="text-xs text-slate-500 mb-1">Logged in as</div>
        <div className="text-sm font-semibold text-white">Pharmacist Ahmed Al-Mansouri</div>
        <div className="text-xs text-teal-400 mt-0.5">RPh License: 45821</div>
      </div>
    </div>
  );
}
