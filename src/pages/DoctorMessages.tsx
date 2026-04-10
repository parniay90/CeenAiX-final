import { useState } from 'react';
import DoctorSidebarNew from '../components/doctor/DoctorSidebarNew';
import { MessageSquare, Lock, CheckCheck, Settings, Bell, Search, SquarePen as PenSquare, AlertOctagon, Video, Phone, CircleUser as UserCircle, MoreVertical, TestTube, Pill, Calendar, FileText, Mic, Send, ChevronLeft, Scan, FileHeart, AlertCircle, X, Paperclip, Brain } from 'lucide-react';

export default function DoctorMessages() {
  const [activeConvId, setActiveConvId] = useState('conv-parnia');
  const [showContext, setShowContext] = useState(true);
  const [filter, setFilter] = useState<'all' | 'patients' | 'doctors' | 'pharmacy' | 'labs'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showContextPicker, setShowContextPicker] = useState(false);

  const conversations = [
    { id: 'conv-lab', type: 'lab', name: 'Dubai Medical Laboratory', avatar: '🧪', lastMsg: '⚡ CRITICAL: Abdullah Hassan — Troponin I 2.8...', time: '11:47 AM', unread: 1, critical: true, online: false },
    { id: 'conv-sarah', type: 'doctor', name: 'Dr. Sarah Al Khateeb', avatar: 'SK', lastMsg: "📎 Ahmed, I've referred a patient — Mahmoud...", time: '10:30 AM', unread: 1, online: false },
    { id: 'conv-pharmacy', type: 'pharmacy', name: 'Al Shifa Pharmacy', avatar: '⚕️', lastMsg: "📎 Query on Parnia Yazdkhasti's Atorvastatin...", time: '1:15 PM', unread: 1, online: false },
    { id: 'conv-parnia', type: 'patient', name: 'Parnia Yazdkhasti', avatar: 'PY', lastMsg: 'Morning reading: 128/82. All good! ☕', time: '8:47 AM', unread: 1, online: true, meta: { id: 'PT-001', age: '38F', insurance: 'Daman Gold' } },
    { id: 'conv-aisha', type: 'patient', name: 'Aisha Mohammed Al Reem', avatar: 'AM', lastMsg: 'You: Follow-up booked for April 28 ✓', time: 'Yesterday', unread: 0, online: false },
    { id: 'conv-khalid', type: 'patient', name: 'Khalid Hassan Abdullah', avatar: 'KH', lastMsg: 'Appointment confirmed for Apr 7 9:00 AM', time: 'Yesterday', unread: 0, online: false },
    { id: 'conv-tooraj', type: 'doctor', name: 'Dr. Tooraj Helmi', avatar: 'TH', lastMsg: 'Perfect, thank you Ahmed. She was worried.', time: '6 Mar', unread: 0, online: false },
    { id: 'conv-saeed', type: 'patient', name: 'Saeed Rashid Al Mansoori', avatar: 'SR', lastMsg: 'On my way — running 10 min late', time: '2:30 PM', unread: 0, online: false },
    { id: 'conv-emirates', type: 'lab', name: 'Emirates Diagnostics', avatar: '🧪', lastMsg: 'Lab results ready: Noura Bint Khalid — TSH...', time: 'Yesterday', unread: 0, online: false },
    { id: 'conv-system', type: 'system', name: 'CeenAiX System', avatar: '⚙️', lastMsg: 'DHA license renewal reminder — 269 days', time: 'Yesterday', unread: 0, online: false },
  ];

  const activeConv = conversations.find(c => c.id === activeConvId);
  const unreadTotal = conversations.reduce((sum, c) => sum + c.unread, 0);

  const filteredConvs = conversations.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.lastMsg.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === 'all') return true;
    if (filter === 'patients') return c.type === 'patient';
    if (filter === 'doctors') return c.type === 'doctor';
    if (filter === 'pharmacy') return c.type === 'pharmacy';
    if (filter === 'labs') return c.type === 'lab';
    return true;
  });

  const unreadConvs = filteredConvs.filter(c => c.unread > 0);
  const readConvs = filteredConvs.filter(c => c.unread === 0);

  const getTypeCounts = () => ({
    all: conversations.length,
    patient: conversations.filter(c => c.type === 'patient').length,
    doctor: conversations.filter(c => c.type === 'doctor').length,
    pharmacy: conversations.filter(c => c.type === 'pharmacy').length,
    lab: conversations.filter(c => c.type === 'lab').length,
  });

  const counts = getTypeCounts();

  return (
    <div className="flex h-screen bg-slate-50">
      <DoctorSidebarNew />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-slate-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-teal-600" />
                <h1 className="text-lg font-bold text-slate-800" style={{ fontFamily: 'Plus Jakarta Sans' }}>Messages</h1>
                {unreadTotal > 0 && <span className="px-2 py-0.5 bg-teal-100 text-teal-700 rounded-full text-xs font-bold">{unreadTotal} unread</span>}
              </div>

              {activeConv && (
                <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    activeConv.type === 'patient' ? 'bg-gradient-to-br from-teal-400 to-teal-600 text-white' :
                    activeConv.type === 'doctor' ? 'bg-gradient-to-br from-violet-400 to-violet-600 text-white' :
                    activeConv.type === 'pharmacy' ? 'bg-amber-100 text-amber-600' :
                    activeConv.type === 'lab' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {activeConv.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{activeConv.name}</div>
                    <div className="text-xs text-slate-500">
                      {activeConv.type === 'patient' && activeConv.meta && `Patient · ${activeConv.meta.id} · ${activeConv.meta.insurance}`}
                      {activeConv.type === 'doctor' && 'Colleague · Cardiologist'}
                      {activeConv.type === 'pharmacy' && 'Pharmacy · Al Barsha, Dubai'}
                      {activeConv.type === 'lab' && 'Laboratory · Healthcare City'}
                    </div>
                  </div>
                  {activeConv.online && <div className="flex items-center gap-1 text-xs text-emerald-600"><div className="w-2 h-2 bg-emerald-500 rounded-full" />Online</div>}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-2">
                <CheckCheck className="w-4 h-4" />Mark All Read
              </button>
              <button className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-2" title="AES-256 end-to-end encrypted. DHA compliant. 10-year retention.">
                <Lock className="w-4 h-4" />Encryption
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><Settings className="w-5 h-5 text-slate-600" /></button>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5 text-slate-600" />
                {unreadTotal > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-teal-500 rounded-full" />}
              </button>
            </div>
          </div>
        </div>

        {/* 3-Panel Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Conversation List */}
          <div className="w-[280px] bg-white border-r border-slate-200 flex flex-col">
            <div className="p-4 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search conversations..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
            </div>

            <div className="px-4 py-3 border-b border-slate-100">
              <div className="flex gap-2 overflow-x-auto">
                {[
                  { id: 'all', label: `All (${counts.all})` },
                  { id: 'patients', label: `Patients (${counts.patient})` },
                  { id: 'doctors', label: `Doctors (${counts.doctor})` },
                  { id: 'pharmacy', label: `Pharmacy (${counts.pharmacy})` },
                  { id: 'labs', label: `Labs (${counts.lab})` },
                ].map(f => (
                  <button key={f.id} onClick={() => setFilter(f.id as any)} className={`px-2 py-1 rounded text-[11px] font-medium whitespace-nowrap transition-colors ${filter === f.id ? 'text-teal-700 border-b-2 border-teal-600' : 'text-slate-600 hover:text-slate-900'}`}>{f.label}</button>
                ))}
              </div>
            </div>

            <div className="px-4 py-3 border-b border-slate-100">
              <button className="w-full px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <PenSquare className="w-4 h-4" />New Message
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {unreadConvs.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-blue-50 border-b border-blue-100">
                    <div className="text-[10px] uppercase tracking-wide font-semibold text-blue-700">UNREAD · {unreadConvs.length}</div>
                  </div>
                  {unreadConvs.map(c => <ConvRow key={c.id} conv={c} active={c.id === activeConvId} onClick={() => setActiveConvId(c.id)} />)}
                </div>
              )}

              {readConvs.length > 0 && (
                <div>
                  <div className="px-4 py-2 border-b border-slate-100">
                    <div className="text-[10px] uppercase tracking-wide font-semibold text-slate-400">RECENT</div>
                  </div>
                  {readConvs.map(c => <ConvRow key={c.id} conv={c} active={c.id === activeConvId} onClick={() => setActiveConvId(c.id)} />)}
                </div>
              )}
            </div>
          </div>

          {/* Center Panel - Chat Window */}
          <div className="flex-1 flex flex-col bg-slate-50">
            {activeConv && activeConv.id === 'conv-parnia' && <ParniaChat showVideoModal={() => setShowVideoModal(true)} showContextPicker={() => setShowContextPicker(true)} messageInput={messageInput} setMessageInput={setMessageInput} />}
            {activeConv && activeConv.id === 'conv-lab' && <LabChat />}
            {activeConv && activeConv.id === 'conv-sarah' && <SarahChat />}
            {activeConv && activeConv.id === 'conv-pharmacy' && <PharmacyChat />}
            {!activeConv && <EmptyChat />}
          </div>

          {/* Right Panel - Context */}
          {showContext && activeConv && (
            <div className="w-[280px] bg-white border-l border-slate-200 flex flex-col overflow-y-auto">
              {activeConv.id === 'conv-parnia' && <ParniaContext />}
              {activeConv.id === 'conv-sarah' && <ColleagueContext />}
              {activeConv.id === 'conv-pharmacy' && <PharmacyContext />}
              {activeConv.id === 'conv-lab' && <LabContext />}
            </div>
          )}
        </div>
      </div>

      {showVideoModal && <VideoCallModal onClose={() => setShowVideoModal(false)} />}
      {showContextPicker && <ClinicalContextPicker onClose={() => setShowContextPicker(false)} />}
    </div>
  );
}

function ConvRow({ conv, active, onClick }: any) {
  const getBorderColor = () => {
    if (conv.type === 'patient') return 'border-teal-400';
    if (conv.type === 'doctor') return 'border-violet-400';
    if (conv.type === 'pharmacy') return 'border-amber-400';
    if (conv.type === 'lab') return 'border-blue-400';
    return 'border-slate-300 border-dashed';
  };

  const getTypeTag = () => {
    if (conv.type === 'patient') return <span className="px-1.5 py-0.5 bg-teal-50 text-teal-700 rounded text-[9px] font-medium">Patient</span>;
    if (conv.type === 'doctor') return <span className="px-1.5 py-0.5 bg-violet-50 text-violet-700 rounded text-[9px] font-medium">Colleague</span>;
    if (conv.type === 'pharmacy') return <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded text-[9px] font-medium">Pharmacy</span>;
    if (conv.type === 'lab') return <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-[9px] font-medium">Lab</span>;
    return <span className="px-1.5 py-0.5 bg-slate-50 text-slate-500 rounded text-[9px] font-medium">System</span>;
  };

  return (
    <div onClick={onClick} className={`relative px-4 py-3 border-b border-slate-50 cursor-pointer transition-colors ${active ? 'bg-teal-50 border-l-4 border-l-teal-500' : conv.unread > 0 ? 'bg-blue-50/40' : 'bg-white hover:bg-slate-50'}`}>
      <div className="flex items-start gap-3">
        <div className="relative flex-shrink-0">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border-2 ${getBorderColor()} ${
            conv.type === 'patient' ? 'bg-gradient-to-br from-teal-400 to-teal-600 text-white' :
            conv.type === 'doctor' ? 'bg-gradient-to-br from-violet-400 to-violet-600 text-white' :
            conv.type === 'pharmacy' ? 'bg-amber-100 text-amber-600' :
            conv.type === 'lab' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'
          }`}>{conv.avatar}</div>
          {conv.unread > 0 && <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />}
          {conv.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />}
          {conv.critical && <div className="absolute -bottom-1 -right-1"><AlertOctagon className="w-4 h-4 text-red-600 fill-white" /></div>}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-0.5">
            <div className="flex items-center gap-1.5">
              <div className={`text-sm font-bold truncate ${conv.unread > 0 ? 'text-slate-900' : 'text-slate-600'}`} style={{ fontFamily: 'Plus Jakarta Sans' }}>{conv.name}</div>
              {getTypeTag()}
            </div>
          </div>
          <div className={`text-xs truncate ${conv.unread > 0 ? 'text-slate-600 font-medium' : 'text-slate-500'}`}>{conv.lastMsg}</div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="font-mono text-[10px] text-slate-400">{conv.time}</div>
          {conv.unread > 0 && <div className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${conv.critical ? 'bg-red-600 text-white' : 'bg-teal-600 text-white'}`}>{conv.unread > 5 ? '5+' : conv.unread}</div>}
        </div>
      </div>
    </div>
  );
}

