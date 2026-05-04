import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  FolderOpen, Upload, ShieldCheck, Search, Grid3x3, List,
  ChevronDown, FileText, Image, File, Download, Share2,
  Eye, MoreVertical, X, CheckCircle, AlertTriangle, Calendar, ChevronUp, Clock, Bell
} from 'lucide-react';
import PatientSidebar from '../components/patient/PatientSidebar';
import PatientTopNav from '../components/patient/PatientTopNav';
import type { Document, DocumentCategory, DocumentStats } from '../types/documents';
import { MOCK_PATIENT } from '../types/patientDashboard';

type ViewMode = 'grid' | 'list';
type SortOption = 'newest' | 'oldest' | 'name-asc' | 'name-desc' | 'size' | 'category';


// ── Set Document Reminder Modal ───────────────────────────────────────────────
function SetDocReminderModal({ onClose }: { onClose: () => void }) {
  const [date, setDate] = useState('');
  const [channels, setChannels] = useState({ app: true, sms: false, whatsapp: false });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const toggleChannel = (ch: keyof typeof channels) => {
    setChannels(prev => ({ ...prev, [ch]: !prev[ch] }));
  };

  const handleSave = () => {
    if (!date) { setError('Please select a reminder date'); return; }
    setSaved(true);
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={saved ? undefined : onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
              <Bell className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Set Reminder</p>
              <p className="text-xs text-gray-400 mt-0.5">Influenza Vaccine — Oct 2026</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="px-6 py-5">
          {saved ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Reminder Set!</h3>
              <p className="text-gray-500 text-sm">You will be reminded about your Influenza Vaccine on</p>
              <p className="text-teal-600 font-bold text-base mt-1">{new Date(date).toLocaleDateString('en-AE', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p className="text-gray-400 text-xs mt-2">
                Via: {[channels.app && 'App', channels.sms && 'SMS', channels.whatsapp && 'WhatsApp'].filter(Boolean).join(', ') || 'No channel selected'}
              </p>
              <button onClick={onClose} className="mt-6 w-full py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors">
                Done
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Reminder Date <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  value={date}
                  onChange={e => { setDate(e.target.value); setError(''); }}
                  className={`w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none focus:ring-2 transition-colors ${error ? 'border-red-300 focus:ring-red-400' : 'border-gray-200 focus:ring-teal-500 focus:border-teal-500'}`}
                />
                {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Notify via</label>
                <div className="space-y-2">
                  {[
                    { key: 'app', label: '📱 App Notification' },
                    { key: 'sms', label: '💬 SMS' },
                    { key: 'whatsapp', label: '🟢 WhatsApp' },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => toggleChannel(key as keyof typeof channels)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${channels[key as keyof typeof channels] ? 'border-teal-600 bg-teal-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <span className="text-sm text-gray-700">{label}</span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${channels[key as keyof typeof channels] ? 'border-teal-600 bg-teal-600' : 'border-gray-300'}`}>
                        {channels[key as keyof typeof channels] && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={onClose} className="flex-1 py-3 rounded-xl font-semibold border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={handleSave} className="flex-1 py-3 rounded-xl font-semibold bg-teal-600 text-white hover:bg-teal-700 transition-colors">Save Reminder</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── Secure Vault Modal ────────────────────────────────────────────────────────
function SecureVaultModal({ onClose }: { onClose: () => void }) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Secure Vault</p>
              <p className="text-xs text-gray-400 mt-0.5">Your document security overview</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="px-6 py-5 overflow-y-auto flex-1 space-y-5">
          <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-emerald-800 text-sm">Your Vault is Secure</p>
              <p className="text-xs text-emerald-600 mt-0.5">All documents are encrypted and protected</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Encryption & Security</p>
            <div className="space-y-2">
              {[
                { icon: "🔐", label: "AES-256 Encryption", desc: "Military-grade encryption for all files" },
                { icon: "🔒", label: "End-to-End Encrypted", desc: "Only you can access your documents" },
                { icon: "🛡️", label: "Zero-Knowledge Storage", desc: "CeenAiX cannot read your files" },
                { icon: "🔑", label: "Two-Factor Authentication", desc: "Extra layer of account protection" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <span className="text-lg flex-shrink-0">{item.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">UAE Compliance</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: "🇦🇪", label: "UAE Data Residency", desc: "All data stored in UAE" },
                { icon: "🏥", label: "DHA Compliant", desc: "Dubai Health Authority approved" },
                { icon: "📋", label: "PDPL Protected", desc: "Personal Data Protection Law" },
                { icon: "🔗", label: "NABIDH Connected", desc: "UAE health data exchange" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl">
                  <span className="text-base flex-shrink-0">{item.icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{item.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Recent Access Log</p>
            <div className="space-y-2">
              {[
                { action: "Documents viewed", time: "Today, 9:42 AM", device: "Chrome — Dubai, UAE" },
                { action: "Lab report downloaded", time: "Yesterday, 3:15 PM", device: "Safari — Dubai, UAE" },
                { action: "Document shared", time: "2 days ago", device: "Chrome — Dubai, UAE" },
              ].map((log, i) => (
                <div key={i} className="flex items-start justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{log.action}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{log.device}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{log.time}</p>
                    <p className="text-xs text-teal-600 font-medium">You</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-gray-700">Storage Used</p>
              <p className="text-xs text-gray-500">12.8 MB of 100 MB</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-teal-500 rounded-full" style={{ width: "12.8%" }} />
            </div>
            <p className="text-xs text-emerald-600 font-medium mt-1">87.2 MB free — plenty of space</p>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0">
          <button onClick={onClose} className="w-full py-2.5 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors text-sm">
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── Upload Document Modal ─────────────────────────────────────────────────────
function UploadDocumentModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState("");
  const [docName, setDocName] = useState("");
  const [category, setCategory] = useState("lab-report");
  const [date, setDate] = useState("");
  const [issuedBy, setIssuedBy] = useState("");
  const [privacyLevel, setPrivacyLevel] = useState<"standard" | "sensitive">("standard");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadCategories = [
    { id: "lab-report", label: "Lab Report", emoji: "🟣" },
    { id: "imaging-report", label: "Imaging", emoji: "🔵" },
    { id: "prescription", label: "Prescription", emoji: "🩵" },
    { id: "insurance", label: "Insurance", emoji: "💙" },
    { id: "certificate", label: "Certificate", emoji: "🟢" },
    { id: "vaccination", label: "Vaccination", emoji: "🌿" },
    { id: "personal", label: "Personal", emoji: "⚫" },
  ];

  const handleFileSelect = (file: File) => {
    setFileName(file.name);
    if (!docName) setDocName(file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!fileName) newErrors.file = "Please select a file to upload";
    if (!docName.trim()) newErrors.docName = "Document name is required";
    if (!date) newErrors.date = "Date is required";
    if (!issuedBy.trim()) newErrors.issuedBy = "Issued by is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={step === "success" ? undefined : onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
              <Upload className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Upload Document</p>
              <p className="text-xs text-gray-400 mt-0.5">Add a new document to your vault</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="px-6 py-5 overflow-y-auto flex-1">
          {step === "success" ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Document Uploaded!</h3>
              <p className="text-gray-500 text-sm mb-1">
                <span className="font-semibold text-gray-700">{docName}</span> has been securely uploaded to your vault.
              </p>
              <div className="mt-4 p-3 bg-teal-50 border border-teal-200 rounded-xl text-left">
                <div className="flex items-center gap-2 text-xs text-teal-700">
                  <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                  <span>Document encrypted with AES-256 and stored in UAE servers</span>
                </div>
              </div>
              <button onClick={onClose} className="mt-6 w-full py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors">
                Done
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">File <span className="text-red-500">*</span></label>
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); const file = e.dataTransfer.files[0]; if (file) handleFileSelect(file); }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${dragOver ? "border-teal-500 bg-teal-50" : fileName ? "border-teal-400 bg-teal-50" : errors.file ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-teal-400 hover:bg-gray-50"}`}
                >
                  <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={e => { const file = e.target.files?.[0]; if (file) handleFileSelect(file); }} />
                  {fileName ? (
                    <div className="flex items-center justify-center gap-2">
                      <FileText className="w-5 h-5 text-teal-600" />
                      <span className="text-sm font-medium text-teal-700">{fileName}</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 font-medium">Drop file here or click to browse</p>
                      <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG, DOC up to 50MB</p>
                    </>
                  )}
                </div>
                {errors.file && <p className="text-xs text-red-500 mt-1">{errors.file}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Document Name <span className="text-red-500">*</span></label>
                <input type="text" value={docName} onChange={e => { setDocName(e.target.value); setErrors(p => ({ ...p, docName: "" })); }} placeholder="e.g. Blood Test Results — March 2026" className={`w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none focus:ring-2 transition-colors ${errors.docName ? "border-red-300 focus:ring-red-400" : "border-gray-200 focus:ring-teal-500 focus:border-teal-500"}`} />
                {errors.docName && <p className="text-xs text-red-500 mt-1">{errors.docName}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <div className="grid grid-cols-4 gap-2">
                  {uploadCategories.map(cat => (
                    <button key={cat.id} onClick={() => setCategory(cat.id)} className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${category === cat.id ? "border-teal-600 bg-teal-50" : "border-gray-200 hover:border-teal-300"}`}>
                      <span className="text-base">{cat.emoji}</span>
                      <span className={`text-xs font-medium leading-tight text-center ${category === cat.id ? "text-teal-700" : "text-gray-600"}`}>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date <span className="text-red-500">*</span></label>
                  <input type="date" value={date} onChange={e => { setDate(e.target.value); setErrors(p => ({ ...p, date: "" })); }} className={`w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none focus:ring-2 transition-colors ${errors.date ? "border-red-300 focus:ring-red-400" : "border-gray-200 focus:ring-teal-500 focus:border-teal-500"}`} />
                  {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Issued By <span className="text-red-500">*</span></label>
                  <input type="text" value={issuedBy} onChange={e => { setIssuedBy(e.target.value); setErrors(p => ({ ...p, issuedBy: "" })); }} placeholder="e.g. Dr. Fatima" className={`w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none focus:ring-2 transition-colors ${errors.issuedBy ? "border-red-300 focus:ring-red-400" : "border-gray-200 focus:ring-teal-500 focus:border-teal-500"}`} />
                  {errors.issuedBy && <p className="text-xs text-red-500 mt-1">{errors.issuedBy}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Privacy Level</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "standard", label: "Standard", desc: "Regular medical document", icon: "📄" },
                    { id: "sensitive", label: "Sensitive", desc: "Extra protection applied", icon: "🔒" },
                  ].map(opt => (
                    <button key={opt.id} onClick={() => setPrivacyLevel(opt.id as "standard" | "sensitive")} className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${privacyLevel === opt.id ? "border-teal-600 bg-teal-50" : "border-gray-200 hover:border-teal-300"}`}>
                      <span className="text-xl">{opt.icon}</span>
                      <div>
                        <p className={`text-xs font-semibold ${privacyLevel === opt.id ? "text-teal-700" : "text-gray-700"}`}>{opt.label}</p>
                        <p className="text-xs text-gray-400">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Notes <span className="text-gray-400 font-normal">(optional)</span></label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Any additional notes..." className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={onClose} className="flex-1 py-3 rounded-xl font-semibold border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={() => { if (validate()) setStep("success"); }} className="flex-1 py-3 rounded-xl font-semibold bg-teal-600 text-white hover:bg-teal-700 transition-colors flex items-center justify-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Document
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function Documents() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<DocumentCategory[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showBookTestModal, setShowBookTestModal] = useState(false);
  const [showSetReminderModal, setShowSetReminderModal] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const onScroll = () => setShowScrollTop(el.scrollTop > 300);
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });

  const stats: DocumentStats = {
    totalDocuments: 22,
    newThisMonth: 5,
    needsAction: 2,
    storageUsedMB: 12.8,
    storageTotalMB: 100,
    storagePercent: 12.8
  };

  const mockDocuments: Document[] = [
    {
      id: 'doc-001',
      name: 'Full Blood Panel — March 2026',
      fileName: 'lab_report_20260305_full_panel.pdf',
      fileType: 'pdf',
      fileSize: 284,
      pages: 2,
      category: 'lab-report',
      categoryLabel: 'Lab Report',
      categoryColor: '#7C3AED',
      date: '5 March 2026',
      issuedBy: 'Dubai Medical Laboratory',
      orderedBy: 'Dr. Fatima Al Mansoori',
      contains: 'HbA1c + Glucose + Lipid Panel + Vit D + CBC + CRP',
      status: 'reviewed',
      statusLabel: 'Reviewed',
      nabidh: true,
      tags: [
        { id: 'tag-1', label: 'Diabetes', color: '#0D9488' },
        { id: 'tag-2', label: 'Cholesterol', color: '#0D9488' }
      ],
      isNew: true,
      daysAgo: 28,
      dhaRef: 'LAB-DML-2026-00394'
    },
    {
      id: 'doc-002',
      name: 'Blood Tests — January 2026',
      fileName: 'lab_report_20260110_panel.pdf',
      fileType: 'pdf',
      fileSize: 198,
      pages: 2,
      category: 'lab-report',
      categoryLabel: 'Lab Report',
      categoryColor: '#7C3AED',
      date: '10 January 2026',
      issuedBy: 'Emirates Diagnostics Centre',
      orderedBy: 'Dr. Ahmed Al Rashidi',
      contains: 'HbA1c + Lipid Panel + ECG report',
      status: 'reviewed',
      statusLabel: 'Reviewed',
      nabidh: true,
      daysAgo: 83
    },
    {
      id: 'doc-003',
      name: 'Blood Work — October 2025',
      fileName: 'lab_report_20251015_panel.pdf',
      fileType: 'pdf',
      fileSize: 241,
      pages: 2,
      category: 'lab-report',
      categoryLabel: 'Lab Report',
      categoryColor: '#7C3AED',
      date: '15 October 2025',
      issuedBy: 'Dubai Medical Laboratory',
      orderedBy: 'Dr. Fatima Al Mansoori',
      contains: 'HbA1c + Glucose + RFT + LFT',
      status: 'reviewed',
      statusLabel: 'Reviewed',
      daysAgo: 170
    },
    {
      id: 'doc-004',
      name: 'Vitamin D Retest Order — June 2026',
      fileName: 'lab_order_vitd_retest_june2026.pdf',
      fileType: 'pdf',
      fileSize: 45,
      pages: 1,
      category: 'lab-report',
      categoryLabel: 'Lab Report',
      categoryColor: '#7C3AED',
      date: '6 March 2026',
      issuedBy: 'Dr. Fatima Al Mansoori',
      contains: 'Lab order for Vitamin D retest',
      status: 'pending',
      statusLabel: 'Pending — test due June 5, 2026',
      isNew: true,
      daysAgo: 27
    },
    {
      id: 'doc-005',
      name: 'Cardiac MRI Report — February 2026',
      fileName: 'mri_cardiac_report_20260215.pdf',
      fileType: 'pdf',
      fileSize: 1200,
      pages: 4,
      category: 'imaging-report',
      categoryLabel: 'Imaging Report',
      categoryColor: '#4F46E5',
      date: '15 February 2026',
      issuedBy: 'Al Noor Medical Center — Radiology',
      orderedBy: 'Dr. Ahmed Al Rashidi',
      contains: 'Dr. Rania Al Suwaidi, FRCR',
      status: 'reviewed',
      statusLabel: 'Reviewed',
      nabidh: true,
      isNew: true,
      daysAgo: 49,
      dhaRef: 'DHA-RAD-RPT-2026-00289'
    },
    {
      id: 'doc-006',
      name: 'CT Chest — Calcium Scoring — January 2026',
      fileName: 'ct_chest_cac_report_20260120.pdf',
      fileType: 'pdf',
      fileSize: 847,
      pages: 3,
      category: 'imaging-report',
      categoryLabel: 'Imaging Report',
      categoryColor: '#4F46E5',
      date: '20 January 2026',
      issuedBy: 'Al Noor Medical Center — Radiology',
      orderedBy: 'Dr. Ahmed Al Rashidi',
      contains: 'Dr. Khalid Al Mansouri, FRCR',
      status: 'reviewed',
      statusLabel: 'Reviewed',
      nabidh: true,
      daysAgo: 73
    },
    {
      id: 'doc-007',
      name: 'Abdominal Ultrasound — March 2026',
      fileName: 'ultrasound_abdomen_report_20260305.pdf',
      fileType: 'pdf',
      fileSize: 312,
      pages: 2,
      category: 'imaging-report',
      categoryLabel: 'Imaging Report',
      categoryColor: '#4F46E5',
      date: '5 March 2026',
      issuedBy: 'Dubai Medical Laboratory',
      status: 'reviewed',
      statusLabel: 'Reviewed',
      nabidh: true,
      isNew: true,
      daysAgo: 28
    },
    {
      id: 'doc-008',
      name: 'Lumbar Spine MRI — September 2025',
      fileName: 'mri_lumbar_spine_report_20250912.pdf',
      fileType: 'pdf',
      fileSize: 934,
      pages: 3,
      category: 'imaging-report',
      categoryLabel: 'Imaging Report',
      categoryColor: '#4F46E5',
      date: '12 September 2025',
      issuedBy: 'Emirates Diagnostics Centre',
      status: 'completed',
      statusLabel: 'Reviewed — Resolved condition',
      daysAgo: 204
    },
    {
      id: 'doc-009',
      name: 'Active Prescriptions — March 2026',
      fileName: 'prescription_active_20260305.pdf',
      fileType: 'pdf',
      fileSize: 156,
      pages: 2,
      category: 'prescription',
      categoryLabel: 'Prescription',
      categoryColor: '#0D9488',
      date: '5 March 2026',
      issuedBy: 'Dr. Fatima Al Mansoori',
      contains: 'Metformin 850mg + Vitamin D 2000IU',
      status: 'active',
      statusLabel: 'Active — dispensed at Al Shifa Pharmacy',
      validUntil: '5 September 2026',
      daysRemaining: 153,
      refills: 5,
      isNew: true,
      daysAgo: 28,
      dhaRef: 'RX-20260305-047821'
    },
    {
      id: 'doc-010',
      name: 'Cardiac Medications Prescription — Jan 2026',
      fileName: 'prescription_cardiac_20260110.pdf',
      fileType: 'pdf',
      fileSize: 134,
      pages: 1,
      category: 'prescription',
      categoryLabel: 'Prescription',
      categoryColor: '#0D9488',
      date: '10 January 2026',
      issuedBy: 'Dr. Ahmed Al Rashidi',
      contains: 'Atorvastatin 20mg + Amlodipine 5mg',
      status: 'active',
      statusLabel: 'Active',
      validUntil: '10 July 2026',
      refills: 11,
      daysAgo: 83,
      dhaRef: 'RX-20260110-039211'
    },
    {
      id: 'doc-011',
      name: 'Azithromycin — Short Course — Feb 2026',
      fileName: 'prescription_azithromycin_20260201.pdf',
      fileType: 'pdf',
      fileSize: 98,
      pages: 1,
      category: 'prescription',
      categoryLabel: 'Prescription',
      categoryColor: '#0D9488',
      date: '1 February 2026',
      issuedBy: 'Dr. Tooraj Helmi',
      contains: 'Azithromycin 500mg — 7-day course',
      status: 'completed',
      statusLabel: 'Completed',
      daysAgo: 62
    },
    {
      id: 'doc-012',
      name: 'Daman Gold Insurance Card 2026',
      fileName: 'daman_insurance_card_2026.pdf',
      fileType: 'pdf',
      fileSize: 287,
      pages: 1,
      category: 'insurance',
      categoryLabel: 'Insurance',
      categoryColor: '#3B82F6',
      date: '1 January 2026',
      issuedBy: 'Daman National Health Insurance',
      contains: 'Policy #: DAM-2024-XXXXXX',
      status: 'valid',
      statusLabel: 'Active — 269 days remaining',
      validUntil: '31 December 2026',
      daysRemaining: 269,
      daysAgo: 93
    },
    {
      id: 'doc-013',
      name: 'Insurance Pre-Authorization — Cardiac MRI',
      fileName: 'preauth_cardiac_mri_20260210.pdf',
      fileType: 'pdf',
      fileSize: 124,
      pages: 2,
      category: 'insurance',
      categoryLabel: 'Insurance',
      categoryColor: '#3B82F6',
      date: '10 February 2026',
      issuedBy: 'Daman National Health Insurance',
      contains: 'Auth #: PA-DAM-2026-00847',
      status: 'completed',
      statusLabel: 'Used — procedure completed',
      isNew: true,
      daysAgo: 54
    },
    {
      id: 'doc-014',
      name: 'Insurance Policy Summary 2026',
      fileName: 'daman_policy_summary_2026.pdf',
      fileType: 'pdf',
      fileSize: 542,
      pages: 8,
      category: 'insurance',
      categoryLabel: 'Insurance',
      categoryColor: '#3B82F6',
      date: '1 January 2026',
      issuedBy: 'Daman',
      contains: 'Benefits, coverage limits, exclusions, co-pay structure',
      status: 'active',
      statusLabel: 'Active',
      daysAgo: 93
    },
    {
      id: 'doc-015',
      name: 'Sick Leave Certificate — Feb 2026',
      fileName: 'sick_leave_cert_20260205.pdf',
      fileType: 'pdf',
      fileSize: 87,
      pages: 1,
      category: 'certificate',
      categoryLabel: 'Certificate',
      categoryColor: '#059669',
      date: '5 February 2026',
      issuedBy: 'Dr. Tooraj Helmi — Gulf Medical Center',
      contains: '3 days sick leave (3–5 Feb 2026)',
      status: 'completed',
      statusLabel: 'Official DHA-stamped certificate',
      daysAgo: 59
    },
    {
      id: 'doc-016',
      name: 'Medical Fitness Certificate — Feb 2026',
      fileName: 'fitness_certificate_20260220.pdf',
      fileType: 'pdf',
      fileSize: 109,
      pages: 1,
      category: 'certificate',
      categoryLabel: 'Certificate',
      categoryColor: '#059669',
      date: '20 February 2026',
      issuedBy: 'Dr. Ahmed Al Rashidi — Al Noor',
      contains: 'General medical fitness clearance',
      status: 'valid',
      statusLabel: 'Valid 6 months',
      validUntil: 'August 2026',
      isNew: true,
      daysAgo: 44
    },
    {
      id: 'doc-017',
      name: 'Referral Letter — Physiotherapy — Sep 2025',
      fileName: 'referral_physiotherapy_20250914.pdf',
      fileType: 'pdf',
      fileSize: 78,
      pages: 1,
      category: 'certificate',
      categoryLabel: 'Certificate',
      categoryColor: '#059669',
      date: '14 September 2025',
      issuedBy: 'Dr. Tooraj Helmi',
      contains: 'Dubai Physiotherapy Center — L5/S1 disc bulge',
      status: 'completed',
      statusLabel: 'Completed — condition resolved',
      daysAgo: 202
    },
    {
      id: 'doc-018',
      name: 'COVID-19 Vaccination Certificate',
      fileName: 'covid_vaccine_cert.pdf',
      fileType: 'pdf',
      fileSize: 234,
      pages: 1,
      category: 'vaccination',
      categoryLabel: 'Vaccination',
      categoryColor: '#16A34A',
      date: 'March 2021',
      issuedBy: 'UAE Ministry of Health',
      contains: 'Pfizer-BioNTech — 2 doses + 1 booster',
      status: 'completed',
      statusLabel: 'Fully vaccinated',
      daysAgo: 1825
    },
    {
      id: 'doc-019',
      name: 'Influenza Vaccine — Oct 2025',
      fileName: 'flu_vaccine_oct2025.pdf',
      fileType: 'pdf',
      fileSize: 76,
      pages: 1,
      category: 'vaccination',
      categoryLabel: 'Vaccination',
      categoryColor: '#16A34A',
      date: '15 October 2025',
      issuedBy: 'Gulf Medical Center',
      contains: 'Dr. Tooraj Helmi — Influenza Quadrivalent',
      status: 'valid',
      statusLabel: 'Current — valid until Oct 2026',
      validUntil: 'October 2026',
      daysAgo: 170
    },
    {
      id: 'doc-020',
      name: 'Emirates ID — Front & Back (Scan)',
      fileName: 'emirates_id_scan.pdf',
      fileType: 'pdf',
      fileSize: 421,
      pages: 1,
      category: 'personal',
      categoryLabel: 'Personal',
      categoryColor: '#64748B',
      date: '10 March 2026',
      issuedBy: 'Parnia (self)',
      uploadedBy: 'You',
      note: 'For quick sharing with healthcare providers',
      status: 'active',
      statusLabel: 'Personal document',
      privacyLevel: 'sensitive',
      daysAgo: 23
    },
    {
      id: 'doc-021',
      name: 'Daman Insurance Card — Photo',
      fileName: 'daman_card_photo.jpg',
      fileType: 'jpg',
      fileSize: 1200,
      category: 'personal',
      categoryLabel: 'Personal',
      categoryColor: '#64748B',
      date: '5 January 2026',
      issuedBy: 'Parnia (self)',
      uploadedBy: 'You',
      note: 'Photo of physical insurance card',
      status: 'active',
      statusLabel: 'Personal document',
      daysAgo: 88
    },
    {
      id: 'doc-022',
      name: 'Previous Hospital Records — Iran 2019',
      fileName: 'hospital_records_2019.pdf',
      fileType: 'pdf',
      fileSize: 3400,
      pages: 12,
      category: 'personal',
      categoryLabel: 'Personal',
      categoryColor: '#64748B',
      date: '1 March 2024',
      issuedBy: 'Parnia (self)',
      uploadedBy: 'You',
      note: 'Historical records from before moving to UAE. Includes original diabetes diagnosis from Tehran.',
      language: 'Persian/Farsi (original) + partial English',
      status: 'active',
      statusLabel: 'Personal archive',
      privacyLevel: 'sensitive',
      daysAgo: 763
    }
  ];

  const categories = [
    { id: 'lab-report' as DocumentCategory, label: 'Lab Reports', color: '#7C3AED', count: 4 },
    { id: 'imaging-report' as DocumentCategory, label: 'Imaging Reports', color: '#4F46E5', count: 4 },
    { id: 'prescription' as DocumentCategory, label: 'Prescriptions', color: '#0D9488', count: 3 },
    { id: 'insurance' as DocumentCategory, label: 'Insurance', color: '#3B82F6', count: 3 },
    { id: 'certificate' as DocumentCategory, label: 'Certificates', color: '#059669', count: 3 },
    { id: 'vaccination' as DocumentCategory, label: 'Vaccination', color: '#16A34A', count: 2 },
    { id: 'personal' as DocumentCategory, label: 'Personal', color: '#64748B', count: 3 }
  ];

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf': return <FileText className="w-8 h-8 text-red-500" />;
      case 'jpg':
      case 'png': return <Image className="w-8 h-8 text-blue-500" />;
      default: return <File className="w-8 h-8 text-slate-500" />;
    }
  };

  const getFileTypeColor = (fileType: string) => {
    switch (fileType) {
      case 'pdf': return 'bg-red-50 text-red-600';
      case 'jpg':
      case 'png': return 'bg-blue-50 text-blue-600';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.issuedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(doc.category);
    return matchesSearch && matchesCategory;
  });

  const groupedDocuments = categories.map(cat => ({
    ...cat,
    documents: filteredDocuments.filter(doc => doc.category === cat.id)
  })).filter(cat => cat.documents.length > 0);

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <PatientTopNav patientName={MOCK_PATIENT.name} />

      <div className="flex flex-1 overflow-hidden">
        <PatientSidebar currentPage="documents" />

        <main ref={mainRef} className="flex-1 overflow-y-auto">
        <div className="flex-1 p-8 overflow-auto">
          <div className="mb-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                  My Documents 📁
                </h1>
                <p className="text-slate-500 text-sm">
                  All your medical records, reports, and certificates — securely stored
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowSecurityModal(true)}
                  className="px-5 py-3 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 rounded-xl font-medium flex items-center gap-2 transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Secure Vault
                </button>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-teal-500/30"
                >
                  <Upload className="w-5 h-5" />
                  Upload Document
                </button>
              </div>
            </div>
          </div>

          <div
            className="bg-slate-900 rounded-2xl p-6 mb-6 animate-slideUp"
            style={{ animationDelay: '80ms' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-teal-900 rounded-full flex items-center justify-center">
                    <FolderOpen className="w-6 h-6 text-teal-400" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg" style={{ fontFamily: 'DM Mono, monospace' }}>
                      {stats.storageUsedMB} MB used of {stats.storageTotalMB} MB
                    </div>
                    <div className="text-teal-300 text-xs">
                      {(100 - stats.storagePercent).toFixed(0)}% free — plenty of space
                    </div>
                  </div>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-teal-500 transition-all duration-700"
                    style={{ width: `${stats.storagePercent}%` }}
                  />
                </div>
              </div>

              <div className="flex-1 text-center">
                <div className="text-white font-bold text-2xl mb-1" style={{ fontFamily: 'DM Mono, monospace' }}>
                  {stats.totalDocuments} documents
                </div>
                <div className="text-slate-400 text-xs mb-2">across 7 categories</div>
                <div className="flex items-center justify-center gap-2 text-xs text-slate-400 flex-wrap">
                  {categories.map(cat => (
                    <span key={cat.id}>
                      <span style={{ color: cat.color }}>●</span> {cat.label}({cat.count})
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex-1">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2 text-white">
                    <ShieldCheck className="w-4 h-4" />
                    <span>AES-256 Encrypted</span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <span className="text-lg">🇦🇪</span>
                    <span>UAE Data Residency</span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <span className="text-lg">🛡️</span>
                    <span>DHA Compliant</span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <span className="text-lg">🔒</span>
                    <span>PDPL Protected</span>
                  </div>
                </div>
                <div className="text-slate-400 text-xs italic mt-2 text-center">
                  All documents encrypted end-to-end
                </div>
              </div>

              <div className="ml-6 text-right">
                <div className="relative inline-block">
                  <div className="px-4 py-2 bg-teal-500 text-white rounded-lg font-bold text-sm animate-pulse">
                    {stats.newThisMonth} NEW
                  </div>
                  <div className="text-slate-400 text-xs mt-1">new this month</div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="bg-white rounded-xl p-4 mb-6 flex items-center gap-4 shadow-sm animate-slideUp"
            style={{ animationDelay: '160ms' }}
          >
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documents by name, doctor, or type..."
                className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 flex-1 overflow-x-auto">
              <button
                onClick={() => setSelectedCategories([])}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategories.length === 0
                    ? 'bg-teal-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                All ({stats.totalDocuments})
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    if (selectedCategories.includes(cat.id)) {
                      setSelectedCategories(selectedCategories.filter(c => c !== cat.id));
                    } else {
                      setSelectedCategories([...selectedCategories, cat.id]);
                    }
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategories.includes(cat.id)
                      ? 'bg-teal-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {cat.label} ({cat.count})
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {stats.needsAction > 0 && (
            <div
              className="bg-white border-l-4 border-amber-500 rounded-xl p-5 mb-6 animate-slideUp"
              style={{ animationDelay: '240ms' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-amber-700">Documents Requiring Attention</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2 border-b border-amber-100">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-amber-500 rounded-full" />
                    <div>
                      <div className="text-sm font-medium text-slate-900">Vitamin D Retest Order</div>
                      <div className="text-xs text-slate-500">Lab order due: 5 June 2026 (60 days)</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPreviewDocument(mockDocuments.find(d => d.id === 'doc-004') || null)}
                      className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded-lg transition-all">
                      View Document
                    </button>
                    <button
                      onClick={() => setShowBookTestModal(true)}
                      className="px-3 py-1 text-xs bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-all">
                      Book Test
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-amber-500 rounded-full" />
                    <div>
                      <div className="text-sm font-medium text-slate-900">Influenza Vaccine</div>
                      <div className="text-xs text-slate-500">Next dose due: October 2026 (6 months)</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPreviewDocument(mockDocuments.find(d => d.id === 'doc-019') || null)}
                      className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded-lg transition-all">
                      View Record
                    </button>
                    <button
                      onClick={() => setShowSetReminderModal(true)}
                      className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded-lg transition-all">
                      Set Reminder
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div
            className="grid grid-cols-5 gap-4 mb-6 animate-slideUp"
            style={{ animationDelay: '320ms' }}
          >
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-3xl font-bold text-slate-900 mb-1" style={{ fontFamily: 'DM Mono, monospace' }}>
                {stats.totalDocuments}
              </div>
              <div className="text-xs text-slate-400">Documents</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-3xl font-bold text-teal-600 mb-1" style={{ fontFamily: 'DM Mono, monospace' }}>
                {stats.newThisMonth}
              </div>
              <div className="text-xs text-slate-400">New</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-3xl font-bold text-amber-600 mb-1" style={{ fontFamily: 'DM Mono, monospace' }}>
                {stats.needsAction}
              </div>
              <div className="text-xs text-slate-400">Pending</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-2xl font-bold text-slate-900 mb-1" style={{ fontFamily: 'DM Mono, monospace' }}>
                {stats.storageUsedMB} MB
              </div>
              <div className="text-xs text-slate-400">of {stats.storageTotalMB} MB</div>
              <div className="w-full bg-slate-200 rounded-full h-1 mt-2">
                <div className="h-full bg-teal-500 rounded-full" style={{ width: `${stats.storagePercent}%` }} />
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <ShieldCheck className="w-7 h-7 text-emerald-600 mb-1" />
              <div className="text-sm font-bold text-emerald-600">Encrypted</div>
              <div className="text-xs text-slate-400">AES-256 ✓</div>
            </div>
          </div>

          {viewMode === 'grid' && (
            <div className="space-y-6">
              {groupedDocuments.map((category, catIndex) => (
                <div
                  key={category.id}
                  className="animate-slideUp"
                  style={{ animationDelay: `${400 + catIndex * 80}ms` }}
                >
                  <div
                    className="flex items-center justify-between px-4 py-3 mb-4 rounded-lg border-l-3"
                    style={{
                      borderLeftColor: category.color,
                      backgroundColor: `${category.color}10`
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{category.id === 'lab-report' ? '🟣' : category.id === 'imaging-report' ? '🔵' : category.id === 'prescription' ? '🩵' : category.id === 'insurance' ? '💙' : category.id === 'certificate' ? '🟢' : category.id === 'vaccination' ? '🌿' : '⚫'}</span>
                      <div>
                        <h3 className="font-bold text-sm" style={{ color: category.color }}>
                          {category.label}
                        </h3>
                      </div>
                      <span
                        className="px-2 py-1 rounded-full text-white text-xs font-bold"
                        style={{ backgroundColor: category.color }}
                      >
                        {category.documents.length}
                      </span>
                    </div>
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  </div>

                  <div className="grid grid-cols-3 gap-5">
                    {category.documents.map((doc, docIndex) => (
                      <div
                        key={doc.id}
                        className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:scale-[1.015] transition-all duration-200 overflow-hidden group"
                        style={{ animationDelay: `${docIndex * 40}ms` }}
                      >
                        <div
                          className="h-14 px-4 py-3 flex items-center justify-between"
                          style={{ backgroundColor: `${category.color}15` }}
                        >
                          <span
                            className="px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1"
                            style={{ backgroundColor: `${category.color}20`, color: category.color }}
                          >
                            {category.label}
                          </span>
                          {doc.isNew && (
                            <span className="px-2 py-1 bg-teal-500 text-white rounded text-xs font-bold animate-pulse">
                              NEW
                            </span>
                          )}
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="w-5 h-5 text-slate-400 hover:text-slate-600" />
                          </button>
                        </div>

                        <div className="p-4">
                          <div className="flex justify-center mb-3">
                            <div className={`w-16 h-16 rounded-full ${getFileTypeColor(doc.fileType)} flex items-center justify-center`}>
                              {getFileIcon(doc.fileType)}
                              <span className="absolute mt-12 px-2 py-0.5 bg-slate-900 text-white text-xs rounded font-bold uppercase" style={{ fontFamily: 'DM Mono, monospace' }}>
                                {doc.fileType}
                              </span>
                            </div>
                          </div>

                          <h4 className="font-bold text-sm text-slate-900 mb-2 line-clamp-2 min-h-[40px]" style={{ fontFamily: 'Playfair Display, serif' }}>
                            {doc.name}
                          </h4>

                          <div className="space-y-1 text-xs text-slate-500 mb-3">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3 h-3" />
                              <span style={{ fontFamily: 'DM Mono, monospace' }}>{doc.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400">📍</span>
                              <span className="truncate">{doc.issuedBy}</span>
                            </div>
                            {doc.orderedBy && (
                              <div className="flex items-center gap-2">
                                <span className="text-slate-400">👤</span>
                                <span className="truncate">{doc.orderedBy}</span>
                              </div>
                            )}
                          </div>

                          <div className="text-xs text-slate-400 mb-3" style={{ fontFamily: 'DM Mono, monospace' }}>
                            {doc.fileType.toUpperCase()} · {doc.pages && `${doc.pages} pages · `}{doc.fileSize} KB
                          </div>

                          <div className="flex items-center gap-2 mb-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              doc.status === 'reviewed' || doc.status === 'active' || doc.status === 'valid' || doc.status === 'completed'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}>
                              {doc.statusLabel}
                            </span>
                            {doc.nabidh && (
                              <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-xs font-medium">
                                Nabidh ✓
                              </span>
                            )}
                          </div>

                          {doc.tags && doc.tags.length > 0 && (
                            <div className="flex items-center gap-1 mb-4 flex-wrap">
                              {doc.tags.slice(0, 2).map(tag => (
                                <span
                                  key={tag.id}
                                  className="px-2 py-1 bg-teal-50 text-teal-600 rounded text-xs"
                                >
                                  {tag.label}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="border-t border-slate-100 p-3 grid grid-cols-3 gap-2">
                          <button
                            onClick={() => setPreviewDocument(doc)}
                            className="flex items-center justify-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-medium transition-all"
                          >
                            <Eye className="w-3 h-3" />
                            Preview
                          </button>
                          <button className="flex items-center justify-center gap-1 px-3 py-2 bg-teal-50 hover:bg-teal-100 text-teal-600 rounded-lg text-xs font-medium transition-all">
                            <Download className="w-3 h-3" />
                            Download
                          </button>
                          <button className="flex items-center justify-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-medium transition-all">
                            <Share2 className="w-3 h-3" />
                            Share
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredDocuments.length === 0 && (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">No documents found</h3>
              <p className="text-slate-500 mb-4">Try a different search term or category filter</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategories([]);
                }}
                className="text-teal-600 hover:text-teal-700 font-medium"
              >
                Clear Search ✕
              </button>
            </div>
          )}
        </div>
        </main>
      </div>

      {previewDocument && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-scaleIn">
            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  {getFileIcon(previewDocument.fileType)}
                </div>
                <h3 className="text-white font-bold">{previewDocument.name}</h3>
              </div>
              <button
                onClick={() => setPreviewDocument(null)}
                className="text-white hover:bg-white/10 p-2 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="bg-slate-50 rounded-xl p-6 mb-6">
                <h4 className="text-sm font-bold text-slate-900 mb-4">Document Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-slate-500 text-xs mb-1">Category</div>
                    <div className="font-medium">{previewDocument.categoryLabel}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs mb-1">Date</div>
                    <div className="font-medium" style={{ fontFamily: 'DM Mono, monospace' }}>{previewDocument.date}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs mb-1">File Type</div>
                    <div className="font-medium uppercase">{previewDocument.fileType}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs mb-1">File Size</div>
                    <div className="font-medium" style={{ fontFamily: 'DM Mono, monospace' }}>{previewDocument.fileSize} KB</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-slate-500 text-xs mb-1">Issued By</div>
                    <div className="font-medium">{previewDocument.issuedBy}</div>
                  </div>
                  {previewDocument.dhaRef && (
                    <div className="col-span-2">
                      <div className="text-slate-500 text-xs mb-1">DHA Reference</div>
                      <div className="font-medium" style={{ fontFamily: 'DM Mono, monospace' }}>{previewDocument.dhaRef}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white border-2 border-slate-200 rounded-xl p-8">
                <div className="text-center text-slate-500 py-12">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <p className="text-sm">Document preview not available in demo mode</p>
                  <p className="text-xs mt-2">Click Download to view the full document</p>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button className="flex-1 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all">
                  <Download className="w-5 h-5" />
                  Download
                </button>
                <button className="flex-1 px-6 py-3 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 rounded-xl font-medium flex items-center justify-center gap-2 transition-all">
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Book Test Modal — Coming Soon */}
      {showBookTestModal && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowBookTestModal(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-teal-600" />
                </div>
                <p className="font-bold text-gray-900 text-sm">Book Lab Test</p>
              </div>
              <button onClick={() => setShowBookTestModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div className="px-6 py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-teal-400" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">In Progress</h3>
              <p className="text-gray-500 text-sm">Lab test booking will be available soon. You can book your Vitamin D retest through the Appointments page in the meantime.</p>
              <button onClick={() => setShowBookTestModal(false)} className="mt-6 px-6 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors">
                Got it
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Set Reminder Modal */}
      {showSetReminderModal && createPortal(
        <SetDocReminderModal onClose={() => setShowSetReminderModal(false)} />,
        document.body
      )}

      {/* Secure Vault Modal */}
      {showSecurityModal && (
        <SecureVaultModal onClose={() => setShowSecurityModal(false)} />
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <UploadDocumentModal onClose={() => setShowUploadModal(false)} />
      )}

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-11 h-11 bg-teal-600 hover:bg-teal-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}