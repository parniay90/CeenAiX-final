import { useState } from 'react';
import {
  Scan,
  Brain,
  Search,
  Filter,
  Download,
  Share2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCw,
  Layers,
  Settings,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  Calendar,
  FileText,
  Sparkles,
  Eye,
  Activity
} from 'lucide-react';

interface ScanStudy {
  id: string;
  patientName: string;
  patientMRN: string;
  studyType: 'MRI' | 'CT';
  bodyPart: string;
  studyDate: string;
  priority: 'Routine' | 'Urgent' | 'STAT';
  status: 'Pending Review' | 'In Progress' | 'Completed' | 'Reported';
  sliceCount: number;
  aiFindings: number;
  reportedBy?: string;
  thumbnail: string;
}

interface AIFinding {
  id: string;
  type: 'Critical' | 'Significant' | 'Minor';
  category: string;
  description: string;
  location: string;
  confidence: number;
  sliceNumber: number;
}

export default function MRICTAnalysis() {
  const [selectedStudy, setSelectedStudy] = useState<ScanStudy | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'viewer'>('grid');
  const [currentSlice, setCurrentSlice] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [showAIFindings, setShowAIFindings] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const mockStudies: ScanStudy[] = [
    {
      id: 'ST001',
      patientName: 'Ahmed Al Maktoum',
      patientMRN: 'MRN-2024-1001',
      studyType: 'MRI',
      bodyPart: 'Brain',
      studyDate: '2024-04-09 10:30',
      priority: 'STAT',
      status: 'Pending Review',
      sliceCount: 156,
      aiFindings: 3,
      thumbnail: '🧠',
    },
    {
      id: 'ST002',
      patientName: 'Fatima Hassan',
      patientMRN: 'MRN-2024-1002',
      studyType: 'CT',
      bodyPart: 'Chest',
      studyDate: '2024-04-09 09:15',
      priority: 'Urgent',
      status: 'In Progress',
      sliceCount: 245,
      aiFindings: 2,
      thumbnail: '🫁',
    },
    {
      id: 'ST003',
      patientName: 'Mohammed Ali',
      patientMRN: 'MRN-2024-1003',
      studyType: 'MRI',
      bodyPart: 'Spine (Lumbar)',
      studyDate: '2024-04-09 08:00',
      priority: 'Routine',
      status: 'Completed',
      sliceCount: 98,
      aiFindings: 1,
      reportedBy: 'Dr. Sarah Johnson',
      thumbnail: '🦴',
    },
    {
      id: 'ST004',
      patientName: 'Layla Ibrahim',
      patientMRN: 'MRN-2024-1004',
      studyType: 'CT',
      bodyPart: 'Abdomen',
      studyDate: '2024-04-08 16:45',
      priority: 'Routine',
      status: 'Reported',
      sliceCount: 312,
      aiFindings: 0,
      reportedBy: 'Dr. Michael Chen',
      thumbnail: '🫃',
    },
  ];

  const mockAIFindings: AIFinding[] = [
    {
      id: 'F001',
      type: 'Critical',
      category: 'Mass/Lesion',
      description: 'Hyperdense area measuring 2.3cm in right frontal lobe, possible neoplasm',
      location: 'Right Frontal Lobe',
      confidence: 94,
      sliceNumber: 78,
    },
    {
      id: 'F002',
      type: 'Significant',
      category: 'Vascular',
      description: 'Mild periventricular white matter changes consistent with small vessel disease',
      location: 'Periventricular Region',
      confidence: 87,
      sliceNumber: 92,
    },
    {
      id: 'F003',
      type: 'Minor',
      category: 'Anatomical Variant',
      description: 'Prominent perivascular spaces (Virchow-Robin spaces)',
      location: 'Basal Ganglia',
      confidence: 91,
      sliceNumber: 65,
    },
  ];

  const filteredStudies = mockStudies.filter(study => {
    if (filterStatus !== 'all' && study.status !== filterStatus) return false;
    if (filterType !== 'all' && study.studyType !== filterType) return false;
    return true;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'STAT': return 'bg-red-100 text-red-700 border-red-300';
      case 'Urgent': return 'bg-orange-100 text-orange-700 border-orange-300';
      default: return 'bg-blue-100 text-blue-700 border-blue-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending Review': return 'bg-yellow-100 text-yellow-700';
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'Reported': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getFindingTypeColor = (type: string) => {
    switch (type) {
      case 'Critical': return 'border-red-500 bg-red-50';
      case 'Significant': return 'border-orange-500 bg-orange-50';
      case 'Minor': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {viewMode === 'grid' ? (
        <div className="p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                    <Scan className="w-7 h-7 text-white" />
                  </div>
                  MRI & CT Scan Analysis
                </h1>
                <p className="text-slate-600 mt-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-500" />
                  AI-Powered Imaging Analysis & Reporting
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button className="px-5 py-3 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <button className="px-5 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl hover:from-cyan-700 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/30 flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  AI Insights
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Pending Review</p>
                    <p className="text-2xl font-bold text-slate-900">8</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">In Progress</p>
                    <p className="text-2xl font-bold text-slate-900">5</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Completed Today</p>
                    <p className="text-2xl font-bold text-slate-900">12</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">AI Findings</p>
                    <p className="text-2xl font-bold text-slate-900">23</p>
                  </div>
                  <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <Brain className="w-6 h-6 text-cyan-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by patient name, MRN, or study type..."
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="all">All Status</option>
                  <option value="Pending Review">Pending Review</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Reported">Reported</option>
                </select>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="all">All Types</option>
                  <option value="MRI">MRI</option>
                  <option value="CT">CT Scan</option>
                </select>
                <button className="px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  More Filters
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {filteredStudies.map((study) => (
              <div
                key={study.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all cursor-pointer"
                onClick={() => {
                  setSelectedStudy(study);
                  setViewMode('viewer');
                }}
              >
                <div className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center text-4xl">
                      {study.thumbnail}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            {study.patientName}
                            {study.aiFindings > 0 && (
                              <span className="px-2 py-1 bg-cyan-100 text-cyan-700 text-xs rounded-full flex items-center gap-1">
                                <Brain className="w-3 h-3" />
                                {study.aiFindings} AI Finding{study.aiFindings > 1 ? 's' : ''}
                              </span>
                            )}
                          </h3>
                          <p className="text-sm text-slate-600">MRN: {study.patientMRN}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getPriorityColor(study.priority)}`}>
                            {study.priority}
                          </span>
                          <span className={`px-3 py-1 rounded-lg text-xs font-medium ${getStatusColor(study.status)}`}>
                            {study.status}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-5 gap-6 text-sm">
                        <div>
                          <p className="text-slate-500 mb-1">Study Type</p>
                          <p className="font-medium text-slate-900 flex items-center gap-1">
                            <Scan className="w-4 h-4 text-cyan-600" />
                            {study.studyType}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500 mb-1">Body Part</p>
                          <p className="font-medium text-slate-900">{study.bodyPart}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 mb-1">Study Date</p>
                          <p className="font-medium text-slate-900 flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            {study.studyDate}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500 mb-1">Total Slices</p>
                          <p className="font-medium text-slate-900 flex items-center gap-1">
                            <Layers className="w-4 h-4 text-slate-400" />
                            {study.sliceCount}
                          </p>
                        </div>
                        {study.reportedBy && (
                          <div>
                            <p className="text-slate-500 mb-1">Reported By</p>
                            <p className="font-medium text-slate-900 flex items-center gap-1">
                              <User className="w-4 h-4 text-slate-400" />
                              {study.reportedBy}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-screen flex flex-col">
          <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-700">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setViewMode('grid')}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="font-bold">{selectedStudy?.patientName}</h2>
                <p className="text-sm text-slate-400">
                  {selectedStudy?.studyType} - {selectedStudy?.bodyPart} | {selectedStudy?.studyDate}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button className="px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button className="px-4 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-xl transition-colors flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Generate Report
              </button>
            </div>
          </div>

          <div className="flex-1 flex">
            <div className="flex-1 bg-black flex items-center justify-center relative">
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="w-full max-w-4xl aspect-square bg-slate-900 rounded-lg flex items-center justify-center border-2 border-cyan-500/30">
                  <div className="text-center text-white">
                    <Scan className="w-24 h-24 mx-auto mb-4 text-cyan-500 opacity-50" />
                    <p className="text-xl font-semibold mb-2">DICOM Viewer</p>
                    <p className="text-slate-400">Slice {currentSlice} of {selectedStudy?.sliceCount}</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700 p-6 shadow-2xl">
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => setCurrentSlice(Math.max(1, currentSlice - 1))}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors"
                  >
                    {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
                  </button>
                  <button
                    onClick={() => setCurrentSlice(Math.min(selectedStudy?.sliceCount || 1, currentSlice + 1))}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>
                  <div className="w-px h-8 bg-slate-700 mx-2"></div>
                  <button
                    onClick={() => setZoom(Math.max(50, zoom - 10))}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <ZoomOut className="w-5 h-5 text-white" />
                  </button>
                  <span className="text-white font-medium min-w-16 text-center">{zoom}%</span>
                  <button
                    onClick={() => setZoom(Math.min(200, zoom + 10))}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <ZoomIn className="w-5 h-5 text-white" />
                  </button>
                  <div className="w-px h-8 bg-slate-700 mx-2"></div>
                  <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                    <RotateCw className="w-5 h-5 text-white" />
                  </button>
                  <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                    <Maximize2 className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              <div className="absolute top-8 left-8">
                <button
                  onClick={() => setShowAIFindings(!showAIFindings)}
                  className={`px-5 py-3 rounded-xl transition-all flex items-center gap-2 ${
                    showAIFindings
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-900/95 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  AI Findings
                </button>
              </div>
            </div>

            <div className="w-96 bg-white border-l border-slate-200 overflow-y-auto">
              <div className="p-8">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-cyan-600" />
                  AI Analysis Results
                </h3>

                {mockAIFindings.length > 0 ? (
                  <div className="space-y-6">
                    {mockAIFindings.map((finding) => (
                      <div
                        key={finding.id}
                        className={`border-l-4 rounded-xl p-6 cursor-pointer hover:shadow-md transition-all ${getFindingTypeColor(finding.type)}`}
                        onClick={() => setCurrentSlice(finding.sliceNumber)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className={`text-xs font-bold uppercase ${
                            finding.type === 'Critical' ? 'text-red-700' :
                            finding.type === 'Significant' ? 'text-orange-700' :
                            'text-blue-700'
                          }`}>
                            {finding.type}
                          </span>
                          <span className="text-xs text-slate-600">
                            Confidence: {finding.confidence}%
                          </span>
                        </div>
                        <h4 className="font-semibold text-slate-900 mb-1">{finding.category}</h4>
                        <p className="text-sm text-slate-700 mb-2">{finding.description}</p>
                        <div className="flex items-center justify-between text-xs text-slate-600">
                          <span className="flex items-center gap-1">
                            <Layers className="w-3 h-3" />
                            Slice {finding.sliceNumber}
                          </span>
                          <span>{finding.location}</span>
                        </div>
                      </div>
                    ))}

                    <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-6">
                      <div className="flex items-start gap-4">
                        <Sparkles className="w-5 h-5 text-cyan-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-cyan-900 mb-1">AI Recommendation</h4>
                          <p className="text-sm text-cyan-800">
                            Consider correlating with clinical history and prior imaging.
                            The hyperdense lesion warrants follow-up imaging and possible biopsy.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <p className="text-slate-600">No significant findings detected</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
