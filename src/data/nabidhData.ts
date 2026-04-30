// ─── NABIDH mock data for CeenAiX Super Admin ──────────────────────────────

export type NabidhConnectionStatus = 'Connected' | 'Degraded' | 'Disconnected';
export type NabidhEnvironment = 'Production' | 'Staging' | 'Sandbox';

export const NABIDH_STATUS: {
  connection: NabidhConnectionStatus;
  environment: NabidhEnvironment;
  facility: string;
  facilityLicense: string;
} = {
  connection: 'Connected',
  environment: 'Production',
  facility: 'Emirates Hospital Group — Main',
  facilityLicense: 'DHA-FAC-00421',
};

export const COMPLIANCE_STRIP = {
  dhaLicense:        { number: 'DHA-FAC-00421', status: 'Active',   expiry: '2027-01-15', daysLeft: 260 },
  onboardingStatus:  { status: 'Approved', approvalDate: '2024-01-20' },
  certificate:       { status: 'Active', expiry: '2026-06-10', daysLeft: 41 },
  lastSuccessful:    '3 min ago',
  submissionRate24h: 99.2,
  outstandingRej:    7,
  complianceScore:   'A',
};

export const NABIDH_KPIS = {
  submissions24h:    { value: 11204, delta: 8.4,   spark: [420,380,460,510,490,540,580,620,590,660,720,680,740] },
  successRate24h:    { value: 99.2,  delta: 0.4,   spark: [98.8,99.0,98.9,99.1,99.2,99.3,99.1,99.2,99.4,99.3,99.2,99.2,99.2] },
  avgLatency:        { p50: 340,     p95: 1100 },
  pendingQueue:      { value: 142,   breakdown: { lt1m: 98, m1_5: 28, m5_30: 12, gt30m: 4 } },
  rejected24h:       { value: 89,    topReason: 'Missing patient consent', delta: -12.4 },
  consentCoverage:   { value: 96.8,  delta: 1.2,   spark: [94.1,94.8,95.2,95.6,95.9,96.1,96.3,96.5,96.6,96.7,96.8,96.8,96.8] },
};

// Submission throughput (hourly for 24h)
export function genHourlyData() {
  const types = ['encounters','prescriptions','labOrders','labResults','imaging','diagnoses','discharge','vitals','allergies','immunizations'] as const;
  return Array.from({ length: 24 }, (_, i) => {
    const base = 400 + Math.sin(i / 3) * 100 + (i > 8 && i < 18 ? 200 : 0);
    const entry: Record<string, number | string> = { hour: `${String(i).padStart(2,'0')}:00` };
    types.forEach(t => { entry[t] = Math.max(0, Math.round(base * (Math.random() * 0.4 + 0.1))); });
    return entry;
  });
}
export const HOURLY_DATA = genHourlyData();

export const SUBMISSION_TYPES = [
  { type: 'Encounter',          count: 2840, successRate: 99.6, avgLatency: 280, rejRate: 0.4, pending: 18, lastSubmitted: '1 min ago' },
  { type: 'Prescription',       count: 1920, successRate: 99.1, avgLatency: 310, rejRate: 0.9, pending: 22, lastSubmitted: '2 min ago' },
  { type: 'Lab Order',          count: 1480, successRate: 98.8, avgLatency: 290, rejRate: 1.2, pending: 31, lastSubmitted: '4 min ago' },
  { type: 'Lab Result',         count: 1340, successRate: 99.3, avgLatency: 340, rejRate: 0.7, pending: 25, lastSubmitted: '3 min ago' },
  { type: 'Imaging Report',     count:  840, successRate: 98.4, avgLatency: 420, rejRate: 1.6, pending: 19, lastSubmitted: '6 min ago' },
  { type: 'Diagnosis',          count: 1280, successRate: 99.7, avgLatency: 260, rejRate: 0.3, pending: 12, lastSubmitted: '1 min ago' },
  { type: 'Discharge Summary',  count:  380, successRate: 97.9, avgLatency: 680, rejRate: 2.1, pending:  6, lastSubmitted: '12 min ago'},
  { type: 'Vital Signs',        count:  624, successRate: 99.8, avgLatency: 180, rejRate: 0.2, pending:  5, lastSubmitted: '30 sec ago'},
  { type: 'Allergy',            count:  280, successRate: 99.5, avgLatency: 200, rejRate: 0.5, pending:  2, lastSubmitted: '8 min ago' },
  { type: 'Immunization',       count:  220, successRate: 99.9, avgLatency: 210, rejRate: 0.1, pending:  2, lastSubmitted: '15 min ago'},
];

