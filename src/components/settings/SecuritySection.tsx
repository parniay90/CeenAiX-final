import { useState } from 'react';
import { Lock, Smartphone, Monitor, LogOut, CheckCircle, QrCode, Key } from 'lucide-react';
import { MOCK_ACTIVE_SESSIONS, MOCK_LOGIN_HISTORY } from '../../types/settings';
import { format } from 'date-fns';

export default function SecuritySection() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorMethod, setTwoFactorMethod] = useState<'sms' | 'authenticator'>('sms');
  const [showQRCode, setShowQRCode] = useState(false);
  const [activeSessions] = useState(MOCK_ACTIVE_SESSIONS);
  const [loginHistory] = useState(MOCK_LOGIN_HISTORY);

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile':
        return <Smartphone className="w-5 h-5 text-teal-400" />;
      default:
        return <Monitor className="w-5 h-5 text-teal-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5 text-teal-400" />
          <h3 className="text-lg font-bold text-white">Change Password</h3>
        </div>
        <p className="text-sm text-slate-400 mb-4">
          Update your password regularly to keep your account secure.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Current Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">New Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Confirm New Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-teal-500"
            />
          </div>
          <button className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition-colors">
            Update Password
          </button>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Key className="w-5 h-5 text-teal-400" />
              <h3 className="text-lg font-bold text-white">Two-Factor Authentication</h3>
            </div>
            <p className="text-sm text-slate-400">
              Add an extra layer of security to your account. You'll need to enter a code from your phone when signing in.
            </p>
          </div>
          <button
            onClick={() => {
              setTwoFactorEnabled(!twoFactorEnabled);
              if (!twoFactorEnabled && twoFactorMethod === 'authenticator') {
                setShowQRCode(true);
              }
            }}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              twoFactorEnabled ? 'bg-teal-600' : 'bg-slate-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {twoFactorEnabled && (
          <div className="space-y-4 pt-4 border-t border-slate-700">
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-3">Authentication Method</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setTwoFactorMethod('sms')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    twoFactorMethod === 'sms'
                      ? 'border-teal-600 bg-teal-600 bg-opacity-10'
                      : 'border-slate-600 bg-slate-700 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Smartphone className="w-5 h-5 text-white" />
                    {twoFactorMethod === 'sms' && <CheckCircle className="w-5 h-5 text-teal-400" />}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-white mb-1">SMS</div>
                    <p className="text-xs text-slate-400">Receive codes via text message</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setTwoFactorMethod('authenticator');
                    setShowQRCode(true);
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    twoFactorMethod === 'authenticator'
                      ? 'border-teal-600 bg-teal-600 bg-opacity-10'
                      : 'border-slate-600 bg-slate-700 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <QrCode className="w-5 h-5 text-white" />
                    {twoFactorMethod === 'authenticator' && <CheckCircle className="w-5 h-5 text-teal-400" />}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-white mb-1">Authenticator App</div>
                    <p className="text-xs text-slate-400">Use Google Authenticator or similar</p>
                  </div>
                </button>
              </div>
            </div>

            {twoFactorMethod === 'sms' && (
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Phone Number</label>
                <input
                  type="tel"
                  defaultValue="+971 50 123 4567"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-teal-500"
                />
              </div>
            )}

            {twoFactorMethod === 'authenticator' && showQRCode && (
              <div className="p-4 bg-slate-700 rounded-lg">
                <p className="text-sm font-bold text-white mb-3">Scan this QR code with your authenticator app:</p>
                <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center mx-auto mb-3">
                  <QrCode className="w-32 h-32 text-slate-900" />
                </div>
                <p className="text-xs text-slate-400 text-center mb-3">
                  Or enter this code manually: <span className="font-mono text-white">ABCD-1234-EFGH-5678</span>
                </p>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Enter verification code:</label>
                  <input
                    type="text"
                    placeholder="000000"
                    className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white text-center text-2xl tracking-widest focus:outline-none focus:border-teal-500"
                    maxLength={6}
                  />
                </div>
              </div>
            )}

            <div className="p-4 bg-blue-900 bg-opacity-20 border border-blue-600 rounded-lg">
              <p className="text-xs text-blue-200">
                <span className="font-bold">Backup Codes:</span> After enabling 2FA, you'll receive backup codes that can be used if you lose access to your authentication method. Store them securely.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Monitor className="w-5 h-5 text-teal-400" />
            <h3 className="text-lg font-bold text-white">Active Sessions</h3>
          </div>
          <button className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-lg transition-colors">
            Logout All Devices
          </button>
        </div>
        <p className="text-sm text-slate-400 mb-4">
          Manage devices where you're currently logged in. You can log out remotely if you don't recognize a device.
        </p>

        <div className="space-y-3">
          {activeSessions.map((session) => (
            <div key={session.id} className="flex items-start justify-between p-4 bg-slate-700 rounded-lg">
              <div className="flex items-start gap-3 flex-1">
                {getDeviceIcon(session.deviceType)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-white">{session.deviceName}</span>
                    {session.isCurrent && (
                      <span className="px-2 py-0.5 bg-teal-600 text-white text-xs font-bold rounded">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400">{session.location}</div>
                  <div className="text-xs text-slate-500 font-mono">IP: {session.ipAddress}</div>
                  <div className="text-xs text-slate-500">
                    Last active: {format(session.lastActive, 'MMM d, yyyy h:mm a')}
                  </div>
                </div>
              </div>
              {!session.isCurrent && (
                <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-600 hover:bg-rose-600 text-white text-sm font-bold rounded-lg transition-colors">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="w-5 h-5 text-teal-400" />
          <h3 className="text-lg font-bold text-white">Login History</h3>
        </div>
        <p className="text-sm text-slate-400 mb-4">
          Review your recent login activity. Report any suspicious activity immediately.
        </p>

        <div className="overflow-hidden rounded-lg border border-slate-700">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase">Date & Time</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase">Device</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase">Location</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {loginHistory.map((login) => (
                <tr key={login.id} className="hover:bg-slate-700 transition-colors">
                  <td className="px-4 py-3 text-sm text-white">
                    {format(login.timestamp, 'MMM d, yyyy h:mm a')}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300">{login.deviceName}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{login.location}</td>
                  <td className="px-4 py-3">
                    {login.success ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-900 bg-opacity-20 text-green-400 text-xs font-bold rounded">
                        <CheckCircle className="w-3 h-3" />
                        Success
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-rose-900 bg-opacity-20 text-rose-400 text-xs font-bold rounded">
                        Failed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
