import React, { useState } from 'react';
import { PenLine, CreditCard as Edit2, Save, X, Bot, Plus } from 'lucide-react';

const DEFAULT_BIO = `Dr. Ahmed Al Rashidi is a Consultant Cardiologist and Interventional Cardiology specialist at Al Noor Medical Center, Dubai. With over 20 years of clinical experience, he has performed more than 2,000 coronary interventions and specializes in complex PCI, STEMI management, and structural heart disease.

Dr. Al Rashidi completed his Fellowship in Interventional Cardiology at Cleveland Clinic Abu Dhabi and holds board certifications from the Arabian Board of Cardiology, the European Society of Cardiology (FESC), and the American College of Cardiology (ACC).

He is committed to evidence-based, patient-centered cardiology and communicates fluently in Arabic and English.`;

interface BioSectionProps {
  showToast: (msg: string, type?: 'success' | 'warning') => void;
  onBioChange: (bio: string) => void;
}

const BioSection: React.FC<BioSectionProps> = ({ showToast, onBioChange }) => {
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(DEFAULT_BIO);
  const [draftBio, setDraftBio] = useState(bio);
  const [generating, setGenerating] = useState(false);
  const [arabicBio, setArabicBio] = useState('');
  const [editingAr, setEditingAr] = useState(false);

  const handleSave = () => {
    setBio(draftBio);
    onBioChange(draftBio);
    setEditing(false);
    showToast('✅ Bio saved');
  };

  const handleAiGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setDraftBio(DEFAULT_BIO);
      setGenerating(false);
      showToast('✅ AI bio generated — please review before saving');
    }, 1500);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
            <PenLine className="w-4 h-4 text-teal-600" />
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              About Me (Public Bio)
            </h2>
            <p className="text-[12px] text-slate-400">Shown to patients on your public profile</p>
          </div>
        </div>
        {!editing ? (
          <button onClick={() => { setEditing(true); setDraftBio(bio); }} className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-[12px] text-slate-600 font-medium transition-colors">
            <Edit2 className="w-3.5 h-3.5" /><span>Edit</span>
          </button>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleAiGenerate}
              disabled={generating}
              className="flex items-center space-x-1.5 px-3 py-1.5 border border-indigo-300 text-indigo-600 hover:bg-indigo-50 rounded-lg text-[12px] font-medium transition-colors disabled:opacity-50"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>{generating ? 'Generating...' : 'AI Bio Assist'}</span>
            </button>
            <button onClick={handleSave} className="flex items-center space-x-1.5 px-3 py-1.5 bg-teal-500 hover:bg-teal-600 rounded-lg text-[12px] text-white font-medium transition-colors">
              <Save className="w-3.5 h-3.5" /><span>Save</span>
            </button>
            <button onClick={() => setEditing(false)} className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
              <X className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>
        )}
      </div>

      <div className="px-6 py-5">
        {editing ? (
          <>
            <textarea
              value={draftBio}
              onChange={(e) => setDraftBio(e.target.value)}
              rows={8}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none leading-relaxed"
              style={{ fontFamily: 'Inter, sans-serif' }}
            />
            <p className="text-[11px] text-slate-400 mt-1.5 text-right">{draftBio.length} / 1000 characters</p>
          </>
        ) : (
          <p className="text-[14px] text-slate-700 leading-relaxed whitespace-pre-line" style={{ fontFamily: 'Inter, sans-serif' }}>
            {bio}
          </p>
        )}

        <div className="mt-5 pt-4 border-t border-slate-100">
          <p className="text-[11px] uppercase tracking-widest text-slate-400 mb-2">Arabic Bio</p>
          {arabicBio ? (
            <div>
              {editingAr ? (
                <div className="space-y-2">
                  <textarea
                    value={arabicBio}
                    onChange={(e) => setArabicBio(e.target.value)}
                    dir="rtl"
                    rows={4}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none text-right"
                  />
                  <button onClick={() => { setEditingAr(false); showToast('✅ Arabic bio saved'); }} className="px-4 py-2 bg-teal-500 text-white rounded-lg text-[13px] font-medium">
                    Save Arabic Bio
                  </button>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <p className="text-[14px] text-slate-700 text-right flex-1" dir="rtl">{arabicBio}</p>
                  <button onClick={() => setEditingAr(true)} className="ml-3 text-[12px] text-teal-600 hover:text-teal-700 flex-shrink-0">Edit</button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <button
                onClick={() => { setArabicBio('د. أحمد الراشدي أخصائي القسطرة القلبية في مركز النور الطبي.'); }}
                className="flex items-center space-x-1.5 text-[13px] text-teal-600 hover:text-teal-700 font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Arabic bio</span>
              </button>
              <p className="text-[11px] text-slate-400 italic mt-1">Increases bookings from Arabic-speaking patients</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BioSection;
