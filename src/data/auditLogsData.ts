// Platform-wide audit log mock data for CeenAiX Super Admin portal

export type AuditCategory =
  | 'Authentication'
  | 'Authorization'
  | 'Data Access'
  | 'Data Modification'
  | 'Configuration'
  | 'Integration'
  | 'Security'
  | 'Compliance'
  | 'Billing'
  | 'Impersonation'
  | 'System'
  | 'AI'
  | 'Communication';

export type AuditSeverity = 'Info' | 'Notice' | 'Warning' | 'Error' | 'Critical';
export type AuditOutcome = 'Success' | 'Failure' | 'Blocked' | 'Anomaly';
export type ActorType = 'Human Admin' | 'Human User' | 'System' | 'Integration' | 'AI Service' | 'Anonymous';
export type SourcePortal = 'Patient' | 'Doctor' | 'Pharmacy' | 'Lab & Radiology' | 'Insurance' | 'Admin' | 'Public' | 'API' | 'System';

export interface AuditEntry {
  id: string;
  timestamp: string;
  isoTimestamp: string;
  severity: AuditSeverity;
  category: AuditCategory;
  event: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  actorType: ActorType;
  impersonating?: string;
  resourceType: string;
  resourceId: string;
  resourceName?: string;
  workspace: string;
  portal: SourcePortal;
  outcome: AuditOutcome;
  ip: string;
  location: string;
  correlationId: string;
  sessionId: string;
  requestId: string;
  aiModel?: string;
  phiAccessed: boolean;
  anomaly?: { reason: string; score: number };
  flagged: boolean;
  entryHash: string;
  prevHash: string;
}

