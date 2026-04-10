interface DataPoint {
  month?: string;
  date?: string;
  value?: number;
  [key: string]: any;
}

interface AreaChartProps {
  data: DataPoint[];
  dataKey: string;
  xAxisKey: string;
  height?: number;
  color?: string;
  targetLine?: number;
  targetLabel?: string;
  yDomain?: [number, number];
}

export default function AreaChart({
  data,
  dataKey,
  xAxisKey,
  height = 200,
  color = '#10B981',
  targetLine,
  targetLabel,
  yDomain
}: AreaChartProps) {
  if (!data || data.length === 0) return null;

  const values = data.map(d => d[dataKey]).filter(v => typeof v === 'number') as number[];
  const minValue = yDomain ? yDomain[0] : Math.min(...values);
  const maxValue = yDomain ? yDomain[1] : Math.max(...values);
  const range = maxValue - minValue;

  const padding = 40;
  const chartHeight = height - padding * 2;
  const chartWidth = 100;
  const stepX = chartWidth / (data.length - 1);

  const getY = (value: number) => {
    return padding + chartHeight - ((value - minValue) / range) * chartHeight;
  };

  const pathData = data.map((point, i) => {
    const x = i * stepX;
    const y = getY(point[dataKey]);
    return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
  }).join(' ');

  const areaPath = `${pathData} L ${chartWidth} ${padding + chartHeight} L 0 ${padding + chartHeight} Z`;

  const targetY = targetLine ? getY(targetLine) : null;

  return (
    <div className="w-full" style={{ height }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {targetY && (
          <>
            <line
              x1="0"
              y1={targetY}
              x2={chartWidth}
              y2={targetY}
              stroke="#059669"
              strokeWidth="0.5"
              strokeDasharray="2,2"
            />
            {targetLabel && (
              <text x={chartWidth - 2} y={targetY - 2} fontSize="3" fill="#059669" textAnchor="end">
                {targetLabel}
              </text>
            )}
          </>
        )}

        <path
          d={areaPath}
          fill="url(#areaGradient)"
        />

        <path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="0.8"
        />

        {data.map((point, i) => (
          <circle
            key={i}
            cx={i * stepX}
            cy={getY(point[dataKey])}
            r="1"
            fill={color}
          />
        ))}
      </svg>

      <div className="flex justify-between mt-2 px-2 text-xs text-gray-500">
        {data.map((point, i) => (
          i % Math.ceil(data.length / 6) === 0 && (
            <span key={i}>{point[xAxisKey]}</span>
          )
        ))}
      </div>
    </div>
  );
}
