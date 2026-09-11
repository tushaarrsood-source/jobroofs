'use client';

export function MarketplaceSchematic() {
  return (
    <div className="w-full my-8 sm:my-11">
      {/* Top Hairline Divider */}
      <div className="w-full h-px bg-[#d8ded9]" />

      {/* Schematic Canvas Container */}
      <div className="relative py-6 sm:py-8 overflow-hidden">
        <svg
          viewBox="0 0 940 230"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto select-none"
          style={{ maxHeight: '250px' }}
        >
          {/* ============================================================
              CENTER DATUM & PLUMB LINE
              ============================================================ */}
          <line
            x1="480"
            y1="16"
            x2="480"
            y2="190"
            stroke="#7e8a84"
            strokeWidth="0.9"
            strokeDasharray="3 3.5"
            strokeOpacity="0.55"
          />
          <text
            x="480"
            y="26"
            textAnchor="middle"
            fill="#7e8a84"
            fontSize="8.5"
            letterSpacing="0.22em"
            fontFamily="'Outfit', -apple-system, sans-serif"
            fontWeight="500"
          >
            THE CORRIDOR &middot; DIRECT
          </text>

          {/* ============================================================
              FLOWING WEAVING CONNECTION CURVES (IMAGE 2 AESTHETIC)
              ============================================================ */}
          {/* Slate-Teal (#4A6B74) Flowing Curve */}
          <path
            d="M 118 154 C 82 140 78 182 142 186 C 215 190 220 150 248 148 C 288 144 310 88 395 84 C 465 80 488 135 555 142 C 625 148 648 118 698 118 C 765 118 788 68 860 70 C 900 72 920 108 935 135"
            stroke="#4a6b74"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.88"
          />

          {/* Warm Terracotta Ochre (#B57E56) Flowing Curve */}
          <path
            d="M 168 138 C 220 146 238 108 312 100 C 390 92 425 38 495 38 C 575 38 618 118 695 118 C 775 118 818 82 852 142 C 878 188 915 178 938 178"
            stroke="#b57e56"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.82"
          />

          {/* Slate Ink Abstract Grounding Loop around Character Base */}
          <path
            d="M 90 162 C 90 140 175 132 210 150 C 235 162 210 186 150 186 C 100 186 90 176 90 162 Z"
            stroke="#202a31"
            strokeWidth="1.25"
            fill="none"
            opacity="0.35"
          />

          {/* ============================================================
              LEFT SIDE: TALENT / CANDIDATE (FRONT OF THE COUNTER)
              ============================================================ */}
          {/* Micro-label at top */}
          <text
            x="142"
            y="26"
            textAnchor="middle"
            fill="#7e8a84"
            fontSize="8.5"
            letterSpacing="0.22em"
            fontFamily="'Outfit', -apple-system, sans-serif"
            fontWeight="500"
          >
            FRONT OF THE COUNTER &middot; TALENT
          </text>

          {/* Monoline Character */}
          {/* Head */}
          <circle
            cx="142"
            cy="90"
            r="19"
            stroke="#202a31"
            strokeWidth="1.6"
            fill="#fbfbf8"
          />
          {/* Body & Shoulders */}
          <path
            d="M 112 146 C 120 122 132 115 142 115 C 152 115 164 122 172 146"
            stroke="#202a31"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
          {/* Arm holding mobile */}
          <path
            d="M 162 128 L 180 140"
            stroke="#202a31"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Smartphone */}
          <rect
            x="176"
            y="130"
            width="18"
            height="30"
            rx="3.5"
            stroke="#202a31"
            strokeWidth="1.5"
            fill="#fbfbf8"
          />
          <line
            x1="180"
            y1="137"
            x2="190"
            y2="137"
            stroke="#7e8a84"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <line
            x1="180"
            y1="143"
            x2="187"
            y2="143"
            stroke="#7e8a84"
            strokeWidth="1"
            strokeLinecap="round"
          />

          {/* Floating Wireframe Job Cards (Matching Image 2 rounded cards) */}
          {/* Card 1: Top Right */}
          <rect
            x="228"
            y="42"
            width="88"
            height="50"
            rx="5"
            stroke="#7e8a84"
            strokeWidth="1.2"
            fill="#fbfbf8"
            fillOpacity="0.96"
          />
          <text
            x="238"
            y="56"
            fill="#202a31"
            fontSize="8"
            fontFamily="'Outfit', sans-serif"
            fontWeight="500"
            letterSpacing="0.05em"
          >
            BARISTA &middot; MITTE
          </text>
          <line
            x1="238"
            y1="66"
            x2="278"
            y2="66"
            stroke="#7e8a84"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <text
            x="238"
            y="80"
            fill="#b57e56"
            fontSize="7.5"
            fontFamily="monospace"
          >
            16,00 &euro;/Std.
          </text>

          {/* Card 2: Mid Right */}
          <rect
            x="308"
            y="96"
            width="92"
            height="50"
            rx="5"
            stroke="#7e8a84"
            strokeWidth="1.2"
            fill="#fbfbf8"
            fillOpacity="0.96"
          />
          <text
            x="318"
            y="110"
            fill="#202a31"
            fontSize="8"
            fontFamily="'Outfit', sans-serif"
            fontWeight="500"
            letterSpacing="0.05em"
          >
            SERVICE &middot; X-BERG
          </text>
          <line
            x1="318"
            y1="120"
            x2="358"
            y2="120"
            stroke="#7e8a84"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <text
            x="318"
            y="134"
            fill="#4a6b74"
            fontSize="7.5"
            fontFamily="monospace"
          >
            15,50 &euro;/Std.
          </text>

          {/* Card 3: Lower Background */}
          <rect
            x="248"
            y="152"
            width="78"
            height="40"
            rx="5"
            stroke="#d8ded9"
            strokeWidth="1.1"
            fill="#fbfbf8"
            fillOpacity="0.9"
          />
          <line
            x1="258"
            y1="166"
            x2="302"
            y2="166"
            stroke="#7e8a84"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <line
            x1="258"
            y1="177"
            x2="288"
            y2="177"
            stroke="#d8ded9"
            strokeWidth="1"
            strokeLinecap="round"
          />

          {/* ============================================================
              RIGHT SIDE: THE COUNTER / VENUE (MATCHING IMAGE 2)
              ============================================================ */}
          {/* Micro-label nicely centered above the counter */}
          <text
            x="706"
            y="26"
            textAnchor="middle"
            fill="#7e8a84"
            fontSize="8.5"
            letterSpacing="0.22em"
            fontFamily="'Outfit', -apple-system, sans-serif"
            fontWeight="500"
          >
            THE COUNTER &middot; LOCAL VENUE
          </text>

          {/* Counter Plumb Line to the Counter Dish */}
          <line
            x1="706"
            y1="34"
            x2="706"
            y2="112"
            stroke="#7e8a84"
            strokeWidth="0.8"
            strokeDasharray="2 3"
            strokeOpacity="0.6"
          />

          {/* The Plate / Object Resting on Counter (Exact Image 2 shape) */}
          <ellipse
            cx="706"
            cy="114"
            rx="40"
            ry="7.5"
            stroke="#202a31"
            strokeWidth="1.5"
            fill="#fbfbf8"
          />
          <path
            d="M 674 114 C 678 126 734 126 738 114"
            stroke="#202a31"
            strokeWidth="1.5"
            fill="none"
          />

          {/* The Architectural Counter Surface */}
          <rect
            x="635"
            y="120"
            width="142"
            height="16"
            stroke="#202a31"
            strokeWidth="1.5"
            fill="#fbfbf8"
          />
          {/* Counter Leg Left */}
          <line
            x1="652"
            y1="136"
            x2="652"
            y2="198"
            stroke="#202a31"
            strokeWidth="1.5"
          />
          {/* Counter Leg Right */}
          <line
            x1="760"
            y1="136"
            x2="760"
            y2="198"
            stroke="#202a31"
            strokeWidth="1.5"
          />
          {/* Counter Rear Shadow Line */}
          <line
            x1="652"
            y1="168"
            x2="760"
            y2="168"
            stroke="#d8ded9"
            strokeWidth="1"
          />

          {/* Architectural Background Canopy / Window Frame Line */}
          <path
            d="M 850 115 L 880 85 L 880 180"
            stroke="#d8ded9"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <line
            x1="860"
            y1="140"
            x2="880"
            y2="140"
            stroke="#d8ded9"
            strokeWidth="0.8"
          />

          {/* Registration Crosshairs (+) */}
          <path
            d="M -4 0 L 4 0 M 0 -4 L 0 4"
            stroke="#7e8a84"
            strokeWidth="0.8"
            strokeOpacity="0.7"
            transform="translate(48, 110)"
          />
          <path
            d="M -4 0 L 4 0 M 0 -4 L 0 4"
            stroke="#7e8a84"
            strokeWidth="0.8"
            strokeOpacity="0.7"
            transform="translate(900, 110)"
          />
        </svg>

        {/* Editorial Subtitle below the schematic (Image 2 style) */}
        <div className="mt-2 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-[13px] sm:text-[14px]">
          <div className="text-[#202a31] font-light tracking-[-0.01em]">
            <span className="font-normal">Direktkontakt.</span> Keine Bürokratie. In 2 Minuten zum Match.
          </div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-[#7e8a84] font-medium">
            100% DIREKT &middot; 0% AGENTURGEBÜHREN
          </div>
        </div>
      </div>

      {/* Bottom Hairline Divider */}
      <div className="w-full h-px bg-[#d8ded9]" />
    </div>
  );
}
