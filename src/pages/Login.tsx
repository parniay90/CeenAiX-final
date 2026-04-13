import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, AlertCircle, Brain, Shield, Clock, ArrowLeft, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

function navigate(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        const { data: userData, error: userError } = await supabase
          .from('user_roles').select('role').eq('user_id', data.user.id).maybeSingle();

        if (userError) console.error('Error fetching user role:', userError);

        if (!userData) {
          const { error: roleError } = await supabase.from('user_roles').insert([{ user_id: data.user.id, role }]);
          if (roleError) console.error('Error creating user role:', roleError);
        } else if (userData.role !== role) {
          setError(`This account is registered as a ${userData.role}. Please select the correct role.`);
          setLoading(false);
          return;
        }

        window.location.href = role === 'doctor' ? '/doctor/dashboard' : '/dashboard';
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const benefits = [
    { icon: Brain, title: 'AI-Powered Insights', desc: 'Personalized health recommendations from advanced AI' },
    { icon: Shield, title: 'DHA & NABIDH Certified', desc: 'Fully compliant with UAE healthcare regulations' },
    { icon: Clock, title: '24/7 Access', desc: 'Your complete health record, always available' },
  ];

  return (
    <div className="min-h-screen flex overflow-hidden">
      <style>{`
        @keyframes loginFadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes loginSlideIn { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes floatCard { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        @keyframes spinBlob { 0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; } 50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; } }
        .login-fade-up { animation: loginFadeUp 0.6s ease-out forwards; }
        .login-slide-in { animation: loginSlideIn 0.7s ease-out forwards; }
        .float-card { animation: floatCard 4s ease-in-out infinite; }
        .blob { animation: spinBlob 8s ease-in-out infinite; }
        .input-field { transition: border-color 0.2s, box-shadow 0.2s; }
        .input-field:focus { border-color: #06b6d4; box-shadow: 0 0 0 3px rgba(6,182,212,0.1); outline: none; }
      `}</style>

      {/* Left Side — Photo + Branding */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden flex-col">
        <img
          src="https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=1400"
          alt="Healthcare"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-cyan-900/70 to-blue-900/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />

        {/* Animated blobs */}
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-cyan-400/8 blob blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-blue-400/8 blob blur-3xl" style={{ animationDelay: '4s' }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-12">
          <div className="login-slide-in">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-12 text-sm group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to home
            </button>
            <div className="flex items-center gap-3 mb-2">
              <img src="/ChatGPT_Image_Feb_27,_2026,_11_29_01_AM.png" alt="CeenAiX" className="w-12 h-12 object-contain" />
              <span className="text-3xl font-black text-white tracking-tight">CeenAiX</span>
            </div>
            <p className="text-cyan-300 text-sm font-medium">Your Health, Intelligently Guided</p>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <div className="login-fade-up mb-10">
              <h2 className="text-4xl font-black text-white mb-4 leading-tight">
                Welcome back to<br />
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Dubai's leading<br />healthcare platform</span>
              </h2>
              <p className="text-cyan-100/60 leading-relaxed max-w-sm">
                Trusted by 50,000+ patients and 200+ healthcare facilities across the UAE.
              </p>
            </div>

            <div className="space-y-4">
              {benefits.map((b, i) => {
                const Icon = b.icon;
                return (
                  <div key={i} className="flex items-start gap-4 login-fade-up" style={{ animationDelay: `${0.2 + i * 0.1}s`, opacity: 0 }}>
                    <div className="w-10 h-10 rounded-xl bg-cyan-400/15 border border-cyan-400/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{b.title}</p>
                      <p className="text-cyan-100/50 text-xs mt-0.5">{b.desc}</p>
                    </div>
                    <div className="ml-auto w-5 h-5 rounded-full bg-emerald-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-emerald-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Floating stat card */}
          <div className="float-card bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-5 mb-8 max-w-xs">
            <div className="flex items-center justify-between mb-3">
              <p className="text-white/60 text-xs font-medium uppercase tracking-widest">Platform Stats</p>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 text-xs">Live</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[['50K+', 'Patients'], ['200+', 'Facilities'], ['99.9%', 'Uptime']].map(([val, lbl]) => (
                <div key={lbl} className="text-center">
                  <p className="text-white font-black text-lg">{val}</p>
                  <p className="text-white/40 text-xs">{lbl}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="relative z-10 text-cyan-400/50 text-xs">© 2026 CeenAiX Healthcare Technologies, Dubai, UAE</p>
        </div>
      </div>

      {/* Right Side — Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 via-white to-cyan-50/30 relative">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 right-10 w-64 h-64 bg-cyan-100 blob blur-3xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-blue-100 blob blur-3xl" style={{ animationDelay: '3s' }} />
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <button onClick={() => navigate('/')} className="flex items-center justify-center gap-2 text-slate-500 hover:text-slate-700 transition-colors mb-6 text-sm mx-auto">
              <ArrowLeft className="w-4 h-4" /> Back to home
            </button>
            <div className="flex items-center justify-center gap-3 mb-2">
              <img src="/ChatGPT_Image_Feb_27,_2026,_11_29_01_AM.png" alt="CeenAiX" className="w-12 h-12 object-contain" />
              <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">CeenAiX</h1>
            </div>
            <p className="text-slate-500 text-sm">Your Health, Intelligently Guided</p>
          </div>

          <div className="login-fade-up">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-slate-900 mb-2">Welcome back</h2>
              <p className="text-slate-500">Sign in to access your health portal</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Role selector */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">I am a</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['patient', 'doctor'] as const).map(r => (
                    <button key={r} type="button" onClick={() => setRole(r)}
                      className={`py-3 px-4 rounded-xl border-2 text-sm font-bold capitalize transition-all duration-200 ${
                        role === r
                          ? 'border-cyan-500 bg-cyan-50 text-cyan-700 shadow-sm shadow-cyan-500/20'
                          : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                      }`}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="input-field block w-full pl-11 pr-4 py-3.5 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 bg-white text-sm"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="input-field block w-full pl-11 pr-11 py-3.5 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 bg-white text-sm"
                    placeholder="Enter your password"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 w-4 h-4" />
                  <span className="text-sm text-slate-600">Remember me</span>
                </label>
                <a href="#" className="text-sm font-semibold text-cyan-600 hover:text-cyan-700 transition-colors">Forgot password?</a>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 hover:scale-[1.01] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2 text-sm">
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  `Sign In as ${role.charAt(0).toUpperCase() + role.slice(1)}`
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-500 text-sm">
                Don't have an account?{' '}
                <button onClick={() => navigate('/sign-up')} className="font-bold text-cyan-600 hover:text-cyan-700 transition-colors">
                  Sign up free
                </button>
              </p>
            </div>

            <div className="mt-5 pt-5 border-t border-slate-100">
              <button onClick={() => navigate('/admin/login')}
                className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl transition-all duration-200 text-sm flex items-center justify-center gap-2">
                <Shield className="w-4 h-4" />
                Admin Portal
              </button>
            </div>

            {/* Trust badges */}
            <div className="mt-6 flex items-center justify-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                DHA Certified
              </div>
              <div className="w-px h-4 bg-slate-200" />
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Lock className="w-3.5 h-3.5 text-cyan-500" />
                NABIDH Compliant
              </div>
              <div className="w-px h-4 bg-slate-200" />
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Check className="w-3.5 h-3.5 text-blue-500" />
                256-bit SSL
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