export const OUTCOME_DATA = [
  { outcome: 'Accepted',               count: 10842, pct: 96.8, trend: 0.4  },
  { outcome: 'Accepted with warnings', count:   273, pct:  2.4, trend: -0.2 },
  { outcome: 'Rejected',               count:    89, pct:  0.8, trend: -0.5 },
];

export const OUTCOME_COLORS = ['#34D399', '#FCD34D', '#F87171'];

// Queue items
export type QueueStage = 'Pending' | 'In flight' | 'Retrying' | 'Dead-letter' | 'Held';

export interface QueueItem {
  id: string;
  createdAt: string;
  eventType: string;
  source: string;
  patientId: string;
  facility: string;
  stage: QueueStage;
  attempts: number;
  lastAttempt: string;
  nextRetry: string;
  lastError: string;
}

export const QUEUE_ITEMS: QueueItem[] = [
  { id: 'NAB-Q-88421a', createdAt: '14:34:01', eventType: 'Encounter',        source: 'Doctor Portal',   patientId: 'UAE-xxxxxxxxx-1',   facility: 'Emirates Hospital', stage: 'In flight',   attempts: 1, lastAttempt: '14:34:02', nextRetry: '—',       lastError: '' },
  { id: 'NAB-Q-88420c', createdAt: '14:33:48', eventType: 'Prescription',     source: 'Doctor Portal',   patientId: 'UAE-xxxxxxxxx-2',   facility: 'Emirates Hospital', stage: 'Pending',     attempts: 0, lastAttempt: '—',        nextRetry: '—',       lastError: '' },
  { id: 'NAB-Q-88419b', createdAt: '14:33:22', eventType: 'Lab Result',       source: 'Lab & Radiology', patientId: 'UAE-xxxxxxxxx-3',   facility: 'Emirates Hospital', stage: 'Retrying',    attempts: 3, lastAttempt: '14:33:55', nextRetry: '14:35:55', lastError: 'NABIDH-ERR-4221: Patient EID not found' },
  { id: 'NAB-Q-88418a', createdAt: '14:20:10', eventType: 'Imaging Report',   source: 'Lab & Radiology', patientId: 'UAE-xxxxxxxxx-4',   facility: 'Emirates Hospital', stage: 'Dead-letter', attempts: 5, lastAttempt: '14:32:10', nextRetry: '—',       lastError: 'NABIDH-ERR-5012: Missing required extension (DHA facility code)' },
  { id: 'NAB-Q-88417d', createdAt: '14:18:44', eventType: 'Discharge Summary',source: 'Doctor Portal',   patientId: 'UAE-xxxxxxxxx-5',   facility: 'Emirates Hospital', stage: 'Held',        attempts: 0, lastAttempt: '—',        nextRetry: '—',       lastError: 'Held — pending patient NABIDH consent' },
  { id: 'NAB-Q-88416c', createdAt: '14:15:30', eventType: 'Prescription',     source: 'Pharmacy Portal', patientId: 'UAE-xxxxxxxxx-6',   facility: 'Emirates Hospital', stage: 'Pending',     attempts: 0, lastAttempt: '—',        nextRetry: '—',       lastError: '' },
  { id: 'NAB-Q-88415e', createdAt: '14:12:01', eventType: 'Vital Signs',      source: 'Doctor Portal',   patientId: 'UAE-xxxxxxxxx-7',   facility: 'Emirates Hospital', stage: 'Pending',     attempts: 0, lastAttempt: '—',        nextRetry: '—',       lastError: '' },
  { id: 'NAB-Q-88414a', createdAt: '14:08:18', eventType: 'Diagnosis',        source: 'Doctor Portal',   patientId: 'UAE-xxxxxxxxx-8',   facility: 'Emirates Hospital', stage: 'In flight',   attempts: 1, lastAttempt: '14:08:20', nextRetry: '—',       lastError: '' },
  { id: 'NAB-Q-88413b', createdAt: '13:58:40', eventType: 'Lab Order',        source: 'Lab & Radiology', patientId: 'UAE-xxxxxxxxx-9',   facility: 'Emirates Hospital', stage: 'Retrying',    attempts: 2, lastAttempt: '14:00:40', nextRetry: '14:04:40', lastError: 'NABIDH-ERR-3008: Invalid LOINC code 94309-2' },
  { id: 'NAB-Q-88412c', createdAt: '13:42:55', eventType: 'Immunization',     source: 'Doctor Portal',   patientId: 'UAE-xxxxxxxxx-10',  facility: 'Emirates Hospital', stage: 'Dead-letter', attempts: 5, lastAttempt: '14:22:55', nextRetry: '—',       lastError: 'NABIDH-ERR-5101: Vaccine code not in DHA value set' },
];

