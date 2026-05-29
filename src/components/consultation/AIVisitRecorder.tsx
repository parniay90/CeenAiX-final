import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic, MicOff, Send, Brain, Sparkles, X, Minimize2, Maximize2,
  User, Stethoscope, Loader2, Copy, Check, ChevronRight,
  Pill, FlaskConical, ClipboardList, AlertTriangle, Lightbulb,
  CheckCircle2, RotateCcw, FileText, Bot
} from 'lucide-react';
import { PatientConsultation } from '../../types/consultation';

interface ChatMessage {
  id: string;
  role: 'doctor' | 'patient' | 'ai';
  text: string;
  time: string;
  typing?: boolean;
}

interface AISuggestion {
  id: string;
  type: 'differential' | 'recommendation' | 'warning' | 'lab' | 'prescription' | 'followup';
  title: string;
  body: string;
  confidence?: number;
  applied?: boolean;
}

interface Props {
  patient: PatientConsultation;
  visitType: 'in-person' | 'virtual';
  onClose: () => void;
  onMinimize?: () => void;
}

function nowTime() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function uid() {
  return Math.random().toString(36).slice(2);
}

// Simulated AI responses for each user message
const AI_RESPONSE_POOL: Record<string, { suggestions: AISuggestion[]; reply: string }> = {
  headache: {
    reply: 'Noted — persistent headache (3 days) combined with known hypertension. I\'m cross-referencing the BP reading of 152/88 and medication history.',
    suggestions: [
      { id: '1', type: 'warning', title: 'Elevated BP + Headache', body: 'BP 152/88 + 3-day headache in a hypertensive patient. Consider hypertensive urgency. Check for visual changes, nausea, or confusion.', confidence: 82 },
      { id: '2', type: 'differential', title: 'Differential: Hypertensive Urgency', body: 'I10 — Essential Hypertension, decompensated. Evidence: elevated BP from baseline, headache, known HTN.', confidence: 75 },
    ],
  },
  vision: {
    reply: 'Visual disturbance (blurry vision on waking) in a diabetic hypertensive patient is a red flag. This may indicate hypertensive retinopathy or diabetic maculopathy.',
    suggestions: [
      { id: '3', type: 'recommendation', title: 'Ophthalmology Referral Recommended', body: 'Blurry vision + DM + HTN warrants urgent ophthalmology referral to rule out hypertensive retinopathy (Keith-Wagener grade) and diabetic macular edema.', confidence: 88 },
      { id: '4', type: 'lab', title: 'Suggested Labs', body: 'eGFR · Creatinine · Urine microalbumin/creatinine ratio · BMP · HbA1c (overdue per record)', confidence: 91 },
    ],
  },
  medication: {
    reply: 'Medication non-adherence is the most likely driver of BP elevation here. Missed Amlodipine doses directly correlate with today\'s BP of 152/88.',
    suggestions: [
      { id: '5', type: 'prescription', title: 'Restart Amlodipine 5mg OD', body: 'Restart immediately. Per DHA HTN Guideline 2025: if BP >150/90 on monotherapy, consider adding Ramipril 5mg OD. Check eGFR first given nocturia.', confidence: 90 },
      { id: '6', type: 'warning', title: 'Drug Interaction Check', body: 'Amlodipine + Atorvastatin: moderate interaction — increased Atorvastatin levels. Current dose (20mg) is within safe range. Continue with monitoring.', confidence: 85 },
    ],
  },
  swelling: {
    reply: 'Bilateral ankle edema + nocturia in a diabetic patient with longstanding hypertension raises concern for early cardiorenal syndrome or diabetic nephropathy.',
    suggestions: [
      { id: '7', type: 'differential', title: 'Differential: Diabetic Nephropathy', body: 'E11.21 — Type 2 DM with diabetic nephropathy. Evidence: nocturia, ankle edema, DM x5yr, HTN. Microalbumin urgently needed.', confidence: 60 },
      { id: '8', type: 'followup', title: 'Follow-up Plan', body: 'BP recheck in 2 weeks. Daily home BP log. If >140/90 after restarting medication → escalate to combination therapy. Return sooner if headache worsens or vision changes.', confidence: 92 },
    ],
  },
  default: {
    reply: 'I\'ve updated the clinical picture based on this information. Reviewing against patient background — conditions: HTN, T2DM, Hyperlipidemia; medications: Amlodipine, Metformin, Atorvastatin; allergies: Penicillin, Shellfish.',
    suggestions: [
      { id: '9', type: 'recommendation', title: 'Complete Clinical Assessment', body: 'Key outstanding items: (1) medication adherence review, (2) BP trending, (3) renal function given DM+HTN co-morbidity.', confidence: 78 },
    ],
  },
};

