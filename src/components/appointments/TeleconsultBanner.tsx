import { useEffect, useState } from 'react';
import { Video } from 'lucide-react';

interface TeleconsultBannerProps {
  doctorName: string;
  appointmentTime: Date;
}

export default function TeleconsultBanner({ doctorName, appointmentTime }: TeleconsultBannerProps) {
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const diff = appointmentTime.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining('Starting now');
        return;
      }

      const minutes = Math.floor(diff / 1000 / 60);
      const seconds = Math.floor((diff / 1000) % 60);

      if (minutes > 60) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        setTimeRemaining(`${hours}h ${mins}m`);
      } else {
        setTimeRemaining(`${minutes}m ${seconds}s`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [appointmentTime]);

  return (
    <div className="bg-teal-600 text-white p-4 rounded-lg border-4 border-teal-400 animate-pulse-border mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white bg-opacity-20 rounded-full">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Your teleconsult with {doctorName}</h3>
            <p className="text-teal-100">Starts in {timeRemaining}</p>
          </div>
        </div>
        <button className="px-6 py-3 bg-white text-teal-600 rounded-lg font-semibold hover:bg-teal-50 transition-colors">
          Join Waiting Room
        </button>
      </div>

      <style>{`
        @keyframes pulse-border {
          0%, 100% {
            border-color: rgb(45, 212, 191);
          }
          50% {
            border-color: rgb(20, 184, 166);
          }
        }
        .animate-pulse-border {
          animation: pulse-border 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
