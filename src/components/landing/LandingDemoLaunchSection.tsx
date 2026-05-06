import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Check, ChevronDown, X, Bell, Stethoscope, Shield, Globe,
  Calendar, Clock, Users, Building2, Loader2, ExternalLink,
  Share2, CheckCircle2, AlertCircle, ChevronRight
} from 'lucide-react';
import { t, type Lang } from '../../data/landingI18n';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

// ─── Config (would normally come from platform settings) ───────────────────
const LAUNCH_DATE: Date | null = new Date('2026-08-01T09:00:00+04:00');
const COUNTER_FLOOR = 25;

// ─── Utilities ──────────────────────────────────────────────────────────────
function apiUrl(path: string) {
  return `${SUPABASE_URL}/functions/v1/leads${path}`;
}

function apiHeaders() {
  return {
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  };
}

function getTimeLeft(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    done: diff === 0,
  };
}

function sessionGet(key: string) {
  try { return JSON.parse(sessionStorage.getItem(key) ?? 'null'); } catch { return null; }
}
function sessionSet(key: string, val: unknown) {
  try { sessionStorage.setItem(key, JSON.stringify(val)); } catch { /* ignore */ }
}
function sessionClear(key: string) {
  try { sessionStorage.removeItem(key); } catch { /* ignore */ }
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function TrustBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold">
      {children}
    </span>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1 text-rose-600 text-xs" role="alert" aria-live="polite">
      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
      {msg}
    </p>
  );
}

function FormField({
  label, required, error, id, children,
}: {
  label: string; required?: boolean; error?: string; id: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700">
        {label}{required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      {children}
      <FieldError msg={error} />
    </div>
  );
}

const inputCls = (err?: string, valid?: boolean) =>
  `w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 bg-white transition-all duration-150 outline-none
   focus:ring-2 focus:ring-teal-400/40 focus:border-teal-400
   ${err ? 'border-rose-400 bg-rose-50/30' : valid ? 'border-emerald-400 pr-10' : 'border-slate-200 hover:border-slate-300'}`;

function ValidatedInput({
  id, type = 'text', value, onChange, onBlur, placeholder, autoComplete,
  error, valid, dir,
}: {
  id: string; type?: string; value: string; onChange: (v: string) => void; onBlur?: () => void;
  placeholder?: string; autoComplete?: string; error?: string; valid?: boolean; dir?: string;
}) {
  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete={autoComplete}
        dir={dir ?? 'auto'}
        className={inputCls(error, valid)}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {valid && !error && (
        <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 pointer-events-none" />
      )}
    </div>
  );
}

function SelectField({
  id, value, onChange, options, placeholder, error, valid,
}: {
  id: string; value: string; onChange: (v: string) => void;
  options: string[]; placeholder?: string; error?: string; valid?: boolean;
}) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`${inputCls(error, valid && !!value)} appearance-none`}
        aria-invalid={!!error}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
    </div>
  );
}

