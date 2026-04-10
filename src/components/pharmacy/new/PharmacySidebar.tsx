import React, { useState } from 'react';
import {
  LayoutDashboard, Pill, Package, MessageSquare, BarChart2,
  DollarSign, Building2, Settings, ChevronLeft, ChevronRight,
  ShieldCheck, AlertTriangle, LogOut, Wifi
} from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

interface PharmacySidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const PharmacySidebar: React.FC<PharmacySidebarProps> = ({ activePage, onNavigate }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const { t, isRTL } = useLanguage();

  const navSections = [
    {
      titleKey: 'pharmacy.sidebar.main',
      items: [
        { id: 'dashboard', icon: LayoutDashboard, labelKey: 'pharmacy.sidebar.dashboard', badge: '3', badgeType: 'blue' },
        { id: 'prescriptions', icon: Pill, labelKey: 'pharmacy.sidebar.prescriptions', badge: '3', badgeType: 'blue' },
        { id: 'inventory', icon: Package, labelKey: 'pharmacy.sidebar.inventory', badge: '4', badgeType: 'amber' },
        { id: 'messages', icon: MessageSquare, labelKey: 'pharmacy.sidebar.messages', badge: '1', badgeType: 'amber' },
      ],
    },
    {
      titleKey: 'pharmacy.sidebar.analytics',
      items: [
        { id: 'reports', icon: BarChart2, labelKey: 'pharmacy.sidebar.reports', badge: null, badgeType: null },
        { id: 'revenue', icon: DollarSign, labelKey: 'pharmacy.sidebar.revenue', badge: null, badgeType: null },
      ],
    },
    {
      titleKey: 'pharmacy.sidebar.account',
      items: [
        { id: 'pharmacy-profile', icon: Building2, labelKey: 'pharmacy.sidebar.myPharmacy', badge: null, badgeType: null },
        { id: 'pharmacy-settings', icon: Settings, labelKey: 'pharmacy.sidebar.settings', badge: null, badgeType: null },
      ],
    },
  ];

  const handleSignOut = () => {
    setSigningOut(true);
    setTimeout(() => {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }, 800);
  };

  return (
    <div
      className="flex flex-col h-full relative transition-all duration-300 flex-shrink-0"
      style={{ background: '#064E3B', width: collapsed ? 72 : 260 }}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={`absolute ${isRTL ? 'left-[-12px]' : 'right-[-12px]'} top-16 w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center z-10 shadow-sm hover:shadow-md transition-shadow`}
      >
        {collapsed ? (
          <ChevronRight className={`w-3 h-3 text-slate-500 ${isRTL ? 'rotate-180' : ''}`} />
        ) : (
          <ChevronLeft className={`w-3 h-3 text-slate-500 ${isRTL ? 'rotate-180' : ''}`} />
        )}
      </button>

      <div className={`flex items-center h-16 px-4 border-b flex-shrink-0 ${isRTL ? 'flex-row-reverse' : ''}`} style={{ borderColor: 'rgba(52,211,153,0.2)' }}>
        {collapsed ? (
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-lg mx-auto"
            style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}
          >
            C
          </div>
        ) : (
          <div className={isRTL ? 'text-right' : ''}>
            <div className="font-bold text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 18 }}>
              CeenAiX
            </div>
            <div className="uppercase tracking-widest" style={{ color: '#6EE7B7', fontSize: 9, fontFamily: 'DM Mono, monospace' }}>
              {t('pharmacy.portal')}
            </div>
          </div>
        )}
      </div>

      {!collapsed && (
        <div
          className="mx-3 my-3 rounded-xl p-3 flex-shrink-0"
          style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(52,211,153,0.25)' }}
        >
          <div className={`font-bold text-white ${isRTL ? 'text-right' : ''}`} style={{ fontSize: 13, fontFamily: 'Inter, sans-serif' }}>
            Al Shifa Pharmacy
          </div>
          <div style={{ color: '#A7F3D0', fontSize: 11, fontFamily: 'Inter, sans-serif' }}>
            الشفاء للصيدلة
          </div>
          <div style={{ color: '#6EE7B7', fontSize: 10, marginTop: 2 }}>
            Al Barsha · DHA Licensed ✅
          </div>
          <div className="border-t mt-2 pt-2" style={{ borderColor: 'rgba(52,211,153,0.2)' }}>
            <div className={isRTL ? 'text-right' : ''} style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, fontFamily: 'Inter, sans-serif' }}>
              Rania Hassan | Head Pharmacist
            </div>
            <div className={`flex items-center gap-1.5 mt-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span style={{ color: '#6EE7B7', fontSize: 10 }}>{t('pharmacy.activeShift')}</span>
              <Wifi className={`w-3 h-3 ${isRTL ? 'mr-auto' : 'ml-auto'}`} style={{ color: '#6EE7B7' }} />
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto py-2" style={{ scrollbarWidth: 'none' }}>
        {navSections.map(section => (
          <div key={section.titleKey} className="mb-2">
            {!collapsed && (
              <div
                className={`px-4 py-1 uppercase tracking-widest ${isRTL ? 'text-right' : ''}`}
                style={{ color: 'rgba(52,211,153,0.5)', fontSize: 9, fontFamily: 'DM Mono, monospace' }}
              >
                {t(section.titleKey)}
              </div>
            )}
            {section.items.map(item => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className="w-full flex items-center transition-all duration-150 relative"
                  style={{
                    height: 44,
                    padding: collapsed ? '0 14px' : '0 16px',
                    justifyContent: collapsed ? 'center' : (isRTL ? 'flex-end' : 'flex-start'),
                    flexDirection: isRTL && !collapsed ? 'row-reverse' : 'row',
                    background: isActive ? 'rgba(16,185,129,0.25)' : 'transparent',
                    borderLeft: !isRTL && isActive ? '3px solid #34D399' : (!isRTL ? '3px solid transparent' : 'none'),
                    borderRight: isRTL && isActive ? '3px solid #34D399' : (isRTL ? '3px solid transparent' : 'none'),
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  <Icon
                    className="flex-shrink-0"
                    style={{
                      width: 18, height: 18,
                      color: isActive ? '#34D399' : 'rgba(255,255,255,0.6)',
                    }}
                  />
                  {!collapsed && (
                    <>
                      <span
                        className={`${isRTL ? 'mr-3 text-right' : 'ml-3 text-left'} flex-1`}
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: 13,
                          fontWeight: isActive ? 600 : 400,
                          color: isActive ? '#fff' : 'rgba(255,255,255,0.75)',
                        }}
                      >
                        {t(item.labelKey)}
                      </span>
                      {item.badge && (
                        <span
                          className="text-white font-bold rounded-full flex items-center justify-center"
                          style={{
                            minWidth: 18, height: 18, fontSize: 10,
                            padding: '0 5px',
                            background: item.badgeType === 'blue' ? '#3B82F6' : '#F59E0B',
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {collapsed && item.badge && (
                    <span
                      className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ fontSize: 9, background: item.badgeType === 'blue' ? '#3B82F6' : '#F59E0B' }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {!collapsed && (
        <div
          className="mx-3 mb-2 rounded-xl p-3 flex-shrink-0"
          style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(52,211,153,0.15)' }}
        >
          <div className={isRTL ? 'text-right' : ''} style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11, fontFamily: 'Inter, sans-serif', lineHeight: 1.7 }}>
            <div>12 prescriptions today</div>
            <div style={{ color: '#6EE7B7', fontSize: 10 }}>8 dispensed · 3 in queue · 1 on hold</div>
            <div style={{ color: '#34D399', fontSize: 10, fontFamily: 'DM Mono, monospace' }}>AED 1,847 today</div>
          </div>
          <div
            className={`flex items-center gap-1.5 mt-2 rounded-lg px-2 py-1 ${isRTL ? 'flex-row-reverse' : ''}`}
            style={{ background: 'rgba(245,158,11,0.2)' }}
          >
            <AlertTriangle className="w-3 h-3 flex-shrink-0" style={{ color: '#FCD34D' }} />
            <span style={{ color: '#FCD34D', fontSize: 10, fontFamily: 'DM Mono, monospace' }}>
              4 {t('pharmacy.stockAlerts')}
            </span>
          </div>
        </div>
      )}

      {!collapsed && (
        <div
          className={`mx-3 mb-3 flex items-center gap-2 rounded-lg px-3 py-2 flex-shrink-0 ${isRTL ? 'flex-row-reverse' : ''}`}
          style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(52,211,153,0.15)' }}
        >
          <ShieldCheck className="w-4 h-4 flex-shrink-0" style={{ color: '#34D399' }} />
          <div className={isRTL ? 'text-right' : ''}>
            <div style={{ color: '#34D399', fontSize: 10, fontFamily: 'DM Mono, monospace' }}>DHA COMPLIANT ✅</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9 }}>DHA-PHARM-2019-003481</div>
          </div>
        </div>
      )}

      <button
        onClick={handleSignOut}
        className="flex items-center w-full transition-colors flex-shrink-0"
        style={{
          height: 48,
          padding: collapsed ? '0 14px' : '0 16px',
          justifyContent: collapsed ? 'center' : (isRTL ? 'flex-end' : 'flex-start'),
          flexDirection: isRTL && !collapsed ? 'row-reverse' : 'row',
          borderTop: '1px solid rgba(52,211,153,0.15)',
          color: 'rgba(255,255,255,0.4)',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#FCA5A5'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
      >
        <LogOut className="w-4 h-4 flex-shrink-0" />
        {!collapsed && (
          <span className={`${isRTL ? 'mr-3' : 'ml-3'}`} style={{ fontSize: 13, fontFamily: 'Inter, sans-serif' }}>
            {signingOut ? t('pharmacy.signingOut') : t('nav.signOut')}
          </span>
        )}
      </button>
    </div>
  );
};

export default PharmacySidebar;
