'use client';

import Link from '@/components/ui/link';
import { ArrowRight } from 'lucide-react';

export function EditorialHero() {
  return (
    <section className="relative pt-8 pb-10 sm:pt-14 sm:pb-16">
      {/* Top Headline Section */}
      <div className="max-w-4xl">
        {/* Micro Kicker */}
        <div className="text-[10.5px] font-medium uppercase tracking-[0.22em] text-[#7e8a84] mb-4 sm:mb-5">
          BERLIN WORKFORCE ARCHITECTURE &middot; DIRECT POSITIONS
        </div>

        {/* Slender Editorial Headline */}
        <h1
          className="text-4xl sm:text-6xl lg:text-[70px] font-light sm:font-normal tracking-[-0.025em] text-[#202a31] leading-[1.08]"
          style={{ fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif" }}
        >
          The portal for temp jobs.
        </h1>

        {/* Crisp Single-Sentence Subtitle */}
        <p className="mt-3 sm:mt-4 text-base sm:text-lg text-[#5a6460] font-light max-w-2xl leading-relaxed tracking-[-0.01em]">
          Direktkontakt zu Berliner Betrieben &mdash; Minijobs, flexible Schichten und Aushilfen ohne Agenturen.
        </p>
      </div>

      {/* Hairline Divider */}
      <div className="w-full h-px bg-[#d8ded9] my-8 sm:my-10" />

      {/* Split Grid: Left = Post Your Job Hub, Right = Live Ledger */}
      <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
        {/* Left Column: Ultra-Clean "Post a Job" Hub */}
        <div className="lg:col-span-6 space-y-4">
          <div className="text-[10px] font-mono font-medium uppercase tracking-[0.24em] text-[#7e8a84]">
            FOR EMPLOYERS &middot; DIRECT LISTINGS
          </div>

          <h2
            className="text-4xl sm:text-5xl lg:text-[56px] font-light sm:font-normal text-[#202a31] tracking-[-0.025em] leading-[1.08]"
            style={{ fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif" }}
          >
            Post a job.
          </h2>

          <div className="pt-2">
            <Link
              href="/post-a-job"
              className="apple-press group inline-flex items-center justify-between gap-4 rounded-xl bg-[#202a31] hover:bg-[#161D22] text-[#fbfbf8] px-6 py-3.5 text-[14px] font-medium tracking-[0.02em] transition-all cursor-pointer shadow-xs min-w-[200px]"
            >
              <span>Start here</span>
              <ArrowRight className="size-4 stroke-[1.5] group-hover:translate-x-0.5 transition-transform" />
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
