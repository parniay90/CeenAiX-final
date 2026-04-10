import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'error';
}

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  const [progress, setProgress] = useState(100);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 10);
    const startTime = Date.now();
    const duration = 3000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining === 0) clearInterval(interval);
    }, 30);

    const dismissTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss(toast.id), 300);
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(dismissTimer);
      clearInterval(interval);
    };
  }, [toast.id, onDismiss]);

  const bgColor = toast.type === 'success' ? 'bg-slate-900' : toast.type === 'warning' ? 'bg-amber-900' : 'bg-red-900';
  const barColor = toast.type === 'success' ? 'bg-teal-400' : toast.type === 'warning' ? 'bg-amber-400' : 'bg-red-400';
  const Icon = toast.type === 'success' ? CheckCircle2 : AlertTriangle;
  const iconColor = toast.type === 'success' ? 'text-teal-400' : toast.type === 'warning' ? 'text-amber-400' : 'text-red-400';

  return (
    <div
      className={`${bgColor} rounded-xl shadow-2xl w-80 overflow-hidden transition-all duration-300 ${
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
      }`}
    >
      <div className="flex items-center px-4 py-3 space-x-3">
        <Icon className={`w-4 h-4 flex-shrink-0 ${iconColor}`} />
        <p className="flex-1 text-white text-[13px]" style={{ fontFamily: 'Inter, sans-serif' }}>
          {toast.message}
        </p>
        <button onClick={() => onDismiss(toast.id)} className="text-white/40 hover:text-white transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="h-0.5 bg-white/10">
        <div
          className={`h-full ${barColor} transition-all duration-75`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

interface ToastSystemProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

const ToastSystem: React.FC<ToastSystemProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-6 right-6 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

export default ToastSystem;
