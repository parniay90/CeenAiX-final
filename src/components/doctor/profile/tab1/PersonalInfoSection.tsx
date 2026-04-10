import React, { useState } from 'react';
import { User, CreditCard as Edit2, Save, X, Eye, Plus } from 'lucide-react';

interface PersonalInfoSectionProps {
  showToast: (msg: string, type?: 'success' | 'warning') => void;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ showToast }) => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('Dr. Ahmed Khalid Al Rashidi');
  const [nameAr, setNameAr] = useState('د. أحمد خالد الراشدي');
  const [mobile, setMobile] = useState('+971 50 XXX XXXX');
  const [email, setEmail] = useState('ahmed.alrashidi@alnoormc.ae');
  const [showId, setShowId] = useState(false);
  const [languages, setLanguages] = useState([
    { code: 'ar', flag: '🇦🇪', label: 'Arabic', level: 'Native' },
    { code: 'en', flag: '🇬🇧', label: 'English', level: 'Fluent' },
  ]);

  const handleSave = () => {
    setEditing(false);
    showToast('✅ Personal info updated');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
            <User className="w-4 h-4 text-teal-600" />
          </div>
          <h2 className="text-[16px] font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Personal Information
          </h2>
        </div>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-[12px] text-slate-600 font-medium transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSave}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-teal-500 hover:bg-teal-600 rounded-lg text-[12px] text-white font-medium transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
            <button
              onClick={() => setEditing(false)}
              className="flex items-center space-x-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-[12px] text-slate-500 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      <div className="divide-y divide-slate-50">
        <div className="grid grid-cols-2 divide-x divide-slate-50">
          <FieldRow label="Full Name (EN)" readOnly={!editing}>
            {editing ? (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-teal-400 text-slate-900"
              />
            ) : (
              <span className="text-[14px] text-slate-900">{name}</span>
            )}
          </FieldRow>
          <FieldRow label="Full Name (Arabic)" readOnly={!editing}>
            {editing ? (
              <input
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                dir="rtl"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-teal-400 text-slate-900 text-right"
              />
            ) : (
              <span className="text-[14px] text-slate-900">{nameAr}</span>
            )}
          </FieldRow>
        </div>
        <div className="grid grid-cols-2 divide-x divide-slate-50">
          <FieldRow label="Date of Birth" readOnly>
            <span className="text-[14px] text-slate-900">15 September 1980 (45 years)</span>
            <p className="text-[11px] text-slate-400 italic mt-0.5">Cannot be changed — contact DHA</p>
          </FieldRow>
          <FieldRow label="Gender" readOnly>
            <span className="text-[14px] text-slate-900">Male</span>
          </FieldRow>
        </div>
        <div className="grid grid-cols-2 divide-x divide-slate-50">
          <FieldRow label="Nationality" readOnly>
            <span className="text-[14px] text-slate-900">🇦🇪 Emirati</span>
          </FieldRow>
          <FieldRow label="Emirates ID" readOnly>
            <div className="flex items-center space-x-2">
              <span className="text-[14px] text-slate-900 font-mono" style={{ fontFamily: 'DM Mono, monospace' }}>
                {showId ? '784-1980-1234567-1' : '784-1980-●●●●●●●-●'}
              </span>
              <button
                onClick={() => { setShowId(true); setTimeout(() => setShowId(false), 30000); showToast('👁 Emirates ID revealed — logged to audit'); }}
                className="text-[11px] text-teal-600 hover:text-teal-700 font-medium transition-colors flex items-center space-x-0.5"
              >
                <Eye className="w-3 h-3" />
                <span>Reveal 30s</span>
              </button>
            </div>
          </FieldRow>
        </div>

        <div className="px-6 py-4">
          <p className="text-[11px] uppercase tracking-widest text-slate-400 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>Languages</p>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => (
              <div key={lang.code} className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full">
                <span>{lang.flag}</span>
                <span className="text-[13px] text-slate-700 font-medium">{lang.label}</span>
                <span className="text-[11px] text-slate-400">({lang.level})</span>
                {editing && (
                  <button onClick={() => setLanguages((l) => l.filter((x) => x.code !== lang.code))} className="text-slate-300 hover:text-red-400 transition-colors ml-1">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
            {editing && (
              <button
                onClick={() => showToast('✅ Language picker opened')}
                className="flex items-center space-x-1 px-3 py-1.5 border border-dashed border-teal-300 text-teal-600 rounded-full text-[12px] hover:bg-teal-50 transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>Add Language</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 divide-x divide-slate-50">
          <FieldRow label="Mobile (Work)" readOnly={!editing}>
            {editing ? (
              <input
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-teal-400 text-slate-900"
              />
            ) : (
              <span className="text-[14px] text-slate-900">{mobile}</span>
            )}
          </FieldRow>
          <FieldRow label="Work Email" readOnly={!editing}>
            {editing ? (
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-teal-400 text-slate-900"
              />
            ) : (
              <span className="text-[14px] text-slate-900">{email}</span>
            )}
          </FieldRow>
        </div>
      </div>
    </div>
  );
};

const FieldRow: React.FC<{ label: string; readOnly?: boolean; children: React.ReactNode }> = ({ label, children }) => (
  <div className="px-6 py-4">
    <p className="text-[11px] uppercase tracking-widest text-slate-400 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>{label}</p>
    <div>{children}</div>
  </div>
);

export default PersonalInfoSection;
