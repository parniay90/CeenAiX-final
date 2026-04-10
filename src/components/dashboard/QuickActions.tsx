import { Calendar, Pill, FlaskConical, Shield } from 'lucide-react';

export default function QuickActions() {
  const actions = [
    {
      id: 'book',
      title: 'Book Appointment',
      subtitle: 'Next available: Today 3PM',
      icon: Calendar,
      color: 'teal',
      borderColor: 'border-t-teal-600',
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-600',
    },
    {
      id: 'medications',
      title: 'Medication Tracker',
      subtitle: '2 due today',
      icon: Pill,
      color: 'amber',
      borderColor: 'border-t-amber-600',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
    {
      id: 'lab',
      title: 'Lab Results',
      subtitle: '1 new result',
      icon: FlaskConical,
      color: 'slate',
      borderColor: 'border-t-slate-600',
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-600',
    },
    {
      id: 'emergency',
      title: 'Emergency Info',
      subtitle: 'View my critical info',
      icon: Shield,
      color: 'rose',
      borderColor: 'border-t-rose-600',
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.id}
            className={`bg-white rounded-xl border-t-4 ${action.borderColor} p-6 text-left hover:shadow-lg transition-all hover:-translate-y-1 group`}
          >
            <div className={`w-12 h-12 ${action.iconBg} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <Icon className={`w-6 h-6 ${action.iconColor}`} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
            <p className="text-sm text-gray-600">{action.subtitle}</p>
          </button>
        );
      })}
    </div>
  );
}
