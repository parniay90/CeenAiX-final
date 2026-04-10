import React, { useState } from 'react';
import { Plus, Download, Bell, ChevronLeft, ChevronRight, Calendar, CalendarCheck, TrendingUp, UserX } from 'lucide-react';
import DoctorSidebarNew from '../components/doctor/DoctorSidebarNew';
import WeekCalendar from '../components/appointments/WeekCalendar';
import PendingRequestCard from '../components/appointments/PendingRequestCard';
import AppointmentDetailPanel from '../components/appointments/AppointmentDetailPanel';
import { CalendarAppointment, AppointmentRequest, DaySchedule, TabMode, ViewMode } from '../types/doctorAppointments';

const DoctorAppointments: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<TabMode>('calendar');
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [selectedAppointment, setSelectedAppointment] = useState<CalendarAppointment | null>(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);

  const mockWeekSchedule: DaySchedule[] = [
    {
      date: '5 April',
      dayName: 'Sunday',
      isToday: false,
      isPast: true,
      isWeekend: false,
      appointments: [
        {
          id: 'APT-S1',
          date: '5 April 2026',
          time: '9:00',
          duration: 30,
          patient: { id: 'PT-001', name: 'Mohammed Al Rasheed', initials: 'MR', age: 58, gender: 'M', insurance: 'Daman Gold' },
          type: 'follow_up',
          status: 'completed',
          fee: 400,
          currency: 'AED',
          collected: true
        },
        {
          id: 'APT-S2',
          date: '5 April 2026',
          time: '10:00',
          duration: 30,
          patient: { id: 'PT-002', name: 'Layla Al Suwaidi', initials: 'LS', age: 42, gender: 'F', insurance: 'ADNIC' },
          type: 'follow_up',
          status: 'completed',
          fee: 400,
          currency: 'AED',
          collected: true
        },
        {
          id: 'APT-S3',
          date: '5 April 2026',
          time: '11:00',
          duration: 30,
          patient: { id: 'PT-003', name: 'Hassan Ibrahim', initials: 'HI', age: 62, gender: 'M', insurance: 'Thiqa' },
          type: 'annual_check',
          status: 'completed',
          fee: 400,
          currency: 'AED',
          collected: true
        },
        {
          id: 'APT-S4',
          date: '5 April 2026',
          time: '14:00',
          duration: 30,
          patient: { id: 'PT-004', name: 'Sarah Al Hamdan', initials: 'SH', age: 35, gender: 'F', insurance: 'AXA Gulf' },
          type: 'new_patient',
          status: 'completed',
          fee: 400,
          currency: 'AED',
          collected: true
        }
      ],
      availableSlots: [],
      stats: { total: 4, completed: 4, upcoming: 0, cancelled: 0, revenue: 1600, revenueCollected: 1600 }
    },
    {
      date: '6 April',
      dayName: 'Monday',
      isToday: false,
      isPast: true,
      isWeekend: false,
      appointments: [
        {
          id: 'APT-M1',
          date: '6 April 2026',
          time: '9:00',
          duration: 30,
          patient: { id: 'PT-005', name: 'Omar Hassan Khalifa', initials: 'OH', age: 55, gender: 'M', insurance: 'Daman Basic' },
          type: 'follow_up',
          status: 'completed',
          fee: 400,
          currency: 'AED',
          collected: true
        },
        {
          id: 'APT-M2',
          date: '6 April 2026',
          time: '10:00',
          duration: 30,
          patient: { id: 'PT-006', name: 'Nadia Al Rashidi', initials: 'NR', age: 48, gender: 'F', insurance: 'ADNIC' },
          type: 'follow_up',
          status: 'completed',
          fee: 400,
          currency: 'AED',
          collected: true
        },
        {
          id: 'APT-M3',
          date: '6 April 2026',
          time: '11:30',
          duration: 30,
          patient: { id: 'PT-007', name: 'Ahmed Bin Zayed', initials: 'AZ', age: 44, gender: 'M', insurance: 'Daman Gold' },
          type: 'new_patient',
          status: 'completed',
          fee: 400,
          currency: 'AED',
          collected: true
        },
        {
          id: 'APT-M4',
          date: '6 April 2026',
          time: '14:00',
          duration: 30,
          patient: { id: 'PT-008', name: 'Rashida Yousuf', initials: 'RY', age: 51, gender: 'F', insurance: 'AXA Gulf' },
          type: 'follow_up',
          status: 'completed',
          fee: 400,
          currency: 'AED',
          collected: true
        },
        {
          id: 'APT-M5',
          date: '6 April 2026',
          time: '15:30',
          duration: 30,
          patient: { id: 'PT-009', name: 'Mahmoud Siddiq', initials: 'MS', age: 39, gender: 'M', insurance: 'Daman Basic' },
          type: 'new_patient',
          status: 'completed',
          fee: 400,
          currency: 'AED',
          collected: true,
          referredBy: 'Dr. Sarah Al Khateeb'
        }
      ],
      availableSlots: [],
      stats: { total: 5, completed: 5, upcoming: 0, cancelled: 0, revenue: 2000, revenueCollected: 2000 }
    },
    {
      date: '7',
      dayName: 'Tuesday',
      isToday: true,
      isPast: false,
      isWeekend: false,
      appointments: [
        {
          id: 'APT-T1',
          date: '7 April 2026',
          time: '9:00',
          duration: 22,
          patient: { id: 'PT-010', name: 'Khalid Hassan Abdullah', initials: 'KH', age: 54, gender: 'M', insurance: 'ADNIC Standard' },
          type: 'follow_up',
          status: 'completed',
          chiefComplaint: 'Routine hypertension check',
          fee: 400,
          currency: 'AED',
          collected: true
        },
        {
          id: 'APT-T2',
          date: '7 April 2026',
          time: '9:30',
          duration: 28,
          patient: { id: 'PT-011', name: 'Parnia Yazdkhasti', initials: 'PY', age: 38, gender: 'F', insurance: 'Daman Gold', allergies: ['Penicillin (SEVERE)'] },
          type: 'follow_up',
          status: 'completed',
          chiefComplaint: 'Post-MRI results discussion',
          fee: 400,
          currency: 'AED',
          collected: true
        },
        {
          id: 'APT-T3',
          date: '7 April 2026',
          time: '10:00',
          duration: 35,
          patient: { id: 'PT-012', name: 'Mohammed Rashid Al Shamsi', initials: 'MS', age: 48, gender: 'M', insurance: 'Daman Basic' },
          type: 'new_patient',
          status: 'completed',
          chiefComplaint: 'Exertional chest tightness for 3 weeks',
          fee: 400,
          currency: 'AED',
          collected: true
        },
        {
          id: 'APT-T4',
          date: '7 April 2026',
          time: '10:45',
          duration: 20,
          patient: { id: 'PT-013', name: 'Fatima Bint Rashid', initials: 'FB', age: 65, gender: 'F', insurance: 'Thiqa', allergies: ['Aspirin (mild GI)'] },
          type: 'follow_up',
          status: 'completed',
          chiefComplaint: 'Review echocardiogram results',
          fee: 400,
          currency: 'AED',
          collected: true
        },
        {
          id: 'APT-T5',
          date: '7 April 2026',
          time: '11:30',
          duration: 15,
          patient: { id: 'PT-014', name: 'Abdullah Hassan Al Zaabi', initials: 'AH', age: 62, gender: 'M', insurance: 'Daman Gold' },
          type: 'emergency',
          status: 'completed',
          chiefComplaint: 'Acute chest pain + sweating (walk-in)',
          fee: 400,
          currency: 'AED',
          collected: true
        },
        {
          id: 'APT-T6',
          date: '7 April 2026',
          time: '14:00',
          duration: 30,
          patient: { id: 'PT-015', name: 'Aisha Mohammed Al Reem', initials: 'AM', age: 42, gender: 'F', insurance: 'AXA Gulf' },
          type: 'follow_up',
          status: 'in_progress',
          chiefComplaint: 'Increased shortness of breath',
          fee: 400,
          currency: 'AED',
          collected: false
        },
        {
          id: 'APT-T7',
          date: '7 April 2026',
          time: '14:45',
          duration: 20,
          patient: { id: 'PT-016', name: 'Saeed Rashid Al Mansoori', initials: 'SM', age: 58, gender: 'M', insurance: 'Oman Insurance' },
          type: 'post_procedure',
          status: 'checked_in',
          chiefComplaint: 'Post-PCI 3-month follow-up',
          room: 'Room 2',
          fee: 400,
          currency: 'AED',
          collected: false
        },
        {
          id: 'APT-T8',
          date: '7 April 2026',
          time: '15:30',
          duration: 30,
          patient: { id: 'PT-017', name: 'Noura Bint Khalid', initials: 'NB', age: 34, gender: 'F', insurance: 'Daman Basic' },
          type: 'new_patient',
          status: 'confirmed',
          chiefComplaint: 'Intermittent palpitations for 6 weeks',
          fee: 400,
          currency: 'AED',
          collected: false
        }
      ],
      availableSlots: [],
      stats: { total: 8, completed: 5, upcoming: 3, cancelled: 0, revenue: 3200, revenueCollected: 2400 }
    },
    {
      date: '8 April',
      dayName: 'Wednesday',
      isToday: false,
      isPast: false,
      isWeekend: false,
      appointments: [
        {
          id: 'APT-W1',
          date: '8 April 2026',
          time: '9:00',
          duration: 45,
          patient: { id: 'PT-012', name: 'Mohammed Al Shamsi', initials: 'MS', age: 48, gender: 'M', insurance: 'Daman Basic' },
          type: 'post_procedure',
          status: 'confirmed',
          chiefComplaint: 'Stress Echo follow-up',
          fee: 600,
          currency: 'AED',
          collected: false
        },
        {
          id: 'APT-W2',
          date: '8 April 2026',
          time: '10:00',
          duration: 20,
          patient: { id: 'PT-018', name: 'Ibrahim Al Mansoori', initials: 'IM', age: 60, gender: 'M', insurance: 'Daman Gold' },
          type: 'follow_up',
          status: 'confirmed',
          fee: 400,
          currency: 'AED',
          collected: false
        },
        {
          id: 'APT-W3',
          date: '8 April 2026',
          time: '11:30',
          duration: 30,
          patient: { id: 'PT-019', name: 'Hessa Bint Ahmed', initials: 'HB', age: 29, gender: 'F', insurance: 'AXA Gulf' },
          type: 'new_patient',
          status: 'confirmed',
          chiefComplaint: 'New palpitations',
          fee: 400,
          currency: 'AED',
          collected: false
        },
        {
          id: 'APT-W4',
          date: '8 April 2026',
          time: '14:00',
          duration: 30,
          patient: { id: 'PT-020', name: 'Tariq Al Suwaidi', initials: 'TS', age: 52, gender: 'M', insurance: 'ADNIC' },
          type: 'post_procedure',
          status: 'confirmed',
          chiefComplaint: 'Post-MI 6 months',
          fee: 400,
          currency: 'AED',
          collected: false
        },
        {
          id: 'APT-W5',
          date: '8 April 2026',
          time: '15:00',
          duration: 20,
          patient: { id: 'PT-021', name: 'Fatima Al Blooshi', initials: 'FB', age: 45, gender: 'F', insurance: 'Daman Gold' },
          type: 'teleconsultation',
          status: 'confirmed',
          fee: 300,
          currency: 'AED',
          collected: false
        }
      ],
      availableSlots: [],
      stats: { total: 5, completed: 0, upcoming: 5, cancelled: 0, revenue: 2100, revenueCollected: 0 }
    },
    {
      date: '9 April',
      dayName: 'Thursday',
      isToday: false,
      isPast: false,
      isWeekend: false,
      appointments: [
        {
          id: 'APT-TH1',
          date: '9 April 2026',
          time: '9:00',
          duration: 30,
          patient: { id: 'PT-022', name: 'Yousuf Al Mazrouei', initials: 'YM', age: 66, gender: 'M', insurance: 'Thiqa' },
          type: 'follow_up',
          status: 'confirmed',
          fee: 400,
          currency: 'AED',
          collected: false
        },
        {
          id: 'APT-TH2',
          date: '9 April 2026',
          time: '11:00',
          duration: 30,
          patient: { id: 'PT-023', name: 'Maryam Hassan', initials: 'MH', age: 58, gender: 'F', insurance: 'Daman Gold' },
          type: 'annual_check',
          status: 'confirmed',
          fee: 400,
          currency: 'AED',
          collected: false
        },
        {
          id: 'APT-TH3',
          date: '9 April 2026',
          time: '14:00',
          duration: 30,
          patient: { id: 'PT-024', name: 'Ali Bin Khalid', initials: 'AK', age: 41, gender: 'M', insurance: 'ADNIC' },
          type: 'new_patient',
          status: 'confirmed',
          chiefComplaint: 'Chest pain (new)',
          fee: 400,
          currency: 'AED',
          collected: false
        }
      ],
      availableSlots: [],
      stats: { total: 3, completed: 0, upcoming: 3, cancelled: 0, revenue: 1200, revenueCollected: 0 }
    }
  ];

  const mockPendingRequests: AppointmentRequest[] = [
    {
      id: 'REQ-001',
      type: 'new_patient',
      patient: {
        id: 'PT-NEW-001',
        name: 'Khalil Ibrahim Al Zaabi',
        initials: 'KI',
        age: 47,
        gender: 'M',
        insurance: 'Daman Basic'
      },
      preferredDate: 'Apr 9',
      preferredTime: 'Any morning',
      reason: 'Chest tightness on and off for 2 weeks, worse on exertion',
      urgency: 'moderate',
      requestedDate: 'Today 1:47 PM',
      requestedBy: 'patient',
      aiTriage: {
        suggestedPriority: 'high',
        reasoning: 'Based on symptoms (exertional chest tightness, 2 weeks), this requires cardiac evaluation. Recommended priority: HIGH — book within 3 days.',
        suggestedPreOrders: ['ECG', 'Resting Troponin']
      },
      status: 'pending'
    },
    {
      id: 'REQ-002',
      type: 'referral',
      patient: {
        id: 'PT-NEW-002',
        name: 'Mariam Al Hashimi',
        initials: 'MH',
        age: 55,
        gender: 'F',
        insurance: 'ADNIC Gold'
      },
      preferredDate: 'Apr 13 or 14',
      reason: 'HCM query — asymmetric LVH on echo',
      urgency: 'high',
      requestedDate: 'Today 10:30 AM',
      requestedBy: 'colleague',
      referringDoctor: {
        name: 'Dr. Sarah Al Khateeb',
        specialty: 'Cardiology',
        clinicalNotes: '55F with exertional dyspnea and palpitations. Echo shows asymmetric LVH (IVS 16mm). Query HCM vs hypertensive LVH. Please see within 2 weeks.'
      },
      aiTriage: {
        suggestedPriority: 'high',
        reasoning: 'IVS 16mm with exertional symptoms — HCM probability is moderate. Recommend booking within 10 days.',
        suggestedPreOrders: ['12-lead ECG', 'Echo review', 'Holter Monitor']
      },
      status: 'pending'
    },
    {
      id: 'REQ-003',
      type: 'reschedule',
      patient: {
        id: 'PT-025',
        name: 'Faisal Al Muhairi',
        initials: 'FM',
        age: 62,
        gender: 'M',
        insurance: 'Daman Gold',
        totalVisits: 12,
        lastVisit: 'October 2025'
      },
      preferredDate: 'Any day this week or next',
      reason: '6-month HTN + CAD follow-up overdue',
      urgency: 'routine',
      requestedDate: '7 April 10:15 AM',
      requestedBy: 'patient',
      originalAppointment: {
        id: 'APT-CANC-001',
        date: '5 April 2026',
        time: '3:00 PM',
        cancellationReason: 'Patient emergency'
      },
      status: 'pending'
    }
  ];

  const handleAppointmentClick = (appointment: CalendarAppointment) => {
    setSelectedAppointment(appointment);
    setShowDetailPanel(true);
  };

  const handleSlotClick = (date: string, time: string) => {
    console.log('Booking new appointment:', date, time);
  };

  const handleApproveRequest = (requestId: string, slot: { date: string; time: string }) => {
    console.log('Approving request:', requestId, slot);
  };

  const handleDeclineRequest = (requestId: string) => {
    console.log('Declining request:', requestId);
  };

  return (
    <div className="h-screen flex bg-slate-50 overflow-hidden">
      <DoctorSidebarNew
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        activeTab="appointments"
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-[22px] font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Appointments
              </h1>
              <p className="text-[13px] text-slate-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                Al Noor Medical Center — Cardiology Suite
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="bg-teal-600 hover:bg-teal-700 text-white rounded-lg px-4 py-2.5 text-[13px] font-bold flex items-center gap-2 transition-colors">
                <Plus className="w-4 h-4" />
                New Appointment
              </button>
              <button className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg px-4 py-2.5 text-[13px] font-bold flex items-center gap-2 transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button className="relative bg-amber-500 hover:bg-amber-600 text-white rounded-lg px-4 py-2.5 text-[13px] font-bold flex items-center gap-2 transition-colors">
                <Bell className="w-4 h-4" />
                Requests ({mockPendingRequests.length})
              </button>
            </div>
          </div>
        </div>

        {mockPendingRequests.length > 0 && (
          <div className="bg-amber-50 border-y-2 border-amber-400 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-amber-600" />
              <span className="text-[14px] font-bold text-amber-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                {mockPendingRequests.length} appointment requests need your review
              </span>
              <div className="flex gap-2 ml-4">
                {mockPendingRequests.slice(0, 3).map(req => (
                  <span key={req.id} className="px-2.5 py-1 bg-amber-200 text-amber-800 rounded-full text-[11px] font-bold">
                    {req.patient.name.split(' ')[0]} — {req.preferredDate || 'pending'}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => setActiveTab('pending')}
              className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg px-4 py-2 text-[12px] font-bold transition-colors"
            >
              Review All Requests →
            </button>
          </div>
        )}

        <div className="flex-1 overflow-auto p-6 space-y-5">
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-white rounded-xl p-5 border border-slate-200 hover:scale-105 transition-transform cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                  <CalendarCheck className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <div className="text-[30px] font-bold text-slate-900 font-mono leading-none" style={{ fontFamily: 'DM Mono, monospace' }}>
                    8
                  </div>
                  <div className="text-[11px] text-slate-400 uppercase font-semibold tracking-wide">Today's Appointments</div>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 mb-2">
                5 done · 1 active · 2 upcoming
              </div>
              <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500" style={{ width: '62.5%' }} />
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 hover:scale-105 transition-transform cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-[30px] font-bold text-slate-900 font-mono leading-none">
                    31
                  </div>
                  <div className="text-[11px] text-slate-400 uppercase font-semibold tracking-wide">This Week</div>
                </div>
              </div>
              <div className="text-[11px] text-slate-500">
                23 done · 8 remaining
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border-2 border-amber-200 hover:scale-105 transition-transform cursor-pointer animate-pulse">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <Bell className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <div className="text-[30px] font-bold text-amber-600 font-mono leading-none">
                    {mockPendingRequests.length}
                  </div>
                  <div className="text-[11px] text-slate-400 uppercase font-semibold tracking-wide">Pending Requests</div>
                </div>
              </div>
              <div className="text-[11px] text-slate-500">
                1 new · 1 referral · 1 reschedule
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 hover:scale-105 transition-transform cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <UserX className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <div className="text-[30px] font-bold text-red-500 font-mono leading-none">
                    2
                  </div>
                  <div className="text-[11px] text-slate-400 uppercase font-semibold tracking-wide">No-Shows This Month</div>
                </div>
              </div>
              <div className="text-[11px] text-emerald-600">
                6.5% rate · Below avg ✓
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 hover:scale-105 transition-transform cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <div className="text-[24px] font-bold text-emerald-600 font-mono leading-none">
                    AED 10,400
                  </div>
                  <div className="text-[11px] text-slate-400 uppercase font-semibold tracking-wide">Week Revenue</div>
                </div>
              </div>
              <div className="text-[11px] text-slate-500">
                AED 2,400 remaining today
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <ChevronLeft className="w-5 h-5 text-slate-400" />
                </button>
                <h2 className="text-[16px] font-bold text-slate-800" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Week of Apr 5 – 9, 2026
                </h2>
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </button>
                <button className="px-3 py-1.5 bg-teal-50 text-teal-700 rounded-lg text-[12px] font-bold">
                  Today
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex bg-white border border-slate-200 rounded-lg p-0.5">
                  <button
                    onClick={() => setViewMode('day')}
                    className={`px-3 py-1.5 rounded text-[12px] font-bold transition-colors ${
                      viewMode === 'day' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    📅 Day
                  </button>
                  <button
                    onClick={() => setViewMode('week')}
                    className={`px-3 py-1.5 rounded text-[12px] font-bold transition-colors ${
                      viewMode === 'week' ? 'bg-teal-600 text-white' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    📆 Week ●
                  </button>
                  <button
                    onClick={() => setViewMode('month')}
                    className={`px-3 py-1.5 rounded text-[12px] font-bold transition-colors ${
                      viewMode === 'month' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    📅 Month
                  </button>
                </div>
              </div>
            </div>

            <div className="flex border-b border-slate-200 mb-4">
              <button
                onClick={() => setActiveTab('calendar')}
                className={`px-4 py-3 text-[13px] font-bold transition-colors relative ${
                  activeTab === 'calendar'
                    ? 'text-teal-600'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                📅 Calendar
                {activeTab === 'calendar' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('list')}
                className={`px-4 py-3 text-[13px] font-bold transition-colors relative ${
                  activeTab === 'list'
                    ? 'text-teal-600'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                📋 List View
                {activeTab === 'list' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-4 py-3 text-[13px] font-bold transition-colors relative ${
                  activeTab === 'pending'
                    ? 'text-teal-600'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                ⏰ Pending ({mockPendingRequests.length})
                {activeTab === 'pending' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-3 text-[13px] font-bold transition-colors relative ${
                  activeTab === 'analytics'
                    ? 'text-teal-600'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                📊 Analytics
                {activeTab === 'analytics' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />
                )}
              </button>
            </div>

            {activeTab === 'calendar' && (
              <WeekCalendar
                week={mockWeekSchedule}
                onAppointmentClick={handleAppointmentClick}
                onSlotClick={handleSlotClick}
              />
            )}

            {activeTab === 'pending' && (
              <div className="space-y-4">
                <div className="mb-4">
                  <h3 className="text-[16px] font-bold text-slate-900 mb-1">Pending Appointment Requests</h3>
                  <p className="text-[13px] text-slate-500">{mockPendingRequests.length} requests need your review</p>
                </div>
                {mockPendingRequests.map(request => (
                  <PendingRequestCard
                    key={request.id}
                    request={request}
                    onApprove={handleApproveRequest}
                    onDecline={handleDeclineRequest}
                  />
                ))}
              </div>
            )}

            {activeTab === 'list' && (
              <div className="text-center py-12 text-slate-400">
                📋 List view coming soon
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="text-center py-12 text-slate-400">
                📊 Analytics view coming soon
              </div>
            )}
          </div>
        </div>
      </div>

      <AppointmentDetailPanel
        appointment={selectedAppointment}
        isOpen={showDetailPanel}
        onClose={() => setShowDetailPanel(false)}
        onReschedule={() => console.log('Reschedule')}
        onCancel={() => console.log('Cancel')}
      />
    </div>
  );
};

export default DoctorAppointments;
