import {
  LayoutDashboard,
  Calendar,
  Users,
  Brain,
  FileText,
  FlaskConical,
  UserPlus,
  Video,
  BarChart3,
  MessageSquare,
  Settings,
  Scan,
} from 'lucide-react';

interface DoctorSidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'schedule', label: "Today's Schedule", icon: Calendar },
  { id: 'patients', label: 'Patient Records', icon: Users },
  { id: 'clinical-support', label: 'Clinical Decision Support', icon: Brain },
  { id: 'mri-ct-analysis', label: 'MRI & CT Scan Analysis', icon: Scan },
  { id: 'prescriptions', label: 'Prescriptions', icon: FileText },
  { id: 'lab-orders', label: 'Lab Orders', icon: FlaskConical },
  { id: 'referrals', label: 'Referrals', icon: UserPlus },
  { id: 'telemedicine', label: 'Telemedicine', icon: Video },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function DoctorSidebar({ activeItem, onItemClick }: DoctorSidebarProps) {
  return (
    <div className="w-64 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white flex flex-col h-full border-r border-cyan-900/30 shadow-2xl shadow-cyan-500/10">
      <div className="p-8 border-b border-slate-800">
        <div className="flex items-center gap-6">
          <img
            src="/ChatGPT_Image_Feb_27,_2026,_11_29_01_AM.png"
            alt="CeenAiX Logo"
            className="w-12 h-12 object-contain animate-fadeIn hover:scale-110 transition-transform duration-300"
          />
          <div className="animate-slideUp">
            <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">CeenAiX</h1>
            <p className="text-xs text-slate-400">AI That Sees Health</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-6 overflow-y-auto">
        <div className="px-4 space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onItemClick(item.id)}
                style={{ animationDelay: `${index * 50}ms` }}
                className={`w-full flex items-center gap-6 px-4 py-3 rounded-lg transition-all duration-300
                  animate-slideUp hover:translate-x-1 group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-900/50'
                    : 'text-slate-300 hover:bg-gradient-to-r hover:from-slate-800 hover:to-slate-800/50 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 transition-all duration-300 ${isActive ? 'animate-pulse' : 'group-hover:text-cyan-400'}`} />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="p-8 border-t border-slate-800">
        <div className="bg-gradient-to-r from-slate-800 to-slate-800/50 rounded-xl p-4 text-xs border border-cyan-900/30">
          <p className="text-slate-400 mb-1">DHA Compliant</p>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
            <span className="text-slate-300 font-medium">System Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
