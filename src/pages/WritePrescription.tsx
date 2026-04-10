import React, { useState, useEffect } from 'react';
import DoctorSidebarNew from '../components/doctor/DoctorSidebarNew';
import { Search, Pill, AlertTriangle, AlertOctagon, CheckCircle2, Lock, Plus, X, CreditCard as Edit, Send, RefreshCw, ClipboardList, ChevronDown, User, Calendar, MessageSquare, Loader2, Copy, Check, Printer, FileText, Bell } from 'lucide-react';

interface Drug {
  id: string;
  genericName: string;
  brandNames: string[];
  strengths: string[];
  drugClass: string;
  atcCode: string;
  onFormulary: boolean;
  controlled: boolean;
}

interface PrescriptionItem {
  drug: Drug;
  strength: string;
  frequency: string;
  timing: string;
  duration: string;
  quantity: string;
  refills: string;
  instructions: string;
  indication: string;
  safetyStatus: 'safe' | 'moderate' | 'major' | 'allergy';
  safetyMessage?: string;
  acknowledged?: boolean;
}

interface Patient {
  id: string;
  name: string;
  age: string;
  gender: string;
  bloodType: string;
  insurance: string;
  allergies: Array<{ name: string; severity: string; reaction: string }>;
  currentMeds: Array<{ name: string; dose: string; prescriber: string }>;
  preferredPharmacy: string;
}

