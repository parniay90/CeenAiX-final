import { useState } from 'react';
import { Activity, FileText, Calendar, CheckCircle, Clock } from 'lucide-react';
import PatientSidebar from '../components/patient/PatientSidebar';
import type { ImagingStudy, ScheduledScan, ImagingStats } from '../types/patientImaging';
import RecentStudiesTab from '../components/imaging/RecentStudiesTab';
import ScanViewerTab from '../components/imaging/ScanViewerTab';
import ReportsTab from '../components/imaging/ReportsTab';
import MyFindingsTab from '../components/imaging/MyFindingsTab';
import ScheduledScansTab from '../components/imaging/ScheduledScansTab';

type TabType = 'recent' | 'viewer' | 'reports' | 'findings' | 'scheduled';

export default function Imaging() {
  const [activeTab, setActiveTab] = useState<TabType>('recent');

  const stats: ImagingStats = {
    totalStudies: 4,
    pendingReviews: 0,
    normalFindings: 2,
    followUpNeeded: 1,
    scheduledScans: 1
  };

  const studies: ImagingStudy[] = [
    {
      id: 'study-1',
      studyDate: '28 February 2026',
      modality: 'CT',
      studyType: 'Cardiac CT with Calcium Scoring',
      bodyPart: 'Chest',
      indication: 'Cardiovascular risk assessment for diabetes patient',
      facility: 'Mediclinic City Hospital',
      facilityLocation: 'Dubai Healthcare City',
      radiologist: 'Dr. Omar Al Hashimi',
      radiologistCredentials: 'MD, FRCR (Cardiovascular Imaging)',
      orderedBy: 'Dr. Fatima Al Zahra',
      orderedBySpecialty: 'Endocrinology',
      studyTime: '09:15 AM',
      reportedTime: '28 Feb 2026, 4:30 PM',
      accessionNumber: 'MCH-CT-20260228-1891',
      studyInstanceUID: '1.2.840.113619.2.416.3.2831847689.783.1677574520.891',
      seriesCount: 3,
      imageCount: 248,
      findings: [
        {
          id: 'finding-1-1',
          category: 'Coronary Arteries',
          finding: 'Minimal coronary artery calcification',
          severity: 'mild',
          severityLabel: 'Mild',
          location: 'Left Anterior Descending (LAD)',
          measurement: 'CAC Score: 42 Agatston units',
          patientExplanation: 'A CAC score of 42 means you have some early plaque buildup in your heart arteries, but it\'s still at a low level. This is common in people with diabetes. The good news: your score is well below 100, which means your risk is still relatively low. With medication (Atorvastatin) and lifestyle changes, you can prevent this from getting worse.',
          technicalDescription: 'Minimal calcified plaque in the proximal LAD segment. Total Agatston score 42 (minimal coronary atherosclerosis). LM, LCX, and RCA without significant calcification.',
          color: '#f59e0b',
          doctorComment: 'This confirms we\'re on the right track with your statin therapy and diabetes management. Keep up the good work with diet and exercise.'
        },
        {
          id: 'finding-1-2',
          category: 'Lungs',
          finding: 'Clear lung fields',
          severity: 'normal',
          severityLabel: 'Normal',
          patientExplanation: 'Your lungs look completely healthy with no signs of infection, nodules, or other concerns.',
          technicalDescription: 'Lungs are clear. No focal consolidation, pleural effusion, or pneumothorax. No suspicious nodules or masses.',
          color: '#10b981'
        }
      ],
      impression: 'Minimal coronary artery calcification (CAC score 42). No other significant findings. Recommend continued cardiovascular risk factor modification.',
      patientSummary: 'Early signs of plaque in heart arteries (expected with diabetes), but still at low-risk level. Lungs and chest look healthy. Continue your current heart medications and healthy habits.',
      reviewStatus: 'reviewed',
      reviewedBy: 'Dr. Fatima Al Zahra',
      reviewedDate: '1 March 2026',
      overallComment: 'Your CAC score of 42 is actually quite good for someone with Type 2 diabetes. It confirms that our treatment plan is working. Keep taking Atorvastatin every night, and let\'s continue working on your HbA1c control.',
      hasReport: true,
      hasImages: true,
      tags: ['Cardiology', 'Diabetes', 'Preventive'],
      followUpRecommended: true,
      followUpInstructions: 'Repeat CAC scoring in 3-5 years if cardiovascular risk factors remain controlled'
    },
    {
      id: 'study-2',
      studyDate: '15 January 2026',
      modality: 'Echo',
      studyType: 'Transthoracic Echocardiogram (TTE)',
      bodyPart: 'Heart',
      indication: 'Baseline cardiac function assessment',
      facility: 'American Hospital Dubai',
      facilityLocation: 'Oud Metha, Dubai',
      radiologist: 'Dr. Sarah Mitchell',
      radiologistCredentials: 'MD, FASE (Echocardiography)',
      orderedBy: 'Dr. Fatima Al Zahra',
      orderedBySpecialty: 'Endocrinology',
      studyTime: '10:30 AM',
      reportedTime: '15 Jan 2026, 2:15 PM',
      accessionNumber: 'AHD-ECHO-20260115-0742',
      studyInstanceUID: '1.2.840.113619.2.416.3.2831847689.783.1674645000.412',
      seriesCount: 8,
      imageCount: 156,
      findings: [
        {
          id: 'finding-2-1',
          category: 'Left Ventricle',
          finding: 'Normal left ventricular size and systolic function',
          severity: 'normal',
          severityLabel: 'Normal',
          measurement: 'LVEF: 62%',
          patientExplanation: 'Your heart\'s main pumping chamber (left ventricle) is working perfectly. LVEF of 62% means your heart is pumping out 62% of the blood with each beat, which is completely normal (normal is 55-70%). This is great news for someone with diabetes.',
          technicalDescription: 'LV dimensions normal. No regional wall motion abnormalities. LVEF 62% by Simpson\'s biplane method. Normal LV diastolic function.',
          color: '#10b981'
        },
        {
          id: 'finding-2-2',
          category: 'Heart Valves',
          finding: 'All valves functioning normally',
          severity: 'normal',
          severityLabel: 'Normal',
          patientExplanation: 'The four valves in your heart are all opening and closing properly with no leaks or narrowing.',
          technicalDescription: 'Mitral valve: No stenosis or regurgitation. Aortic valve: Trileaflet, no stenosis or regurgitation. Tricuspid and pulmonic valves: Normal.',
          color: '#10b981'
        }
      ],
      impression: 'Normal transthoracic echocardiogram. LVEF 62%. No valvular abnormalities. No evidence of diabetic cardiomyopathy.',
      patientSummary: 'Your heart structure and function are completely normal. No signs of diabetes affecting your heart muscle. This is excellent news.',
      reviewStatus: 'reviewed',
      reviewedBy: 'Dr. Fatima Al Zahra',
      reviewedDate: '16 January 2026',
      overallComment: 'Perfect echocardiogram! This confirms your heart is healthy despite having diabetes. Keep up the good work with your medications and lifestyle.',
      hasReport: true,
      hasImages: true,
      tags: ['Cardiology', 'Diabetes', 'Baseline'],
      followUpRecommended: false
    },
    {
      id: 'study-3',
      studyDate: '3 December 2025',
      modality: 'Ultrasound',
      studyType: 'Abdominal Ultrasound',
      bodyPart: 'Abdomen',
      indication: 'Elevated liver enzymes, screen for fatty liver',
      facility: 'Aster Hospital',
      facilityLocation: 'Mankhool, Dubai',
      radiologist: 'Dr. Ahmed Khalil',
      radiologistCredentials: 'MD, FRCR (Abdominal Imaging)',
      orderedBy: 'Dr. Fatima Al Zahra',
      orderedBySpecialty: 'Endocrinology',
      studyTime: '2:45 PM',
      reportedTime: '3 Dec 2025, 5:20 PM',
      accessionNumber: 'AST-US-20251203-0563',
      studyInstanceUID: '1.2.840.113619.2.416.3.2831847689.783.1670083500.287',
      seriesCount: 6,
      imageCount: 42,
      findings: [
        {
          id: 'finding-3-1',
          category: 'Liver',
          finding: 'Mild hepatic steatosis (fatty liver)',
          severity: 'mild',
          severityLabel: 'Mild',
          measurement: 'Grade 1 steatosis',
          patientExplanation: 'Your liver shows mild fat buildup, which is very common in people with Type 2 diabetes and prediabetes. The good news: it\'s still at an early stage (Grade 1 out of 3) and can be improved with weight loss, diet changes, and better blood sugar control. Your liver function tests are only slightly elevated, which is reassuring.',
          technicalDescription: 'Diffusely increased hepatic echogenicity consistent with Grade 1 hepatic steatosis. Liver size normal (15.2 cm). No focal lesions. Portal vein patent.',
          color: '#f59e0b',
          doctorComment: 'This is reversible with the lifestyle changes we discussed: low-carb diet, regular exercise, and weight loss of 5-10%. We\'ll recheck your liver enzymes in 3 months.'
        },
        {
          id: 'finding-3-2',
          category: 'Gallbladder',
          finding: 'Normal gallbladder',
          severity: 'normal',
          severityLabel: 'Normal',
          patientExplanation: 'Your gallbladder looks completely healthy with no stones or inflammation.',
          technicalDescription: 'Gallbladder normal in size and wall thickness. No gallstones or sludge. No pericholecystic fluid.',
          color: '#10b981'
        },
        {
          id: 'finding-3-3',
          category: 'Kidneys',
          finding: 'Both kidneys normal',
          severity: 'normal',
          severityLabel: 'Normal',
          patientExplanation: 'Both kidneys are normal in size and appearance with no signs of diabetic kidney disease. This is excellent.',
          technicalDescription: 'Right kidney 10.8 cm, left kidney 10.6 cm. Normal cortical echogenicity. No hydronephrosis, masses, or stones.',
          color: '#10b981'
        }
      ],
      impression: 'Mild hepatic steatosis (Grade 1). Gallbladder, kidneys, spleen, and pancreas unremarkable.',
      patientSummary: 'Mild fatty liver (common with diabetes, reversible with lifestyle changes). All other abdominal organs look healthy, especially kidneys.',
      reviewStatus: 'reviewed',
      reviewedBy: 'Dr. Fatima Al Zahra',
      reviewedDate: '5 December 2025',
      overallComment: 'The fatty liver is very treatable. Focus on: 1) Low-carb Mediterranean diet, 2) Exercise 30 min/day, 3) Lose 5-10% body weight. We\'ll recheck in 6 months.',
      hasReport: true,
      hasImages: true,
      tags: ['Liver', 'Diabetes', 'Metabolic'],
      followUpRecommended: true,
      followUpInstructions: 'Repeat abdominal ultrasound in 6 months to assess response to lifestyle modifications'
    },
    {
      id: 'study-4',
      studyDate: '10 October 2025',
      modality: 'X-Ray',
      studyType: 'Chest X-Ray (PA and Lateral)',
      bodyPart: 'Chest',
      indication: 'Pre-employment medical screening',
      facility: 'NMC Specialty Hospital',
      facilityLocation: 'Al Nahda, Dubai',
      radiologist: 'Dr. Ravi Sharma',
      radiologistCredentials: 'MD, DMRD (Radiology)',
      orderedBy: 'Occupational Health Services',
      orderedBySpecialty: 'Occupational Medicine',
      studyTime: '9:00 AM',
      reportedTime: '10 Oct 2025, 11:30 AM',
      accessionNumber: 'NMC-XR-20251010-1234',
      studyInstanceUID: '1.2.840.113619.2.416.3.2831847689.783.1665396000.891',
      seriesCount: 2,
      imageCount: 2,
      findings: [
        {
          id: 'finding-4-1',
          category: 'Lungs',
          finding: 'Clear lung fields bilaterally',
          severity: 'normal',
          severityLabel: 'Normal',
          patientExplanation: 'Your lungs are completely clear with no signs of infection, fluid, or other abnormalities.',
          technicalDescription: 'Both lungs are clear. No focal consolidation, pleural effusion, or pneumothorax. No masses or nodules.',
          color: '#10b981'
        },
        {
          id: 'finding-4-2',
          category: 'Heart',
          finding: 'Normal cardiac silhouette',
          severity: 'normal',
          severityLabel: 'Normal',
          patientExplanation: 'Your heart size and shape look normal on the X-ray.',
          technicalDescription: 'Cardiothoracic ratio normal. No cardiomegaly. Aortic knob unremarkable.',
          color: '#10b981'
        }
      ],
      impression: 'Normal chest radiograph. No acute cardiopulmonary disease.',
      patientSummary: 'Completely normal chest X-ray. Healthy lungs and heart.',
      reviewStatus: 'reviewed',
      hasReport: true,
      hasImages: true,
      tags: ['Screening', 'Normal'],
      followUpRecommended: false
    }
  ];

  const scheduledScans: ScheduledScan[] = [
    {
      id: 'scheduled-1',
      scheduledDate: '22 April 2026',
      scheduledTime: '10:00 AM',
      modality: 'MRI',
      studyType: 'MRI Brain with and without contrast',
      bodyPart: 'Brain',
      indication: 'Evaluation of persistent headaches, rule out microvascular changes from diabetes',
      orderedBy: 'Dr. Fatima Al Zahra',
      orderedBySpecialty: 'Endocrinology',
      orderDate: '1 April 2026',
      facility: 'Cleveland Clinic Abu Dhabi',
      facilityAddress: 'Al Maryah Island, Abu Dhabi',
      facilityPhone: '+971 2 501 9999',
      preparationInstructions: [
        'Remove all metal objects (jewelry, piercings, hearing aids)',
        'Inform technician if you have any metal implants, pacemaker, or claustrophobia',
        'You may eat and drink normally before the scan',
        'Arrive 30 minutes early to complete safety questionnaire',
        'Bring Emirates ID and insurance card',
        'Contrast will be used - let us know about kidney problems or allergies'
      ],
      estimatedDuration: '45-60 minutes',
      cost: 4200,
      insuranceCoverage: 3780,
      patientCost: 420,
      confirmed: true,
      bookingRef: 'CCAD-MRI-20260422-0891',
      contrast: true,
      contrastInstructions: 'Gadolinium-based contrast will be administered IV. Ensure adequate hydration before and after the scan.'
    }
  ];

  const tabs = [
    { id: 'recent' as TabType, label: 'Recent Studies', icon: Activity },
    { id: 'viewer' as TabType, label: 'Scan Viewer', icon: FileText },
    { id: 'reports' as TabType, label: 'Reports', icon: FileText },
    { id: 'findings' as TabType, label: 'My Findings', icon: CheckCircle },
    { id: 'scheduled' as TabType, label: 'Scheduled', icon: Calendar }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-50 flex">
      <PatientSidebar />

      <div className="flex-1 ml-64">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Medical Imaging & Scans</h1>
            <p className="text-slate-600">View your radiology studies, scans, and imaging reports</p>
          </div>

          <div className="grid grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-teal-600" />
                </div>
                <div className="text-2xl font-bold text-slate-900">{stats.totalStudies}</div>
              </div>
              <div className="text-sm text-slate-600">Total Studies</div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold text-slate-900">{stats.normalFindings}</div>
              </div>
              <div className="text-sm text-slate-600">Normal Findings</div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div className="text-2xl font-bold text-slate-900">{stats.followUpNeeded}</div>
              </div>
              <div className="text-sm text-slate-600">Follow-Up Needed</div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-slate-900">{stats.scheduledScans}</div>
              </div>
              <div className="text-sm text-slate-600">Scheduled Scans</div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-slate-600" />
                </div>
                <div className="text-2xl font-bold text-slate-900">{stats.totalStudies}</div>
              </div>
              <div className="text-sm text-slate-600">Reports Available</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="border-b border-slate-200">
              <div className="flex">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-8">
              {activeTab === 'recent' && <RecentStudiesTab studies={studies} />}
              {activeTab === 'viewer' && <ScanViewerTab studies={studies} />}
              {activeTab === 'reports' && <ReportsTab studies={studies} />}
              {activeTab === 'findings' && <MyFindingsTab studies={studies} />}
              {activeTab === 'scheduled' && <ScheduledScansTab scheduledScans={scheduledScans} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
