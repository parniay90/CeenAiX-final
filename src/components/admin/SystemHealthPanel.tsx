import { Activity, CheckCircle, Clock, Users } from 'lucide-react';
import { SystemService } from '../../types/admin';

interface SystemHealthPanelProps {
  services: SystemService[];
  apiResponseTime: { time: string; value: number }[];
  errorRate: number;
  activeSessions: number;
}

export default function SystemHealthPanel({
  services,
  apiResponseTime,
  errorRate,
  activeSessions,
}: SystemHealthPanelProps) {
  const getStatusColor = (status: 'operational' | 'degraded' | 'down') => {
    switch (status) {
      case 'operational':
        return 'text-green-400 bg-green-500 bg-opacity-10 border-green-600';
      case 'degraded':
        return 'text-amber-400 bg-amber-500 bg-opacity-10 border-amber-600';
      case 'down':
        return 'text-rose-400 bg-rose-500 bg-opacity-10 border-rose-600';
    }
  };

  const maxResponseTime = Math.max(...apiResponseTime.map((r) => r.value));

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-teal-400" />
        <h3 className="text-sm font-bold text-white uppercase">System Health</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-xs font-bold text-slate-400">Error Rate</span>
          </div>
          <div className="text-xl font-bold text-green-400">{errorRate}%</div>
          <div className="px-2 py-0.5 bg-green-500 bg-opacity-20 border border-green-600 rounded text-xs font-bold text-green-400 inline-block mt-1">
            Excellent
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-teal-400" />
            <span className="text-xs font-bold text-slate-400">Active Sessions</span>
          </div>
          <div className="text-xl font-bold text-white">{activeSessions.toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-1">Concurrent users</div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-teal-400" />
          <span className="text-xs font-bold text-slate-400 uppercase">API Response Time (24h)</span>
        </div>
        <div className="h-24 flex items-end gap-1">
          {apiResponseTime.map((point, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full bg-gradient-to-t from-teal-600 to-teal-500 rounded-t"
                style={{ height: `${(point.value / maxResponseTime) * 100}%` }}
              ></div>
              <div className="text-xs text-slate-500 font-mono">{point.time}</div>
            </div>
          ))}
        </div>
        <div className="text-center text-xs text-slate-500 mt-2">Average: 56ms</div>
      </div>

      <div>
        <div className="text-xs font-bold text-slate-400 uppercase mb-3">Service Status</div>
        <div className="space-y-2">
          {services.map((service) => (
            <div
              key={service.name}
              className="flex items-center justify-between p-2 bg-slate-900 border border-slate-700 rounded"
            >
              <div className="flex items-center gap-3 flex-1">
                <div
                  className={`w-2 h-2 rounded-full ${
                    service.status === 'operational'
                      ? 'bg-green-500'
                      : service.status === 'degraded'
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                ></div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white">{service.name}</div>
                  <div className="text-xs text-slate-500">Uptime: {service.uptime}%</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-slate-400">{service.latency}ms</div>
                <div
                  className={`px-2 py-0.5 rounded text-xs font-bold border ${getStatusColor(
                    service.status
                  )}`}
                >
                  {service.status === 'operational' ? 'Connected' : service.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