export const AUDIT_ENTRIES: AuditEntry[] = [
  {
    id: 'AE-000001',
    timestamp: '2026-05-04 08:14:22',
    isoTimestamp: '2026-05-04T08:14:22+04:00',
    severity: 'Critical',
    category: 'Security',
    event: 'API key rotated for production integration',
    actorId: 'USR-ADMIN-001',
    actorName: 'Dr. Tariq Al-Mansouri',
    actorRole: 'Super Admin',
    actorType: 'Human Admin',
    resourceType: 'API key',
    resourceId: 'KEY-PROD-004',
    resourceName: 'NABIDH Production Key',
    workspace: 'Global',
    portal: 'Admin',
    outcome: 'Success',
    ip: '10.0.4.22',
    location: 'Dubai, AE',
    correlationId: 'CORR-4F2A1',
    sessionId: 'SES-A82F',
    requestId: 'REQ-8824A',
    phiAccessed: false,
    flagged: true,
    entryHash: 'sha256:4f2a1b...',
    prevHash: 'sha256:3e1a09...',
  },
  {
    id: 'AE-000002',
    timestamp: '2026-05-04 08:12:04',
    isoTimestamp: '2026-05-04T08:12:04+04:00',
    severity: 'Warning',
    category: 'Data Access',
    event: 'Patient medical record viewed',
    actorId: 'USR-DOC-0842',
    actorName: 'Dr. Amira Hassan',
    actorRole: 'Attending Physician',
    actorType: 'Human User',
    resourceType: 'Patient',
    resourceId: 'PAT-****-4821',
    workspace: 'Aster DM Healthcare',
    portal: 'Doctor',
    outcome: 'Success',
    ip: '10.12.3.44',
    location: 'Dubai, AE',
    correlationId: 'CORR-9C3B2',
    sessionId: 'SES-D441',
    requestId: 'REQ-7742B',
    phiAccessed: true,
    flagged: false,
    entryHash: 'sha256:9c3b2d...',
    prevHash: 'sha256:4f2a1b...',
  },
  {
    id: 'AE-000003',
    timestamp: '2026-05-04 08:09:38',
    isoTimestamp: '2026-05-04T08:09:38+04:00',
    severity: 'Critical',
    category: 'Impersonation',
    event: 'Admin impersonated patient account',
    actorId: 'USR-ADMIN-001',
    actorName: 'Dr. Tariq Al-Mansouri',
    actorRole: 'Super Admin',
    actorType: 'Human Admin',
    impersonating: 'M. Al-Rashidi (PAT-****-7204)',
    resourceType: 'User account',
    resourceId: 'PAT-****-7204',
    workspace: 'Cleveland Clinic Abu Dhabi',
    portal: 'Admin',
    outcome: 'Success',
    ip: '10.0.4.22',
    location: 'Dubai, AE',
    correlationId: 'CORR-7E1D3',
    sessionId: 'SES-A82F',
    requestId: 'REQ-9912C',
    phiAccessed: true,
    anomaly: { reason: 'Impersonation with PHI access outside business hours', score: 78 },
    flagged: true,
    entryHash: 'sha256:7e1d3f...',
    prevHash: 'sha256:9c3b2d...',
  },
  {
    id: 'AE-000004',
    timestamp: '2026-05-04 08:07:55',
    isoTimestamp: '2026-05-04T08:07:55+04:00',
    severity: 'Info',
    category: 'Authentication',
    event: 'User login successful',
    actorId: 'USR-PHM-0234',
    actorName: 'Fatima Al-Zaabi',
    actorRole: 'Lead Pharmacist',
    actorType: 'Human User',
    resourceType: 'User account',
    resourceId: 'USR-PHM-0234',
    workspace: 'Mediclinic City Hospital',
    portal: 'Pharmacy',
    outcome: 'Success',
    ip: '10.8.2.11',
    location: 'Dubai, AE',
    correlationId: 'CORR-2B4E4',
    sessionId: 'SES-F104',
    requestId: 'REQ-3341D',
    phiAccessed: false,
    flagged: false,
    entryHash: 'sha256:2b4e4a...',
    prevHash: 'sha256:7e1d3f...',
  },
  {
    id: 'AE-000005',
    timestamp: '2026-05-04 08:05:12',
    isoTimestamp: '2026-05-04T08:05:12+04:00',
    severity: 'Error',
    category: 'Authentication',
    event: 'Login failed — invalid credentials',
    actorId: 'UNKNOWN',
    actorName: 'Unknown',
    actorRole: '—',
    actorType: 'Anonymous',
    resourceType: 'User account',
    resourceId: 'login@emirates-hospital.ae',
    workspace: 'Emirates Hospital',
    portal: 'Doctor',
    outcome: 'Failure',
    ip: '185.220.101.48',
    location: 'Netherlands, NL',
    correlationId: 'CORR-5A2F5',
    sessionId: '—',
    requestId: 'REQ-0020E',
    anomaly: { reason: 'Geo-anomaly: login attempt from Netherlands for UAE healthcare portal', score: 91 },
    phiAccessed: false,
    flagged: true,
    entryHash: 'sha256:5a2f5c...',
    prevHash: 'sha256:2b4e4a...',
  },
  {
    id: 'AE-000006',
    timestamp: '2026-05-04 08:03:40',
    isoTimestamp: '2026-05-04T08:03:40+04:00',
    severity: 'Notice',
    category: 'Integration',
    event: 'NABIDH submission batch processed',
    actorId: 'SVC-NABIDH-SYNC',
    actorName: 'NABIDH Sync Service',
    actorRole: 'Service Account',
    actorType: 'System',
    resourceType: 'Integration',
    resourceId: 'INT-NABIDH-PROD',
    workspace: 'Global',
    portal: 'System',
    outcome: 'Success',
    ip: '10.0.1.5',
    location: 'UAE East DC',
    correlationId: 'CORR-3C8G6',
    sessionId: 'SES-SVC1',
    requestId: 'REQ-BATCH-992',
    phiAccessed: false,
    flagged: false,
    entryHash: 'sha256:3c8g6h...',
    prevHash: 'sha256:5a2f5c...',
  },
  {
    id: 'AE-000007',
    timestamp: '2026-05-04 08:01:08',
    isoTimestamp: '2026-05-04T08:01:08+04:00',
    severity: 'Warning',
    category: 'AI',
    event: 'AI clinical recommendation generated for patient',
    actorId: 'SVC-AI-CLINICAL',
    actorName: 'CeenAiX Clinical AI',
    actorRole: 'AI Service',
    actorType: 'AI Service',
    resourceType: 'Patient',
    resourceId: 'PAT-****-3312',
    workspace: 'NMC Royal Hospital',
    portal: 'Doctor',
    outcome: 'Success',
    ip: '10.0.1.8',
    location: 'UAE East DC',
    correlationId: 'CORR-8D9H7',
    sessionId: 'SES-AI-044',
    requestId: 'REQ-4418F',
    aiModel: 'CeenAiX-Clinical-v2.1',
    phiAccessed: true,
    flagged: false,
    entryHash: 'sha256:8d9h7i...',
    prevHash: 'sha256:3c8g6h...',
  },
  {
    id: 'AE-000008',
    timestamp: '2026-05-04 07:58:30',
    isoTimestamp: '2026-05-04T07:58:30+04:00',
    severity: 'Critical',
    category: 'Compliance',
    event: 'Bulk patient data export initiated',
    actorId: 'USR-ADMIN-003',
    actorName: 'Farhan Ali',
    actorRole: 'Workspace Admin',
    actorType: 'Human Admin',
    resourceType: 'Patient',
    resourceId: 'BATCH-PAT-8841',
    workspace: 'Aster DM Healthcare',
    portal: 'Admin',
    outcome: 'Blocked',
    ip: '10.0.2.41',
    location: 'Dubai, AE',
    correlationId: 'CORR-1F0J8',
    sessionId: 'SES-C91D',
    requestId: 'REQ-5528G',
    anomaly: { reason: 'Bulk PHI export blocked — exceeds rate limit; requires audit:export-phi + approval', score: 95 },
    phiAccessed: false,
    flagged: true,
    entryHash: 'sha256:1f0j8k...',
    prevHash: 'sha256:8d9h7i...',
  },
  {
    id: 'AE-000009',
    timestamp: '2026-05-04 07:55:14',
    isoTimestamp: '2026-05-04T07:55:14+04:00',
    severity: 'Info',
    category: 'Data Modification',
    event: 'Prescription updated',
    actorId: 'USR-DOC-0412',
    actorName: 'Dr. Khalid Mansoor',
    actorRole: 'GP',
    actorType: 'Human User',
    resourceType: 'Prescription',
    resourceId: 'RX-88420',
    workspace: 'Al Zahra Hospital',
    portal: 'Doctor',
    outcome: 'Success',
    ip: '10.15.4.7',
    location: 'Dubai, AE',
    correlationId: 'CORR-6G1L9',
    sessionId: 'SES-K22C',
    requestId: 'REQ-7731H',
    phiAccessed: true,
    flagged: false,
    entryHash: 'sha256:6g1l9m...',
    prevHash: 'sha256:1f0j8k...',
  },
  {
    id: 'AE-000010',
    timestamp: '2026-05-04 07:50:00',
    isoTimestamp: '2026-05-04T07:50:00+04:00',
    severity: 'Notice',
    category: 'Configuration',
    event: 'Workspace notification settings updated',
    actorId: 'USR-ADMIN-004',
    actorName: 'Sara Al-Naqbi',
    actorRole: 'Workspace Admin',
    actorType: 'Human Admin',
    resourceType: 'Setting',
    resourceId: 'WS-MEDICLINIC-NOTIF',
    workspace: 'Mediclinic City Hospital',
    portal: 'Admin',
    outcome: 'Success',
    ip: '10.0.3.18',
    location: 'Dubai, AE',
    correlationId: 'CORR-4H2M0',
    sessionId: 'SES-S71B',
    requestId: 'REQ-8844I',
    phiAccessed: false,
    flagged: false,
    entryHash: 'sha256:4h2m0n...',
    prevHash: 'sha256:6g1l9m...',
  },
  {
    id: 'AE-000011',
    timestamp: '2026-05-04 07:44:32',
    isoTimestamp: '2026-05-04T07:44:32+04:00',
    severity: 'Warning',
    category: 'Authorization',
    event: 'Permission denied — attempted to access billing records',
    actorId: 'USR-DOC-0512',
    actorName: 'Dr. Nour Khalifa',
    actorRole: 'Resident',
    actorType: 'Human User',
    resourceType: 'Billing',
    resourceId: 'BILL-2024-8812',
    workspace: 'Aster DM Healthcare',
    portal: 'Doctor',
    outcome: 'Blocked',
    ip: '10.12.1.92',
    location: 'Dubai, AE',
    correlationId: 'CORR-9J3N1',
    sessionId: 'SES-N88E',
    requestId: 'REQ-9955J',
    phiAccessed: false,
    flagged: false,
    entryHash: 'sha256:9j3n1o...',
    prevHash: 'sha256:4h2m0n...',
  },
  {
    id: 'AE-000012',
    timestamp: '2026-05-04 07:38:17',
    isoTimestamp: '2026-05-04T07:38:17+04:00',
    severity: 'Info',
    category: 'Communication',
    event: 'Secure message sent between doctor and patient',
    actorId: 'USR-DOC-0842',
    actorName: 'Dr. Amira Hassan',
    actorRole: 'Attending Physician',
    actorType: 'Human User',
    resourceType: 'Message',
    resourceId: 'MSG-SEC-4421',
    workspace: 'Aster DM Healthcare',
    portal: 'Doctor',
    outcome: 'Success',
    ip: '10.12.3.44',
    location: 'Dubai, AE',
    correlationId: 'CORR-5K4P2',
    sessionId: 'SES-D441',
    requestId: 'REQ-1102K',
    phiAccessed: false,
    flagged: false,
    entryHash: 'sha256:5k4p2q...',
    prevHash: 'sha256:9j3n1o...',
  },
];

