import { Play, FileText, Pill, FlaskConical } from 'lucide-react';
import { Appointment } from '../../../types/doctorDashboard';
import { useEffect, useState } from 'react';

interface ConsultationWorkspaceCardProps {
  appointment: Appointment | null;
  onOpenWorkspace: () => void;
}

export default function ConsultationWorkspaceCard({
  appointment,
  onOpenWorkspace,
}: ConsultationWorkspaceCardProps) {
  const [sessionDuration, setSessionDuration] = useState('00:00');

  useEffect(() => {
    if (!appointment || appointment.status !== 'in-progress') return;

    const startTime = new Date();
    startTime.setHours(14, 0, 0);

    const updateDuration = () => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      const minutes = Math.floor(diff / 60);
      const seconds = diff % 60;
      setSessionDuration(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    };

    updateDuration();
    const interval = setInterval(updateDuration, 1000);
    return () => clearInterval(interval);
  }, [appointment]);

  if (!appointment) {
    return (
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-7 opacity-70">
        <div className="text-center text-white">
          <p className="text-lg font-semibold mb-2">No Active Consultation</p>
          <p className="text-sm text-white/60">
            All appointments completed or next patient not yet started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 to-teal-900 rounded-2xl p-7 shadow-2xl animate-slideUp animate-workspacePulse">
      <div className="flex items-center gap-6">
        <div className="flex-1">
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Live Consultation
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {appointment.patientName}
            </h2>
            <div className="flex items-center gap-4 text-sm text-white/70 mb-2">
              <span>42F</span>
              <span>·</span>
              <span>{appointment.insurance}</span>
              <span>·</span>
              <span className="text-teal-300">❤️ {appointment.condition}</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {appointment.flags.map((flag, idx) => (
                <span
                  key={idx}
                  className={`px-2 py-1 rounded-full text-xs font-bold ${
                    flag.severity === 'high'
                      ? 'bg-amber-500/20 text-amber-300'
                      : flag.severity === 'medium'
                      ? 'bg-blue-800/50 text-blue-300'
                      : 'bg-slate-600/50 text-slate-300'
                  }`}
                >
                  {flag.label}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 text-white">
            <span className="text-sm text-white/60">Session started: {appointment.time}</span>
            <span className="text-sm text-white/40">·</span>
            <span className="text-2xl font-bold font-mono">{sessionDuration}</span>
          </div>
        </div>

        <div className="flex-shrink-0">
          <button
            onClick={onOpenWorkspace}
            className="px-8 py-4 bg-white text-slate-900 rounded-xl font-bold text-base hover:scale-105 transition-transform shadow-xl hover:shadow-2xl flex items-center gap-3 mb-3"
          >
            <Play className="w-5 h-5" />
            Open Consultation Workspace
          </button>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-xs font-medium flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              SOAP Notes
            </button>
            <button className="px-3 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-xs font-medium flex items-center gap-1.5">
              <Pill className="w-3.5 h-3.5" />
              Prescribe
            </button>
            <button className="px-3 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-xs font-medium flex items-center gap-1.5">
              <FlaskConical className="w-3.5 h-3.5" />
              Order Lab
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