// Rejections
export const REJECTION_CODES = [
  { code: 'NABIDH-ERR-4221', desc: 'Patient Emirates ID not found',          count: 28, category: 'Patient data',    daysOpen: 1.2 },
  { code: 'NABIDH-ERR-3008', desc: 'Invalid or unmapped LOINC code',          count: 22, category: 'Mapping',         daysOpen: 2.8 },
  { code: 'NABIDH-ERR-5012', desc: 'Missing DHA facility code extension',    count: 14, category: 'Configuration',   daysOpen: 0.5 },
  { code: 'NABIDH-ERR-5101', desc: 'Vaccine code not in DHA value set',       count: 11, category: 'Mapping',         daysOpen: 3.1 },
  { code: 'NABIDH-ERR-2001', desc: 'Patient consent not on file',             count:  8, category: 'Consent',         daysOpen: 4.2 },
  { code: 'NABIDH-ERR-1440', desc: 'Encounter missing primary diagnosis',     count:  4, category: 'Source data',     daysOpen: 1.8 },
  { code: 'NABIDH-ERR-7003', desc: 'Duplicate submission (same encounter ID)',count:  2, category: 'Source data',     daysOpen: 0.2 },
];

export const REJECTIONS_LIST = [
  { id: 'NAB-REJ-2241', eventType: 'Lab Order',     patientId: 'UAE-xxxxxxxxx-9',  facility: 'Emirates Hospital', code: 'NABIDH-ERR-3008', reason: 'Invalid LOINC code 94309-2',           rejectedAt: '13:58:55', daysOpen: 0.4, assignedTo: 'Sven Larsen',    status: 'In progress' },
  { id: 'NAB-REJ-2240', eventType: 'Imaging Report',patientId: 'UAE-xxxxxxxxx-4',  facility: 'Emirates Hospital', code: 'NABIDH-ERR-5012', reason: 'Missing DHA facility code extension',  rejectedAt: '14:20:15', daysOpen: 0.2, assignedTo: '—',              status: 'Open'        },
  { id: 'NAB-REJ-2239', eventType: 'Immunization',  patientId: 'UAE-xxxxxxxxx-10', facility: 'Emirates Hospital', code: 'NABIDH-ERR-5101', reason: 'Vaccine code BCG not in value set',    rejectedAt: '12:42:18', daysOpen: 0.8, assignedTo: 'Omar Al Rashidi',status: 'Open'        },
  { id: 'NAB-REJ-2238', eventType: 'Encounter',     patientId: 'UAE-xxxxxxxxx-12', facility: 'Emirates Hospital', code: 'NABIDH-ERR-4221', reason: 'Patient EID not found in DHA registry',rejectedAt: '2026-04-29', daysOpen: 1.2, assignedTo: '—',             status: 'Open'        },
  { id: 'NAB-REJ-2237', eventType: 'Prescription',  patientId: 'UAE-xxxxxxxxx-8',  facility: 'Emirates Hospital', code: 'NABIDH-ERR-2001', reason: 'Patient consent withdrawn',            rejectedAt: '2026-04-28', daysOpen: 2.1, assignedTo: 'Fatima Al Zaabi',status: 'In progress' },
];

