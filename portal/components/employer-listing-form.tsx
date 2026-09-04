'use client';

import { useState } from 'react';
import { CheckCircle2, ExternalLink, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { Textarea } from '@/components/ui/textarea';
import { industryNiches } from '@/lib/domain/taxonomy';
import { formatVerbatimPointers } from '@/lib/domain/text-format';
import { useTranslation } from '@/lib/i18n/language-context';
import Link from '@/components/ui/link';

interface SubmitResponse {
  submissionId?: string;
  requiresVerification?: boolean;
  error?: string;
}

interface VerifyResponse {
  status: 'published' | 'needs_review' | 'payment_required';
  checkoutUrl?: string;
  slug?: string;
  jobId?: string;
  error?: string;
  reasons?: string[];
}

export function EmployerListingForm() {
  const { t, isDe } = useTranslation();
  const [applicationMethod, setApplicationMethod] = useState<'email' | 'external_link'>('email');
  const [pricingPlan, setPricingPlan] = useState<'standard' | 'premium'>('standard');
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [nicheError, setNicheError] = useState('');
  
  // Flexible Pay & Duration controls
  const [payMode, setPayMode] = useState<'fixed' | 'discuss'>('fixed');
  const [scheduleType, setScheduleType] = useState<'shift_1day' | 'flexible' | 'regular'>('regular');
  
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'verify' | 'verifying' | 'published' | 'needs_review' | 'payment_required'>('idle');
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null);

  const handleNicheToggle = (id: string) => {
    setSelectedNiches((prev) => {
      if (prev.includes(id)) {
        setNicheError('');
        return prev.filter((n) => n !== id);
      }
      if (prev.length >= 3) {
        setNicheError(isDe ? 'Maximal 3 Kategorien möglich.' : 'You can select a maximum of 3 categories.');
        return prev;
      }
      setNicheError('');
      return [...prev, id];
    });
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedNiches.length === 0) {
      setNicheError(isDe ? 'Bitte wähle mindestens 1 Kategorie.' : 'Please select at least 1 category.');
      return;
    }
    
    setSubmitStatus('submitting');
    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Process text into clean verbatim bullet points automatically
    const rawResp = data.responsibilities;
    const rawReq = data.requirements;
    const parsedResp = formatVerbatimPointers(rawResp);
    const parsedReq = formatVerbatimPointers(rawReq);

    // Pay mode handling
    if (payMode === 'discuss') {
      data.payText = data.payDiscussNote || 'To be discussed / Nach Vereinbarung';
      data.amountMinimum = '';
      data.amountMaximum = '';
    } else if (data.amountMinimum) {
      const min = data.amountMinimum;
      const max = data.amountMaximum ? `–€${data.amountMaximum}` : '';
      const interval = data.rateInterval || 'hour';
      data.payText = `€${min}${max} / ${interval}`;
    }

    // Schedule type handling
    data.scheduleType = scheduleType;
    if (scheduleType === 'shift_1day' && !data.workingDays) {
      data.workingDays = '1-Day Shift / 1-Tages-Schicht';
    } else if (scheduleType === 'flexible' && !data.workingDays) {
      data.workingDays = 'Flexible / By arrangement';
    }

    // Add controlled fields
    data.applicationMethod = applicationMethod;
    data.pricingPlan = pricingPlan;
    data.payMode = payMode;
    data.niches = JSON.stringify(selectedNiches);
    data.responsibilities = JSON.stringify(parsedResp);
    data.requirements = JSON.stringify(parsedReq);
    
    const submitterEmail = (data.contactEmail as string) || (data.applicationEmail as string) || '';

    try {
      const res = await fetch('/api/employer/submit', {
        method: 'POST',
        body: JSON.stringify({
          payload: data,
          submitterEmail,
          pricingPlan,
        }),
        headers: { 'Content-Type': 'application/json' },
      });
      const result = (await res.json()) as SubmitResponse;
      if (res.ok && result.submissionId) {
        setSubmissionId(result.submissionId);
        setSubmitStatus('verify');
      } else {
        alert(result.error || 'Submission failed');
        setSubmitStatus('idle');
      }
    } catch {
      alert('Error submitting form');
      setSubmitStatus('idle');
    }
  };

  const onVerify = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitStatus('verifying');
    try {
      const res = await fetch('/api/employer/verify', {
        method: 'POST',
        body: JSON.stringify({ submissionId, code: verificationCode }),
        headers: { 'Content-Type': 'application/json' },
      });
      const result = (await res.json()) as VerifyResponse;
      if (result.status === 'payment_required' && result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      } else if (result.status === 'published') {
        setPublishedSlug(result.slug || result.jobId || null);
        setSubmitStatus('published');
      } else if (result.status === 'needs_review') {
        setSubmitStatus('needs_review');
      } else {
        alert(result.error || 'Verification failed');
        setSubmitStatus('verify');
      }
    } catch {
      alert('Error verifying code');
      setSubmitStatus('verify');
    }
  };

  if (submitStatus === 'verify' || submitStatus === 'verifying') {
    return (
      <div className="mt-9 rounded-xl border border-foreground/15 bg-white p-7 text-center max-w-md mx-auto">
        <Mail className="mx-auto size-12 text-blue-600" />
        <h2 className="mt-4 text-2xl font-semibold">{t('checkEmailTitle')}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t('checkEmailDesc')}
        </p>

        <form onSubmit={onVerify} className="mt-6 space-y-4">
          <Input
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="e.g. 123456"
            className="text-center font-mono text-xl tracking-widest h-12"
            maxLength={6}
            required
          />
          <Button type="submit" disabled={submitStatus === 'verifying'} className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer shadow-sm">
            {submitStatus === 'verifying' ? t('verifying') : t('verifyAndContinue')}
          </Button>
        </form>
      </div>
    );
  }

  if (submitStatus === 'published') {
    return (
      <div className="mt-9 rounded-xl border border-foreground/15 bg-white p-8 text-center max-w-lg mx-auto">
        <CheckCircle2 className="mx-auto size-14 text-green-600" />
        <h2 className="mt-4 text-2xl font-semibold">{t('listingPublishedTitle')}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t('listingPublishedDesc')}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          {publishedSlug && (
            <Link
              href={`/jobs/${publishedSlug}`}
              className="inline-flex h-11 items-center rounded-lg bg-blue-600 hover:bg-blue-700 px-6 text-sm font-semibold text-white cursor-pointer shadow-sm"
            >
              {t('viewListingLive')}
            </Link>
          )}
          <Link
            href="/"
            className="inline-flex h-11 items-center rounded-lg border border-foreground/15 bg-white px-6 text-sm font-semibold hover:bg-foreground/5 cursor-pointer"
          >
            {t('backToPortal')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={onSubmit} className="mt-8 space-y-8">
        <FormSection number="00" title={t('sectionAccountTitle')}>
          <p className="text-sm text-muted-foreground">
            {t('sectionAccountDesc')}
          </p>
          <Field label={t('workEmailLabel')}>
            <Input name="contactEmail" required type="email" placeholder="owner@company.de" className="h-11" />
          </Field>
        </FormSection>

        <FormSection number="01" title={t('sectionJobTitle')}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t('jobTitleLabel')}>
              <Input name="title" required placeholder={t('jobTitlePlaceholder')} className="h-11" />
            </Field>
            <Field label={t('employerNameLabel')}>
              <Input name="company" required placeholder={t('employerNamePlaceholder')} className="h-11" />
            </Field>
          </div>
          
          <div className="mt-4">
            <Field label={t('categoriesLabel')}>
              <div className="mt-2 grid gap-2 sm:grid-cols-2 md:grid-cols-3 h-56 overflow-y-auto p-4 border rounded-xl bg-foreground/5">
                {industryNiches.map((niche) => {
                  const nicheText = isDe ? niche.labelDe : niche.label;
                  return (
                    <label key={niche.id} className="flex items-center gap-2 cursor-pointer text-sm">
                      <input 
                        type="checkbox" 
                        className="rounded accent-blue-600"
                        checked={selectedNiches.includes(niche.id)}
                        onChange={() => handleNicheToggle(niche.id)}
                      />
                      <span>{nicheText}</span>
                    </label>
                  );
                })}
              </div>
              {nicheError && <p className="mt-2 text-xs font-semibold text-red-600">{nicheError}</p>}
            </Field>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label={t('employmentTypeLabel')}>
              <NativeSelect name="employmentType" className="w-full [&_select]:h-11" defaultValue="minijob">
                <NativeSelectOption value="temp-day-shift">{t('oneDayShift')}</NativeSelectOption>
                <NativeSelectOption value="short-term">{t('tempShortTerm')}</NativeSelectOption>
                <NativeSelectOption value="minijob">{t('minijob')}</NativeSelectOption>
                <NativeSelectOption value="part-time">{t('partTime')}</NativeSelectOption>
                <NativeSelectOption value="working-student">{t('workingStudent')}</NativeSelectOption>
                <NativeSelectOption value="home-help">{t('homeHelp')}</NativeSelectOption>
              </NativeSelect>
            </Field>
            <Field label={t('languagePrefLabel')}>
              <NativeSelect name="language" className="w-full [&_select]:h-11" defaultValue="german_and_english">
                <NativeSelectOption value="german_and_english">{t('germanAndEnglish')}</NativeSelectOption>
                <NativeSelectOption value="english_explicit">{t('englishOnly')}</NativeSelectOption>
                <NativeSelectOption value="german_explicit">{t('germanRequired')}</NativeSelectOption>
                <NativeSelectOption value="not_stated">{t('langOpen')}</NativeSelectOption>
              </NativeSelect>
            </Field>
          </div>

          {/* Large, comfortable textareas */}
          <div className="mt-4 space-y-4">
            <Field label={t('tasksLabel')}>
              <Textarea
                name="responsibilities"
                required
                rows={8}
                className="min-h-[180px] p-4 font-sans text-sm leading-relaxed"
                placeholder={t('tasksPlaceholder')}
              />
              <p className="mt-1 text-[11px] text-muted-foreground">
                {t('tasksAutoFormatNote')}
              </p>
            </Field>

            <Field label={t('requirementsLabel')}>
              <Textarea
                name="requirements"
                required
                rows={7}
                className="min-h-[160px] p-4 font-sans text-sm leading-relaxed"
                placeholder={t('requirementsPlaceholder')}
              />
            </Field>
          </div>
        </FormSection>

        <FormSection number="02" title={t('sectionLocationTitle')}>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label={t('districtLabel')}>
              <Input name="district" required placeholder="e.g. Kreuzberg, Mitte, Neukölln" className="h-11" />
            </Field>
            <Field label={t('postcodeLabel')}>
              <Input name="postcode" required inputMode="numeric" placeholder="10997" className="h-11" />
            </Field>
            <Field label={t('workplaceLabel')}>
              <NativeSelect name="workplaceType" className="w-full [&_select]:h-11" defaultValue="on_site">
                <NativeSelectOption value="on_site">{t('onSite')}</NativeSelectOption>
                <NativeSelectOption value="hybrid">{t('hybrid')}</NativeSelectOption>
                <NativeSelectOption value="remote">{t('remote')}</NativeSelectOption>
              </NativeSelect>
            </Field>
          </div>

          <div className="mt-4">
            <Field label={t('scheduleTypeLabel')}>
              <div className="grid gap-3 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => setScheduleType('shift_1day')}
                  className={`rounded-xl border p-3.5 text-left transition cursor-pointer ${scheduleType === 'shift_1day' ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-600' : 'border-foreground/15 bg-white hover:border-blue-300'}`}
                >
                  <p className="text-sm font-semibold">{t('schedule1DayTitle')}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{t('schedule1DayDesc')}</p>
                </button>
                <button
                  type="button"
                  onClick={() => setScheduleType('flexible')}
                  className={`rounded-xl border p-3.5 text-left transition cursor-pointer ${scheduleType === 'flexible' ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-600' : 'border-foreground/15 bg-white hover:border-blue-300'}`}
                >
                  <p className="text-sm font-semibold">{t('scheduleFlexTitle')}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{t('scheduleFlexDesc')}</p>
                </button>
                <button
                  type="button"
                  onClick={() => setScheduleType('regular')}
                  className={`rounded-xl border p-3.5 text-left transition cursor-pointer ${scheduleType === 'regular' ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-600' : 'border-foreground/15 bg-white hover:border-blue-300'}`}
                >
                  <p className="text-sm font-semibold">{t('scheduleRegularTitle')}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{t('scheduleRegularDesc')}</p>
                </button>
              </div>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 mt-4">
            <Field label={t('workingDaysLabel')}>
              <Input
                name="workingDays"
                placeholder={
                  scheduleType === 'shift_1day'
                    ? 'e.g. Saturday 12 Oct'
                    : scheduleType === 'flexible'
                    ? 'e.g. Flexible / By arrangement'
                    : 'e.g. Friday–Sunday'
                }
                className="h-11"
              />
            </Field>
            <Field label={t('workingTimesLabel')}>
              <Input
                name="workingTimes"
                placeholder={
                  scheduleType === 'shift_1day'
                    ? 'e.g. 10:00–18:00 (8h)'
                    : 'e.g. 16:00–23:00 or flexible'
                }
                className="h-11"
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t('startDateLabel')}>
              <Input name="startDate" placeholder="e.g. Immediately or 15 Oct 2026" className="h-11" />
            </Field>
            <Field label={t('endDateLabel')}>
              <Input name="endDate" placeholder="Leave empty if ongoing" className="h-11" />
            </Field>
          </div>
        </FormSection>

        <FormSection number="03" title={t('sectionPayTitle')}>
          <p className="text-sm text-muted-foreground">
            {t('sectionPayDesc')}
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setPayMode('fixed')}
              className={`rounded-xl border p-4 text-left transition cursor-pointer ${payMode === 'fixed' ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-600' : 'border-foreground/15 bg-white hover:border-blue-300'}`}
            >
              <p className="text-sm font-semibold">{t('payModeFixedTitle')}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t('payModeFixedDesc')}
              </p>
            </button>
            <button
              type="button"
              onClick={() => setPayMode('discuss')}
              className={`rounded-xl border p-4 text-left transition cursor-pointer ${payMode === 'discuss' ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-600' : 'border-foreground/15 bg-white hover:border-blue-300'}`}
            >
              <p className="text-sm font-semibold">{t('payModeDiscussTitle')}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t('payModeDiscussDesc')}
              </p>
            </button>
          </div>

          {payMode === 'fixed' ? (
            <div className="space-y-4 pt-2">
              <div className="grid gap-4 sm:grid-cols-4">
                <Field label={t('amountMinLabel')}>
                  <Input name="amountMinimum" type="number" min="0" step="0.01" placeholder="15.00" className="h-11" />
                </Field>
                <Field label={t('amountMaxLabel')}>
                  <Input name="amountMaximum" type="number" min="0" step="0.01" placeholder="18.00" className="h-11" />
                </Field>
                <Field label={t('rateIntervalLabel')}>
                  <NativeSelect name="rateInterval" className="w-full [&_select]:h-11" defaultValue="hour">
                    <NativeSelectOption value="hour">{t('perHour')}</NativeSelectOption>
                    <NativeSelectOption value="shift">{t('perShift')}</NativeSelectOption>
                    <NativeSelectOption value="day">{t('perDay')}</NativeSelectOption>
                    <NativeSelectOption value="month">{t('perMonth')}</NativeSelectOption>
                    <NativeSelectOption value="project">{t('perProject')}</NativeSelectOption>
                  </NativeSelect>
                </Field>
                <Field label={t('grossNetLabel')}>
                  <NativeSelect name="grossNet" className="w-full [&_select]:h-11" defaultValue="gross">
                    <NativeSelectOption value="gross">{t('gross')}</NativeSelectOption>
                    <NativeSelectOption value="net">{t('net')}</NativeSelectOption>
                  </NativeSelect>
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={t('payoutWhenLabel')}>
                  <NativeSelect name="payoutCadence" className="w-full [&_select]:h-11" defaultValue="monthly">
                    <NativeSelectOption value="after_shift">{t('payoutAfterShift')}</NativeSelectOption>
                    <NativeSelectOption value="weekly">{t('payoutWeekly')}</NativeSelectOption>
                    <NativeSelectOption value="fortnightly">{t('payoutFortnightly')}</NativeSelectOption>
                    <NativeSelectOption value="monthly">{t('payoutMonthly')}</NativeSelectOption>
                  </NativeSelect>
                </Field>
                <Field label={t('extrasLabel')}>
                  <Input name="extras" placeholder="e.g. Tips shared daily + free meals" className="h-11" />
                </Field>
              </div>
            </div>
          ) : (
            <div className="pt-2">
              <Field label={t('payNoteLabel')}>
                <Input
                  name="payDiscussNote"
                  placeholder={t('payNotePlaceholder')}
                  className="h-11"
                />
              </Field>
            </div>
          )}
        </FormSection>

        <FormSection number="04" title={t('sectionApplicationTitle')}>
          <p className="text-sm text-muted-foreground">
            {t('sectionApplicationDesc')}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setApplicationMethod('email')}
              className={`rounded-xl border p-4 text-left transition cursor-pointer ${applicationMethod === 'email' ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-600' : 'border-foreground/15 bg-white hover:border-blue-300'}`}
            >
              <Mail className="size-5 text-blue-600" />
              <p className="mt-3 text-sm font-semibold">{t('applyByEmail')}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t('applyByEmailDesc')}
              </p>
            </button>
            <button
              type="button"
              onClick={() => setApplicationMethod('external_link')}
              className={`rounded-xl border p-4 text-left transition cursor-pointer ${applicationMethod === 'external_link' ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-600' : 'border-foreground/15 bg-white hover:border-blue-300'}`}
            >
              <ExternalLink className="size-5 text-[#245e3c]" />
              <p className="mt-3 text-sm font-semibold">{t('applyByWebsite')}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t('applyByWebsiteDesc')}
              </p>
            </button>
          </div>

          {applicationMethod === 'email' ? (
            <Field label={t('appEmailLabel')}>
              <Input name="applicationEmail" required type="email" placeholder="jobs@company.de" className="h-11" />
            </Field>
          ) : (
            <Field label={t('appUrlLabel')}>
              <Input name="applicationUrl" required type="url" placeholder="https://company.de/careers/apply" className="h-11" />
            </Field>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t('appContactNameLabel')}>
              <Input name="applicationContactName" placeholder="e.g. Lisa Schmidt" className="h-11" />
            </Field>
            <Field label={t('appDeadlineLabel')}>
              <Input name="applicationDeadline" placeholder="e.g. 15 Oct 2026" className="h-11" />
            </Field>
          </div>

          <Field label={t('appInstructionsLabel')}>
            <Textarea
              name="applicationInstructions"
              rows={3}
              placeholder={t('appInstructionsPlaceholder')}
            />
          </Field>
        </FormSection>

        <FormSection number="05" title={isDe ? 'Laufzeit & Veröffentlichung' : 'Duration & Plan'}>
          <p className="text-sm text-muted-foreground">
            {isDe
              ? 'Wähle deine Laufzeit: Standard (30 Tage) oder Premium Plus (volle 2 Monate mit Top-Platzierung).'
              : 'Choose your listing duration: Standard (30 days) or Premium Plus (full 2 months with top placement).'}
          </p>
          <div className="grid gap-3 sm:grid-cols-2 mt-4">
            <button
              type="button"
              onClick={() => setPricingPlan('standard')}
              className={`rounded-xl border p-4 text-left transition cursor-pointer ${
                pricingPlan === 'standard'
                  ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-600'
                  : 'border-foreground/15 bg-white hover:border-blue-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {isDe ? 'Standard (30 Tage)' : 'Standard (30 Days)'}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isDe ? '30 Tage aktiv · Automatischer Stopp' : '30 days active · Auto deactivation'}
                  </p>
                </div>
                <span className="rounded-md bg-blue-600/10 px-2 py-0.5 text-xs font-bold text-blue-700">
                  29 €
                </span>
              </div>
              <ul className="mt-3 space-y-1 text-xs text-slate-600 border-t border-slate-100 pt-2.5">
                <li>✓ {isDe ? '30 Tage Live auf JOBROOFS' : '30 days live on JOBROOFS'}</li>
                <li>✓ {isDe ? '100% Direktkontakt ohne Provision' : '100% direct contact, no commission'}</li>
                <li>✓ {isDe ? 'Karten- & Bezirkssuche' : 'Map & district placement'}</li>
              </ul>
            </button>

            <button
              type="button"
              onClick={() => setPricingPlan('premium')}
              className={`rounded-xl border p-4 text-left transition cursor-pointer relative ${
                pricingPlan === 'premium'
                  ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-600'
                  : 'border-foreground/15 bg-white hover:border-blue-300'
              }`}
            >
              <span className="absolute -top-2.5 right-4 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-slate-950 shadow-xs">
                ⭐ {isDe ? 'Empfohlen' : 'Recommended'}
              </span>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {isDe ? 'Premium Plus (60 Tage)' : 'Premium Plus (60 Days)'}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isDe ? 'Volle 2 Monate · Top-Kiez-Reichweite' : 'Full 2 months · Top district visibility'}
                  </p>
                </div>
                <span className="rounded-md bg-emerald-700/10 px-2 py-0.5 text-xs font-bold text-emerald-800">
                  49 €
                </span>
              </div>
              <ul className="mt-3 space-y-1 text-xs text-slate-600 border-t border-slate-100 pt-2.5">
                <li>✓ {isDe ? '60 Tage Live (2 Monate Laufzeit)' : '60 days live (full 2 months)'}</li>
                <li>⭐ {isDe ? 'Ganz oben in den Suchergebnissen' : 'Top placement in search results'}</li>
                <li>✓ {isDe ? 'Hervorgehobener Karten-Pin' : 'Prioritized interactive map pin'}</li>
              </ul>
            </button>
          </div>
        </FormSection>

        <div className="flex flex-col gap-4 rounded-xl bg-slate-900 p-6 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-lg">{t('postSubmitBoxTitle')}</p>
            <p className="mt-1 text-sm text-slate-300">
              {pricingPlan === 'premium'
                ? (isDe
                    ? 'Premium Plus (49 €) · 60 Tage live (2 Monate) mit Top-Platzierung'
                    : 'Premium Plus (€49) · 60 days live (2 months) with top placement')
                : (isDe
                    ? 'Standard (29 €) · 30 Tage live auf JOBROOFS'
                    : 'Standard (€29) · 30 days active on JOBROOFS')}
            </p>
          </div>
          <Button
            type="submit"
            size="lg"
            disabled={submitStatus === 'submitting'}
            className="h-12 bg-blue-600 px-8 font-semibold text-white hover:bg-blue-700 cursor-pointer shadow-md shadow-blue-600/30"
          >
            {submitStatus === 'submitting'
              ? t('submitting')
              : (isDe
                  ? `Weiter zur Zahlung (${pricingPlan === 'premium' ? '49 €' : '29 €'})`
                  : `Continue to Payment (${pricingPlan === 'premium' ? '€49' : '€29'})`)}
          </Button>
        </div>
      </form>
    </>
  );
}

function FormSection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-foreground/15 bg-white p-6 md:p-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="font-mono text-xs font-semibold text-muted-foreground">
          {number}
        </span>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#37413c]">
        {label}
      </span>
      {children}
    </label>
  );
}
