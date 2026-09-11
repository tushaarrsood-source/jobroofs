'use client';

import { useState } from 'react';
import Link from '@/components/ui/link';
import {
  Building2,
  Briefcase,
  MapPin,
  Euro,
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Eye,
  Clock,
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

    // Step 3 submission
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
      <div className="rounded-[28px] border border-black/[0.08] bg-white p-8 sm:p-12 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-w-xl mx-auto">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#e8f1ec] text-[#1b4332] shadow-xs">
          <CheckCircle2 className="size-7" />
        </div>
        <h2 className="mt-5 text-2xl sm:text-3xl font-extrabold text-[#111816] tracking-[-0.03em]">
          Job erfolgreich übermittelt!
        </h2>
        <p className="mt-2 text-sm text-[#5c6863] leading-relaxed max-w-md mx-auto">
          Deine Anzeige für <strong>{formData.title}</strong> bei <strong>{formData.company}</strong> wurde empfangen und wird direkt für Bewerber in Berlin freigeschaltet.
        </p>

        <div className="mt-8 pt-6 border-t border-black/[0.06] flex flex-col sm:flex-row justify-center gap-3">
          <Link
            href="/"
            className="apple-press rounded-full bg-[#1b4332] px-6 py-3 text-xs font-bold text-white hover:bg-[#122f23] transition-all shadow-xs cursor-pointer"
          >
            Zur Job-Übersicht
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
            className="apple-press rounded-full border border-black/[0.1] bg-white px-5 py-3 text-xs font-semibold text-[#111816] hover:bg-black/[0.03] transition-all cursor-pointer"
          >
            Weiteren Job schalten
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Step Tracker */}
      <div className="border-b border-black/[0.06] pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-[#1b4332] bg-[#e8f1ec] px-3 py-1 rounded-full mb-2 border border-[#1b4332]/10">
              <Sparkles className="size-3" />
              <span>EMPLOYER WORKSTATION</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] text-[#111816]">
              Job in Berlin schalten
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#5c6863]">
              Erreiche motivierte Studierende, Aushilfen und Fachkräfte direkt in deinem Kiez.
            </p>
          </div>

          {/* Apple Segmented Step Indicator */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#f5f5f7] border border-black/[0.04] self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setStep(1)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                step === 1
                  ? 'bg-white text-[#111816] shadow-xs'
                  : 'text-[#86868b] hover:text-[#111816]'
              }`}
            >
              1. Profil
            </button>
            <button
              type="button"
              onClick={() => {
                if (formData.title && formData.company) setStep(2);
              }}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                step === 2
                  ? 'bg-white text-[#111816] shadow-xs'
                  : 'text-[#86868b] hover:text-[#111816]'
              }`}
            >
              2. Konditionen
            </button>
            <button
              type="button"
              onClick={() => {
                if (formData.title && formData.company && formData.description) setStep(3);
              }}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                step === 3
                  ? 'bg-white text-[#111816] shadow-xs'
                  : 'text-[#86868b] hover:text-[#111816]'
              }`}
            >
              3. Kontakt & Vorschau
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Form Left, Live Card Preview Right */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left Form Workstation (7 Cols) */}
        <form onSubmit={handleNext} className="lg:col-span-7 space-y-6">
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3.5 text-xs font-medium text-red-700 border border-red-200 animate-shake">
              <AlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Basisdaten */}
          {step === 1 && (
            <div className="rounded-[24px] border border-black/[0.08] bg-white p-6 sm:p-7 shadow-[0_2px_12px_rgb(0,0,0,0.02)] space-y-5">
              <div className="border-b border-black/[0.05] pb-3">
                <h2 className="text-base font-bold text-[#111816] tracking-[-0.02em]">
                  1. Basisdaten der Stelle
                </h2>
                <p className="text-xs text-[#5c6863]">
                  Worum geht es und wer sucht Verstärkung?
                </p>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-xs font-semibold text-[#111816] mb-1.5">
                  Stellenbezeichnung *
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#86868b]" />
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="z. B. Specialty Barista, Servicekraft, Event-Aushilfe"
                    className="apple-input w-full h-11 pl-10 pr-3 text-xs sm:text-sm text-[#111816] placeholder:text-[#86868b]"
                  />
                </div>
              </div>

              {/* Company Input */}
              <div>
                <label className="block text-xs font-semibold text-[#111816] mb-1.5">
                  Arbeitgeber / Unternehmen *
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#86868b]" />
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="z. B. Café Morgenstern GmbH"
                    className="apple-input w-full h-11 pl-10 pr-3 text-xs sm:text-sm text-[#111816] placeholder:text-[#86868b]"
                  />
                </div>
              </div>

              {/* District Selection Chips */}
              <div>
                <label className="block text-xs font-semibold text-[#111816] mb-1.5">
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
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#1b4332] text-white shadow-xs'
                            : 'bg-[#f5f5f7] text-[#5c6863] hover:bg-black/[0.05]'
                        }`}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>

                {/* Dropdown for All Districts */}
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#86868b]" />
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="apple-input w-full h-10 pl-10 pr-3 text-xs text-[#111816] bg-white cursor-pointer"
                  >
                    {BERLIN_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d} (Berlin)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="apple-press inline-flex items-center gap-1.5 rounded-full bg-[#1b4332] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#122f23] transition-all shadow-xs cursor-pointer"
                >
                  <span>Weiter zu Konditionen</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Konditionen & Beschreibung */}
          {step === 2 && (
            <div className="rounded-[24px] border border-black/[0.08] bg-white p-6 sm:p-7 shadow-[0_2px_12px_rgb(0,0,0,0.02)] space-y-5">
              <div className="border-b border-black/[0.05] pb-3">
                <h2 className="text-base font-bold text-[#111816] tracking-[-0.02em]">
                  2. Konditionen & Aufgaben
                </h2>
                <p className="text-xs text-[#5c6863]">
                  Wie wird gearbeitet und was verdient die Aushilfe?
                </p>
              </div>

              {/* Employment Type Chips */}
              <div>
                <label className="block text-xs font-semibold text-[#111816] mb-1.5">
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
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#1b4332] text-white shadow-xs'
                            : 'bg-[#f5f5f7] text-[#5c6863] hover:bg-black/[0.05]'
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Wage Selector & Presets */}
              <div>
                <label className="block text-xs font-semibold text-[#111816] mb-1.5">
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
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#1b4332] text-white shadow-xs'
                            : 'bg-[#f5f5f7] text-[#5c6863] hover:bg-black/[0.05]'
                        }`}
                      >
                        {w}
                      </button>
                    );
                  })}
                </div>
                <div className="relative">
                  <Euro className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#86868b]" />
                  <input
                    type="text"
                    required
                    value={formData.wage}
                    onChange={(e) => setFormData({ ...formData, wage: e.target.value })}
                    placeholder="z. B. 16,50 € / Std."
                    className="apple-input w-full h-11 pl-10 pr-3 text-xs sm:text-sm text-[#111816]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-[#111816] mb-1.5">
                  Aufgaben & Anforderungen *
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Beschreibe kurz die typischen Aufgaben, Schichten (z. B. Wochenende, abends) und was Bewerber mitbringen sollten..."
                  className="apple-input w-full p-3.5 text-xs sm:text-sm text-[#111816] placeholder:text-[#86868b] leading-relaxed resize-y"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#5c6863] hover:text-[#111816] cursor-pointer"
                >
                  <ArrowLeft className="size-3.5" />
                  <span>Zurück</span>
                </button>
                <button
                  type="submit"
                  className="apple-press inline-flex items-center gap-1.5 rounded-full bg-[#1b4332] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#122f23] transition-all shadow-xs cursor-pointer"
                >
                  <span>Weiter zur Vorschau</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Kontakt & Veröffentlichung */}
          {step === 3 && (
            <div className="rounded-[24px] border border-black/[0.08] bg-white p-6 sm:p-7 shadow-[0_2px_12px_rgb(0,0,0,0.02)] space-y-5">
              <div className="border-b border-black/[0.05] pb-3">
                <h2 className="text-base font-bold text-[#111816] tracking-[-0.02em]">
                  3. Bewerbungsweg & Veröffentlichung
                </h2>
                <p className="text-xs text-[#5c6863]">
                  Wie sollen sich Interessierte bei dir bewerben?
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111816] mb-1">
                  Bewerbungs-Link oder Bewerbungs-E-Mail *
                </label>
                <input
                  type="text"
                  required
                  value={formData.applyUrl}
                  onChange={(e) => setFormData({ ...formData, applyUrl: e.target.value })}
                  placeholder="https://deine-website.de/jobs oder jobs@dein-betrieb.de"
                  className="apple-input w-full h-11 px-3 text-xs sm:text-sm text-[#111816]"
                />
                <p className="mt-1 text-[11px] text-[#5c6863]">
                  Bewerber klicken auf „Jetzt bewerben“ und gelangen direkt dorthin.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111816] mb-1">
                  Deine E-Mail-Adresse (für Freischaltung & Verwaltung)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#86868b]" />
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    placeholder="kontakt@dein-betrieb.de"
                    className="apple-input w-full h-11 pl-10 pr-3 text-xs sm:text-sm text-[#111816]"
                  />
                </div>
              </div>

              {/* Trust Badge */}
              <div className="rounded-xl bg-[#fafbfa] p-4 border border-black/[0.05] flex items-start gap-3 text-xs text-[#5c6863]">
                <ShieldCheck className="size-5 text-[#1b4332] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#111816]">
                    100% Direktkontakt Garantie
                  </p>
                  <p className="mt-0.5 leading-relaxed">
                    Deine Anzeige wird ohne Zwischenhändler und ohne Zeitarbeitsagenturen auf JOBROOFS gelistet. Bewerber treten unmittelbar mit dir in Verbindung.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#5c6863] hover:text-[#111816] cursor-pointer"
                >
                  <ArrowLeft className="size-3.5" />
                  <span>Zurück</span>
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="apple-press inline-flex items-center gap-2 rounded-full bg-[#1b4332] px-7 py-3 text-xs font-bold text-white hover:bg-[#122f23] disabled:opacity-50 transition-all shadow-[0_2px_10px_rgba(27,67,50,0.25)] cursor-pointer"
                >
                  {loading ? 'Wird übermittelt...' : (
                    <>
                      <span>Anzeige jetzt veröffentlichen</span>
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Right Column: Interactive Live Job Card Preview (5 Cols) */}
        <div className="lg:col-span-5 sticky top-24 space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Eye className="size-4 text-[#1b4332]" />
            <span className="text-[11px] font-extrabold tracking-widest uppercase text-[#1b4332]">
              LIVE VORSCHAU DER ANZEIGE
            </span>
          </div>

          {/* Authentic JOBROOFS Preview Card */}
          <div className="rounded-[24px] border border-black/[0.08] bg-white p-6 shadow-[0_6px_24px_rgba(0,0,0,0.04)] transition-all">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="pt-0.5">
                  <JobroofsMark size={28} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-[#111816] tracking-tight line-clamp-1">
                    {formData.title || 'Stellenbezeichnung hier'}
                  </h3>
                  <p className="text-xs font-medium text-[#5c6863] truncate">
                    {formData.company || 'Dein Unternehmen'} &middot; {formData.district} (Berlin)
                  </p>
                </div>
              </div>
            </div>

            {/* Pills row */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f1ec] px-2.5 py-1 font-semibold text-[#1b4332]">
                <Euro className="size-3" />
                <span>{formData.wage}</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#f5f5f7] px-2.5 py-1 font-medium text-[#5c6863]">
                <Clock className="size-3" />
                <span>{formData.employmentType}</span>
              </span>
            </div>

            {/* Description Preview */}
            <div className="mt-4 text-xs text-[#5c6863] line-clamp-4 leading-relaxed bg-[#fafbfa] p-3 rounded-xl border border-black/[0.03]">
              {formData.description || 'Hier erscheint die Aufgabenbeschreibung für Bewerber, sobald du sie im Formular eingibst...'}
            </div>

            {/* Simulated Apply Button */}
            <div className="mt-5 pt-4 border-t border-black/[0.05] flex items-center justify-between text-xs">
              <span className="text-[11px] text-[#86868b]">
                Direktkontakt &middot; Berlin
              </span>
              <span className="rounded-full bg-[#1b4332]/10 px-3 py-1 font-bold text-[#1b4332] text-[11px]">
                Jetzt bewerben &rarr;
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