function getAIResponse(text: string): { suggestions: AISuggestion[]; reply: string } {
  const lower = text.toLowerCase();
  if (lower.includes('headache') || lower.includes('head')) return AI_RESPONSE_POOL.headache;
  if (lower.includes('vision') || lower.includes('blurr') || lower.includes('eye')) return AI_RESPONSE_POOL.vision;
  if (lower.includes('medic') || lower.includes('pill') || lower.includes('amlodip') || lower.includes('missed') || lower.includes('pharmacy')) return AI_RESPONSE_POOL.medication;
  if (lower.includes('swelling') || lower.includes('ankle') || lower.includes('urin') || lower.includes('nocturia')) return AI_RESPONSE_POOL.swelling;
  return AI_RESPONSE_POOL.default;
}

const typeColors = {
  differential: { bg: 'bg-blue-50', border: 'border-blue-200', icon: Brain, iconColor: 'text-blue-600', badge: 'bg-blue-100 text-blue-700' },
  recommendation: { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: Lightbulb, iconColor: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700' },
  warning: { bg: 'bg-amber-50', border: 'border-amber-200', icon: AlertTriangle, iconColor: 'text-amber-600', badge: 'bg-amber-100 text-amber-700' },
  lab: { bg: 'bg-teal-50', border: 'border-teal-200', icon: FlaskConical, iconColor: 'text-teal-600', badge: 'bg-teal-100 text-teal-700' },
  prescription: { bg: 'bg-rose-50', border: 'border-rose-200', icon: Pill, iconColor: 'text-rose-600', badge: 'bg-rose-100 text-rose-700' },
  followup: { bg: 'bg-slate-50', border: 'border-slate-200', icon: ClipboardList, iconColor: 'text-slate-600', badge: 'bg-slate-100 text-slate-700' },
};

export default function AIVisitRecorder({ patient, visitType, onClose, onMinimize }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'ai',
      time: nowTime(),
      text: `Hi Dr. Ahmed — I'm your AI clinical assistant for this ${visitType === 'virtual' ? 'virtual' : 'in-person'} visit with ${patient.patientName}.\n\nI've loaded their background: ${patient.activeConditions.map(c => c.name).join(', ')}; medications: ${patient.currentMedications.map(m => m.drugName).join(', ')}; allergies: ${patient.allergies.map(a => a.allergen).join(', ')}.\n\nStart typing or recording the conversation. I'll analyse symptoms in real-time and surface clinical recommendations.`,
    },
  ]);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [input, setInput] = useState('');
  const [speaker, setSpeaker] = useState<'doctor' | 'patient'>('patient');
  const [micActive, setMicActive] = useState(false);
  const [aiTyping, setAiTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [minimized, setMinimized] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const micIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, aiTyping]);

  // Simulate microphone dictation — streams words into input
  const demoWords = [
    "Doctor I've been having",
    "a severe headache for",
    "three days now and",
    "my vision gets blurry",
    "in the mornings",
  ];
  const wordRef = useRef(0);

  function toggleMic() {
    if (micActive) {
      setMicActive(false);
      if (micIntervalRef.current) clearInterval(micIntervalRef.current);
      return;
    }
    setMicActive(true);
    wordRef.current = 0;
    micIntervalRef.current = setInterval(() => {
      const words = demoWords;
      if (wordRef.current < words.length) {
        setInput(prev => (prev ? prev + ' ' : '') + words[wordRef.current]);
        wordRef.current += 1;
      } else {
        setMicActive(false);
        if (micIntervalRef.current) clearInterval(micIntervalRef.current);
      }
    }, 700);
  }

  const sendMessage = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    setInput('');

    const userMsg: ChatMessage = { id: uid(), role: speaker, text, time: nowTime() };
    setMessages(prev => [...prev, userMsg]);
    setAiTyping(true);

    // AI processes after short delay
    setTimeout(() => {
      const response = getAIResponse(text);
      setAiTyping(false);

      const aiMsg: ChatMessage = { id: uid(), role: 'ai', text: response.reply, time: nowTime() };
      setMessages(prev => [...prev, aiMsg]);

      // Add new suggestions (avoid duplicates)
      setSuggestions(prev => {
        const existingIds = new Set(prev.map(s => s.id));
        const newOnes = response.suggestions.filter(s => !existingIds.has(s.id));
        return [...prev, ...newOnes];
      });
    }, 1200 + Math.random() * 600);
  }, [input, speaker]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function applyAll() {
    setSuggestions(prev => prev.map(s => ({ ...s, applied: true })));
  }

  function applySuggestion(id: string) {
    setSuggestions(prev => prev.map(s => s.id === id ? { ...s, applied: true } : s));
  }

  function copyText(id: string, text: string) {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  }

  function reset() {
    setMessages(prev => [prev[0]]);
    setSuggestions([]);
    setInput('');
    setMicActive(false);
    if (micIntervalRef.current) clearInterval(micIntervalRef.current);
  }

  const activeSuggestions = suggestions.filter(s => !s.applied);

  if (minimized) {
    return (
      <div className="fixed bottom-6 right-6 z-[200]">
        <button
          onClick={() => setMinimized(false)}
          className="flex items-center gap-3 bg-[#0A1628] text-white px-5 py-3 rounded-2xl shadow-2xl hover:bg-slate-800 transition-colors border border-teal-600/30"
        >
          <Bot size={16} className="text-teal-400" />
          <span className="font-semibold text-sm">AI Visit Assistant</span>
          {activeSuggestions.length > 0 && (
            <span className="w-5 h-5 bg-teal-500 rounded-full text-[10px] font-bold flex items-center justify-center">{activeSuggestions.length}</span>
          )}
          <Maximize2 size={13} className="text-slate-400" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-y-0 right-0 z-[200] w-[480px] flex flex-col bg-white shadow-2xl border-l border-slate-200">

      {/* Header */}
      <div className="bg-[#0A1628] px-5 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-teal-500/20 rounded-xl flex items-center justify-center">
            <Bot size={17} className="text-teal-400" />
          </div>
          <div>
            <div className="text-white font-bold text-sm">AI Clinical Assistant</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-400 text-[10px] font-semibold uppercase tracking-wider">
                {visitType === 'virtual' ? 'Virtual Visit' : 'In-Person Visit'} · Live
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={reset} title="Reset conversation" className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white">
            <RotateCcw size={15} />
          </button>
          <button onClick={() => setMinimized(true)} title="Minimize" className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white">
            <Minimize2 size={15} />
          </button>
          <button onClick={onClose} title="Close" className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white">
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Patient context pill */}
      <div className="bg-slate-900 px-5 py-2.5 flex items-center gap-3 shrink-0">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-600 to-teal-400 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
          {patient.patientName.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-white text-xs font-semibold">{patient.patientName}</span>
          <span className="text-slate-400 text-[11px] ml-2">{patient.activeConditions.map(c => c.icd10Code).join(' · ')}</span>
        </div>
        {activeSuggestions.length > 0 && (
          <span className="text-[10px] font-bold text-teal-400 bg-teal-500/20 px-2.5 py-1 rounded-full">
            {activeSuggestions.length} insight{activeSuggestions.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Speaker toggle */}
      <div className="bg-slate-50 border-b border-slate-200 px-5 py-2.5 flex items-center gap-3 shrink-0">
        <span className="text-[11px] text-slate-500 font-semibold">Speaking as:</span>
        <div className="flex bg-white border border-slate-200 rounded-lg p-0.5 gap-0.5">
          <button
            onClick={() => setSpeaker('doctor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${speaker === 'doctor' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Stethoscope size={11} /> Doctor
          </button>
          <button
            onClick={() => setSpeaker('patient')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${speaker === 'patient' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <User size={11} /> Patient
          </button>
        </div>
        <span className="text-[10px] text-slate-400 ml-auto">Enter to send · Shift+Enter for newline</span>
      </div>

      {/* Suggestions strip (if any) */}
      {activeSuggestions.length > 0 && (
        <div className="bg-teal-600 px-5 py-2 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles size={13} className="text-white" />
            <span className="text-white text-xs font-semibold">{activeSuggestions.length} new AI recommendation{activeSuggestions.length > 1 ? 's' : ''}</span>
          </div>
          <button onClick={applyAll} className="text-teal-100 hover:text-white text-xs font-semibold flex items-center gap-1">
            Apply all <ChevronRight size={12} />
          </button>
        </div>
      )}

      {/* Chat + suggestions scrollable area */}
      <div className="flex-1 overflow-y-auto" id="ai-chat-scroll">
        {/* Messages */}
        <div className="px-4 py-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id}>
              {msg.role === 'ai' ? (
                /* AI message — left aligned, teal accent */
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#0A1628] flex items-center justify-center shrink-0 mt-0.5">
                    <Bot size={15} className="text-teal-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-700">AI Assistant</span>
                      <span className="text-[10px] text-slate-400 font-mono">{msg.time}</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-slate-800 leading-relaxed whitespace-pre-line group relative">
                      {msg.text}
                      <button
                        onClick={() => copyText(msg.id, msg.text)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-200 rounded"
                      >
                        {copiedId === msg.id ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} className="text-slate-400" />}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Doctor / Patient message — right aligned */
                <div className={`flex gap-3 ${msg.role === 'doctor' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${msg.role === 'doctor' ? 'bg-gradient-to-br from-teal-600 to-teal-500' : 'bg-gradient-to-br from-slate-600 to-slate-500'}`}>
                    {msg.role === 'doctor' ? <Stethoscope size={14} className="text-white" /> : <User size={14} className="text-white" />}
                  </div>
                  <div className={`max-w-[80%] ${msg.role === 'doctor' ? 'items-end' : 'items-start'} flex flex-col`}>
                    <div className={`flex items-center gap-2 mb-1 ${msg.role === 'doctor' ? 'flex-row-reverse' : ''}`}>
                      <span className="text-xs font-bold text-slate-700">{msg.role === 'doctor' ? 'Dr. Ahmed' : patient.patientName.split(' ')[0]}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{msg.time}</span>
                    </div>
                    <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed group relative ${msg.role === 'doctor' ? 'bg-teal-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'}`}>
                      {msg.text}
                      <button
                        onClick={() => copyText(msg.id, msg.text)}
                        className={`absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-black/10`}
                      >
                        {copiedId === msg.id ? <Check size={10} className={msg.role === 'doctor' ? 'text-teal-200' : 'text-emerald-500'} /> : <Copy size={10} className={msg.role === 'doctor' ? 'text-white/50' : 'text-slate-400'} />}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* AI typing indicator */}
          {aiTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0A1628] flex items-center justify-center shrink-0">
                <Bot size={15} className="text-teal-400" />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                <Loader2 size={13} className="text-teal-500 animate-spin mr-1" />
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          {/* Inline suggestion cards — appear right after AI messages in the flow */}
          {suggestions.map((s) => {
            const cfg = typeColors[s.type];
            const Icon = cfg.icon;
            return (
              <div key={s.id} className={`ml-11 ${s.applied ? 'opacity-50' : ''}`}>
                <div className={`${cfg.bg} border ${cfg.border} rounded-xl p-3`}>
                  <div className="flex items-start gap-2.5">
                    <Icon size={14} className={`${cfg.iconColor} shrink-0 mt-0.5`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-bold text-slate-900">{s.title}</span>
                        {s.confidence !== undefined && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${cfg.badge}`}>{s.confidence}%</span>
                        )}
                        {s.applied && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-0.5"><Check size={8} /> Applied</span>}
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">{s.body}</p>
                    </div>
                  </div>
                  {!s.applied && (
                    <div className="flex items-center gap-2 mt-2.5">
                      <button
                        onClick={() => applySuggestion(s.id)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-colors ${cfg.bg} ${cfg.border} ${cfg.iconColor} hover:opacity-70`}
                      >
                        <CheckCircle2 size={10} /> Apply to SOAP
                      </button>
                      <button
                        onClick={() => copyText(`s-${s.id}`, s.body)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        {copiedId === `s-${s.id}` ? <><Check size={9} /> Copied</> : <><Copy size={9} /> Copy</>}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-slate-200 bg-white px-4 py-3 shrink-0">
        <div className={`flex items-end gap-2 bg-slate-50 border rounded-2xl px-4 py-2.5 transition-colors ${micActive ? 'border-red-400 bg-red-50' : 'border-slate-300 focus-within:border-teal-500 focus-within:bg-white'}`}>
          {/* Mic indicator */}
          {micActive && (
            <div className="flex items-center gap-1.5 shrink-0 pb-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-600 text-[10px] font-bold uppercase tracking-wider">Recording</span>
            </div>
          )}

          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={speaker === 'doctor' ? 'Type what the doctor says…' : `Type what ${patient.patientName.split(' ')[0]} says…`}
            rows={1}
            className="flex-1 bg-transparent resize-none text-sm text-slate-800 placeholder-slate-400 focus:outline-none leading-relaxed max-h-32 overflow-y-auto"
            style={{ minHeight: '24px' }}
            onInput={e => {
              const t = e.target as HTMLTextAreaElement;
              t.style.height = 'auto';
              t.style.height = Math.min(t.scrollHeight, 128) + 'px';
            }}
          />

          <div className="flex items-center gap-1 shrink-0 pb-0.5">
            <button
              onClick={toggleMic}
              title={micActive ? 'Stop dictating' : 'Dictate'}
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${micActive ? 'bg-red-500 text-white animate-pulse shadow-md' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
            >
              {micActive ? <MicOff size={14} /> : <Mic size={14} />}
            </button>
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="w-8 h-8 rounded-xl flex items-center justify-center bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
        <p className="text-[10px] text-slate-400 mt-1.5 text-center">
          AI suggestions are for clinical support only · Not a substitute for physician judgment
        </p>
      </div>
    </div>
  );
}
