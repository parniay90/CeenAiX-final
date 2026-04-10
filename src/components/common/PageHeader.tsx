import { ArrowLeft, Menu, Home, Users, Building2, Heart, TestTube, Pill, ShieldCheck, Settings, MessageSquare, Bell, BarChart3, Brain } from 'lucide-react';
import { useState } from 'react';

interface PageHeaderProps {
  title?: string;
  showBackButton?: boolean;
  showMenu?: boolean;
}

export default function PageHeader({ title, showBackButton = true, showMenu = true }: PageHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleBack = () => {
    window.history.back();
  };

  const menuItems = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'Patient Dashboard', icon: Users, path: '/dashboard' },
    { label: 'Doctor Dashboard', icon: Heart, path: '/doctor/dashboard' },
    { label: 'Pharmacy Dashboard', icon: Pill, path: '/pharmacy/dashboard' },
    { label: 'Lab Dashboard', icon: TestTube, path: '/lab/dashboard' },
    { label: 'Insurance Portal', icon: ShieldCheck, path: '/insurance' },
    { label: 'Admin Dashboard', icon: Building2, path: '/admin/dashboard' },
    { label: 'AI Assistant', icon: Brain, path: '/ai-assistant' },
    { label: 'Analytics', icon: BarChart3, path: '/analytics' },
    { label: 'Messages', icon: MessageSquare, path: '/messages' },
    { label: 'Notifications', icon: Bell, path: '/notifications' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <>
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}
            {title && (
              <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
            )}
          </div>

          {showMenu && (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Open menu"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 bottom-0 w-80 bg-white shadow-2xl z-50 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Navigation</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => {
                      window.location.href = item.path;
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-left"
                  >
                    <item.icon className="w-5 h-5 text-gray-500" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  );
}
