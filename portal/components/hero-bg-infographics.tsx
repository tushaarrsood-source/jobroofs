'use client';

export function HeroBgInfographics() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-0 overflow-hidden select-none"
    >
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <defs>
          {/* Whisper-delicate architectural dot grid (64px spacing, 0.12 opacity) */}
          <pattern
            id="arch-grid-pattern"
            width="64"
            height="64"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="0.6" fill="#7e8a84" fillOpacity="0.16" />
          </pattern>
        </defs>

        {/* Faint Architectural Dot Grid */}
        <rect width="100%" height="100%" fill="url(#arch-grid-pattern)" />

        {/* Vertical Reference Hairlines (very subtle) */}
        <line
          x1="8%"
          y1="0"
          x2="8%"
          y2="100%"
          stroke="#d8ded9"
          strokeWidth="0.75"
          strokeDasharray="3 9"
          strokeOpacity="0.4"
        />
        <line
          x1="92%"
          y1="0"
          x2="92%"
          y2="100%"
          stroke="#d8ded9"
          strokeWidth="0.75"
          strokeDasharray="3 9"
          strokeOpacity="0.4"
        />

        {/* Top Right Coordinate & Compass Drafting Group */}
        <g className="hidden md:block">
          {/* Subtle concentric drafting rings in the upper right quadrant */}
          <circle
            cx="92%"
            cy="14%"
            r="80"
            stroke="#d8ded9"
            strokeWidth="0.6"
            strokeDasharray="3 6"
            strokeOpacity="0.45"
          />
          <circle
            cx="92%"
            cy="14%"
            r="45"
            stroke="#d8ded9"
            strokeWidth="0.6"
            strokeOpacity="0.3"
          />
          {/* Crosshair at ring center */}
          <path
            d="M -6 0 L 6 0 M 0 -6 L 0 6"
            stroke="#7e8a84"
            strokeWidth="0.8"
            strokeOpacity="0.6"
            transform="translate(92%, 14%)"
          />
          <text
            x="84%"
            y="9%"
            fill="#7e8a84"
            fontSize="8"
            letterSpacing="0.18em"
            fontFamily="'Outfit', sans-serif"
            fillOpacity="0.7"
          >
            GRID: 10115 &middot; DIRECT
          </text>
        </g>

        {/* Architectural Elevation & Coordinate Callout (Top Left) */}
        <g
          transform="translate(16, 20)"
          className="hidden sm:block"
        >
          <path
            d="M -5 0 L 5 0 M 0 -5 L 0 5"
            stroke="#7e8a84"
            strokeWidth="0.8"
            strokeOpacity="0.6"
            transform="translate(10, 10)"
          />
          <text
            x="24"
            y="7"
            fill="#7e8a84"
            fontSize="8"
            letterSpacing="0.2em"
            fontFamily="'Outfit', sans-serif"
            fillOpacity="0.75"
            fontWeight="500"
          >
            SYS.REF // BERLIN-KIEZ-CORRIDOR
          </text>
          <text
            x="24"
            y="17"
            fill="#7e8a84"
            fontSize="7.5"
            letterSpacing="0.14em"
            fontFamily="monospace"
            fillOpacity="0.55"
          >
            52°31'12"N 13°24'18"E &middot; ELEV 34M
          </text>
        </g>

        {/* Lower Left Corner Alignment Crosshair */}
        <g className="hidden sm:block">
          <path
            d="M -5 0 L 5 0 M 0 -5 L 0 5"
            stroke="#7e8a84"
            strokeWidth="0.75"
            strokeOpacity="0.5"
            transform="translate(8%, 95%)"
          />
          <path
            d="M -5 0 L 5 0 M 0 -5 L 0 5"
            stroke="#7e8a84"
            strokeWidth="0.75"
            strokeOpacity="0.5"
            transform="translate(92%, 95%)"
          />
        </g>
      </svg>
    </div>
  );
}
