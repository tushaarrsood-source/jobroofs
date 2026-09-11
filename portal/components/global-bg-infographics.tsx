'use client';

import React from 'react';

/**
 * JOBROOFS Calibrated Animated Architectural Pencil Infographics
 *
 * An authentic hand-drawn graphite drafting canvas designed to frame
 * page content with zero text collisions:
 * - Architectural roof canopy framing the hero from above
 * - Animated kinetic drafting compass in the upper-right margin
 * - Moving graphite transit dash streams along outer margins & lower valley
 * - Swiss precision millimeter margin scales on screen borders
 * - Subtle paper radial lighting
 */
export function GlobalBgInfographics() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none bg-[#fbfbf8]"
      style={{
        background:
          'radial-gradient(ellipse at 88% 12%, rgba(238, 230, 216, 0.7) 0%, transparent 60%), radial-gradient(ellipse at 12% 88%, rgba(235, 227, 212, 0.5) 0%, transparent 55%), #fbfbf8',
      }}
    >
      <style>{`
        @keyframes pencilDashFlow {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 400; }
        }
        @keyframes compassRotateSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes compassRotateRev {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes pencilPulseWave {
          0% { r: 3px; stroke-opacity: 0.75; stroke-width: 1.5px; }
          50% { r: 12px; stroke-opacity: 0.1; stroke-width: 0.75px; }
          100% { r: 3px; stroke-opacity: 0.75; stroke-width: 1.5px; }
        }
        @keyframes topoDriftSlow {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(12px, -8px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .anim-dash, .anim-rotate, .anim-drift, .anim-pulse {
            animation: none !important;
          }
        }
      `}</style>

      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Subtle Hand-Drawn Graphite Texture (Precise 0.6 scale) */}
          <filter id="pencil-tooth" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="0.6"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          {/* Architectural Dot Grid (Graphite coordinates) */}
          <pattern
            id="pencil-dot-grid"
            width="64"
            height="64"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="0.75" fill="#7E8A84" fillOpacity="0.22" />
          </pattern>

          {/* Graphite stream gradient */}
          <linearGradient id="pencil-flow-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4A6B74" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#202A31" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#B57E56" stopOpacity="0.45" />
          </linearGradient>
        </defs>

        {/* 0. Ambient Dot Grid */}
        <rect width="100%" height="100%" fill="url(#pencil-dot-grid)" />

        {/* ============================================================
            1. PENCIL SKETCH: ARCHITECTURAL ROOF CANOPY (FRAMING FROM ABOVE)
            Positions higher up to frame the headline without obscuring text
            ============================================================ */}
        <g filter="url(#pencil-tooth)" className="hidden sm:block">
          {/* Grand Roof Canopy Apex (Spans gracefully across upper viewport) */}
          <path
            d="M 60 210 L 520 28 L 980 210"
            stroke="#202A31"
            strokeWidth="1.4"
            strokeOpacity="0.28"
            strokeLinecap="round"
          />
          {/* Second Sketch Pass (Hand-drawn dual rafter pencil line) */}
          <path
            d="M 75 206 L 521 32 L 965 206"
            stroke="#7E8A84"
            strokeWidth="0.8"
            strokeOpacity="0.22"
            strokeLinecap="round"
          />

          {/* High Tie-Beam / Collar Beam above headline */}
          <line
            x1="180"
            y1="120"
            x2="860"
            y2="120"
            stroke="#D8DED9"
            strokeWidth="0.75"
            strokeDasharray="4 6"
            strokeOpacity="0.4"
          />

          {/* King Post Axis (Plumb line passing behind apex) */}
          <line
            x1="520"
            y1="15"
            x2="520"
            y2="220"
            stroke="#7E8A84"
            strokeWidth="0.75"
            strokeDasharray="3 4"
            strokeOpacity="0.25"
          />

          {/* Diagonal Rafter Bracing */}
          <line
            x1="340"
            y1="120"
            x2="240"
            y2="210"
            stroke="#7E8A84"
            strokeWidth="0.75"
            strokeOpacity="0.2"
          />
          <line
            x1="700"
            y1="120"
            x2="800"
            y2="210"
            stroke="#7E8A84"
            strokeWidth="0.75"
            strokeOpacity="0.2"
          />

          {/* Architectural Pencil Joint Ticks */}
          <path d="M 515 28 L 525 28 M 520 23 L 520 33" stroke="#202A31" strokeWidth="1" strokeOpacity="0.4" />
          <path d="M 235 210 L 245 210 M 240 205 L 240 215" stroke="#202A31" strokeWidth="0.85" strokeOpacity="0.35" />
          <path d="M 795 210 L 805 210 M 800 205 L 800 215" stroke="#202A31" strokeWidth="0.85" strokeOpacity="0.35" />

          {/* Handwritten-Style Apex Annotation (Placed safely above headline) */}
          <text
            x="530"
            y="24"
            fill="#202A31"
            fontSize="8"
            letterSpacing="0.22em"
            fontFamily="'Outfit', sans-serif"
            fillOpacity="0.55"
            fontWeight="500"
          >
            ROOF APEX // ELEV. +28.40M &middot; 32.5&deg; PITCH
          </text>
          <text
            x="530"
            y="34"
            fill="#7E8A84"
            fontSize="7"
            letterSpacing="0.16em"
            fontFamily="monospace"
            fillOpacity="0.45"
          >
            BERLIN STRUCTURAL REGISTER &middot; TYP. TIMBER TRUSS 01
          </text>
        </g>

        {/* ============================================================
            2. ANIMATED KINETIC DRAFTING COMPASS
            Rotating mechanical drafting rings in top right margin
            ============================================================ */}
        <g className="hidden md:block" transform="translate(1120, 150)">
          {/* Compass Outer Ring (Slow 120s smooth rotation) */}
          <g
            className="anim-rotate"
            style={{
              animation: 'compassRotateSlow 120s linear infinite',
              transformOrigin: '0px 0px',
            }}
          >
            <circle
              cx="0"
              cy="0"
              r="115"
              stroke="#7E8A84"
              strokeWidth="0.9"
              strokeDasharray="4 8"
              strokeOpacity="0.45"
            />
            <circle
              cx="0"
              cy="0"
              r="90"
              stroke="#202A31"
              strokeWidth="0.75"
              strokeDasharray="2 10"
              strokeOpacity="0.3"
            />
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <line
                key={deg}
                x1="108"
                y1="0"
                x2="118"
                y2="0"
                stroke="#202A31"
                strokeWidth="0.85"
                strokeOpacity="0.4"
                transform={'rotate(' + deg + ')'}
              />
            ))}
          </g>

          {/* Inner Counter-Rotating Ring (Slow 80s reverse) */}
          <g
            className="anim-rotate"
            style={{
              animation: 'compassRotateRev 80s linear infinite',
              transformOrigin: '0px 0px',
            }}
          >
            <circle
              cx="0"
              cy="0"
              r="55"
              stroke="#4A6B74"
              strokeWidth="0.85"
              strokeDasharray="3 5"
              strokeOpacity="0.38"
            />
            <path
              d="M -14 0 L 14 0 M 0 -14 L 0 14"
              stroke="#202A31"
              strokeWidth="1"
              strokeOpacity="0.45"
            />
          </g>

          {/* Central Graphite Pivot Core */}
          <circle cx="0" cy="0" r="2.5" fill="#202A31" fillOpacity="0.5" />

          {/* Technical drafting caption */}
          <text
            x="-70"
            y="-126"
            fill="#202A31"
            fontSize="8"
            letterSpacing="0.2em"
            fontFamily="'Outfit', sans-serif"
            fillOpacity="0.55"
            fontWeight="500"
          >
            BERLIN DRAFTING RADIAL // 030
          </text>
        </g>

        {/* ============================================================
            3. ANIMATED PENCIL STREAM: TOPOGRAPHIC CONTOURS (LOWER SECTION)
            Smooth kinetic graphite dash streams sweeping behind the feed
            ============================================================ */}
        {/* River Pencil Wave (Drifting slowly) */}
        <g className="anim-drift" style={{ animation: 'topoDriftSlow 32s ease-in-out infinite' }}>
          <path
            d="M -60 520 C 220 480 440 590 740 535 C 1040 480 1280 610 1600 555"
            stroke="url(#pencil-flow-grad)"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Kinetic Moving Pencil Dash Stream */}
          <path
            className="anim-dash"
            d="M -60 520 C 220 480 440 590 740 535 C 1040 480 1280 610 1600 555"
            stroke="#202A31"
            strokeWidth="1.2"
            strokeDasharray="8 18"
            strokeLinecap="round"
            fill="none"
            strokeOpacity="0.3"
            style={{ animation: 'pencilDashFlow 24s linear infinite' }}
          />

          <path
            d="M -60 555 C 240 515 460 625 760 570 C 1060 515 1300 645 1620 590"
            stroke="#D8DED9"
            strokeWidth="0.75"
            strokeDasharray="4 8"
            strokeOpacity="0.4"
            fill="none"
          />
        </g>

        {/* Lower Animated Contour Stream */}
        <g className="anim-drift" style={{ animation: 'topoDriftSlow 38s ease-in-out infinite reverse' }}>
          <path
            d="M -60 880 C 280 830 560 950 880 900 C 1180 850 1400 960 1680 910"
            stroke="url(#pencil-flow-grad)"
            strokeWidth="1.3"
            fill="none"
          />
          <path
            className="anim-dash"
            d="M -60 880 C 280 830 560 950 880 900 C 1180 850 1400 960 1680 910"
            stroke="#202A31"
            strokeWidth="1"
            strokeDasharray="8 20"
            fill="none"
            strokeOpacity="0.25"
            style={{ animation: 'pencilDashFlow 28s linear infinite reverse' }}
          />
        </g>

        {/* ============================================================
            4. MARGIN DISTRICT NODES WITH ANIMATED BEACON PULSES
            Placed in the outer gutters to never collide with text
            ============================================================ */}
        <g className="hidden lg:block">
          {/* Left Margin District Node: Mitte */}
          <g transform="translate(68, 460)">
            <circle
              className="anim-pulse"
              cx="0"
              cy="0"
              r="4"
              stroke="#4A6B74"
              strokeWidth="1.2"
              fill="none"
              style={{ animation: 'pencilPulseWave 5s ease-in-out infinite' }}
            />
            <circle cx="0" cy="0" r="2.5" fill="#4A6B74" fillOpacity="0.75" />
            <text x="12" y="3" fill="#202A31" fontSize="8" letterSpacing="0.18em" fontFamily="'Outfit', sans-serif" fontWeight="500" fillOpacity="0.65">
              MITTE &middot; 52.5200&deg;N
            </text>
          </g>

          {/* Right Margin District Node: Kreuzberg */}
          <g transform="translate(calc(100% - 150px), 490)">
            <circle
              className="anim-pulse"
              cx="0"
              cy="0"
              r="4"
              stroke="#B57E56"
              strokeWidth="1.2"
              fill="none"
              style={{ animation: 'pencilPulseWave 5s ease-in-out infinite 1.8s' }}
            />
            <circle cx="0" cy="0" r="2.5" fill="#B57E56" fillOpacity="0.75" />
            <text x="12" y="3" fill="#202A31" fontSize="8" letterSpacing="0.18em" fontFamily="'Outfit', sans-serif" fontWeight="500" fillOpacity="0.65">
              KREUZBERG &middot; 52.4980&deg;N
            </text>
          </g>

          {/* Left Margin District Node: P-Berg */}
          <g transform="translate(68, 760)">
            <circle
              className="anim-pulse"
              cx="0"
              cy="0"
              r="4"
              stroke="#7E8A84"
              strokeWidth="1.2"
              fill="none"
              style={{ animation: 'pencilPulseWave 5s ease-in-out infinite 3.5s' }}
            />
            <circle cx="0" cy="0" r="2" fill="#202A31" fillOpacity="0.6" />
            <text x="12" y="3" fill="#7E8A84" fontSize="8" letterSpacing="0.18em" fontFamily="'Outfit', sans-serif" fillOpacity="0.6" fontWeight="500">
              P-BERG &middot; 10437
            </text>
          </g>

          {/* Right Margin District Node: Neukölln */}
          <g transform="translate(calc(100% - 150px), 800)">
            <circle
              className="anim-pulse"
              cx="0"
              cy="0"
              r="4"
              stroke="#7E8A84"
              strokeWidth="1.2"
              fill="none"
              style={{ animation: 'pencilPulseWave 5s ease-in-out infinite 0.8s' }}
            />
            <circle cx="0" cy="0" r="2" fill="#202A31" fillOpacity="0.6" />
            <text x="12" y="3" fill="#7E8A84" fontSize="8" letterSpacing="0.18em" fontFamily="'Outfit', sans-serif" fillOpacity="0.6" fontWeight="500">
              NEUK&Ouml;LLN &middot; 12043
            </text>
          </g>
        </g>

        {/* ============================================================
            5. ARCHITECTURAL DRAFTING MARGINS (SWISS RULERS)
            Clear millimeter scale on the viewport outer borders
            ============================================================ */}
        <g className="hidden xl:block" transform="translate(24, 0)">
          <line x1="0" y1="80" x2="0" y2="95%" stroke="#7E8A84" strokeWidth="0.85" strokeOpacity="0.45" />
          {[120, 240, 360, 480, 600, 720, 840, 960].map((y) => (
            <g key={y} transform={'translate(0, ' + y + ')'}>
              <line x1="-5" y1="0" x2="6" y2="0" stroke="#202A31" strokeWidth="0.9" strokeOpacity="0.5" />
              <line x1="0" y1="-20" x2="3" y2="-20" stroke="#7E8A84" strokeWidth="0.5" strokeOpacity="0.3" />
              <line x1="0" y1="20" x2="3" y2="20" stroke="#7E8A84" strokeWidth="0.5" strokeOpacity="0.3" />
              <text x="10" y="3" fill="#202A31" fontSize="7" fontFamily="monospace" fillOpacity="0.45">
                {'0' + y}
              </text>
            </g>
          ))}
          <text
            x="10"
            y="100"
            fill="#202A31"
            fontSize="7.5"
            letterSpacing="0.22em"
            fontFamily="'Outfit', sans-serif"
            fillOpacity="0.55"
            fontWeight="500"
          >
            SYS.SCALE // ARCHITECTURAL 1:1
          </text>
        </g>

        <g className="hidden xl:block" transform="translate(calc(100% - 24px), 0)">
          <line x1="0" y1="80" x2="0" y2="95%" stroke="#7E8A84" strokeWidth="0.85" strokeOpacity="0.45" />
          {[150, 300, 450, 600, 750, 900].map((y) => (
            <g key={y} transform={'translate(0, ' + y + ')'}>
              <line x1="-6" y1="0" x2="5" y2="0" stroke="#202A31" strokeWidth="0.9" strokeOpacity="0.5" />
              <text x="-10" y="3" textAnchor="end" fill="#202A31" fontSize="7" fontFamily="monospace" fillOpacity="0.45">
                {'KIEZ.' + (y / 150)}
              </text>
            </g>
          ))}
          <text
            x="-10"
            y="100"
            textAnchor="end"
            fill="#202A31"
            fontSize="7.5"
            letterSpacing="0.22em"
            fontFamily="'Outfit', sans-serif"
            fillOpacity="0.55"
            fontWeight="500"
          >
            BERLIN REGISTRY
          </text>
        </g>

        {/* ============================================================
            6. PRECISION CORNER RETICLES (+)
            ============================================================ */}
        <g className="hidden sm:block">
          <path d="M -7 0 L 7 0 M 0 -7 L 0 7" stroke="#202A31" strokeWidth="1" strokeOpacity="0.45" transform="translate(50, 50)" />
          <path d="M -7 0 L 7 0 M 0 -7 L 0 7" stroke="#202A31" strokeWidth="1" strokeOpacity="0.45" transform="translate(calc(100% - 50px), 50)" />
          <path d="M -5 0 L 5 0 M 0 -5 L 0 5" stroke="#202A31" strokeWidth="0.85" strokeOpacity="0.35" transform="translate(50, 500)" />
          <path d="M -5 0 L 5 0 M 0 -5 L 0 5" stroke="#202A31" strokeWidth="0.85" strokeOpacity="0.35" transform="translate(calc(100% - 50px), 500)" />
        </g>
      </svg>
    </div>
  );
}
