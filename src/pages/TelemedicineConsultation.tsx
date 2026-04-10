import { useState } from 'react';
import VideoControls from '../components/telemedicine/VideoControls';
import QuickClinicalPanel from '../components/telemedicine/QuickClinicalPanel';
import ChatAIPanel from '../components/telemedicine/ChatAIPanel';
import PostCallSummary from '../components/telemedicine/PostCallSummary';
import PrescriptionModal from '../components/consultation/PrescriptionModal';
import {
  MOCK_TELECONSULTATION,
  MOCK_CHAT_MESSAGES,
  MOCK_SHARED_FILES,
  MOCK_AI_SUMMARY,
} from '../types/telemedicine';
import { Wifi, WifiOff } from 'lucide-react';

export default function TelemedicineConsultation() {
  const [consultation] = useState(MOCK_TELECONSULTATION);
  const [messages, setMessages] = useState(MOCK_CHAT_MESSAGES);
  const [sharedFiles] = useState(MOCK_SHARED_FILES);
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [consultationEnded, setConsultationEnded] = useState(false);

  const getConnectionQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent':
        return 'bg-green-500';
      case 'good':
        return 'bg-amber-500';
      case 'poor':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getConnectionQualityText = (quality: string) => {
    return quality.charAt(0).toUpperCase() + quality.slice(1);
  };

  const handleSendMessage = (message: string, isArabic: boolean) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'doctor-001',
      senderName: 'Dr. Al-Rashid',
      senderType: 'doctor' as const,
      message,
      timestamp: new Date(),
      isArabic,
    };
    setMessages([...messages, newMessage]);
  };

  const handleEndCall = () => {
    setConsultationEnded(true);
  };

  const handleCompleteConsultation = () => {
    console.log('Consultation completed and submitted to DHA');
  };

  const formatDuration = () => {
    const elapsed = Math.floor((Date.now() - consultation.startTime.getTime()) / 1000);
    const hrs = Math.floor(elapsed / 3600);
    const mins = Math.floor((elapsed % 3600) / 60);
    const secs = elapsed % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (consultationEnded) {
    return (
      <PostCallSummary
        summary={MOCK_AI_SUMMARY}
        patientName={consultation.patientName}
        consultationDuration={formatDuration()}
        onComplete={handleCompleteConsultation}
      />
    );
  }

  return (
    <div className="h-screen bg-gray-900 relative overflow-hidden">
      <div className="absolute top-4 left-4 z-20 flex items-center gap-3">
        <div className="bg-black bg-opacity-60 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-700 flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${getConnectionQualityColor(consultation.connectionQuality)} animate-pulse`} />
          <span className="text-white text-sm font-semibold">
            {getConnectionQualityText(consultation.connectionQuality)}
          </span>
          <Wifi className="w-4 h-4 text-white ml-1" />
        </div>

        <button
          onClick={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
        >
          {isLeftPanelOpen ? 'Hide' : 'Show'} Clinical Tools
        </button>
      </div>

      {consultation.isRecording && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-red-600 bg-opacity-90 backdrop-blur-sm rounded-lg px-4 py-2 border border-red-500 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
            <span className="text-white text-sm font-bold">
              Recording (DHA Compliance)
            </span>
          </div>
        </div>
      )}

      <div className="absolute top-4 right-4 z-20 flex items-center gap-3">
        <button
          onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
          className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-colors border border-gray-600"
        >
          {isRightPanelOpen ? 'Hide' : 'Show'} Chat & AI
        </button>
      </div>

      <div className="w-full h-full flex items-center justify-center p-4 pb-24">
        <div className="relative w-full max-w-5xl aspect-video bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={consultation.patientPhoto}
              alt={consultation.patientName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
          </div>

          <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 backdrop-blur-sm rounded-lg px-4 py-2">
            <div className="text-white font-bold">{consultation.patientName}</div>
            <div className="text-gray-300 text-sm">{consultation.chiefComplaint}</div>
          </div>

          <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-900 rounded-lg overflow-hidden shadow-xl border-2 border-teal-500 cursor-move">
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-900 to-gray-900">
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">DR</span>
                </div>
                <div className="text-white text-sm font-semibold">Dr. Al-Rashid</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <QuickClinicalPanel
        isOpen={isLeftPanelOpen}
        onClose={() => setIsLeftPanelOpen(false)}
        patientName={consultation.patientName}
        patientDob={consultation.patientDob}
        chiefComplaint={consultation.chiefComplaint}
        onPrescription={() => setIsPrescriptionModalOpen(true)}
        onLabOrder={() => console.log('Order labs')}
      />

      <ChatAIPanel
        isOpen={isRightPanelOpen}
        onClose={() => setIsRightPanelOpen(false)}
        messages={messages}
        sharedFiles={sharedFiles}
        onSendMessage={handleSendMessage}
      />

      <VideoControls
        onEndCall={handleEndCall}
        onToggleMic={(muted) => console.log('Mic muted:', muted)}
        onToggleVideo={(stopped) => console.log('Video stopped:', stopped)}
        onToggleScreenShare={() => console.log('Screen share toggled')}
        onToggleChat={() => setIsRightPanelOpen(!isRightPanelOpen)}
        onToggleParticipants={() => console.log('Participants toggled')}
        startTime={consultation.startTime}
      />

      <PrescriptionModal
        isOpen={isPrescriptionModalOpen}
        onClose={() => setIsPrescriptionModalOpen(false)}
        onSave={(prescription) => {
          console.log('Prescription saved:', prescription);
          setIsPrescriptionModalOpen(false);
        }}
      />
    </div>
  );
}
