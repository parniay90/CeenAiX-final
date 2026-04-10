interface DataPoint {
  date?: string;
  month?: string;
  [key: string]: any;
}

interface LineConfig {
  dataKey: string;
  color: string;
  name: string;
}

interface LineChartProps {
  data: DataPoint[];
  lines: LineConfig[];
  xAxisKey: string;
  height?: number;
  targetLine?: number;
  targetLabel?: string;
  yDomain?: [number, number];
}

export default function LineChart({
  data,
  lines,
  xAxisKey,
  height = 160,
  targetLine,
  targetLabel,
  yDomain
}: LineChartProps) {
  if (!data || data.length === 0) return null;

  const allValues = lines.flatMap(line =>
    data.map(d => d[line.dataKey]).filter(v => typeof v === 'number') as number[]
  );
  const minValue = yDomain ? yDomain[0] : Math.min(...allValues);
  const maxValue = yDomain ? yDomain[1] : Math.max(...allValues);
  const range = maxValue - minValue;

  const padding = 40;
  const chartHeight = height - padding * 2;
  const chartWidth = 100;
  const stepX = chartWidth / (data.length - 1);

  const getY = (value: number) => {
    return padding + chartHeight - ((value - minValue) / range) * chartHeight;
  };

  const targetY = targetLine ? getY(targetLine) : null;

  return (
    <div className="w-full" style={{ height }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${height}`} preserveAspectRatio="none">
        {targetY && (
          <>
            <line
              x1="0"
              y1={targetY}
              x2={chartWidth}
              y2={targetY}
              stroke="#94A3B8"
              strokeWidth="0.5"
              strokeDasharray="2,2"
            />
            {targetLabel && (
              <text x={chartWidth - 2} y={targetY - 2} fontSize="2.5" fill="#94A3B8" textAnchor="end">
                {targetLabel}
              </text>
            )}
          </>
        )}

        {lines.map((line, lineIndex) => {
          const pathData = data.map((point, i) => {
            const x = i * stepX;
            const y = getY(point[line.dataKey]);
            return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
          }).join(' ');

          return (
            <g key={lineIndex}>
              <path
                d={pathData}
                fill="none"
                stroke={line.color}
                strokeWidth="0.8"
              />
              {data.map((point, i) => (
                <circle
                  key={i}
                  cx={i * stepX}
                  cy={getY(point[line.dataKey])}
                  r="1"
                  fill={line.color}
                />
              ))}
            </g>
          );
        })}
      </svg>

      <div className="flex justify-between mt-2 px-2 text-xs text-gray-500">
        {data.map((point, i) => (
          i % Math.ceil(data.length / 5) === 0 && (
            <span key={i}>{point[xAxisKey]}</span>
          )
        ))}
      </div>

      <div className="flex gap-4 justify-center mt-3">
        {lines.map((line, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-3 h-0.5" style={{ backgroundColor: line.color }}></div>
            <span className="text-xs text-gray-600">{line.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