// Consent
export const CONSENT_KPIS = {
  activeWithConsent:   { value: 46481, total: 48231 },
  coveragePct:         96.8,
  pendingRequests:     284,
  withdrawnLast30d:    41,
  expiringIn30d:       128,
};

export const CONSENT_CATEGORIES = [
  { category: 'General sharing',  covered: 96.8, color: '#34D399' },
  { category: 'Mental health',    covered: 88.2, color: '#60A5FA' },
  { category: 'Reproductive',     covered: 91.4, color: '#F59E0B' },
  { category: 'HIV status',       covered: 84.1, color: '#F87171' },
  { category: 'Substance use',    covered: 86.0, color: '#A78BFA' },
  { category: 'Genetic data',     covered: 79.3, color: '#FB923C' },
];

export const CONSENT_LIST = [
  { id: 'CON-00481', patientId: 'UAE-xxxxxxxxx-1',  patientName: '●●●●●●',  type: 'General sharing',  status: 'Active',   grantedOn: '2025-03-14', expiresOn: '2027-03-14', channel: 'Patient Portal', lastAction: 'Renewed 2025-03-14'   },
  { id: 'CON-00482', patientId: 'UAE-xxxxxxxxx-2',  patientName: '●●●●●●',  type: 'General sharing',  status: 'Active',   grantedOn: '2025-07-01', expiresOn: '2027-07-01', channel: 'In-clinic',      lastAction: 'Granted 2025-07-01'   },
  { id: 'CON-00483', patientId: 'UAE-xxxxxxxxx-5',  patientName: '●●●●●●',  type: 'General sharing',  status: 'Pending',  grantedOn: '—',          expiresOn: '—',          channel: '—',              lastAction: 'Request sent 3d ago'  },
  { id: 'CON-00484', patientId: 'UAE-xxxxxxxxx-11', patientName: '●●●●●●',  type: 'Mental health',    status: 'Active',   grantedOn: '2025-09-20', expiresOn: '2026-09-20', channel: 'Patient Portal', lastAction: 'Granted 2025-09-20'   },
  { id: 'CON-00485', patientId: 'UAE-xxxxxxxxx-14', patientName: '●●●●●●',  type: 'General sharing',  status: 'Withdrawn',grantedOn: '2024-11-01', expiresOn: '—',          channel: 'In-clinic',      lastAction: 'Withdrawn 2026-04-20' },
];

// Certificates
export const CERTIFICATES = {
  client: {
    subject: 'CN=ceenaixprod.nabidh.dha.gov.ae, O=CeenAiX Technologies, C=AE',
    issuer:  'CN=DHA NABIDH CA G2, O=Dubai Health Authority, C=AE',
    fingerprint: 'SHA-256: 4A:1B:C8:2F:9E:44:D1:A2:BB:33:81:5C:F7:02:94:E8:3D:BA:71:CF',
    validFrom: '2025-06-10',
    validTo:   '2026-06-10',
    daysLeft:  41,
    keyStrength: 'RSA-4096',
    tlsVersion: 'TLS 1.3',
    cipher: 'TLS_AES_256_GCM_SHA384',
  },
  history: [
    { rotatedOn: '2025-06-10', rotatedBy: 'Omar Al Rashidi', reason: 'Annual renewal', fingerprint: '4A:1B:C8:2F…CF' },
    { rotatedOn: '2024-06-12', rotatedBy: 'Sven Larsen',     reason: 'Annual renewal', fingerprint: '88:A2:4D:F1…09' },
    { rotatedOn: '2023-06-15', rotatedBy: 'Admin',           reason: 'Initial setup',  fingerprint: '22:CC:89:3A…B4' },
  ],
};