// ─── KPI Data ────────────────────────────────────────────────────────────────
export const AUDIT_KPIS = {
  totalEvents: { value: 284_920, delta: 3.8, sparkline: [240, 258, 265, 272, 280, 274, 285] },
  phiAccess: { value: 12_441, pct: 4.37, delta: -1.2, sparkline: [11, 12, 13, 12, 13, 12, 12] },
  failures: { value: 1_824, delta: 8.4, sparkline: [1400, 1500, 1700, 1600, 1800, 1700, 1824] },
  highRisk: { value: 342, delta: -5.1, sparkline: [380, 360, 355, 350, 348, 345, 342] },
  uniqueActors: { value: 4_218, delta: 2.1, sparkline: [3900, 4000, 4100, 4050, 4180, 4200, 4218] },
  anomalies: { value: 28, delta: -12.5, breakdown: { critical: 3, high: 8, medium: 11, low: 6 }, sparkline: [40, 36, 32, 30, 29, 31, 28] },
};

// ─── Stats data ───────────────────────────────────────────────────────────────
export const EVENTS_OVER_TIME = [
  { date: 'Apr 28', Authentication: 4200, 'Data Access': 12400, 'Data Modification': 3800, Integration: 8200, Security: 420, AI: 1800, Other: 2200 },
  { date: 'Apr 29', Authentication: 4800, 'Data Access': 13800, 'Data Modification': 4100, Integration: 8800, Security: 380, AI: 2100, Other: 2400 },
  { date: 'Apr 30', Authentication: 3900, 'Data Access': 11200, 'Data Modification': 3200, Integration: 7800, Security: 410, AI: 1900, Other: 2000 },
  { date: 'May 01', Authentication: 5100, 'Data Access': 14200, 'Data Modification': 4400, Integration: 9200, Security: 440, AI: 2300, Other: 2600 },
  { date: 'May 02', Authentication: 4600, 'Data Access': 13100, 'Data Modification': 4000, Integration: 8600, Security: 395, AI: 2000, Other: 2300 },
  { date: 'May 03', Authentication: 4900, 'Data Access': 13900, 'Data Modification': 4300, Integration: 9000, Security: 428, AI: 2200, Other: 2500 },
  { date: 'May 04', Authentication: 5200, 'Data Access': 14800, 'Data Modification': 4600, Integration: 9400, Security: 460, AI: 2400, Other: 2700 },
];