function SegmentedControl({
  options, value, onChange, id,
}: { options: string[]; value: string; onChange: (v: string) => void; id: string }) {
  return (
    <div className="flex rounded-xl border border-slate-200 overflow-hidden" role="group" aria-labelledby={id}>
      {options.map((opt, i) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`flex-1 py-2.5 text-sm font-semibold transition-all duration-150
            ${value === opt
              ? 'bg-teal-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-50'}
            ${i > 0 ? 'border-l border-slate-200' : ''}`}
          aria-pressed={value === opt}
          onKeyDown={e => {
            if (e.key === 'ArrowRight') onChange(options[(i + 1) % options.length]);
            if (e.key === 'ArrowLeft') onChange(options[(i - 1 + options.length) % options.length]);
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function Countdown({ target, lang }: { target: Date; lang: Lang }) {
  const tr = t[lang];
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [time, setTime] = useState(() => getTimeLeft(target));

  useEffect(() => {
    if (prefersReduced) return;
    const tick = () => {
      if (!document.hidden) setTime(getTimeLeft(target));
    };
    const id = setInterval(tick, 1000);
    document.addEventListener('visibilitychange', tick);
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', tick); };
  }, [target, prefersReduced]);

  if (prefersReduced) {
    return (
      <p className="text-sm text-slate-500 text-center py-3">
        {tr.launchesOn(target.toLocaleDateString(lang === 'ar' ? 'ar-AE' : 'en-AE', { dateStyle: 'long' }))}
      </p>
    );
  }

  const units = [
    { val: time.days, label: tr.countdownDays },
    { val: time.hours, label: tr.countdownHours },
    { val: time.minutes, label: tr.countdownMins },
    { val: time.seconds, label: tr.countdownSecs },
  ];

  return (
    <div className="flex items-center justify-center gap-3 py-4" aria-live="off" aria-atomic="true">
      {units.map(({ val, label }, i) => (
        <div key={label} className="flex items-center gap-3">
          <div className="text-center min-w-[52px]">
            <div className="font-mono text-2xl font-bold text-teal-700 tabular-nums bg-teal-50 border border-teal-200 rounded-xl px-3 py-1.5">
              {String(val).padStart(2, '0')}
            </div>
            <div className="text-xs text-slate-400 font-medium mt-1 tracking-wide uppercase">{label}</div>
          </div>
          {i < 3 && <span className="text-teal-400 font-bold text-xl -mt-4">:</span>}
        </div>
      ))}
    </div>
  );
}

// ─── Demo Request Card ────────────────────────────────────────────────────────

interface DemoForm {
  full_name: string; email: string; phone: string;
  organization_name: string; role: string; organization_type: string;
  country: string; team_size: string; interests: string[];
  preferred_demo_time: string; specific_date: string; notes: string;
  preferred_language: string; consent: boolean; marketing_opt_in: boolean;
}

const DEMO_DEFAULTS: DemoForm = {
  full_name: '', email: '', phone: '', organization_name: '',
  role: '', organization_type: '', country: 'Dubai',
  team_size: '', interests: [], preferred_demo_time: 'Anytime',
  specific_date: '', notes: '', preferred_language: 'English',
  consent: false, marketing_opt_in: false,
};

function DemoRequestCard({
  lang, active, onSuccess, scrollToNotify,
}: {
  lang: Lang; active: boolean; onSuccess: () => void; scrollToNotify: () => void;
}) {
  const tr = t[lang];
  const isRtl = lang === 'ar';

  const [form, setForm] = useState<DemoForm>(() => sessionGet('demo_form') ?? DEMO_DEFAULTS);
  const [errors, setErrors] = useState<Partial<Record<keyof DemoForm | '_global', string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof DemoForm, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successData, setSuccessData] = useState<{ name: string; email: string } | null>(null);
  const [freeEmailWarning, setFreeEmailWarning] = useState(false);
  const [freeEmailOverridden, setFreeEmailOverridden] = useState(false);
  const [alsoNotifyShown, setAlsoNotifyShown] = useState(false);

  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    sessionSet('demo_form', form);
  }, [form]);

  useEffect(() => {
    if (active && window.location.hash === '#demo' && firstFieldRef.current) {
      setTimeout(() => firstFieldRef.current?.focus(), 300);
    }
  }, [active]);

  const set = (k: keyof DemoForm, v: unknown) => setForm(f => ({ ...f, [k]: v }));
  const blur = (k: keyof DemoForm) => {
    setTouched(t => ({ ...t, [k]: true }));
    validateField(k);
  };

  const validateField = useCallback((k: keyof DemoForm) => {
    setErrors(prev => {
      const e = { ...prev };
      const v = form[k];
      delete e[k];
      if (k === 'full_name' && !String(v).trim()) e.full_name = tr.required;
      if (k === 'email') {
        if (!String(v).trim()) e.email = tr.required;
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v))) e.email = tr.invalidEmail;
      }
      if (k === 'phone' && !String(v).trim()) e.phone = tr.required;
      if (k === 'organization_name' && !String(v).trim()) e.organization_name = tr.required;
      if (k === 'role' && !String(v)) e.role = tr.required;
      if (k === 'organization_type' && !String(v)) e.organization_type = tr.required;
      if (k === 'country' && !String(v)) e.country = tr.required;
      if (k === 'team_size' && !String(v)) e.team_size = tr.required;
      if (k === 'interests' && (v as string[]).length === 0) e.interests = tr.selectOne;
      if (k === 'consent' && !v) e.consent = tr.required;
      return e;
    });
  }, [form, tr]);

  useEffect(() => {
    const FREE = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com', 'icloud.com', 'me.com', 'protonmail.com'];
    const domain = form.email.split('@')[1]?.toLowerCase() ?? '';
    setFreeEmailWarning(FREE.includes(domain) && !freeEmailOverridden);
  }, [form.email, freeEmailOverridden]);

  const validate = (): boolean => {
    const keys: (keyof DemoForm)[] = [
      'full_name', 'email', 'phone', 'organization_name', 'role',
      'organization_type', 'country', 'team_size', 'interests', 'consent',
    ];
    const e: typeof errors = {};
    keys.forEach(k => {
      const v = form[k];
      if (k === 'full_name' && !String(v).trim()) e.full_name = tr.required;
      if (k === 'email') {
        if (!String(v).trim()) e.email = tr.required;
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v))) e.email = tr.invalidEmail;
      }
      if (k === 'phone' && !String(v).trim()) e.phone = tr.required;
      if (k === 'organization_name' && !String(v).trim()) e.organization_name = tr.required;
      if (k === 'role' && !String(v)) e.role = tr.required;
      if (k === 'organization_type' && !String(v)) e.organization_type = tr.required;
      if (k === 'country' && !String(v)) e.country = tr.required;
      if (k === 'team_size' && !String(v)) e.team_size = tr.required;
      if (k === 'interests' && (v as string[]).length === 0) e.interests = tr.selectOne;
      if (k === 'consent' && !v) e.consent = tr.required;
    });
    setErrors(e);
    setTouched(Object.fromEntries(keys.map(k => [k, true])));
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setErrors({});
    try {
      const res = await fetch(apiUrl('/demo-request'), {
        method: 'POST',
        headers: apiHeaders(),
        body: JSON.stringify({ ...form, override_free_email: freeEmailOverridden }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setSuccessData({ name: form.full_name.split(' ')[0], email: form.email });
        setAlsoNotifyShown(!form.marketing_opt_in);
        sessionClear('demo_form');
      } else {
        setErrors(data.errors ?? { _global: tr.genericError });
      }
    } catch {
      setErrors({ _global: tr.genericError });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleInterest = (item: string) => {
    set('interests', form.interests.includes(item)
      ? form.interests.filter(i => i !== item)
      : [...form.interests, item]);
  };

  const countryOptions = [
    ...tr.emirates,
    '---',
    ...tr.gccCountries,
    '---',
    'Other',
  ].filter(o => o !== '---' || true);

  if (success && successData) {
    return (
      <SuccessDemo
        name={successData.name}
        email={successData.email}
        lang={lang}
        alsoNotifyShown={alsoNotifyShown}
        onAlsoNotify={scrollToNotify}
        onReset={() => { setSuccess(false); setForm(DEMO_DEFAULTS); }}
      />
    );
  }

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Card header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-1">{tr.card1Eyebrow}</p>
          <h3 className="text-2xl font-bold text-slate-900">{tr.card1Title}</h3>
          <p className="mt-1.5 text-sm text-slate-500 leading-relaxed max-w-sm">{tr.card1Desc}</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center flex-shrink-0 ms-4" aria-hidden="true">
          <Stethoscope className="w-6 h-6 text-teal-600" />
        </div>
      </div>

      {errors._global && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-rose-700 text-sm" role="alert">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {errors._global}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Honeypot */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          aria-hidden="true"
          className="absolute opacity-0 pointer-events-none w-0 h-0 overflow-hidden"
          style={{ clipPath: 'inset(50%)' }}
          autoComplete="off"
        />

        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label={tr.fullName} required id="demo-name" error={touched.full_name ? errors.full_name : undefined}>
            <div className="relative">
              <input
                ref={firstFieldRef}
                id="demo-name"
                type="text"
                value={form.full_name}
                onChange={e => set('full_name', e.target.value)}
                onBlur={() => blur('full_name')}
                autoComplete="name"
                className={inputCls(touched.full_name ? errors.full_name : undefined, touched.full_name && !errors.full_name && !!form.full_name)}
                aria-invalid={!!errors.full_name}
                aria-describedby={errors.full_name ? 'demo-name-error' : undefined}
              />
              {touched.full_name && !errors.full_name && form.full_name && (
                <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
              )}
            </div>
          </FormField>

          <FormField label={tr.workEmail} required id="demo-email" error={touched.email ? errors.email : undefined}>
            <div className="relative">
              <input
                id="demo-email"
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                onBlur={() => blur('email')}
                autoComplete="email"
                dir="ltr"
                className={inputCls(touched.email ? errors.email : undefined, touched.email && !errors.email && !!form.email)}
                aria-invalid={!!errors.email}
              />
              {touched.email && !errors.email && form.email && (
                <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
              )}
            </div>
            {freeEmailWarning && !errors.email && (
              <div className="mt-1.5 p-2 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-700 flex items-start gap-2">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <span>
                  {tr.freeEmailWarning}{' '}
                  <button type="button" onClick={() => setFreeEmailOverridden(true)} className="underline font-semibold">
                    {tr.freeEmailOverride}
                  </button>
                </span>
              </div>
            )}
          </FormField>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label={tr.phone} required id="demo-phone" error={touched.phone ? errors.phone : undefined}>
            <div className="flex gap-2">
              <select className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:ring-2 focus:ring-teal-400/40 focus:border-teal-400 outline-none w-28 appearance-none" defaultValue="+971">
                <option value="+971">🇦🇪 +971</option>
                <option value="+966">🇸🇦 +966</option>
                <option value="+965">🇰🇼 +965</option>
                <option value="+974">🇶🇦 +974</option>
                <option value="+973">🇧🇭 +973</option>
                <option value="+968">🇴🇲 +968</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+91">🇮🇳 +91</option>
              </select>
              <div className="relative flex-1">
                <input
                  id="demo-phone"
                  type="tel"
                  value={form.phone}
                  onChange={e => set('phone', e.target.value)}
                  onBlur={() => blur('phone')}
                  autoComplete="tel"
                  dir="ltr"
                  className={`${inputCls(touched.phone ? errors.phone : undefined, touched.phone && !errors.phone && !!form.phone)} flex-1`}
                  aria-invalid={!!errors.phone}
                />
              </div>
            </div>
          </FormField>

          <FormField label={tr.orgName} required id="demo-org" error={touched.organization_name ? errors.organization_name : undefined}>
            <div className="relative">
              <input
                id="demo-org"
                type="text"
                value={form.organization_name}
                onChange={e => set('organization_name', e.target.value)}
                onBlur={() => blur('organization_name')}
                autoComplete="organization"
                className={inputCls(touched.organization_name ? errors.organization_name : undefined, touched.organization_name && !errors.organization_name && !!form.organization_name)}
              />
              {touched.organization_name && !errors.organization_name && form.organization_name && (
                <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
              )}
            </div>
          </FormField>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label={tr.role} required id="demo-role" error={touched.role ? errors.role : undefined}>
            <SelectField
              id="demo-role"
              value={form.role}
              onChange={v => { set('role', v); setTouched(t => ({ ...t, role: true })); }}
              options={tr.roles as unknown as string[]}
              placeholder="—"
              error={touched.role ? errors.role : undefined}
              valid={touched.role && !errors.role && !!form.role}
            />
          </FormField>

          <FormField label={tr.orgType} required id="demo-orgtype" error={touched.organization_type ? errors.organization_type : undefined}>
            <SelectField
              id="demo-orgtype"
              value={form.organization_type}
              onChange={v => { set('organization_type', v); setTouched(t => ({ ...t, organization_type: true })); }}
              options={tr.orgTypes as unknown as string[]}
              placeholder="—"
              error={touched.organization_type ? errors.organization_type : undefined}
              valid={touched.organization_type && !errors.organization_type && !!form.organization_type}
            />
          </FormField>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label={tr.countryEmirate} required id="demo-country" error={touched.country ? errors.country : undefined}>
            <SelectField
              id="demo-country"
              value={form.country}
              onChange={v => { set('country', v); setTouched(t => ({ ...t, country: true })); }}
              options={countryOptions.filter(o => o !== '---')}
              error={touched.country ? errors.country : undefined}
              valid={touched.country && !errors.country && !!form.country}
            />
          </FormField>

          <FormField label={tr.teamSize} required id="demo-teamsize" error={touched.team_size ? errors.team_size : undefined}>
            <SelectField
              id="demo-teamsize"
              value={form.team_size}
              onChange={v => { set('team_size', v); setTouched(t => ({ ...t, team_size: true })); }}
              options={tr.teamSizes as unknown as string[]}
              placeholder="—"
              error={touched.team_size ? errors.team_size : undefined}
              valid={touched.team_size && !errors.team_size && !!form.team_size}
            />
          </FormField>
        </div>

        {/* Interests multi-select chips */}
        <FormField label={tr.interests} required id="demo-interests" error={touched.interests ? errors.interests : undefined}>
          <div className="flex flex-wrap gap-2 mt-1" id="demo-interests" role="group" aria-label={tr.interests}>
            {(tr.interestOptions as unknown as string[]).map(item => {
              const sel = form.interests.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => { toggleInterest(item); setTouched(t => ({ ...t, interests: true })); }}
                  aria-pressed={sel}
                  className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all duration-150
                    ${sel
                      ? 'bg-teal-600 border-teal-600 text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-teal-400 hover:text-teal-700'}`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </FormField>

        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label={tr.preferredTime} id="demo-time">
            <SelectField
              id="demo-time"
              value={form.preferred_demo_time}
              onChange={v => set('preferred_demo_time', v)}
              options={tr.timeOptions as unknown as string[]}
            />
          </FormField>

          {form.preferred_demo_time === 'Specific date' || form.preferred_demo_time === 'تاريخ محدد' ? (
            <FormField label={tr.specificDate} id="demo-date">
              <input
                id="demo-date"
                type="date"
                value={form.specific_date}
                onChange={e => set('specific_date', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={inputCls()}
              />
            </FormField>
          ) : <div />}
        </div>

        <FormField label={tr.notes} id="demo-notes">
          <textarea
            id="demo-notes"
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
            placeholder={tr.notesPlaceholder}
            maxLength={500}
            rows={3}
            className={`${inputCls()} resize-none`}
          />
          <p className="text-xs text-slate-400 text-end mt-1">{form.notes.length}/500</p>
        </FormField>

        <FormField label={tr.preferredLang} required id="demo-lang-ctrl">
          <SegmentedControl
            id="demo-lang-ctrl"
            options={tr.demoLangs as unknown as string[]}
            value={form.preferred_language}
            onChange={v => set('preferred_language', v)}
          />
        </FormField>

        {/* Consent */}
        <div className="space-y-2">
          <label className={`flex items-start gap-3 cursor-pointer group ${errors.consent ? 'text-rose-600' : ''}`}>
            <div className={`mt-0.5 w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors
              ${form.consent ? 'bg-teal-600 border-teal-600' : 'border-slate-300 bg-white group-hover:border-teal-400'}`}
              onClick={() => { set('consent', !form.consent); setTouched(t => ({ ...t, consent: true })); }}
            >
              {form.consent && <Check className="w-3 h-3 text-white" />}
            </div>
            <span className="text-xs text-slate-600 leading-relaxed">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={e => { set('consent', e.target.checked); setTouched(t => ({ ...t, consent: true })); }}
                className="sr-only"
                aria-describedby={errors.consent ? 'consent-error' : undefined}
                aria-invalid={!!errors.consent}
              />
              {tr.consent}{' '}
              <a href="/privacy" className="underline text-teal-600 hover:text-teal-700">{tr.privacyPolicy}</a>
            </span>
          </label>
          {touched.consent && errors.consent && <FieldError msg={errors.consent} />}

          <label className="flex items-start gap-3 cursor-pointer group">
            <div
              className={`mt-0.5 w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors
                ${form.marketing_opt_in ? 'bg-teal-600 border-teal-600' : 'border-slate-300 bg-white group-hover:border-teal-400'}`}
              onClick={() => set('marketing_opt_in', !form.marketing_opt_in)}
            >
              {form.marketing_opt_in && <Check className="w-3 h-3 text-white" />}
            </div>
            <span className="text-xs text-slate-600 leading-relaxed">
              <input
                type="checkbox"
                checked={form.marketing_opt_in}
                onChange={e => set('marketing_opt_in', e.target.checked)}
                className="sr-only"
              />
              {tr.marketingOptIn}
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting}
          aria-busy={submitting}
          className="w-full py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 active:scale-[0.98] disabled:opacity-60
            text-white font-bold text-base transition-all duration-150 shadow-sm hover:shadow-md
            flex items-center justify-center gap-2 mt-2"
        >
          {submitting ? (
            <><Loader2 className="w-4 h-4 animate-spin" />{tr.submitting}</>
          ) : tr.submitDemo}
        </button>
      </form>
    </div>
  );
}

function SuccessDemo({
  name, email, lang, alsoNotifyShown, onAlsoNotify, onReset,
}: {
  name: string; email: string; lang: Lang; alsoNotifyShown: boolean;
  onAlsoNotify: () => void; onReset: () => void;
}) {
  const tr = t[lang];
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div
      role="status"
      className={`flex flex-col items-center text-center py-6 ${prefersReduced ? '' : 'animate-[fadeUp_0.3s_ease-out]'}`}
    >
      <div className={`w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-5 ${prefersReduced ? '' : 'animate-[pulse_0.6s_ease-out]'}`}>
        <CheckCircle2 className="w-9 h-9 text-teal-600" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{tr.successTitle(name)}</h3>
      <p className="text-sm text-slate-500 leading-relaxed mb-6 max-w-sm">{tr.successBody(email)}</p>
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <a
          href="/about"
          className="flex-1 py-2.5 px-4 rounded-xl border border-teal-200 text-teal-700 text-sm font-semibold hover:bg-teal-50 transition-colors text-center"
        >
          {tr.successCta1}
        </a>
        <a
          href="https://www.linkedin.com/company/aryaix"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
        >
          {tr.successCta2} <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
      {alsoNotifyShown && (
        <button
          type="button"
          onClick={onAlsoNotify}
          className="mt-4 text-sm text-teal-600 hover:text-teal-700 underline"
        >
          {tr.alsoNotify}
        </button>
      )}
      <button type="button" onClick={onReset} className="mt-3 text-xs text-slate-400 hover:text-slate-600 underline">
        {tr.submitAnother}
      </button>
    </div>
  );
}

// ─── Launch Notify Card ───────────────────────────────────────────────────────

interface NotifyForm {
  name: string; email: string; country: string; persona: string; preferred_language: string; consent: boolean;
}

const NOTIFY_DEFAULTS: NotifyForm = {
  name: '', email: '', country: 'Dubai', persona: '', preferred_language: 'English', consent: false,
};

function LaunchNotifyCard({
  lang, active, onSuccess, scrollToDemo,
}: {
  lang: Lang; active: boolean; onSuccess: () => void; scrollToDemo: () => void;
}) {
  const tr = t[lang];
  const isRtl = lang === 'ar';

  const [form, setForm] = useState<NotifyForm>(() => sessionGet('notify_form') ?? NOTIFY_DEFAULTS);
  const [errors, setErrors] = useState<Partial<Record<keyof NotifyForm | '_global', string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof NotifyForm, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successEmail, setSuccessEmail] = useState('');
  const [alreadySub, setAlreadySub] = useState(false);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => { sessionSet('notify_form', form); }, [form]);

  useEffect(() => {
    if (active && window.location.hash === '#notify-me' && firstFieldRef.current) {
      setTimeout(() => firstFieldRef.current?.focus(), 300);
    }
  }, [active]);

  const set = (k: keyof NotifyForm, v: unknown) => setForm(f => ({ ...f, [k]: v }));
  const blur = (k: keyof NotifyForm) => setTouched(t => ({ ...t, [k]: true }));

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = tr.required;
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = tr.invalidEmail;
    if (!form.consent) e.consent = tr.required;
    setErrors(e);
    setTouched({ name: true, email: true, consent: true });
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setErrors({});
    try {
      const res = await fetch(apiUrl('/launch-notify'), {
        method: 'POST',
        headers: apiHeaders(),
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setSuccessEmail(form.email);
        setAlreadySub(!!data.alreadySubscribed);
        sessionClear('notify_form');
        onSuccess();
      } else {
        setErrors(data.errors ?? { _global: tr.genericError });
      }
    } catch {
      setErrors({ _global: tr.genericError });
    } finally {
      setSubmitting(false);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/#notify-me`;
    if (navigator.share) {
      await navigator.share({ title: 'CeenAiX Launch', text: 'Be first to know when CeenAiX launches!', url });
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  const handleCalendar = () => {
    if (!LAUNCH_DATE) return;
    const date = LAUNCH_DATE.toISOString().split('T')[0].replace(/-/g, '');
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART;VALUE=DATE:${date}`,
      `DTEND;VALUE=DATE:${date}`,
      'SUMMARY:CeenAiX Launch',
      'DESCRIPTION:CeenAiX healthcare AI platform launches today. Visit ceeenaix.com',
      'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'ceeenix-launch.ics';
    a.click();
  };

  if (success) {
    return (
      <div role="status" className="flex flex-col items-center text-center py-6 animate-[fadeUp_0.3s_ease-out]" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-teal-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-1">
          {alreadySub ? tr.alreadySubscribed : tr.successNotifyTitle}
        </h3>
        {!alreadySub && (
          <p className="text-sm text-slate-500 mb-5 max-w-xs leading-relaxed">
            {tr.successNotifyBody(successEmail)}
            {' '}
            <button type="button" onClick={scrollToDemo} className="text-teal-600 underline font-semibold">
              {tr.successNotifyCta}
            </button>
          </p>
        )}
        <div className="flex gap-3 flex-wrap justify-center">
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            <Share2 className="w-4 h-4" /> {tr.shareColleague}
          </button>
          {LAUNCH_DATE && (
            <button
              type="button"
              onClick={handleCalendar}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              <Calendar className="w-4 h-4" /> {tr.addToCalendar}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-1">{tr.card2Eyebrow}</p>
          <h3 className="text-2xl font-bold text-slate-900">{tr.card2Title}</h3>
          <p className="mt-1.5 text-sm text-slate-500 leading-relaxed max-w-sm">{tr.card2Desc}</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center flex-shrink-0 ms-4" aria-hidden="true">
          <Bell className="w-6 h-6 text-teal-600" />
        </div>
      </div>

      {/* Countdown */}
      {LAUNCH_DATE ? (
        <div className="mb-4 rounded-2xl bg-teal-50 border border-teal-100 px-4 overflow-hidden">
          <Countdown target={LAUNCH_DATE} lang={lang} />
        </div>
      ) : (
        <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-200">
          <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
          <span className="text-teal-700 text-sm font-semibold">{tr.launchingSoon}</span>
        </div>
      )}

      {errors._global && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-rose-700 text-sm" role="alert">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {errors._global}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Honeypot */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          aria-hidden="true"
          className="absolute opacity-0 pointer-events-none w-0 h-0 overflow-hidden"
          style={{ clipPath: 'inset(50%)' }}
          autoComplete="off"
        />

        <FormField label={tr.yourName} required id="notify-name" error={touched.name ? errors.name : undefined}>
          <div className="relative">
            <input
              ref={firstFieldRef}
              id="notify-name"
              type="text"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              onBlur={() => blur('name')}
              autoComplete="given-name"
              placeholder={tr.yourName}
              className={inputCls(touched.name ? errors.name : undefined, touched.name && !errors.name && !!form.name)}
              aria-invalid={!!errors.name}
            />
            {touched.name && !errors.name && form.name && (
              <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
            )}
          </div>
        </FormField>

        <FormField label={tr.workEmail} required id="notify-email" error={touched.email ? errors.email : undefined}>
          <div className="relative">
            <input
              id="notify-email"
              type="email"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              onBlur={() => blur('email')}
              autoComplete="email"
              dir="ltr"
              placeholder={tr.emailPlaceholder}
              className={inputCls(touched.email ? errors.email : undefined, touched.email && !errors.email && !!form.email)}
              aria-invalid={!!errors.email}
            />
            {touched.email && !errors.email && form.email && (
              <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
            )}
          </div>
        </FormField>

        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label={tr.countryEmirate} id="notify-country">
            <SelectField
              id="notify-country"
              value={form.country}
              onChange={v => set('country', v)}
              options={[
                ...(tr.emirates as unknown as string[]),
                ...(tr.gccCountries as unknown as string[]),
                'Other',
              ]}
            />
          </FormField>

          <FormField label={tr.iAmA} id="notify-persona">
            <SelectField
              id="notify-persona"
              value={form.persona}
              onChange={v => set('persona', v)}
              options={tr.personaOptions as unknown as string[]}
              placeholder="—"
            />
          </FormField>
        </div>

        <FormField label={tr.preferredLang} required id="notify-lang-ctrl">
          <SegmentedControl
            id="notify-lang-ctrl"
            options={tr.demoLangs as unknown as string[]}
            value={form.preferred_language}
            onChange={v => set('preferred_language', v)}
          />
        </FormField>

        <label className={`flex items-start gap-3 cursor-pointer group ${touched.consent && errors.consent ? 'text-rose-600' : ''}`}>
          <div
            className={`mt-0.5 w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors
              ${form.consent ? 'bg-teal-600 border-teal-600' : 'border-slate-300 bg-white group-hover:border-teal-400'}`}
            onClick={() => { set('consent', !form.consent); setTouched(t => ({ ...t, consent: true })); }}
          >
            {form.consent && <Check className="w-3 h-3 text-white" />}
          </div>
          <span className="text-xs text-slate-600 leading-relaxed">
            <input
              type="checkbox"
              checked={form.consent}
              onChange={e => { set('consent', e.target.checked); setTouched(t => ({ ...t, consent: true })); }}
              className="sr-only"
              aria-invalid={!!errors.consent}
            />
            {tr.consentNotify}
          </span>
        </label>
        {touched.consent && errors.consent && <FieldError msg={errors.consent} />}

        <button
          type="submit"
          disabled={submitting}
          aria-busy={submitting}
          className="w-full py-3.5 rounded-2xl border-2 border-teal-600 text-teal-700 font-bold text-base
            hover:bg-teal-600 hover:text-white active:scale-[0.98] disabled:opacity-60
            transition-all duration-150 flex items-center justify-center gap-2"
        >
          {submitting ? (
            <><Loader2 className="w-4 h-4 animate-spin" />{tr.submitting}</>
          ) : tr.submitNotify}
        </button>
      </form>
    </div>
  );
}

// ─── Trust Strip ─────────────────────────────────────────────────────────────

function TrustStrip({ lang }: { lang: Lang }) {
  const tr = t[lang];
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch(apiUrl('/count'), { headers: { Authorization: `Bearer ${SUPABASE_ANON_KEY}` } })
      .then(r => r.json())
      .then(d => { if (d.visible) setCount(d.count); })
      .catch(() => { });
  }, []);

  return (
    <div className="mt-8 rounded-2xl border border-slate-100 bg-white/60 backdrop-blur-sm p-5">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
          <img src="/ChatGPT_Image_Feb_27,_2026,_11_29_01_AM copy.png" alt="AryAiX" className="w-6 h-6 object-contain opacity-70" />
          {tr.trustLeft}
        </div>
        <div className="flex items-center gap-6">
          {[
            { icon: Shield, label: (tr.trustCenter as unknown as string[])[0] },
            { icon: Globe, label: (tr.trustCenter as unknown as string[])[1] },
            { icon: Building2, label: (tr.trustCenter as unknown as string[])[2] },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Icon className="w-3.5 h-3.5 text-teal-600" />
              {label}
            </div>
          ))}
        </div>
        {count !== null && count >= COUNTER_FLOOR && (
          <div className="flex items-center gap-1.5 text-sm font-semibold text-teal-700">
            <Users className="w-4 h-4" />
            {tr.trustCounter(count)}
          </div>
        )}
      </div>
      <p className="mt-3 text-center text-xs text-slate-400">
        {tr.privacyFirst}{' '}
        <a href="/privacy" className="underline hover:text-slate-600">{tr.readPrivacy}</a>
      </p>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export default function LandingDemoLaunchSection() {
  const [lang, setLang] = useState<Lang>('en');
  const [mobileTab, setMobileTab] = useState<'demo' | 'notify'>('demo');
  const [notifySuccess, setNotifySuccess] = useState(false);
  const demoRef = useRef<HTMLDivElement>(null);
  const notifyRef = useRef<HTMLDivElement>(null);
  const isRtl = lang === 'ar';
  const tr = t[lang];

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#demo') {
      setMobileTab('demo');
      setTimeout(() => demoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    } else if (hash === '#notify-me') {
      setMobileTab('notify');
      setTimeout(() => notifyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    }
  }, []);

  const scrollToNotify = () => {
    setMobileTab('notify');
    setTimeout(() => notifyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
  };

  const scrollToDemo = () => {
    setMobileTab('demo');
    setTimeout(() => demoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
  };

  return (
    <section
      id="demo-launch"
      aria-label="Request a demo or sign up for launch"
      dir={isRtl ? 'rtl' : 'ltr'}
      className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-teal-50/40 to-cyan-50/30" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-20 -start-20 w-80 h-80 rounded-full bg-teal-200/20 blur-3xl" />
        <div className="absolute bottom-20 -end-20 w-96 h-96 rounded-full bg-cyan-200/20 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-100 border border-teal-200 mb-5">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            <span className="text-teal-700 text-xs font-bold uppercase tracking-widest">{tr.eyebrow}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
            {tr.headline}
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-6 leading-relaxed">{tr.subheadline}</p>

          {/* Trust strip in header */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {(tr.trustStrip as unknown as string[]).map(item => (
              <TrustBadge key={item}><Check className="w-3 h-3" />{item}</TrustBadge>
            ))}
          </div>

          {/* Language toggle */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setLang(l => l === 'en' ? 'ar' : 'en')}
              className="flex items-center gap-2 px-5 py-2 rounded-full border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:border-teal-400 hover:text-teal-700 transition-all shadow-sm"
              aria-label={lang === 'en' ? 'Switch to Arabic' : 'Switch to English'}
            >
              <Globe className="w-4 h-4" />
              {lang === 'en' ? tr.langToggleAr : tr.langToggleEn}
            </button>
          </div>
        </div>

        {/* Mobile tab switcher */}
        <div className="lg:hidden mb-6 flex rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          {(['demo', 'notify'] as const).map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setMobileTab(tab)}
              className={`flex-1 py-3 text-sm font-bold transition-all duration-150
                ${mobileTab === tab ? 'bg-teal-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
              aria-pressed={mobileTab === tab}
            >
              {tab === 'demo' ? tr.tabDemo : tr.tabNotify}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          {/* Demo card */}
          <div
            ref={demoRef}
            id="demo"
            className={`relative rounded-2xl bg-white shadow-lg border border-slate-100 p-7 lg:p-8
              border-t-2 border-t-teal-500
              transition-all duration-300
              ${mobileTab === 'notify' ? 'hidden lg:block' : 'block'}`}
          >
            <DemoRequestCard
              lang={lang}
              active={mobileTab === 'demo'}
              onSuccess={() => { }}
              scrollToNotify={scrollToNotify}
            />
          </div>

          {/* Vertical divider (desktop) */}
          <div className="hidden lg:flex absolute left-1/2 top-[200px] bottom-[120px] w-px bg-gradient-to-b from-transparent via-slate-200 to-transparent -translate-x-1/2 pointer-events-none" aria-hidden="true" />

          {/* Notify card */}
          <div
            ref={notifyRef}
            id="notify-me"
            className={`relative rounded-2xl bg-white shadow-md border border-slate-100 p-7 lg:p-8
              border-t-2 border-t-cyan-400
              transition-all duration-300
              ${mobileTab === 'demo' ? 'hidden lg:block' : 'block'}`}
          >
            <LaunchNotifyCard
              lang={lang}
              active={mobileTab === 'notify'}
              onSuccess={() => setNotifySuccess(true)}
              scrollToDemo={scrollToDemo}
            />
          </div>
        </div>

        {/* Trust strip */}
        <TrustStrip lang={lang} />
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
