import { User, FileText, Image as ImageIcon, Activity, ExternalLink } from 'lucide-react';
import { Conversation } from '../../types/messaging';
import { MOCK_SHARED_FILES } from '../../types/messaging';
import { format } from 'date-fns';

interface ContextPanelProps {
  conversation: Conversation;
}

export default function ContextPanel({ conversation }: ContextPanelProps) {
  const sharedFiles = MOCK_SHARED_FILES.filter(f => f.conversationId === conversation.id);

  const getFileIcon = (type: string) => {
    if (type === 'image') return <ImageIcon className="w-5 h-5 text-blue-400" />;
    return <FileText className="w-5 h-5 text-slate-400" />;
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  const getQuickActions = () => {
    switch (conversation.type) {
      case 'doctor-pharmacy':
        return [
          { label: 'View Prescription', icon: FileText },
          { label: 'Update Dispense Status', icon: Activity },
        ];
      case 'doctor-lab':
        return [
          { label: 'View Test Orders', icon: FileText },
          { label: 'Check Results', icon: Activity },
        ];
      case 'patient-doctor':
        return [
          { label: 'View Health Records', icon: FileText },
          { label: 'Schedule Appointment', icon: Activity },
        ];
      default:
        return [];
    }
  };

  const quickActions = getQuickActions();

  return (
    <div className="w-[20%] bg-slate-900 border-l border-slate-800 overflow-y-auto">
      {conversation.sharedPatient && (
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-4 h-4 text-teal-400" />
            <h3 className="text-xs font-bold text-slate-400 uppercase">Shared Patient</h3>
          </div>

          <div className="bg-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-white">{conversation.sharedPatient.name}</h4>
              <button className="p-1.5 hover:bg-slate-700 rounded transition-colors">
                <ExternalLink className="w-4 h-4 text-teal-400" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <div className="text-slate-500">Emirates ID</div>
                <div className="text-slate-300 font-mono">{conversation.sharedPatient.emiratesId}</div>
              </div>
              <div>
                <div className="text-slate-500">Age</div>
                <div className="text-slate-300">{conversation.sharedPatient.age} years</div>
              </div>
            </div>

            <button className="w-full mt-3 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg transition-colors">
              View Full Record
            </button>
          </div>
        </div>
      )}

      {sharedFiles.length > 0 && (
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-teal-400" />
            <h3 className="text-xs font-bold text-slate-400 uppercase">Shared Files</h3>
          </div>

          <div className="space-y-2">
            {sharedFiles.map(file => (
              <button
                key={file.id}
                className="w-full flex items-start gap-3 p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-left"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                  {getFileIcon(file.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white truncate mb-1">{file.filename}</div>
                  <div className="text-xs text-slate-500">{formatFileSize(file.fileSize)}</div>
                  <div className="text-xs text-slate-500">{format(file.timestamp, 'MMM d, yyyy')}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {quickActions.length > 0 && (
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-teal-400" />
            <h3 className="text-xs font-bold text-slate-400 uppercase">Quick Actions</h3>
          </div>

          <div className="space-y-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className="w-full flex items-center gap-3 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-left rounded-lg transition-colors"
              >
                <action.icon className="w-4 h-4 text-teal-400" />
                <span className="text-sm font-bold text-white">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
