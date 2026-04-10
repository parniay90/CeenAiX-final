export default function HealthPatternBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-10">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="health-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path
              d="M 50 10 Q 55 20, 50 30 Q 45 20, 50 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-teal-300"
            >
              <animate
                attributeName="opacity"
                values="0.3;1;0.3"
                dur="3s"
                repeatCount="indefinite"
              />
            </path>
            <circle cx="20" cy="50" r="2" fill="currentColor" className="text-teal-400">
              <animate
                attributeName="r"
                values="2;4;2"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="80" cy="70" r="2" fill="currentColor" className="text-teal-400">
              <animate
                attributeName="r"
                values="2;4;2"
                dur="2.5s"
                repeatCount="indefinite"
              />
            </circle>
            <path
              d="M 10 80 L 30 75 L 50 82 L 70 78 L 90 80"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-teal-300"
            >
              <animate
                attributeName="stroke-dasharray"
                values="0,200;200,200"
                dur="4s"
                repeatCount="indefinite"
              />
            </path>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#health-pattern)" />
      </svg>

      <div className="absolute top-1/4 left-1/4 w-64 h-64">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 100 40 Q 120 60, 100 80 Q 80 60, 100 40 M 100 80 Q 120 100, 100 120 Q 80 100, 100 80 M 100 120 Q 120 140, 100 160 Q 80 140, 100 120"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-teal-400"
          >
            <animate
              attributeName="stroke-dasharray"
              values="0,400;400,400"
              dur="6s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      </div>

      <div className="absolute bottom-1/4 right-1/4 w-48 h-48">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <g>
            <line x1="50" y1="20" x2="50" y2="80" stroke="currentColor" strokeWidth="2" className="text-teal-300" />
            <line x1="30" y1="50" x2="70" y2="50" stroke="currentColor" strokeWidth="2" className="text-teal-300" />
            <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-teal-400">
              <animate
                attributeName="r"
                values="20;28;20"
                dur="3s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="1;0.3;1"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        </svg>
      </div>
    </div>
  );
}
