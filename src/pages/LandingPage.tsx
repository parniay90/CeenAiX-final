import { useState, useEffect, useRef } from 'react';
import { Activity, Shield, Brain, Users, Clock, Award, ChevronRight, Check, Menu, X, Heart, Zap, Star, ArrowRight, Play, Stethoscope, FlaskConical, Pill, FileText, Lock, Globe as Globe2, TrendingUp, MessageCircle, Bell, ChevronDown } from 'lucide-react';

function navigate(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function useCounter(target: number, active: boolean, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);
  return count;
}

function StatCounter({ value, suffix, label, active }: { value: number; suffix: string; label: string; active: boolean }) {
  const count = useCounter(value, active);
  return (
    <div className="text-center group">
      <div className="text-5xl font-black mb-2 bg-gradient-to-br from-cyan-400 to-blue-400 bg-clip-text text-transparent tabular-nums">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-cyan-100 font-medium text-sm uppercase tracking-widest">{label}</div>
    </div>
  );
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activePortal, setActivePortal] = useState(0);

  const heroRef = useInView(0.1);
  const statsRef = useInView(0.2);
  const featuresRef = useInView(0.1);
  const howRef = useInView(0.1);
  const testimonialsRef = useInView(0.1);
  const pricingRef = useInView(0.1);
  const ctaRef = useInView(0.2);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setActivePortal(p => (p + 1) % 6), 3000);
    return () => clearInterval(interval);
  }, []);

  const portals = [
    { label: 'Patient Portal', path: '/patient/home', color: 'from-cyan-500 to-blue-500', icon: Heart },
    { label: 'Doctor Portal', path: '/doctor/dashboard', color: 'from-blue-500 to-sky-500', icon: Stethoscope },
    { label: 'Pharmacy Portal', path: '/pharmacy/dashboard', color: 'from-emerald-500 to-teal-500', icon: Pill },
    { label: 'Lab & Radiology', path: '/lab/dashboard', color: 'from-violet-500 to-blue-500', icon: FlaskConical },
    { label: 'Insurance Portal', path: '/insurance/dashboard', color: 'from-amber-500 to-orange-500', icon: FileText },
    { label: 'Admin Portal', path: '/admin/dashboard', color: 'from-rose-500 to-pink-500', icon: Shield },
  ];

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Diagnostics',
      description: 'Advanced machine learning analyzes your health data to surface early warnings and personalized recommendations before symptoms arise.',
      photo: 'https://images.pexels.com/photos/8439094/pexels-photo-8439094.jpeg?auto=compress&cs=tinysrgb&w=800',
      color: 'from-cyan-500 to-blue-600',
      tag: 'AI Technology'
    },
    {
      icon: Shield,
      title: 'DHA-Compliant & NABIDH',
      description: 'Fully certified by the Dubai Health Authority with end-to-end encryption, meeting every UAE healthcare data regulation.',
      photo: 'https://images.pexels.com/photos/5722164/pexels-photo-5722164.jpeg?auto=compress&cs=tinysrgb&w=800',
      color: 'from-emerald-500 to-teal-600',
      tag: 'Compliance'
    },
    {
      icon: Clock,
      title: '24/7 Health Guardian',
      description: 'Round-the-clock AI monitoring and access to your complete health record, anywhere and anytime across the UAE.',
      photo: 'https://images.pexels.com/photos/7659564/pexels-photo-7659564.jpeg?auto=compress&cs=tinysrgb&w=800',
      color: 'from-blue-500 to-sky-600',
      tag: 'Always On'
    },
    {
      icon: Users,
      title: 'Integrated Care Teams',
      description: 'Seamless real-time collaboration between your doctors, pharmacists, and lab specialists on a unified platform.',
      photo: 'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=800',
      color: 'from-violet-500 to-purple-600',
      tag: 'Collaboration'
    },
    {
      icon: Activity,
      title: 'Real-time Monitoring',
      description: 'Live vitals tracking, instant lab result alerts, and smart medication reminders keep you and your care team in sync.',
      photo: 'https://images.pexels.com/photos/6129507/pexels-photo-6129507.jpeg?auto=compress&cs=tinysrgb&w=800',
      color: 'from-rose-500 to-pink-600',
      tag: 'Live Data'
    },
    {
      icon: Award,
      title: 'Premium Care Experience',
      description: 'Dubai\'s most trusted healthcare platform — recognized by over 200 facilities and 50,000 active patients.',
      photo: 'https://images.pexels.com/photos/3259629/pexels-photo-3259629.jpeg?auto=compress&cs=tinysrgb&w=800',
      color: 'from-amber-500 to-orange-600',
      tag: 'Award-Winning'
    }
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Al Maktoum',
      role: 'Cardiologist, Cleveland Clinic Abu Dhabi',
      avatar: 'https://images.pexels.com/photos/5214961/pexels-photo-5214961.jpeg?auto=compress&cs=tinysrgb&w=200',
      quote: 'CeenAiX has completely transformed how I manage patient care. The AI insights surface critical patterns I might have missed, and the integrated workflow saves me hours every day.',
      stars: 5
    },
    {
      name: 'Fatima Al Rashidi',
      role: 'Patient, Dubai',
      avatar: 'https://images.pexels.com/photos/3768726/pexels-photo-3768726.jpeg?auto=compress&cs=tinysrgb&w=200',
      quote: 'I can see all my health records, book appointments, and chat with my doctor from one place. The AI assistant caught a potential drug interaction my pharmacist hadn\'t flagged.',
      stars: 5
    },
    {
      name: 'Ahmed Hassan',
      role: 'Head Pharmacist, Aster Pharmacy',
      avatar: 'https://images.pexels.com/photos/6129967/pexels-photo-6129967.jpeg?auto=compress&cs=tinysrgb&w=200',
      quote: 'The prescription dispensing workflow and drug interaction checker have made our pharmacy significantly safer and faster. The NABIDH integration works flawlessly.',
      stars: 5
    }
  ];

  const plans = [
    {
      name: 'Patient',
      price: 'Free',
      period: 'forever',
      description: 'For individuals managing their personal health',
      features: ['AI Health Assistant', 'Digital Health Records', 'Appointment Booking', 'Prescription Management', 'Lab Results Access', 'Telemedicine Consultations'],
      cta: 'Get Started Free',
      highlighted: false
    },
    {
      name: 'Healthcare Provider',
      price: 'Custom',
      period: 'per month',
      description: 'For clinics, hospitals, and healthcare facilities',
      features: ['Everything in Patient', 'Multi-user Management', 'Advanced Analytics', 'Clinical AI Workflows', 'NABIDH Integration', 'Priority Support', 'Compliance Dashboard'],
      cta: 'Contact Sales',
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: 'Contact Us',
      period: '',
      description: 'For large health systems and networks',
      features: ['Everything in Provider', 'Custom Integrations', 'Dedicated Account Manager', 'SLA Guarantees', 'White-label Options', 'Advanced Security', 'Training & Onboarding'],
      cta: 'Talk to Us',
      highlighted: false
    }
  ];

  const steps = [
    {
      num: '01',
      title: 'Create Your Account',
      desc: 'Sign up with your Emirates ID in under 5 minutes. Instant verification through DHA systems.',
      icon: Users,
      photo: 'https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      num: '02',
      title: 'Connect Your Records',
      desc: 'Securely import your existing health records, insurance, and prescription history automatically.',
      icon: Globe2,
      photo: 'https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      num: '03',
      title: 'Start Your Journey',
      desc: 'Your AI health guardian is activated. Get insights, book appointments, and stay ahead of your health.',
      icon: Zap,
      photo: 'https://images.pexels.com/photos/4225920/pexels-photo-4225920.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideLeft { from { opacity: 0; transform: translateX(60px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideRight { from { opacity: 0; transform: translateX(-60px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes floatY { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-16px); } }
        @keyframes floatSlow { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-10px) rotate(3deg); } }
        @keyframes pulse-ring { 0% { transform: scale(0.8); opacity: 1; } 100% { transform: scale(2); opacity: 0; } }
        @keyframes shimmerMove { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes blob { 0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; } 50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; } }
        @keyframes orbit { from { transform: rotate(0deg) translateX(120px) rotate(0deg); } to { transform: rotate(360deg) translateX(120px) rotate(-360deg); } }
        @keyframes orbitReverse { from { transform: rotate(0deg) translateX(80px) rotate(0deg); } to { transform: rotate(-360deg) translateX(80px) rotate(360deg); } }
        @keyframes waveIn { from { opacity: 0; transform: scaleX(0); } to { opacity: 1; transform: scaleX(1); } }
        @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animate-fade-up { animation: fadeUp 0.7s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
        .animate-slide-left { animation: slideLeft 0.7s ease-out forwards; }
        .animate-slide-right { animation: slideRight 0.7s ease-out forwards; }
        .animate-float { animation: floatY 4s ease-in-out infinite; }
        .animate-float-slow { animation: floatSlow 6s ease-in-out infinite; }
        .animate-blob { animation: blob 8s ease-in-out infinite; }
        .animate-gradient { background-size: 200% 200%; animation: gradientShift 5s ease infinite; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .opacity-0-init { opacity: 0; }
        .card-hover { transition: transform 0.35s cubic-bezier(.34,1.56,.64,1), box-shadow 0.35s ease; }
        .card-hover:hover { transform: translateY(-8px) scale(1.01); box-shadow: 0 30px 60px -12px rgba(6,182,212,0.2); }
        .portal-btn { transition: all 0.25s cubic-bezier(.34,1.56,.64,1); }
        .portal-btn:hover { transform: translateY(-4px) scale(1.04); }
        .shimmer-text { background: linear-gradient(90deg, #0891b2, #3b82f6, #06b6d4, #0891b2); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: shimmerMove 3s linear infinite; }
      `}</style>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-cyan-500/10 border-b border-cyan-100' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18 py-4">
            <div className="flex items-center gap-3">
              <img src="/ChatGPT_Image_Feb_27,_2026,_11_29_01_AM.png" alt="CeenAiX" className="w-11 h-11 object-contain" />
              <span className={`text-2xl font-black tracking-tight transition-all duration-300 ${scrolled ? 'bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent' : 'text-white'}`}>CeenAiX</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              {['Features', 'How It Works', 'Pricing', 'Contact'].map(item => (
                <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className={`text-sm font-semibold transition-all duration-300 hover:text-cyan-400 ${scrolled ? 'text-slate-700' : 'text-white/90'}`}>
                  {item}
                </a>
              ))}
              <button onClick={() => navigate('/login')}
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-cyan-500/40 hover:scale-105 transition-all duration-300">
                Sign In
              </button>
            </div>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`md:hidden p-2 ${scrolled ? 'text-slate-700' : 'text-white'}`}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/98 backdrop-blur-xl border-t border-cyan-100 px-4 py-4 space-y-3">
            {['Features', 'How It Works', 'Pricing', 'Contact'].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="block text-slate-700 font-medium py-2">{item}</a>
            ))}
            <button onClick={() => navigate('/login')} className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold">Sign In</button>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Healthcare"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-cyan-900/75 to-blue-900/85" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
        </div>

        {/* Animated blobs */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-cyan-400/10 rounded-full animate-blob blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-400/10 rounded-full animate-blob blur-3xl" style={{ animationDelay: '4s' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 grid lg:grid-cols-2 gap-12 items-center">
          <div ref={heroRef.ref} className={`opacity-0-init ${heroRef.inView ? 'animate-fade-up' : ''}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-400/20 border border-cyan-400/30 backdrop-blur-sm mb-6">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-cyan-300 text-sm font-semibold tracking-wide uppercase">Dubai's #1 AI Healthcare Platform</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-6">
              Your Health,<br />
              <span className="shimmer-text">Intelligently<br />Guided</span>
            </h1>
            <p className="text-lg text-cyan-100/80 mb-8 leading-relaxed max-w-lg">
              DHA-compliant, NABIDH-certified, and trusted by 50,000+ patients across the UAE. Experience AI-powered healthcare that truly knows you.
            </p>
            <div className="flex flex-wrap gap-4 mb-10">
              <button onClick={() => navigate('/sign-up')}
                className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-bold text-base hover:shadow-2xl hover:shadow-cyan-500/40 hover:scale-105 transition-all duration-300 flex items-center gap-2">
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => navigate('/patient/home')}
                className="group px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-2xl font-bold text-base hover:bg-white/20 transition-all duration-300 flex items-center gap-2">
                <Play className="w-4 h-4" /> Watch Demo
              </button>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex -space-x-3">
                {['https://images.pexels.com/photos/5214961/pexels-photo-5214961.jpeg?auto=compress&cs=tinysrgb&w=80',
                  'https://images.pexels.com/photos/3768726/pexels-photo-3768726.jpeg?auto=compress&cs=tinysrgb&w=80',
                  'https://images.pexels.com/photos/6129967/pexels-photo-6129967.jpeg?auto=compress&cs=tinysrgb&w=80',
                  'https://images.pexels.com/photos/4225920/pexels-photo-4225920.jpeg?auto=compress&cs=tinysrgb&w=80'
                ].map((src, i) => (
                  <img key={i} src={src} alt="User" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-white/70 text-sm">Trusted by <span className="text-white font-semibold">50,000+</span> patients</p>
              </div>
            </div>
          </div>

          {/* Portal cards floating panel */}
          <div ref={heroRef.ref} className={`opacity-0-init ${heroRef.inView ? 'animate-slide-left delay-300' : ''}`}>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-white font-bold text-lg">Access Any Portal</p>
                    <p className="text-cyan-200/70 text-sm">6 integrated care platforms</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-cyan-400/20 flex items-center justify-center">
                    <Globe2 className="w-5 h-5 text-cyan-300" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {portals.map((p, i) => {
                    const Icon = p.icon;
                    return (
                      <button key={i} onClick={() => navigate(p.path)}
                        className={`portal-btn flex items-center gap-3 p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/30 group ${activePortal === i ? 'ring-2 ring-cyan-400/60 bg-white/20' : ''}`}>
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white text-xs font-semibold leading-tight">{p.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Live indicator */}
                <div className="mt-4 flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                    </span>
                    <span className="text-white/60 text-xs">All systems operational</span>
                  </div>
                  <span className="text-white/40 text-xs">99.9% uptime</span>
                </div>
              </div>

              {/* Floating notification card */}
              <div className="absolute -top-8 -right-8 bg-white rounded-2xl shadow-2xl p-3.5 w-56 animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0">
                    <Bell className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Lab Results Ready</p>
                    <p className="text-xs text-slate-500">CBC panel — Normal</p>
                  </div>
                </div>
              </div>

              {/* Floating AI card */}
              <div className="absolute -bottom-6 -left-8 bg-white rounded-2xl shadow-2xl p-3.5 w-52 animate-float" style={{ animationDelay: '2.5s' }}>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">AI Insight</p>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">Blood pressure trending — schedule check-in</p>
                <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full w-3/4" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-white/50 text-xs tracking-widest uppercase">Scroll</span>
          <ChevronDown className="w-5 h-5 text-white/50" />
        </div>
      </section>

      {/* Stats Banner */}
      <section ref={statsRef.ref} className="bg-gradient-to-r from-slate-900 via-cyan-900 to-blue-900 py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatCounter value={50000} suffix="+" label="Active Patients" active={statsRef.inView} />
          <StatCounter value={200} suffix="+" label="Healthcare Facilities" active={statsRef.inView} />
          <StatCounter value={1000000} suffix="+" label="Consultations" active={statsRef.inView} />
          <StatCounter value={99} suffix=".9%" label="Platform Uptime" active={statsRef.inView} />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto">
          <div ref={featuresRef.ref} className={`text-center mb-20 opacity-0-init ${featuresRef.inView ? 'animate-fade-up' : ''}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 border border-cyan-200 mb-6">
              <Zap className="w-4 h-4 text-cyan-600" />
              <span className="text-cyan-700 text-sm font-semibold">Platform Capabilities</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-5">
              Everything Modern<br />
              <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Healthcare Needs</span>
            </h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Comprehensive care management powered by cutting-edge AI — built for patients, doctors, and administrators alike.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className={`card-hover group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm opacity-0-init ${featuresRef.inView ? 'animate-fade-up' : ''}`}
                  style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="relative h-44 overflow-hidden">
                    <img src={f.photo} alt={f.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-60`} />
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-semibold">
                        {f.tag}
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4 w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{f.description}</p>
                    <div className="mt-4 flex items-center gap-1 text-cyan-600 text-sm font-semibold group-hover:gap-2 transition-all">
                      Learn more <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 to-cyan-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl animate-blob" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-blue-400/5 rounded-full blur-3xl animate-blob" style={{ animationDelay: '4s' }} />
        </div>
        <div className="max-w-7xl mx-auto relative">
          <div ref={howRef.ref} className={`text-center mb-20 opacity-0-init ${howRef.inView ? 'animate-fade-up' : ''}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/20 mb-6">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-300 text-sm font-semibold">Get Started in Minutes</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-5">Simple, Seamless, Secure</h2>
            <p className="text-xl text-cyan-100/60 max-w-2xl mx-auto">Three steps to your intelligent healthcare journey</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className={`group relative opacity-0-init ${howRef.inView ? 'animate-fade-up' : ''}`} style={{ animationDelay: `${i * 0.15}s` }}>
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-24 left-full w-8 z-10 -translate-x-4">
                      <ArrowRight className="w-6 h-6 text-cyan-400/40" />
                    </div>
                  )}
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-500 hover:border-cyan-400/30">
                    <div className="relative h-48 overflow-hidden">
                      <img src={step.photo} alt={step.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60" />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/80" />
                      <div className="absolute top-4 left-4 w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-xl">
                        <span className="text-white text-xl font-black">{step.num}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-cyan-400/10 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-cyan-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white">{step.title}</h3>
                      </div>
                      <p className="text-cyan-100/60 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div ref={testimonialsRef.ref} className={`text-center mb-16 opacity-0-init ${testimonialsRef.inView ? 'animate-fade-up' : ''}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 mb-6">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-amber-700 text-sm font-semibold">Loved by Patients & Providers</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-5">
              Trusted by Healthcare<br />
              <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Professionals Across the UAE</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className={`card-hover bg-gradient-to-br from-slate-50 to-cyan-50/30 rounded-3xl p-8 border border-slate-100 opacity-0-init ${testimonialsRef.inView ? 'animate-fade-up' : ''}`}
                style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(t.stars)].map((_, si) => <Star key={si} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-slate-600 leading-relaxed mb-6 text-sm">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full object-cover border-2 border-cyan-200" />
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                    <p className="text-slate-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Illustration section - Platform Overview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-cyan-50 to-blue-50">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 border border-cyan-200 mb-6">
              <Lock className="w-4 h-4 text-cyan-700" />
              <span className="text-cyan-700 text-sm font-semibold">Enterprise-Grade Security</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-6">Your Data, Fully Protected</h2>
            <p className="text-slate-600 leading-relaxed mb-8">
              Built from the ground up for UAE healthcare compliance. Every record is encrypted at rest and in transit, with granular access controls and full audit trails.
            </p>
            <div className="space-y-4">
              {[
                { icon: Shield, label: 'DHA-Certified Infrastructure', desc: 'Meets all Dubai Health Authority requirements' },
                { icon: Lock, label: 'End-to-End Encryption', desc: 'AES-256 encryption for all patient data' },
                { icon: FileText, label: 'NABIDH Compliance', desc: 'Full integration with national health registry' },
                { icon: MessageCircle, label: 'Secure Messaging', desc: 'HIPAA-equivalent encrypted communications' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{item.label}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{item.desc}</p>
                    </div>
                    <Check className="w-5 h-5 text-emerald-500 ml-auto flex-shrink-0 mt-0.5" />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.pexels.com/photos/8376277/pexels-photo-8376277.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Security"
                className="w-full h-[480px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
            </div>
            {/* Floating trust badge */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-5 animate-float">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900">NABIDH Certified</p>
                  <p className="text-xs text-slate-500">Verified 2026</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => <div key={i} className="w-4 h-1 rounded-full bg-emerald-400" />)}
              </div>
            </div>
            {/* Floating stats card */}
            <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 animate-float" style={{ animationDelay: '2s' }}>
              <p className="text-xs text-slate-500 mb-1">Data Breaches</p>
              <p className="text-2xl font-black text-emerald-600">Zero</p>
              <p className="text-xs text-slate-400">Since inception</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-28 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div ref={pricingRef.ref} className={`text-center mb-16 opacity-0-init ${pricingRef.inView ? 'animate-fade-up' : ''}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 mb-6">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700 text-sm font-semibold">Transparent Pricing</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-5">Choose Your Plan</h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">Flexible pricing for individuals, providers, and large organizations</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-start">
            {plans.map((plan, i) => (
              <div key={i} className={`opacity-0-init ${pricingRef.inView ? 'animate-fade-up' : ''} ${plan.highlighted ? 'relative' : ''}`}
                style={{ animationDelay: `${i * 0.12}s` }}>
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white text-xs font-bold shadow-lg whitespace-nowrap z-10">
                    Most Popular
                  </div>
                )}
                <div className={`rounded-3xl p-8 ${plan.highlighted
                  ? 'bg-gradient-to-br from-slate-900 to-cyan-900 border-2 border-cyan-400/30 shadow-2xl shadow-cyan-500/20'
                  : 'bg-slate-50 border border-slate-200 hover:border-slate-300'
                } transition-all duration-300 hover:shadow-xl`}>
                  <h3 className={`text-xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h3>
                  <div className={`text-4xl font-black mb-1 ${plan.highlighted ? 'text-white' : 'text-slate-900'}`}>{plan.price}</div>
                  {plan.period && <p className={`text-sm mb-2 ${plan.highlighted ? 'text-cyan-300' : 'text-slate-500'}`}>{plan.period}</p>}
                  <p className={`text-sm mb-7 ${plan.highlighted ? 'text-cyan-100/60' : 'text-slate-500'}`}>{plan.description}</p>
                  <button onClick={() => navigate('/login')}
                    className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 mb-7 ${plan.highlighted
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/30 hover:scale-105'
                      : 'bg-white border border-slate-200 text-slate-900 hover:border-slate-300 hover:shadow-md'
                    }`}>
                    {plan.cta}
                  </button>
                  <ul className="space-y-3">
                    {plan.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${plan.highlighted ? 'bg-cyan-400/20' : 'bg-emerald-100'}`}>
                          <Check className={`w-3 h-3 ${plan.highlighted ? 'text-cyan-400' : 'text-emerald-600'}`} />
                        </div>
                        <span className={`text-sm ${plan.highlighted ? 'text-cyan-100/80' : 'text-slate-600'}`}>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/3938022/pexels-photo-3938022.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="CTA"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/95 via-blue-900/90 to-slate-900/95" />
        </div>
        <div ref={ctaRef.ref} className={`relative max-w-4xl mx-auto text-center opacity-0-init ${ctaRef.inView ? 'animate-fade-up' : ''}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/20 mb-8">
            <Heart className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-300 text-sm font-semibold">Start Your Health Journey</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            Ready to Experience<br />
            <span className="shimmer-text">Smarter Healthcare?</span>
          </h2>
          <p className="text-xl text-cyan-100/70 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of patients and healthcare providers across the UAE who trust CeenAiX to deliver intelligent, secure, and seamless care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/sign-up')}
              className="group px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-cyan-500/40 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
              Get Started Free
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => navigate('/login')}
              className="px-10 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-2xl font-bold text-lg hover:bg-white/20 transition-all duration-300">
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-5">
                <img src="/ChatGPT_Image_Feb_27,_2026,_11_29_01_AM.png" alt="CeenAiX" className="w-10 h-10 object-contain" />
                <span className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">CeenAiX</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
                Dubai's leading AI-powered healthcare platform. DHA-compliant, NABIDH-certified, and trusted by thousands across the UAE.
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-500 text-xs">All systems operational</span>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-5 text-sm uppercase tracking-widest text-slate-400">Product</h4>
              <ul className="space-y-3 text-slate-500 text-sm">
                {['Features', 'Pricing', 'Security', 'Integrations'].map(item => (
                  <li key={item}><a href="#" className="hover:text-cyan-400 transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-5 text-sm uppercase tracking-widest text-slate-400">Company</h4>
              <ul className="space-y-3 text-slate-500 text-sm">
                {['About Us', 'Careers', 'Contact', 'Blog'].map(item => (
                  <li key={item}><a href="#" className="hover:text-cyan-400 transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-5 text-sm uppercase tracking-widest text-slate-400">Legal</h4>
              <ul className="space-y-3 text-slate-500 text-sm">
                {['Privacy Policy', 'Terms of Service', 'Compliance', 'NABIDH'].map(item => (
                  <li key={item}><a href="#" className="hover:text-cyan-400 transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-600 text-sm">© 2026 CeenAiX Healthcare Technologies, Dubai, UAE. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-400 text-xs">DHA Certified</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-slate-400 text-xs">NABIDH Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