export const TOP_ACTORS = [
  { name: 'NABIDH Sync Service', role: 'System', count: 28420, type: 'System' },
  { name: 'Dr. Amira Hassan', role: 'Attending Physician', count: 4218, type: 'Human User' },
  { name: 'CeenAiX Clinical AI', role: 'AI Service', count: 3890, type: 'AI Service' },
  { name: 'Dr. Tariq Al-Mansouri', role: 'Super Admin', count: 2104, type: 'Human Admin' },
  { name: 'Fatima Al-Zaabi', role: 'Lead Pharmacist', count: 1842, type: 'Human User' },
  { name: 'eClaim Gateway', role: 'Integration', count: 1640, type: 'Integration' },
  { name: 'Dr. Khalid Mansoor', role: 'GP', count: 1320, type: 'Human User' },
];

export const FAILURE_REASONS = [
  { reason: 'Invalid credentials', count: 620, pct: 34.0 },
  { reason: 'Session expired', count: 440, pct: 24.1 },
  { reason: 'Permission denied', count: 380, pct: 20.8 },
  { reason: 'Rate limit exceeded', count: 210, pct: 11.5 },
  { reason: 'Invalid token', count: 98, pct: 5.4 },
  { reason: 'Other', count: 76, pct: 4.2 },
];

