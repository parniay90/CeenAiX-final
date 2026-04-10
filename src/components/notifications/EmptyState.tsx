import { CheckCircle } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative mb-6">
        <div className="w-24 h-24 bg-teal-600 bg-opacity-20 rounded-full flex items-center justify-center animate-pulse">
          <div className="w-20 h-20 bg-teal-600 bg-opacity-30 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-teal-400" strokeWidth={2} />
          </div>
        </div>
        <div className="absolute inset-0 w-24 h-24 bg-teal-400 bg-opacity-10 rounded-full animate-ping"></div>
      </div>

      <h3 className="text-xl font-bold text-white mb-2">You're All Caught Up!</h3>
      <p className="text-sm text-slate-400 text-center max-w-md">
        No new notifications at the moment. We'll notify you when something important happens.
      </p>
    </div>
  );
}
