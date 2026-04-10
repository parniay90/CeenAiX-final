import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import SettingsCard from '../SettingsCard';
import SettingsRow from '../SettingsRow';
import SectionDivider from '../SectionDivider';
import SimpleModal from '../SimpleModal';

interface NotificationsSectionProps {
  showToast: (msg: string, type?: 'success' | 'warning') => void;
}

const NotificationsSection: React.FC<NotificationsSectionProps> = ({ showToast }) => {
  const [allNotifs, setAllNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailDigest, setEmailDigest] = useState('Daily');
  const [criticalModal, setCriticalModal] = useState(false);
  const [criticalDelivery, setCriticalDelivery] = useState('Push + SMS + In-app');
  const [apptReminder, setApptReminder] = useState('30 minutes before start');
  const [newBooking, setNewBooking] = useState(true);
  const [msgNotifs, setMsgNotifs] = useState(true);
  const [labNotifs, setLabNotifs] = useState(true);
  const [insuranceNotifs, setInsuranceNotifs] = useState(true);
  const [quietHours, setQuietHours] = useState('10:00 PM – 7:00 AM');
  const [sound, setSound] = useState(true);
  const [emailModal, setEmailModal] = useState(false);
  const [apptModal, setApptModal] = useState(false);
  const [quietModal, setQuietModal] = useState(false);

  const emailOptions = ['Real-time', 'Daily', 'Weekly', 'Off'];
  const apptOptions = ['15 min', '30 min', '1 hour', 'Off'];

  return (
    <>
      <SettingsCard id="notifications" title="Notifications" icon={Bell} iconBg="bg-blue-100" iconColor="text-blue-600">
        <div className="mx-6 mt-4 mb-2 p-3 bg-blue-50 rounded-xl">
          <p className="text-[12px] text-blue-700" style={{ fontFamily: 'Inter, sans-serif' }}>
            For more detailed configuration, see <button className="font-semibold underline">My Profile → Notification Preferences</button>
          </p>
        </div>

        <SettingsRow
          label="All Notifications"
          description={allNotifs ? undefined : 'DHA requires critical lab value alerts to remain enabled'}
          type="toggle"
          toggleValue={allNotifs}
          onToggle={(v) => {
            setAllNotifs(v);
            if (!v) showToast('⚠️ Critical clinical alerts remain active regardless', 'warning');
            else showToast('✅ All notifications enabled');
          }}
        />
        <SettingsRow
          label="App Push Notifications"
          description="Always on for critical clinical alerts"
          type="toggle"
          toggleValue={pushNotifs}
          onToggle={(v) => { setPushNotifs(v); showToast(`✅ Push notifications ${v ? 'enabled' : 'disabled'}`); }}
        />
        <SettingsRow
          label="SMS Clinical Alerts"
          description="Critical results to +971 50 ●●● ●●●●"
          type="toggle"
          toggleValue={smsAlerts}
          onToggle={(v) => { setSmsAlerts(v); showToast(`✅ SMS alerts ${v ? 'enabled' : 'disabled'}`); }}
        />
        <SettingsRow
          label="Email Summary"
          description="How often to receive email digest"
          type="value"
          value={emailDigest}
          onValueClick={() => setEmailModal(true)}
        />

        <SectionDivider label="CLINICAL ALERT SETTINGS" />

        <SettingsRow
          label="Critical Lab Result Alerts"
          description="Immediate alert when a critical result requires acknowledgment"
          type="toggle"
          toggleValue={true}
          toggleDisabled={true}
          toggleBadge="DHA Required"
          onToggle={() => setCriticalModal(true)}
        />
        <SettingsRow
          label="Critical Alert Delivery"
          description="How you receive critical result notifications"
          type="value"
          value={criticalDelivery}
          onValueClick={() => setCriticalDelivery('Push + SMS + In-app')}
        />
        <SettingsRow
          label="Appointment Reminders"
          description="Reminder before your first patient"
          type="value"
          value={apptReminder}
          onValueClick={() => setApptModal(true)}
        />
        <SettingsRow
          label="New Appointment Booked"
          description="Alert when a patient books via portal"
          type="toggle"
          toggleValue={newBooking}
          onToggle={(v) => { setNewBooking(v); showToast(`✅ New booking alerts ${v ? 'on' : 'off'}`); }}
        />
        <SettingsRow
          label="New Message Alerts"
          type="toggle"
          toggleValue={msgNotifs}
          onToggle={(v) => { setMsgNotifs(v); showToast(`✅ Message notifications ${v ? 'on' : 'off'}`); }}
        />
        <SettingsRow
          label="Lab Result Ready"
          description="Alert when a pending lab result comes in"
          type="toggle"
          toggleValue={labNotifs}
          onToggle={(v) => { setLabNotifs(v); showToast(`✅ Lab result notifications ${v ? 'on' : 'off'}`); }}
        />
        <SettingsRow
          label="Insurance Claim Status"
          description="Alert when a claim is approved or rejected"
          type="toggle"
          toggleValue={insuranceNotifs}
          onToggle={(v) => { setInsuranceNotifs(v); showToast(`✅ Insurance notifications ${v ? 'on' : 'off'}`); }}
        />

        <SectionDivider label="QUIET HOURS" />

        <SettingsRow
          label="Quiet Hours"
          description="Pause non-urgent notifications (critical alerts always come through)"
          type="value"
          value={quietHours}
          onValueClick={() => setQuietModal(true)}
        />
        <SettingsRow
          label="Notification Sound"
          type="toggle"
          toggleValue={sound}
          onToggle={(v) => { setSound(v); showToast(`✅ Sound ${v ? 'on' : 'off'}`); }}
          last
        />
      </SettingsCard>

      {criticalModal && (
        <SimpleModal title="Critical Lab Alerts" onClose={() => setCriticalModal(false)}>
          <div className="p-4 bg-red-50 rounded-xl mb-4">
            <p className="text-[14px] font-semibold text-red-800 mb-1">This alert cannot be disabled</p>
            <p className="text-[13px] text-red-700">UAE DHA requires doctors to acknowledge critical lab values within 1 hour. This notification is mandatory for compliance.</p>
          </div>
          <button
            onClick={() => setCriticalModal(false)}
            className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-medium transition-colors"
          >
            OK, I understand
          </button>
        </SimpleModal>
      )}

      {emailModal && (
        <SimpleModal title="Email Summary Frequency" onClose={() => setEmailModal(false)}>
          <div className="space-y-2">
            {emailOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => { setEmailDigest(opt); setEmailModal(false); showToast(`✅ Email digest set to ${opt}`); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl border transition-colors ${
                  emailDigest === opt ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${emailDigest === opt ? 'border-teal-500 bg-teal-500' : 'border-slate-300'}`} />
                <span className="text-[14px]" style={{ fontFamily: 'Inter, sans-serif' }}>{opt}</span>
              </button>
            ))}
          </div>
        </SimpleModal>
      )}

      {apptModal && (
        <SimpleModal title="Appointment Reminder" onClose={() => setApptModal(false)}>
          <div className="space-y-2">
            {apptOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => { setApptReminder(`${opt} before start`); setApptModal(false); showToast(`✅ Reminder set to ${opt} before`); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl border transition-colors ${
                  apptReminder.startsWith(opt) ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${apptReminder.startsWith(opt) ? 'border-teal-500 bg-teal-500' : 'border-slate-300'}`} />
                <span className="text-[14px]" style={{ fontFamily: 'Inter, sans-serif' }}>{opt} before start</span>
              </button>
            ))}
          </div>
        </SimpleModal>
      )}

      {quietModal && (
        <SimpleModal title="Quiet Hours" onClose={() => setQuietModal(false)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[12px] text-slate-500 mb-1 block">From</label>
                <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-[14px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option>10:00 PM</option>
                  <option>9:00 PM</option>
                  <option>11:00 PM</option>
                </select>
              </div>
              <div>
                <label className="text-[12px] text-slate-500 mb-1 block">To</label>
                <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-[14px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option>7:00 AM</option>
                  <option>6:00 AM</option>
                  <option>8:00 AM</option>
                </select>
              </div>
            </div>
            <div className="p-3 bg-red-50 rounded-xl">
              <p className="text-[12px] text-red-700">Critical clinical alerts override quiet hours</p>
            </div>
            <button
              onClick={() => { setQuietModal(false); showToast('✅ Quiet hours updated'); }}
              className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-medium transition-colors"
            >
              Save Quiet Hours
            </button>
          </div>
        </SimpleModal>
      )}
    </>
  );
};

export default NotificationsSection;
