'use client';

import React from 'react';

/**
 * JOBROOFS Global Architectural Background Infographics
 *
 * Ambient, silent-luxury architectural blueprint layer rendered fixed behind
 * all content across the entire portal. Features:
 * - Swiss precision drafting margins & millimeter rulers
 * - Architectural roofline & rafter truss watermarks (JOBROOFS heritage)
 * - Berlin Kiez topographic elevation & geodesic district nodes
 * - Architectural registration reticles & coordinate callouts
 */
export function GlobalBgInfographics() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none"
      style={{
        background:
          'radial-gradient(ellipse at 88% 12%, rgba(240, 234, 222, 0.5) 0%, transparent 55%), radial-gradient(ellipse at 12% 88%, rgba(238, 232, 220, 0.35) 0%, transparent 50%)',
      }}
    >
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Subtle 80px Architectural Coordinate Dot Grid */}
          <pattern
            id="global-arch-grid"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="0.65" fill="#7E8A84" fillOpacity="0.14" />
          </pattern>

          {/* Linear gradient for subtle architectural rooflines */}
          <linearGradient id="roof-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7E8A84" stopOpacity="0.08" />
            <stop offset="50%" stopColor="#202A31" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#7E8A84" stopOpacity="0.02" />
          </linearGradient>

          {/* Linear gradient for Spree topographic contour curve */}
          <linearGradient id="topo-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4A6B74" stopOpacity="0.07" />
            <stop offset="50%" stopColor="#7E8A84" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#B57E56" stopOpacity="0.06" />
          </linearGradient>
        </defs>

        {/* Global Dot Grid */}
        <rect width="100%" height="100%" fill="url(#global-arch-grid)" />

        {/* ============================================================
            1. ARCHITECTURAL ROOFLINE & TRUSS WATERMARK (HERO / APEX)
            Grand structural elevation wireframe behind upper viewport
            ============================================================ */}
        <g opacity="0.85" className="hidden sm:block">
          {/* Main Roof Pitch Chevron (32.5° Berlin Altbau pitch) */}
          <path
            d="M 120 280 L 520 80 L 920 280"
            stroke="url(#roof-gradient)"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
          {/* Tie Beam (Structural Rafter Base) */}
          <line
            x1="180"
            y1="280"
            x2="860"
            y2="280"
            stroke="#D8DED9"
            strokeWidth="0.85"
            strokeDasharray="4 6"
            strokeOpacity="0.6"
          />
          {/* Collar Beam */}
          <line
            x1="320"
            y1="180"
            x2="720"
            y2="180"
            stroke="#D8DED9"
            strokeWidth="0.75"
            strokeOpacity="0.45"
          />
          {/* King Post (Vertical Axis) */}
          <line
            x1="520"
            y1="80"
            x2="520"
            y2="280"
            stroke="#7E8A84"
            strokeWidth="0.75"
            strokeDasharray="2 4"
            strokeOpacity="0.4"
          />
          {/* Struts / Diagonal Bracing */}
          <line
            x1="420"
            y1="280"
            x2="320"
            y2="180"
            stroke="#D8DED9"
            strokeWidth="0.75"
            strokeOpacity="0.35"
          />
          <line
            x1="620"
            y1="280"
            x2="720"
            y2="180"
            stroke="#D8DED9"
            strokeWidth="0.75"
            strokeOpacity="0.35"
          />

          {/* Roof Structural Annotation */}
          <text
            x="528"
            y="95"
            fill="#7E8A84"
            fontSize="8"
            letterSpacing="0.2em"
            fontFamily="'Outfit', sans-serif"
            fillOpacity="0.5"
            fontWeight="500"
          >
            ROOF APEX ELEV. +28.4M &middot; 32.5&deg; PITCH
          </text>
          <text
            x="865"
            y="276"
            fill="#7E8A84"
            fontSize="7.5"
            letterSpacing="0.16em"
            fontFamily="monospace"
            fillOpacity="0.45"
          >
            SPAN: 14.8M // TYP. ALTBAU
          </text>
        </g>

        {/* Secondary Delicate Truss in Upper Right Margin */}
        <g opacity="0.6" className="hidden lg:block">
          <path
            d="M 980 160 L 1180 60 L 1380 160"
            stroke="#D8DED9"
            strokeWidth="0.8"
            strokeDasharray="3 4"
            strokeOpacity="0.5"
          />
          <line
            x1="1180"
            y1="60"
            x2="1180"
            y2="160"
            stroke="#D8DED9"
            strokeWidth="0.8"
            strokeDasharray="2 3"
            strokeOpacity="0.4"
          />
          <circle
            cx="1180"
            cy="60"
            r="2"
            fill="#7E8A84"
            fillOpacity="0.4"
          />
          <text
            x="1188"
            y="70"
            fill="#7E8A84"
            fontSize="7.5"
            letterSpacing="0.18em"
            fontFamily="'Outfit', sans-serif"
            fillOpacity="0.45"
          >
            SECTOR 10115 &middot; MITTE
          </text>
        </g>

        {/* ============================================================
            2. BERLIN GEODESIC KIEZ NETWORK & TOPOGRAPHIC CONTOURS
            Subtle undulating curves and district coordinates across page
            ============================================================ */}
        {/* Sweeping River/Valley Topographic Hairlines */}
        <path
          d="M -40 420 C 240 380 480 490 760 450 C 1040 410 1280 520 1520 480"
          stroke="url(#topo-gradient)"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M -40 460 C 260 420 500 530 780 490 C 1060 450 1300 560 1540 520"
          stroke="#D8DED9"
          strokeWidth="0.75"
          strokeDasharray="4 8"
          strokeOpacity="0.4"
          fill="none"
        />
        <path
          d="M -40 780 C 280 720 560 840 860 800 C 1140 760 1380 860 1620 810"
          stroke="url(#topo-gradient)"
          strokeWidth="1"
          fill="none"
          opacity="0.75"
        />

        {/* Geodesic District Coordinate Callouts (Hidden on mobile) */}
        <g className="hidden md:block">
          {/* Node 1: Mitte */}
          <g transform="translate(180, 440)">
            <circle cx="0" cy="0" r="2.5" fill="#4A6B74" fillOpacity="0.5" />
            <circle cx="0" cy="0" r="7" stroke="#4A6B74" strokeWidth="0.6" strokeDasharray="2 3" strokeOpacity="0.4" />
            <text x="12" y="3" fill="#7E8A84" fontSize="8" letterSpacing="0.18em" fontFamily="'Outfit', sans-serif" fillOpacity="0.6">
              MITTE &middot; 52.5200&deg;N 13.4050&deg;E
            </text>
          </g>

          {/* Node 2: Kreuzberg */}
          <g transform="translate(680, 470)">
            <circle cx="0" cy="0" r="2.5" fill="#B57E56" fillOpacity="0.5" />
            <circle cx="0" cy="0" r="7" stroke="#B57E56" strokeWidth="0.6" strokeDasharray="2 3" strokeOpacity="0.4" />
            <text x="12" y="3" fill="#7E8A84" fontSize="8" letterSpacing="0.18em" fontFamily="'Outfit', sans-serif" fillOpacity="0.6">
              KREUZBERG &middot; 52.4980&deg;N 13.4180&deg;E
            </text>
          </g>

          {/* Geodesic Connection Ray */}
          <line
            x1="180"
            y1="440"
            x2="680"
            y2="470"
            stroke="#D8DED9"
            strokeWidth="0.75"
            strokeDasharray="3 5"
            strokeOpacity="0.5"
          />

          {/* Node 3: Prenzlauer Berg */}
          <g transform="translate(380, 770)">
            <circle cx="0" cy="0" r="2" fill="#7E8A84" fillOpacity="0.4" />
            <text x="10" y="3" fill="#7E8A84" fontSize="8" letterSpacing="0.18em" fontFamily="'Outfit', sans-serif" fillOpacity="0.55">
              PRENZLAUER BERG &middot; 52.5390&deg;N
            </text>
          </g>

          {/* Node 4: Neukölln */}
          <g transform="translate(920, 810)">
            <circle cx="0" cy="0" r="2" fill="#7E8A84" fillOpacity="0.4" />
            <text x="10" y="3" fill="#7E8A84" fontSize="8" letterSpacing="0.18em" fontFamily="'Outfit', sans-serif" fillOpacity="0.55">
              NEUK&Ouml;LLN &middot; 52.4810&deg;N
            </text>
          </g>

          {/* Geodesic Ray between P-Berg & Neukölln */}
          <line
            x1="380"
            y1="770"
            x2="920"
            y2="810"
            stroke="#D8DED9"
            strokeWidth="0.75"
            strokeDasharray="3 5"
            strokeOpacity="0.4"
          />
        </g>

        {/* ============================================================
            3. SWISS PRECISION DRAFTING MARGINS (LEFT & RIGHT EDGES)
            Subtle vertical scale with millimeter ticks
            ============================================================ */}
        {/* Left Margin Ruler (Hidden on mobile) */}
        <g className="hidden xl:block" transform="translate(24, 0)">
          {/* Vertical Datum Line */}
          <line
            x1="0"
            y1="80"
            x2="0"
            y2="95%"
            stroke="#D8DED9"
            strokeWidth="0.75"
            strokeOpacity="0.5"
          />

          {/* Millimeter / Index Ticks */}
          {[120, 220, 320, 420, 520, 620, 720, 820, 920].map((y) => (
            <g key={y} transform={'translate(0, ' + y + ')'}>
              <line x1="-5" y1="0" x2="5" y2="0" stroke="#7E8A84" strokeWidth="0.8" strokeOpacity="0.45" />
              <line x1="0" y1="-25" x2="3" y2="-25" stroke="#D8DED9" strokeWidth="0.5" strokeOpacity="0.3" />
              <line x1="0" y1="25" x2="3" y2="25" stroke="#D8DED9" strokeWidth="0.5" strokeOpacity="0.3" />
              <text
                x="8"
                y="3"
                fill="#7E8A84"
                fontSize="6.5"
                fontFamily="monospace"
                fillOpacity="0.4"
              >
                {'0' + y}
              </text>
            </g>
          ))}

          {/* Vertical Label */}
          <text
            x="8"
            y="100"
            fill="#7E8A84"
            fontSize="7"
            letterSpacing="0.2em"
            fontFamily="'Outfit', sans-serif"
            fillOpacity="0.45"
          >
            SYS.SCALE // ARCHITECTURAL 1:1
          </text>
        </g>

        {/* Right Margin Ruler (Hidden on mobile) */}
        <g className="hidden xl:block" transform="translate(calc(100% - 24px), 0)">
          <line
            x1="0"
            y1="80"
            x2="0"
            y2="95%"
            stroke="#D8DED9"
            strokeWidth="0.75"
            strokeOpacity="0.5"
          />
          {[150, 300, 450, 600, 750, 900].map((y) => (
            <g key={y} transform={'translate(0, ' + y + ')'}>
              <line x1="-5" y1="0" x2="5" y2="0" stroke="#7E8A84" strokeWidth="0.8" strokeOpacity="0.45" />
              <text
                x="-8"
                y="3"
                textAnchor="end"
                fill="#7E8A84"
                fontSize="6.5"
                fontFamily="monospace"
                fillOpacity="0.4"
              >
                {'KIEZ.' + (y / 150)}
              </text>
            </g>
          ))}
          <text
            x="-8"
            y="100"
            textAnchor="end"
            fill="#7E8A84"
            fontSize="7"
            letterSpacing="0.2em"
            fontFamily="'Outfit', sans-serif"
            fillOpacity="0.45"
          >
            BERLIN REGISTRY
          </text>
        </g>

        {/* ============================================================
            4. CORNER REGISTRATION RETICLES (+)
            ============================================================ */}
        <g className="hidden sm:block">
          {/* Top Left Reticle */}
          <path
            d="M -6 0 L 6 0 M 0 -6 L 0 6"
            stroke="#7E8A84"
            strokeWidth="0.8"
            strokeOpacity="0.4"
            transform="translate(48, 48)"
          />
          {/* Top Right Reticle */}
          <path
            d="M -6 0 L 6 0 M 0 -6 L 0 6"
            stroke="#7E8A84"
            strokeWidth="0.8"
            strokeOpacity="0.4"
            transform="translate(calc(100% - 48px), 48)"
          />
          {/* Mid Screen Left Reticle */}
          <path
            d="M -5 0 L 5 0 M 0 -5 L 0 5"
            stroke="#7E8A84"
            strokeWidth="0.75"
            strokeOpacity="0.35"
            transform="translate(48, 500)"
          />
          {/* Mid Screen Right Reticle */}
          <path
            d="M -5 0 L 5 0 M 0 -5 L 0 5"
            stroke="#7E8A84"
            strokeWidth="0.75"
            strokeOpacity="0.35"
            transform="translate(calc(100% - 48px), 500)"
          />
        </g>
      </svg>
    </div>
  );
}
