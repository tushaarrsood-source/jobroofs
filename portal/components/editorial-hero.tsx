'use client';

import Link from '@/components/ui/link';

export function EditorialHero() {
  return (
    <section className="relative pt-10 pb-12 sm:pt-16 sm:pb-20 overflow-hidden">
      {/* Top Headline Section */}
      <div className="max-w-4xl">
        {/* Micro Kicker */}
        <div className="text-[10.5px] font-medium uppercase tracking-[0.22em] text-[#7e8a84] mb-5 sm:mb-6">
          BERLIN WORKFORCE ARCHITECTURE &middot; VERIFIED DIRECT POSITIONS
        </div>

        {/* Slender Editorial Headline */}
        <h1
          className="text-4xl sm:text-6xl lg:text-[72px] font-light sm:font-normal tracking-[-0.025em] text-[#202a31] leading-[1.08]"
          style={{ fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif" }}
        >
          The portal for temp jobs.
        </h1>

        {/* Elegant Subtitle */}
        <p className="mt-4 sm:mt-5 text-base sm:text-lg text-[#5a6460] font-light max-w-2xl leading-relaxed tracking-[-0.01em]">
          Finde Minijobs, flexible Schichten und temporäre Einsätze direkt bei Berliner Betrieben &mdash; 100% ohne Vermittler, 100% transparent.
        </p>
      </div>

      {/* Hairline Divider (Direct Translation of Reference Image) */}
      <div className="w-full h-px bg-[#d8ded9] my-10 sm:my-14" />

      {/* Split Editorial Lower Grid */}
      <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
        {/* Left Column: Manifesto & Direct Access */}
        <div className="lg:col-span-6 space-y-4">
          <div className="text-[10.5px] font-medium uppercase tracking-[0.2em] text-[#7e8a84]">
            FRONT OF THE MARKET &middot; DIRECT ACCESS
          </div>

          <h2
            className="text-2xl sm:text-[28px] font-normal text-[#202a31] tracking-[-0.015em] leading-snug"
            style={{ fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif" }}
          >
            Search. Connect. Work on your terms.
          </h2>

          <p className="text-[14px] sm:text-[15px] text-[#5a6460] font-light leading-relaxed max-w-md">
            Spare dir Umwege über Leiharbeitsfirmen und Agenturen. Auf JOBROOFS bewirbst du dich mit 1 Klick direkt bei verifizierten Berliner Betrieben &mdash; schnell, unkompliziert und auf Augenhöhe.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link
              href="/all-jobs"
              className="apple-press inline-flex items-center justify-center rounded-sm bg-[#202a31] px-5 py-2.5 text-[12.5px] font-normal tracking-[0.02em] text-[#fbfbf8] hover:bg-[#2d3a43] transition-colors cursor-pointer"
            >
              <span>Stellenangebote durchsuchen</span>
            </Link>
            <Link
              href="/post-a-job"
              className="inline-flex items-center gap-1.5 text-[12.5px] font-normal tracking-[0.02em] text-[#202a31] hover:text-[#7e8a84] transition-colors cursor-pointer"
            >
              <span>Job inserieren (kostenlos)</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Architectural Live Ledger */}
        <div className="lg:col-span-6 lg:pl-4">
          <div className="flex items-center justify-between text-[10.5px] font-medium uppercase tracking-[0.2em] text-[#7e8a84] mb-3">
            <span>CURRENT OPENINGS &middot; BERLIN KIEZE</span>
            <span className="font-mono text-[10px] text-[#7e8a84]/80">VERIFIED</span>
          </div>

          {/* Architectural Hairline-Divided Ledger */}
          <div className="border-t border-[#d8ded9]">
            {/* Row 01 */}
            <Link
              href="/?district=mitte"
              className="group flex items-baseline justify-between py-3.5 border-b border-[#d8ded9] hover:bg-[#f4f4ee]/70 transition-colors px-2 -mx-2 cursor-pointer"
            >
              <div>
                <div className="text-[14.5px] font-normal text-[#202a31] group-hover:text-[#4a5751] transition-colors">
                  Specialty Barista & Gastronomy
                </div>
                <div className="text-[12px] text-[#7e8a84] font-light mt-0.5">
                  Mitte &middot; Torstraße
                </div>
              </div>
              <div className="text-right">
                <div className="text-[13.5px] font-normal text-[#202a31] font-mono">
                  15,50 € / Std.
                </div>
                <div className="text-[9.5px] uppercase tracking-[0.14em] text-[#7e8a84] mt-0.5">
                  Minijob
                </div>
              </div>
            </Link>

            {/* Row 02 */}
            <Link
              href="/?district=kreuzberg"
              className="group flex items-baseline justify-between py-3.5 border-b border-[#d8ded9] hover:bg-[#f4f4ee]/70 transition-colors px-2 -mx-2 cursor-pointer"
            >
              <div>
                <div className="text-[14.5px] font-normal text-[#202a31] group-hover:text-[#4a5751] transition-colors">
                  Concept Store & Retail Host
                </div>
                <div className="text-[12px] text-[#7e8a84] font-light mt-0.5">
                  Kreuzberg &middot; Oranienstraße
                </div>
              </div>
              <div className="text-right">
                <div className="text-[13.5px] font-normal text-[#202a31] font-mono">
                  15,00 € / Std.
                </div>
                <div className="text-[9.5px] uppercase tracking-[0.14em] text-[#7e8a84] mt-0.5">
                  Teilzeit
                </div>
              </div>
            </Link>

            {/* Row 03 */}
            <Link
              href="/?district=friedrichshain"
              className="group flex items-baseline justify-between py-3.5 border-b border-[#d8ded9] hover:bg-[#f4f4ee]/70 transition-colors px-2 -mx-2 cursor-pointer"
            >
              <div>
                <div className="text-[14.5px] font-normal text-[#202a31] group-hover:text-[#4a5751] transition-colors">
                  Exhibition & Event Assistant
                </div>
                <div className="text-[12px] text-[#7e8a84] font-light mt-0.5">
                  Friedrichshain &middot; Warschauer Str.
                </div>
              </div>
              <div className="text-right">
                <div className="text-[13.5px] font-normal text-[#202a31] font-mono">
                  16,00 € / Std.
                </div>
                <div className="text-[9.5px] uppercase tracking-[0.14em] text-[#7e8a84] mt-0.5">
                  Werkstudent
                </div>
              </div>
            </Link>
          </div>

          {/* Ledger Sub-meta */}
          <div className="flex items-center justify-between pt-3 text-[11px] text-[#7e8a84] font-light">
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-[#7e8a84]" />
              <span>Live aktualisiert mit Berliner Betrieben</span>
            </span>
            <Link href="/all-jobs" className="hover:text-[#202a31] transition-colors">
              Alle 1.640 anzeigen &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
