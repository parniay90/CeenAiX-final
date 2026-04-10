import React, { useState } from 'react';
import { Stethoscope, CreditCard as Edit2, Save, X, Plus, CheckCircle2 } from 'lucide-react';

interface ProfessionalInfoSectionProps {
  showToast: (msg: string, type?: 'success' | 'warning') => void;
}

const certifications = [
  { name: 'Arabian Board of Cardiology', year: 2009 },
  { name: 'FESC — Fellow of the European Society of Cardiology', year: 2014 },
  { name: 'Interventional Cardiology Certificate — ACC', year: 2013 },
];

const ProfessionalInfoSection: React.FC<ProfessionalInfoSectionProps> = ({ showToast }) => {
  const [editing, setEditing] = useState(false);
  const [designation, setDesignation] = useState('Consultant Cardiologist');
  const [subSpecialty, setSubSpecialty] = useState('Interventional Cardiology');
  const [medSchool, setMedSchool] = useState('UAE University — College of Medicine & Health Sciences');
  const [gradYear, setGradYear] = useState('2004');
  const [postGrad, setPostGrad] = useState('Fellowship — Interventional Cardiology\nCleveland Clinic Abu Dhabi (2011–2013)');
  const [certs, setCerts] = useState(certifications);

  const handleSave = () => { setEditing(false); showToast('✅ Professional info updated'); };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
            <Stethoscope className="w-4 h-4 text-teal-600" />
          </div>
          <h2 className="text-[16px] font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Professional Information
          </h2>
        </div>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-[12px] text-slate-600 font-medium transition-colors">
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        ) : (
          <div className="flex items-center space-x-2">
            <button onClick={handleSave} className="flex items-center space-x-1.5 px-3 py-1.5 bg-teal-500 hover:bg-teal-600 rounded-lg text-[12px] text-white font-medium transition-colors">
              <Save className="w-3.5 h-3.5" /><span>Save</span>
            </button>
            <button onClick={() => setEditing(false)} className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
              <X className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>
        )}
      </div>

      <div className="divide-y divide-slate-50">
        <div className="grid grid-cols-2 divide-x divide-slate-50">
          <div className="px-6 py-4">
            <p className="text-[11px] uppercase tracking-widest text-slate-400 mb-1.5">Designation</p>
            {editing ? (
              <select value={designation} onChange={(e) => setDesignation(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-teal-400">
                <option>Consultant Cardiologist</option>
                <option>Specialist Cardiologist</option>
                <option>General Practitioner</option>
                <option>Registrar</option>
              </select>
            ) : (
              <span className="text-[14px] text-slate-900">{designation}</span>
            )}
          </div>
          <div className="px-6 py-4">
            <p className="text-[11px] uppercase tracking-widest text-slate-400 mb-1.5">Primary Specialty</p>
            <span className="text-[14px] text-slate-900">Cardiology</span>
            <p className="text-[11px] text-slate-400 italic mt-0.5">Linked to DHA license — cannot edit</p>
          </div>
        </div>

        <div className="grid grid-cols-2 divide-x divide-slate-50">
          <div className="px-6 py-4">
            <p className="text-[11px] uppercase tracking-widest text-slate-400 mb-1.5">Sub-Specialty</p>
            {editing ? (
              <select value={subSpecialty} onChange={(e) => setSubSpecialty(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-teal-400">
                <option>Interventional Cardiology</option>
                <option>Electrophysiology</option>
                <option>Heart Failure</option>
                <option>Echocardiography</option>
              </select>
            ) : (
              <span className="text-[14px] text-slate-900">{subSpecialty}</span>
            )}
          </div>
          <div className="px-6 py-4">
            <p className="text-[11px] uppercase tracking-widest text-slate-400 mb-1.5">Years of Experience</p>
            <span className="text-[14px] font-bold text-teal-600" style={{ fontFamily: 'DM Mono, monospace' }}>22 years</span>
            <p className="text-[11px] text-slate-400 italic mt-0.5">Auto-calculated from graduation year</p>
          </div>
        </div>

        <div className="grid grid-cols-2 divide-x divide-slate-50">
          <div className="px-6 py-4">
            <p className="text-[11px] uppercase tracking-widest text-slate-400 mb-1.5">Medical School</p>
            {editing ? (
              <input value={medSchool} onChange={(e) => setMedSchool(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-teal-400" />
            ) : (
              <span className="text-[14px] text-slate-900">{medSchool}</span>
            )}
          </div>
          <div className="px-6 py-4">
            <p className="text-[11px] uppercase tracking-widest text-slate-400 mb-1.5">Graduation Year</p>
            {editing ? (
              <select value={gradYear} onChange={(e) => setGradYear(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-teal-400">
                {Array.from({ length: 40 }, (_, i) => 2010 - i).map((y) => <option key={y}>{y}</option>)}
              </select>
            ) : (
              <span className="text-[14px] text-slate-900" style={{ fontFamily: 'DM Mono, monospace' }}>{gradYear}</span>
            )}
          </div>
        </div>

        <div className="px-6 py-4">
          <p className="text-[11px] uppercase tracking-widest text-slate-400 mb-1.5">Post-Graduate Training</p>
          {editing ? (
            <textarea value={postGrad} onChange={(e) => setPostGrad(e.target.value)} rows={3} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none" />
          ) : (
            <p className="text-[14px] text-slate-900 whitespace-pre-line">{postGrad}</p>
          )}
        </div>

        <div className="px-6 py-4">
          <p className="text-[11px] uppercase tracking-widest text-slate-400 mb-2">Board Certifications</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {certs.map((cert, i) => (
              <div key={i} className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[12px] text-emerald-700 font-medium">{cert.name} ({cert.year})</span>
                {editing && (
                  <button onClick={() => setCerts((c) => c.filter((_, j) => j !== i))} className="text-emerald-300 hover:text-red-400 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
            {editing && (
              <button
                onClick={() => showToast('✅ Add certification modal opened')}
                className="flex items-center space-x-1 px-3 py-1.5 border border-dashed border-emerald-300 text-emerald-600 rounded-full text-[12px] hover:bg-emerald-50 transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>Add Certification</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalInfoSection;
