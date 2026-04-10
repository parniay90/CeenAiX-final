import React from 'react';
import { Video as LucideIcon } from 'lucide-react';

interface SettingsCardProps {
  id: string;
  title: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  children: React.ReactNode;
  description?: string;
}

const SettingsCard: React.FC<SettingsCardProps> = ({
  id,
  title,
  icon: Icon,
  iconBg,
  iconColor,
  children,
  description,
}) => {
  return (
    <div id={id} className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4 scroll-mt-24">
      <div className="flex items-center px-6 py-5 border-b border-slate-100">
        <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center mr-3 flex-shrink-0`}>
          <Icon className={`w-4.5 h-4.5 ${iconColor}`} style={{ width: 18, height: 18 }} />
        </div>
        <div>
          <h2 className="text-[17px] font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            {title}
          </h2>
          {description && (
            <p className="text-[12px] text-slate-400 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
              {description}
            </p>
          )}
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default SettingsCard;