function ParniaChat({ showVideoModal, showContextPicker, messageInput, setMessageInput }: any) {
  return (
    <>
      <div className="bg-white border-b border-slate-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-white flex items-center justify-center text-sm font-bold relative">
              PY
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans' }}>Parnia Yazdkhasti</div>
              <div className="text-xs text-slate-500">Patient · PT-001 · 38F · Daman Gold</div>
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-600"><div className="w-2 h-2 bg-emerald-500 rounded-full" />Online</div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-red-50 text-red-600 rounded text-[10px] font-bold">⚠️ Penicillin SEVERE</span>
              <span className="px-2 py-1 bg-amber-50 text-amber-600 rounded text-[10px] font-bold">⚠️ Sulfa drugs</span>
            </div>
            <button onClick={showVideoModal} className="px-3 py-2 bg-teal-100 hover:bg-teal-200 text-teal-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-2">
              <Video className="w-4 h-4" />Video
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><Phone className="w-4 h-4 text-slate-600" /></button>
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><UserCircle className="w-4 h-4 text-slate-600" /></button>
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><MoreVertical className="w-4 h-4 text-slate-600" /></button>
          </div>
        </div>
      </div>

      <div className="px-6 py-2 bg-teal-50 border-b border-teal-100">
        <div className="flex items-center justify-center gap-2 text-xs text-teal-600">
          <Lock className="w-3 h-3" />
          <span>End-to-end encrypted · DHA compliant · All messages linked to PT-001 record</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="flex items-center justify-center gap-3 text-xs text-slate-400">
          <div className="h-px bg-slate-200 flex-1" />
          <span>Wednesday, 13 March 2026</span>
          <div className="h-px bg-slate-200 flex-1" />
        </div>

        <div className="flex gap-3">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">PY</div>
          <div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-2.5 max-w-md">
              <p className="text-sm text-slate-900">Dr. Ahmed, quick question — is drinking 2–3 cups of coffee per day okay for my blood pressure? I saw something online about caffeine and hypertension.</p>
            </div>
            <div className="mt-1 text-xs text-slate-400 font-mono">2:15 PM</div>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <div className="flex flex-col items-end">
            <div className="bg-teal-500 text-white rounded-2xl rounded-br-none px-4 py-2.5 max-w-md">
              <p className="text-sm">Hi Parnia. Good question. Moderate coffee (2–3 cups/day) is generally fine for people with well-controlled hypertension. Your BP has been excellent. Just avoid drinking it immediately before taking your morning reading — can give a false high. ☕</p>
            </div>
            <div className="mt-1 text-xs text-teal-300 font-mono">2:34 PM ✓✓</div>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">PY</div>
          <div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-2.5 max-w-md">
              <p className="text-sm text-slate-900">Ah perfect, that explains why my readings are always a bit higher first thing! I'll wait 30 min after my coffee. Thank you!</p>
            </div>
            <div className="mt-1 text-xs text-slate-400 font-mono">2:36 PM</div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 text-xs text-slate-400 pt-4">
          <div className="h-px bg-slate-200 flex-1" />
          <span>14 March 2026</span>
          <div className="h-px bg-slate-200 flex-1" />
        </div>

        <div className="flex gap-3 justify-end">
          <div className="flex flex-col items-end">
            <div className="bg-teal-500 text-white rounded-2xl rounded-br-none px-4 py-2.5 max-w-md space-y-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <TestTube className="w-5 h-5 text-blue-500" />
                  <span className="text-[9px] uppercase tracking-wide text-blue-600 font-semibold">Lab Result · March 5, 2026</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold text-amber-600">HbA1c: 6.8%</span>
                    <span className="text-xs text-amber-600">⚠️ H</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-emerald-600">LDL: 118 mg/dL</span>
                    <span className="text-xs text-emerald-600">✅</span>
                  </div>
                  <p className="text-xs text-blue-700">LDL is excellent ↓ (was 142 in 2021)</p>
                  <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">View Full Result →</button>
                </div>
              </div>
              <p className="text-sm">Your March labs are in. LDL is excellent (118) — Atorvastatin is working well. HbA1c is still slightly above normal but has improved significantly. See you April 7th!</p>
            </div>
            <div className="mt-1 text-xs text-teal-300 font-mono">9:00 AM ✓✓</div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 text-xs text-slate-400 pt-4">
          <div className="h-px bg-slate-200 flex-1" />
          <span>Today — Wednesday, 7 April 2026</span>
          <div className="h-px bg-slate-200 flex-1" />
        </div>

        <div className="flex gap-3">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">PY</div>
          <div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-2.5 max-w-md">
              <p className="text-sm text-slate-900">Morning reading: 128/82. All good! ☕</p>
            </div>
            <div className="mt-1 text-xs text-slate-400 font-mono">8:47 AM</div>
          </div>
        </div>
      </div>

      <div className="bg-white border-t border-slate-200 p-4 space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <button onClick={showContextPicker} className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1.5">
            <Paperclip className="w-3.5 h-3.5" />
            <Brain className="w-3.5 h-3.5" />
            Attach Clinical Context
          </button>
          <button className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1.5">
            <TestTube className="w-3.5 h-3.5" />Lab Result
          </button>
          <button className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-600 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1.5">
            <Pill className="w-3.5 h-3.5" />Prescription
          </button>
          <button className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />Appointment
          </button>
          <button className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />Document
          </button>
          <button className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1.5">
            <Mic className="w-3.5 h-3.5" />Voice Note
          </button>
        </div>

        <div className="flex items-center gap-3">
          <textarea value={messageInput} onChange={(e) => setMessageInput(e.target.value)} placeholder="Message Parnia... (encrypted)" className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm" rows={1} />
          <button disabled={!messageInput} className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${messageInput ? 'bg-teal-500 hover:bg-teal-600' : 'bg-slate-200'}`}>
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
          <Lock className="w-3 h-3" />
          <span>Encrypted · Logged to PT-001 record · DHA compliant</span>
        </div>
      </div>
    </>
  );
}

function LabChat() {
  return (
    <>
      <div className="bg-white border-b border-slate-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-lg">🧪</div>
            <div>
              <div className="text-sm font-semibold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans' }}>Dubai Medical Laboratory</div>
              <div className="text-xs text-slate-500">Laboratory · Healthcare City, Dubai</div>
            </div>
            <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-[10px] font-bold animate-pulse">🔴 CRITICAL RESULT UNACKNOWLEDGED</span>
          </div>
          <button className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-2">
            <FileText className="w-4 h-4" />View Lab Orders
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="flex gap-3">
          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm flex-shrink-0">🧪</div>
          <div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-2.5 max-w-md">
              <p className="text-sm text-slate-900">Lab order received: PT-004 Mohammed Al Shamsi. 4 tests (Troponin, BNP, Lipids, CBC). Urgent. Expected results ~5:00 PM today. Order ref: LAB-20260407-003241</p>
            </div>
            <div className="mt-1 text-xs text-slate-400 font-mono">10:37 AM ✓✓</div>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm flex-shrink-0">🧪</div>
          <div className="w-full">
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <AlertOctagon className="w-8 h-8 text-red-600 animate-pulse" />
                <div>
                  <div className="text-xs uppercase tracking-wide font-bold text-red-700">CRITICAL LAB RESULT</div>
                  <div className="text-xs text-red-600">DHA requires acknowledgment within 1 hour</div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-3 space-y-2">
                <div className="text-sm font-semibold text-slate-900">Abdullah Hassan Al Zaabi — PT-005 · 62M</div>
                <div className="border-t border-slate-200 pt-2">
                  <div className="text-base font-bold text-slate-800">Troponin I (high-sensitivity)</div>
                  <div className="font-mono text-3xl font-bold text-red-700 my-1">2.8 ng/mL</div>
                  <div className="text-xs text-slate-500 font-mono">Reference: &lt; 0.04 ng/mL</div>
                  <span className="inline-block mt-2 px-2 py-1 bg-red-600 text-white rounded text-xs font-bold">CRITICAL HIGH ↑↑ — 70× upper limit</span>
                </div>
              </div>

              <div className="text-xs text-red-600 font-mono font-bold">
                Resulted: 11:47 AM · Unacknowledged: 1h 20min<br />
                <span className="text-red-700">DHA requires acknowledgment within 1 hour — OVERDUE</span>
              </div>

              <button className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors">
                ✅ ACKNOWLEDGE THIS RESULT
              </button>
            </div>
            <div className="mt-1 text-xs text-slate-400 font-mono">11:47 AM</div>
          </div>
        </div>
      </div>
    </>
  );
}

function SarahChat() {
  return (
    <>
      <div className="bg-white border-b border-slate-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 text-white flex items-center justify-center text-sm font-bold">SK</div>
            <div>
              <div className="text-sm font-semibold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans' }}>Dr. Sarah Al Khateeb</div>
              <div className="text-xs text-slate-500">Cardiologist · Al Zahra Hospital, Dubai</div>
            </div>
            <div className="flex items-center gap-1 text-xs text-amber-600"><div className="w-2 h-2 bg-amber-500 rounded-full" />Away</div>
          </div>
          <button className="px-3 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-2">
            <FileText className="w-4 h-4" />View Referral
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="flex gap-3">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">SK</div>
          <div className="w-full">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-2.5 max-w-2xl space-y-3">
              <p className="text-sm text-slate-900">Ahmed, I've referred a patient to you — Mahmoud Siddiq, 52M, presenting with exertional dyspnea and palpitations. Echo shows asymmetric LVH (IVS 16mm). Query HCM vs hypertensive LVH. DM + HTN background. Please see within 2 weeks if possible. I've sent through his Echo report and recent labs through CeenAiX.</p>
              
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <FileHeart className="w-5 h-5 text-indigo-600" />
                  <span className="text-[9px] uppercase tracking-wide text-indigo-600 font-semibold">Clinical Referral</span>
                </div>
                <div className="font-semibold text-sm text-slate-900">Mahmoud Siddiq — 52M</div>
                <div className="text-xs text-slate-600 space-y-1">
                  <div>From: Dr. Sarah Al Khateeb (Cardiologist)</div>
                  <div>To: Dr. Ahmed Al Rashidi (Cardiologist)</div>
                  <div>Date: 7 April 2026</div>
                  <div className="font-semibold text-indigo-700">Query: HCM vs Hypertensive LVH — IVS 16mm</div>
                  <div className="text-amber-600 font-medium">Urgency: Within 2 weeks</div>
                </div>
                <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">📄 View Full Referral</button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <Scan className="w-5 h-5 text-blue-600" />
                  <span className="text-xs font-semibold text-blue-700">Echo Report — Mahmoud Siddiq</span>
                </div>
                <div className="text-xs text-slate-700">
                  <span className="font-mono">IVS: 16mm ⚠️ | LVEF: 60% ✅ | Asymmetric LVH</span>
                </div>
                <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">📄 View Echo Report</button>
              </div>
            </div>
            <div className="mt-1 text-xs text-slate-400 font-mono">10:30 AM</div>
          </div>
        </div>
      </div>
    </>
  );
}

function PharmacyChat() {
  return (
    <>
      <div className="bg-white border-b border-slate-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-lg">⚕️</div>
            <div>
              <div className="text-sm font-semibold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans' }}>Al Shifa Pharmacy</div>
              <div className="text-xs text-slate-500">Pharmacy · Al Barsha, Dubai · CeenAiX ePrescription ✅</div>
            </div>
          </div>
          <button className="px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-2">
            <FileText className="w-4 h-4" />View Prescriptions
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="flex gap-3">
          <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm flex-shrink-0">⚕️</div>
          <div className="w-full">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <span className="text-[10px] uppercase tracking-wide text-amber-700 font-semibold">PRESCRIPTION QUERY</span>
              </div>

              <div className="bg-white rounded-lg p-3 space-y-1 text-sm">
                <div className="font-semibold text-slate-900">Parnia Yazdkhasti — PT-001</div>
                <div className="text-slate-700">Rx: Atorvastatin 20mg — Lipitor brand</div>
                <div className="text-xs text-slate-500 font-mono">DHA Ref: RX-20260407-002847</div>
              </div>

              <p className="text-sm text-slate-700">Dr. Ahmed, Atorvastatin 20mg brand (Lipitor, AED 48) is currently out of stock at our branch. Generic Atorvastatin 20mg (AED 12) is available and bioequivalent. As per DHA substitution policy, can we substitute? Please confirm.</p>

              <div className="flex gap-2 pt-2">
                <button className="flex-1 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors text-sm">
                  ✅ Allow Generic Substitution
                </button>
                <button className="flex-1 px-4 py-2.5 bg-white hover:bg-red-50 border-2 border-red-200 text-red-700 rounded-lg font-medium transition-colors text-sm">
                  ❌ Brand Only
                </button>
              </div>
            </div>
            <div className="mt-1 text-xs text-slate-400 font-mono">1:15 PM</div>
          </div>
        </div>
      </div>
    </>
  );
}

function EmptyChat() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center space-y-4">
        <MessageSquare className="w-16 h-16 text-slate-200 mx-auto" />
        <div>
          <div className="text-lg font-semibold text-slate-400" style={{ fontFamily: 'Plus Jakarta Sans' }}>Select a conversation</div>
          <div className="text-sm text-slate-400">Choose from your conversations on the left</div>
        </div>
        <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto">
          <PenSquare className="w-4 h-4" />New Message
        </button>
      </div>
    </div>
  );
}

function ParniaContext() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <h3 className="text-sm font-bold text-slate-700" style={{ fontFamily: 'Plus Jakarta Sans' }}>Patient Context</h3>
        <button className="text-xs text-teal-600 hover:text-teal-700 font-medium">👤 Open Full Record</button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-white flex items-center justify-center text-sm font-bold relative">
            PY
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans' }}>Parnia Yazdkhasti</div>
            <div className="text-xs text-slate-500 font-mono">38F · A+ · PT-001</div>
            <div className="text-xs text-emerald-600 flex items-center gap-1"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />Online now</div>
          </div>
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-[10px] font-bold">🔵 MEDIUM</span>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-1">
          <div className="text-[9px] uppercase tracking-wide font-semibold text-red-600">ALLERGIES</div>
          <div className="text-xs font-bold text-red-700">⚠️ Penicillin — SEVERE</div>
          <div className="text-xs text-amber-700">⚠️ Sulfa drugs — moderate</div>
        </div>

        <div>
          <div className="text-[9px] uppercase tracking-wide font-semibold text-slate-400 mb-1.5">CONDITIONS</div>
          <div className="space-y-1 text-xs text-slate-700">
            <div>• Hypertension — I10 (controlled ✅)</div>
            <div>• CAC Score 42 (mild ⚠️)</div>
            <div className="italic text-slate-500">• T2 Diabetes (Dr. Fatima)</div>
          </div>
        </div>

        <div>
          <div className="text-[9px] uppercase tracking-wide font-semibold text-slate-400 mb-1.5">MEDICATIONS</div>
          <div className="space-y-1 text-xs text-slate-600 font-mono">
            <div>💊 Atorvastatin 20mg</div>
            <div>💊 Amlodipine 5mg</div>
            <div className="italic text-slate-400">💊 Metformin 850mg (Dr. Fatima)</div>
          </div>
        </div>

        <div>
          <div className="text-[9px] uppercase tracking-wide font-semibold text-slate-400 mb-1.5">LATEST VITALS</div>
          <div className="text-xs font-mono text-emerald-600 font-semibold">BP: 128/82 ✅</div>
          <div className="text-xs font-mono text-slate-500">HR: 72 · Wt: 68kg</div>
          <div className="text-[10px] font-mono text-slate-300">Recorded: Today 9:30 AM</div>
        </div>

        <div>
          <div className="text-[9px] uppercase tracking-wide font-semibold text-slate-400 mb-1.5">RECENT LABS — Mar 2026</div>
          <div className="flex gap-2 text-xs font-mono">
            <span className="text-amber-600">HbA1c: 6.8% ⚠️</span>
            <span className="text-emerald-600">LDL: 118 ✅</span>
            <span className="text-amber-600">Vit D: 22 ↓ ⚠️</span>
          </div>
          <button className="text-xs text-teal-600 hover:text-teal-700 font-medium mt-1">View All Labs →</button>
        </div>

        <div>
          <div className="text-[9px] uppercase tracking-wide font-semibold text-slate-400 mb-1.5">APPOINTMENTS</div>
          <div className="text-xs space-y-1">
            <div className="text-emerald-600">Last: Today ✅ · Completed</div>
            <div className="text-teal-600">Next: Apr 15, 2026 · 10:30 AM</div>
          </div>
          <button className="text-xs text-teal-600 hover:text-teal-700 font-medium mt-1">📅 Book Appointment</button>
        </div>

        <div>
          <div className="text-[9px] uppercase tracking-wide font-semibold text-slate-400 mb-1.5">SHARED FILES</div>
          <button className="text-xs text-slate-600 hover:text-slate-900">📊 Lab Result Card (sent 14 Mar) — [View]</button>
        </div>

        <div className="space-y-2 pt-3 border-t border-slate-200">
          <button className="w-full px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2">
            <Pill className="w-3.5 h-3.5" />Write Prescription
          </button>
          <button className="w-full px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2">
            <TestTube className="w-3.5 h-3.5" />Order Lab
          </button>
          <button className="w-full px-3 py-2 bg-teal-100 hover:bg-teal-200 text-teal-700 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2">
            <Calendar className="w-3.5 h-3.5" />Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
}

function ColleagueContext() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <h3 className="text-sm font-bold text-slate-700" style={{ fontFamily: 'Plus Jakarta Sans' }}>Colleague Info</h3>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 text-white flex items-center justify-center text-sm font-bold">SK</div>
          <div>
            <div className="text-sm font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans' }}>Dr. Sarah Al Khateeb</div>
            <div className="text-xs text-slate-500">Cardiologist</div>
            <div className="text-xs text-slate-500">Al Zahra Hospital</div>
          </div>
        </div>
        <div className="text-xs text-emerald-600">Dubai Health Authority — Licensed ✅</div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="text-[9px] uppercase tracking-wide font-semibold text-blue-600 mb-2">REFERRAL IN THIS THREAD</div>
          <div className="text-xs font-semibold text-slate-900 mb-1">📎 Mahmoud Siddiq referral</div>
          <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">View Referral Details</button>
        </div>
        <div>
          <div className="text-[9px] uppercase tracking-wide font-semibold text-slate-400 mb-1.5">SHARED DOCUMENTS</div>
          <div className="space-y-1 text-xs text-slate-600">
            <button className="hover:text-slate-900">Echo Report — Mahmoud Siddiq [View]</button>
            <button className="hover:text-slate-900 block">Referral Letter [View]</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PharmacyContext() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <h3 className="text-sm font-bold text-slate-700" style={{ fontFamily: 'Plus Jakarta Sans' }}>Pharmacy Info</h3>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-lg">⚕️</div>
          <div>
            <div className="text-sm font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans' }}>Al Shifa Pharmacy</div>
            <div className="text-xs text-slate-500">Al Barsha, Dubai</div>
          </div>
        </div>
        <div className="text-xs text-emerald-600">DHA Licensed ✅</div>
        <div className="text-xs text-emerald-600">CeenAiX ePrescription: Connected ✅</div>
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
          <div className="text-[9px] uppercase tracking-wide font-semibold text-teal-600 mb-2">PRESCRIPTION IN THIS THREAD</div>
          <div className="text-xs text-slate-700 mb-1">Parnia Yazdkhasti — 2 Rx sent today</div>
          <div className="flex gap-2">
            <button className="text-xs text-teal-600 hover:text-teal-700 font-medium">View Prescription</button>
            <span className="text-slate-300">|</span>
            <button className="text-xs text-teal-600 hover:text-teal-700 font-medium">Track Status</button>
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="text-[9px] uppercase tracking-wide font-semibold text-amber-600 mb-1">PENDING QUERY</div>
          <div className="text-xs text-amber-700">⚠️ Atorvastatin substitution query — awaiting response</div>
        </div>
      </div>
    </div>
  );
}

function LabContext() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <h3 className="text-sm font-bold text-slate-700" style={{ fontFamily: 'Plus Jakarta Sans' }}>Laboratory Info</h3>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-lg">🧪</div>
          <div>
            <div className="text-sm font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans' }}>Dubai Medical Laboratory</div>
            <div className="text-xs text-slate-500">Healthcare City</div>
          </div>
        </div>
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-3 space-y-2">
          <div className="text-[9px] uppercase tracking-wide font-semibold text-red-600">CRITICAL RESULT</div>
          <div className="text-xs font-bold text-red-700 animate-pulse">🔴 CRITICAL RESULT UNACKNOWLEDGED</div>
          <div className="text-xs text-slate-700">Patient: Abdullah Hassan | PT-005</div>
          <div className="text-xs text-red-600">In ED now</div>
          <button className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-colors">
            ✅ Acknowledge
          </button>
        </div>
        <div>
          <div className="text-[9px] uppercase tracking-wide font-semibold text-slate-400 mb-1.5">ORDERS IN PROGRESS</div>
          <div className="text-xs text-slate-700 space-y-1">
            <div>Mohammed Al Shamsi — 4 tests pending</div>
            <div className="text-slate-500">Expected: ~5 PM today</div>
          </div>
          <button className="text-xs text-blue-600 hover:text-blue-700 font-medium mt-1">Track Order Status</button>
        </div>
      </div>
    </div>
  );
}

function VideoCallModal({ onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans' }}>Video Consultation</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-white flex items-center justify-center text-xl font-bold relative">
              PY
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white" />
            </div>
            <div>
              <div className="font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans' }}>Parnia Yazdkhasti — Online now ✅</div>
              <div className="text-sm text-slate-500">CeenAiX App v2.4.1 · Dubai, UAE</div>
              <div className="text-sm text-emerald-600 font-medium">Video call ready</div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm">
            <div className="font-semibold text-slate-700">PRE-CALL CHECKLIST:</div>
            <div className="text-emerald-600">✅ Patient is online</div>
            <div className="text-emerald-600">✅ Camera available (browser permissions OK)</div>
            <div className="text-emerald-600">✅ Microphone available</div>
            <div className="text-emerald-600">✅ DHA compliance: calls are NOT recorded</div>
            <div className="text-emerald-600">✅ Conversation logged to PT-001 record</div>
          </div>

          <div className="space-y-2">
            <div className="font-semibold text-slate-700 text-sm">CALL TYPE:</div>
            <label className="flex items-center gap-2 p-3 bg-teal-50 border-2 border-teal-500 rounded-lg cursor-pointer">
              <input type="radio" name="callType" defaultChecked className="text-teal-600" />
              <span className="text-sm font-medium text-slate-900">Standard video consultation (AED 300)</span>
            </label>
            <label className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer">
              <input type="radio" name="callType" className="text-teal-600" />
              <span className="text-sm text-slate-700">Follow-up call (brief, AED 200)</span>
            </label>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
            AED 300 will be charged to Parnia's Daman Gold. Co-pay: AED 30 (10%)
          </div>

          <button className="w-full px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
            <Video className="w-5 h-5" />
            Start Video Call
          </button>
        </div>
      </div>
    </div>
  );
}

function ClinicalContextPicker({ onClose }: any) {
  const [activeTab, setActiveTab] = useState('labs');

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-white flex items-center justify-center text-xs font-bold">PY</div>
            <div>
              <h2 className="text-lg font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans' }}>Attach Clinical Context</h2>
              <p className="text-xs text-slate-500">Share Parnia's health data directly in this message</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="border-b border-slate-200">
          <div className="flex gap-2 px-6 pt-4">
            {[
              { id: 'labs', label: 'Lab Results' },
              { id: 'rx', label: 'Prescriptions' },
              { id: 'appt', label: 'Appointments' },
              { id: 'docs', label: 'Documents' }
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === tab.id ? 'bg-teal-50 text-teal-700 border-b-2 border-teal-600' : 'text-slate-600 hover:text-slate-900'}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
          {activeTab === 'labs' && (
            <>
              <div className="text-sm font-medium text-slate-700 mb-3">Select lab result to share:</div>
              <label className="flex items-start gap-3 p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer">
                <input type="checkbox" className="mt-1 text-teal-600" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-900">HbA1c 6.8% — Mar 2026</div>
                  <div className="text-xs text-amber-600">⚠️ Abnormal</div>
                </div>
              </label>
              <label className="flex items-start gap-3 p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer">
                <input type="checkbox" className="mt-1 text-teal-600" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-900">LDL 118 mg/dL — Mar 2026</div>
                  <div className="text-xs text-emerald-600">✅ Normal</div>
                </div>
              </label>
              <label className="flex items-start gap-3 p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer">
                <input type="checkbox" className="mt-1 text-teal-600" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-900">Full Panel Mar 2026</div>
                  <div className="text-xs text-slate-500">[Select all 10 values]</div>
                </div>
              </label>
            </>
          )}
        </div>

        <div className="p-4 bg-amber-50 border-t border-amber-200">
          <div className="flex items-start gap-2 text-xs text-amber-700">
            <span>⚠️</span>
            <p>Doctor-only private notes will NEVER be shared — they are excluded from all attachments.</p>
          </div>
        </div>

        <div className="p-6 border-t border-slate-200">
          <button className="w-full px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition-colors">
            Attach Selected
          </button>
        </div>
      </div>
    </div>
  );
}
