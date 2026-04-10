import React, { useState, useEffect } from 'react';
import { ClipboardList, FileText, Zap, AlertTriangle, Clock, Users } from 'lucide-react';

interface KpiCardProps {
  icon: React.ReactNode;
  iconBg: string;
  value: string;
  valueColor: string;
  label: string;
  sub1: string;
  sub2?: string;
  sub2Color?: string;
  pulse?: boolean;
  delay: number;
}

const KpiCard: React.FC<KpiCardProps> = ({
  icon, iconBg, value, valueColor, label, sub1, sub2, sub2Color, pulse, delay,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className={`bg-white rounded-2xl p-4 flex flex-col gap-3 transition-all duration-500 hover:scale-105 hover:shadow-lg cursor-pointer ${
        pulse ? 'ring-2 ring-amber-400/50 animate-pulse' : ''
      } ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.07)', borderRadius: 16, transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0`} style={{ background: iconBg }}>
          {icon}
        </div>
        <span
          className="font-bold leading-none"
          style={{ fontFamily: 'DM Mono, monospace', fontSize: 28, color: valueColor }}
        >
          {value}
        </span>
      </div>
      <div>
        <p className="uppercase tracking-wider text-slate-400 font-semibold leading-tight" style={{ fontSize: 10 }}>
          {label}
        </p>
        <p className="text-slate-500 mt-1 leading-tight" style={{ fontSize: 11 }}>{sub1}</p>
        {sub2 && (
          <p className="mt-0.5 font-medium leading-tight" style={{ fontSize: 11, color: sub2Color ?? '#059669' }}>
            {sub2}
          </p>
        )}
      </div>
    </div>
  );
};

const KpiStrip: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      <KpiCard
        icon={<ClipboardList size={18} className="text-amber-600" />}
        iconBg="#FEF3C7"
        value="16"
        valueColor="#D97706"
        label="Pending Pre-Authorizations"
        sub1="8 urgent (4h) · 8 standard"
        pulse
        delay={150}
      />
      <KpiCard
        icon={<FileText size={18} className="text-blue-600" />}
        iconBg="#DBEAFE"
        value="312"
        valueColor="#1E293B"
        label="Claims Submitted Today"
        sub1="AED 1,247,840 total value"
        sub2="78.2% auto-approved"
        sub2Color="#059669"
        delay={180}
      />
      <KpiCard
        icon={<Zap size={18} className="text-emerald-600" />}
        iconBg="#D1FAE5"
        value="78.2%"
        valueColor="#059669"
        label="AI Auto-Approval Rate"
        sub1="244 of 312 claims today"
        sub2="↑ +2.1% vs last week"
        sub2Color="#059669"
        delay={210}
      />
      <KpiCard
        icon={<AlertTriangle size={18} className="text-red-600" />}
        iconBg="#FEE2E2"
        value="5"
        valueColor="#DC2626"
        label="Active Fraud Alerts"
        sub1="2 HIGH risk · 3 medium"
        pulse
        delay={240}
      />
      <KpiCard
        icon={<Clock size={18} className="text-teal-600" />}
        iconBg="#CCFBF1"
        value="4.2h"
        valueColor="#0D9488"
        label="Avg Processing Time"
        sub1="DHA target: 8h standard ✅"
        sub2="4h urgent ⚠ (1 breach today)"
        sub2Color="#D97706"
        delay={270}
      />
      <KpiCard
        icon={<Users size={18} className="text-blue-600" />}
        iconBg="#DBEAFE"
        value="8,247"
        valueColor="#2563EB"
        label="Active Members on CeenAiX"
        sub1="Gold 2,847 · Silver 3,104"
        sub2="Basic 1,892 · Thiqa 404"
        sub2Color="#64748B"
        delay={300}
      />
    </div>
  );
};

export default KpiStrip;
