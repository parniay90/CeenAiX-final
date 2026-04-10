export type OrganizationType = 'hospital' | 'clinic' | 'pharmacy' | 'laboratory';
export type ActivityType = 'prescription' | 'nabidh_sync' | 'interaction_alert' | 'ai_consultation' | 'lab_result' | 'appointment';
export type SystemStatus = 'operational' | 'degraded' | 'down';

export interface HeroMetric {
  id: string;
  label: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  color?: string;
}

export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  location: {
    lat: number;
    lng: number;
    city: string;
    emirate: string;
  };
  stats: {
    activeUsers: number;
    dailyTransactions: number;
    nabidhSyncs: number;
  };
  status: 'active' | 'inactive';
  connectedAt: Date;
}

export interface ActivityEvent {
  id: string;
  organizationId: string;
  organizationName: string;
  type: ActivityType;
  description: string;
  timestamp: Date;
  severity: 'info' | 'warning' | 'critical';
}

export interface AIMetrics {
  modelAccuracy: number;
  totalInteractions: number;
  alertAccuracy: number;
  specialtyBreakdown: {
    specialty: string;
    interactions: number;
  }[];
  biasMonitoring: {
    demographic: string;
    percentage: number;
  }[];
}

export interface SystemService {
  name: string;
  status: SystemStatus;
  latency: number;
  uptime: number;
  lastCheck: Date;
}

export interface ComplianceMetrics {
  dhaScore: number;
  nextAuditDate: Date;
  outstandingItems: string[];
  nabidhSubmissionRate: number;
}

export interface DashboardData {
  heroMetrics: HeroMetric[];
  organizations: Organization[];
  recentActivity: ActivityEvent[];
  aiMetrics: AIMetrics;
  systemHealth: {
    services: SystemService[];
    apiResponseTime: { time: string; value: number }[];
    errorRate: number;
    activeSessions: number;
  };
  compliance: ComplianceMetrics;
}

