import { useState } from 'react';
import {
  Activity,
  Shield,
  Brain,
  Users,
  Clock,
  Award,
  ChevronRight,
  Check,
  Menu,
  X
} from 'lucide-react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Health Insights',
      description: 'Get personalized health recommendations powered by advanced AI technology'
    },
    {
      icon: Shield,
      title: 'DHA-Compliant & Secure',
      description: 'Fully compliant with UAE healthcare regulations and NABIDH-certified'
    },
    {
      icon: Clock,
      title: '24/7 Health Guardian',
      description: 'Round-the-clock access to your health data and AI assistant'
    },
    {
      icon: Users,
      title: 'Integrated Care Teams',
      description: 'Seamless collaboration between doctors, pharmacies, and laboratories'
    },
    {
      icon: Activity,
      title: 'Real-time Monitoring',
      description: 'Track your health metrics and receive instant alerts'
    },
    {
      icon: Award,
      title: 'Premium Care Experience',
      description: 'Dubai\'s leading healthcare platform trusted by thousands'
    }
  ];

  const plans = [
    {
      name: 'Patient',
      price: 'Free',
      description: 'For individuals managing their health',
      features: [
        'AI Health Assistant',
        'Digital Health Records',
        'Appointment Booking',
        'Prescription Management',
        'Lab Results Access',
        'Telemedicine Consultations'
      ]
    },
    {
      name: 'Healthcare Provider',
      price: 'Custom',
      description: 'For clinics, hospitals, and healthcare facilities',
      features: [
        'Everything in Patient, plus:',
        'Multi-user Management',
        'Advanced Analytics',
        'Clinical Workflows',
        'Integration Support',
        'Priority Support',
        'Compliance Tools'
      ],
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: 'Contact Us',
      description: 'For large organizations and health systems',
      features: [
        'Everything in Healthcare Provider, plus:',
        'Custom Integrations',
        'Dedicated Account Manager',
        'SLA Guarantees',
        'White-label Options',
        'Advanced Security',
        'Training & Onboarding'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-cyan-100 z-50 shadow-sm shadow-cyan-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3 animate-fadeIn">
              <img
                src="/ChatGPT_Image_Feb_27,_2026,_11_29_01_AM.png"
                alt="CeenAiX Logo"
                className="w-12 h-12 object-contain hover:scale-110 transition-transform duration-300 animate-float"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">CeenAiX</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-600 hover:text-cyan-600 transition-all duration-300 font-medium">Features</a>
              <a href="#how-it-works" className="text-slate-600 hover:text-cyan-600 transition-all duration-300 font-medium">How It Works</a>
              <a href="#pricing" className="text-slate-600 hover:text-cyan-600 transition-all duration-300 font-medium">Pricing</a>
              <a href="#contact" className="text-slate-600 hover:text-cyan-600 transition-all duration-300 font-medium">Contact</a>
              <button
                onClick={() => window.location.href = '/login'}
                className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-105"
              >
                Sign In
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-gray-600 hover:text-gray-900">Features</a>
              <a href="#how-it-works" className="block text-gray-600 hover:text-gray-900">How It Works</a>
              <a href="#pricing" className="block text-gray-600 hover:text-gray-900">Pricing</a>
              <a href="#contact" className="block text-gray-600 hover:text-gray-900">Contact</a>
              <button
                onClick={() => window.location.href = '/login'}
                className="w-full px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-cyan-50 via-blue-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzA2YjZkNCIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-50"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight animate-slideUp">
              Your Health,<br />
              <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Intelligently Guided</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Dubai's leading AI-powered healthcare platform. DHA-compliant, NABIDH-certified,
              and trusted by thousands of patients and healthcare providers across the UAE.
            </p>

            <div className="mb-12">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Access Portal Demos</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
                <button
                  onClick={() => window.location.href = '/patient/home'}
                  className="px-4 py-3 bg-white text-gray-900 border-2 border-teal-600 rounded-lg hover:bg-teal-50 transition-colors font-medium"
                >
                  Patient Portal
                </button>
                <button
                  onClick={() => window.location.href = '/doctor/dashboard'}
                  className="px-4 py-3 bg-white text-gray-900 border-2 border-teal-600 rounded-lg hover:bg-teal-50 transition-colors font-medium"
                >
                  Doctor Portal
                </button>
                <button
                  onClick={() => window.location.href = '/pharmacy/dashboard'}
                  className="px-4 py-3 bg-white text-gray-900 border-2 border-teal-600 rounded-lg hover:bg-teal-50 transition-colors font-medium"
                >
                  Pharmacy Portal
                </button>
                <button
                  onClick={() => window.location.href = '/lab/dashboard'}
                  className="px-4 py-3 bg-white text-gray-900 border-2 border-teal-600 rounded-lg hover:bg-teal-50 transition-colors font-medium"
                >
                  Lab & Radiology Portal
                </button>
                <button
                  onClick={() => window.location.href = '/insurance/dashboard'}
                  className="px-4 py-3 bg-white text-gray-900 border-2 border-teal-600 rounded-lg hover:bg-teal-50 transition-colors font-medium"
                >
                  Insurance Portal
                </button>
                <button
                  onClick={() => window.location.href = '/admin/dashboard'}
                  className="px-4 py-3 bg-white text-gray-900 border-2 border-amber-600 rounded-lg hover:bg-amber-50 transition-colors font-medium"
                >
                  Admin Portal
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-teal-600 mb-2">50K+</div>
              <div className="text-gray-600">Active Patients</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-teal-600 mb-2">200+</div>
              <div className="text-gray-600">Healthcare Facilities</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-teal-600 mb-2">1M+</div>
              <div className="text-gray-600">Consultations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-teal-600 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Modern Healthcare
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive healthcare management powered by cutting-edge AI technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl border-2 border-gray-200 hover:border-teal-500 hover:shadow-lg transition-all">
                <div className="w-14 h-14 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Seamless, Secure
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started with CeenAiX in just a few minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Sign Up</h3>
              <p className="text-gray-600">
                Create your account with Emirates ID verification in under 5 minutes
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Connect</h3>
              <p className="text-gray-600">
                Link your existing health records and insurance information
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Start</h3>
              <p className="text-gray-600">
                Begin your intelligent healthcare journey with AI-powered insights
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Flexible pricing for individuals and organizations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl p-8 ${
                  plan.highlighted
                    ? 'border-2 border-teal-600 shadow-xl scale-105'
                    : 'border-2 border-gray-200'
                }`}
              >
                {plan.highlighted && (
                  <div className="bg-teal-600 text-white text-sm font-medium px-3 py-1 rounded-full inline-block mb-4">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">{plan.price}</div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <button
                  onClick={() => window.location.href = '/signup'}
                  className={`w-full py-3 rounded-lg font-medium transition-colors mb-6 ${
                    plan.highlighted
                      ? 'bg-teal-600 text-white hover:bg-teal-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Get Started
                </button>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-teal-600 to-teal-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Healthcare Experience?
          </h2>
          <p className="text-xl text-teal-100 mb-8">
            Join thousands of patients and healthcare providers using CeenAiX
          </p>
          <button
            onClick={() => window.location.href = '/signup'}
            className="px-8 py-4 bg-white text-teal-600 rounded-lg hover:bg-gray-100 transition-colors text-lg font-medium inline-flex items-center gap-2"
          >
            Get Started Today
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">CeenAiX</span>
              </div>
              <p className="text-gray-400">
                Your Health, Intelligently Guided
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#contact" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2026 CeenAiX Healthcare Technologies, Dubai, UAE. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