export const PING_HISTORY = Array.from({ length: 60 }, (_, i) => ({
  t: i,
  ms: 280 + Math.round(Math.sin(i / 5) * 80 + Math.random() * 60),
}));

// Audit log
export const AUDIT_LOG = [
  { ts: '2026-04-30 14:31:02', category: 'Submission',  actor: 'System',          action: 'FHIR Encounter submitted',         resource: 'NAB-Q-88421a', outcome: 'Accepted',  ip: '10.0.1.42',  corr: 'c-0af1' },
  { ts: '2026-04-30 14:30:55', category: 'Submission',  actor: 'System',          action: 'FHIR Prescription submitted',      resource: 'NAB-Q-88420c', outcome: 'Accepted',  ip: '10.0.1.42',  corr: 'c-0af0' },
  { ts: '2026-04-30 14:28:18', category: 'Rejection',   actor: 'NABIDH Gateway',  action: 'Submission rejected',              resource: 'NAB-Q-88419b', outcome: 'Rejected',  ip: '185.2.4.12', corr: 'c-0aee' },
  { ts: '2026-04-30 14:22:40', category: 'PHI access',  actor: 'Omar Al Rashidi', action: 'Patient ID revealed',              resource: 'NAB-Q-88418a', outcome: 'Revealed',  ip: '192.168.4.8',corr: 'c-0ae9' },
  { ts: '2026-04-30 14:18:12', category: 'Consent',     actor: 'Patient Portal',  action: 'Patient consent withdrawn',        resource: 'CON-00485',    outcome: 'Withdrawn', ip: '10.4.2.91',  corr: 'c-0ae4' },
  { ts: '2026-04-30 13:55:00', category: 'Certificate', actor: 'System',          action: 'Certificate expiry warning sent',  resource: 'CERT-PROD-001',outcome: 'Sent',      ip: '10.0.1.1',   corr: 'c-0ac2' },
  { ts: '2026-04-30 11:00:00', category: 'Mapping',     actor: 'Sven Larsen',     action: 'LOINC mapping updated',            resource: 'MAP-LOINC-042',outcome: 'Approved',  ip: '192.168.4.5',corr: 'c-0a8f' },
  { ts: '2026-04-29 16:30:14', category: 'Configuration',actor: 'Omar Al Rashidi','action': 'Submission mode changed to Real-time', resource: 'CONFIG-001', outcome: 'Applied',  ip: '192.168.4.8',corr: 'c-0a11' },
];

// Mappings
export const FHIR_PROFILES = [
  { resource: 'Patient',          version: 'DHA-NABIDH-Patient-R4-v2.1',       source: 'DHA-published', validated: '2026-04-01', status: 'Active'  },
  { resource: 'Encounter',        version: 'DHA-NABIDH-Encounter-R4-v2.0',     source: 'DHA-published', validated: '2026-04-01', status: 'Active'  },
  { resource: 'Observation',      version: 'DHA-NABIDH-Observation-R4-v1.8',   source: 'DHA-published', validated: '2026-03-15', status: 'Active'  },
  { resource: 'MedicationRequest', version: 'DHA-NABIDH-MedReq-R4-v2.2',      source: 'DHA-published', validated: '2026-04-01', status: 'Active'  },
  { resource: 'DiagnosticReport', version: 'DHA-NABIDH-DiagRep-R4-v1.9',      source: 'DHA-published', validated: '2026-04-01', status: 'Active'  },
  { resource: 'Immunization',     version: 'DHA-NABIDH-Immunization-R4-v1.4', source: 'Custom override', validated: '2026-02-10', status: 'Review' },
];

