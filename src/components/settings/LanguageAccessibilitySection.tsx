import { useState } from 'react';
import { Globe, Type, Eye, Accessibility, CheckCircle } from 'lucide-react';

export default function LanguageAccessibilitySection() {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large' | 'xl'>('medium');
  const [highContrast, setHighContrast] = useState(false);
  const [screenReaderOptimized, setScreenReaderOptimized] = useState(false);

  const fontSizeLabels = {
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
    xl: 'Extra Large',
  };

  const fontSizeSamples = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xl: 'text-xl',
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-teal-400" />
          <h3 className="text-lg font-bold text-white">Platform Language</h3>
        </div>
        <p className="text-sm text-slate-400 mb-4">
          Select your preferred language. The interface will update immediately.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setLanguage('en')}
            className={`p-4 rounded-lg border-2 transition-all ${
              language === 'en'
                ? 'border-teal-600 bg-teal-600 bg-opacity-10'
                : 'border-slate-600 bg-slate-700 hover:border-slate-500'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-white">English</span>
              {language === 'en' && <CheckCircle className="w-5 h-5 text-teal-400" />}
            </div>
            <p className="text-xs text-slate-400 text-left">Left-to-right layout</p>
          </button>

          <button
            onClick={() => setLanguage('ar')}
            className={`p-4 rounded-lg border-2 transition-all ${
              language === 'ar'
                ? 'border-teal-600 bg-teal-600 bg-opacity-10'
                : 'border-slate-600 bg-slate-700 hover:border-slate-500'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-white">العربية</span>
              {language === 'ar' && <CheckCircle className="w-5 h-5 text-teal-400" />}
            </div>
            <p className="text-xs text-slate-400 text-left">Right-to-left layout</p>
          </button>
        </div>

        {language === 'ar' && (
          <div className="mt-4 p-4 bg-blue-900 bg-opacity-20 border border-blue-600 rounded-lg">
            <p className="text-sm text-blue-200">
              The interface will switch to right-to-left (RTL) layout when Arabic is selected. All text alignment and navigation will be mirrored accordingly.
            </p>
          </div>
        )}
      </div>

      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Type className="w-5 h-5 text-teal-400" />
          <h3 className="text-lg font-bold text-white">Font Size</h3>
        </div>
        <p className="text-sm text-slate-400 mb-4">
          Adjust the text size for better readability throughout the application.
        </p>

        <div className="mb-6">
          <input
            type="range"
            min="0"
            max="3"
            value={['small', 'medium', 'large', 'xl'].indexOf(fontSize)}
            onChange={(e) => {
              const sizes: Array<'small' | 'medium' | 'large' | 'xl'> = ['small', 'medium', 'large', 'xl'];
              setFontSize(sizes[parseInt(e.target.value)]);
            }}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-600"
          />
          <div className="flex justify-between mt-2">
            {Object.entries(fontSizeLabels).map(([key, label]) => (
              <span
                key={key}
                className={`text-xs ${
                  fontSize === key ? 'text-teal-400 font-bold' : 'text-slate-500'
                }`}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-700 rounded-lg">
          <p className={`${fontSizeSamples[fontSize]} text-white`}>
            Sample text: This is how your text will appear with the selected font size.
          </p>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-5 h-5 text-teal-400" />
          <h3 className="text-lg font-bold text-white">Visual Settings</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-start justify-between p-4 bg-slate-700 rounded-lg">
            <div className="flex-1">
              <h4 className="text-sm font-bold text-white mb-1">High Contrast Mode</h4>
              <p className="text-xs text-slate-400">
                Increase contrast between text and backgrounds for improved visibility.
              </p>
            </div>
            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                highContrast ? 'bg-teal-600' : 'bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  highContrast ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {highContrast && (
            <div className="p-4 bg-white border-2 border-black rounded-lg">
              <p className="text-sm font-bold text-black mb-2">High Contrast Preview</p>
              <p className="text-xs text-black">
                In high contrast mode, the interface uses maximum contrast colors for better readability. Text will be displayed in pure black on white backgrounds.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Accessibility className="w-5 h-5 text-teal-400" />
          <h3 className="text-lg font-bold text-white">Accessibility Features</h3>
        </div>

        <div className="flex items-start justify-between p-4 bg-slate-700 rounded-lg">
          <div className="flex-1">
            <h4 className="text-sm font-bold text-white mb-1">Screen Reader Optimized</h4>
            <p className="text-xs text-slate-400">
              Enable enhanced compatibility with screen readers and assistive technologies. Adds descriptive labels and navigation landmarks.
            </p>
          </div>
          <button
            onClick={() => setScreenReaderOptimized(!screenReaderOptimized)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              screenReaderOptimized ? 'bg-teal-600' : 'bg-slate-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                screenReaderOptimized ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="bg-blue-900 bg-opacity-20 border border-blue-600 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Accessibility className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-blue-300 mb-1">Accessibility Commitment</h4>
            <p className="text-xs text-blue-200">
              CeenAiX is committed to meeting WCAG 2.1 Level AA accessibility standards. If you encounter any accessibility barriers, please contact our support team.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors">
          Cancel
        </button>
        <button className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
}
