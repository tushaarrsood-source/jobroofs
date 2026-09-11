'use client';

import { useState } from 'react';
import Link from '@/components/ui/link';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { JobroofsMark } from '@/components/brand-logo';

const BERLIN_DISTRICTS = [
  'Mitte',
  'Kreuzberg',
  'Friedrichshain',
  'Neukölln',
  'Prenzlauer Berg',
  'Charlottenburg',
  'Schöneberg',
  'Wedding',
  'Lichtenberg',
  'Treptow',
  'Pankow',
  'Steglitz',
  'Tempelhof',
  'Moabit',
];

const QUICK_DISTRICTS = [
  'Mitte',
  'Kreuzberg',
  'Friedrichshain',
  'Neukölln',
  'Prenzlauer Berg',
  'Charlottenburg',
];

const JOB_TYPES = [
  'Minijob (bis 538 €)',
  'Teilzeit',
  'Werkstudent',
  'Kurzfristige Aushilfe',
  'Event / Wochenende',
  'Vollzeit',
];

const WAGE_PRESETS = [
  '14,50 € / Std.',
  '15,00 € / Std.',
  '16,00 € / Std.',
  '18,00 € / Std.',
  '20,00 € / Std.',
];

export function SimplePostJobForm() {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    district: 'Mitte',
    employmentType: 'Minijob (bis 538 €)',
    wage: '16,00 € / Std.',
    applyUrl: '',
    contactEmail: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (step === 1) {
      if (!formData.title.trim()) {
        setError('Bitte gib eine Stellenbezeichnung ein.');
        return;
      }
      if (!formData.company.trim()) {
        setError('Bitte gib deinen Unternehmensnamen ein.');
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!formData.description.trim()) {
        setError('Bitte beschreibe kurz die Aufgaben und Voraussetzungen.');
        return;
      }
      setStep(3);
      return;
    }

    handleSubmit();
  };

  const handleSubmit = async () => {
    if (!formData.applyUrl.trim() && !formData.contactEmail.trim()) {
      setError('Bitte gib mindestens eine Bewerbungsmethode (Link oder E-Mail) an.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/employer/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submitterEmail: formData.contactEmail || formData.applyUrl,
          pricingPlan: 'standard',
          payload: {
            title: formData.title,
            company: formData.company,
            district: formData.district,
            employmentForms: [formData.employmentType],
            payText: formData.wage,
            description: formData.description,
            application: {
              url: formData.applyUrl.startsWith('http') ? formData.applyUrl : null,
              email: formData.applyUrl.includes('@') ? formData.applyUrl : formData.contactEmail,
            },
          },
        }),
      });

      if (!res.ok) {
        const data: any = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Fehler beim Absenden der Anzeige.');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Ein unerwarteter Fehler ist aufgetreten.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="border border-[#d8ded9] bg-[#fbfbf8] p-8 sm:p-14 text-center max-w-xl mx-auto rounded-sm">
        <div className="mx-auto flex size-12 items-center justify-center rounded-sm bg-[#202a31] text-[#fbfbf8]">
          <CheckCircle2 className="size-6 stroke-[1.5]" />
        </div>
        <h2
          className="mt-6 text-2xl sm:text-3xl font-light text-[#202a31] tracking-[-0.02em]"
          style={{ fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif" }}
        >
          Job erfolgreich inseriert.
        </h2>
        <p className="mt-3 text-[14px] text-[#5a6460] font-light leading-relaxed max-w-md mx-auto">
          Deine Anzeige für <span className="font-medium text-[#202a31]">{formData.title}</span> bei <span className="font-medium text-[#202a31]">{formData.company}</span> ist eingegangen und wird sofort im Berliner Kiez geschaltet.
        </p>

        <div className="mt-8 pt-6 border-t border-[#d8ded9] flex flex-col sm:flex-row justify-center gap-3">
          <Link
            href="/"
            className="apple-press inline-flex items-center justify-center rounded-sm bg-[#202a31] px-6 py-3 text-[13px] font-normal tracking-[0.02em] text-[#fbfbf8] hover:bg-[#2d3a43] transition-colors cursor-pointer"
          >
            Zurück zur Übersicht
          </Link>
          <button
            type="button"
            onClick={() => {
              setSuccess(false);
              setStep(1);
              setFormData({
                title: '',
                company: '',
                district: 'Mitte',
                employmentType: 'Minijob (bis 538 €)',
                wage: '16,00 € / Std.',
                applyUrl: '',
                contactEmail: '',
                description: '',
              });
            }}
            className="apple-press inline-flex items-center justify-center rounded-sm border border-[#d8ded9] bg-transparent px-6 py-3 text-[13px] font-normal text-[#202a31] hover:bg-[#f4f4ee] transition-colors cursor-pointer"
          >
            Weiteren Job inserieren
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Step Tracker */}
      <div className="border-b border-[#d8ded9] pb-6 sm:pb-8">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4">
          <div>
            <div className="text-[10.5px] font-medium uppercase tracking-[0.22em] text-[#7e8a84] mb-2">
              EMPLOYER INTAKE &middot; DIRECT LISTINGS
            </div>
            <h1
              className="text-3xl sm:text-4xl font-light sm:font-normal tracking-[-0.025em] text-[#202a31]"
              style={{ fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif" }}
            >
              Job jetzt inserieren.
            </h1>
            <p className="mt-1.5 text-[14.5px] text-[#5a6460] font-light">
              Erreiche motivierte Studierende, Aushilfen und Fachkräfte direkt in deinem Kiez &mdash; ohne Agenturen.
            </p>
          </div>

          {/* Silent Luxury Segmented Step Indicator */}
          <div className="flex items-center gap-1 p-0.5 rounded-sm border border-[#d8ded9] bg-transparent self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setStep(1)}
              className={`px-3 py-1.5 rounded-sm text-[11.5px] font-normal tracking-[0.02em] transition-colors cursor-pointer ${
                step === 1
                  ? 'bg-[#202a31] text-[#fbfbf8]'
                  : 'text-[#7e8a84] hover:text-[#202a31]'
              }`}
            >
              1. Basisdaten
            </button>
            <button
              type="button"
              onClick={() => {
                if (formData.title && formData.company) setStep(2);
              }}
              className={`px-3 py-1.5 rounded-sm text-[11.5px] font-normal tracking-[0.02em] transition-colors cursor-pointer ${
                step === 2
                  ? 'bg-[#202a31] text-[#fbfbf8]'
                  : 'text-[#7e8a84] hover:text-[#202a31]'
              }`}
            >
              2. Konditionen
            </button>
            <button
              type="button"
              onClick={() => {
                if (formData.title && formData.company && formData.description) setStep(3);
              }}
              className={`px-3 py-1.5 rounded-sm text-[11.5px] font-normal tracking-[0.02em] transition-colors cursor-pointer ${
                step === 3
                  ? 'bg-[#202a31] text-[#fbfbf8]'
                  : 'text-[#7e8a84] hover:text-[#202a31]'
              }`}
            >
              3. Kontakt & Live
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Form Left, Live Card Preview Right */}
      <div className="grid gap-10 lg:grid-cols-12 items-start">
        {/* Left Form Workstation (7 Cols) */}
        <form onSubmit={handleNext} className="lg:col-span-7 space-y-6">
          {error && (
            <div className="flex items-center gap-2 rounded-sm bg-[#fbfbf8] p-3.5 text-[12.5px] font-normal text-[#c43224] border border-[#c43224]/30">
              <AlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Basisdaten */}
          {step === 1 && (
            <div className="border border-[#d8ded9] bg-[#fbfbf8] p-6 sm:p-8 rounded-sm space-y-6">
              <div className="border-b border-[#d8ded9] pb-3">
                <h2
                  className="text-lg font-normal text-[#202a31] tracking-[-0.015em]"
                  style={{ fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif" }}
                >
                  1. Basisdaten der Stelle
                </h2>
                <p className="text-[12.5px] text-[#7e8a84] font-light mt-0.5">
                  Worum geht es und wer sucht Verstärkung?
                </p>
              </div>

              {/* Title Input */}
              <div className="space-y-2">
                <label className="block text-[11px] font-medium uppercase tracking-[0.16em] text-[#7e8a84]">
                  Stellenbezeichnung *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="z. B. Specialty Barista, Servicekraft, Event-Aushilfe"
                  className="w-full h-11 px-3.5 text-[14px] text-[#202a31] placeholder:text-[#7e8a84]/50 border border-[#d8ded9] rounded-sm bg-[#fbfbf8] focus:border-[#202a31] outline-none transition-colors"
                />
              </div>

              {/* Company Input */}
              <div className="space-y-2">
                <label className="block text-[11px] font-medium uppercase tracking-[0.16em] text-[#7e8a84]">
                  Arbeitgeber / Unternehmen *
                </label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="z. B. Café Morgenstern GmbH"
                  className="w-full h-11 px-3.5 text-[14px] text-[#202a31] placeholder:text-[#7e8a84]/50 border border-[#d8ded9] rounded-sm bg-[#fbfbf8] focus:border-[#202a31] outline-none transition-colors"
                />
              </div>

              {/* District Selection Chips */}
              <div className="space-y-2">
                <label className="block text-[11px] font-medium uppercase tracking-[0.16em] text-[#7e8a84]">
                  Berliner Bezirk *
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {QUICK_DISTRICTS.map((d) => {
                    const isSelected = formData.district === d;
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setFormData({ ...formData, district: d })}
                        className={`px-3 py-1.5 rounded-sm text-[12px] font-normal transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#202a31] text-[#fbfbf8]'
                            : 'border border-[#d8ded9] text-[#7e8a84] hover:text-[#202a31] hover:border-[#202a31] bg-transparent'
                        }`}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>

                {/* Dropdown for All Districts */}
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full h-10 px-3.5 text-[13px] text-[#202a31] border border-[#d8ded9] rounded-sm bg-[#fbfbf8] cursor-pointer focus:border-[#202a31] outline-none transition-colors"
                >
                  {BERLIN_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d} (Berlin)
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-[#d8ded9] flex justify-end">
                <button
                  type="submit"
                  className="apple-press inline-flex items-center gap-2 rounded-sm bg-[#202a31] px-6 py-3 text-[13px] font-normal tracking-[0.02em] text-[#fbfbf8] hover:bg-[#2d3a43] transition-colors cursor-pointer"
                >
                  <span>Weiter zu Konditionen</span>
                  <ArrowRight className="size-3.5 stroke-[1.5]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Konditionen & Beschreibung */}
          {step === 2 && (
            <div className="border border-[#d8ded9] bg-[#fbfbf8] p-6 sm:p-8 rounded-sm space-y-6">
              <div className="border-b border-[#d8ded9] pb-3">
                <h2
                  className="text-lg font-normal text-[#202a31] tracking-[-0.015em]"
                  style={{ fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif" }}
                >
                  2. Konditionen & Aufgaben
                </h2>
                <p className="text-[12.5px] text-[#7e8a84] font-light mt-0.5">
                  Wie wird gearbeitet und was verdient das Talent?
                </p>
              </div>

              {/* Employment Type Chips */}
              <div className="space-y-2">
                <label className="block text-[11px] font-medium uppercase tracking-[0.16em] text-[#7e8a84]">
                  Anstellungsart *
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {JOB_TYPES.map((t) => {
                    const isSelected = formData.employmentType === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setFormData({ ...formData, employmentType: t })}
                        className={`px-3 py-1.5 rounded-sm text-[12px] font-normal transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#202a31] text-[#fbfbf8]'
                            : 'border border-[#d8ded9] text-[#7e8a84] hover:text-[#202a31] hover:border-[#202a31] bg-transparent'
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Wage Selector & Presets */}
              <div className="space-y-2">
                <label className="block text-[11px] font-medium uppercase tracking-[0.16em] text-[#7e8a84]">
                  Stundenlohn / Vergütung *
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {WAGE_PRESETS.map((w) => {
                    const isSelected = formData.wage === w;
                    return (
                      <button
                        key={w}
                        type="button"
                        onClick={() => setFormData({ ...formData, wage: w })}
                        className={`px-3 py-1 rounded-sm text-[12px] font-mono transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#202a31] text-[#fbfbf8]'
                            : 'border border-[#d8ded9] text-[#7e8a84] hover:text-[#202a31] hover:border-[#202a31] bg-transparent'
                        }`}
                      >
                        {w}
                      </button>
                    );
                  })}
                </div>
                <input
                  type="text"
                  required
                  value={formData.wage}
                  onChange={(e) => setFormData({ ...formData, wage: e.target.value })}
                  placeholder="z. B. 16,50 € / Std."
                  className="w-full h-11 px-3.5 text-[14px] text-[#202a31] placeholder:text-[#7e8a84]/50 border border-[#d8ded9] rounded-sm bg-[#fbfbf8] focus:border-[#202a31] outline-none transition-colors font-mono"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="block text-[11px] font-medium uppercase tracking-[0.16em] text-[#7e8a84]">
                  Aufgaben & Anforderungen *
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Beschreibe kurz die typischen Aufgaben, Schichten (z. B. Wochenende, abends) und was Bewerber mitbringen sollten..."
                  className="w-full p-3.5 text-[14px] text-[#202a31] placeholder:text-[#7e8a84]/50 border border-[#d8ded9] rounded-sm bg-[#fbfbf8] focus:border-[#202a31] outline-none leading-relaxed resize-y min-h-[130px] transition-colors"
                />
              </div>

              <div className="pt-3 border-t border-[#d8ded9] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 text-[12.5px] text-[#7e8a84] hover:text-[#202a31] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="size-3.5 stroke-[1.5]" />
                  <span>Zurück</span>
                </button>
                <button
                  type="submit"
                  className="apple-press inline-flex items-center gap-2 rounded-sm bg-[#202a31] px-6 py-3 text-[13px] font-normal tracking-[0.02em] text-[#fbfbf8] hover:bg-[#2d3a43] transition-colors cursor-pointer"
                >
                  <span>Weiter zur Vorschau</span>
                  <ArrowRight className="size-3.5 stroke-[1.5]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Kontakt & Veröffentlichung */}
          {step === 3 && (
            <div className="border border-[#d8ded9] bg-[#fbfbf8] p-6 sm:p-8 rounded-sm space-y-6">
              <div className="border-b border-[#d8ded9] pb-3">
                <h2
                  className="text-lg font-normal text-[#202a31] tracking-[-0.015em]"
                  style={{ fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif" }}
                >
                  3. Bewerbungsweg & Veröffentlichung
                </h2>
                <p className="text-[12.5px] text-[#7e8a84] font-light mt-0.5">
                  Wie treten Bewerber direkt mit dir in Kontakt?
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-medium uppercase tracking-[0.16em] text-[#7e8a84]">
                  Bewerbungs-Link oder E-Mail *
                </label>
                <input
                  type="text"
                  required
                  value={formData.applyUrl}
                  onChange={(e) => setFormData({ ...formData, applyUrl: e.target.value })}
                  placeholder="https://deine-website.de/jobs oder jobs@dein-betrieb.de"
                  className="w-full h-11 px-3.5 text-[14px] text-[#202a31] placeholder:text-[#7e8a84]/50 border border-[#d8ded9] rounded-sm bg-[#fbfbf8] focus:border-[#202a31] outline-none transition-colors"
                />
                <p className="text-[11.5px] text-[#7e8a84] font-light">
                  Bewerber klicken auf &bdquo;Jetzt bewerben&ldquo; und gelangen direkt zu deiner Kontaktadresse.
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-medium uppercase tracking-[0.16em] text-[#7e8a84]">
                  Verwaltungs-E-Mail (optional für Bestätigung)
                </label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="kontakt@dein-betrieb.de"
                  className="w-full h-11 px-3.5 text-[14px] text-[#202a31] placeholder:text-[#7e8a84]/50 border border-[#d8ded9] rounded-sm bg-[#fbfbf8] focus:border-[#202a31] outline-none transition-colors"
                />
              </div>

              {/* Trust Badge */}
              <div className="rounded-sm border border-[#d8ded9] bg-[#f4f4ee]/60 p-4 flex items-start gap-3 text-[12.5px] text-[#5a6460]">
                <ShieldCheck className="size-4 text-[#202a31] shrink-0 mt-0.5 stroke-[1.5]" />
                <div>
                  <p className="font-medium text-[#202a31]">
                    100% Direktkontakt Garantie
                  </p>
                  <p className="mt-0.5 font-light leading-relaxed">
                    Deine Anzeige wird ohne Zwischenhändler und ohne Zeitarbeitsagenturen auf JOBROOFS gelistet. Talente treten unmittelbar mit dir in Kontakt.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#d8ded9] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1.5 text-[12.5px] text-[#7e8a84] hover:text-[#202a31] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="size-3.5 stroke-[1.5]" />
                  <span>Zurück</span>
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="apple-press inline-flex items-center gap-2 rounded-sm bg-[#202a31] px-6 py-3 text-[13px] font-normal tracking-[0.02em] text-[#fbfbf8] hover:bg-[#2d3a43] disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {loading ? 'Wird übermittelt...' : (
                    <>
                      <span>Anzeige jetzt veröffentlichen</span>
                      <ArrowRight className="size-3.5 stroke-[1.5]" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Right Column: Architectural Live Ledger Preview (5 Cols) */}
        <div className="lg:col-span-5 sticky top-24 space-y-3">
          <div className="flex items-center justify-between text-[10.5px] font-medium uppercase tracking-[0.2em] text-[#7e8a84] px-1">
            <span>LIVE VORSCHAU DER ANZEIGE</span>
            <span className="font-mono text-[10px] text-[#7e8a84]/80">VERIFIED DIRECT</span>
          </div>

          {/* Authentic JOBROOFS Silent Luxury Card */}
          <div className="rounded-sm border border-[#d8ded9] bg-[#fbfbf8] p-6 transition-all space-y-4">
            {/* Top Brand & Compensation Row */}
            <div className="flex items-baseline justify-between border-b border-[#d8ded9] pb-4">
              <div>
                <div className="text-[10px] uppercase tracking-[0.16em] text-[#7e8a84] font-medium">
                  {formData.company || 'Dein Unternehmen'} &middot; {formData.district}
                </div>
                <h3
                  className="text-xl font-normal text-[#202a31] tracking-[-0.015em] mt-1 line-clamp-1"
                  style={{ fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif" }}
                >
                  {formData.title || 'Specialty Barista & Gastronomy'}
                </h3>
              </div>
              <div className="text-right shrink-0 pl-3">
                <div className="text-[15px] font-mono text-[#202a31] font-normal">
                  {formData.wage}
                </div>
                <div className="text-[9.5px] uppercase tracking-[0.14em] text-[#7e8a84] mt-0.5">
                  {formData.employmentType.split(' ')[0]}
                </div>
              </div>
            </div>

            {/* Description Preview in Editorial Ledger Style */}
            <div className="text-[13.5px] text-[#5a6460] font-light leading-relaxed line-clamp-5 min-h-[90px]">
              {formData.description || 'Hier erscheint die Aufgabenbeschreibung für Berliner Talente, sobald du sie im Formular eingibst...'}
            </div>

            {/* Footer Action Preview */}
            <div className="pt-4 border-t border-[#d8ded9] flex items-center justify-between text-[11.5px] text-[#7e8a84] font-light">
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-[#7e8a84]" />
                <span>Direktkontakt &middot; Berlin {formData.district}</span>
              </span>
              <span className="text-[12px] font-normal text-[#202a31]">
                Jetzt bewerben &rarr;
              </span>
            </div>
          </div>

          {/* Micro Helper Note */}
          <div className="text-[11px] text-[#7e8a84] font-light px-1">
            Diese Vorschau entspricht exakt der Darstellung im Berliner Job-Feed.
          </div>
        </div>
      </div>
    </div>
  );
}