export const ANOMALY_FEED = [
  { id: 'ANO-001', severity: 'Critical' as AuditSeverity, summary: 'Bulk PHI export blocked — Farhan Ali, Aster DM', time: '5 min ago', score: 95, status: 'Open' as const },
  { id: 'ANO-002', severity: 'Critical' as AuditSeverity, summary: 'Geo-anomaly login attempt from Netherlands on Emirates Hospital portal', time: '9 min ago', score: 91, status: 'Open' as const },
  { id: 'ANO-003', severity: 'Warning' as AuditSeverity, summary: 'Impersonation + PHI access outside business hours', time: '12 min ago', score: 78, status: 'Open' as const },
  { id: 'ANO-004', severity: 'Warning' as AuditSeverity, summary: '14 failed login attempts for NMC account from same IP within 60s', time: '22 min ago', score: 82, status: 'Acknowledged' as const },
  { id: 'ANO-005', severity: 'Warning' as AuditSeverity, summary: 'API key rotation in production without change management ticket', time: '1 h ago', score: 68, status: 'Investigating' as const },
];

export const SAVED_VIEWS = [
  { id: 'SV-001', name: "Today's PHI access", shared: true, category: 'Data Access', filters: 'phiAccessed=true,range=today' },
  { id: 'SV-002', name: 'Failed logins (24h)', shared: true, category: 'Authentication', filters: 'category=Authentication,outcome=Failure,range=24h' },
  { id: 'SV-003', name: 'All impersonation events', shared: true, category: 'Impersonation', filters: 'category=Impersonation' },
  { id: 'SV-004', name: 'Production config changes', shared: true, category: 'Configuration', filters: 'category=Configuration,workspace=Global' },
  { id: 'SV-005', name: 'Critical events (7d)', shared: true, category: 'Security', filters: 'severity=Critical,range=7d' },
  { id: 'SV-006', name: 'Bulk exports', shared: true, category: 'Compliance', filters: 'event=export,severity=Critical' },
  { id: 'SV-007', name: 'Sensitive consent changes', shared: false, category: 'Compliance', filters: 'category=Compliance,event=consent' },
];

export const INTEGRITY_STRIP = {
  chainStatus: 'Verified' as 'Verified' | 'Failed',
  lastVerified: '2026-05-04T07:00:00+04:00',
  totalEntries: 284_920,
  retentionYears: 7,
  lastEntry: '2026-05-04T08:14:22+04:00',
  storageRegion: 'UAE East',
  encryptedAtRest: true,
  wormLocked: true,
};
