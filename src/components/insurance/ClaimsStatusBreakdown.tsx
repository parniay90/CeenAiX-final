import { MOCK_CLAIMS_SUMMARY } from '../../types/insurance';

export default function ClaimsStatusBreakdown() {
  const claims = MOCK_CLAIMS_SUMMARY;
  const total = claims.approved + claims.pending + claims.denied + claims.appealed;

  const segments = [
    { label: 'Approved', value: claims.approved, color: '#10b981', percent: (claims.approved / total) * 100 },
    { label: 'Pending', value: claims.pending, color: '#f59e0b', percent: (claims.pending / total) * 100 },
    { label: 'Denied', value: claims.denied, color: '#ef4444', percent: (claims.denied / total) * 100 },
    { label: 'Appealed', value: claims.appealed, color: '#8b5cf6', percent: (claims.appealed / total) * 100 },
  ];

  let cumulativePercent = 0;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
      <h2 className="text-sm font-bold text-white uppercase mb-4">Claims Status Breakdown</h2>

      <div className="flex items-center justify-center mb-4">
        <svg width="160" height="160" viewBox="0 0 160 160">
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="#1e293b"
            strokeWidth="20"
          />
          {segments.map((segment, idx) => {
            const startAngle = (cumulativePercent / 100) * 360;
            const endAngle = ((cumulativePercent + segment.percent) / 100) * 360;
            cumulativePercent += segment.percent;

            const startRad = (startAngle - 90) * (Math.PI / 180);
            const endRad = (endAngle - 90) * (Math.PI / 180);

            const x1 = 80 + 70 * Math.cos(startRad);
            const y1 = 80 + 70 * Math.sin(startRad);
            const x2 = 80 + 70 * Math.cos(endRad);
            const y2 = 80 + 70 * Math.sin(endRad);

            const largeArc = segment.percent > 50 ? 1 : 0;

            return (
              <path
                key={idx}
                d={`M 80 80 L ${x1} ${y1} A 70 70 0 ${largeArc} 1 ${x2} ${y2} Z`}
                fill={segment.color}
                opacity="0.9"
              />
            );
          })}
          <circle cx="80" cy="80" r="50" fill="#0f172a" />
          <text
            x="80"
            y="75"
            textAnchor="middle"
            className="text-2xl font-bold fill-white"
          >
            {total}
          </text>
          <text
            x="80"
            y="90"
            textAnchor="middle"
            className="text-xs fill-slate-400"
          >
            Total Claims
          </text>
        </svg>
      </div>

      <div className="space-y-2">
        {segments.map((segment) => (
          <div key={segment.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: segment.color }}
              ></div>
              <span className="text-sm text-slate-300">{segment.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">{segment.value}</span>
              <span className="text-xs text-slate-500">({Math.round(segment.percent)}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
