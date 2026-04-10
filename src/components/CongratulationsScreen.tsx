import { useEffect, useState } from 'react';
import { CheckCircle2, Sparkles, Shield, Heart } from 'lucide-react';

export default function CongratulationsScreen() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowContent(true), 300);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-white relative overflow-hidden">
      <div className="confetti-container">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="confetti"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              backgroundColor: i % 2 === 0 ? '#0D9488' : '#F59E0B',
            }}
          />
        ))}
      </div>

      <div className={`max-w-2xl mx-auto px-6 text-center transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="mb-8 relative">
          <div className="inline-block relative">
            <div className="w-32 h-32 bg-teal-600 rounded-full flex items-center justify-center mx-auto animate-scaleIn">
              <CheckCircle2 className="w-20 h-20 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 animate-pulse">
              <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-['Playfair_Display']">
          Welcome to CeenAiX
        </h1>
        <p className="text-2xl text-teal-600 font-semibold mb-8">
          Your Health Guardian is Ready
        </p>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex flex-col items-center p-4">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-3">
                <Shield className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">DHA Compliant</h3>
              <p className="text-sm text-gray-600">Your data is secure and compliant</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-3">
                <Sparkles className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">AI-Powered</h3>
              <p className="text-sm text-gray-600">Intelligent health insights</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-3">
                <Heart className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">24/7 Access</h3>
              <p className="text-sm text-gray-600">Your health, anytime, anywhere</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-900 mb-3">What's Next?</h3>
            <ul className="text-left space-y-2 max-w-md mx-auto">
              <li className="flex items-start gap-2 text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Complete your health profile in your dashboard</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Schedule your first appointment</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Explore AI health insights and recommendations</span>
              </li>
            </ul>
          </div>
        </div>

        <button className="bg-teal-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-teal-700 transition-colors shadow-lg">
          Go to Dashboard
        </button>

        <p className="mt-6 text-sm text-gray-500">
          Need help? Contact our support team at{' '}
          <a href="mailto:support@ceenaix.ae" className="text-teal-600 hover:underline">
            support@ceenaix.ae
          </a>
        </p>
      </div>

      <style>{`
        .confetti-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
        }

        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          top: -10px;
          animation: confetti-fall linear infinite;
        }

        @keyframes confetti-fall {
          to {
            transform: translateY(100vh) rotate(360deg);
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