export const UNMAPPED_CODES = [
  { code: '94309-2',    system: 'LOINC',    description: 'SARS-CoV-2 RNA panel',       occurrences: 84, priority: 'High'   },
  { code: 'BCG',        system: 'DHA-VAX',  description: 'BCG Vaccine (custom)',        occurrences: 48, priority: 'High'   },
  { code: '10839-9',    system: 'LOINC',    description: 'Body weight (usual)',          occurrences: 22, priority: 'Medium' },
  { code: 'E11.65',     system: 'ICD-10',   description: 'T2DM with hyperglycemia',     occurrences: 14, priority: 'Medium' },
  { code: 'ATORVASTATIN', system: 'RxNorm', description: 'Atorvastatin (brand match)', occurrences:  8, priority: 'Low'    },
];

// Reports
export const NABIDH_REPORTS = [
  { name: 'Monthly Compliance Report',     desc: 'Submission rates, latency, rejections, consent coverage, certificate health', lastRun: '2026-04-01', schedule: 'Monthly', owner: 'OR', recipients: ['dha-nabidh@dha.gov.ae', 'compliance@ceenaix.com'] },
  { name: 'Rejection Root-Cause Report',   desc: 'Categorized rejections with remediation timelines and trends',               lastRun: '2026-04-28', schedule: 'Weekly',  owner: 'SL', recipients: ['engineering@ceenaix.com'] },
  { name: 'Consent Audit Report',          desc: 'Consent coverage, withdrawals, sensitive category breakdown per DHA',        lastRun: '2026-04-01', schedule: 'Monthly', owner: 'FZ', recipients: ['compliance@ceenaix.com', 'legal@ceenaix.com'] },
  { name: 'Submission Completeness',       desc: 'Clinical events created vs submitted — gap analysis with drill-down',        lastRun: '2026-04-28', schedule: 'Weekly',  owner: 'SL', recipients: ['engineering@ceenaix.com'] },
  { name: 'PHI Access Report',             desc: 'Every PHI access during the period with actor, reason, and outcome',        lastRun: '2026-04-01', schedule: 'Monthly', owner: 'OR', recipients: ['compliance@ceenaix.com'] },
  { name: 'Annual DHA Filing',             desc: 'Consolidated annual report formatted to DHA NABIDH required template',      lastRun: '2026-01-15', schedule: 'Annual',  owner: 'OR', recipients: ['dha-nabidh@dha.gov.ae'] },
];

// Activity feed
export const NABIDH_ACTIVITY = [
  { severity: 'success', event: 'FHIR Encounter submitted & accepted',       patientId: 'UAE-xxx-1',  ts: '1 min ago'   },
  { severity: 'success', event: 'FHIR Prescription submitted & accepted',    patientId: 'UAE-xxx-2',  ts: '2 min ago'   },
  { severity: 'warning', event: 'Submission rejected — NABIDH-ERR-3008',     patientId: 'UAE-xxx-9',  ts: '4 min ago'   },
  { severity: 'info',    event: 'Patient consent received via Patient Portal',patientId: 'UAE-xxx-44', ts: '8 min ago'   },
  { severity: 'error',   event: 'Dead-letter: max retries exhausted',        patientId: 'UAE-xxx-10', ts: '11 min ago'  },
  { severity: 'success', event: 'Discharge Summary submitted & accepted',    patientId: 'UAE-xxx-5',  ts: '15 min ago'  },
  { severity: 'warning', event: 'Submission rejected — NABIDH-ERR-4221',     patientId: 'UAE-xxx-12', ts: '22 min ago'  },
  { severity: 'info',    event: 'Certificate expiry reminder sent (41 days)',patientId: '—',          ts: '1 hour ago'  },
  { severity: 'success', event: 'Batch of 48 lab results accepted',          patientId: 'various',    ts: '1 hour ago'  },
  { severity: 'warning', event: 'Consent withdrawn — submission held',       patientId: 'UAE-xxx-14', ts: '3 hours ago' },
];

// Latency histogram buckets
export const LATENCY_BUCKETS = [
  { label: '<1s',     count: 4820 },
  { label: '1–5s',    count: 3840 },
  { label: '5–30s',   count: 1820 },
  { label: '30s–2m',  count:  482 },
  { label: '2m–10m',  count:  184 },
  { label: '10m–1h',  count:   48 },
  { label: '>1h',     count:   10 },
];
