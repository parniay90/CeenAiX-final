import { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCw, Maximize2, Download, Ruler, Contrast, Play, Pause } from 'lucide-react';
import type { ImagingStudy } from '../../types/patientImaging';

interface ScanViewerTabProps {
  studies: ImagingStudy[];
}

export default function ScanViewerTab({ studies }: ScanViewerTabProps) {
  const [selectedStudy, setSelectedStudy] = useState(studies[0]);
  const [zoom, setZoom] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSlice, setCurrentSlice] = useState(124);

  const totalSlices = selectedStudy.imageCount;

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  const handleReset = () => {
    setZoom(100);
    setBrightness(100);
    setContrast(100);
    setRotation(0);
  };

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">DICOM Image Viewer</h3>
            <p className="text-sm text-slate-300">Clinical-grade image viewing for radiology studies</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedStudy.id}
              onChange={(e) => {
                const study = studies.find(s => s.id === e.target.value);
                if (study) setSelectedStudy(study);
              }}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white"
            >
              {studies.map(study => (
                <option key={study.id} value={study.id}>
                  {study.studyDate} - {study.studyType}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-2 bg-slate-900 rounded-xl p-4 h-[600px] overflow-y-auto">
          <div className="text-xs font-bold text-slate-300 mb-3">STUDY INFO</div>
          <div className="space-y-2 text-xs text-slate-400">
            <div>
              <div className="text-slate-500">Patient</div>
              <div className="text-white font-medium">Parnia Yazdkhasti</div>
            </div>
            <div>
              <div className="text-slate-500">Study Date</div>
              <div className="text-white">{selectedStudy.studyDate}</div>
            </div>
            <div>
              <div className="text-slate-500">Modality</div>
              <div className="text-white">{selectedStudy.modality}</div>
            </div>
            <div>
              <div className="text-slate-500">Body Part</div>
              <div className="text-white">{selectedStudy.bodyPart}</div>
            </div>
            <div>
              <div className="text-slate-500">Accession</div>
              <div className="text-white font-mono text-[10px]">{selectedStudy.accessionNumber}</div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <div className="text-xs font-bold text-slate-300 mb-3">SERIES ({selectedStudy.seriesCount})</div>
            <div className="space-y-2">
              <div className="p-2 bg-teal-900 border border-teal-700 rounded text-xs text-white">
                Series 1: Axial
                <div className="text-[10px] text-teal-300 mt-1">{totalSlices} images</div>
              </div>
              {selectedStudy.seriesCount > 1 && (
                <>
                  <div className="p-2 bg-slate-800 hover:bg-slate-700 cursor-pointer rounded text-xs text-slate-300">
                    Series 2: Coronal
                    <div className="text-[10px] text-slate-400 mt-1">78 images</div>
                  </div>
                  <div className="p-2 bg-slate-800 hover:bg-slate-700 cursor-pointer rounded text-xs text-slate-300">
                    Series 3: Sagittal
                    <div className="text-[10px] text-slate-400 mt-1">65 images</div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <div className="text-xs font-bold text-slate-300 mb-3">WINDOW PRESETS</div>
            <div className="space-y-1">
              <button className="w-full px-2 py-1.5 bg-teal-900 border border-teal-700 text-white rounded text-xs hover:bg-teal-800">
                Soft Tissue
              </button>
              <button className="w-full px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs">
                Lung
              </button>
              <button className="w-full px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs">
                Bone
              </button>
              <button className="w-full px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs">
                Brain
              </button>
            </div>
          </div>
        </div>

        <div className="col-span-8 bg-black rounded-xl overflow-hidden relative h-[600px]">
          <div className="absolute top-4 left-4 z-10 space-y-1 text-xs font-mono text-cyan-400">
            <div>{selectedStudy.facility}</div>
            <div>{selectedStudy.studyType}</div>
            <div>{selectedStudy.studyDate} {selectedStudy.studyTime}</div>
          </div>

          <div className="absolute top-4 right-4 z-10 space-y-1 text-xs font-mono text-cyan-400 text-right">
            <div>Slice {currentSlice}/{totalSlices}</div>
            <div>Zoom: {zoom}%</div>
            <div>Series 1 - Axial</div>
          </div>

          <div className="absolute bottom-4 left-4 z-10 space-y-1 text-xs font-mono text-cyan-400">
            <div>WC: {brightness} / WW: {contrast}</div>
            <div>Rotation: {rotation}°</div>
          </div>

          <div
            className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-black"
            style={{
              filter: `brightness(${brightness}%) contrast(${contrast}%)`,
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transition: 'all 0.3s ease'
            }}
          >
            <div className="relative w-96 h-96 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center">
              <svg width="384" height="384" className="opacity-40">
                <circle cx="192" cy="192" r="140" fill="none" stroke="#475569" strokeWidth="2" />
                <circle cx="192" cy="192" r="100" fill="none" stroke="#64748b" strokeWidth="1" />
                <circle cx="192" cy="192" r="60" fill="none" stroke="#94a3b8" strokeWidth="1" />
                <line x1="192" y1="52" x2="192" y2="332" stroke="#475569" strokeWidth="1" />
                <line x1="52" y1="192" x2="332" y2="192" stroke="#475569" strokeWidth="1" />

                {selectedStudy.modality === 'CT' && (
                  <>
                    <ellipse cx="192" cy="192" rx="120" ry="100" fill="none" stroke="#0891b2" strokeWidth="2" opacity="0.6" />
                    <circle cx="165" cy="165" r="15" fill="#0891b2" opacity="0.3" />
                    <circle cx="220" cy="175" r="12" fill="#0891b2" opacity="0.2" />
                  </>
                )}

                {selectedStudy.modality === 'Echo' && (
                  <>
                    <path d="M 100 192 Q 192 100, 284 192 Q 192 284, 100 192" fill="none" stroke="#2563eb" strokeWidth="2" opacity="0.6" />
                    <circle cx="192" cy="192" r="50" fill="none" stroke="#2563eb" strokeWidth="3" opacity="0.4" />
                  </>
                )}

                {selectedStudy.modality === 'X-Ray' && (
                  <>
                    <rect x="120" y="80" width="144" height="224" rx="10" fill="none" stroke="#64748b" strokeWidth="2" opacity="0.5" />
                    <line x1="140" y1="120" x2="244" y2="120" stroke="#94a3b8" strokeWidth="1" opacity="0.3" />
                    <line x1="140" y1="160" x2="244" y2="160" stroke="#94a3b8" strokeWidth="1" opacity="0.3" />
                  </>
                )}
              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-slate-500 text-sm mb-2">DICOM Image Placeholder</div>
                  <div className="text-slate-600 text-xs">
                    {selectedStudy.modality} - {selectedStudy.bodyPart}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 right-4 z-10">
            <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-sm rounded-lg p-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-8 h-8 bg-teal-600 hover:bg-teal-700 rounded flex items-center justify-center text-white transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="1"
                max={totalSlices}
                value={currentSlice}
                onChange={(e) => setCurrentSlice(Number(e.target.value))}
                className="w-64"
              />
            </div>
          </div>
        </div>

        <div className="col-span-2 bg-slate-900 rounded-xl p-4 h-[600px]">
          <div className="text-xs font-bold text-slate-300 mb-4">TOOLS</div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">Zoom</span>
                <span className="text-xs text-white font-mono">{zoom}%</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleZoomOut}
                  className="flex-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded text-white flex items-center justify-center gap-1"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={handleZoomIn}
                  className="flex-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded text-white flex items-center justify-center gap-1"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">Brightness</span>
                <span className="text-xs text-white font-mono">{brightness}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">Contrast</span>
                <span className="text-xs text-white font-mono">{contrast}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={contrast}
                onChange={(e) => setContrast(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="pt-3 border-t border-slate-800">
              <button
                onClick={handleRotate}
                className="w-full px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded text-white flex items-center justify-center gap-2 mb-2"
              >
                <RotateCw className="w-4 h-4" />
                <span className="text-xs">Rotate 90°</span>
              </button>

              <button className="w-full px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded text-white flex items-center justify-center gap-2 mb-2">
                <Ruler className="w-4 h-4" />
                <span className="text-xs">Measure</span>
              </button>

              <button className="w-full px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded text-white flex items-center justify-center gap-2 mb-2">
                <Contrast className="w-4 h-4" />
                <span className="text-xs">Invert</span>
              </button>

              <button className="w-full px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded text-white flex items-center justify-center gap-2 mb-2">
                <Maximize2 className="w-4 h-4" />
                <span className="text-xs">Fullscreen</span>
              </button>

              <button
                onClick={handleReset}
                className="w-full px-3 py-2 bg-teal-700 hover:bg-teal-600 rounded text-white text-xs font-medium"
              >
                Reset View
              </button>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <button className="w-full px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded text-white flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                <span className="text-xs">Export Image</span>
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <div className="text-xs font-bold text-slate-300 mb-2">ANNOTATIONS</div>
            <div className="text-xs text-slate-500">No annotations</div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 text-sm">
        <div className="font-bold text-white mb-2">Viewing Study:</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-slate-400">Study:</span> {selectedStudy.studyType}
          </div>
          <div>
            <span className="text-slate-400">Date:</span> {selectedStudy.studyDate}
          </div>
          <div>
            <span className="text-slate-400">Radiologist:</span> {selectedStudy.radiologist}
          </div>
          <div>
            <span className="text-slate-400">Images:</span> {selectedStudy.imageCount} slices
          </div>
        </div>
      </div>

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-800">
          This is a demonstration DICOM viewer. Actual patient scans would be loaded from the hospital PACS system. Always review images with your radiologist or doctor for accurate interpretation.
        </p>
      </div>
    </div>
  );
}
