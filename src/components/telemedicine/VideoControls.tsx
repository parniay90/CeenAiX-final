import { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  MessageSquare,
  Users,
  MoreVertical,
  PhoneOff,
} from 'lucide-react';

interface VideoControlsProps {
  onEndCall: () => void;
  onToggleMic: (muted: boolean) => void;
  onToggleVideo: (stopped: boolean) => void;
  onToggleScreenShare: () => void;
  onToggleChat: () => void;
  onToggleParticipants: () => void;
  startTime: Date;
}

export default function VideoControls({
  onEndCall,
  onToggleMic,
  onToggleVideo,
  onToggleScreenShare,
  onToggleChat,
  onToggleParticipants,
  startTime,
}: VideoControlsProps) {
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoStopped, setIsVideoStopped] = useState(false);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000);
      setDuration(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleToggleMic = () => {
    const newState = !isMicMuted;
    setIsMicMuted(newState);
    onToggleMic(newState);
  };

  const handleToggleVideo = () => {
    const newState = !isVideoStopped;
    setIsVideoStopped(newState);
    onToggleVideo(newState);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 h-18 bg-gray-900 bg-opacity-95 backdrop-blur-sm border-t border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleMic}
            className={`p-3 rounded-full transition-colors ${
              isMicMuted
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title={isMicMuted ? 'Unmute' : 'Mute'}
          >
            {isMicMuted ? (
              <MicOff className="w-5 h-5 text-white" />
            ) : (
              <Mic className="w-5 h-5 text-white" />
            )}
          </button>

          <button
            onClick={handleToggleVideo}
            className={`p-3 rounded-full transition-colors ${
              isVideoStopped
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title={isVideoStopped ? 'Start Video' : 'Stop Video'}
          >
            {isVideoStopped ? (
              <VideoOff className="w-5 h-5 text-white" />
            ) : (
              <Video className="w-5 h-5 text-white" />
            )}
          </button>

          <button
            onClick={onToggleScreenShare}
            className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
            title="Share Screen"
          >
            <MonitorUp className="w-5 h-5 text-white" />
          </button>

          <div className="ml-4 px-3 py-2 bg-gray-800 rounded-lg">
            <span className="text-xs text-gray-400 font-semibold">Duration</span>
            <div className="text-sm font-mono font-bold text-white">{formatDuration(duration)}</div>
          </div>
        </div>

        <button
          onClick={onEndCall}
          className="p-4 bg-red-600 hover:bg-red-700 rounded-full transition-colors shadow-lg group"
          title="End Call"
        >
          <PhoneOff className="w-6 h-6 text-white" />
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleChat}
            className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
            title="Chat"
          >
            <MessageSquare className="w-5 h-5 text-white" />
          </button>

          <button
            onClick={onToggleParticipants}
            className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
            title="Participants"
          >
            <Users className="w-5 h-5 text-white" />
          </button>

          <button className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors">
            <MoreVertical className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
