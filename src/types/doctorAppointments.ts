export type AppointmentType =
  | 'follow_up'
  | 'new_patient'
  | 'post_procedure'
  | 'annual_check'
  | 'teleconsultation'
  | 'walk_in'
  | 'urgent'
  | 'emergency';

export type AppointmentStatus =
  | 'confirmed'
  | 'pending'
  | 'completed'
  | 'cancelled'
  | 'no_show'
  | 'rescheduled'
  | 'checked_in'
  | 'in_progress';

export interface AppointmentPatient {
  id: string;
  name: string;
  initials: string;
  age: number;
  gender: 'M' | 'F';
  emiratesId?: string;
  insurance: string;
  policyNumber?: string;
  lastVisit?: string;
  totalVisits?: number;
  allergies?: string[];
  conditions?: string[];
}

export interface CalendarAppointment {
  id: string;
  date: string;
  time: string;
  endTime?: string;
  duration: number;

  patient: AppointmentPatient;

  type: AppointmentType;
  status: AppointmentStatus;

  chiefComplaint?: string;
  visitReason?: string;

  room?: string;

  fee: number;
  currency: string;
  insuranceCoverage?: number;
  copay?: number;
  collected?: boolean;

  bookedBy?: 'patient' | 'doctor' | 'admin' | 'referral';
  bookedDate?: string;

  referredBy?: string;

  preAuthRequired?: boolean;
  preAuthStatus?: 'approved' | 'pending' | 'denied' | 'not_required';

  cancellationReason?: string;
  cancelledDate?: string;
  advanceNotice?: number;

  notes?: string;

  clinicalFlags?: Array<{
    type: 'allergy' | 'lab_pending' | 'critical' | 'follow_up_needed';
    text: string;
  }>;
}

export interface AppointmentRequest {
  id: string;
  type: 'new_patient' | 'referral' | 'reschedule';

  patient: AppointmentPatient;

  preferredDate?: string;
  preferredTime?: string;
  alternativeDates?: string[];

  reason: string;
  urgency: 'routine' | 'moderate' | 'high' | 'urgent';

  requestedDate: string;
  requestedBy: 'patient' | 'colleague' | 'admin';

  referringDoctor?: {
    name: string;
    specialty: string;
    clinicalNotes?: string;
  };

  originalAppointment?: {
    id: string;
    date: string;
    time: string;
    cancellationReason: string;
  };

  aiTriage?: {
    suggestedPriority: 'routine' | 'high' | 'urgent';
    reasoning: string;
    suggestedPreOrders?: string[];
  };

  status: 'pending' | 'approved' | 'declined';
}

export interface TimeSlot {
  time: string;
  available: boolean;
  duration: number;
  appointmentId?: string;
}

export interface DaySchedule {
  date: string;
  dayName: string;
  isToday: boolean;
  isPast: boolean;
  isWeekend: boolean;

  appointments: CalendarAppointment[];
  availableSlots: TimeSlot[];

  stats: {
    total: number;
    completed: number;
    upcoming: number;
    cancelled: number;
    revenue: number;
    revenueCollected: number;
  };
}

export interface WeekSchedule {
  weekStart: string;
  weekEnd: string;
  days: DaySchedule[];

  weekStats: {
    totalAppointments: number;
    completedAppointments: number;
    revenue: number;
    revenueCollected: number;
    utilizationRate: number;
    noShowCount: number;
    noShowRate: number;
  };
}

export interface AppointmentAnalytics {
  utilizationRate: number;
  noShowRate: number;
  avgDuration: number;
  avgRevenuePerSlot: number;

  appointmentsByType: Array<{
    type: AppointmentType;
    count: number;
    percentage: number;
  }>;

  dailyAppointments: Array<{
    date: string;
    count: number;
    revenue: number;
  }>;

  weeklyRevenue: Array<{
    week: string;
    revenue: number;
  }>;
}

export interface WorkingHours {
  day: 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
  enabled: boolean;
  startTime: string;
  endTime: string;
}

export interface AppointmentSettings {
  workingHours: WorkingHours[];
  lunchBreak: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
  defaultDuration: number;
  typeDurations: Record<AppointmentType, number>;
  advanceNoticeRequired: number;
  maxBookingsPerDay: number;
  autoConfirm: boolean;
  newPatientsAllowed: boolean;
  walkInsAccepted: boolean;
  fees: {
    inPerson: number;
    teleconsult: number;
    newPatientSurcharge: number;
  };
  reminders: {
    twentyFourHour: boolean;
    twoHour: boolean;
  };
}

export type ViewMode = 'day' | 'week' | 'month';
export type TabMode = 'calendar' | 'list' | 'pending' | 'analytics' | 'settings';
