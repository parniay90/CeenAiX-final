import React, { useState } from 'react';
import { LayoutDashboard } from 'lucide-react';
import SettingsCard from '../SettingsCard';
import SettingsRow from '../SettingsRow';
import SectionDivider from '../SectionDivider';

interface DashboardSectionProps {
  showToast: (msg: string, type?: 'success' | 'warning') => void;
}

const DashboardSection: React.FC<DashboardSectionProps> = ({ showToast }) => {
  const [kpiCards, setKpiCards] = useState(true);
  const [todayQueue, setTodayQueue] = useState(true);
  const [labAlerts, setLabAlerts] = useState(true);
  const [messages, setMessages] = useState(true);
  const [revenueCharts, setRevenueCharts] = useState(true);
  const [aiInsights, setAiInsights] = useState(true);
  const [quickActionsStrip, setQuickActionsStrip] = useState(true);
  const [recentPatients, setRecentPatients] = useState(true);
  const [showRevenue, setShowRevenue] = useState(true);
  const [patientCount, setPatientCount] = useState(true);

  const toggle = (setter: (v: boolean) => void, label: string) => (v: boolean) => {
    setter(v);
    showToast(`✅ ${label} ${v ? 'shown' : 'hidden'}`);
  };

  return (
    <SettingsCard id="dashboard" title="Dashboard" icon={LayoutDashboard} iconBg="bg-emerald-100" iconColor="text-emerald-600">
      <SettingsRow
        label="Critical Alert Banner"
        description="Shows urgent clinical alerts at top of dashboard"
        type="toggle"
        toggleValue={true}
        toggleDisabled={true}
        toggleBadge="Always On"
        onToggle={() => {}}
      />
      <SettingsRow
        label="Consultation Workspace Card"
        description="Active consultation hero CTA"
        type="toggle"
        toggleValue={true}
        toggleDisabled={true}
        toggleBadge="📌 Pinned"
        onToggle={() => {}}
      />
      <SettingsRow
        label="KPI Summary Cards"
        description="Appointments, prescriptions, revenue, DHA status"
        type="toggle"
        toggleValue={kpiCards}
        onToggle={toggle(setKpiCards, 'KPI Cards')}
      />
      <SettingsRow
        label="Today's Appointment Queue"
        description="Current day's patient schedule"
        type="toggle"
        toggleValue={todayQueue}
        onToggle={toggle(setTodayQueue, "Today's Queue")}
      />
      <SettingsRow
        label="Lab Alerts Widget"
        description="Pending critical and abnormal lab results"
        type="toggle"
        toggleValue={labAlerts}
        onToggle={toggle(setLabAlerts, 'Lab Alerts Widget')}
      />
      <SettingsRow
        label="Messages Preview"
        description="Unread messages from patients and colleagues"
        type="toggle"
        toggleValue={messages}
        onToggle={toggle(setMessages, 'Messages Preview')}
      />
      <SettingsRow
        label="Revenue Charts"
        description="Daily and monthly earnings trend charts"
        type="toggle"
        toggleValue={revenueCharts}
        onToggle={toggle(setRevenueCharts, 'Revenue Charts')}
      />
      <SettingsRow
        label="AI Clinical Insights"
        description="Pattern detection and clinical recommendations"
        type="toggle"
        toggleValue={aiInsights}
        onToggle={toggle(setAiInsights, 'AI Insights')}
      />
      <SettingsRow
        label="Quick Actions Strip"
        description="Write Rx, Order Lab, Block Time, etc."
        type="toggle"
        toggleValue={quickActionsStrip}
        onToggle={toggle(setQuickActionsStrip, 'Quick Actions Strip')}
      />
      <SettingsRow
        label="Recent Patients Card"
        description="Quick access to today's patients"
        type="toggle"
        toggleValue={recentPatients}
        onToggle={toggle(setRecentPatients, 'Recent Patients')}
      />

      <SectionDivider label="DASHBOARD DISPLAY" />

      <SettingsRow
        label="Show Revenue on Dashboard"
        description="Display revenue amounts on appointment list"
        type="toggle"
        toggleValue={showRevenue}
        onToggle={toggle(setShowRevenue, 'Revenue display')}
      />
      <SettingsRow
        label="Show Patient Count Badges"
        description="Show pending counts on sidebar nav items"
        type="toggle"
        toggleValue={patientCount}
        onToggle={toggle(setPatientCount, 'Count badges')}
        last
      />
    </SettingsCard>
  );
};

export default DashboardSection;
