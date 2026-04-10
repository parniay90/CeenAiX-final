import { useState, useEffect, useRef } from 'react';
import { User, Phone, CreditCard, AlertTriangle, AlertOctagon, Calendar, Shield, Stethoscope, Download, Share2, CreditCard as Edit2, Save, X, Check, Heart, FlaskConical, Clock, Bell, ShieldCheck, Pill, PenLine, ChevronDown, ChevronRight, MessageSquare, Camera, Lock, Eye, Copy, ExternalLink, Activity, FileText, RefreshCw } from 'lucide-react';
import PatientSidebar from '../components/patient/PatientSidebar';
import { ToastContainer, useToast } from '../components/common/Toast';

function navigate(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

type Tab = 'profile' | 'health' | 'privacy';

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${checked ? 'bg-teal-500' : 'bg-slate-200'}`}
    >
      <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4.5' : 'translate-x-0.5'}`} style={{ transform: checked ? 'translateX(18px)' : 'translateX(2px)' }} />
    </button>
  );
}

function SectionHeader({ icon: Icon, iconBg, iconColor, title, subtitle, onEdit, editLabel = 'Edit', readOnly = false }: {
  icon: React.ElementType; iconBg: string; iconColor: string; title: string; subtitle?: string;
  onEdit?: () => void; editLabel?: string; readOnly?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg} shrink-0`}>
        <Icon size={18} className={iconColor} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-slate-800" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 16 }}>{title}</div>
        {subtitle && <div className="text-xs text-slate-400 mt-0.5">{subtitle}</div>}
      </div>
      {readOnly && (
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <Lock size={11} /> Managed by doctor
        </div>
      )}
      {onEdit && !readOnly && (
        <button onClick={onEdit} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-medium transition-colors">
          <Edit2 size={12} /> {editLabel}
        </button>
      )}
    </div>
  );
}

function FieldRow({ label, value, mono = false }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="py-3 border-b border-slate-50 last:border-0">
      <div className="text-xs uppercase tracking-wider text-slate-400 mb-1" style={{ fontSize: 10 }}>{label}</div>
      <div className={`text-slate-900 ${mono ? 'font-mono text-sm' : 'text-sm'}`} style={mono ? { fontFamily: 'DM Mono, monospace' } : {}}>
        {value}
      </div>
    </div>
  );
}

export default function PatientProfile() {
  const [tab, setTab] = useState<Tab>('profile');
  const [completeness, setCompleteness] = useState(0);
  const [editPersonal, setEditPersonal] = useState(false);
  const [editContact, setEditContact] = useState(false);
  const [editEmergency, setEditEmergency] = useState(false);
  const [editAbout, setEditAbout] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAccountActions, setShowAccountActions] = useState(false);
  const [revealId, setRevealId] = useState(false);
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);
  const [showPhotoHover, setShowPhotoHover] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toasts, dismiss, addToast } = useToast();

  const [notifPrefs, setNotifPrefs] = useState({
    appointments: true, labResults: true, prescription: true,
    doctorMessage: true, aiInsights: true, insurance: true,
    refill: true, updates: false,
  });
  const [nabidh, setNabidh] = useState({ sharing: true, emergency: true, research: true });

  useEffect(() => {
    const timer = setTimeout(() => setCompleteness(84), 300);
    return () => clearTimeout(timer);
  }, []);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setPhotoSrc(ev.target?.result as string);
      addToast('success', 'Profile photo updated');
    };
    reader.readAsDataURL(file);
  }

  function saveSection(msg: string) {
    setEditPersonal(false);
    setEditContact(false);
    setEditEmergency(false);
    setEditAbout(false);
    addToast('success', msg);
  }

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'health', label: 'My Health', icon: Heart },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: '#F8FAFC' }}>
      <PatientSidebar currentPage="profile" />

      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Page Header */}
        <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-9 h-9 rounded-xl bg-teal-100 flex items-center justify-center">
              <User size={18} className="text-teal-700" />
            </div>
            <div>
              <div className="font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 22 }}>My Profile</div>
              <div className="text-xs text-slate-400" style={{ fontFamily: 'Inter, sans-serif' }}>Parnia Yazdkhasti · <span style={{ fontFamily: 'DM Mono, monospace' }}>PT-001</span></div>
            </div>
          </div>
          <button onClick={() => setShowDownloadModal(true)} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-colors">
            <Download size={15} /> Download Health Summary
          </button>
          <button onClick={() => setShowShareModal(true)} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-colors">
            <Share2 size={15} /> Share Emergency Profile
          </button>
        </div>

        <div className="flex-1 p-8 space-y-4">

          {/* HERO CARD */}
          <div className="rounded-2xl overflow-hidden shadow-sm" style={{ background: 'linear-gradient(135deg, #0F172A 60%, #0D9488 100%)', height: 160 }}>
            <div className="h-full flex items-center justify-between px-8">
              <div className="flex items-center gap-5">
                <div
                  className="relative cursor-pointer"
                  onMouseEnter={() => setShowPhotoHover(true)}
                  onMouseLeave={() => setShowPhotoHover(false)}
                  onClick={() => fileRef.current?.click()}
                >
                  <div className="w-20 h-20 rounded-full overflow-hidden" style={{ background: 'linear-gradient(135deg, #0D9488, #1E293B)', border: '3px solid rgba(255,255,255,0.2)' }}>
                    {photoSrc ? (
                      <img src={photoSrc} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white font-bold" style={{ fontSize: 28, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                        PY
                      </div>
                    )}
                  </div>
                  {showPhotoHover && (
                    <div className="absolute inset-0 rounded-full flex flex-col items-center justify-center" style={{ background: 'rgba(0,0,0,0.55)' }}>
                      <Camera size={16} className="text-white" />
                      <span className="text-white text-[10px] mt-0.5">Change</span>
                    </div>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                </div>
                <div>
                  <div className="text-white font-bold" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 22 }}>Parnia Yazdkhasti</div>
                  <div className="text-white/70 text-sm mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>بارنيا يزدخاستي</div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded-full text-teal-200 font-bold" style={{ fontSize: 10, background: 'rgba(13,148,136,0.35)' }}>PT-001</span>
                    <span className="px-2 py-0.5 rounded-full text-white" style={{ fontSize: 10, background: 'rgba(51,65,85,0.5)' }}>Iranian</span>
                    <span className="px-2 py-0.5 rounded-full text-white font-bold" style={{ fontSize: 10, background: 'rgba(220,38,38,0.5)' }}>A+</span>
                    <span className="px-2 py-0.5 rounded-full text-white" style={{ fontSize: 10, background: 'rgba(37,99,235,0.5)' }}>Daman Gold</span>
                    <span className="px-2 py-0.5 rounded-full text-white font-bold" style={{ fontSize: 10, background: 'rgba(220,38,38,0.7)' }}>2 Allergies</span>
                  </div>
                  <div className="mt-2 text-white/40" style={{ fontFamily: 'DM Mono, monospace', fontSize: 11 }}>Member since January 2024 · 38 years old</div>
                </div>
              </div>

              <div className="hidden lg:flex gap-3">
                {[
                  { val: '12', label: 'Appointments', color: 'text-white' },
                  { val: '4', label: 'Active Rx', color: 'text-teal-300' },
                  { val: '24', label: 'Lab Results', color: 'text-white/70' },
                  { val: '34', label: 'AI Chats', color: 'text-violet-300' },
                ].map(s => (
                  <div key={s.label} className="flex flex-col items-center justify-center rounded-xl px-5 py-3" style={{ background: 'rgba(255,255,255,0.1)', minWidth: 80 }}>
                    <div className={`font-bold ${s.color}`} style={{ fontFamily: 'DM Mono, monospace', fontSize: 22 }}>{s.val}</div>
                    <div className="text-white/50 text-center mt-0.5" style={{ fontSize: 11 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ALLERGY ALERT STRIP */}
          <div className="rounded-xl border border-red-200 flex items-center gap-4 px-5 py-3" style={{ background: '#FEF2F2' }}>
            <AlertTriangle size={20} className="text-red-600 animate-pulse shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-bold text-red-700 uppercase tracking-wider" style={{ fontSize: 11 }}>Drug Allergies — Critical Safety Information</div>
              <div className="flex flex-wrap gap-2 mt-1.5">
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-white font-bold" style={{ fontSize: 11, background: '#DC2626' }}>
                  Penicillin — SEVERE ANAPHYLAXIS
                </span>
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-red-700 font-medium" style={{ fontSize: 11, background: '#FEE2E2', border: '1px solid #FCA5A5' }}>
                  Sulfa drugs — MODERATE
                </span>
              </div>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg text-xs font-medium transition-colors shrink-0">
              <Edit2 size={11} /> Edit Allergies
            </button>
          </div>

          {/* COMPLETENESS BAR */}
          <div className="bg-white rounded-xl border border-slate-100 px-6 py-3 flex items-center gap-4 shadow-sm">
            <span className="text-sm text-slate-600 shrink-0">Profile Complete:</span>
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${completeness}%`, background: 'linear-gradient(90deg, #0D9488, #14B8A6)' }}
              />
            </div>
            <div className="shrink-0">
              <span className="font-bold text-teal-600" style={{ fontFamily: 'DM Mono, monospace', fontSize: 14 }}>{completeness}%</span>
              <div className="text-xs text-teal-500 italic">+ Add Arabic bio to reach 89%</div>
            </div>
          </div>

          {/* TABS */}
          <div className="flex gap-0 border-b border-slate-200 bg-white rounded-t-xl px-2 pt-2">
            {tabs.map(t => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${
                    tab === t.id
                      ? 'text-teal-600 border-teal-500 font-bold'
                      : 'text-slate-500 border-transparent hover:text-slate-700'
                  }`}
                >
                  <Icon size={16} />
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* TAB CONTENT */}
          <div className="transition-opacity duration-150">
            {tab === 'profile' && <Tab1Profile editPersonal={editPersonal} setEditPersonal={setEditPersonal} editContact={editContact} setEditContact={setEditContact} editEmergency={editEmergency} setEditEmergency={setEditEmergency} editAbout={editAbout} setEditAbout={setEditAbout} revealId={revealId} setRevealId={setRevealId} saveSection={saveSection} />}
            {tab === 'health' && <Tab2Health />}
            {tab === 'privacy' && <Tab3Privacy nabidh={nabidh} setNabidh={setNabidh} notifPrefs={notifPrefs} setNotifPrefs={setNotifPrefs} showAccountActions={showAccountActions} setShowAccountActions={setShowAccountActions} addToast={addToast} />}
          </div>
        </div>
      </div>

      {/* DOWNLOAD MODAL */}
      {showDownloadModal && <DownloadModal onClose={() => setShowDownloadModal(false)} addToast={addToast} />}
      {showShareModal && <ShareModal onClose={() => setShowShareModal(false)} addToast={addToast} />}

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}

/* ─────────────────── TAB 1: MY PROFILE ─────────────────── */
function Tab1Profile({ editPersonal, setEditPersonal, editContact, setEditContact, editEmergency, setEditEmergency, editAbout, setEditAbout, revealId, setRevealId, saveSection }: {
  editPersonal: boolean; setEditPersonal: (v: boolean) => void;
  editContact: boolean; setEditContact: (v: boolean) => void;
  editEmergency: boolean; setEditEmergency: (v: boolean) => void;
  editAbout: boolean; setEditAbout: (v: boolean) => void;
  revealId: boolean; setRevealId: (v: boolean) => void;
  saveSection: (msg: string) => void;
}) {
  return (
    <div className="grid grid-cols-5 gap-5">
      {/* LEFT 60% */}
      <div className="col-span-3 space-y-4">
        {/* PERSONAL INFO */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <SectionHeader icon={User} iconBg="bg-teal-100" iconColor="text-teal-600" title="Personal Information" onEdit={() => setEditPersonal(!editPersonal)} />
          {!editPersonal ? (
            <div className="grid grid-cols-2 gap-x-6">
              <FieldRow label="Full Name (EN)" value="Parnia Yazdkhasti" />
              <FieldRow label="Full Name (AR)" value="بارنيا يزدخاستي" />
              <FieldRow label="Date of Birth" value="22 March 1988 (38 years)" />
              <FieldRow label="Gender" value="Female" />
              <div className="py-3 border-b border-slate-50">
                <div className="text-xs uppercase tracking-wider text-slate-400 mb-1" style={{ fontSize: 10 }}>Blood Group</div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-red-600" style={{ fontFamily: 'DM Mono, monospace', fontSize: 18 }}>A+</span>
                  <span className="text-xs italic text-slate-400">Cannot be changed — requires clinical verification</span>
                </div>
              </div>
              <FieldRow label="Nationality" value="🇮🇷 Iranian" />
              <div className="col-span-2 py-3">
                <div className="text-xs uppercase tracking-wider text-slate-400 mb-2" style={{ fontSize: 10 }}>Languages</div>
                <div className="flex flex-wrap gap-2">
                  {['🇮🇷 Farsi (Native)', '🇬🇧 English (Fluent)', '🇦🇪 Arabic (Basic)'].map(l => (
                    <span key={l} className="flex items-center gap-1 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium border border-teal-100">
                      {l}
                    </span>
                  ))}
                  <button className="px-3 py-1 bg-slate-50 text-slate-400 rounded-full text-xs border border-slate-200 hover:border-teal-300 hover:text-teal-600 transition-colors">
                    + Add Language
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {[['Full Name (EN)', 'Parnia Yazdkhasti'], ['Full Name (AR)', 'بارنيا يزدخاستي'], ['Nationality', 'Iranian']].map(([label, val]) => (
                  <div key={label}>
                    <label className="block text-xs text-slate-400 mb-1">{label}</label>
                    <input defaultValue={val} className="w-full h-11 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                  </div>
                ))}
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => saveSection('Personal information updated')} className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors">
                  <Save size={14} /> Save
                </button>
                <button onClick={() => setEditPersonal(false)} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm hover:bg-slate-200 transition-colors">Cancel</button>
              </div>
            </div>
          )}
        </div>

        {/* CONTACT INFO */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <SectionHeader icon={Phone} iconBg="bg-teal-100" iconColor="text-teal-600" title="Contact Information" onEdit={() => setEditContact(!editContact)} />
          {!editContact ? (
            <>
              <FieldRow label="Mobile" value="+971 55 XXX XXXX" mono />
              <FieldRow label="Email" value="parnia.yazdkhasti@email.com" />
              <FieldRow label="Address" value="Dilan Tower, Al Jadaf, Dubai, UAE" />
              <div className="mt-4 p-3 rounded-xl bg-slate-50 flex items-start gap-2">
                <Lock size={13} className="text-slate-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-400">Your contact info is only shared with your care team and used for appointment reminders.</p>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              {[['Mobile', '+971 55 XXX XXXX'], ['Email', 'parnia.yazdkhasti@email.com'], ['Address', 'Dilan Tower, Al Jadaf, Dubai, UAE']].map(([label, val]) => (
                <div key={label}>
                  <label className="block text-xs text-slate-400 mb-1">{label}</label>
                  <input defaultValue={val} className="w-full h-11 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <button onClick={() => saveSection('Contact details saved')} className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors">
                  <Save size={14} /> Save
                </button>
                <button onClick={() => setEditContact(false)} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm hover:bg-slate-200 transition-colors">Cancel</button>
              </div>
            </div>
          )}
        </div>

        {/* IDENTITY DOCUMENTS */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <SectionHeader icon={CreditCard} iconBg="bg-teal-100" iconColor="text-teal-600" title="Identity Documents" />
          <div className="py-3 border-b border-slate-50">
            <div className="text-xs uppercase tracking-wider text-slate-400 mb-2" style={{ fontSize: 10 }}>Emirates ID</div>
            <div className="flex items-center gap-3">
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 14 }} className="text-slate-900">
                {revealId ? '784-1988-7812345-6' : '784-1988-●●●●●●●-●'}
              </span>
              <button onClick={() => setRevealId(!revealId)} className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-800 transition-colors">
                <Eye size={12} /> {revealId ? 'Hide' : 'Reveal 30s'}
              </button>
              <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
                <Check size={10} /> Verified
              </span>
            </div>
          </div>
          <div className="py-3 border-b border-slate-50">
            <div className="text-xs uppercase tracking-wider text-slate-400 mb-1" style={{ fontSize: 10 }}>Passport</div>
            <div className="flex items-center gap-2">
              <span className="text-sm italic text-slate-400">Not added</span>
              <button className="text-xs text-teal-600 hover:text-teal-800 transition-colors">+ Add Passport</button>
            </div>
          </div>
          <div className="py-3">
            <div className="text-xs uppercase tracking-wider text-slate-400 mb-1" style={{ fontSize: 10 }}>Residency Visa</div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-emerald-600">UAE Resident — Visa valid</span>
              <button className="text-xs text-teal-600 hover:text-teal-800">View</button>
            </div>
          </div>
        </div>

        {/* EMERGENCY CONTACT */}
        <div className="bg-white rounded-2xl shadow-sm border-l-4 border-l-amber-400 border border-slate-100 p-6">
          <SectionHeader icon={AlertTriangle} iconBg="bg-amber-100" iconColor="text-amber-600" title="Emergency Contact" subtitle="Used if you are incapacitated or unresponsive" onEdit={() => setEditEmergency(!editEmergency)} />
          {!editEmergency ? (
            <>
              <div className="space-y-2 mb-4">
                <FieldRow label="Name" value={<span className="font-semibold">Pedram Vaziri</span>} />
                <FieldRow label="Relationship" value="Colleague (Emergency proxy)" />
                <FieldRow label="Mobile" value="+971 50 XXX XXXX" mono />
                <FieldRow label="Email" value="pedram@aryaix.com" />
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-emerald-700 font-medium">Emergency health access enabled</span>
                </div>
                <div className="text-xs text-emerald-600 mb-2">In an emergency, this person can access your blood group, allergies, and current medications.</div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Toggle checked={true} onChange={() => {}} />
                  <span className="text-xs text-slate-600">Allow emergency record access</span>
                </label>
              </div>
              <button className="text-xs text-teal-600 hover:text-teal-800 transition-colors">+ Add Second Emergency Contact</button>
            </>
          ) : (
            <div className="space-y-3">
              {[['Name', 'Pedram Vaziri'], ['Relationship', 'Colleague (Emergency proxy)'], ['Mobile', '+971 50 XXX XXXX'], ['Email', 'pedram@aryaix.com']].map(([label, val]) => (
                <div key={label}>
                  <label className="block text-xs text-slate-400 mb-1">{label}</label>
                  <input defaultValue={val} className="w-full h-11 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <button onClick={() => saveSection('Emergency contact updated')} className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors">
                  <Save size={14} /> Save
                </button>
                <button onClick={() => setEditEmergency(false)} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm hover:bg-slate-200 transition-colors">Cancel</button>
              </div>
            </div>
          )}
        </div>

        {/* ABOUT ME */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <SectionHeader icon={PenLine} iconBg="bg-teal-100" iconColor="text-teal-600" title="About Me" onEdit={() => setEditAbout(!editAbout)} />
          <p className="text-sm text-slate-400 italic mb-3">Share anything relevant about yourself with your care team — lifestyle, preferences, concerns.</p>
          {!editAbout ? (
            <>
              <p className="text-sm text-slate-700 leading-relaxed mb-4">
                CEO of AryAiX LLC · Based in Dubai · Iranian heritage. I'm managing hypertension and pre-diabetes with medication and lifestyle changes.
              </p>
              <div className="border-t border-slate-100 pt-4 space-y-2">
                <div className="text-xs uppercase tracking-wider text-slate-400 mb-2" style={{ fontSize: 10 }}>Health Preferences</div>
                {[
                  ['Preferred consultation language', 'English'],
                  ['Preferred appointment time', 'Morning (9AM–12PM)'],
                  ['Communication preference', 'App + Email'],
                  ['Gender preference for doctor', 'No preference'],
                ].map(([label, val]) => (
                  <div key={label} className="flex items-center justify-between py-1.5">
                    <span className="text-xs text-slate-500">{label}</span>
                    <span className="text-xs font-medium text-slate-700">{val}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <textarea
                defaultValue="CEO of AryAiX LLC · Based in Dubai · Iranian heritage. I'm managing hypertension and pre-diabetes with medication and lifestyle changes."
                rows={4}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              />
              <div className="flex gap-2 pt-1">
                <button onClick={() => saveSection('About me saved')} className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors">
                  <Save size={14} /> Save
                </button>
                <button onClick={() => setEditAbout(false)} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm hover:bg-slate-200 transition-colors">Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT 40% */}
      <div className="col-span-2 space-y-4">
        {/* INSURANCE */}
        <InsuranceCard />

        {/* CARE TEAM */}
        <CareTeamCard />

        {/* UPCOMING APPOINTMENTS */}
        <UpcomingApptsCard />
      </div>
    </div>
  );
}

function InsuranceCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border-l-4 border-l-blue-500 border border-slate-100 p-6">
      <SectionHeader icon={Shield} iconBg="bg-blue-100" iconColor="text-blue-600" title="Insurance" onEdit={() => {}} />
      <div className="rounded-xl overflow-hidden mb-4" style={{ background: 'linear-gradient(135deg, #1E3A5F, #1D4ED8)', padding: 20, minHeight: 120 }}>
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-white" style={{ fontSize: 13 }}>Daman National Health Insurance</span>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-white text-sm">D</div>
        </div>
        <div className="text-white font-bold uppercase tracking-wider mb-1" style={{ fontFamily: 'DM Mono, monospace', fontSize: 13 }}>PARNIA YAZDKHASTI</div>
        <div className="text-white/70 mb-2" style={{ fontFamily: 'DM Mono, monospace', fontSize: 11 }}>DAM-IND-PT001-2024</div>
        <div className="flex items-center justify-between">
          <span className="text-white/60" style={{ fontFamily: 'DM Mono, monospace', fontSize: 10 }}>DAM-2024-IND-047821</span>
          <div className="text-right">
            <div className="text-white/80 font-bold text-xs">Daman Gold</div>
            <div className="text-white/50 text-xs">Valid: 31 Dec 2026</div>
          </div>
        </div>
      </div>
      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between items-center">
          <span className="text-slate-500">Plan</span>
          <span className="font-medium text-slate-800">Daman Gold — Individual</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-500">Status</span>
          <span className="flex items-center gap-1 text-emerald-600 font-medium text-xs px-2 py-0.5 bg-emerald-50 rounded-full"><Check size={10} /> Active</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-500">Valid</span>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12 }} className="text-slate-700">1 Jan 2026 – 31 Dec 2026</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-500">Co-pay</span>
          <span className="font-bold text-teal-600" style={{ fontFamily: 'DM Mono, monospace', fontSize: 14 }}>10%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-500">Annual Limit</span>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 13 }} className="font-semibold text-slate-700">AED 500,000</span>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-slate-400">Used this year:</span>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11 }} className="text-slate-600">AED 12,400 / 500,000</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-1">
          <div className="h-full rounded-full bg-teal-500" style={{ width: '2.5%' }} />
        </div>
        <div className="text-xs text-emerald-600 font-medium" style={{ fontFamily: 'DM Mono, monospace' }}>AED 487,600 remaining</div>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {['Cardiology', 'Radiology', 'Lab Tests', 'Pharmacy', 'Teleconsult', 'Emergency', 'Specialist'].map(s => (
          <span key={s} className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-xs">
            <Check size={9} /> {s}
          </span>
        ))}
      </div>
      <button className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
        <FileText size={14} /> View Full Insurance Card
      </button>
      <button className="mt-2 text-xs text-teal-600 hover:text-teal-800 transition-colors">+ Add Secondary Insurance</button>
    </div>
  );
}

function CareTeamCard() {
  const doctors = [
    { initials: 'AA', gradient: 'linear-gradient(135deg, #0D9488, #0891B2)', name: 'Dr. Ahmed Al Rashidi', spec: 'Cardiologist · Al Noor Medical Center', next: 'Apr 15, 2026', primary: true },
    { initials: 'FA', gradient: 'linear-gradient(135deg, #1D4ED8, #0EA5E9)', name: 'Dr. Fatima Al Mansoori', spec: 'Endocrinologist · Dubai Specialist', next: 'May 3, 2026', primary: false },
    { initials: 'TH', gradient: 'linear-gradient(135deg, #475569, #64748B)', name: 'Dr. Tooraj Helmi', spec: 'GP · AryAiX Health Clinic', next: 'No upcoming', primary: false },
  ];
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <SectionHeader icon={Stethoscope} iconBg="bg-teal-100" iconColor="text-teal-600" title="My Care Team" subtitle="Doctors currently managing your health" />
      <div className="space-y-1">
        {doctors.map(d => (
          <div key={d.name} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-teal-50 cursor-pointer transition-colors group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ background: d.gradient }}>
              {d.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-slate-800 text-sm">{d.name}</div>
              <div className="text-xs text-slate-400">{d.spec}</div>
              <div className="text-xs text-teal-500 font-medium" style={{ fontFamily: 'DM Mono, monospace', fontSize: 10 }}>Next: {d.next}</div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {d.primary && <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold mr-1">Primary</span>}
              <button onClick={() => navigate('/messages')} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-teal-600 transition-colors">
                <MessageSquare size={14} />
              </button>
              <button onClick={() => navigate('/appointments')} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-teal-600 transition-colors">
                <Calendar size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => navigate('/appointments')} className="mt-3 w-full py-2.5 border border-teal-300 text-teal-600 rounded-xl text-sm font-medium hover:bg-teal-50 transition-colors">
        + Find a New Doctor
      </button>
    </div>
  );
}

function UpcomingApptsCard() {
  const appts = [
    { month: 'APR', day: '15', doctor: 'Dr. Ahmed Al Rashidi', spec: 'Cardiology · Al Noor', time: 'In-person · 10:30 AM' },
    { month: 'MAY', day: '3', doctor: 'Dr. Fatima Al Mansoori', spec: 'Endocrinology · DSH', time: 'In-person · 2:00 PM' },
  ];
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-teal-100 flex items-center justify-center shrink-0">
          <Calendar size={18} className="text-teal-600" />
        </div>
        <div className="font-bold text-slate-800 flex-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 16 }}>Upcoming Appointments</div>
        <button onClick={() => navigate('/appointments')} className="text-xs text-teal-600 hover:text-teal-800">View All →</button>
      </div>
      <div className="space-y-3">
        {appts.map(a => (
          <div key={a.day + a.month} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50/30 transition-colors">
            <div className="w-10 h-11 rounded-xl bg-teal-600 flex flex-col items-center justify-center text-white shrink-0">
              <div className="font-bold leading-none" style={{ fontFamily: 'DM Mono, monospace', fontSize: 18 }}>{a.day}</div>
              <div className="text-white/70 leading-none mt-0.5" style={{ fontSize: 8 }}>{a.month}</div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-slate-800 text-sm">{a.doctor}</div>
              <div className="text-xs text-slate-400">{a.spec}</div>
              <div className="text-xs text-teal-500 font-medium mt-0.5" style={{ fontFamily: 'DM Mono, monospace', fontSize: 10 }}>{a.time}</div>
            </div>
            <div className="flex gap-1 shrink-0">
              <button className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs transition-colors">Reschedule</button>
              <button className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg text-xs transition-colors">Cancel</button>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => navigate('/appointments')} className="mt-3 w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium transition-colors">
        + Book New Appointment
      </button>
    </div>
  );
}

/* ─────────────────── TAB 2: MY HEALTH ─────────────────── */
function Tab2Health() {
  return (
    <div className="grid grid-cols-5 gap-5">
      <div className="col-span-3 space-y-4">
        <AllergiesSection />
        <ConditionsSection />
        <MedicationsSection />
      </div>
      <div className="col-span-2 space-y-4">
        <VitalsSection />
        <LabsSection />
        <TimelineSection />
      </div>
    </div>
  );
}

function AllergiesSection() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border-l-4 border-l-red-500 border border-slate-100 p-6">
      <SectionHeader icon={AlertOctagon} iconBg="bg-red-100" iconColor="text-red-600" title="Allergies & Reactions" subtitle="Documented by your care team" readOnly />
      <div className="space-y-3">
        <div className="p-4 rounded-xl border-l-4 border-l-red-500 bg-red-50">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
              <AlertOctagon size={18} className="text-red-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-red-900 text-sm">Penicillin</span>
                <span className="px-2 py-0.5 bg-red-600 text-white rounded-full font-bold" style={{ fontSize: 9 }}>SEVERE</span>
              </div>
              <div className="text-xs text-slate-600 mb-1">Class: Antibiotic · All penicillin-based drugs</div>
              <div className="text-xs text-red-600 italic">Anaphylaxis — requires EpiPen immediately</div>
              <div className="text-xs text-slate-400 mt-1.5" style={{ fontFamily: 'DM Mono, monospace', fontSize: 10 }}>Dr. Ahmed · 12 Jan 2024</div>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl border-l-4 border-l-amber-400 bg-amber-50">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
              <AlertTriangle size={16} className="text-amber-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-amber-900 text-sm">Sulfonamides (Sulfa drugs)</span>
                <span className="px-2 py-0.5 bg-amber-500 text-white rounded-full font-bold" style={{ fontSize: 9 }}>MODERATE</span>
              </div>
              <div className="text-xs text-amber-700 italic">Diffuse rash — oral antihistamines</div>
              <div className="text-xs text-slate-400 mt-1.5" style={{ fontFamily: 'DM Mono, monospace', fontSize: 10 }}>Dr. Ahmed · 12 Jan 2024</div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 p-3 bg-slate-50 rounded-xl">
        <p className="text-xs text-slate-500">Allergy records can only be added or modified by your treating physician. If you have an unreported allergy, please inform your doctor at your next visit.</p>
      </div>
    </div>
  );
}

function ConditionsSection() {
  const conditions = [
    { dot: 'bg-emerald-500', name: 'Hypertension Stage I', icd: 'I10', doc: 'Dr. Ahmed Al Rashidi', note: 'Controlled on Amlodipine', badge: 'Controlled', badgeColor: 'bg-emerald-100 text-emerald-700' },
    { dot: 'bg-amber-400', name: 'Coronary Artery Calcium Score 42', icd: 'I25.10', doc: 'Dr. Ahmed Al Rashidi', note: 'Mild — monitoring every 2 years', badge: 'Monitoring', badgeColor: 'bg-amber-100 text-amber-700' },
    { dot: 'bg-teal-400', name: 'Type 2 Diabetes / Pre-diabetic', icd: 'E11.9', doc: 'Dr. Fatima Al Mansoori', note: 'HbA1c 6.8% — improving from 7.4%', badge: 'Improving ↓', badgeColor: 'bg-teal-100 text-teal-700' },
    { dot: 'bg-amber-400', name: 'Grade I Hepatic Steatosis', icd: 'K76.0', doc: 'Dr. Fatima Al Mansoori', note: 'Mild — diet modification in progress', badge: 'Monitoring', badgeColor: 'bg-amber-100 text-amber-700' },
  ];
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <SectionHeader icon={Activity} iconBg="bg-teal-100" iconColor="text-teal-600" title="Active Conditions" readOnly />
      <div className="space-y-3">
        {conditions.map(c => (
          <div key={c.icd} className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0">
            <div className={`w-3 h-3 rounded-full ${c.dot} shrink-0 mt-1.5`} />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-slate-800 text-sm">{c.name}</div>
              <div className="text-xs text-slate-400 mt-0.5" style={{ fontFamily: 'DM Mono, monospace', fontSize: 10 }}>ICD-10: {c.icd} · {c.doc}</div>
              <div className="text-xs text-slate-500 mt-0.5 italic">{c.note}</div>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${c.badgeColor}`}>{c.badge}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MedicationsSection() {
  const meds = [
    { border: 'border-l-teal-500', icon: 'teal', name: 'Atorvastatin 20mg', brand: 'Lipitor', freq: 'Once nightly', doc: 'Dr. Ahmed · Hyperlipidemia · Active', refill: 'May 7, 2026' },
    { border: 'border-l-teal-500', icon: 'teal', name: 'Amlodipine 5mg', brand: 'Norvasc', freq: 'Once morning', doc: 'Dr. Ahmed · Hypertension · Active', refill: null },
    { border: 'border-l-blue-500', icon: 'blue', name: 'Metformin 850mg', brand: null, freq: 'Twice daily with food', doc: 'Dr. Fatima · T2 Diabetes · Nabidh', refill: null },
    { border: 'border-l-blue-500', icon: 'blue', name: 'Vitamin D3 2000 IU', brand: null, freq: 'Once daily', doc: 'Dr. Fatima · Deficiency · Nabidh', refill: null },
  ];
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center shrink-0"><Pill size={18} className="text-violet-600" /></div>
        <div className="font-bold text-slate-800 flex-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 16 }}>Current Medications</div>
        <button onClick={() => navigate('/medications')} className="text-xs text-teal-600 hover:text-teal-800">View All →</button>
      </div>
      <div className="space-y-2">
        {meds.map(m => (
          <div key={m.name} className={`border-l-4 ${m.border} border border-slate-100 rounded-xl p-3`}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="font-semibold text-slate-800 text-sm">{m.name} {m.brand && <span className="text-slate-400 font-normal italic text-xs">({m.brand})</span>}</div>
                <div className={`text-xs font-medium mt-0.5 ${m.icon === 'teal' ? 'text-teal-600' : 'text-blue-600'}`} style={{ fontFamily: 'DM Mono, monospace' }}>{m.freq}</div>
                <div className="text-xs text-slate-400 mt-0.5">{m.doc}</div>
              </div>
              {m.refill && <div className="text-xs text-amber-500 shrink-0" style={{ fontFamily: 'DM Mono, monospace', fontSize: 10 }}>Refill: {m.refill}</div>}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 p-3 bg-blue-50 rounded-xl flex items-start gap-2">
        <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
        <p className="text-xs text-blue-700">Medications from Dr. Fatima Al Mansoori are synced from the Nabidh national health record.</p>
      </div>
    </div>
  );
}

function VitalsSection() {
  const vitals = [
    { val: '128/82', unit: 'mmHg', label: 'BLOOD PRESSURE', color: 'text-emerald-600', status: '✅ Normal' },
    { val: '72', unit: 'bpm', label: 'HEART RATE', color: 'text-emerald-600', status: '✅ Normal' },
    { val: '68', unit: 'kg', label: 'WEIGHT', color: 'text-slate-700', status: 'BMI 25.0 ✅' },
    { val: '165', unit: 'cm', label: 'HEIGHT', color: 'text-slate-700', status: '' },
    { val: '36.7', unit: '°C', label: 'TEMPERATURE', color: 'text-emerald-600', status: '✅ Normal' },
    { val: '98', unit: '%', label: 'SpO2', color: 'text-emerald-600', status: '✅ Normal' },
  ];
  return (
    <div className="bg-white rounded-2xl shadow-sm border-t-4 border-t-teal-500 border border-slate-100 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-teal-100 flex items-center justify-center shrink-0"><Heart size={18} className="text-teal-600" /></div>
        <div className="flex-1">
          <div className="font-bold text-slate-800" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 16 }}>Latest Vitals</div>
          <div className="text-xs text-slate-400" style={{ fontFamily: 'DM Mono, monospace', fontSize: 11 }}>Today · 7 Apr 2026 · Dr. Ahmed Al Rashidi</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {vitals.map(v => (
          <div key={v.label} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
            <div className={`font-bold ${v.color}`} style={{ fontFamily: 'DM Mono, monospace', fontSize: 18 }}>{v.val}</div>
            <div className="text-xs text-slate-400 mt-0.5" style={{ fontSize: 9 }}>{v.unit} · {v.label}</div>
            {v.status && <div className="text-xs text-emerald-600 mt-0.5" style={{ fontSize: 10 }}>{v.status}</div>}
          </div>
        ))}
      </div>
      <button onClick={() => navigate('/my-health')} className="text-xs text-teal-600 hover:text-teal-800 transition-colors flex items-center gap-1 mx-auto">
        View Vitals History →
      </button>
    </div>
  );
}

function LabsSection() {
  const labs = [
    { name: 'HbA1c', val: '6.8%', color: 'text-amber-600', flag: '⚠️', ref: '<5.7%', note: 'Improving ↓' },
    { name: 'LDL', val: '118 mg/dL', color: 'text-emerald-600', flag: '✅', ref: '<130', note: null },
    { name: 'HDL', val: '52 mg/dL', color: 'text-emerald-600', flag: '✅', ref: '>40', note: null },
    { name: 'Total Chol', val: '189 mg/dL', color: 'text-emerald-600', flag: '✅', ref: '<200', note: null },
    { name: 'Vitamin D', val: '22 ng/mL', color: 'text-amber-600', flag: '⚠️', ref: '30–100', note: null },
    { name: 'CRP', val: '3.2 mg/L', color: 'text-amber-600', flag: '⚠️', ref: '<3.0', note: null },
    { name: 'Creatinine', val: '76 µmol/L', color: 'text-emerald-600', flag: '✅', ref: '44–97', note: null },
    { name: 'TSH', val: '2.1 mIU/L', color: 'text-emerald-600', flag: '✅', ref: '0.4–4.0', note: null },
  ];
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center shrink-0"><FlaskConical size={18} className="text-blue-600" /></div>
        <div className="flex-1">
          <div className="font-bold text-slate-800" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 16 }}>Latest Labs</div>
          <div className="text-xs text-slate-400" style={{ fontFamily: 'DM Mono, monospace', fontSize: 11 }}>March 2026 · Dubai Medical Laboratory</div>
        </div>
        <button onClick={() => navigate('/lab-results')} className="text-xs text-teal-600 hover:text-teal-800">View All →</button>
      </div>
      <div className="space-y-1">
        {labs.map(l => (
          <div key={l.name} className="flex items-center gap-2 py-2 border-b border-slate-50 last:border-0">
            <span className="text-xs text-slate-600 w-24 shrink-0">{l.name}</span>
            <span className={`font-bold text-xs flex-1 ${l.color}`} style={{ fontFamily: 'DM Mono, monospace' }}>{l.val}</span>
            <span className="text-xs">{l.flag}</span>
            <span className="text-xs text-slate-300" style={{ fontFamily: 'DM Mono, monospace', fontSize: 10 }}>ref: {l.ref}</span>
            {l.note && <span className="text-xs text-teal-500">{l.note}</span>}
          </div>
        ))}
      </div>
      <div className="mt-3 p-3 bg-blue-50 rounded-xl flex items-start gap-2">
        <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
        <p className="text-xs text-blue-700">Results synced from Nabidh national record</p>
      </div>
    </div>
  );
}

