'use client';

import Link from '@/components/ui/link';
import { Bookmark, MapPin, Share2, PlusCircle, ArrowRight, Sparkles } from 'lucide-react';

export function EditorialHero() {
  return (
    <section className="relative pt-8 pb-10 sm:pt-14 sm:pb-16 overflow-hidden">
      {/* Subtle Ambient Apple-Style Radial Glow */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-[#1b4332]/[0.06] to-transparent rounded-full blur-3xl -z-10"
        aria-hidden="true"
      />

      {/* Top Headline Section */}
      <div className="mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2.5 text-xs font-bold tracking-wider uppercase text-[#1b4332] bg-[#e8f1ec] px-3.5 py-1.5 rounded-full mb-4 shadow-2xs border border-[#1b4332]/10">
          <span className="relative flex size-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full size-2 bg-emerald-600" />
          </span>
          <span>BERLIN &middot; 1.600+ VERIFIZIERTE TEMP-JOBS</span>
        </div>

        <h1
          className="text-4xl sm:text-6xl font-extrabold tracking-[-0.038em] text-[#111816] leading-[1.06]"
          style={{
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
          }}
        >
          The portal for Temp Jobs<span className="text-[#1b4332]">.</span>
        </h1>

        <p className="mt-3 text-base sm:text-lg text-[#5c6863] font-medium max-w-xl leading-relaxed tracking-[-0.015em]">
          Finde Minijobs, flexible Schichten und temporäre Einsätze direkt bei Berliner Betrieben &mdash; 100% ohne Vermittler, 100% transparent.
        </p>
      </div>

      {/* Signature Showcase Layout */}
      <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
        {/* Left Column: The Signature Card */}
        <div className="lg:col-span-7">
          <div className="apple-card-hover rounded-[24px] border border-black/[0.08] bg-white p-6 sm:p-7 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
            {/* Card Header */}
            <div className="flex items-center justify-between pb-5">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111816]">
                Berlin, one job at a time.
              </h2>
              <div className="flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-[#1b4332] bg-[#e8f1ec] px-2.5 py-1 rounded-full">
                <Bookmark className="size-3.5 fill-[#1b4332]/20 stroke-[#1b4332]" />
                <span>DEIN KIEZ</span>
              </div>
            </div>

            {/* List Rows */}
            <div className="divide-y divide-black/[0.05] border-t border-black/[0.05]">
              {/* Row 01 */}
              <Link
                href="/?district=mitte"
                className="group flex items-center justify-between py-4 transition-all hover:bg-black/[0.02] -mx-2 px-2.5 rounded-xl cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <span className="font-mono text-xs font-semibold text-zinc-400">01</span>
                  <div>
                    <p className="text-sm font-bold text-[#111816] group-hover:text-[#1b4332] transition-colors">
                      Specialty Barista & Gastronomy
                    </p>
                    <p className="text-xs text-zinc-500 font-medium">Mitte &middot; 15,50 €/Std.</p>
                  </div>
                </div>
                <div className="size-8 rounded-full flex items-center justify-center text-[#1b4332] group-hover:bg-[#e8f1ec] group-hover:translate-x-0.5 transition-all">
                  <ArrowRight className="size-4 stroke-[2]" />
                </div>
              </Link>

              {/* Row 02 */}
              <Link
                href="/?district=kreuzberg"
                className="group flex items-center justify-between py-4 transition-all hover:bg-black/[0.02] -mx-2 px-2.5 rounded-xl cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <span className="font-mono text-xs font-semibold text-zinc-400">02</span>
                  <div>
                    <p className="text-sm font-bold text-[#111816] group-hover:text-[#1b4332] transition-colors">
                      Store Assistant & Retail
                    </p>
                    <p className="text-xs text-zinc-500 font-medium">Kreuzberg &middot; 15,00 €/Std.</p>
                  </div>
                </div>
                <div className="size-8 rounded-full flex items-center justify-center text-[#1b4332] group-hover:bg-[#e8f1ec] group-hover:translate-x-0.5 transition-all">
                  <ArrowRight className="size-4 stroke-[2]" />
                </div>
              </Link>

              {/* Row 03 */}
              <Link
                href="/?district=friedrichshain"
                className="group flex items-center justify-between py-4 transition-all hover:bg-black/[0.02] -mx-2 px-2.5 rounded-xl cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <span className="font-mono text-xs font-semibold text-zinc-400">03</span>
                  <div>
                    <p className="text-sm font-bold text-[#111816] group-hover:text-[#1b4332] transition-colors">
                      Event Host & Culture
                    </p>
                    <p className="text-xs text-zinc-500 font-medium">Friedrichshain &middot; 16,00 €/Std.</p>
                  </div>
                </div>
                <div className="size-8 rounded-full flex items-center justify-center text-[#1b4332] group-hover:bg-[#e8f1ec] group-hover:translate-x-0.5 transition-all">
                  <ArrowRight className="size-4 stroke-[2]" />
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Editorial Recommendation */}
        <div className="lg:col-span-5 space-y-4 lg:pl-4">
          <div className="flex items-center gap-2">
            <Share2 className="size-4 text-[#1b4332]" />
            <span className="text-[11px] font-extrabold tracking-widest uppercase text-[#1b4332]">
              DIREKTVERMITTLUNG
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] text-[#111816] leading-snug">
            Direkt zum Betrieb &mdash; ohne Leiharbeitsfirma.
          </h3>

          <p className="text-sm text-[#5c6863] leading-relaxed">
            Spare dir Umwege über Agenturen. Auf JOBROOFS bewirbst du dich mit 1 Klick direkt beim Arbeitgeber &mdash; schnell, unkompliziert und auf Augenhöhe.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/post-a-job"
              className="apple-press inline-flex items-center gap-1.5 rounded-full bg-[#1b4332] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#122f23] transition-all shadow-[0_2px_8px_rgba(27,67,50,0.22)] hover:shadow-[0_4px_14px_rgba(27,67,50,0.32)] cursor-pointer"
            >
              <PlusCircle className="size-3.5" />
              <span>Job schalten</span>
            </Link>
            <span className="text-xs font-medium text-[#5c6863]">
              In 2 Minuten online &middot; 100% Kiez
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
