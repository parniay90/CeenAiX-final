import React, { useState } from 'react';
import DoctorSidebarNew from '../components/doctor/DoctorSidebarNew';
import { Scan, Eye, Activity, Calendar, AlertCircle, Search, Plus, FileText, Printer, Share2, CreditCard as Edit3, Maximize2, Copy, Lock, ChevronDown, ChevronUp, X, CheckCircle2, Clock, ArrowLeft, Bot, Send, Heart, ScanLine, Zap, Radio, HeartPulse, Download } from 'lucide-react';
import type { ImagingStudy, ImagingModality, FindingSeverity } from '../types/imaging';

export default function DoctorImaging() {
  const [selectedStudy, setSelectedStudy] = useState<ImagingStudy | null>(null);
  const [filterModality, setFilterModality] = useState<ImagingModality | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOrderPanel, setShowOrderPanel] = useState(false);
  const [editingNote, setEditingNote] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [expandedGroups, setExpandedGroups] = useState({
    inProgress: true,
    scheduled: true,
    reviewed: false
  });

  const mockStudies: ImagingStudy[] = [
    {
      id: 'IMG-001',
      patientId: 'PT-008',
      patientName: 'Noura Bint Khalid Al Hamdan',
      patientAge: '34F',
      patientGender: 'Female',
      insurance: 'Daman Basic',
      modality: 'Holter',
      studyType: '24-hour Ambulatory ECG (Holter Monitor)',
      studyDate: '2026-04-07',
      orderedBy: 'Dr. Ahmed Al Rashidi',
      performedAt: 'Al Noor Cardiology Suite',
      accessionNumber: 'IMG-2026-0407-5001',
      status: 'in_progress',
      indication: 'Palpitations 6 weeks — rule out arrhythmia (SVT, AF, PVCs)',
      deviceInfo: 'Al Noor Cardiology Suite — Device #HC-7',
      returnTime: 'Thursday, 8 April 2026, 10:00 AM',
      elapsedTime: '0h 37min',
      findings: [],
      impression: 'Recording in progress',
      technique: '24-hour ambulatory ECG monitoring. Patient wearing device.'
    },
    {
      id: 'IMG-002',
      patientId: 'PT-004',
      patientName: 'Mohammed Rashid Al Shamsi',
      patientAge: '48M',
      patientGender: 'Male',
      insurance: 'Daman Basic',
      modality: 'Stress Echo',
      studyType: 'Exercise Stress Echocardiogram',
      studyDate: '2026-04-08',
      scheduledTime: 'Tomorrow 9:00 AM',
      orderedBy: 'Dr. Ahmed Al Rashidi',
      performedAt: 'Al Noor Cardiology Imaging Suite, Floor 3',
      performingDoctor: 'Dr. Ahmed Al Rashidi + Sonographer Mariam Hassan',
      accessionNumber: 'IMG-2026-0408-5002',
      status: 'scheduled',
      indication: 'Atypical exertional chest pain 3 weeks. Smoker, family Hx MI at 58, pre-HTN. Rule out inducible ischaemia / significant CAD.',
      preAuthStatus: 'pending',
      preAuthSubmitted: '7 Apr 10:40 AM',
      estimatedCost: 1200,
      patientCoPay: 360,
      findings: [],
      impression: 'Study scheduled',
      location: 'Al Noor Cardiology Imaging Suite'
    },
    {
      id: 'IMG-003',
      patientId: 'PT-001',
      patientName: 'Parnia Yazdkhasti',
      patientAge: '38F',
      patientGender: 'Female',
      insurance: 'Daman Gold',
      modality: 'MRI',
      studyType: 'Cardiac MRI with Late Gadolinium Enhancement',
      studyDate: '2026-02-15',
      orderedBy: 'Dr. Ahmed Al Rashidi',
      performedAt: 'Al Noor Radiology, Floor B1',
      radiologist: 'Dr. Rania Al Suwaidi',
      radiologistName: 'Dr. Rania Al Suwaidi FRCR',
      radiologistTitle: 'Consultant Radiologist — Al Noor Medical Center',
      reportedDate: '15 February 2026, 4:32 PM',
      accessionNumber: 'IMG-2026-0215-4821',
      status: 'reviewed',
      reviewedDate: '7 Apr 2026',
      dhaReference: 'DHA-RAD-RPT-2026-00289',
      technique: '1.5T MRI (Siemens MAGNETOM Sola). Sequences: Cine SSFP | T1 mapping | LGE (10 min post Gadolinium contrast IV). HR during scan: 68 bpm. Image quality: Good — no motion artifact.',
      quantitativeMeasurements: [
        { label: 'LVEF', value: '64%', reference: 'Ref: 55–75%', severity: 'normal' },
        { label: 'LGE (SCAR)', value: 'NEGATIVE', reference: 'No fibrosis / infarction', severity: 'normal' },
        { label: 'T1 MAPPING', value: '1024 ms', reference: 'Ref: < 1000 ms', severity: 'minor' },
        { label: 'ECV', value: '28%', reference: 'Ref: < 28% (upper limit)', severity: 'minor' },
        { label: 'LVEDV', value: '142 mL', reference: 'Normal (< 200 mL)', severity: 'normal' },
        { label: 'RV FUNCTION', value: 'Normal', reference: 'RVEF 52%', severity: 'normal' }
      ],
      findings: [
        { label: 'LV size', value: 'Normal (LVEDVI 76 mL/m²)', severity: 'normal' },
        { label: 'LV wall motion', value: 'Normal — no RWMA', severity: 'normal' },
        { label: 'LV wall thickness', value: 'Normal — no hypertrophy', severity: 'normal' },
        { label: 'LGE', value: 'NEGATIVE — no scar, fibrosis, or infiltration', severity: 'normal' },
        { label: 'T1 mapping', value: '1024 ms — mild elevation (hypertensive)', severity: 'minor' },
        { label: 'Pericardium', value: 'Normal — no effusion', severity: 'normal' },
        { label: 'Aortic root', value: '3.1 cm (Normal)', severity: 'normal' },
        { label: 'RV', value: 'Normal size and function (RVEF 52%)', severity: 'normal' },
        { label: 'Valves', value: 'Mitral — trace MR (not significant)', severity: 'normal' }
      ],
      incidentalFinding: {
        title: 'Bilateral pulmonary micronodules',
        description: 'Largest: 3.8 mm right lower lobe. Bilateral, subsolid, <4mm. Below Fleischner Society threshold.',
        recommendation: 'CT chest follow-up in 12 months'
      },
      impression: 'Normal cardiac MRI with mildly elevated T1 mapping, most likely reflecting early hypertensive remodeling. No evidence of fibrosis, infarction, or cardiomyopathy. LVEF preserved at 64%. Incidental bilateral pulmonary micronodules <4mm — CT follow-up in 12 months.',
      clinicalNote: 'MRI reassuring — no structural cardiac disease. T1 elevation = hypertensive remodeling, not concerning at this level. Discussed thoroughly with patient today (7 Apr 2026) — patient understood findings.\n\nACTION ITEMS:\n→ Book CT chest February 2027 (lung nodule follow-up)\n→ Repeat Cardiac MRI in 2–3 years\n→ No change to current management',
      clinicalNoteDate: '7 April 2026, 9:59 AM'
    },
    {
      id: 'IMG-004',
      patientId: 'PT-001',
      patientName: 'Parnia Yazdkhasti',
      patientAge: '38F',
      patientGender: 'Female',
      insurance: 'Daman Gold',
      modality: 'CT',
      studyType: 'CT Chest with Coronary Artery Calcium Scoring',
      studyDate: '2026-01-20',
      orderedBy: 'Dr. Ahmed Al Rashidi',
      performedAt: 'Al Noor Radiology',
      radiologist: 'Dr. Khalid Al Hamdan',
      radiologistName: 'Dr. Khalid Al Hamdan FRCR',
      accessionNumber: 'IMG-2026-0120-3112',
      status: 'reviewed',
      reviewedDate: '10 Jan 2026',
      quantitativeMeasurements: [
        { label: 'CAC SCORE', value: '42', reference: 'Mild (60th percentile)', severity: 'minor' }
      ],
      findings: [
        { label: 'CAC Score', value: '42 (Mild)', severity: 'minor' },
        { label: 'Lungs', value: 'Clear — no consolidation', severity: 'normal' },
        { label: 'Pulmonary nodules', value: 'Bilateral subsolid ≤3.8mm', severity: 'minor' }
      ],
      impression: 'CAC Score 42 (mild). Bilateral pulmonary micronodules ≤3.8mm — likely incidental; below Fleischner threshold. CT follow-up in 12 months recommended.'
    },
    {
      id: 'IMG-005',
      patientId: 'PT-006',
      patientName: 'Aisha Mohammed Al Reem',
      patientAge: '42F',
      patientGender: 'Female',
      insurance: 'Daman Basic',
      modality: 'Echo',
      studyType: '2D Transthoracic Echocardiogram with Doppler',
      studyDate: '2025-10-15',
      orderedBy: 'Dr. Ahmed Al Rashidi',
      performedAt: 'Al Noor Cardiology (in-clinic)',
      performingDoctor: 'Dr. Ahmed Al Rashidi',
      accessionNumber: 'IMG-2025-1015-2867',
      status: 'reviewed',
      quantitativeMeasurements: [
        { label: 'LVEF', value: '38%', reference: 'Reduced (Ref: 55-75%)', severity: 'significant' },
        { label: 'LVEDV', value: '195 mL', reference: 'Elevated (Normal < 150 mL)', severity: 'significant' }
      ],
      findings: [
        { label: 'LVEF', value: '38% (Reduced — HFrEF)', severity: 'significant' },
        { label: 'LV size', value: 'Dilated (LVEDV 195 mL)', severity: 'significant' },
        { label: 'LV wall motion', value: 'Globally reduced', severity: 'significant' },
        { label: 'Diastolic dysfunction', value: 'Grade II', severity: 'significant' },
        { label: 'Mitral valve', value: 'Moderate MR (secondary to LV dilation)', severity: 'expected' },
        { label: 'Tricuspid valve', value: 'Mild TR with elevated PASP (~38 mmHg)', severity: 'expected' },
        { label: 'Pericardium', value: 'Trace effusion', severity: 'expected' }
      ],
      impression: 'HFrEF with LVEF 38%. Globally impaired LV function. Dilated cardiomyopathy pattern.',
      urgencyNote: {
        type: 'clinical',
        title: '🔴 ACTIVE CLINICAL CONDITION',
        message: 'Patient under active management — HF follow-up. LVEF 38% — HFrEF.',
        action: 'Monthly HF follow-up scheduled'
      }
    },
    {
      id: 'IMG-006',
      patientId: 'PT-009',
      patientName: 'Mohammed Al Rasheed',
      patientAge: '71M',
      patientGender: 'Male',
      insurance: 'Daman Enhanced',
      modality: 'CTCA',
      studyType: 'CT Coronary Angiography',
      studyDate: '2026-03-02',
      orderedBy: 'Dr. Ahmed Al Rashidi',
      performedAt: 'Al Noor Radiology',
      radiologist: 'Dr. Khalid Al Hamdan',
      radiologistName: 'Dr. Khalid Al Hamdan FRCR',
      accessionNumber: 'IMG-2026-0302-3890',
      status: 'reviewed',
      reviewedDate: '5 Mar 2026',
      quantitativeMeasurements: [
        { label: 'LAD STENOSIS', value: '70%', reference: 'Significant', severity: 'significant' },
        { label: 'LCx STENOSIS', value: '30%', reference: 'Non-obstructive', severity: 'minor' },
        { label: 'RCA STENOSIS', value: '40%', reference: 'Non-obstructive', severity: 'minor' },
        { label: 'CALCIUM SCORE', value: '480', reference: 'Severe', severity: 'significant' }
      ],
      findings: [
        { label: 'LAD', value: '70% stenosis mid-segment (Significant)', severity: 'significant' },
        { label: 'LCx', value: '30% stenosis (Non-obstructive)', severity: 'minor' },
        { label: 'RCA', value: '40% stenosis (Non-obstructive)', severity: 'minor' },
        { label: 'Calcium score', value: '480 (Severe)', severity: 'significant' }
      ],
      impression: 'Significant mid-LAD stenosis (70%). Non-obstructive disease in LCx and RCA. Recommend cardiology review re: revascularization.',
      clinicalNote: 'Discussed with patient. Conservative management given comorbidities. Monthly HF follow-up.',
      clinicalNoteDate: '5 Mar 2026'
    }
  ];

  React.useEffect(() => {
    if (!selectedStudy && mockStudies.length > 0) {
      setSelectedStudy(mockStudies[2]);
      setNoteText(mockStudies[2].clinicalNote || '');
    }
  }, []);

  const filteredStudies = mockStudies.filter(study => {
    if (filterModality !== 'all' && study.modality !== filterModality) return false;
    if (filterStatus === 'pending' && study.status !== 'pending') return false;
    if (filterStatus === 'significant') {
      const hasSignificant = study.findings.some(f => f.severity === 'significant');
      if (!hasSignificant) return false;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        study.patientName.toLowerCase().includes(query) ||
        study.studyType.toLowerCase().includes(query) ||
        study.accessionNumber.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const groupedStudies = {
    inProgress: filteredStudies.filter(s => s.status === 'in_progress'),
    scheduled: filteredStudies.filter(s => s.status === 'scheduled'),
    reviewed: filteredStudies.filter(s => s.status === 'reviewed')
  };

  const kpis = {
    pendingReview: 0,
    inProgress: 1,
    scheduled: 1,
    thisMonth: 8,
    significantFindings: 3
  };

  const getModalityIcon = (modality: ImagingModality) => {
    switch (modality) {
      case 'MRI': return <Scan className="w-5 h-5" />;
      case 'CT': return <ScanLine className="w-5 h-5" />;
      case 'Echo': return <Heart className="w-5 h-5" />;
      case 'Holter': return <Activity className="w-5 h-5" />;
      case 'Stress Echo': return <HeartPulse className="w-5 h-5" />;
      case 'CTCA': return <ScanLine className="w-5 h-5" />;
      default: return <Scan className="w-5 h-5" />;
    }
  };

  const getModalityColor = (modality: ImagingModality) => {
    switch (modality) {
      case 'MRI': return { bg: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-500' };
      case 'CT': return { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-500' };
      case 'Echo': return { bg: 'bg-teal-100', text: 'text-teal-600', border: 'border-teal-500' };
      case 'Holter': return { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-500' };
      case 'Stress Echo': return { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-500' };
      case 'CTCA': return { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-500' };
      default: return { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-500' };
    }
  };

  const getSeverityColor = (severity: FindingSeverity) => {
    switch (severity) {
      case 'normal': return 'text-emerald-600';
      case 'minor': return 'text-amber-600';
      case 'significant': return 'text-red-600';
      case 'expected': return 'text-blue-600';
    }
  };

  const getSeverityIcon = (severity: FindingSeverity) => {
    switch (severity) {
      case 'normal': return '✅';
      case 'minor': return '⚠️';
      case 'significant': return '🔴';
      case 'expected': return '🔵';
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <DoctorSidebarNew />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-slate-200 px-8 py-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-100 rounded-lg">
                <Scan className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                  Imaging Center
                </h1>
                <p className="text-sm text-slate-400 mt-0.5">
                  MRI · CT · Echo · Holter · Stress Echo · X-Ray
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                <Search className="w-4 h-4" />
                DICOM Search
              </button>
              <button className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={() => setShowOrderPanel(true)}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Order Imaging
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto px-8 py-6">
          <div className="grid grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-5 border border-slate-100 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 bg-amber-100 rounded-full">
                  <Eye className="w-6 h-6 text-amber-600" />
                </div>
              </div>
              <div className="font-mono text-3xl font-bold text-slate-400 mb-1">{kpis.pendingReview}</div>
              <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">Awaiting Dr. Ahmed's Review</div>
              <div className="text-xs text-emerald-600">All resulted studies reviewed ✅</div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-100 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 bg-teal-100 rounded-full">
                  <Activity className="w-6 h-6 text-teal-600" />
                </div>
              </div>
              <div className="font-mono text-3xl font-bold text-teal-600 mb-1">{kpis.inProgress}</div>
              <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">Studies In Progress</div>
              <div className="text-xs text-slate-600">Holter — Noura Bint Khalid · Fitted today</div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-100 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 bg-blue-100 rounded-full">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="font-mono text-3xl font-bold text-blue-600 mb-1">{kpis.scheduled}</div>
              <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">Scheduled</div>
              <div className="text-xs text-slate-600">Stress Echo — Tomorrow 9:00 AM</div>
              <div className="mt-1.5 inline-block px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs">⏳ Pre-auth pending</div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-100 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 bg-indigo-100 rounded-full">
                  <Scan className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
              <div className="font-mono text-3xl font-bold text-slate-700 mb-1">{kpis.thisMonth}</div>
              <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">Studies This Month</div>
              <div className="text-xs text-slate-600">MRI 2 · CT 2 · Echo 2 · Holter 1 · CTCA 1</div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-100 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 bg-red-100 rounded-full">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
              </div>
              <div className="font-mono text-3xl font-bold text-red-500 mb-1">{kpis.significantFindings}</div>
              <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">Clinically Significant Findings</div>
              <div className="text-xs text-slate-600">Aisha LVEF 38% · Mohammed LAD 70% · Parnia T1↑</div>
            </div>
          </div>

          <div className="flex gap-5">
            <div className="flex-1">
              <div className="mb-5">
                <div className="relative mb-4">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by patient, study type, or accession..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => { setFilterModality('all'); setFilterStatus('all'); }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterModality === 'all' && filterStatus === 'all'
                        ? 'bg-teal-600 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                    }`}
                  >
                    All Studies ({mockStudies.length})
                  </button>
                  <button
                    onClick={() => setFilterModality('MRI')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterModality === 'MRI'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                    }`}
                  >
                    MRI (2)
                  </button>
                  <button
                    onClick={() => setFilterModality('CT')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterModality === 'CT'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                    }`}
                  >
                    CT (2)
                  </button>
                  <button
                    onClick={() => setFilterModality('Echo')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterModality === 'Echo'
                        ? 'bg-teal-600 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                    }`}
                  >
                    Echo (2)
                  </button>
                  <button
                    onClick={() => setFilterModality('Holter')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterModality === 'Holter'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                    }`}
                  >
                    Holter (1)
                  </button>
                  <button
                    onClick={() => { setFilterModality('all'); setFilterStatus('significant'); }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterStatus === 'significant'
                        ? 'bg-red-600 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                    }`}
                  >
                    Significant Findings (3)
                  </button>
                </div>
              </div>

              {groupedStudies.inProgress.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3 pl-3 border-l-3 border-teal-600">
                    <h3 className="text-xs uppercase tracking-wider font-semibold text-teal-600">
                      IN PROGRESS
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {groupedStudies.inProgress.map(study => (
                      <StudyCard
                        key={study.id}
                        study={study}
                        isActive={selectedStudy?.id === study.id}
                        onClick={() => setSelectedStudy(study)}
                        getModalityIcon={getModalityIcon}
                        getModalityColor={getModalityColor}
                      />
                    ))}
                  </div>
                </div>
              )}

              {groupedStudies.scheduled.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3 pl-3 border-l-3 border-blue-600">
                    <h3 className="text-xs uppercase tracking-wider font-semibold text-blue-600">
                      SCHEDULED
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {groupedStudies.scheduled.map(study => (
                      <StudyCard
                        key={study.id}
                        study={study}
                        isActive={selectedStudy?.id === study.id}
                        onClick={() => setSelectedStudy(study)}
                        getModalityIcon={getModalityIcon}
                        getModalityColor={getModalityColor}
                      />
                    ))}
                  </div>
                </div>
              )}

              {groupedStudies.reviewed.length > 0 && (
                <div className="mb-6">
                  <button
                    onClick={() => setExpandedGroups(prev => ({ ...prev, reviewed: !prev.reviewed }))}
                    className="flex items-center gap-2 mb-3 pl-3 border-l-3 border-emerald-600 hover:opacity-70 transition-opacity"
                  >
                    <h3 className="text-xs uppercase tracking-wider font-semibold text-emerald-600">
                      REVIEWED ({groupedStudies.reviewed.length})
                    </h3>
                    {expandedGroups.reviewed ? (
                      <ChevronUp className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-emerald-600" />
                    )}
                  </button>
                  {expandedGroups.reviewed && (
                    <div className="space-y-3">
                      {groupedStudies.reviewed.map(study => (
                        <StudyCard
                          key={study.id}
                          study={study}
                          isActive={selectedStudy?.id === study.id}
                          onClick={() => setSelectedStudy(study)}
                          getModalityIcon={getModalityIcon}
                          getModalityColor={getModalityColor}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="bg-white rounded-2xl p-6 border-l-4 border-indigo-500">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Bot className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">CeenAiX AI — Imaging Insights</h3>
                    <p className="text-xs text-slate-500">For clinical support only</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-indigo-50 rounded-lg p-4">
                    <p className="text-sm text-slate-700 leading-relaxed mb-2">
                      Parnia Yazdkhasti's T1 native is 1024 ms — mildly elevated above the 1000 ms threshold.
                      In isolation with no LGE and preserved LVEF, this is most likely early hypertensive
                      remodeling rather than pathological fibrosis. Reassuring that ECV (28%) is at upper normal.
                    </p>
                    <button className="text-xs text-indigo-600 font-medium hover:text-indigo-700">
                      Flag for Next Consultation →
                    </button>
                  </div>

                  <div className="bg-amber-50 rounded-lg p-4">
                    <p className="text-sm text-slate-700 leading-relaxed mb-2">
                      Aisha Mohammed's last echo was October 2025 (LVEF 38%). Given active HFrEF management,
                      consider repeat echo to reassess LV function and response to therapy.
                    </p>
                    <button className="text-xs text-teal-600 font-medium hover:text-teal-700">
                      Order Echo Now →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {selectedStudy && (
              <div className="w-[460px] flex-shrink-0">
                <ReportViewer
                  study={selectedStudy}
                  editingNote={editingNote}
                  noteText={noteText}
                  setNoteText={setNoteText}
                  setEditingNote={setEditingNote}
                  getModalityColor={getModalityColor}
                  getModalityIcon={getModalityIcon}
                  getSeverityColor={getSeverityColor}
                  getSeverityIcon={getSeverityIcon}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {showOrderPanel && (
        <OrderImagingPanel onClose={() => setShowOrderPanel(false)} />
      )}
    </div>
  );
}

function StudyCard({
  study,
  isActive,
  onClick,
  getModalityIcon,
  getModalityColor
}: {
  study: ImagingStudy;
  isActive: boolean;
  onClick: () => void;
  getModalityIcon: (modality: ImagingModality) => React.ReactNode;
  getModalityColor: (modality: ImagingModality) => { bg: string; text: string; border: string };
}) {
  const colors = getModalityColor(study.modality);
  const isInProgress = study.status === 'in_progress';
  const isScheduled = study.status === 'scheduled';

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl p-5 cursor-pointer transition-all border-l-4 ${
        isActive
          ? 'border-teal-500 bg-teal-50 shadow-md'
          : isInProgress
          ? 'border-teal-400 bg-teal-50/30 hover:bg-teal-50'
          : isScheduled
          ? 'border-blue-400 bg-blue-50/30 hover:bg-blue-50'
          : `${colors.border} hover:bg-slate-50`
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 ${colors.bg} rounded-full`}>
            <div className={colors.text}>
              {getModalityIcon(study.modality)}
            </div>
          </div>
          <div>
            <div className={`text-xs font-bold uppercase tracking-wide ${colors.text}`}>
              {study.studyType}
            </div>
          </div>
        </div>
        {isInProgress && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">
            <div className="w-2 h-2 bg-teal-600 rounded-full animate-pulse" />
            Recording
          </div>
        )}
        {isScheduled && study.scheduledTime && (
          <div className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
            ⏰ {study.scheduledTime}
          </div>
        )}
        {study.status === 'reviewed' && (
          <div className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
            ✅ Reviewed
          </div>
        )}
      </div>

      <div className="mb-2">
        <div className="font-semibold text-slate-900 mb-1" style={{ fontFamily: 'Plus Jakarta Sans' }}>
          {study.patientName}
        </div>
        <div className="font-mono text-xs text-slate-500">
          {study.patientId} · {study.patientAge} · {study.insurance}
        </div>
      </div>

      <div className="space-y-1.5 text-sm">
        <div className="font-mono text-xs text-slate-600">
          {new Date(study.studyDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
        {study.indication && (
          <div className="text-xs text-slate-600 italic">
            {study.indication}
          </div>
        )}
        {isInProgress && study.elapsedTime && (
          <div className="bg-teal-100 rounded-lg p-2.5 mt-2">
            <div className="font-mono text-xs text-teal-700 font-semibold">
              ⏺ Recording in progress — {study.elapsedTime} elapsed
            </div>
            <div className="text-xs text-teal-600 mt-1">
              Patient instructions sent via app ✅
            </div>
          </div>
        )}
        {isScheduled && study.preAuthStatus === 'pending' && (
          <div className="bg-amber-50 rounded-lg p-2.5 mt-2 border border-amber-200">
            <div className="text-xs text-amber-700 font-semibold mb-1">
              ⏳ Pre-authorization: Pending
            </div>
            <div className="text-xs text-amber-600">
              Submitted: {study.preAuthSubmitted}
            </div>
            <div className="text-xs text-slate-600 mt-1">
              AED {study.estimatedCost?.toLocaleString()} | Co-pay: ~AED {study.patientCoPay}
            </div>
          </div>
        )}
      </div>

      {study.status === 'reviewed' && study.findings.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {study.findings.slice(0, 4).map((finding, idx) => {
            const severityColor = finding.severity === 'normal' ? 'bg-emerald-100 text-emerald-700' :
                                 finding.severity === 'minor' ? 'bg-amber-100 text-amber-700' :
                                 finding.severity === 'significant' ? 'bg-red-100 text-red-700' :
                                 'bg-blue-100 text-blue-700';
            return (
              <div key={idx} className={`px-2 py-1 rounded text-xs font-mono font-semibold ${severityColor}`}>
                {finding.severity === 'normal' ? '✅' : finding.severity === 'minor' ? '⚠️' : finding.severity === 'significant' ? '🔴' : '🔵'}
                {' '}
                {finding.label}: {finding.value.split('—')[0].split('(')[0].trim()}
              </div>
            );
          })}
        </div>
      )}

      {isActive && (
        <div className="mt-3 pt-3 border-t border-teal-200">
          <div className="text-xs text-teal-600 font-medium">▶ Reading</div>
        </div>
      )}
    </div>
  );
}

function ReportViewer({
  study,
  editingNote,
  noteText,
  setNoteText,
  setEditingNote,
  getModalityColor,
  getModalityIcon,
  getSeverityColor,
  getSeverityIcon
}: any) {
  const colors = getModalityColor(study.modality);
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden h-full flex flex-col sticky top-6">
      <div className="bg-slate-800 px-5 py-4 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1.5 ${colors.bg} rounded-lg flex items-center gap-2`}>
            <div className={colors.text}>
              {getModalityIcon(study.modality)}
            </div>
            <span className={`text-xs font-bold uppercase ${colors.text}`}>
              {study.modality}
            </span>
          </div>
          <div>
            <div className="font-semibold text-white text-sm">{study.patientName}</div>
            <div className="font-mono text-xs text-slate-400">
              {new Date(study.studyDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors" title="Full PDF Report">
            <FileText className="w-4 h-4 text-slate-400" />
          </button>
          <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors" title="Share">
            <Share2 className="w-4 h-4 text-slate-400" />
          </button>
          <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors" title="Print">
            <Printer className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        <div className="bg-slate-800 rounded-xl p-4">
          <div className="mb-3">
            <div className="font-semibold text-white text-sm">{study.patientName}</div>
            <div className="font-mono text-xs text-slate-400">
              {study.patientId} · {study.patientAge} · {study.insurance}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <div className="text-slate-500 mb-1">Study</div>
              <div className="text-slate-200">{study.studyType}</div>
            </div>
            <div>
              <div className="text-slate-500 mb-1">Date</div>
              <div className="font-mono text-slate-400">
                {new Date(study.studyDate).toLocaleDateString('en-GB')}
              </div>
            </div>
            {study.radiologist && (
              <>
                <div>
                  <div className="text-slate-500 mb-1">Radiologist</div>
                  <div className="text-slate-200 text-xs">{study.radiologist}</div>
                </div>
                <div>
                  <div className="text-slate-500 mb-1">Accession</div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-teal-400 text-xs">{study.accessionNumber}</span>
                    <button
                      onClick={() => copyToClipboard(study.accessionNumber)}
                      className="text-teal-600 hover:text-teal-500"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {study.technique && (
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">TECHNIQUE</div>
            <div className="text-sm text-slate-300 leading-relaxed">
              {study.technique}
            </div>
          </div>
        )}

        {study.quantitativeMeasurements && study.quantitativeMeasurements.length > 0 && (
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-500 mb-3">QUANTITATIVE MEASUREMENTS</div>
            <div className="grid grid-cols-2 gap-3">
              {study.quantitativeMeasurements.map((measurement: any, idx: number) => (
                <div key={idx} className="bg-slate-800 rounded-lg p-3">
                  <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">
                    {measurement.label}
                  </div>
                  <div className={`font-mono text-xl font-bold mb-1 ${
                    measurement.severity === 'normal' ? 'text-emerald-400' :
                    measurement.severity === 'minor' ? 'text-amber-400' :
                    measurement.severity === 'significant' ? 'text-red-400' :
                    'text-blue-400'
                  }`}>
                    {measurement.value}
                  </div>
                  <div className="font-mono text-xs text-slate-500">
                    {measurement.reference}
                  </div>
                  <div className="mt-2 text-sm">
                    {getSeverityIcon(measurement.severity)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {study.findings && study.findings.length > 0 && (
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-500 mb-3">FINDINGS</div>
            <div className="space-y-2">
              {study.findings.map((finding: any, idx: number) => (
                <div key={idx} className="flex items-start gap-3 text-sm">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    finding.severity === 'normal' ? 'bg-emerald-500' :
                    finding.severity === 'minor' ? 'bg-amber-500' :
                    finding.severity === 'significant' ? 'bg-red-500' :
                    'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <span className="text-slate-400">{finding.label}:</span>
                    {' '}
                    <span className="text-slate-200">{finding.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {study.incidentalFinding && (
          <div className="bg-amber-900/20 border border-amber-700/30 rounded-lg p-4">
            <div className="text-xs uppercase tracking-wider text-amber-400 mb-2">INCIDENTAL FINDING</div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-amber-400">⚠️</span>
                <div>
                  <div className="text-sm font-semibold text-amber-200">{study.incidentalFinding.title}</div>
                  <div className="text-sm text-amber-200/80 mt-1">{study.incidentalFinding.description}</div>
                  <div className="text-sm text-amber-300 mt-2 font-medium">
                    RECOMMENDATION: {study.incidentalFinding.recommendation}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {study.impression && (
          <div>
            <div className="h-px bg-slate-700 my-4" />
            <div className="text-xs uppercase tracking-wider text-slate-500 mb-3">RADIOLOGIST IMPRESSION</div>
            <div className="text-sm text-slate-200 leading-relaxed">
              {study.impression}
            </div>
            {study.radiologistName && (
              <div className="mt-4 text-sm">
                <div className="text-slate-400 italic">{study.radiologistName}</div>
                <div className="text-slate-500 text-xs">{study.radiologistTitle}</div>
                <div className="font-mono text-xs text-slate-500 mt-1">
                  Reported: {study.reportedDate}
                </div>
              </div>
            )}
            {study.dhaReference && (
              <div className="mt-3 flex items-center gap-2">
                <span className="font-mono text-xs text-teal-400">{study.dhaReference}</span>
                <button
                  onClick={() => copyToClipboard(study.dhaReference)}
                  className="text-teal-600 hover:text-teal-500"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        )}

        {study.urgencyNote && (
          <div className={`${
            study.urgencyNote.type === 'clinical' ? 'bg-red-900/20 border-red-700/30' : 'bg-amber-900/20 border-amber-700/30'
          } border rounded-lg p-4`}>
            <div className={`text-sm font-bold mb-2 ${
              study.urgencyNote.type === 'clinical' ? 'text-red-400' : 'text-amber-400'
            }`}>
              {study.urgencyNote.title}
            </div>
            <div className={`text-sm ${
              study.urgencyNote.type === 'clinical' ? 'text-red-200' : 'text-amber-200'
            }`}>
              {study.urgencyNote.message}
            </div>
            {study.urgencyNote.action && (
              <button className="mt-3 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                <Send className="w-4 h-4" />
                {study.urgencyNote.action}
              </button>
            )}
          </div>
        )}

        {study.clinicalNote && (
          <div className="bg-gradient-to-br from-amber-900/30 to-amber-800/20 border-t-2 border-amber-600 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <Lock className="w-3 h-3 text-amber-400" />
              <div className="text-xs uppercase tracking-wider text-amber-400">
                DR. AHMED'S CLINICAL ANNOTATION
              </div>
            </div>
            <div className="text-xs text-amber-500 mb-3">Visible only to Dr. Ahmed</div>

            {editingNote ? (
              <div>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="w-full bg-slate-900/50 text-amber-100 border border-amber-700/30 rounded-lg p-3 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500/50 min-h-[200px]"
                />
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setEditingNote(false)}
                    className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingNote(false);
                      setNoteText(study.clinicalNote);
                    }}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-sm text-amber-100 leading-relaxed whitespace-pre-line">
                  {study.clinicalNote}
                </div>
                <div className="font-mono text-xs text-amber-600 mt-4">
                  — Dr. Ahmed Al Rashidi · {study.clinicalNoteDate}
                </div>
                <button
                  onClick={() => setEditingNote(true)}
                  className="mt-3 px-4 py-2 bg-amber-700/50 hover:bg-amber-700 text-amber-100 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Note
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-slate-800 px-5 py-3 border-t border-slate-700 flex items-center gap-2">
        <button className="flex-1 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
          <Share2 className="w-4 h-4" />
          Share with Patient
        </button>
        <button className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-sm font-medium transition-colors">
          <Printer className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function OrderImagingPanel({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [selectedModality, setSelectedModality] = useState<string>('');

  const modalities = [
    { id: 'mri', name: 'MRI', icon: Scan, color: 'indigo', studies: ['Cardiac MRI', 'Brain MRI', 'Spine MRI'] },
    { id: 'ct', name: 'CT', icon: ScanLine, color: 'blue', studies: ['CT Chest', 'CTCA', 'CT Abdomen'] },
    { id: 'echo', name: 'Echo', icon: Heart, color: 'teal', studies: ['2D TTE', 'TEE', 'Stress Echo'] },
    { id: 'holter', name: 'Holter', icon: Activity, color: 'purple', studies: ['24h Holter', '48h Holter'] },
    { id: 'ecg', name: 'ECG', icon: Zap, color: 'emerald', studies: ['12-lead ECG', 'Exercise ECG'] },
    { id: 'nuclear', name: 'Nuclear', icon: Radio, color: 'amber', studies: ['Myocardial Perfusion', 'PET scan'] }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end">
      <div className="w-[400px] h-full bg-white shadow-2xl flex flex-col animate-slide-in-right">
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
          <h2 className="font-bold text-white" style={{ fontFamily: 'Plus Jakarta Sans' }}>
            Order Imaging
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Select Patient
            </label>
            <input
              type="text"
              placeholder="Search patient..."
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Imaging Modality
            </label>
            <div className="grid grid-cols-2 gap-3">
              {modalities.map(modality => {
                const Icon = modality.icon;
                const isSelected = selectedModality === modality.id;
                return (
                  <button
                    key={modality.id}
                    onClick={() => setSelectedModality(modality.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? `bg-${modality.color}-600 border-${modality.color}-600 text-white`
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Icon className="w-6 h-6 mb-2" />
                    <div className="font-semibold text-sm">{modality.name}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedModality && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Specific Study
              </label>
              <div className="space-y-2">
                {modalities.find(m => m.id === selectedModality)?.studies.map(study => (
                  <label key={study} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                    <input type="radio" name="study" className="text-teal-600" />
                    <span className="text-sm text-slate-700">{study}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Clinical Indication
            </label>
            <textarea
              placeholder="Clinical notes for radiologist..."
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[100px]"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Priority
            </label>
            <div className="flex gap-2">
              <button className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm hover:bg-slate-50 transition-colors">
                Urgent
              </button>
              <button className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium">
                Routine
              </button>
              <button className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm hover:bg-slate-50 transition-colors">
                Pre-procedure
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-200">
          <button className="w-full px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
            <Send className="w-5 h-5" />
            Place Imaging Order
          </button>
        </div>
      </div>
    </div>
  );
}
