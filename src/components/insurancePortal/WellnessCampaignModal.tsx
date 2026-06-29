import React, { useState } from 'react';
import { X, Users, MessageSquare, Send, ChevronDown, Check } from 'lucide-react';
import { Member } from '../../types/insurancePortal';

interface Props {
  members: Member[];
  onClose: () => void;
  onSend: (count: number) => void;
}

const TEMPLATES = [
  { id: 'annual_checkup', label: 'Annual Checkup Reminder', subject: 'Time for Your Annual Health Checkup', subjectAr: 'حان وقت الفحص الصحي السنوي' },
  { id: 'chronic_mgmt', label: 'Chronic Disease Management', subject: 'Important: Managing Your Chronic Condition', subjectAr: 'مهم: إدارة حالتك المزمنة' },
  { id: 'benefit_expiry', label: 'Benefits Expiring Soon', subject: 'Your Insurance Benefits Expire Soon', subjectAr: 'تنتهي مزاياك التأمينية قريباً' },
  { id: 'preventive_care', label: 'Preventive Care Program', subject: 'Join Daman\'s Preventive Care Program', subjectAr: 'انضم إلى برنامج الرعاية الوقائية من ضمان' },
  { id: 'custom', label: 'Custom Message', subject: '', subjectAr: '' },
];

const TEMPLATE_MESSAGES: Record<string, { en: string; ar: string }> = {
  annual_checkup: {
    en: 'Dear Member,\n\nAs part of our commitment to your health and wellbeing, we would like to remind you that your annual health checkup is due. Early detection saves lives.\n\nBook your appointment today at any Daman network facility.\n\nWarm regards,\nDaman National Health Insurance',
    ar: 'عزيزي العضو،\n\nالتزاماً منا بصحتك ورفاهيتك، نود تذكيرك بأن موعد فحصك الصحي السنوي قد حان. الكشف المبكر ينقذ الأرواح.\n\nاحجز موعدك اليوم في أي منشأة من شبكة ضمان.\n\nمع تحياتنا،\nضمان التأمين الصحي الوطني',
  },
  chronic_mgmt: {
    en: 'Dear Member,\n\nManaging your chronic condition effectively is key to maintaining a high quality of life. Our care coordinators are available to support you with personalized guidance and resources.\n\nContact us at 800-DAMAN to speak with a health advisor.\n\nWarm regards,\nDaman National Health Insurance',
    ar: 'عزيزي العضو،\n\nإدارة حالتك المزمنة بفعالية هي مفتاح الحفاظ على جودة حياة عالية. منسقو الرعاية لدينا متاحون لدعمك بتوجيهات وموارد مخصصة.\n\nتواصل معنا على 800-DAMAN للتحدث مع مستشار صحي.\n\nمع تحياتنا،\nضمان التأمين الصحي الوطني',
  },
  benefit_expiry: {
    en: 'Dear Member,\n\nYour annual insurance benefits are approaching their limit. To maximize your coverage, we encourage you to schedule any pending medical appointments or procedures before the policy year ends.\n\nFor assistance, call 800-DAMAN.\n\nWarm regards,\nDaman National Health Insurance',
    ar: 'عزيزي العضو،\n\nتقترب مزاياك التأمينية السنوية من حدها الأقصى. لتحقيق أقصى استفادة من تغطيتك، نشجعك على تحديد مواعيد أي إجراءات طبية معلقة قبل انتهاء سنة الوثيقة.\n\nللمساعدة، اتصل على 800-DAMAN.\n\nمع تحياتنا،\nضمان التأمين الصحي الوطني',
  },
  preventive_care: {
    en: 'Dear Member,\n\nDaman\'s Preventive Care Program offers free screenings, wellness consultations, and health coaching to help you stay ahead of potential health concerns.\n\nEnroll today through the Daman app or visit our website.\n\nWarm regards,\nDaman National Health Insurance',
    ar: 'عزيزي العضو،\n\nيقدم برنامج الرعاية الوقائية من ضمان فحوصات مجانية واستشارات صحية وتدريباً للمساعدة في البقاء في صحة جيدة.\n\nسجّل اليوم عبر تطبيق ضمان أو تفضل بزيارة موقعنا الإلكتروني.\n\nمع تحياتنا،\nضمان التأمين الصحي الوطني',
  },
  custom: { en: '', ar: '' },
};

const CONDITIONS = ['Diabetes', 'Hypertension', 'CKD', 'Coronary Artery Disease', 'Asthma', 'Obesity', 'Dyslipidemia', 'Oncology'];
const PLANS = ['Gold', 'Silver', 'Basic', 'Thiqa'];
const RISKS = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

type Audience = 'all' | 'high_critical' | 'custom';
type Channel = 'sms' | 'email' | 'push';