const WritePrescription: React.FC = () => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Drug[]>([]);
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  const [prescriptionItems, setPrescriptionItems] = useState<PrescriptionItem[]>([]);
  const [showPharmacyQuery, setShowPharmacyQuery] = useState(true);
  const [renewalMode, setRenewalMode] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [checkingSafety, setCheckingSafety] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAllergyStop, setShowAllergyStop] = useState(false);
  const [blockedDrug, setBlockedDrug] = useState<Drug | null>(null);
  const [prescriptionRef, setPrescriptionRef] = useState('');

  const [drugForm, setDrugForm] = useState({
    strength: '',
    frequency: 'Once daily',
    timing: 'Morning',
    duration: '1 month',
    quantity: '30',
    refills: 'None',
    instructions: '',
    indication: ''
  });

  const uaeFormulary: Drug[] = [
    { id: '1', genericName: 'Furosemide', brandNames: ['Lasix', 'Frusemide'], strengths: ['20mg', '40mg', '80mg'], drugClass: 'Loop Diuretic', atcCode: 'C03CA01', onFormulary: true, controlled: false },
    { id: '2', genericName: 'Atorvastatin', brandNames: ['Lipitor'], strengths: ['10mg', '20mg', '40mg', '80mg'], drugClass: 'Statin', atcCode: 'C10AA05', onFormulary: true, controlled: false },
    { id: '3', genericName: 'Bisoprolol', brandNames: ['Concor'], strengths: ['2.5mg', '5mg', '10mg'], drugClass: 'Beta Blocker', atcCode: 'C07AB07', onFormulary: true, controlled: false },
    { id: '4', genericName: 'Enalapril', brandNames: ['Vasotec'], strengths: ['5mg', '10mg', '20mg'], drugClass: 'ACE Inhibitor', atcCode: 'C09AA02', onFormulary: true, controlled: false },
    { id: '5', genericName: 'Spironolactone', brandNames: ['Aldactone'], strengths: ['25mg', '50mg', '100mg'], drugClass: 'K-Sparing Diuretic', atcCode: 'C03DA01', onFormulary: true, controlled: false },
    { id: '6', genericName: 'Amlodipine', brandNames: ['Norvasc'], strengths: ['5mg', '10mg'], drugClass: 'CCB', atcCode: 'C08CA01', onFormulary: true, controlled: false },
    { id: '7', genericName: 'Metformin', brandNames: ['Glucophage'], strengths: ['500mg', '850mg', '1000mg'], drugClass: 'Biguanide', atcCode: 'A10BA02', onFormulary: true, controlled: false },
    { id: '8', genericName: 'Clopidogrel', brandNames: ['Plavix'], strengths: ['75mg'], drugClass: 'Antiplatelet', atcCode: 'B01AC04', onFormulary: true, controlled: false },
    { id: '9', genericName: 'Warfarin', brandNames: ['Coumadin'], strengths: ['1mg', '2mg', '5mg'], drugClass: 'Anticoagulant', atcCode: 'B01AA03', onFormulary: true, controlled: false },
    { id: '10', genericName: 'Amoxicillin', brandNames: ['Amoxil'], strengths: ['250mg', '500mg'], drugClass: 'Penicillin', atcCode: 'J01CA04', onFormulary: true, controlled: false },
    { id: '11', genericName: 'Co-trimoxazole', brandNames: ['Bactrim', 'Septrin'], strengths: ['480mg', '960mg'], drugClass: 'Sulfonamide', atcCode: 'J01EE01', onFormulary: true, controlled: false },
    { id: '12', genericName: 'Rosuvastatin', brandNames: ['Crestor'], strengths: ['5mg', '10mg', '20mg', '40mg'], drugClass: 'Statin', atcCode: 'C10AA07', onFormulary: true, controlled: false },
  ];

  const patients: Patient[] = [
    {
      id: 'PT-006',
      name: 'Aisha Mohammed Al Reem',
      age: '42F',
      gender: 'Female',
      bloodType: 'O-',
      insurance: 'AXA Gulf Standard',
      allergies: [],
      currentMeds: [
        { name: 'Furosemide', dose: '40mg daily', prescriber: 'Dr. Ahmed' },
        { name: 'Bisoprolol', dose: '5mg daily', prescriber: 'Dr. Ahmed' },
        { name: 'Enalapril', dose: '10mg daily', prescriber: 'Dr. Ahmed' },
        { name: 'Spironolactone', dose: '25mg daily', prescriber: 'Dr. Ahmed' },
        { name: 'Metformin', dose: '850mg twice daily', prescriber: 'Dr. Tooraj' }
      ],
      preferredPharmacy: 'Dubai Central Pharmacy — DIFC'
    },
    {
      id: 'PT-001',
      name: 'Parnia Yazdkhasti',
      age: '38F',
      gender: 'Female',
      bloodType: 'A+',
      insurance: 'Daman Gold',
      allergies: [
        { name: 'Penicillin', severity: 'SEVERE', reaction: 'Anaphylaxis' },
        { name: 'Sulfa drugs', severity: 'MODERATE', reaction: 'Rash' }
      ],
      currentMeds: [
        { name: 'Atorvastatin', dose: '20mg nightly', prescriber: 'Dr. Ahmed' },
        { name: 'Amlodipine', dose: '5mg morning', prescriber: 'Dr. Ahmed' },
        { name: 'Metformin', dose: '850mg twice daily', prescriber: 'Dr. Fatima' }
      ],
      preferredPharmacy: 'Al Shifa Pharmacy — Al Barsha'
    },
    {
      id: 'PT-002',
      name: 'Khalid Hassan Abdullah',
      age: '54M',
      gender: 'Male',
      bloodType: 'O+',
      insurance: 'ADNIC Standard',
      allergies: [],
      currentMeds: [
        { name: 'Amlodipine', dose: '10mg daily', prescriber: 'Dr. Ahmed' },
        { name: 'Atorvastatin', dose: '20mg nightly', prescriber: 'Dr. Ahmed' }
      ],
      preferredPharmacy: 'Emirates Pharmacy — JLT'
    }
  ];

  useEffect(() => {
    setSelectedPatient(patients[0]);
  }, []);

  useEffect(() => {
    if (searchQuery.length > 0) {
      const results = uaeFormulary.filter(drug =>
        drug.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        drug.brandNames.some(brand => brand.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const checkDrugAllergy = (drug: Drug): boolean => {
    if (!selectedPatient) return false;

    return selectedPatient.allergies.some(allergy => {
      if (drug.drugClass.toLowerCase().includes(allergy.name.toLowerCase())) {
        return true;
      }
      if (allergy.name.toLowerCase() === 'penicillin' && drug.drugClass.toLowerCase().includes('penicillin')) {
        return true;
      }
      if (allergy.name.toLowerCase().includes('sulfa') && drug.drugClass.toLowerCase().includes('sulfonamide')) {
        return true;
      }
      return false;
    });
  };

  const checkInteractions = async (drug: Drug): Promise<{ status: 'safe' | 'moderate' | 'major'; message?: string }> => {
    setCheckingSafety(true);

    await new Promise(resolve => setTimeout(resolve, 400));

    if (!selectedPatient) {
      setCheckingSafety(false);
      return { status: 'safe' };
    }

    if (drug.drugClass === 'K-Sparing Diuretic' && selectedPatient.currentMeds.some(m => m.name === 'Enalapril')) {
      setCheckingSafety(false);
      return {
        status: 'moderate',
        message: `${drug.genericName} + Enalapril: Increased potassium (hyperkalemia) risk. Monitor K+ electrolytes regularly.`
      };
    }

    if (drug.drugClass === 'ACE Inhibitor' && selectedPatient.currentMeds.some(m => m.name === 'Spironolactone')) {
      setCheckingSafety(false);
      return {
        status: 'moderate',
        message: `${drug.genericName} + Spironolactone: Increased potassium (hyperkalemia) risk. Monitor K+ electrolytes regularly.`
      };
    }

    setCheckingSafety(false);
    return { status: 'safe' };
  };

  const handleDrugSelect = async (drug: Drug) => {
    if (checkDrugAllergy(drug)) {
      setBlockedDrug(drug);
      setShowAllergyStop(true);
      return;
    }

    setSelectedDrug(drug);
    setDrugForm({
      strength: drug.strengths[1] || drug.strengths[0],
      frequency: 'Once daily',
      timing: 'Morning',
      duration: '1 month',
      quantity: '30',
      refills: 'None',
      instructions: `Take one ${drug.strengths[1] || drug.strengths[0]} tablet ${drugForm.timing.toLowerCase()}. ${drug.drugClass === 'Loop Diuretic' ? 'Take with or without food.' : ''}`,
      indication: ''
    });

    const safetyCheck = await checkInteractions(drug);
  };

  const addToPrescription = async () => {
    if (!selectedDrug) return;

    const safetyCheck = await checkInteractions(selectedDrug);

    const newItem: PrescriptionItem = {
      drug: selectedDrug,
      strength: drugForm.strength,
      frequency: drugForm.frequency,
      timing: drugForm.timing,
      duration: drugForm.duration,
      quantity: drugForm.quantity,
      refills: drugForm.refills,
      instructions: drugForm.instructions,
      indication: drugForm.indication,
      safetyStatus: safetyCheck.status,
      safetyMessage: safetyCheck.message,
      acknowledged: safetyCheck.status === 'safe'
    };

    setPrescriptionItems([...prescriptionItems, newItem]);
    setSelectedDrug(null);
    setSearchQuery('');
  };

  const sendPrescription = () => {
    const ref = `RX-20260407-${String(Math.floor(Math.random() * 900000) + 100000)}`;
    setPrescriptionRef(ref);
    setShowSuccessModal(true);
  };

  const resetPrescription = () => {
    setPrescriptionItems([]);
    setShowSuccessModal(false);
    setPrescriptionRef('');
    setSelectedDrug(null);
    setSearchQuery('');
  };

  if (!selectedPatient) {
    return (
      <div className="flex h-screen bg-slate-50">
        <DoctorSidebarNew />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Loading prescription workspace...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <DoctorSidebarNew />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Page Header */}
        <div className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-[22px] text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Write Prescription
            </h1>
            <p className="text-[13px] text-slate-400" style={{ fontFamily: 'Inter, sans-serif' }}>
              DHA ePrescription System — NABIDH linked
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setRenewalMode(!renewalMode)}
              className="px-4 py-2 bg-slate-100 text-slate-700 text-[13px] font-medium rounded-lg hover:bg-slate-200 transition-colors flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Renew Existing</span>
            </button>

            <button
              onClick={() => setShowHistory(true)}
              className="px-4 py-2 bg-slate-100 text-slate-700 text-[13px] font-medium rounded-lg hover:bg-slate-200 transition-colors flex items-center space-x-2"
            >
              <ClipboardList className="w-4 h-4" />
              <span>History</span>
            </button>

            <button className="relative">
              <Bell className="w-5 h-5 text-slate-400" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                4
              </div>
            </button>

            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white text-sm font-bold cursor-pointer">
              AA
            </div>
          </div>
        </div>

        {/* Pharmacy Query Banner */}
        {showPharmacyQuery && selectedPatient.id === 'PT-001' && (
          <div className="bg-amber-50 border-b-2 border-amber-200 px-6 py-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <MessageSquare className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-[13px] text-amber-900 mb-1">
                    💬 Pharmacy Query — Al Shifa Pharmacy
                  </div>
                  <p className="text-[12px] text-amber-700">
                    Parnia Yazdkhasti: Atorvastatin brand out of stock. Generic substitution requested — awaiting your approval.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1.5 bg-amber-600 text-white text-[12px] font-semibold rounded-lg hover:bg-amber-700 transition-colors">
                  View & Respond
                </button>
                <button
                  onClick={() => setShowPharmacyQuery(false)}
                  className="text-amber-600 hover:text-amber-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content - 3 Panel Layout */}
        <div className="flex-1 overflow-hidden p-6">
          <div className="h-full flex gap-5">
            {/* LEFT PANEL - Patient Context */}
            <div className="w-[280px] flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 h-full overflow-y-auto">
                {/* Patient Selector */}
                <div className="mb-5">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-3">
                    PRESCRIBING FOR
                  </div>

                  <div className="bg-teal-50 border-2 border-teal-200 rounded-xl p-4 mb-3">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-11 h-11 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                        {selectedPatient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-[15px] text-slate-900 truncate" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                          {selectedPatient.name}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {selectedPatient.id} · {selectedPatient.age} · {selectedPatient.bloodType}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">
                          {selectedPatient.insurance}
                        </div>
                      </div>
                    </div>

                    <button className="w-full px-3 py-1.5 bg-slate-100 text-slate-700 text-[11px] font-medium rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center space-x-1">
                      <span>Change Patient</span>
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Allergy Alert Panel */}
                <div className="mb-5">
                  {selectedPatient.allergies.length > 0 ? (
                    <div className="bg-red-50 border-2 border-red-200 border-l-4 border-l-red-600 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <AlertOctagon className="w-5 h-5 text-red-600" />
                        <div className="text-[10px] uppercase tracking-wider text-red-700 font-bold">
                          ALLERGY ALERT
                        </div>
                      </div>

                      <div className="space-y-2">
                        {selectedPatient.allergies.map((allergy, idx) => (
                          <div key={idx} className="bg-white rounded-lg p-3 border border-red-200">
                            <div className="text-[13px] font-bold text-red-700 mb-1">
                              ⚠️ {allergy.name}
                            </div>
                            <div className="text-[12px] text-red-600">
                              {allergy.severity} — {allergy.reaction}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 text-[10px] text-blue-600">
                        ✅ All allergies registered in Nabidh HIE
                      </div>
                    </div>
                  ) : (
                    <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <div className="text-[12px] font-bold text-emerald-700">
                          No Known Allergies
                        </div>
                      </div>
                      <div className="text-[10px] text-emerald-600">
                        ✅ Verified from Nabidh HIE · 7 April 2026
                      </div>
                    </div>
                  )}
                </div>

                {/* Current Medications */}
                <div className="mb-5">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-3">
                    CURRENT MEDICATIONS
                  </div>

                  <div className="space-y-2">
                    {selectedPatient.currentMeds.map((med, idx) => (
                      <div key={idx} className="flex items-start space-x-2 text-[12px]">
                        <Pill className="w-3.5 h-3.5 text-teal-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="text-slate-700 font-medium">{med.name} {med.dose}</div>
                          <div className="text-[10px] text-slate-400">{med.prescriber}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedPatient.currentMeds.some(m => m.name === 'Enalapril') &&
                   selectedPatient.currentMeds.some(m => m.name === 'Spironolactone') && (
                    <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <div className="text-[11px] text-amber-700 leading-relaxed">
                        ⚠️ Enalapril + Spironolactone currently prescribed. Adding any K+-sparing drug = hyperkalemia risk.
                      </div>
                    </div>
                  )}

                  <button className="mt-3 text-[11px] text-teal-600 hover:text-teal-700 font-medium">
                    View Full Record →
                  </button>
                </div>

                {/* Prescriber Details */}
                <div className="pt-5 border-t border-slate-200">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-3">
                    PRESCRIBER
                  </div>
                  <div className="text-[12px] text-slate-700 space-y-1">
                    <div className="font-bold">Dr. Ahmed Al Rashidi</div>
                    <div>Cardiologist</div>
                    <div>Al Noor Medical Center</div>
                    <div className="font-mono text-[10px] text-slate-500">DHA-PRAC-2018-047821</div>
                    <div className="font-mono text-[10px] text-slate-500">7 April 2026</div>
                  </div>
                </div>
              </div>
            </div>

            {/* CENTER PANEL - Prescribing Workspace */}
            <div className="flex-1 overflow-y-auto">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="font-bold text-[16px] text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      Add Medications
                    </h2>
                    <p className="text-[12px] text-slate-400">UAE National Formulary · DHA ePrescription</p>
                  </div>
                  <button className="px-3 py-2 bg-slate-100 text-slate-600 text-[12px] font-medium rounded-lg hover:bg-slate-200 transition-colors flex items-center space-x-2">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Quick Panels</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Drug Search */}
                <div className="relative mb-6">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search UAE formulary — generic or brand name..."
                      className="w-full h-[52px] pl-12 pr-16 border-2 border-teal-300 rounded-2xl text-[15px] focus:outline-none focus:ring-4 focus:ring-teal-100 shadow-lg shadow-teal-100/50"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-slate-300 font-mono">
                      ⌘K
                    </div>
                  </div>

                  {/* Search Results Dropdown */}
                  {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl max-h-[400px] overflow-y-auto z-10">
                      <div className="p-3 border-b border-slate-100">
                        <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
                          DHA FORMULARY DRUGS
                        </div>
                      </div>

                      {searchResults.map((drug) => {
                        const hasAllergy = checkDrugAllergy(drug);

                        return (
                          <div
                            key={drug.id}
                            onClick={() => handleDrugSelect(drug)}
                            className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-colors ${
                              hasAllergy
                                ? 'bg-red-50 cursor-not-allowed'
                                : 'hover:bg-teal-50'
                            }`}
                          >
                            <div className="flex items-center space-x-3 flex-1">
                              {hasAllergy ? (
                                <X className="w-5 h-5 text-red-600 flex-shrink-0" />
                              ) : (
                                <Pill className="w-5 h-5 text-teal-400 flex-shrink-0" />
                              )}

                              <div className="flex-1 min-w-0">
                                <div className={`text-[14px] font-bold ${hasAllergy ? 'text-red-700' : 'text-slate-900'}`}>
                                  {drug.genericName}
                                  {hasAllergy && <span className="ml-2 text-red-600">— ALLERGY</span>}
                                </div>
                                <div className="text-[12px] text-slate-400">
                                  {drug.brandNames.join(' · ')}
                                </div>
                                <div className="text-[11px] text-teal-600 font-mono mt-0.5">
                                  {drug.strengths.join(' · ')}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              {drug.onFormulary && (
                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-bold rounded">
                                  DHA ✅
                                </span>
                              )}
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-medium rounded">
                                {drug.drugClass}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Drug Detail Form (when drug selected) */}
                {selectedDrug && (
                  <div className="bg-white border-2 border-slate-200 border-l-4 border-l-teal-500 rounded-xl p-6 mb-6 animate-in slide-in-from-top-4 duration-300">
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-start space-x-3">
                        <Pill className="w-5 h-5 text-teal-500 mt-1" />
                        <div>
                          <div className="font-bold text-[16px] text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                            {selectedDrug.genericName}
                          </div>
                          <div className="text-[13px] text-slate-400 italic">
                            ({selectedDrug.brandNames[0]})
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono mt-1">
                            {selectedDrug.drugClass} · ATC: {selectedDrug.atcCode}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {checkingSafety && (
                          <Loader2 className="w-4 h-4 text-teal-500 animate-spin" />
                        )}
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded">
                          DHA ✅
                        </span>
                        <button
                          onClick={() => setSelectedDrug(null)}
                          className="text-slate-400 hover:text-slate-600 text-[11px]"
                        >
                          ✕ Remove
                        </button>
                      </div>
                    </div>

                    {/* 2-Column Form */}
                    <div className="grid grid-cols-2 gap-6 mb-5">
                      {/* Left Column */}
                      <div className="space-y-4">
                        {/* Strength */}
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
                            Strength
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {selectedDrug.strengths.map((strength) => (
                              <button
                                key={strength}
                                onClick={() => setDrugForm({ ...drugForm, strength })}
                                className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                                  drugForm.strength === strength
                                    ? 'bg-teal-600 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                {strength}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Frequency */}
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
                            Frequency
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {['Once daily', 'Twice daily', 'Three times', 'As needed'].map((freq) => (
                              <button
                                key={freq}
                                onClick={() => setDrugForm({ ...drugForm, frequency: freq })}
                                className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${
                                  drugForm.frequency === freq
                                    ? 'bg-teal-600 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                {freq}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Timing */}
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
                            When to take
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {['Morning', 'Evening', 'With food', 'At bedtime'].map((time) => (
                              <button
                                key={time}
                                onClick={() => setDrugForm({ ...drugForm, timing: time })}
                                className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${
                                  drugForm.timing === time
                                    ? 'bg-teal-600 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-4">
                        {/* Duration */}
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
                            Duration
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {['7 days', '14 days', '1 month', '3 months', 'Ongoing'].map((dur) => (
                              <button
                                key={dur}
                                onClick={() => setDrugForm({ ...drugForm, duration: dur })}
                                className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${
                                  drugForm.duration === dur
                                    ? 'bg-teal-600 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                {dur}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Quantity */}
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
                            Total quantity to dispense
                          </label>
                          <div className="text-[14px] font-mono font-bold text-teal-600 mb-2">
                            {drugForm.quantity} tablets
                          </div>
                          <input
                            type="text"
                            value={drugForm.quantity}
                            onChange={(e) => setDrugForm({ ...drugForm, quantity: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                        </div>

                        {/* Refills */}
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
                            Refills
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {['None', '1 refill', '2 refills', '3 refills'].map((ref) => (
                              <button
                                key={ref}
                                onClick={() => setDrugForm({ ...drugForm, refills: ref })}
                                className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${
                                  drugForm.refills === ref
                                    ? 'bg-teal-600 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                {ref}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="mb-5">
                      <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
                        Patient Instructions
                      </label>
                      <textarea
                        value={drugForm.instructions}
                        onChange={(e) => setDrugForm({ ...drugForm, instructions: e.target.value })}
                        className="w-full h-14 px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                        placeholder="Enter instructions for the patient..."
                        maxLength={300}
                      />
                      <div className="text-[10px] text-slate-400 text-right mt-1">
                        {drugForm.instructions.length}/300
                      </div>
                    </div>

                    {/* Indication */}
                    <div className="mb-5">
                      <label className="block text-[11px] uppercase tracking-wider text-amber-600 font-semibold mb-2">
                        Indication / Diagnosis (Required)
                      </label>
                      <input
                        type="text"
                        value={drugForm.indication}
                        onChange={(e) => setDrugForm({ ...drugForm, indication: e.target.value })}
                        placeholder="e.g., I50.9 — Heart Failure"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-amber-500"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      />
                    </div>

                    {/* Add to Prescription Button */}
                    <button
                      onClick={addToPrescription}
                      disabled={!drugForm.indication || checkingSafety}
                      className="w-full py-3 bg-teal-600 text-white text-[14px] font-bold rounded-xl hover:bg-teal-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Add to Prescription</span>
                    </button>
                  </div>
                )}

                {/* Prescription Items List */}
                {prescriptionItems.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <h3 className="text-[14px] font-bold text-slate-700">Prescription Items</h3>
                      <span className="px-2 py-1 bg-teal-100 text-teal-700 text-[11px] font-bold rounded">
                        {prescriptionItems.length} {prescriptionItems.length === 1 ? 'item' : 'items'}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {prescriptionItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-white border-2 border-slate-200 border-l-4 border-l-teal-500 rounded-xl p-4 hover:shadow-md transition-shadow group"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <Pill className="w-4 h-4 text-teal-500" />
                              <span className="text-[14px] font-bold text-slate-900">
                                {item.drug.genericName} {item.strength}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-1.5 hover:bg-teal-50 rounded transition-colors">
                                <Edit className="w-3.5 h-3.5 text-teal-600" />
                              </button>
                              <button
                                onClick={() => setPrescriptionItems(prescriptionItems.filter((_, i) => i !== idx))}
                                className="p-1.5 hover:bg-red-50 rounded transition-colors"
                              >
                                <X className="w-3.5 h-3.5 text-red-600" />
                              </button>
                            </div>
                          </div>

                          <div className="text-[12px] font-mono text-slate-600 mb-2">
                            {item.strength} · {item.frequency} · {item.timing} · {item.quantity} tablets · {item.duration}
                          </div>

                          <div className="text-[12px] text-slate-500 italic mb-2">
                            {item.instructions}
                          </div>

                          <div className="text-[10px] font-mono text-teal-600">
                            {item.indication}
                          </div>

                          {item.safetyStatus !== 'safe' && item.safetyMessage && (
                            <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-2">
                              <div className="text-[10px] text-amber-700">
                                ⚠️ {item.safetyMessage}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT PANEL - Summary & Send */}
            <div className="w-[300px] flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sticky top-0">
                <h3 className="text-[14px] font-bold text-slate-700 mb-4">Prescription Summary</h3>

                <div className="mb-4 pb-4 border-b border-slate-200">
                  <div className="text-[13px] font-bold text-slate-900 mb-1">
                    {selectedPatient.name}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 mb-2">
                    {selectedPatient.id} · {selectedPatient.age} · {selectedPatient.insurance}
                  </div>
                  <div className="text-[11px] font-mono text-slate-500">
                    7 April 2026 · 2:07 PM
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-[16px] font-mono font-bold text-teal-600 mb-2">
                    {prescriptionItems.length} medication{prescriptionItems.length !== 1 ? 's' : ''}
                  </div>
                  {prescriptionItems.length > 0 && (
                    <div className="space-y-1 text-[12px] text-slate-600">
                      {prescriptionItems.map((item, idx) => (
                        <div key={idx}>
                          {idx + 1}. {item.drug.genericName} {item.strength} — {item.frequency}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {prescriptionItems.length > 0 && (
                  <>
                    <div className="mb-4 pb-4 border-b border-slate-200">
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
                        Safety Checks
                      </div>
                      <div className="space-y-1 text-[11px]">
                        <div className="text-emerald-600">✅ No allergy conflicts</div>
                        <div className="text-emerald-600">✅ All drugs on DHA formulary</div>
                        <div className="text-emerald-600">✅ No controlled substances</div>
                      </div>
                    </div>

                    <div className="mb-4 pb-4 border-b border-slate-200">
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
                        Send to Pharmacy
                      </div>
                      <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 mb-2">
                        <div className="text-[12px] font-medium text-slate-900 mb-1">
                          🏥 {selectedPatient.preferredPharmacy}
                        </div>
                        <div className="text-[10px] text-emerald-600">✅ Preferred</div>
                      </div>
                    </div>

                    <div className="mb-4 pb-4 border-b border-slate-200">
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
                        DHA ePrescription
                      </div>
                      <div className="space-y-1 text-[10px] text-slate-600">
                        <div>✅ Will be submitted to DHA</div>
                        <div>✅ Sync to Nabidh record</div>
                        <div className="text-amber-600 font-mono">Valid: 30 days</div>
                      </div>
                    </div>

                    <button
                      onClick={sendPrescription}
                      className="w-full py-3 bg-teal-600 text-white text-[15px] font-bold rounded-xl hover:bg-teal-700 transition-all hover:shadow-lg flex items-center justify-center space-x-2"
                      style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                    >
                      <Send className="w-5 h-5" />
                      <span>Send Prescription</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Allergy Hard Stop Modal */}
      {showAllergyStop && blockedDrug && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-red-600 rounded-2xl shadow-2xl w-full max-w-md p-8 text-center animate-in zoom-in-95 duration-200">
            <AlertOctagon className="w-16 h-16 text-white mx-auto mb-4 animate-pulse" />
            <h2 className="text-[24px] font-bold text-white mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              ALLERGY HARD STOP
            </h2>
            <p className="text-white text-[16px] mb-4">
              This drug cannot be prescribed
            </p>

            <div className="bg-red-700 rounded-lg p-4 mb-4">
              <div className="text-white text-[14px] font-bold mb-2">
                {selectedPatient?.name}
              </div>
              <div className="text-white text-[15px] font-bold mb-2">
                {blockedDrug.genericName}
              </div>
              <div className="text-red-100 text-[13px]">
                ALLERGY: {selectedPatient?.allergies[0]?.name} — {selectedPatient?.allergies[0]?.severity} {selectedPatient?.allergies[0]?.reaction}
              </div>
            </div>

            <p className="text-white text-[13px] mb-6 opacity-90">
              This prescription has been BLOCKED by CeenAiX clinical safety system.
            </p>

            <button
              onClick={() => {
                setShowAllergyStop(false);
                setBlockedDrug(null);
                setSearchQuery('');
              }}
              className="w-full py-3 bg-white text-red-600 text-[15px] font-bold rounded-xl hover:bg-red-50 transition-colors"
            >
              OK — Remove Drug
            </button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>

            <h2 className="text-[20px] font-bold text-emerald-700 mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Prescription Sent ✅
            </h2>

            <div className="bg-teal-50 rounded-lg p-4 mb-4">
              <div className="text-[11px] text-slate-500 mb-1">DHA Reference</div>
              <div className="text-[16px] font-mono font-bold text-teal-600 flex items-center justify-center space-x-2">
                <span>{prescriptionRef}</span>
                <button className="p-1 hover:bg-teal-100 rounded transition-colors">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="text-left space-y-2 mb-6 text-[13px] text-slate-600">
              <div><strong>Patient:</strong> {selectedPatient.name}</div>
              <div><strong>Pharmacy:</strong> {selectedPatient.preferredPharmacy}</div>
              <div><strong>Drugs:</strong> {prescriptionItems.length} medications</div>
              <div className="text-emerald-600 text-[12px]">
                ✅ Synced to Nabidh record<br />
                ✅ Submitted to DHA ePrescription<br />
                ✅ Patient notified via app + SMS
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={resetPrescription}
                className="w-full py-2.5 bg-teal-600 text-white text-[14px] font-semibold rounded-lg hover:bg-teal-700 transition-colors"
              >
                + New Prescription
              </button>
              <button className="w-full py-2.5 border border-slate-300 text-slate-700 text-[14px] font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center space-x-2">
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WritePrescription;
