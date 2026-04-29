import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { MOCK_APPOINTMENTS, MOCK_PAST_APPOINTMENTS } from '../../types/appointments';

export interface AppointmentFilters {
  status: string;
  type: string;
  specialty: string;
  provider: string;
  dateFrom: string;
  dateTo: string;
  selectedCalendarDate: string; // new — tracks clicked calendar date
}

interface FilterPanelProps {
  onFilterChange: (filters: AppointmentFilters) => void;
  // live appointments passed from parent so newly booked ones show dots too
  upcomingAppointments?: typeof MOCK_APPOINTMENTS;
}

const UPCOMING_APPOINTMENTS = MOCK_APPOINTMENTS;
const PAST_APPOINTMENTS = MOCK_PAST_APPOINTMENTS;
const ALL_APPOINTMENTS = [...UPCOMING_APPOINTMENTS, ...PAST_APPOINTMENTS];

const SPECIALTIES = ['All', ...Array.from(new Set(ALL_APPOINTMENTS.map(a => a.specialty))).sort()];
const PROVIDERS = ['All', ...Array.from(new Set(ALL_APPOINTMENTS.map(a => a.doctorName))).sort()];

const toKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export default function FilterPanel({ onFilterChange, upcomingAppointments }: FilterPanelProps) {
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [selectedProvider, setSelectedProvider] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState('');

  const statuses = ['All', 'Confirmed', 'Awaiting Confirmation', 'Completed', 'Cancelled'];
  const types = ['All', 'In-Person', 'Teleconsult'];

  // Use live upcoming appointments if passed from parent (includes newly booked)
  const liveUpcoming = upcomingAppointments ?? UPCOMING_APPOINTMENTS;
  const allLive = [...liveUpcoming, ...PAST_APPOINTMENTS];

  // Build dot maps — upcoming = teal, past = violet
  const upcomingDayKeys = new Set(
    liveUpcoming.map(a => toKey(new Date(a.date)))
  );
  const pastDayKeys = new Set(
    PAST_APPOINTMENTS.map(a => toKey(new Date(a.date)))
  );

  useEffect(() => {
    onFilterChange({
      status: selectedStatus,
      type: selectedType,
      specialty: selectedSpecialty,
      provider: selectedProvider,
      dateFrom,
      dateTo,
      selectedCalendarDate,
    });
  }, [selectedStatus, selectedType, selectedSpecialty, selectedProvider, dateFrom, dateTo, selectedCalendarDate]);

  const hasActiveFilters =
    selectedStatus !== 'All' ||
    selectedType !== 'All' ||
    selectedSpecialty !== 'All' ||
    selectedProvider !== 'All' ||
    dateFrom !== '' ||
    dateTo !== '' ||
    selectedCalendarDate !== '';

  const clearAll = () => {
    setSelectedStatus('All');
    setSelectedType('All');
    setSelectedSpecialty('All');
    setSelectedProvider('All');
    setDateFrom('');
    setDateTo('');
    setSelectedCalendarDate('');
  };

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const handleDayClick = (day: number) => {
    const clicked = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const key = toKey(clicked);
    // Toggle off if clicking the same day
    setSelectedCalendarDate(prev => prev === key ? '' : key);
  };

  return (
    <div className="w-[280px] bg-white border-r border-gray-200 p-6 space-y-6 overflow-y-auto flex-shrink-0">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-xs text-teal-600 font-semibold hover:text-teal-700 transition-colors"
          >
            <X className="w-3 h-3" />
            Clear all
          </button>
        )}
      </div>

      {/* Status */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 text-sm">Status</h3>
        <div className="space-y-1.5">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === status
                  ? 'bg-teal-50 text-teal-700 border border-teal-200'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Type */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 text-sm">Type</h3>
        <div className="space-y-1.5">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedType === type
                  ? 'bg-teal-50 text-teal-700 border border-teal-200'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Specialty */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 text-sm">Specialty</h3>
        <div className="space-y-1.5">
          {SPECIALTIES.map((specialty) => (
            <button
              key={specialty}
              onClick={() => setSelectedSpecialty(specialty)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedSpecialty === specialty
                  ? 'bg-teal-50 text-teal-700 border border-teal-200'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {specialty}
            </button>
          ))}
        </div>
      </div>

      {/* Provider */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 text-sm">Provider</h3>
        <div className="space-y-1.5">
          {PROVIDERS.map((provider) => (
            <button
              key={provider}
              onClick={() => setSelectedProvider(provider)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedProvider === provider
                  ? 'bg-teal-50 text-teal-700 border border-teal-200'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {provider === 'All' ? 'All Providers' : provider}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 text-sm flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Calendar
        </h3>

        {/* Legend */}
        <div className="flex items-center gap-4 mb-2 px-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-teal-500" />
            <span className="text-xs text-gray-500">Upcoming</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-violet-400" />
            <span className="text-xs text-gray-500">Past</span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <span className="text-sm font-semibold text-gray-900">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <div key={i} className="text-xs font-medium text-gray-500 mb-1">{day}</div>
            ))}

            {/* Empty cells */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {/* Day cells */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
              const key = toKey(dateObj);

              const isUpcoming = upcomingDayKeys.has(key);
              const isPast = pastDayKeys.has(key);
              const isSelected = selectedCalendarDate === key;
              const isToday =
                day === new Date().getDate() &&
                currentMonth.getMonth() === new Date().getMonth() &&
                currentMonth.getFullYear() === new Date().getFullYear();

              return (
                <button
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={`relative w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-teal-600 text-white'
                      : isToday
                      ? 'bg-teal-100 text-teal-700 font-bold'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {day}
                  {/* Dots row below the day number */}
                  <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                    {isUpcoming && (
                      <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-teal-500'}`} />
                    )}
                    {isPast && (
                      <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white/70' : 'bg-violet-400'}`} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected date label */}
        {selectedCalendarDate && (
          <div className="mt-2 flex items-center justify-between px-1">
            <p className="text-xs text-teal-600 font-medium">
              Showing: {new Date(selectedCalendarDate + 'T00:00:00').toLocaleDateString('en-AE', { weekday: 'short', day: 'numeric', month: 'short' })}
            </p>
            <button
              onClick={() => setSelectedCalendarDate('')}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Date Range */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 text-sm">Date Range</h3>
        <div className="space-y-2">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">To</label>
            <input
              type="date"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}