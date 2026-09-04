'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  Home,
  CheckCircle2,
  ShieldCheck,
  Building,
  AlertCircle,
  ArrowRight,
  Loader2,
  Euro,
  Image as ImageIcon,
  Calendar,
  MapPin,
} from 'lucide-react';
import { housingTypeLabels, type HousingListingType } from '@/lib/domain/housing-types';
import { useTranslation } from '@/lib/i18n/language-context';

const HousingMap = dynamic(() => import('@/components/housing-map').then((mod) => mod.HousingMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-xl border border-slate-200 bg-slate-100/70 text-xs font-semibold text-slate-500">
      Berlin Karte lädt...
    </div>
  ),
});

const BERLIN_DISTRICTS = [
  'Mitte',
  'Friedrichshain',
  'Kreuzberg',
  'Neukölln',
  'Pankow',
  'Prenzlauer Berg',
  'Charlottenburg-Wilmersdorf',
  'Tempelhof-Schöneberg',
  'Lichtenberg',
  'Treptow-Köpenick',
  'Steglitz-Zehlendorf',
  'Spandau',
  'Reinickendorf',
  'Wedding',
  'Moabit',
];

export function HousingListingForm() {
  const { isDe } = useTranslation();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    listingType: 'wg_room' as HousingListingType,
    district: 'Friedrichshain',
    postcode: '10245',
    neighborhood: '',
    streetAddress: '',
    kaltmieteEur: 450,
    nebenkostenEur: 120,
    warmmieteEur: 570,
    kautionEur: 1350,
    roomSqm: 20,
    totalRooms: 3,
    floorLevel: 2,
    furnished: 'fully' as 'unfurnished' | 'partially' | 'fully',
    anmeldungPossible: true,
    subletAuthorized: true,
    contractType: 'fixed_term' as 'fixed_term' | 'open_ended',
    moveInDate: '2026-10-01',
    moveOutDate: '2027-03-31',
    minStayMonths: 6,
    energyClass: 'C',
    heatingSource: 'Fernwärme',
    buildingYear: 1910,
    images: [] as string[],
    description: '',
    contactMethod: 'email' as 'email' | 'phone',
    contactEmail: '',
    contactName: '',
    contactPhone: '',
    tier: 'standard' as 'standard' | 'premium',
  });

  const [imageInput, setImageInput] = useState('');
  const [agreedToDisclaimer, setAgreedToDisclaimer] = useState(false);

  // Live memoized listing for interactive map preview
  const previewListingForMap = useMemo(() => {
    return {
      id: 'form-preview-live',
      title: formData.title || 'Wohnungsvorschau',
      listingType: formData.listingType,
      district: formData.district,
      postcode: formData.postcode,
      neighborhood: formData.neighborhood,
      streetAddress: formData.streetAddress,
      warmmieteEur: formData.warmmieteEur || 750,
      kaltmieteEur: formData.kaltmieteEur || 600,
      nebenkostenEur: formData.nebenkostenEur || 150,
      kautionEur: formData.kautionEur || 1800,
      roomSqm: formData.roomSqm || 20,
      totalRooms: formData.totalRooms || 1,
      furnished: formData.furnished,
      anmeldungPossible: formData.anmeldungPossible,
      subletAuthorized: formData.subletAuthorized,
      contractType: formData.contractType,
      moveInDate: formData.moveInDate || '',
      images: formData.images || [],
      description: formData.description || '',
      contactMethod: 'email' as const,
      contactEmail: formData.contactEmail || 'user@example.com',
      publicationState: 'draft' as const,
      firstSeenAt: new Date().toISOString(),
      expiresAt: new Date().toISOString(),
    };
  }, [
    formData.title,
    formData.listingType,
    formData.district,
    formData.postcode,
    formData.neighborhood,
    formData.streetAddress,
    formData.warmmieteEur,
    formData.kaltmieteEur,
    formData.nebenkostenEur,
    formData.kautionEur,
    formData.roomSqm,
    formData.totalRooms,
    formData.furnished,
    formData.anmeldungPossible,
    formData.subletAuthorized,
    formData.contractType,
    formData.moveInDate,
    formData.images,
    formData.description,
    formData.contactEmail,
  ]);

  // Verification step state
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  // Auto-calculate warm rent
  const updateKaltmiete = (val: number) => {
    const kalt = Number(val) || 0;
    const warm = kalt + (Number(formData.nebenkostenEur) || 0);
    const maxKaution = kalt * 3;
    setFormData((prev) => ({
      ...prev,
      kaltmieteEur: kalt,
      warmmieteEur: warm,
      kautionEur: Math.min(prev.kautionEur, maxKaution) || maxKaution,
    }));
  };

  const updateNebenkosten = (val: number) => {
    const nk = Number(val) || 0;
    const warm = (Number(formData.kaltmieteEur) || 0) + nk;
    setFormData((prev) => ({
      ...prev,
      nebenkostenEur: nk,
      warmmieteEur: warm,
    }));
  };

  const addImage = () => {
    if (imageInput.trim() && imageInput.startsWith('http')) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageInput.trim()],
      }));
      setImageInput('');
    }
  };

  const removeImage = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch('/api/housing/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payload: formData,
          submitterEmail: formData.contactEmail,
        }),
      });

      const data = await res.json() as Record<string, any>;
      if (!res.ok) {
        if (data.reasons && Array.isArray(data.reasons)) {
          setErrorMsg(data.reasons.join('\n'));
        } else {
          setErrorMsg(data.error || 'Fehler beim Absenden des Inserats.');
        }
        setLoading(false);
        return;
      }

      setSubmissionId(data.submissionId);
    } catch (err) {
      setErrorMsg('Netzwerkfehler. Bitte versuche es erneut.');
    } finally {
      setLoading(false);
    }
  };

  // Verification code submit
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionId || !verifyCode.trim()) return;
    setVerifying(true);
    setVerifyError(null);

    try {
      const res = await fetch('/api/housing/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId,
          code: verifyCode.trim(),
        }),
      });

      const data = await res.json() as Record<string, any>;
      if (!res.ok) {
        setVerifyError(data.error || 'Ungültiger oder abgelaufener Code.');
        setVerifying(false);
        return;
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        router.push('/wohnen?posted=true');
      }
    } catch {
      setVerifyError('Verbindungsfehler bei der Verifizierung.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Info & Type */}
        <section className="rounded-xl border border-slate-200/90 bg-white p-6 md:p-8 shadow-xs">
          <h2 className="text-base font-bold text-slate-900">
            1. {isDe ? 'Art des Inserats & Standort' : 'Listing Type & Location'}
          </h2>

          <div className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                {isDe ? 'Titel des Inserats' : 'Listing Title'} *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={isDe ? 'z.B. Helles WG-Zimmer am Boxhagener Kiez mit Balkon' : 'e.g. Sunny room in shared flat with balcony'}
                className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  {isDe ? 'Wohnform' : 'Type'} *
                </label>
                <select
                  value={formData.listingType}
                  onChange={(e) => setFormData({ ...formData, listingType: e.target.value as any })}
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition"
                >
                  {Object.entries(housingTypeLabels).map(([k, v]) => (
                    <option key={k} value={k}>
                      {isDe ? v.de : v.en}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  {isDe ? 'Bezirk' : 'District'} *
                </label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition"
                >
                  {BERLIN_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  PLZ (Berlin) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={5}
                  value={formData.postcode}
                  onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                  placeholder="10245"
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  {isDe ? 'Kiez / Viertel' : 'Kiez / Neighborhood'}
                </label>
                <input
                  type="text"
                  value={formData.neighborhood}
                  onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                  placeholder={isDe ? 'z.B. Boxhagener Kiez' : 'e.g. Wrangelkiez'}
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  {isDe ? 'Straße (optional)' : 'Street (optional)'}
                </label>
                <input
                  type="text"
                  value={formData.streetAddress}
                  onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                  placeholder="z.B. Gärtnerstr."
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition"
                />
              </div>
            </div>

            {/* Live Location Map Preview */}
            <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100/80 px-3.5 py-2.5 text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <MapPin className="size-3.5 text-blue-600" />
                  <span>{isDe ? 'Standortvorschau auf der Berlin-Karte (Live)' : 'Live Location Map Preview'}</span>
                </div>
                <span className="text-[11px] font-medium text-slate-500">
                  {formData.district} {formData.postcode ? `· PLZ ${formData.postcode}` : ''}
                </span>
              </div>
              <div className="h-44 w-full">
                <HousingMap
                  listings={[previewListingForMap]}
                  miniMode
                  centerSingleListing
                  showCardOverlay={false}
                  className="h-full w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Financials & Deposit Compliance */}
        <section className="rounded-xl border border-slate-200/90 bg-white p-6 md:p-8 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              2. {isDe ? 'Miete & Kaution (§ 551 BGB konform)' : 'Rent & Deposit (BGB compliant)'}
            </h2>
            <span className="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[11px] font-bold text-blue-700">
              Preistransparenz
            </span>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                {isDe ? 'Kaltmiete (€)' : 'Cold rent (€)'} *
              </label>
              <input
                type="number"
                required
                min={150}
                value={formData.kaltmieteEur}
                onChange={(e) => updateKaltmiete(Number(e.target.value))}
                className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                {isDe ? 'Nebenkosten (€)' : 'Utilities (€)'}
              </label>
              <input
                type="number"
                min={0}
                value={formData.nebenkostenEur}
                onChange={(e) => updateNebenkosten(Number(e.target.value))}
                className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                {isDe ? 'Warmmiete (€ gesamt)' : 'Warm rent (€ total)'} *
              </label>
              <input
                type="number"
                required
                value={formData.warmmieteEur}
                onChange={(e) => setFormData({ ...formData, warmmieteEur: Number(e.target.value) })}
                className="mt-1.5 h-11 w-full rounded-xl border border-blue-300 bg-blue-50/40 px-3.5 text-sm font-bold text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition font-mono"
              />
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                {isDe ? 'Kaution (€)' : 'Deposit (€)'}
              </label>
              <input
                type="number"
                min={0}
                max={formData.kaltmieteEur * 3}
                value={formData.kautionEur}
                onChange={(e) => setFormData({ ...formData, kautionEur: Number(e.target.value) })}
                className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition font-mono"
              />
              <p className="mt-1 text-[11px] text-slate-500">
                {isDe
                  ? `Gesetzlich maximal 3 Kaltmieten: ${formData.kaltmieteEur * 3} €`
                  : `Legally capped at 3 net cold rents: €${formData.kaltmieteEur * 3}`}
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Space & Amenities */}
        <section className="rounded-xl border border-slate-200/90 bg-white p-6 md:p-8 shadow-xs">
          <h2 className="text-base font-bold text-slate-900">
            3. {isDe ? 'Zimmergröße & Möblierung' : 'Room Size & Furnishing'}
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                {isDe ? 'Größe (m²)' : 'Size (sqm)'} *
              </label>
              <input
                type="number"
                required
                min={5}
                value={formData.roomSqm}
                onChange={(e) => setFormData({ ...formData, roomSqm: Number(e.target.value) })}
                className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                {isDe ? 'Zimmer in der Wohnung' : 'Rooms in flat'}
              </label>
              <input
                type="number"
                min={1}
                value={formData.totalRooms}
                onChange={(e) => setFormData({ ...formData, totalRooms: Number(e.target.value) })}
                className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                {isDe ? 'Möblierung' : 'Furnishing'}
              </label>
              <select
                value={formData.furnished}
                onChange={(e) => setFormData({ ...formData, furnished: e.target.value as any })}
                className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition"
              >
                <option value="fully">{isDe ? 'Voll möbliert' : 'Fully furnished'}</option>
                <option value="partially">{isDe ? 'Teilmöbliert' : 'Partially furnished'}</option>
                <option value="unfurnished">{isDe ? 'Unmöbliert' : 'Unfurnished'}</option>
              </select>
            </div>
          </div>
        </section>

        {/* Section 4: Legal & Anmeldung (The Berlin Core) */}
        <section className="rounded-xl border border-slate-200/90 bg-white p-6 md:p-8 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              4. {isDe ? 'Rechtliches & Anmeldung' : 'Legal & Anmeldung'}
            </h2>
            <ShieldCheck className="size-5 text-emerald-600" />
          </div>

          <div className="mt-5 space-y-3">
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4 transition hover:border-blue-500">
              <input
                type="checkbox"
                checked={formData.anmeldungPossible}
                onChange={(e) => setFormData({ ...formData, anmeldungPossible: e.target.checked })}
                className="mt-1 size-4 rounded accent-blue-600"
              />
              <div>
                <strong className="block text-sm font-bold text-slate-900">
                  {isDe ? 'Anmeldung ist möglich (Wohnungsgeberbestätigung nach § 19 BMG)' : 'Anmeldung possible (Wohnungsgeberbestätigung provided)'}
                </strong>
                <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">
                  {isDe
                    ? 'Bestätige, dass du dem Mieter die gesetzlich vorgeschriebene Bescheinigung für das Bürgeramt ausstellst.'
                    : 'Confirm that you will provide the mandatory landlord confirmation for official city registration.'}
                </p>
              </div>
            </label>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4 transition hover:border-blue-500">
              <input
                type="checkbox"
                checked={formData.subletAuthorized}
                onChange={(e) => setFormData({ ...formData, subletAuthorized: e.target.checked })}
                className="mt-1 size-4 rounded accent-blue-600"
              />
              <div>
                <strong className="block text-sm font-bold text-slate-900">
                  {isDe ? 'Untervermietung ist vom Eigentümer / Vermieter genehmigt' : 'Subletting authorized by landlord / owner'}
                </strong>
                <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">
                  {isDe
                    ? 'Schützt vor Kündigungen wegen unerlaubter Gebrauchsüberlassung (§ 540 BGB).'
                    : 'Protects both parties against unauthorized sublease termination.'}
                </p>
              </div>
            </label>
          </div>
        </section>

        {/* Section 5: Dates & Contract */}
        <section className="rounded-xl border border-slate-200/90 bg-white p-6 md:p-8 shadow-xs">
          <h2 className="text-base font-bold text-slate-900">
            5. {isDe ? 'Laufzeit & Daten' : 'Duration & Dates'}
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                {isDe ? 'Vertragsart' : 'Contract Type'} *
              </label>
              <select
                value={formData.contractType}
                onChange={(e) => setFormData({ ...formData, contractType: e.target.value as any })}
                className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition"
              >
                <option value="fixed_term">{isDe ? 'Befristet (Zwischenmiete)' : 'Fixed-term'}</option>
                <option value="open_ended">{isDe ? 'Unbefristet (Dauerhaft)' : 'Open-ended'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                {isDe ? 'Einzugsdatum' : 'Move-in date'} *
              </label>
              <input
                type="date"
                required
                value={formData.moveInDate}
                onChange={(e) => setFormData({ ...formData, moveInDate: e.target.value })}
                className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition"
              />
            </div>

            {formData.contractType === 'fixed_term' ? (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  {isDe ? 'Auszugsdatum' : 'Move-out date'} *
                </label>
                <input
                  type="date"
                  required
                  value={formData.moveOutDate}
                  onChange={(e) => setFormData({ ...formData, moveOutDate: e.target.value })}
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition"
                />
              </div>
            ) : null}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                {isDe ? 'Mindestmietdauer (Monate)' : 'Min. stay (months)'}
              </label>
              <input
                type="number"
                min={1}
                value={formData.minStayMonths}
                onChange={(e) => setFormData({ ...formData, minStayMonths: Number(e.target.value) })}
                className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition font-mono"
              />
            </div>
          </div>
        </section>

        {/* Section 6: Photos & Description */}
        <section className="rounded-xl border border-slate-200/90 bg-white p-6 md:p-8 shadow-xs">
          <h2 className="text-base font-bold text-slate-900">
            6. {isDe ? 'Fotos & Beschreibung' : 'Photos & Description'}
          </h2>

          <div className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                {isDe ? 'Foto-URL hinzufügen (z.B. Unsplash, Imgur, Cloud)' : 'Add Photo URL'}
              </label>
              <div className="mt-1.5 flex gap-2">
                <input
                  type="url"
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="h-11 flex-1 rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition"
                />
                <button
                  type="button"
                  onClick={addImage}
                  className="h-11 rounded-xl bg-slate-900 px-4 text-xs font-bold text-white transition hover:bg-black cursor-pointer"
                >
                  {isDe ? 'Hinzufügen' : 'Add'}
                </button>
              </div>

              {formData.images.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="group relative size-20 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                      <img src={img} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute inset-0 flex items-center justify-center bg-black/60 text-xs font-bold text-white opacity-0 transition group-hover:opacity-100 cursor-pointer"
                      >
                        Löschen
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                {isDe ? 'Beschreibung der Wohnung & WG-Leben' : 'Description'} *
              </label>
              <textarea
                required
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={isDe ? 'Beschreibe das Zimmer, Mitbewohner, Kiez-Anbindung, Atmosphäre...' : 'Describe room, flatmates, transit links, atmosphere...'}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition"
              />
            </div>
          </div>
        </section>

        {/* Section 7: Contact Info */}
        <section className="rounded-xl border border-slate-200/90 bg-white p-6 md:p-8 shadow-xs">
          <h2 className="text-base font-bold text-slate-900">
            7. {isDe ? 'Kontaktdaten für Interessenten' : 'Contact Details'}
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                {isDe ? 'Dein Name / WG-Namen' : 'Name'} *
              </label>
              <input
                type="text"
                required
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                placeholder="z.B. Sarah & Felix"
                className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                {isDe ? 'Kontakt E-Mail (verifiziert)' : 'Contact Email'} *
              </label>
              <input
                type="email"
                required
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                placeholder="deine-email@posteo.de"
                className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition"
              />
            </div>
          </div>
        </section>

        {/* Section 8: Pricing, Platform Terms & Zero-Liability */}
        <section className="rounded-xl border border-slate-200/90 bg-white p-6 md:p-8 shadow-xs">
          <h2 className="text-base font-bold text-slate-900">
            8. {isDe ? 'Laufzeit, Schutzgebühr & Haftungsausschluss' : 'Duration, Listing Fee & Terms'}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {isDe
              ? 'Wähle deine Laufzeit. Die Schutzgebühr schützt unser Portal 100% vor Fake-Profilen und automatisierten Spam-Bots.'
              : 'Choose your duration. The protective fee keeps our portal 100% free of fake listings and spam bots.'}
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, tier: 'standard' })}
              className={`rounded-xl border p-4 text-left transition cursor-pointer ${
                formData.tier === 'standard'
                  ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-600'
                  : 'border-slate-200 bg-white hover:border-blue-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {isDe ? 'Standard (30 Tage)' : 'Standard (30 Days)'}
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {isDe ? '30 Tage aktiv · Automatischer Stopp' : '30 days active · Auto deactivation'}
                  </p>
                </div>
                <span className="rounded-md bg-blue-600/10 px-2.5 py-1 text-xs font-bold text-blue-700">
                  29 €
                </span>
              </div>
              <ul className="mt-3 space-y-1 text-xs text-slate-600 border-t border-slate-100 pt-2.5">
                <li>✓ {isDe ? '30 Tage Laufzeit auf Kiezkarte & Liste' : '30-day listing on map & search'}</li>
                <li>✓ {isDe ? '100% Direktkontakt von Suchenden' : '100% direct contact with applicants'}</li>
                <li>✓ {isDe ? 'Einmalzahlung (kein Abo)' : 'One-time payment (no subscription)'}</li>
              </ul>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, tier: 'premium' })}
              className={`rounded-xl border p-4 text-left transition cursor-pointer relative ${
                formData.tier === 'premium'
                  ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-600'
                  : 'border-slate-200 bg-white hover:border-blue-300'
              }`}
            >
              <span className="absolute -top-2.5 right-4 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-slate-950 shadow-xs">
                ⭐ {isDe ? 'Empfohlen' : 'Recommended'}
              </span>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {isDe ? 'Premium Plus (60 Tage)' : 'Premium Plus (60 Days)'}
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {isDe ? 'Volle 2 Monate · Top-Platzierung' : 'Full 2 months · Top placement'}
                  </p>
                </div>
                <span className="rounded-md bg-emerald-700/10 px-2.5 py-1 text-xs font-bold text-emerald-800">
                  49 €
                </span>
              </div>
              <ul className="mt-3 space-y-1 text-xs text-slate-600 border-t border-slate-100 pt-2.5">
                <li>✓ {isDe ? '60 Tage Laufzeit (volle 2 Monate live)' : '60-day duration (full 2 months)'}</li>
                <li>⭐ {isDe ? 'Ganz oben in den Suchergebnissen' : 'Top placement in search results'}</li>
                <li>✓ {isDe ? 'Hervorgehobener Pin auf der Kiezkarte' : 'Prioritized interactive map pin'}</li>
              </ul>
            </button>
          </div>

          <div className="mt-5 space-y-4">
            {/* Mandatory Liability Waiver */}
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-500">
              <input
                type="checkbox"
                required
                checked={agreedToDisclaimer}
                onChange={(e) => setAgreedToDisclaimer(e.target.checked)}
                className="mt-1 size-4 rounded accent-blue-600"
              />
              <span className="text-xs leading-relaxed text-slate-600">
                {isDe ? (
                  <>
                    <strong className="text-slate-900">Haftungsausschluss & Plattform-Bedingungen:</strong> Ich bestätige, dass alle Angaben wahrheitsgemäß sind und ich zur Vermietung/Untervermietung berechtigt bin. Ich nehme zur Kenntnis, dass JOBROOFS ein reines Online-Anzeigenportal (Schwarzes Brett) ist, keine Miet- oder Untermietverträge vermittelt oder abschließt und für Mieter, Vermieter oder Mietverhältnisse keinerlei Haftung übernimmt.
                  </>
                ) : (
                  <>
                    <strong className="text-slate-900">Liability Disclaimer & Platform Terms:</strong> I confirm all information is true and that I am legally authorized to offer this accommodation. I acknowledge that JOBROOFS is strictly an advertising directory / bulletin board, does not broker or execute tenancy contracts, and bears zero liability for landlords, tenants, or rental relationships.
                  </>
                )}
              </span>
            </label>
          </div>
        </section>

        {errorMsg ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
            {errorMsg}
          </div>
        ) : null}

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading || !agreedToDisclaimer}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-bold text-white transition hover:bg-blue-700 shadow-md shadow-blue-600/25 disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              {isDe ? 'Wird geprüft...' : 'Checking compliance...'}
            </>
          ) : (
            <>
              {isDe
                ? `Weiter zur Bestätigung & Zahlung (${formData.tier === 'premium' ? '49 €' : '29 €'})`
                : `Continue to Verification & Payment (${formData.tier === 'premium' ? '€49' : '€29'})`}
              <ArrowRight className="size-4" />
            </>
          )}
        </button>
      </form>

      {/* Verification Modal Dialog */}
      {submissionId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">
              {isDe ? 'E-Mail-Bestätigung' : 'Email Confirmation'}
            </h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              {isDe
                ? `Wir haben einen 6-stelligen Bestätigungscode an ${formData.contactEmail} gesendet.`
                : `We sent a 6-digit confirmation code to ${formData.contactEmail}.`}
            </p>

            <form onSubmit={handleVerify} className="mt-5 space-y-4">
              <input
                type="text"
                required
                maxLength={6}
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
                placeholder="123456"
                className="h-12 w-full text-center font-mono text-2xl tracking-widest rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
              />

              {verifyError ? (
                <p className="text-xs text-red-600 font-semibold">{verifyError}</p>
              ) : null}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSubmissionId(null)}
                  className="h-10 flex-1 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  {isDe ? 'Zurück' : 'Back'}
                </button>
                <button
                  type="submit"
                  disabled={verifying || verifyCode.length < 6}
                  className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-600 text-xs font-bold text-white transition hover:bg-blue-700 disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {verifying ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : null}
                  {isDe ? 'Bestätigen & Weiter' : 'Confirm & Proceed'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