export const MOCK_ADMIN_DASHBOARD: DashboardData = {
  heroMetrics: [
    {
      id: 'patients',
      label: 'Total Registered Patients',
      value: '48,231',
      trend: 12,
      trendLabel: 'this month',
    },
    {
      id: 'orgs',
      label: 'Active Healthcare Organizations',
      value: 34,
    },
    {
      id: 'ai-consultations',
      label: 'AI Consultations This Month',
      value: '127,450',
    },
    {
      id: 'nabidh',
      label: 'NABIDH Syncs Today',
      value: '8,923',
    },
    {
      id: 'uptime',
      label: 'Platform Uptime',
      value: '99.97%',
    },
    {
      id: 'compliance',
      label: 'DHA Compliance Status',
      value: 'Compliant',
      color: 'green',
    },
  ],
  organizations: [
    {
      id: 'org-1',
      name: 'Mediclinic Dubai Mall',
      type: 'hospital',
      location: { lat: 25.1972, lng: 55.2744, city: 'Dubai', emirate: 'Dubai' },
      stats: { activeUsers: 234, dailyTransactions: 1247, nabidhSyncs: 456 },
      status: 'active',
      connectedAt: new Date('2024-01-15'),
    },
    {
      id: 'org-2',
      name: 'Mediclinic JBR',
      type: 'clinic',
      location: { lat: 25.0784, lng: 55.1383, city: 'Dubai', emirate: 'Dubai' },
      stats: { activeUsers: 89, dailyTransactions: 423, nabidhSyncs: 156 },
      status: 'active',
      connectedAt: new Date('2024-02-01'),
    },
    {
      id: 'org-3',
      name: 'NMC Royal Hospital',
      type: 'hospital',
      location: { lat: 25.3548, lng: 55.3915, city: 'Sharjah', emirate: 'Sharjah' },
      stats: { activeUsers: 312, dailyTransactions: 1876, nabidhSyncs: 723 },
      status: 'active',
      connectedAt: new Date('2023-11-20'),
    },
    {
      id: 'org-4',
      name: 'Aster Pharmacy Marina',
      type: 'pharmacy',
      location: { lat: 25.0805, lng: 55.1407, city: 'Dubai', emirate: 'Dubai' },
      stats: { activeUsers: 45, dailyTransactions: 892, nabidhSyncs: 234 },
      status: 'active',
      connectedAt: new Date('2024-03-10'),
    },
    {
      id: 'org-5',
      name: 'Life Pharmacy Downtown',
      type: 'pharmacy',
      location: { lat: 25.1951, lng: 55.2798, city: 'Dubai', emirate: 'Dubai' },
      stats: { activeUsers: 38, dailyTransactions: 678, nabidhSyncs: 198 },
      status: 'active',
      connectedAt: new Date('2024-02-28'),
    },
    {
      id: 'org-6',
      name: 'Unilabs Dubai',
      type: 'laboratory',
      location: { lat: 25.2048, lng: 55.2708, city: 'Dubai', emirate: 'Dubai' },
      stats: { activeUsers: 67, dailyTransactions: 1123, nabidhSyncs: 445 },
      status: 'active',
      connectedAt: new Date('2024-01-05'),
    },
    {
      id: 'org-7',
      name: 'Cleveland Clinic Abu Dhabi',
      type: 'hospital',
      location: { lat: 24.4539, lng: 54.3773, city: 'Abu Dhabi', emirate: 'Abu Dhabi' },
      stats: { activeUsers: 456, dailyTransactions: 2134, nabidhSyncs: 892 },
      status: 'active',
      connectedAt: new Date('2023-10-12'),
    },
    {
      id: 'org-8',
      name: 'Burjeel Hospital',
      type: 'hospital',
      location: { lat: 24.4764, lng: 54.3705, city: 'Abu Dhabi', emirate: 'Abu Dhabi' },
      stats: { activeUsers: 278, dailyTransactions: 1567, nabidhSyncs: 634 },
      status: 'active',
      connectedAt: new Date('2024-01-22'),
    },
  ],
  recentActivity: [
    {
      id: 'evt-1',
      organizationId: 'org-2',
      organizationName: 'Mediclinic JBR',
      type: 'prescription',
      description: '3 new prescriptions issued',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      severity: 'info',
    },
    {
      id: 'evt-2',
      organizationId: 'org-3',
      organizationName: 'NMC Royal Hospital',
      type: 'nabidh_sync',
      description: 'NABIDH sync completed',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      severity: 'info',
    },
    {
      id: 'evt-3',
      organizationId: 'org-4',
      organizationName: 'Aster Pharmacy Marina',
      type: 'interaction_alert',
      description: 'Rx dispense flagged for drug interaction',
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
      severity: 'warning',
    },
    {
      id: 'evt-4',
      organizationId: 'org-1',
      organizationName: 'Mediclinic Dubai Mall',
      type: 'ai_consultation',
      description: 'AI clinical decision support activated',
      timestamp: new Date(Date.now() - 12 * 60 * 1000),
      severity: 'info',
    },
    {
      id: 'evt-5',
      organizationId: 'org-6',
      organizationName: 'Unilabs Dubai',
      type: 'lab_result',
      description: 'Critical lab value detected and flagged',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      severity: 'critical',
    },
    {
      id: 'evt-6',
      organizationId: 'org-7',
      organizationName: 'Cleveland Clinic Abu Dhabi',
      type: 'appointment',
      description: '47 appointments scheduled today',
      timestamp: new Date(Date.now() - 18 * 60 * 1000),
      severity: 'info',
    },
  ],
  aiMetrics: {
    modelAccuracy: 94.7,
    totalInteractions: 3456,
    alertAccuracy: 87.3,
    specialtyBreakdown: [
      { specialty: 'Internal Medicine', interactions: 1234 },
      { specialty: 'Cardiology', interactions: 892 },
      { specialty: 'Pediatrics', interactions: 678 },
      { specialty: 'Orthopedics', interactions: 423 },
      { specialty: 'Dermatology', interactions: 229 },
    ],
    biasMonitoring: [
      { demographic: 'Male', percentage: 48 },
      { demographic: 'Female', percentage: 52 },
      { demographic: 'Age 18-35', percentage: 32 },
      { demographic: 'Age 36-55', percentage: 41 },
      { demographic: 'Age 56+', percentage: 27 },
    ],
  },
  systemHealth: {
    services: [
      {
        name: 'API Gateway',
        status: 'operational',
        latency: 45,
        uptime: 99.98,
        lastCheck: new Date(),
      },
      {
        name: 'NABIDH Connection',
        status: 'operational',
        latency: 123,
        uptime: 99.95,
        lastCheck: new Date(),
      },
      {
        name: 'DHA Reporting API',
        status: 'operational',
        latency: 78,
        uptime: 99.97,
        lastCheck: new Date(),
      },
      {
        name: 'AI Inference Engine',
        status: 'operational',
        latency: 234,
        uptime: 99.92,
        lastCheck: new Date(),
      },
      {
        name: 'Database Cluster',
        status: 'operational',
        latency: 12,
        uptime: 99.99,
        lastCheck: new Date(),
      },
    ],
    apiResponseTime: [
      { time: '00:00', value: 45 },
      { time: '04:00', value: 38 },
      { time: '08:00', value: 62 },
      { time: '12:00', value: 78 },
      { time: '16:00', value: 71 },
      { time: '20:00', value: 54 },
      { time: '23:00', value: 47 },
    ],
    errorRate: 0.08,
    activeSessions: 1247,
  },
  compliance: {
    dhaScore: 98,
    nextAuditDate: new Date('2026-06-15'),
    outstandingItems: [
      'Update privacy policy documentation for Q2 2026',
      'Complete staff training module 3 (2 organizations pending)',
    ],
    nabidhSubmissionRate: 99.3,
  },
};
