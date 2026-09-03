'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
} from 'lucide-react';
import { housingTypeLabels, type HousingListingType } from '@/lib/domain/housing-types';
import { useTranslation } from '@/lib/i18n/language-context';

const BERLIN_DISTRICTS = [
  'Mitte',
  'Friedrichshain',
  'Kreuzberg',
  'Neukölln',
  'Pankow',
  'Charlottenburg-Wilmersdorf',
  'Tempelhof-Schöneberg',
  'Lichtenberg',
  'Treptow-Köpenick',
  'Steglitz-Zehlendorf',
  'Spandau',
  'Reinickendorf',
  'Marzahn-Hellersdorf',
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
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
    ],
    description: '',
    contactMethod: 'email' as 'email' | 'in_platform',
    contactEmail: '',
    contactName: '',
    contactPhone: '',
  });

  // Photo URL input
  const [imageInput, setImageInput] = useState('');

  // Verification Dialog
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [agreedToDisclaimer, setAgreedToDisclaimer] = useState(false);

  // Auto-calculate warmmiete
  const updateKaltmiete = (val: number) => {
    const kalt = Number(val) || 0;
    const warm = kalt + (Number(formData.nebenkostenEur) || 0);
    const suggestedKaution = Math.min(kalt * 3, Number(formData.kautionEur) || kalt * 3);
    setFormData((prev) => ({
      ...prev,
      kaltmieteEur: kalt,
      warmmieteEur: warm,
      kautionEur: suggestedKaution,
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
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Basic Info & Type */}
        <section className="rounded-xl border border-foreground/15 bg-white p-6 md:p-8">
          <h2 className="text-lg font-semibold text-[#18221e]">
            1. {isDe ? 'Art des Inserats & Standort' : 'Listing Type & Location'}
          </h2>

          <div className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {isDe ? 'Titel des Inserats' : 'Listing Title'} *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={isDe ? 'z.B. Helles WG-Zimmer am Boxhagener Kiez mit Balkon' : 'e.g. Sunny room in shared flat with balcony'}
                className="mt-1.5 h-10 w-full rounded-lg border border-foreground/15 bg-transparent px-3 text-sm focus:border-[#385cdd] focus:outline-none"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {isDe ? 'Wohnform' : 'Type'} *
                </label>
                <select
                  value={formData.listingType}
                  onChange={(e) => setFormData({ ...formData, listingType: e.target.value as any })}
                  className="mt-1.5 h-10 w-full rounded-lg border border-foreground/15 bg-transparent px-3 text-sm focus:border-[#385cdd] focus:outline-none"
                >
                  {Object.entries(housingTypeLabels).map(([k, v]) => (
                    <option key={k} value={k}>
                      {isDe ? v.de : v.en}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {isDe ? 'Bezirk' : 'District'} *
                </label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="mt-1.5 h-10 w-full rounded-lg border border-foreground/15 bg-transparent px-3 text-sm focus:border-[#385cdd] focus:outline-none"
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
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  PLZ (Berlin) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={5}
                  value={formData.postcode}
                  onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                  placeholder="10245"
                  className="mt-1.5 h-10 w-full rounded-lg border border-foreground/15 bg-transparent px-3 text-sm focus:border-[#385cdd] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {isDe ? 'Kiez / Viertel' : 'Kiez / Neighborhood'}
                </label>
                <input
                  type="text"
                  value={formData.neighborhood}
                  onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                  placeholder={isDe ? 'z.B. Boxhagener Kiez' : 'e.g. Wrangelkiez'}
                  className="mt-1.5 h-10 w-full rounded-lg border border-foreground/15 bg-transparent px-3 text-sm focus:border-[#385cdd] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {isDe ? 'Straße (optional)' : 'Street (optional)'}
                </label>
                <input
                  type="text"
                  value={formData.streetAddress}
                  onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                  placeholder="z.B. Gärtnerstr."
                  className="mt-1.5 h-10 w-full rounded-lg border border-foreground/15 bg-transparent px-3 text-sm focus:border-[#385cdd] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Financials & Deposit Compliance */}
        <section className="rounded-xl border border-foreground/15 bg-white p-6 md:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#18221e]">
              2. {isDe ? 'Miete & Kaution (§ 551 BGB konform)' : 'Rent & Deposit (BGB compliant)'}
            </h2>
            <span className="rounded bg-[#e2f3e6] px-2 py-0.5 text-[10px] font-semibold text-[#285a39]">
              {isDe ? 'Preistransparenz' : 'Price Transparency'}
            </span>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {isDe ? 'Kaltmiete (€)' : 'Cold rent (€)'} *
              </label>
              <input
                type="number"
                required
                min={150}
                value={formData.kaltmieteEur}
                onChange={(e) => updateKaltmiete(Number(e.target.value))}
                className="mt-1.5 h-10 w-full rounded-lg border border-foreground/15 bg-transparent px-3 text-sm focus:border-[#385cdd] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {isDe ? 'Nebenkosten (€)' : 'Utilities (€)'}
              </label>
              <input
                type="number"
                min={0}
                value={formData.nebenkostenEur}
                onChange={(e) => updateNebenkosten(Number(e.target.value))}
                className="mt-1.5 h-10 w-full rounded-lg border border-foreground/15 bg-transparent px-3 text-sm focus:border-[#385cdd] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {isDe ? 'Warmmiete (€ gesamt)' : 'Warm rent (€ total)'} *
              </label>
              <input
                type="number"
                required
                value={formData.warmmieteEur}
                onChange={(e) => setFormData({ ...formData, warmmieteEur: Number(e.target.value) })}
                className="mt-1.5 h-10 w-full rounded-lg border border-[#385cdd]/30 bg-[#edf2ff]/30 px-3 text-sm font-bold text-[#18221e] focus:border-[#385cdd] focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {isDe ? 'Kaution (€)' : 'Deposit (€)'}
              </label>
              <input
                type="number"
                min={0}
                max={formData.kaltmieteEur * 3}
                value={formData.kautionEur}
                onChange={(e) => setFormData({ ...formData, kautionEur: Number(e.target.value) })}
                className="mt-1.5 h-10 w-full rounded-lg border border-foreground/15 bg-transparent px-3 text-sm focus:border-[#385cdd] focus:outline-none"
              />
              <p className="mt-1 text-[11px] text-muted-foreground">
                {isDe
                  ? `Gesetzlich maximal 3 Kaltmieten: ${formData.kaltmieteEur * 3} €`
                  : `Legally capped at 3 net cold rents: €${formData.kaltmieteEur * 3}`}
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Space & Amenities */}
        <section className="rounded-xl border border-foreground/15 bg-white p-6 md:p-8">
          <h2 className="text-lg font-semibold text-[#18221e]">
            3. {isDe ? 'Zimmergröße & Möblierung' : 'Room Size & Furnishing'}
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {isDe ? 'Größe (m²)' : 'Size (sqm)'} *
              </label>
              <input
                type="number"
                required
                min={5}
                value={formData.roomSqm}
                onChange={(e) => setFormData({ ...formData, roomSqm: Number(e.target.value) })}
                className="mt-1.5 h-10 w-full rounded-lg border border-foreground/15 bg-transparent px-3 text-sm focus:border-[#385cdd] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {isDe ? 'Zimmer in der Wohnung' : 'Rooms in flat'}
              </label>
              <input
                type="number"
                min={1}
                value={formData.totalRooms}
                onChange={(e) => setFormData({ ...formData, totalRooms: Number(e.target.value) })}
                className="mt-1.5 h-10 w-full rounded-lg border border-foreground/15 bg-transparent px-3 text-sm focus:border-[#385cdd] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {isDe ? 'Möblierung' : 'Furnishing'}
              </label>
              <select
                value={formData.furnished}
                onChange={(e) => setFormData({ ...formData, furnished: e.target.value as any })}
                className="mt-1.5 h-10 w-full rounded-lg border border-foreground/15 bg-transparent px-3 text-sm focus:border-[#385cdd] focus:outline-none"
              >
                <option value="fully">{isDe ? 'Voll möbliert' : 'Fully furnished'}</option>
                <option value="partially">{isDe ? 'Teilmöbliert' : 'Partially furnished'}</option>
                <option value="unfurnished">{isDe ? 'Unmöbliert' : 'Unfurnished'}</option>
              </select>
            </div>
          </div>
        </section>

        {/* Section 4: Legal & Anmeldung (The Berlin Core) */}
        <section className="rounded-xl border border-foreground/15 bg-white p-6 md:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#18221e]">
              4. {isDe ? 'Rechtliches & Anmeldung' : 'Legal & Anmeldung'}
            </h2>
            <ShieldCheck className="size-5 text-[#244b34]" />
          </div>

          <div className="mt-5 space-y-4">
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-foreground/10 bg-[#faf8f5] p-3.5 transition hover:border-[#385cdd]/40">
              <input
                type="checkbox"
                checked={formData.anmeldungPossible}
                onChange={(e) => setFormData({ ...formData, anmeldungPossible: e.target.checked })}
                className="mt-1 size-4 rounded text-[#385cdd]"
              />
              <div>
                <strong className="block text-sm font-semibold text-[#18221e]">
                  {isDe ? 'Anmeldung ist möglich (Wohnungsgeberbestätigung nach § 19 BMG)' : 'Anmeldung possible (Wohnungsgeberbestätigung provided)'}
                </strong>
                <span className="text-xs text-muted-foreground">
                  {isDe
                    ? 'Ich stelle die offizielle Wohnungsgeberbestätigung für das Bürgeramt rechtzeitig zur Verfügung.'
                    : 'I will provide the official registration certificate required for the Berlin Bürgeramt.'}
                </span>
              </div>
            </label>

            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-foreground/10 bg-[#faf8f5] p-3.5 transition hover:border-[#385cdd]/40">
              <input
                type="checkbox"
                checked={formData.subletAuthorized}
                onChange={(e) => setFormData({ ...formData, subletAuthorized: e.target.checked })}
                className="mt-1 size-4 rounded text-[#385cdd]"
              />
              <div>
                <strong className="block text-sm font-semibold text-[#18221e]">
                  {isDe ? 'Vom Eigentümer / Vermieter genehmigte Untermiete (§ 553 BGB)' : 'Authorized by property owner/landlord (§ 553 BGB)'}
                </strong>
                <span className="text-xs text-muted-foreground">
                  {isDe
                    ? 'Die Erlaubnis zur Untervermietung liegt schriftlich vor oder ich bin selbst Eigentümer:in.'
                    : 'Written subletting permission from the owner is available, or I am the owner.'}
                </span>
              </div>
            </label>

            <div className="grid gap-4 sm:grid-cols-2 pt-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {isDe ? 'Frei ab (Einzugsdatum)' : 'Move-in date'} *
                </label>
                <input
                  type="date"
                  required
                  value={formData.moveInDate}
                  onChange={(e) => setFormData({ ...formData, moveInDate: e.target.value })}
                  className="mt-1.5 h-10 w-full rounded-lg border border-foreground/15 bg-transparent px-3 text-sm focus:border-[#385cdd] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {isDe ? 'Frei bis (optional bei unbefristet)' : 'Move-out date (optional)'}
                </label>
                <input
                  type="date"
                  value={formData.moveOutDate}
                  onChange={(e) => setFormData({ ...formData, moveOutDate: e.target.value })}
                  className="mt-1.5 h-10 w-full rounded-lg border border-foreground/15 bg-transparent px-3 text-sm focus:border-[#385cdd] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Photos & Description */}
        <section className="rounded-xl border border-foreground/15 bg-white p-6 md:p-8">
          <h2 className="text-lg font-semibold text-[#18221e]">
            5. {isDe ? 'Fotos & Beschreibung' : 'Photos & Description'}
          </h2>

          <div className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {isDe ? 'Foto-URL hinzufügen' : 'Add Photo URL'}
              </label>
              <div className="mt-1.5 flex gap-2">
                <input
                  type="url"
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="h-10 flex-1 rounded-lg border border-foreground/15 bg-transparent px-3 text-sm focus:border-[#385cdd] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addImage}
                  className="rounded-lg bg-[#18221e] px-4 text-xs font-semibold text-white hover:bg-[#2a3832]"
                >
                  {isDe ? 'Hinzufügen' : 'Add'}
                </button>
              </div>

              {formData.images.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="group relative size-20 overflow-hidden rounded-lg border border-foreground/15 bg-neutral-100"
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 grid size-5 place-items-center rounded-full bg-black/75 text-[10px] text-white opacity-0 transition group-hover:opacity-100"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {isDe ? 'Ausführliche Beschreibung' : 'Detailed Description'} *
              </label>
              <textarea
                required
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={isDe ? 'Beschreibe die Wohnung, das Zimmer, die WG-Mitbewohner, die Nachbarschaft und die Anbindung an Öffis...' : 'Describe the flat, room, flatmates, neighborhood and transit access...'}
                className="mt-1.5 w-full rounded-lg border border-foreground/15 bg-transparent p-3 text-sm focus:border-[#385cdd] focus:outline-none"
              />
            </div>
          </div>
        </section>

        {/* Section 6: Contact & 29 € Listing Fee */}
        <section className="rounded-xl border border-foreground/15 bg-white p-6 md:p-8">
          <h2 className="text-lg font-semibold text-[#18221e]">
            6. {isDe ? 'Kontakt & Inseratsgebühr' : 'Contact & Listing Fee'}
          </h2>

          <div className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {isDe ? 'Deine Kontakt-E-Mail-Adresse' : 'Your Contact Email'} *
              </label>
              <input
                type="email"
                required
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                placeholder="deine.email@gmail.com"
                className="mt-1.5 h-10 w-full rounded-lg border border-foreground/15 bg-transparent px-3 text-sm focus:border-[#385cdd] focus:outline-none"
              />
              <p className="mt-1 text-[11px] text-muted-foreground">
                {isDe
                  ? 'An diese Adresse senden wir den 6-stelligen Bestätigungscode.'
                  : 'We will send a 6-digit confirmation code to this address.'}
              </p>
            </div>

            <div className="rounded-xl border border-[#385cdd]/30 bg-[#edf2ff]/40 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-[#18221e]">
                    KIEZJOB Wohnungs-Inserat (30 Tage)
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {isDe
                      ? 'Die einmalige Einstellgebühr von 29 € schützt Wohnungssuchende wirksam vor Betrügern, Massen-Scam-Bots und gefälschten Angeboten.'
                      : 'The one-time listing fee of €29 effectively protects seekers against scammers, bot networks and fake landlords.'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-[#18221e]">29 €</span>
                  <span className="block text-[10px] text-muted-foreground">inkl. MwSt.</span>
                </div>
              </div>
            </div>

            {/* Mandatory Liability Waiver */}
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-foreground/15 bg-[#faf8f5] p-3.5 transition hover:border-[#385cdd]/40">
              <input
                type="checkbox"
                required
                checked={agreedToDisclaimer}
                onChange={(e) => setAgreedToDisclaimer(e.target.checked)}
                className="mt-1 size-4 rounded text-[#385cdd]"
              />
              <span className="text-xs leading-relaxed text-[#3c4a42]">
                {isDe ? (
                  <>
                    <strong>Haftungsausschluss & Plattform-Bedingungen:</strong> Ich bestätige, dass alle Angaben wahrheitsgemäß sind und ich zur Vermietung/Untervermietung berechtigt bin. Ich nehme zur Kenntnis, dass KIEZJOB eine reine Anzeigen- und Vermittlungsplattform (Schwarzes Brett) ist, keine Miet- oder Untermietverträge vermittelt oder abschließt und für Mieter, Vermieter oder Mietverhältnisse keinerlei Haftung übernimmt.
                  </>
                ) : (
                  <>
                    <strong>Liability Disclaimer & Platform Terms:</strong> I confirm all information is true and that I am legally authorized to offer this accommodation. I acknowledge that KIEZJOB is strictly an advertising directory / bulletin board, does not broker or execute tenancy contracts, and bears zero liability for landlords, tenants, or rental relationships.
                  </>
                )}
              </span>
            </label>
          </div>
        </section>

        {errorMsg ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-700">
            {errorMsg}
          </div>
        ) : null}

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading || !agreedToDisclaimer}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#18221e] px-6 text-sm font-semibold text-white transition hover:bg-[#2a3832] disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              {isDe ? 'Wird geprüft...' : 'Checking compliance...'}
            </>
          ) : (
            <>
              {isDe ? 'Weiter zur Bestätigung & Zahlung (29 €)' : 'Continue to Verification & Payment (€29)'}
              <ArrowRight className="size-4" />
            </>
          )}
        </button>
      </form>

      {/* Verification Modal Dialog */}
      {submissionId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-foreground/15 bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-[#18221e]">
              {isDe ? 'E-Mail-Bestätigung' : 'Email Confirmation'}
            </h3>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
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
                className="h-12 w-full text-center font-mono text-2xl tracking-widest rounded-lg border border-foreground/20 focus:border-[#385cdd] focus:outline-none"
              />

              {verifyError ? (
                <p className="text-xs text-red-600">{verifyError}</p>
              ) : null}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSubmissionId(null)}
                  className="h-10 flex-1 rounded-lg border border-foreground/15 text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  {isDe ? 'Zurück' : 'Back'}
                </button>
                <button
                  type="submit"
                  disabled={verifying || verifyCode.length < 6}
                  className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#385cdd] text-xs font-semibold text-white transition hover:bg-[#2e4ec5] disabled:opacity-50"
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
