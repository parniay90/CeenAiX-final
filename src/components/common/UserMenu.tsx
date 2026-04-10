import { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface UserMenuProps {
  userName: string;
  userRole: string;
  avatarUrl?: string;
  onSettingsClick?: () => void;
  onSignOut?: () => void;
}

export default function UserMenu({
  userName,
  userRole,
  avatarUrl,
  onSettingsClick,
  onSignOut
}: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSettingsClick = () => {
    setIsOpen(false);
    if (onSettingsClick) {
      onSettingsClick();
    } else {
      window.location.href = '/settings';
    }
  };

  const handleSignOut = async () => {
    setIsOpen(false);
    if (onSignOut) {
      onSignOut();
    } else {
      await supabase.auth.signOut();
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 hover:bg-slate-700 rounded-lg transition-colors"
      >
        <div className="flex items-center gap-3">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={userName}
              className="w-9 h-9 rounded-full object-cover border-2 border-teal-500"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white text-sm font-bold border-2 border-teal-400">
              {getInitials(userName)}
            </div>
          )}
          <div className="text-left hidden md:block">
            <div className="text-sm font-bold text-white">{userName}</div>
            <div className="text-xs text-slate-400">{userRole}</div>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50">
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center gap-3">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={userName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-teal-500"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white text-lg font-bold border-2 border-teal-400">
                  {getInitials(userName)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-white truncate">{userName}</div>
                <div className="text-xs text-slate-400">{userRole}</div>
              </div>
            </div>
          </div>

          <div className="p-2">
            <button
              onClick={handleSettingsClick}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-bold text-white">Settings</span>
            </button>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-rose-600 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-bold text-white">Sign Out</span>
            </button>
          </div>

          <div className="p-3 bg-slate-900 border-t border-slate-700">
            <button
              onClick={() => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); }}
              className="text-xs text-teal-400 hover:text-teal-300 font-bold"
            >
              Back to CeenAiX Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
