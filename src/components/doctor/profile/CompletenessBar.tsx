import React, { useEffect, useState } from 'react';

const CompletenessBar: React.FC = () => {
  const [width, setWidth] = useState(0);
  useEffect(() => { setTimeout(() => setWidth(89), 200); }, []);

  return (
    <div className="bg-white rounded-xl px-6 py-3 mb-4 flex items-center space-x-4 shadow-sm">
      <span className="text-[13px] text-slate-600 flex-shrink-0" style={{ fontFamily: 'Inter, sans-serif' }}>
        Profile Complete:
      </span>
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-teal-500 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${width}%` }}
        />
      </div>
      <div className="flex-shrink-0 flex flex-col items-end">
        <span className="text-[14px] font-bold text-teal-600" style={{ fontFamily: 'DM Mono, monospace' }}>89%</span>
        <span className="text-[11px] text-teal-500 italic" style={{ fontFamily: 'Inter, sans-serif' }}>
          + Add Arabic bio to reach 92%
        </span>
      </div>
    </div>
  );
};

export default CompletenessBar;
