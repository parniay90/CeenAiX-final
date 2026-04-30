// ─── Revenue mock data for CeenAiX Super Admin Revenue page ──────────────────

export type Currency = 'AED' | 'USD' | 'EUR' | 'SAR';

export const FX_RATES: Record<Currency, number> = {
  AED: 1,
  USD: 0.272,
  EUR: 0.251,
  SAR: 1.02,
};

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  AED: 'AED',
  USD: '$',
  EUR: '€',
  SAR: 'SAR',
};

export function formatCurrency(aed: number, currency: Currency, compact = false): string {
  const val = aed * FX_RATES[currency];
  const sym = CURRENCY_SYMBOLS[currency];
  if (compact) {
    if (val >= 1_000_000) return `${sym} ${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `${sym} ${(val / 1_000).toFixed(1)}K`;
    return `${sym} ${val.toFixed(0)}`;
  }
  return `${sym} ${val.toLocaleString('en-AE', { maximumFractionDigits: 0 })}`;
}

// KPI cards
export const REVENUE_KPIS = {
  totalRevenue:            { aed: 4_812_400, delta: 18.4,  spark: [310,290,340,380,420,460,490,510,480,540,570,620,590,660,700,720,680,750,810,840,860,900,870,940] },
  netRevenue:              { aed: 4_201_300, delta: 17.1,  spark: [270,250,300,330,370,410,440,460,430,490,510,560,540,590,630,650,610,680,720,750,780,810,790,850] },
  mrr:                     { aed: 1_248_000, delta: 9.2,   spark: [940,950,960,970,980,990,1000,1010,1020,1030,1040,1050,1060,1070,1080,1090,1100,1110,1120,1130,1140,1150,1160,1200] },
  arpu:                    { aed: 18_420,    delta: 4.7,   spark: [16,16.4,16.8,17,17.2,17.4,17.6,17.8,17.9,18,18.1,18.2,18.3,18.3,18.4] },
  activeWorkspaces:        { value: 14,      delta: 7.7,   spark: [9,9,10,10,11,11,12,12,12,13,13,13,14,14,14] },
  outstandingReceivables:  { aed: 892_000,   delta: -5.2,  aging: [480000, 210000, 120000, 82000] }, // 0-30, 31-60, 61-90, 90+
};

// Revenue trend (daily for last 30 days)
function genDailyRevenue(days: number) {
  const sources = ['subscriptions', 'consultations', 'lab', 'pharmacy', 'insurance', 'other'] as const;
  return Array.from({ length: days }, (_, i) => {
    const base = 120000 + Math.sin(i / 5) * 20000 + i * 1200;
    return {
      date: new Date(Date.now() - (days - i - 1) * 86400000).toISOString().slice(0, 10),
      subscriptions: Math.round(base * 0.26 + Math.random() * 5000),
      consultations:  Math.round(base * 0.31 + Math.random() * 8000),
      lab:            Math.round(base * 0.16 + Math.random() * 4000),
      pharmacy:       Math.round(base * 0.13 + Math.random() * 3000),
      insurance:      Math.round(base * 0.10 + Math.random() * 2000),
      other:          Math.round(base * 0.04 + Math.random() * 1000),
    };
  });
}

export const REVENUE_TREND = genDailyRevenue(30);

// Revenue by source
export const REVENUE_BY_SOURCE = [
  { source: 'Subscriptions',      aed: 1_252_000, pct: 26.0, delta: 9.2  },
  { source: 'Consultations',      aed: 1_491_800, pct: 31.0, delta: 22.1 },
  { source: 'Lab & Radiology',    aed:   769_980, pct: 16.0, delta: 15.4 },
  { source: 'Pharmacy',           aed:   625_610, pct: 13.0, delta: 11.8 },
  { source: 'Insurance Fees',     aed:   481_240, pct: 10.0, delta: 8.9  },
  { source: 'Other',              aed:   191_770, pct:  4.0, delta: -2.3 },
];

export const SOURCE_COLORS = [
  '#2DD4BF', '#60A5FA', '#F59E0B', '#34D399', '#FB923C', '#A78BFA',
];

// Workspace revenue table
export const WORKSPACE_REVENUE = [
  { rank: 1,  name: 'Emirates Hospital Group',   logo: 'EH', tier: 'Enterprise',   region: 'UAE — Dubai',    aed: 2_140_000, delta: 21.3,  users: 342, arpu: 6257,  health: 'Healthy'  },
  { rank: 2,  name: 'Abu Dhabi Clinic Network',  logo: 'AC', tier: 'Enterprise',   region: 'UAE — Abu Dhabi',aed: 1_020_000, delta: 14.8,  users: 128, arpu: 7968,  health: 'Healthy'  },
  { rank: 3,  name: 'Medcare Sharjah',           logo: 'MS', tier: 'Professional', region: 'UAE — Sharjah',  aed:   481_000, delta: -8.2,  users:  48, arpu: 10020, health: 'At risk'  },
  { rank: 4,  name: 'HealthBridge KSA',          logo: 'HB', tier: 'Professional', region: 'KSA — Riyadh',  aed:   394_000, delta: 33.1,  users:  67, arpu: 5880,  health: 'Healthy'  },
  { rank: 5,  name: 'GreenMed Clinic',           logo: 'GM', tier: 'Growth',       region: 'UAE — Dubai',   aed:   218_000, delta: 12.4,  users:  24, arpu: 9083,  health: 'Healthy'  },
  { rank: 6,  name: 'Al Noor Polyclinic',        logo: 'AN', tier: 'Growth',       region: 'UAE — Abu Dhabi',aed:   184_000, delta: -2.1,  users:  19, arpu: 9684,  health: 'At risk'  },
  { rank: 7,  name: 'PrimeCare RAK',             logo: 'PC', tier: 'Growth',       region: 'UAE — RAK',     aed:   142_000, delta: 5.9,   users:  15, arpu: 9466,  health: 'Healthy'  },
  { rank: 8,  name: 'Wellbeing Ajman',           logo: 'WB', tier: 'Pilot',        region: 'UAE — Ajman',   aed:    98_000, delta: 44.1,  users:  11, arpu: 8909,  health: 'Healthy'  },
  { rank: 9,  name: 'NovaMed Bahrain',           logo: 'NM', tier: 'Pilot',        region: 'GCC — Bahrain', aed:    72_000, delta: 18.7,  users:   8, arpu: 9000,  health: 'Healthy'  },
  { rank: 10, name: 'City Clinic Kuwait',        logo: 'CC', tier: 'Pilot',        region: 'GCC — Kuwait',  aed:    55_000, delta: -14.4, users:   6, arpu: 9166,  health: 'At risk'  },
];

// MRR movement (waterfall)
export const MRR_WATERFALL = [
  { label: 'Starting MRR', aed: 1_143_000, type: 'base'       as const },
  { label: 'New MRR',      aed:    94_000, type: 'positive'   as const },
  { label: 'Expansion',    aed:    61_000, type: 'positive'   as const },
  { label: 'Contraction',  aed:   -28_000, type: 'negative'   as const },
  { label: 'Churn',        aed:   -22_000, type: 'negative'   as const },
  { label: 'Ending MRR',   aed: 1_248_000, type: 'total'      as const },
];

// Subscription plans
export const SUBSCRIPTION_PLANS = [
  { plan: 'Enterprise',    active: 3,  mrrAed: 624_000, pctTotal: 50.0, avgMonths: 14.2, churnRate: 0.0  },
  { plan: 'Professional',  active: 5,  mrrAed: 374_400, pctTotal: 30.0, avgMonths: 8.4,  churnRate: 3.2  },
  { plan: 'Growth',        active: 4,  mrrAed: 174_720, pctTotal: 14.0, avgMonths: 5.1,  churnRate: 6.8  },
  { plan: 'Pilot',         active: 2,  mrrAed:  74_880, pctTotal:  6.0, avgMonths: 2.2,  churnRate: 0.0  },
];

export const SUBSCRIPTIONS_LIST = [
  { id: 'sub-001', workspace: 'Emirates Hospital Group',  plan: 'Enterprise',   status: 'Active',   mrrAed: 208000, cycle: 'Annual',  renewal: '2027-01-15', started: '2024-01-15', ltvAed: 3120000 },
  { id: 'sub-002', workspace: 'Abu Dhabi Clinic Network', plan: 'Enterprise',   status: 'Active',   mrrAed: 208000, cycle: 'Annual',  renewal: '2027-03-20', started: '2024-03-20', ltvAed: 2496000 },
  { id: 'sub-003', workspace: 'HealthBridge KSA',         plan: 'Enterprise',   status: 'Active',   mrrAed: 208000, cycle: 'Annual',  renewal: '2026-09-01', started: '2024-09-01', ltvAed: 1872000 },
  { id: 'sub-004', workspace: 'Medcare Sharjah',          plan: 'Professional', status: 'Past due', mrrAed:  74880, cycle: 'Monthly', renewal: '2026-05-01', started: '2025-09-03', ltvAed:  523160 },
  { id: 'sub-005', workspace: 'GreenMed Clinic',          plan: 'Growth',       status: 'Active',   mrrAed:  43680, cycle: 'Monthly', renewal: '2026-05-28', started: '2025-11-28', ltvAed:  218400 },
  { id: 'sub-006', workspace: 'Al Noor Polyclinic',       plan: 'Growth',       status: 'Active',   mrrAed:  43680, cycle: 'Monthly', renewal: '2026-05-14', started: '2025-10-14', ltvAed:  305760 },
  { id: 'sub-007', workspace: 'PrimeCare RAK',            plan: 'Growth',       status: 'Active',   mrrAed:  43680, cycle: 'Monthly', renewal: '2026-06-02', started: '2025-12-02', ltvAed:  174720 },
  { id: 'sub-008', workspace: 'Wellbeing Ajman',          plan: 'Pilot',        status: 'Trial',    mrrAed:  37440, cycle: 'Monthly', renewal: '2026-05-20', started: '2026-03-20', ltvAed:   74880 },
  { id: 'sub-009', workspace: 'NovaMed Bahrain',          plan: 'Pilot',        status: 'Active',   mrrAed:  37440, cycle: 'Monthly', renewal: '2026-06-08', started: '2026-02-08', ltvAed:   74880 },
  { id: 'sub-010', workspace: 'City Clinic Kuwait',       plan: 'Professional', status: 'Active',   mrrAed:  74880, cycle: 'Annual',  renewal: '2026-12-01', started: '2025-12-01', ltvAed:  598240 },
];

// Transactions
export const TRANSACTIONS = [
  { id: 'txn-8841a', ts: '14:31:02', type: 'Consultation',  workspace: 'Emirates Hospital Group',  customer: 'A. Al-Mansoori',  aedGross: 850,   aedNet: 833,   method: 'Visa ···4242',       status: 'Succeeded', risk: 12  },
  { id: 'txn-8840f', ts: '14:28:44', type: 'Lab test',      workspace: 'Abu Dhabi Clinic Network',  customer: 'S. Ibrahim',      aedGross: 420,   aedNet: 412,   method: 'Mastercard ···9104', status: 'Succeeded', risk: 8   },
  { id: 'txn-8839c', ts: '14:22:10', type: 'Pharmacy',      workspace: 'GreenMed Clinic',           customer: 'M. Hassan',       aedGross: 214,   aedNet: 210,   method: 'Apple Pay',          status: 'Succeeded', risk: 5   },
  { id: 'txn-8838b', ts: '14:18:30', type: 'Subscription',  workspace: 'Medcare Sharjah',           customer: 'Medcare Sharjah', aedGross: 74880, aedNet: 74130, method: 'Bank transfer',      status: 'Failed',    risk: 61  },
  { id: 'txn-8837a', ts: '14:12:55', type: 'Imaging',       workspace: 'Emirates Hospital Group',  customer: 'F. Al-Zaabi',     aedGross: 1400,  aedNet: 1372,  method: 'Insurance',          status: 'Succeeded', risk: 18  },
  { id: 'txn-8836d', ts: '14:09:12', type: 'Insurance fee', workspace: 'Emirates Hospital Group',  customer: 'Daman',           aedGross: 3200,  aedNet: 3168,  method: 'Bank transfer',      status: 'Succeeded', risk: 4   },
  { id: 'txn-8835c', ts: '13:58:40', type: 'Consultation',  workspace: 'HealthBridge KSA',          customer: 'K. Al-Rashidi',   aedGross: 1100,  aedNet: 1078,  method: 'Visa ···7821',       status: 'Succeeded', risk: 9   },
  { id: 'txn-8834a', ts: '13:42:18', type: 'Refund',        workspace: 'Emirates Hospital Group',  customer: 'N. Qassim',       aedGross: -420,  aedNet: -420,  method: 'Visa ···2233',       status: 'Refunded',  risk: 0   },
  { id: 'txn-8833e', ts: '13:38:05', type: 'Lab test',      workspace: 'PrimeCare RAK',             customer: 'R. Ahmed',        aedGross: 310,   aedNet: 304,   method: 'Google Pay',         status: 'Succeeded', risk: 14  },
  { id: 'txn-8832b', ts: '13:21:44', type: 'Consultation',  workspace: 'Al Noor Polyclinic',        customer: 'L. Yusuf',        aedGross: 650,   aedNet: 637,   method: 'Mastercard ···5511', status: 'Disputed',  risk: 82  },
];

// Invoices
export const INVOICES = [
  { id: 'INV-2026-0841', issued: '2026-04-01', due: '2026-05-01', customer: 'Emirates Hospital Group', type: 'Workspace', aed: 208000, balance: 0,       status: 'Paid',     lastAction: 'Paid 8 days ago'           },
  { id: 'INV-2026-0840', issued: '2026-04-01', due: '2026-05-01', customer: 'Abu Dhabi Clinic Network', type: 'Workspace', aed: 208000, balance: 208000,  status: 'Sent',     lastAction: 'Reminder sent 2 days ago'  },
  { id: 'INV-2026-0839', issued: '2026-03-01', due: '2026-04-01', customer: 'Medcare Sharjah',          type: 'Workspace', aed: 74880,  balance: 74880,   status: 'Overdue',  lastAction: 'Overdue by 29 days'        },
  { id: 'INV-2026-0838', issued: '2026-04-10', due: '2026-05-10', customer: 'Daman TPA',                type: 'Insurer',   aed: 318400, balance: 0,       status: 'Paid',     lastAction: 'Paid 14 days ago'          },
  { id: 'INV-2026-0837', issued: '2026-04-15', due: '2026-05-15', customer: 'NextCare TPA',             type: 'Insurer',   aed: 142000, balance: 142000,  status: 'Sent',     lastAction: 'Sent 15 days ago'          },
  { id: 'INV-2026-0836', issued: '2026-02-01', due: '2026-03-01', customer: 'City Clinic Kuwait',       type: 'Workspace', aed: 74880,  balance: 74880,   status: 'Overdue',  lastAction: 'Overdue by 59 days'        },
  { id: 'INV-2026-0835', issued: '2026-04-20', due: '2026-05-20', customer: 'GreenMed Clinic',          type: 'Workspace', aed: 43680,  balance: 0,       status: 'Paid',     lastAction: 'Paid 4 days ago'           },
  { id: 'INV-2026-0834', issued: '2025-12-01', due: '2025-12-31', customer: 'Al Noor Polyclinic',       type: 'Workspace', aed: 43680,  balance: 43680,   status: 'Overdue',  lastAction: 'Overdue by 120 days'       },
];

// Payouts
export const PAYOUTS = [
  { id: 'PO-2026-0214', workspace: 'Emirates Hospital Group',  bank: 'Emirates NBD ···4421', aed: 1_810_000, currency: 'AED', status: 'Paid',        initiated: '2026-04-25', arrival: '2026-04-27' },
  { id: 'PO-2026-0213', workspace: 'Abu Dhabi Clinic Network', bank: 'FAB ···9102',          aed:   860_000, currency: 'AED', status: 'In transit',  initiated: '2026-04-28', arrival: '2026-04-30' },
  { id: 'PO-2026-0212', workspace: 'HealthBridge KSA',         bank: 'Al Rajhi ···7711',    aed:   310_000, currency: 'SAR', status: 'In transit',  initiated: '2026-04-29', arrival: '2026-05-01' },
  { id: 'PO-2026-0211', workspace: 'GreenMed Clinic',          bank: 'Mashreq ···3380',      aed:   174_000, currency: 'AED', status: 'Pending',     initiated: '—',          arrival: '2026-05-02' },
  { id: 'PO-2026-0210', workspace: 'Medcare Sharjah',          bank: 'RAK Bank ···5512',     aed:   142_000, currency: 'AED', status: 'Failed',      initiated: '2026-04-22', arrival: '—'          },
];

// Insurance claims
export const INSURANCE_KPIS = {
  submitted:    { count: 18_420, aed: 8_412_000 },
  paid:         { count: 14_882, aed: 6_918_000 },
  avgPayDays:   22,
  rejectionRate: 9.4,
  outstanding:  { count: 3_538,  aed: 1_494_000 },
};

export const INSURANCE_TPA = [
  { name: 'Daman',       submitted: 8420, paid: 7120, rejected: 480,  pending: 820,  avgDays: 18, rejRate: 5.7,  totalAed: 3_214_000, outstandingAed: 281_000  },
  { name: 'NextCare',    submitted: 4180, paid: 3240, rejected: 640,  pending: 300,  avgDays: 24, rejRate: 15.3, totalAed: 1_824_000, outstandingAed: 392_000  },
  { name: 'Neuron',      submitted: 2840, paid: 2410, rejected: 280,  pending: 150,  avgDays: 21, rejRate: 9.9,  totalAed: 1_024_000, outstandingAed: 198_000  },
  { name: 'Mednet',      submitted: 1980, paid: 1480, rejected: 320,  pending: 180,  avgDays: 27, rejRate: 16.2, totalAed:   612_000, outstandingAed: 212_000  },
  { name: 'AXA Gulf',    submitted: 1000, paid:  632, rejected:  88,  pending: 280,  avgDays: 19, rejRate: 8.8,  totalAed:   244_000, outstandingAed: 120_000  },
];

export const REJECTION_REASONS = [
  { reason: 'Missing prior authorization',   count: 482 },
  { reason: 'Non-covered service',           count: 394 },
  { reason: 'Duplicate claim',               count: 218 },
  { reason: 'Incorrect patient ID',          count: 184 },
  { reason: 'Expired policy',               count: 142 },
  { reason: 'Exceeded benefit limit',        count: 118 },
  { reason: 'Invalid diagnosis code (ICD)', count:  98 },
  { reason: 'Late submission (>90 days)',    count:  84 },
  { reason: 'Incomplete documentation',      count:  72 },
  { reason: 'Coordination of benefits',      count:  56 },
];

// Refunds
export const REFUNDS = [
  { id: 'REF-001', txn: 'txn-8834a', workspace: 'Emirates Hospital Group', aed: 420,  reason: 'Patient cancelled', initiatedBy: 'Dr. Al Rashidi', status: 'Completed', created: '2026-04-30' },
  { id: 'REF-002', txn: 'txn-8801c', workspace: 'GreenMed Clinic',         aed: 214,  reason: 'Duplicate charge',  initiatedBy: 'Admin',           status: 'Completed', created: '2026-04-28' },
  { id: 'REF-003', txn: 'txn-8790a', workspace: 'Medcare Sharjah',         aed: 850,  reason: 'Service not rendered', initiatedBy: 'Admin',        status: 'Pending',   created: '2026-04-25' },
];

export const DISPUTES = [
  { id: 'DIS-001', txn: 'txn-8832b', workspace: 'Al Noor Polyclinic',  customer: 'L. Yusuf',     aed: 650,   reason: 'Goods/services not as described', stage: 'Chargeback',  evidenceDue: '2026-05-03', status: 'Open'   },
  { id: 'DIS-002', txn: 'txn-8801a', workspace: 'Medcare Sharjah',     customer: 'O. Khalil',    aed: 1100,  reason: 'Unrecognized charge',             stage: 'Inquiry',     evidenceDue: '2026-05-05', status: 'Open'   },
  { id: 'DIS-003', txn: 'txn-8765d', workspace: 'GreenMed Clinic',     customer: 'T. Hamdan',    aed: 420,   reason: 'Credit not processed',            stage: 'Chargeback',  evidenceDue: '2026-04-28', status: 'Lost'   },
];

// Forecast
export function genForecast(months = 12) {
  const history = [1_143_000, 1_168_000, 1_188_000, 1_198_000, 1_218_000, 1_248_000];
  const now = new Date();
  return Array.from({ length: months }, (_, i) => {
    const d = new Date(now);
    d.setMonth(d.getMonth() + i + 1);
    const label = d.toLocaleString('en', { month: 'short', year: '2-digit' });
    const base = (history[history.length - 1] ?? 1248000) * Math.pow(1.008, i + 1);
    return {
      label,
      mid: Math.round(base),
      low: Math.round(base * 0.88),
      high: Math.round(base * 1.12),
      actual: i < 0 ? Math.round(base) : null,
    };
  });
}

export const FORECAST_DATA = [
  { label: 'Nov \'25', mid: 1143000, low: 1000000, high: 1280000, actual: 1143000 },
  { label: 'Dec \'25', mid: 1168000, low: 1025000, high: 1305000, actual: 1168000 },
  { label: 'Jan \'26', mid: 1188000, low: 1044000, high: 1325000, actual: 1188000 },
  { label: 'Feb \'26', mid: 1198000, low: 1055000, high: 1340000, actual: 1198000 },
  { label: 'Mar \'26', mid: 1218000, low: 1072000, high: 1360000, actual: 1218000 },
  { label: 'Apr \'26', mid: 1248000, low: 1098000, high: 1390000, actual: 1248000 },
  { label: 'May \'26', mid: 1298000, low: 1140000, high: 1445000, actual: null },
  { label: 'Jun \'26', mid: 1352000, low: 1188000, high: 1504000, actual: null },
  { label: 'Jul \'26', mid: 1404000, low: 1234000, high: 1562000, actual: null },
  { label: 'Aug \'26', mid: 1448000, low: 1272000, high: 1612000, actual: null },
  { label: 'Sep \'26', mid: 1498000, low: 1318000, high: 1668000, actual: null },
  { label: 'Oct \'26', mid: 1558000, low: 1372000, high: 1735000, actual: null },
];

export const QUARTERLY_TARGETS = [
  { quarter: 'Q1 2026', targetAed: 3_200_000, actualAed: 3_604_000 },
  { quarter: 'Q2 2026', targetAed: 3_800_000, actualAed: 1_208_400 },
  { quarter: 'Q3 2026', targetAed: 4_200_000, actualAed: null       },
  { quarter: 'Q4 2026', targetAed: 4_800_000, actualAed: null       },
];

// Activity feed
export const REVENUE_ACTIVITY = [
  { icon: 'payment',     amount: 208000,  workspace: 'Emirates Hospital Group',  event: 'Annual subscription renewed',     ts: '2 min ago'   },
  { icon: 'invoice',     amount: 318400,  workspace: 'Daman TPA',                event: 'Invoice INV-2026-0838 paid',       ts: '14 min ago'  },
  { icon: 'payout',      amount: 1810000, workspace: 'Emirates Hospital Group',  event: 'Payout PO-2026-0214 completed',    ts: '3 hours ago' },
  { icon: 'refund',      amount: -420,    workspace: 'Emirates Hospital Group',  event: 'Refund REF-001 processed',         ts: '4 hours ago' },
  { icon: 'dispute',     amount: -650,    workspace: 'Al Noor Polyclinic',       event: 'Dispute DIS-001 opened',           ts: '5 hours ago' },
  { icon: 'churn',       amount: -74880,  workspace: 'Legacy Clinic',            event: 'Subscription cancelled',           ts: '1 day ago'   },
  { icon: 'failed',      amount: -142000, workspace: 'Medcare Sharjah',          event: 'Payout PO-2026-0210 failed',       ts: '2 days ago'  },
  { icon: 'new',         amount: 43680,   workspace: 'Wellbeing Ajman',          event: 'New Growth subscription started',  ts: '2 days ago'  },
];

// Cohort data (simplified)
export const COHORT_DATA = [
  { month: 'Jan \'25', m0: 100, m1: 94, m2: 91, m3: 89, m4: 87, m5: 86, m6: 85, m7: 84, m8: 83, m9: 82, m10: 81, m11: 80 },
  { month: 'Feb \'25', m0: 100, m1: 96, m2: 93, m3: 90, m4: 88, m5: 87, m6: 86, m7: 85, m8: 84, m9: 83, m10: 82, m11: null },
  { month: 'Mar \'25', m0: 100, m1: 95, m2: 92, m3: 89, m4: 88, m5: 86, m6: 84, m7: 83, m8: 82, m9: 81, m10: null, m11: null },
  { month: 'Apr \'25', m0: 100, m1: 93, m2: 90, m3: 87, m4: 85, m5: 84, m6: 83, m7: 82, m8: 81, m9: null, m10: null, m11: null },
  { month: 'May \'25', m0: 100, m1: 97, m2: 94, m3: 91, m4: 89, m5: 88, m6: 87, m7: 86, m8: null, m9: null, m10: null, m11: null },
  { month: 'Jun \'25', m0: 100, m1: 98, m2: 95, m3: 92, m4: 90, m5: 88, m6: 87, m7: null, m8: null, m9: null, m10: null, m11: null },
];
