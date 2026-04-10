import { CATEGORY_CONFIG, Notification, NotificationCategory } from '../../types/notifications';

interface CategorySidebarProps {
  activeCategory: NotificationCategory;
  onCategoryChange: (category: NotificationCategory) => void;
  notifications: Notification[];
}

export default function CategorySidebar({ activeCategory, onCategoryChange, notifications }: CategorySidebarProps) {
  const getUnreadCount = (categoryId: string) => {
    if (categoryId === 'all') {
      return notifications.filter(n => !n.isRead).length;
    }
    return notifications.filter(n => n.category === categoryId && !n.isRead).length;
  };

  const getCategoryColor = (colorName: string, isActive: boolean) => {
    const colorMap: Record<string, { bg: string; text: string; badge: string }> = {
      rose: {
        bg: isActive ? 'bg-rose-600' : 'hover:bg-rose-900 hover:bg-opacity-20',
        text: isActive ? 'text-white' : 'text-slate-300',
        badge: 'bg-rose-600',
      },
      blue: {
        bg: isActive ? 'bg-blue-600' : 'hover:bg-blue-900 hover:bg-opacity-20',
        text: isActive ? 'text-white' : 'text-slate-300',
        badge: 'bg-blue-600',
      },
      green: {
        bg: isActive ? 'bg-green-600' : 'hover:bg-green-900 hover:bg-opacity-20',
        text: isActive ? 'text-white' : 'text-slate-300',
        badge: 'bg-green-600',
      },
      purple: {
        bg: isActive ? 'bg-purple-600' : 'hover:bg-purple-900 hover:bg-opacity-20',
        text: isActive ? 'text-white' : 'text-slate-300',
        badge: 'bg-purple-600',
      },
      cyan: {
        bg: isActive ? 'bg-cyan-600' : 'hover:bg-cyan-900 hover:bg-opacity-20',
        text: isActive ? 'text-white' : 'text-slate-300',
        badge: 'bg-cyan-600',
      },
      violet: {
        bg: isActive ? 'bg-violet-600' : 'hover:bg-violet-900 hover:bg-opacity-20',
        text: isActive ? 'text-white' : 'text-slate-300',
        badge: 'bg-violet-600',
      },
      amber: {
        bg: isActive ? 'bg-amber-600' : 'hover:bg-amber-900 hover:bg-opacity-20',
        text: isActive ? 'text-white' : 'text-slate-300',
        badge: 'bg-amber-600',
      },
      slate: {
        bg: isActive ? 'bg-slate-600' : 'hover:bg-slate-900 hover:bg-opacity-20',
        text: isActive ? 'text-white' : 'text-slate-300',
        badge: 'bg-slate-600',
      },
    };

    return colorMap[colorName] || colorMap.slate;
  };

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 p-4">
      <div className="mb-4">
        <h2 className="text-xs font-bold text-slate-400 uppercase mb-3">Categories</h2>
      </div>

      <div className="space-y-1">
        {CATEGORY_CONFIG.map((category) => {
          const unreadCount = getUnreadCount(category.id);
          const isActive = activeCategory === category.id;
          const colors = getCategoryColor(category.color, isActive);

          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id as NotificationCategory)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${colors.bg} ${colors.text}`}
            >
              <span className="text-sm font-bold">{category.label}</span>
              {unreadCount > 0 && (
                <span className={`px-2 py-0.5 ${colors.badge} text-white text-xs font-bold rounded-full`}>
                  {unreadCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
