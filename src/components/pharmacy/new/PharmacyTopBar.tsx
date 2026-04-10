import React, { useState } from 'react';
import { ScanBarcode, ClipboardPlus, Bell, ChevronDown, X, CheckCircle2 } from 'lucide-react';

interface PharmacyTopBarProps {
  pageTitle: string;
  onNavigate: (page: string) => void;
  showNewRx?: boolean;
  newRxPatient?: string;
}

const PharmacyTopBar: React.FC<PharmacyTopBarProps> = ({
  pageTitle,
  onNavigate,
  showNewRx = true,
  newRxPatient = 'Aisha Mohammed Al Reem',
}) => {
  const [showBanner, setShowBanner] = useState(showNewRx);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [scanResult, setScanResult] = useState('');
  const [scanning, setScanning] = useState(false);

  const handleScan = () => {
    setShowScanModal(true);
    setScanning(true);
    setScanResult('');
    setTimeout(() => {
      setScanResult('RX-20260407-003124 — Aisha Mohammed Al Reem — Furosemide 60mg + Spironolactone 25mg');
      setScanning(false);
    }, 1400);
  };

  return (
    <div className="sticky top-0 z-30 bg-white border-b border-slate-200 flex-shrink-0" style={{ minHeight: 64 }}>
      <div className="flex items-center h-16 px-6 gap-4">
        <div className="flex-shrink-0">
          <h1 className="font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 18 }}>
            {pageTitle}
          </h1>
          <div className="text-slate-400" style={{ fontFamily: 'Inter, sans-serif', fontSize: 12 }}>
            Al Shifa Pharmacy · 7 April 2026 · 2:07 PM
          </div>
        </div>

        <div className="flex-1 flex justify-center">
          {showBanner && (
            <div
              className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5"
              style={{ fontSize: 13 }}
            >
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse flex-shrink-0" />
              <span className="text-blue-700 font-medium">
                New prescription received — {newRxPatient}
              </span>
              <button
                onClick={() => { onNavigate('dispense'); setShowBanner(false); }}
                className="ml-1 text-white rounded px-2.5 py-0.5 text-xs font-semibold transition-colors"
                style={{ background: '#059669', fontSize: 11 }}
                onMouseEnter={e => { e.currentTarget.style.background = '#047857'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#059669'; }}
              >
                View
              </button>
              <button onClick={() => setShowBanner(false)} className="text-blue-400 hover:text-blue-600 ml-0.5">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleScan}
            className="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors"
            style={{ background: '#ECFDF5', color: '#065F46', fontSize: 13, height: 36, fontFamily: 'Inter, sans-serif' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#D1FAE5'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#ECFDF5'; }}
          >
            <ScanBarcode className="w-4 h-4" />
            <span className="font-medium">Scan Barcode</span>
          </button>

          <button
            onClick={() => onNavigate('new-rx')}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-white transition-colors"
            style={{ background: '#059669', fontSize: 13, height: 36, fontFamily: 'Inter, sans-serif' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#047857'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#059669'; }}
          >
            <ClipboardPlus className="w-4 h-4" />
            <span className="font-medium">New Manual Rx</span>
          </button>

          <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <Bell className="w-5 h-5 text-slate-500" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-100 transition-colors"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}
              >
                RH
              </div>
              <span className="text-slate-700 font-medium" style={{ fontSize: 13 }}>Rania Hassan</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
            {showUserMenu && (
              <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100 mb-1">
                  <div className="font-semibold text-slate-900" style={{ fontSize: 13 }}>Rania Hassan</div>
                  <div className="text-slate-500" style={{ fontSize: 11 }}>Head Pharmacist</div>
                  <div className="text-emerald-600 font-mono mt-0.5" style={{ fontSize: 10 }}>DHA-PHAR-2017-001294 ✅</div>
                </div>
                <button
                  onClick={() => { setShowUserMenu(false); onNavigate('pharmacy-profile'); }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-slate-50 text-slate-700 transition-colors"
                  style={{ fontSize: 13 }}
                >
                  My Pharmacy Profile
                </button>
                <button
                  onClick={() => { setShowUserMenu(false); window.location.href = '/'; }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-red-50 text-red-600 transition-colors"
                  style={{ fontSize: 13 }}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showScanModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[440px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 16 }}>
                Barcode Scanner
              </h3>
              <button onClick={() => { setShowScanModal(false); setScanResult(''); setScanning(false); }}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="bg-slate-900 rounded-xl p-6 mb-4 flex items-center justify-center min-h-[130px]">
              {scanning ? (
                <div className="text-center">
                  <ScanBarcode className="w-10 h-10 text-emerald-400 mx-auto mb-2 animate-pulse" />
                  <div className="text-slate-400 text-sm">Scanning...</div>
                  <div className="flex justify-center gap-1 mt-2">
                    {[0, 1, 2].map(i => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                        style={{ animation: `pulse 1.2s ${i * 0.2}s infinite` }}
                      />
                    ))}
                  </div>
                </div>
              ) : scanResult ? (
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-emerald-400 text-xs font-mono font-bold">MATCH FOUND</div>
                </div>
              ) : null}
            </div>
            {scanResult && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4 text-sm text-emerald-800 font-medium">
                {scanResult}
              </div>
            )}
            <div className="flex gap-2">
              {scanResult && (
                <button
                  onClick={() => { setShowScanModal(false); setScanResult(''); onNavigate('dispense'); }}
                  className="flex-1 text-white rounded-lg py-2.5 text-sm font-semibold transition-colors"
                  style={{ background: '#059669' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#047857'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#059669'; }}
                >
                  Open Prescription
                </button>
              )}
              <button
                onClick={() => { setShowScanModal(false); setScanResult(''); setScanning(false); }}
                className="flex-1 bg-slate-100 text-slate-700 rounded-lg py-2.5 text-sm font-medium hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyTopBar;
