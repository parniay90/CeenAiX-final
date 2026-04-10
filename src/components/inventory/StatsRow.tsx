import { Package, CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { InventoryStats } from '../../types/inventory';

interface StatsRowProps {
  stats: InventoryStats;
}

export default function StatsRow({ stats }: StatsRowProps) {
  const statCards = [
    {
      label: 'Total SKUs',
      value: stats.totalSKUs,
      icon: Package,
      color: 'bg-slate-100',
      textColor: 'text-slate-900',
      iconColor: 'text-slate-600',
    },
    {
      label: 'In Stock',
      value: stats.inStock,
      icon: CheckCircle,
      color: 'bg-green-100',
      textColor: 'text-green-900',
      iconColor: 'text-green-600',
    },
    {
      label: 'Low Stock',
      value: stats.lowStock,
      icon: AlertTriangle,
      color: 'bg-amber-100',
      textColor: 'text-amber-900',
      iconColor: 'text-amber-600',
    },
    {
      label: 'Out of Stock',
      value: stats.outOfStock,
      icon: XCircle,
      color: 'bg-rose-100',
      textColor: 'text-rose-900',
      iconColor: 'text-rose-600',
    },
    {
      label: 'Expiring in 30 Days',
      value: stats.expiringIn30Days,
      icon: Clock,
      color: 'bg-orange-100',
      textColor: 'text-orange-900',
      iconColor: 'text-orange-600',
    },
  ];

  return (
    <div className="grid grid-cols-5 gap-4 mb-6">
      {statCards.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className={`${stat.color} rounded-lg p-4 border-2 ${stat.color.replace('100', '200')}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-bold uppercase ${stat.textColor}`}>{stat.label}</span>
              <Icon className={`w-5 h-5 ${stat.iconColor}`} />
            </div>
            <div className={`text-3xl font-bold ${stat.textColor}`}>{stat.value.toLocaleString()}</div>
          </div>
        );
      })}
    </div>
  );
}
