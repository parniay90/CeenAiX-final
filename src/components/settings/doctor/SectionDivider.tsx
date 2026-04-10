import React from 'react';

interface SectionDividerProps {
  label: string;
}

const SectionDivider: React.FC<SectionDividerProps> = ({ label }) => {
  return (
    <div className="px-6 pt-5 pb-2 border-b border-slate-50">
      <p
        className="text-[11px] uppercase tracking-widest font-semibold text-slate-400"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {label}
      </p>
    </div>
  );
};

export default SectionDivider;
