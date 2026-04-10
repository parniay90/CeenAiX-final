import { TestTube, AlertTriangle, Clock, Database, XCircle } from 'lucide-react';
import { LabDashboardStats } from '../../types/laboratory';

interface KPIRowProps {
  stats: LabDashboardStats;
}

export default function KPIRow({ stats }: KPIRowProps) {
  const completionPercentage = (stats.samplesCompleted / stats.samplesToday) * 100;
  const inProgressPercentage = (stats.samplesInProgress / stats.samplesToday) * 100;
  const pendingPercentage = (stats.samplesPending / stats.samplesToday) * 100;

  const isWithinTATTarget = stats.avgTATHours <= 4.0;

  return (
    <div className="grid grid-cols-5 gap-4">
      <div className="bg-white rounded-lg border border-slate-200 p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <TestTube className="w-5 h-5 text-teal-600" />
              <h3 className="text-xs font-bold text-slate-700 uppercase">Samples Today</h3>
            </div>
            <div className="text-3xl font-bold text-slate-900">{stats.samplesToday}</div>
          </div>
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="#e2e8f0"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="#14b8a6"
                strokeWidth="6"
                fill="none"
                strokeDasharray={`${completionPercentage * 1.76} ${176 - completionPercentage * 1.76}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-teal-700">
                {Math.round(completionPercentage)}%
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div>
            <div className="text-slate-600">Completed</div>
            <div className="text-sm font-bold text-green-700">{stats.samplesCompleted}</div>
          </div>
          <div>
            <div className="text-slate-600">In Progress</div>
            <div className="text-sm font-bold text-blue-700">{stats.samplesInProgress}</div>
          </div>
          <div>
            <div className="text-slate-600">Pending</div>
            <div className="text-sm font-bold text-amber-700">{stats.samplesPending}</div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-lg border-2 border-rose-300 p-5">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-rose-700" />
          <h3 className="text-xs font-bold text-rose-900 uppercase">Critical Values</h3>
        </div>
        <div className="text-4xl font-bold text-rose-700 mb-2">{stats.criticalValues}</div>
        <p className="text-xs text-rose-800 font-semibold">Requires immediate notification</p>
      </div>

      <div className={`rounded-lg border-2 p-5 ${
        isWithinTATTarget
          ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-300'
          : 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-300'
      }`}>
        <div className="flex items-center gap-2 mb-2">
          <Clock className={`w-5 h-5 ${isWithinTATTarget ? 'text-green-700' : 'text-amber-700'}`} />
          <h3 className={`text-xs font-bold uppercase ${
            isWithinTATTarget ? 'text-green-900' : 'text-amber-900'
          }`}>
            Avg TAT
          </h3>
        </div>
        <div className={`text-4xl font-bold mb-2 ${
          isWithinTATTarget ? 'text-green-700' : 'text-amber-700'
        }`}>
          {stats.avgTATHours.toFixed(1)}<span className="text-xl">h</span>
        </div>
        <p className={`text-xs font-semibold ${
          isWithinTATTarget ? 'text-green-800' : 'text-amber-800'
        }`}>
          {isWithinTATTarget ? 'Within target' : 'Over target'}
        </p>
      </div>

      <div className="bg-gradient-to-br from-violet-50 to-violet-100 rounded-lg border-2 border-violet-300 p-5">
        <div className="flex items-center gap-2 mb-2">
          <Database className="w-5 h-5 text-violet-700" />
          <h3 className="text-xs font-bold text-violet-900 uppercase">Pending NABIDH</h3>
        </div>
        <div className="text-4xl font-bold text-violet-700 mb-2">{stats.pendingNABIDH}</div>
        <p className="text-xs text-violet-800 font-semibold">Submissions pending</p>
      </div>

      <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border-2 border-amber-300 p-5">
        <div className="flex items-center gap-2 mb-2">
          <XCircle className="w-5 h-5 text-amber-700" />
          <h3 className="text-xs font-bold text-amber-900 uppercase">QC Failures</h3>
        </div>
        <div className="text-4xl font-bold text-amber-700 mb-2">{stats.qcFailures}</div>
        <p className="text-xs text-amber-800 font-semibold">Today</p>
      </div>
    </div>
  );
}
