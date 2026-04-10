import { useState } from 'react';
import {
  Activity, User, Stethoscope, FlaskConical, Shield, Building2,
  Pill, ChevronRight, ArrowLeft, Lock, Mail
} from 'lucide-react';

interface Role {
  id: string;
  label: string;
  sub: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
  path: string;
}

const roles: Role[] = [
  {
    id: 'patient',
    label: 'Patient',
    sub: 'Access your health records, appointments & medications',
    icon: User,
    color: 'text-teal-700',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    path: '/dashboard',
  },
  {
    id: 'doctor',
    label: 'Doctor / Clinician',
    sub: 'Manage consultations, prescriptions & patient records',
    icon: Stethoscope,
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    path: '/doctor/dashboard',
  },
  {
    id: 'pharmacy',
    label: 'Pharmacist',
    sub: 'Dispense medications, manage inventory & prescriptions',
    icon: Pill,
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    path: '/pharmacy/dashboard',
  },
  {
    id: 'lab',
    label: 'Lab & Radiology',
    sub: 'Process samples, manage imaging & NABIDH submissions',
    icon: FlaskConical,
    color: 'text-slate-700',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    path: '/lab/dashboard',
  },
  {
    id: 'insurance',
    label: 'Insurance',
    sub: 'Review claims, pre-authorizations & network providers',
    icon: Shield,
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    path: '/insurance/dashboard',
  },
  {
    id: 'admin',
    label: 'Platform Admin',
    sub: 'Monitor platform health, users & organization management',
    icon: Building2,
    color: 'text-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    path: '/admin/dashboard',
  },
];

const demoCreds: Record<string, { email: string; name: string }> = {
  patient: { email: 'layla.hassan@demo.ceenaix.ae', name: 'Layla Hassan' },
  doctor: { email: 'dr.ahmed@demo.ceenaix.ae', name: 'Dr. Ahmed Al Rashidi' },
  pharmacy: { email: 'pharmacist@demo.ceenaix.ae', name: 'Khalid Al Mansoori' },
  lab: { email: 'fatima.lab@demo.ceenaix.ae', name: 'Fatima Al Rashidi' },
  insurance: { email: 'insurance@demo.ceenaix.ae', name: 'Mariam Al Suwaidi' },
  admin: { email: 'admin@demo.ceenaix.ae', name: 'CeenAiX Admin' },
};

export default function RoleLogin() {
  const [selected, setSelected] = useState<string | null>(null);
  const [step, setStep] = useState<'select' | 'login'>('select');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSelect(roleId: string) {
    setSelected(roleId);
    const demo = demoCreds[roleId];
    setEmail(demo.email);
    setPassword('Demo@2026!');
    setStep('login');
  }

  function handleDemoLogin() {
    if (!selected) return;
    setLoading(true);
    const role = roles.find(r => r.id === selected)!;
    setTimeout(() => {
      window.history.pushState({}, '', role.path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }, 800);
  }

  function handleBack() {
    setStep('select');
    setSelected(null);
    setEmail('');
    setPassword('');
    setLoading(false);
  }

  const selectedRole = roles.find(r => r.id === selected);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <div className="hidden lg:flex w-80 bg-slate-900 flex-col justify-between p-8 shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center">
              <Activity size={20} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-white text-lg" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>CeenAiX</div>
              <div className="text-teal-400 text-xs">Healthcare Platform</div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="text-white font-bold text-2xl leading-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Dubai's leading integrated healthcare platform
              </div>
              <div className="text-slate-400 text-sm mt-3">
                One platform. Every stakeholder. Full DHA compliance.
              </div>
            </div>

            <div className="space-y-3">
              {['DHA-compliant & NABIDH-certified', 'AI-powered clinical insights', 'Real-time data across all portals', 'End-to-end encryption'].map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-teal-600 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-slate-300 text-sm">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-slate-500 text-xs">
          © 2026 CeenAiX Healthcare Technologies, Dubai, UAE
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        {step === 'select' ? (
          <div className="w-full max-w-2xl">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2 lg:hidden">
                <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                  <Activity size={16} className="text-white" />
                </div>
                <span className="font-bold text-slate-800" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>CeenAiX</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Select your role
              </h1>
              <p className="text-slate-500 text-sm mt-1">Choose the portal that matches your role to continue</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {roles.map(role => {
                const Icon = role.icon;
                return (
                  <button
                    key={role.id}
                    onClick={() => handleSelect(role.id)}
                    className={`flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all hover:shadow-md group ${role.bg} ${role.border} hover:scale-[1.02]`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${role.bg} border ${role.border} group-hover:shadow-sm shrink-0`}>
                      <Icon size={20} className={role.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold text-sm ${role.color}`}>{role.label}</div>
                      <div className="text-slate-500 text-xs mt-0.5 leading-relaxed">{role.sub}</div>
                    </div>
                    <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-600 shrink-0 mt-1" />
                  </button>
                );
              })}
            </div>

            <div className="text-center text-sm text-slate-500">
              <a href="/" className="text-slate-500 hover:text-slate-700 transition-colors">
                ← Back to home
              </a>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm mb-6 transition-colors"
            >
              <ArrowLeft size={16} />
              Back to role selection
            </button>

            {selectedRole && (
              <div className={`flex items-center gap-3 mb-6 p-4 rounded-xl border ${selectedRole.bg} ${selectedRole.border}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedRole.bg}`}>
                  <selectedRole.icon size={20} className={selectedRole.color} />
                </div>
                <div>
                  <div className={`font-semibold ${selectedRole.color}`}>{selectedRole.label}</div>
                  <div className="text-slate-500 text-xs">Demo portal access</div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Sign in
              </h2>
              <p className="text-slate-500 text-sm mb-6">Demo credentials pre-filled for you</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <button
                  onClick={handleDemoLogin}
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ChevronRight size={16} />
                    </>
                  )}
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-500">
                  <span className="font-medium text-slate-700">Demo Mode:</span> Click "Sign In" to enter the{' '}
                  {selectedRole?.label} portal with pre-loaded sample data.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