function TimelineSection() {
  const events = [
    { dot: 'bg-emerald-400', date: 'Apr 7, 2026', event: 'Cardiology consultation · Dr. Ahmed' },
    { dot: 'bg-blue-400', date: 'Mar 14, 2026', event: 'Lab panel results — 3 flags ⚠️' },
    { dot: 'bg-amber-400', date: 'Feb 15, 2026', event: 'Cardiac MRI — LVEF 64% normal ✅' },
    { dot: 'bg-blue-400', date: 'Jan 8, 2026', event: 'CT Chest — CAC score 42 (mild)' },
    { dot: 'bg-violet-400', date: 'Oct 2023', event: 'Atorvastatin started' },
  ];
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0"><Clock size={18} className="text-slate-500" /></div>
        <div className="font-bold text-slate-800 flex-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 16 }}>Health Timeline</div>
        <button onClick={() => navigate('/my-health')} className="text-xs text-teal-600 hover:text-teal-800">View Full →</button>
      </div>
      <div className="space-y-3 relative">
        <div className="absolute left-[5px] top-2 bottom-2 w-px bg-slate-100" />
        {events.map((e, i) => (
          <div key={i} className="flex items-start gap-3 pl-1">
            <div className={`w-3 h-3 rounded-full ${e.dot} shrink-0 mt-0.5 ring-2 ring-white relative z-10`} />
            <div>
              <div className="text-xs text-slate-400" style={{ fontFamily: 'DM Mono, monospace', fontSize: 10 }}>{e.date}</div>
              <div className="text-xs text-slate-700">{e.event}</div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => navigate('/my-health')} className="mt-3 text-xs text-teal-600 hover:text-teal-800 transition-colors">View all 24 events →</button>
    </div>
  );
}

/* ─────────────────── TAB 3: PRIVACY & SECURITY ─────────────────── */
function Tab3Privacy({ nabidh, setNabidh, notifPrefs, setNotifPrefs, showAccountActions, setShowAccountActions, addToast }: {
  nabidh: { sharing: boolean; emergency: boolean; research: boolean };
  setNabidh: (v: { sharing: boolean; emergency: boolean; research: boolean }) => void;
  notifPrefs: Record<string, boolean>;
  setNotifPrefs: (v: Record<string, boolean>) => void;
  showAccountActions: boolean;
  setShowAccountActions: (v: boolean) => void;
  addToast: (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => void;
}) {
  return (
    <div className="grid grid-cols-5 gap-5">
      <div className="col-span-3 space-y-4">
        {/* NABIDH */}
        <div className="bg-white rounded-2xl shadow-sm border-l-4 border-l-blue-500 border border-slate-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center shrink-0 text-lg">🇦🇪</div>
            <div className="flex-1">
              <div className="font-bold text-slate-800" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 16 }}>Nabidh National Health Record</div>
              <div className="text-xs text-slate-400">Your data on the UAE national HIE</div>
            </div>
          </div>
          <div className="p-4 bg-blue-50 rounded-xl mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Check size={14} className="text-emerald-600" />
              <span className="font-semibold text-emerald-700 text-sm">Connected to Nabidh HIE</span>
            </div>
            <p className="text-xs text-blue-700 leading-relaxed">Your health records are synced to the UAE national health information exchange. This allows any licensed healthcare provider in the UAE to access your records in an emergency or when you grant permission.</p>
          </div>
          <div className="space-y-4">
            {[
              { key: 'sharing' as const, label: 'Nabidh data sharing', sub: 'Disabling Nabidh sync will prevent other UAE providers from accessing your records.' },
              { key: 'emergency' as const, label: 'Emergency access (all UAE providers)', sub: 'In a medical emergency, any licensed UAE provider can view your blood group, allergies, and active meds.' },
              { key: 'research' as const, label: 'Research participation (anonymized)', sub: 'Allow anonymized data for UAE Health Authority research. Your identity is never disclosed.' },
            ].map(item => (
              <div key={item.key} className="flex items-start gap-3 py-2 border-b border-slate-50 last:border-0">
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-700">{item.label}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{item.sub}</div>
                </div>
                <Toggle checked={nabidh[item.key]} onChange={v => setNabidh({ ...nabidh, [item.key]: v })} />
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-slate-100 pt-4">
            <div className="text-xs uppercase tracking-wider text-slate-400 mb-3" style={{ fontSize: 10 }}>Insurance Data Sharing</div>
            <div className="p-3 bg-slate-50 rounded-xl mb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-slate-700">Daman National Health Insurance</span>
                <span className="text-xs text-emerald-600 font-bold">SHARED</span>
              </div>
              <div className="text-xs text-slate-400">Claims · Lab results · Consultation records</div>
            </div>
            <p className="text-xs text-slate-400 italic">Note: Your insurance provider needs access to process your claims and coverage approvals.</p>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-xs text-teal-500 font-medium" style={{ fontFamily: 'DM Mono, monospace' }}>Last synced: Today 2:07 PM · 12 records</div>
            <button className="text-xs text-teal-600 hover:text-teal-800">View Nabidh Sync Log →</button>
          </div>
        </div>

        {/* HEALTH DATA EXPORT */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <SectionHeader icon={Download} iconBg="bg-teal-100" iconColor="text-teal-600" title="My Health Data" />
          <div className="space-y-3">
            {[
              { title: 'Download Complete Health Record', sub: 'FHIR R4 format · All records · 2024–present', color: 'bg-teal-600 text-white hover:bg-teal-700' },
              { title: 'Download Medical Summary', sub: 'One-page summary · Blood group, allergies, conditions, meds', color: 'bg-slate-100 text-slate-700 hover:bg-slate-200' },
              { title: 'Download Insurance Report', sub: 'Claims history · AED 12,400 used this year', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
            ].map(item => (
              <div key={item.title} className="p-4 border border-slate-100 rounded-xl hover:border-teal-200 transition-colors">
                <div className="font-medium text-slate-800 text-sm mb-0.5">{item.title}</div>
                <div className="text-xs text-slate-400 mb-3">{item.sub}</div>
                <button className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${item.color}`}>
                  Download PDF
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-slate-50 rounded-xl">
            <p className="text-xs text-slate-400">Your health data is retained for 10 years per UAE DHA regulations (Federal Health Data Law).</p>
          </div>
        </div>
      </div>

      <div className="col-span-2 space-y-4">
        {/* ACCOUNT SECURITY */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <SectionHeader icon={ShieldCheck} iconBg="bg-red-100" iconColor="text-red-600" title="Account Security" />
          <div className="mb-4 p-3 bg-emerald-50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-emerald-700">Security Level: Strong</span>
              <span className="text-xs text-emerald-600 font-bold" style={{ fontFamily: 'DM Mono, monospace' }}>88/100</span>
            </div>
            <div className="h-2 bg-emerald-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '88%' }} />
            </div>
            <div className="text-xs text-teal-500 italic mt-1">+ Enable biometric to reach 95%</div>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Password', val: 'Last changed: 2 months ago', action: 'Change Password' },
              { label: 'Two-Factor Auth', val: '✅ SMS · +971 55 ●●● ●●●●', action: 'Manage 2FA' },
              { label: 'Biometric Login', val: 'Not configured', action: 'Set Up Face ID' },
              { label: 'Active Sessions', val: '2 active (iPhone + Chrome)', action: 'Manage Sessions' },
            ].map(item => (
              <div key={item.label} className="flex items-start justify-between py-2 border-b border-slate-50 last:border-0 gap-2">
                <div>
                  <div className="text-xs uppercase tracking-wider text-slate-400 mb-0.5" style={{ fontSize: 10 }}>{item.label}</div>
                  <div className="text-xs text-slate-700">{item.val}</div>
                </div>
                <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-medium transition-colors shrink-0">{item.action}</button>
              </div>
            ))}
            <div className="py-2">
              <div className="text-xs uppercase tracking-wider text-slate-400 mb-0.5" style={{ fontSize: 10 }}>Last Login</div>
              <div className="text-xs text-slate-500" style={{ fontFamily: 'DM Mono, monospace', fontSize: 11 }}>Today 9:15 AM · Dubai, UAE · CeenAiX iOS App</div>
            </div>
          </div>
        </div>

        {/* NOTIFICATION PREFERENCES */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <SectionHeader icon={Bell} iconBg="bg-teal-100" iconColor="text-teal-600" title="Notification Preferences" />
          <div className="space-y-2 mb-4">
            {[
              { key: 'appointments', label: 'Appointment reminders' },
              { key: 'labResults', label: 'Lab result ready' },
              { key: 'prescription', label: 'Prescription ready' },
              { key: 'doctorMessage', label: 'Doctor message' },
              { key: 'aiInsights', label: 'AI health insights' },
              { key: 'insurance', label: 'Insurance claim updates' },
              { key: 'refill', label: 'Medication refill reminder' },
              { key: 'updates', label: 'Platform updates' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between py-1.5">
                <span className="text-sm text-slate-700">{item.label}</span>
                <Toggle checked={notifPrefs[item.key] ?? false} onChange={v => setNotifPrefs({ ...notifPrefs, [item.key]: v })} />
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 pt-3 mb-3">
            <div className="text-xs uppercase tracking-wider text-slate-400 mb-2" style={{ fontSize: 10 }}>Channels</div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'In-App', on: true }, { label: 'Push', on: true }, { label: 'SMS', on: true },
                { label: 'Email', on: true }, { label: 'WhatsApp', on: false },
              ].map(c => (
                <span key={c.label} className={`px-2 py-1 rounded-full text-xs font-medium ${c.on ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-400'}`}>
                  {c.on ? '✅' : '○'} {c.label}
                </span>
              ))}
            </div>
          </div>
          <button onClick={() => addToast('success', 'Notification preferences saved')} className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium transition-colors">
            Save Preferences
          </button>
        </div>

        {/* ACCOUNT ACTIONS */}
        <div className="bg-white rounded-2xl shadow-sm border-l-4 border-l-red-400 border border-slate-100 p-4">
          <button onClick={() => setShowAccountActions(!showAccountActions)} className="w-full flex items-center justify-between text-sm text-slate-500 font-medium hover:text-slate-700 transition-colors">
            Account Actions
            {showAccountActions ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          {showAccountActions && (
            <div className="mt-4 space-y-3">
              <div className="p-3 border border-amber-200 rounded-xl">
                <div className="font-medium text-amber-700 text-sm mb-1">Deactivate Account</div>
                <div className="text-xs text-slate-400 mb-2">Temporarily hide your profile. Your data is retained.</div>
                <button className="px-4 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg text-xs font-medium transition-colors">Deactivate</button>
              </div>
              <div className="p-3 border border-red-200 rounded-xl">
                <div className="font-medium text-red-700 text-sm mb-1">Request Account Deletion</div>
                <div className="text-xs text-slate-400 mb-2">We'll delete your personal data where permitted. Clinical records are retained 10 years per UAE law.</div>
                <button className="px-4 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-medium transition-colors">Request Deletion</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── MODALS ─────────────────── */
function DownloadModal({ onClose, addToast }: { onClose: () => void; addToast: (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => void }) {
  const [format, setFormat] = useState<'card' | 'full' | 'fhir'>('card');
  const [downloading, setDownloading] = useState(false);

  function handleDownload() {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      addToast('success', 'Health summary downloaded', 'Your health summary has been prepared.');
      onClose();
    }, 1500);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(6px)' }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="font-bold text-slate-800" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Download Health Summary</div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>
        <div className="p-6">
          <div className="border border-slate-200 rounded-xl p-4 mb-5" style={{ background: '#F8FAFC' }}>
            <div className="text-center mb-3">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">CeenAiX · DHA Licensed</div>
              <div className="font-bold text-slate-800 text-sm" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Patient Health Summary</div>
              <div className="text-xs text-slate-500">Parnia Yazdkhasti · DOB: 22 Mar 1988 · Female</div>
            </div>
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="px-3 py-1 bg-red-600 text-white font-bold rounded-full" style={{ fontSize: 18, fontFamily: 'DM Mono, monospace' }}>A+</span>
            </div>
            <div className="space-y-2 text-xs">
              <div><span className="font-semibold text-red-700">Allergies:</span> <span className="text-red-600">Penicillin (SEVERE) · Sulfonamides (Moderate)</span></div>
              <div><span className="font-semibold text-slate-600">Conditions:</span> Hypertension (controlled) · T2 Diabetes (improving)</div>
              <div><span className="font-semibold text-slate-600">Medications:</span> Atorvastatin · Amlodipine · Metformin</div>
              <div><span className="font-semibold text-slate-600">Emergency:</span> Pedram Vaziri · +971 50 XXX XXXX</div>
            </div>
            <div className="flex justify-center mt-3">
              <div className="w-20 h-20 bg-slate-900 rounded-lg flex items-center justify-center">
                <div className="text-white text-xs text-center leading-tight">QR<br/>Code</div>
              </div>
            </div>
            <div className="text-center mt-2 text-xs text-slate-400" style={{ fontFamily: 'DM Mono, monospace', fontSize: 10 }}>Generated: 7 April 2026 · DHA-PLAT-2025-001847</div>
          </div>
          <div className="space-y-2 mb-5">
            {[
              { key: 'card', label: 'PDF — Patient Card', sub: 'Standard 1-page portable summary' },
              { key: 'full', label: 'PDF — Full Summary', sub: 'Detailed multi-page report' },
              { key: 'fhir', label: 'FHIR R4 JSON', sub: 'For healthcare providers & systems' },
            ].map(f => (
              <label key={f.key} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${format === f.key ? 'border-teal-500 bg-teal-50' : 'border-slate-100 hover:border-teal-200'}`}>
                <input type="radio" name="format" value={f.key} checked={format === f.key as typeof format} onChange={() => setFormat(f.key as typeof format)} className="text-teal-600" />
                <div>
                  <div className="text-sm font-medium text-slate-700">{f.label}</div>
                  <div className="text-xs text-slate-400">{f.sub}</div>
                </div>
              </label>
            ))}
          </div>
          <button onClick={handleDownload} disabled={downloading} className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-70">
            {downloading ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Preparing summary...</>
            ) : (
              <><Download size={16} /> Download</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function ShareModal({ onClose, addToast }: { onClose: () => void; addToast: (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => void }) {
  function copyLink() {
    navigator.clipboard.writeText('https://ceenaix.com/emergency/PT-001-xxxx').catch(() => {});
    addToast('success', 'Emergency profile link copied', 'Link copied to clipboard.');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(6px)' }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="font-bold text-slate-800" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Emergency Health Profile</div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>
        <div className="p-6">
          <p className="text-xs text-slate-500 mb-4">Share with first responders or when visiting a new healthcare facility for the first time.</p>
          <div className="flex justify-center mb-4">
            <div className="w-44 h-44 bg-slate-900 rounded-2xl flex flex-col items-center justify-center">
              <div className="text-white text-sm font-bold mb-1">QR Code</div>
              <div className="text-white/50 text-xs text-center leading-tight">Scan for emergency<br/>health data</div>
            </div>
          </div>
          <div className="space-y-1.5 mb-4 text-xs">
            {[
              { on: true, label: 'Blood group (A+)' },
              { on: true, label: 'Critical allergies (Penicillin + Sulfa)' },
              { on: true, label: 'Emergency contact (Pedram Vaziri)' },
              { on: true, label: 'Current medications (3 drugs)' },
              { on: true, label: 'Active conditions (4 conditions)' },
              { on: false, label: 'Lab results (private — not included)' },
              { on: false, label: 'Insurance details (not included)' },
              { on: false, label: 'Emirates ID (not included)' },
            ].map(item => (
              <div key={item.label} className={`flex items-center gap-2 ${item.on ? 'text-emerald-700' : 'text-slate-400 line-through'}`}>
                <span>{item.on ? '✅' : '❌'}</span>
                {item.label}
              </div>
            ))}
          </div>
          <div className="mb-4 p-2 bg-amber-50 rounded-lg text-center">
            <span className="text-xs text-amber-600 font-medium">This link expires in 24 hours</span>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1">
              <RefreshCw size={12} /> New Link
            </button>
            <button onClick={copyLink} className="flex-1 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1">
              <Copy size={12} /> Copy Link
            </button>
            <button className="flex-1 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1">
              <ExternalLink size={12} /> WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
