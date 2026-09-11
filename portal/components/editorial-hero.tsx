'use client';

import Link from '@/components/ui/link';
import { Bookmark, MapPin, Share2, PlusCircle, ArrowRight, Sparkles } from 'lucide-react';

export function EditorialHero() {
  return (
    <section className="pt-8 pb-10 sm:pt-12 sm:pb-14">
      {/* Top Headline Section */}
      <div className="mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#1b4332] bg-[#e8f1ec] px-3 py-1 rounded-full mb-3.5">
          <span>BERLIN &middot; THE PORTAL FOR TEMP JOBS</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#111816]">
          The portal for Temp Jobs<span className="text-[#1b4332]">.</span>
        </h1>
        <p className="mt-2.5 text-base sm:text-lg text-[#5c6863] font-medium max-w-xl">
          Save the work you love. 1.600+ verified flexible shifts, minijobs, and temporary gigs direct with Berlin employers.
        </p>
      </div>

      {/* Signature Showcase Layout - Inspired by the Reference Design */}
      <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
        {/* Left Column: The Signature Card */}
        <div className="lg:col-span-7">
          <div className="rounded-[24px] border border-[#e5eae7] bg-white p-6 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.03)] transition-all hover:border-[#1b4332]/30">
            {/* Card Header */}
            <div className="flex items-center justify-between pb-5">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111816]">
                Berlin, one job at a time.
              </h2>
              <div className="flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-[#1b4332] bg-[#e8f1ec] px-2.5 py-1 rounded-full">
                <Bookmark className="size-3.5 fill-[#1b4332]/20 stroke-[#1b4332]" />
                <span>YOUR KIEZ</span>
              </div>
            </div>

            {/* List Rows */}
            <div className="divide-y divide-[#f0f3f1] border-t border-[#f0f3f1]">
              {/* Row 01 */}
              <Link
                href="/?district=mitte"
                className="group flex items-center justify-between py-4 transition-colors hover:bg-[#fafbfa] -mx-2 px-2 rounded-xl cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <span className="font-mono text-xs font-medium text-zinc-400">01</span>
                  <div>
                    <p className="text-sm font-bold text-[#111816] group-hover:text-[#1b4332] transition-colors">
                      Specialty Barista & Gastronomy
                    </p>
                    <p className="text-xs text-zinc-500 font-medium">Mitte &middot; 15,50 €/Std.</p>
                  </div>
                </div>
                <div className="size-8 rounded-full flex items-center justify-center text-[#1b4332] group-hover:bg-[#e8f1ec] transition-colors">
                  <MapPin className="size-4 stroke-[1.75]" />
                </div>
              </Link>

              {/* Row 02 */}
              <Link
                href="/?district=kreuzberg"
                className="group flex items-center justify-between py-4 transition-colors hover:bg-[#fafbfa] -mx-2 px-2 rounded-xl cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <span className="font-mono text-xs font-medium text-zinc-400">02</span>
                  <div>
                    <p className="text-sm font-bold text-[#111816] group-hover:text-[#1b4332] transition-colors">
                      Store Assistant & Retail
                    </p>
                    <p className="text-xs text-zinc-500 font-medium">Kreuzberg &middot; 15,00 €/Std.</p>
                  </div>
                </div>
                <div className="size-8 rounded-full flex items-center justify-center text-[#1b4332] group-hover:bg-[#e8f1ec] transition-colors">
                  <MapPin className="size-4 stroke-[1.75]" />
                </div>
              </Link>

              {/* Row 03 */}
              <Link
                href="/?district=friedrichshain"
                className="group flex items-center justify-between py-4 transition-colors hover:bg-[#fafbfa] -mx-2 px-2 rounded-xl cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <span className="font-mono text-xs font-medium text-zinc-400">03</span>
                  <div>
                    <p className="text-sm font-bold text-[#111816] group-hover:text-[#1b4332] transition-colors">
                      Event Host & Culture
                    </p>
                    <p className="text-xs text-zinc-500 font-medium">Friedrichshain &middot; 16,00 €/Std.</p>
                  </div>
                </div>
                <div className="size-8 rounded-full flex items-center justify-center text-[#1b4332] group-hover:bg-[#e8f1ec] transition-colors">
                  <MapPin className="size-4 stroke-[1.75]" />
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
              A DIRECT RECOMMENDATION
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111816] leading-snug">
            Direct to employers, not agencies.
          </h3>

          <p className="text-sm text-[#5c6863] leading-relaxed">
            Keep the work you love close. 1.600+ verified local Berlin jobs with 1-click direct applications and zero recruiter middlemen.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/post-a-job"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#1b4332] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#122f23] transition-all shadow-xs active:scale-[0.98] cursor-pointer"
            >
              <PlusCircle className="size-3.5" />
              <span>Job schalten</span>
            </Link>
            <span className="text-xs font-medium text-zinc-500">
              In 2 Minuten online &middot; 100% Kiez
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
