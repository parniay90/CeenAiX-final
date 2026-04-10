import {
  Home,
  Calendar,
  FileText,
  MessageSquare,
  Heart,
  Pill,
  Bot,
  Settings,
  LogOut,
  Activity,
  User,
  ShieldCheck,
  Scan,
  Brain,
  FolderOpen
} from 'lucide-react';

interface PatientSidebarProps {
  currentPage?: string;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/patient-dashboard' },
  { id: 'appointments', label: 'Appointments', icon: Calendar, href: '/appointments' },
  { id: 'health', label: 'My Health', icon: Heart, href: '/my-health' },
  { id: 'medications', label: 'Medications', icon: Pill, href: '/medications' },
  { id: 'lab-results', label: 'Lab Results', icon: Activity, href: '/lab-results' },
  { id: 'imaging', label: 'Imaging & Scans', icon: Scan, href: '/imaging' },
  { id: 'documents', label: 'Documents', icon: FolderOpen, href: '/documents', badge: 3 },
  { id: 'messages', label: 'Messages', icon: MessageSquare, href: '/messages', badge: 2 },
  { id: 'ai-assistant', label: 'AI Assistant', icon: Bot, href: '/ai-assistant' },
  { id: 'insurance', label: 'Insurance', icon: ShieldCheck, href: '/insurance' },
];

const bottomItems = [
  { id: 'profile', label: 'Profile', icon: User, href: '/profile' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
];

export default function PatientSidebar({ currentPage = 'dashboard' }: PatientSidebarProps) {
  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-slate-50 to-white border-r border-cyan-100 flex flex-col z-50 shadow-lg shadow-cyan-500/5">
      <div className="p-6 border-b border-cyan-100 bg-white">
        <div className="flex items-center gap-3">
          <img
            src="/ChatGPT_Image_Feb_27,_2026,_11_29_01_AM.png"
            alt="CeenAiX Logo"
            className="w-12 h-12 object-contain animate-fadeIn hover:scale-110 transition-transform duration-300"
          />
          <div className="animate-slideUp">
            <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">CeenAiX</h1>
            <p className="text-xs text-slate-500">AI That Sees Health</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-3 space-y-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <a
                key={item.id}
                href={item.href}
                style={{ animationDelay: `${index * 50}ms` }}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300
                  animate-slideUp hover:translate-x-1 group
                  ${isActive
                    ? 'bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 font-medium shadow-sm shadow-cyan-500/20'
                    : 'text-slate-700 hover:bg-gradient-to-r hover:from-cyan-50/50 hover:to-transparent'
                  }
                `}
              >
                <Icon className={`w-5 h-5 transition-all duration-300 ${isActive ? 'text-cyan-600' : 'text-slate-400 group-hover:text-cyan-500'}`} />
                <span className="text-sm flex-1">{item.label}</span>
                {item.badge && (
                  <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse shadow-lg shadow-red-500/30">
                    {item.badge}
                  </span>
                )}
              </a>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-cyan-100 p-3 space-y-1 bg-white">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <a
              key={item.id}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300
                hover:translate-x-1 group
                ${isActive
                  ? 'bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 font-medium shadow-sm shadow-cyan-500/20'
                  : 'text-slate-700 hover:bg-gradient-to-r hover:from-cyan-50/50 hover:to-transparent'
                }
              `}
            >
              <Icon className={`w-5 h-5 transition-all duration-300 ${isActive ? 'text-cyan-600' : 'text-slate-400 group-hover:text-cyan-500'}`} />
              <span className="text-sm">{item.label}</span>
            </a>
          );
        })}

        <button
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 transition-all duration-300 hover:translate-x-1 group"
        >
          <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-500 transition-all duration-300" />
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