export default function WellnessCampaignModal({ members, onClose, onSend }: Props) {
  const [step, setStep] = useState(0);

  // Step 1 — Audience
  const [audience, setAudience] = useState<Audience>('high_critical');
  const [filterPlan, setFilterPlan] = useState<string[]>([]);
  const [filterRisk, setFilterRisk] = useState<string[]>([]);
  const [filterCondition, setFilterCondition] = useState('');

  // Step 2 — Message
  const [templateId, setTemplateId] = useState('annual_checkup');
  const [subjectEn, setSubjectEn] = useState(TEMPLATES[0].subject);
  const [subjectAr, setSubjectAr] = useState(TEMPLATES[0].subjectAr);
  const [messageEn, setMessageEn] = useState(TEMPLATE_MESSAGES['annual_checkup'].en);
  const [messageAr, setMessageAr] = useState(TEMPLATE_MESSAGES['annual_checkup'].ar);
  const [channels, setChannels] = useState<Channel[]>(['sms', 'email']);
  const [sending, setSending] = useState(false);

  const getAudienceCount = () => {
    if (audience === 'all') return members.length;
    if (audience === 'high_critical') return members.filter(m => m.riskLevel === 'HIGH' || m.riskLevel === 'CRITICAL').length;
    let filtered = [...members];
    if (filterPlan.length) filtered = filtered.filter(m => filterPlan.includes(m.planType));
    if (filterRisk.length) filtered = filtered.filter(m => filterRisk.includes(m.riskLevel));
    if (filterCondition) filtered = filtered.filter(m => m.conditions.some(c => c.name.toLowerCase().includes(filterCondition.toLowerCase())));
    return filtered.length;
  };

  const audienceCount = getAudienceCount();

  const handleTemplateChange = (id: string) => {
    setTemplateId(id);
    const tmpl = TEMPLATES.find(t => t.id === id)!;
    setSubjectEn(tmpl.subject);
    setSubjectAr(tmpl.subjectAr);
    setMessageEn(TEMPLATE_MESSAGES[id]?.en ?? '');
    setMessageAr(TEMPLATE_MESSAGES[id]?.ar ?? '');
  };

  const togglePlan = (p: string) => setFilterPlan(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  const toggleRisk = (r: string) => setFilterRisk(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]);
  const toggleChannel = (c: Channel) => setChannels(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  const handleSend = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      onSend(audienceCount);
    }, 1400);
  };

  const steps = ['Audience', 'Message', 'Preview & Send'];
  const canProceed = step === 0 ? audienceCount > 0 : step === 1 ? (subjectEn.trim() && messageEn.trim() && channels.length > 0) : true;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full flex flex-col overflow-hidden" style={{ width: 560, maxHeight: '90vh' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ backgroundColor: '#0F2D4A', minHeight: 56 }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
              <Send size={16} className="text-white" />
            </div>
            <span className="text-white font-semibold text-base">Send Wellness Outreach</span>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center transition-colors" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}>
            <X size={16} className="text-white" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0 px-6 py-4 border-b border-slate-100 flex-shrink-0">
          {steps.map((s, i) => (
            <React.Fragment key={i}>
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  i < step ? 'bg-emerald-500 text-white' : i === step ? 'text-white' : 'bg-slate-200 text-slate-400'
                }`} style={i === step ? { backgroundColor: '#0F2D4A' } : {}}>
                  {i < step ? <Check size={12} /> : i + 1}
                </div>
                <span className={`text-sm font-medium ${i === step ? 'text-slate-800' : i < step ? 'text-emerald-600' : 'text-slate-400'}`}>{s}</span>
              </div>
              {i < steps.length - 1 && <div className={`flex-1 h-px mx-3 ${i < step ? 'bg-emerald-400' : 'bg-slate-200'}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5">

          {/* STEP 1 — Audience */}
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Who Receives This Message</p>
                <div className="space-y-2">
                  {([
                    { id: 'all', label: 'All Members', desc: `All ${members.length} members in portfolio` },
                    { id: 'high_critical', label: 'High & Critical Risk', desc: `${members.filter(m => m.riskLevel === 'HIGH' || m.riskLevel === 'CRITICAL').length} members with elevated risk` },
                    { id: 'custom', label: 'Custom Filter', desc: 'Define specific criteria below' },
                  ] as const).map(opt => (
                    <label key={opt.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${audience === opt.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
                      <input type="radio" name="audience" value={opt.id} checked={audience === opt.id} onChange={() => setAudience(opt.id)} className="text-blue-600" />
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{opt.label}</p>
                        <p className="text-xs text-slate-500">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {audience === 'custom' && (
                <div className="space-y-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <p className="text-xs font-semibold text-slate-600 mb-2">Plan Type</p>
                    <div className="flex flex-wrap gap-2">
                      {PLANS.map(p => (
                        <button key={p} onClick={() => togglePlan(p)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${filterPlan.includes(p) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-300 hover:border-blue-400'}`}>{p}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-600 mb-2">Risk Level</p>
                    <div className="flex flex-wrap gap-2">
                      {RISKS.map(r => {
                        const color = r === 'CRITICAL' ? 'bg-red-600 text-white border-red-600' : r === 'HIGH' ? 'bg-orange-500 text-white border-orange-500' : r === 'MEDIUM' ? 'bg-amber-400 text-white border-amber-400' : 'bg-emerald-500 text-white border-emerald-500';
                        const inactiveColor = 'bg-white text-slate-600 border-slate-300 hover:border-slate-400';
                        return (
                          <button key={r} onClick={() => toggleRisk(r)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${filterRisk.includes(r) ? color : inactiveColor}`}>{r}</button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-600 mb-2">Condition</p>
                    <div className="relative">
                      <select value={filterCondition} onChange={e => setFilterCondition(e.target.value)} className="w-full appearance-none bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Any condition</option>
                        {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-emerald-200 bg-emerald-50">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Users size={20} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-emerald-700 font-medium">Estimated Reach</p>
                  <p className="text-lg font-bold text-emerald-700" style={{ fontFamily: 'DM Mono, monospace' }}>
                    {audienceCount.toLocaleString()} <span className="text-sm font-normal">members</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 — Message */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Template</p>
                <div className="relative">
                  <select value={templateId} onChange={e => handleTemplateChange(e.target.value)} className="w-full appearance-none bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-700 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Subject (English)</label>
                  <input value={subjectEn} onChange={e => setSubjectEn(e.target.value)} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="English subject" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Subject (Arabic)</label>
                  <input value={subjectAr} onChange={e => setSubjectAr(e.target.value)} dir="rtl" className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="الموضوع بالعربية" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Message (English)</label>
                  <textarea value={messageEn} onChange={e => setMessageEn(e.target.value)} rows={7} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Write your message in English..." />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Message (Arabic)</label>
                  <textarea value={messageAr} onChange={e => setMessageAr(e.target.value)} rows={7} dir="rtl" className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="اكتب رسالتك بالعربية..." />
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-600 mb-2">Delivery Channels</p>
                <div className="flex gap-3">
                  {(['sms', 'email', 'push'] as Channel[]).map(ch => (
                    <label key={ch} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all ${channels.includes(ch) ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
                      <input type="checkbox" checked={channels.includes(ch)} onChange={() => toggleChannel(ch)} className="text-blue-600 rounded" />
                      <span className="text-sm font-semibold text-slate-700 uppercase">{ch}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 — Preview & Send */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Campaign Summary</p>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                    {audienceCount.toLocaleString()} recipients
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-slate-500 w-20 flex-shrink-0 mt-0.5">Audience</span>
                    <span className="text-xs font-semibold text-slate-800">
                      {audience === 'all' ? 'All Members' : audience === 'high_critical' ? 'High & Critical Risk' : 'Custom Filter'}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-slate-500 w-20 flex-shrink-0 mt-0.5">Channels</span>
                    <span className="text-xs font-semibold text-slate-800 uppercase">{channels.join(' · ')}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-slate-500 w-20 flex-shrink-0 mt-0.5">Subject</span>
                    <span className="text-xs font-semibold text-slate-800">{subjectEn}</span>
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-200">
                  <p className="text-xs font-semibold text-slate-600 mb-2">Message Preview</p>
                  <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">{messageEn.length > 300 ? messageEn.slice(0, 300) + '…' : messageEn}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-200 bg-amber-50">
                <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-amber-800 mb-1">DHA Compliance Notice</p>
                  <p className="text-xs text-amber-700 leading-relaxed">All patient communications must comply with the Dubai Health Authority (DHA) Patient Rights &amp; Responsibilities Charter and the Federal Law No. 2 of 2019 on the Use of Information and Communication Technology in Health Fields. Ensure content is medically accurate and does not constitute unsolicited medical advice.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 flex-shrink-0 bg-white">
          <button onClick={step === 0 ? onClose : () => setStep(s => s - 1)} className="px-5 py-2 rounded-xl text-sm font-semibold text-slate-600 border border-slate-300 hover:bg-slate-50 transition-colors">
            {step === 0 ? 'Cancel' : 'Back'}
          </button>
          {step < 2 ? (
            <button onClick={() => setStep(s => s + 1)} disabled={!canProceed} className="px-6 py-2 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed" style={{ backgroundColor: '#0F2D4A' }}>
              Continue
            </button>
          ) : (
            <button onClick={handleSend} disabled={sending} className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60 w-48 justify-center" style={{ backgroundColor: '#0F2D4A', minHeight: 40 }}>
              {sending ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <Send size={15} />
                  Send Campaign
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
