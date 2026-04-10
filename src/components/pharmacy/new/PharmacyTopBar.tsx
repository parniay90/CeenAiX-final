import React, { useState } from 'react';
import { ScanBarcode, ClipboardPlus, Bell, ChevronDown, X, Search } from 'lucide-react';

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

  const handleScan = () => {
    setShowScanModal(true);
    setTimeout(() => {
      setScanResult('RX-20260407-003124 — Aisha Mohammed Al Reem — Furosemide 60mg + Spironolactone 25mg');
    }, 1200);
  };

  return (
    <div className="sticky top-0 z-30 bg-white border-b border-slate-200" style={{ height: 64 }}>
      <div className="flex items-center h-full px-6 gap-4">
        {/* Left */}
        <div className="flex-shrink-0">
          <h1 className="font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 18 }}>
            {pageTitle}
          </h1>
          <div className="text-slate-400" style={{ fontFamily: 'Inter, sans-serif', fontSize: 12 }}>
            Al Shifa Pharmacy · 7 April 2026 · 2:07 PM
          </div>
        </div>

        {/* Center — New Rx Banner */}
        <div className="flex-1 flex justify-center">
          {showBanner && (
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5 text-sm animate-in slide-in-from-top-2 duration-200">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-blue-700 font-medium" style={{ fontSize: 13 }}>
                New prescription received — {newRxPatient}
              </span>
              <button
                onClick={() => { onNavigate('dispense'); setShowBanner(false); }}
                className="ml-1 bg-teal-600 text-white rounded px-2 py-0.5 text-xs font-semibold hover:bg-teal-700 transition-colors"
              >
                View
              </button>
              <button onClick={() => setShowBanner(false)} className="text-blue-400 hover:text-blue-600 ml-1">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Scan Barcode */}
          <button
            onClick={handleScan}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-emerald-700 transition-colors hover:bg-emerald-100"
            style={{ background: '#ECFDF5', fontSize: 13, height: 36, fontFamily: 'Inter, sans-serif' }}
          >
            <ScanBarcode className="w-4 h-4" />
            <span className="font-medium">Scan Barcode</span>
          </button>

          {/* New Manual Rx */}
          <button
            onClick={() => onNavigate('new-rx')}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-white transition-colors hover:bg-emerald-700"
            style={{ background: '#059669', fontSize: 13, height: 36, fontFamily: 'Inter, sans-serif' }}
          >
            <ClipboardPlus className="w-4 h-4" />
            <span className="font-medium">New Manual Rx</span>
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <Bell className="w-5 h-5 text-slate-500" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          </button>

          {/* User menu */}
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
              <div className="absolute right-0 top-12 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100 mb-1">
                  <div className="font-semibold text-slate-900" style={{ fontSize: 13 }}>Rania Hassan</div>
                  <div className="text-slate-500" style={{ fontSize: 11 }}>Head Pharmacist</div>
                  <div className="text-emerald-600 font-mono" style={{ fontSize: 10 }}>DHA-PHAR-2017-001294</div>
                </div>
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

      {/* Barcode Scan Modal */}
      {showScanModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[420px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 16 }}>
                Barcode Scanner
              </h3>
              <button onClick={() => { setShowScanModal(false); setScanResult(''); }}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="bg-slate-900 rounded-xl p-6 mb-4 flex items-center justify-center min-h-[120px]">
              {!scanResult ? (
                <div className="text-center">
                  <ScanBarcode className="w-10 h-10 text-emerald-400 mx-auto mb-2 animate-pulse" />
                  <div className="text-slate-400 text-sm">Scanning...</div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-2">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-emerald-400 text-xs font-mono">MATCH FOUND</div>
                </div>
              )}
            </div>
            {scanResult && (
              <div className="bg-emerald-50 rounded-lg p-3 mb-4 text-sm text-emerald-800 font-medium">
                {scanResult}
              </div>
            )}
            <div className="flex gap-2">
              {scanResult && (
                <button
                  onClick={() => { setShowScanModal(false); setScanResult(''); onNavigate('dispense'); }}
                  className="flex-1 bg-emerald-600 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Open Prescription
                </button>
              )}
              <button
                onClick={() => { setShowScanModal(false); setScanResult(''); }}
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
