'use client';

import { useState } from 'react';
import Link from '@/components/ui/link';
import { Building2, Briefcase, MapPin, Euro, Mail, FileText, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

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

const JOB_TYPES = [
  'Minijob (bis 538 €)',
  'Teilzeit',
  'Werkstudent',
  'Kurzfristige Aushilfe',
  'Vollzeit',
];

export function SimplePostJobForm() {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    district: 'Mitte',
    employmentType: 'Minijob (bis 538 €)',
    wage: '15,00 € / Std.',
    applyUrl: '',
    contactEmail: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/employer/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submitterEmail: formData.contactEmail,
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
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-xs">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="size-6" />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-zinc-900">Anzeige erfolgreich übermittelt!</h2>
        <p className="mt-2 text-sm text-zinc-600 max-w-md mx-auto">
          Wir haben eine Bestätigung an <strong>{formData.contactEmail}</strong> gesendet. Deine Anzeige
          wird nach kurzer Prüfung direkt für Bewerber in Berlin freigeschaltet.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/"
            className="rounded-xl bg-[#e33525] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#c92c1d] transition-colors"
          >
            Zurück zu allen Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Job in Berlin schalten</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Erreiche Studierende und Aushilfen in deinem Kiez. Direktkontakt ohne Zeitarbeit.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-xs font-medium text-red-700 border border-red-200">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Title & Company */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
            Stellenbezeichnung *
          </label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="z.B. Barista, Servicekraft, Küchenhilfe"
              className="w-full h-11 pl-9 pr-3 rounded-xl border border-zinc-200 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#e33525] transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
            Arbeitgeber / Unternehmen *
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
            <input
              type="text"
              required
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="z.B. Café Mitte GmbH"
              className="w-full h-11 pl-9 pr-3 rounded-xl border border-zinc-200 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#e33525] transition-all"
            />
          </div>
        </div>
      </div>

      {/* District, Employment, Wage */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
            Berliner Bezirk *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
            <select
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              className="w-full h-11 pl-9 pr-3 rounded-xl border border-zinc-200 text-sm text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#e33525] transition-all"
            >
              {BERLIN_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
            Anstellungsart *
          </label>
          <select
            value={formData.employmentType}
            onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
            className="w-full h-11 px-3 rounded-xl border border-zinc-200 text-sm text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#e33525] transition-all"
          >
            {JOB_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
            Stundenlohn / Vergütung *
          </label>
          <div className="relative">
            <Euro className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
            <input
              type="text"
              required
              value={formData.wage}
              onChange={(e) => setFormData({ ...formData, wage: e.target.value })}
              placeholder="z.B. 15,00 € / Std."
              className="w-full h-11 pl-9 pr-3 rounded-xl border border-zinc-200 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#e33525] transition-all"
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
          Aufgaben & Stellenbeschreibung *
        </label>
        <textarea
          required
          rows={5}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Beschreibe kurz die Tätigkeiten, Arbeitszeiten und was Bewerber mitbringen sollten..."
          className="w-full p-3 rounded-xl border border-zinc-200 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#e33525] transition-all"
        />
      </div>

      {/* Apply link / contact email */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
            Bewerbungs-Link oder Bewerbungs-E-Mail *
          </label>
          <input
            type="text"
            required
            value={formData.applyUrl}
            onChange={(e) => setFormData({ ...formData, applyUrl: e.target.value })}
            placeholder="https://firma.de/jobs oder jobs@firma.de"
            className="w-full h-11 px-3 rounded-xl border border-zinc-200 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#e33525] transition-all"
          />
          <p className="mt-1 text-[11px] text-zinc-500">
            Bewerber werden direkt hierhin weitergeleitet.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
            Deine E-Mail-Adresse (für Freischaltung) *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
            <input
              type="email"
              required
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              placeholder="name@unternehmen.de"
              className="w-full h-11 pl-9 pr-3 rounded-xl border border-zinc-200 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#e33525] transition-all"
            />
          </div>
        </div>
      </div>

      {/* Submit button */}
      <div className="border-t border-zinc-100 pt-4 flex items-center justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-[#e33525] px-6 py-3 text-sm font-bold text-white hover:bg-[#c92c1d] disabled:opacity-50 transition-all shadow-sm cursor-pointer"
        >
          {loading ? 'Wird übermittelt...' : (
            <>
              Anzeige jetzt veröffentlichen <ArrowRight className="size-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
