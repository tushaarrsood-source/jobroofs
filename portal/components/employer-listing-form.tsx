'use client';

import { useState } from 'react';
import { CheckCircle2, ExternalLink, Mail, Sparkles, Clock, Coins, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { Textarea } from '@/components/ui/textarea';
import { industryNiches } from '@/lib/domain/taxonomy';
import { formatVerbatimPointers } from '@/lib/domain/text-format';
import Link from 'next/link';

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
  const [applicationMethod, setApplicationMethod] = useState<'email' | 'external_link'>('email');
  const [pricingPlan, setPricingPlan] = useState<'single' | 'annual'>('single');
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
        setNicheError('You can select a maximum of 3 categories.');
        return prev;
      }
      setNicheError('');
      return [...prev, id];
    });
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedNiches.length === 0) {
      setNicheError('Please select at least 1 category.');
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
      data.workingDays = '1-Day Shift';
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
        <Mail className="mx-auto size-12 text-[#385cdd]" />
        <h2 className="mt-4 text-2xl font-semibold">Check your work email</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          We sent a 6-digit verification code to your email. Enter it below to proceed.
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
          <Button type="submit" disabled={submitStatus === 'verifying'} className="w-full h-11 bg-[#18221e] text-white">
            {submitStatus === 'verifying' ? 'Verifying...' : 'Verify & Continue →'}
          </Button>
        </form>
      </div>
    );
  }

  if (submitStatus === 'published') {
    return (
      <div className="mt-9 rounded-xl border border-foreground/15 bg-white p-8 text-center max-w-lg mx-auto">
        <CheckCircle2 className="mx-auto size-14 text-green-600" />
        <h2 className="mt-4 text-2xl font-semibold">Listing is Live!</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your flexible job listing is published and immediately visible to job seekers across Berlin.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          {publishedSlug && (
            <Link
              href={`/jobs/${publishedSlug}`}
              className="inline-flex h-11 items-center rounded-lg bg-[#385cdd] px-6 text-sm font-semibold text-white"
            >
              View Listing Live →
            </Link>
          )}
          <Link
            href="/"
            className="inline-flex h-11 items-center rounded-lg border border-foreground/15 bg-white px-6 text-sm font-semibold hover:bg-foreground/5"
          >
            Back to Portal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={onSubmit} className="mt-8 space-y-8">
        <FormSection number="00" title="Account & Pricing Plan">
          <p className="text-sm text-muted-foreground">
            Enter your contact email to verify and manage your listing.
          </p>
          <Field label="Your work / contact email">
            <Input name="contactEmail" required type="email" placeholder="owner@company.de" className="h-11" />
          </Field>
          
          <div className="mt-4">
            <Field label="Choose listing option">
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setPricingPlan('single')}
                  className={`rounded-xl border p-4 text-left transition ${pricingPlan === 'single' ? 'border-[#385cdd] bg-[#eef1ff] ring-1 ring-[#385cdd]' : 'border-foreground/15 bg-white'}`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Single Job Listing</p>
                    <span className="rounded-md bg-[#385cdd]/10 px-2 py-0.5 text-xs font-bold text-[#385cdd]">&euro;29</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">One-time payment for 30 days active listing. Full candidate reach across Berlin.</p>
                </button>
                <button
                  type="button"
                  onClick={() => setPricingPlan('annual')}
                  className={`rounded-xl border p-4 text-left transition ${pricingPlan === 'annual' ? 'border-[#385cdd] bg-[#eef1ff] ring-1 ring-[#385cdd]' : 'border-foreground/15 bg-white'}`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Annual Unlimited & Top Listing</p>
                    <span className="rounded-md bg-[#245e3c]/10 px-2 py-0.5 text-xs font-bold text-[#245e3c]">&euro;499 / yr</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Post unlimited job openings with top priority placement for an entire year.</p>
                </button>
              </div>
            </Field>
          </div>
        </FormSection>

        <FormSection number="01" title="Job & Employer">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Job title">
              <Input name="title" required placeholder="e.g. Service Aushilfe / 1-Day Event Assistant / Home Help" className="h-11" />
            </Field>
            <Field label="Employer / Host name">
              <Input name="company" required placeholder="Company, venue, or individual host" className="h-11" />
            </Field>
          </div>
          
          <div className="mt-4">
            <Field label="Job categories (select up to 3)">
              <div className="mt-2 grid gap-2 sm:grid-cols-2 md:grid-cols-3 h-56 overflow-y-auto p-4 border rounded-xl bg-foreground/5">
                {industryNiches.map((niche) => (
                  <label key={niche.id} className="flex items-center gap-2 cursor-pointer text-sm">
                    <input 
                      type="checkbox" 
                      className="rounded text-[#385cdd]"
                      checked={selectedNiches.includes(niche.id)}
                      onChange={() => handleNicheToggle(niche.id)}
                    />
                    <span>{niche.label}</span>
                  </label>
                ))}
              </div>
              {nicheError && <p className="mt-2 text-xs font-semibold text-red-600">{nicheError}</p>}
            </Field>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Employment type">
              <NativeSelect name="employmentType" className="w-full [&_select]:h-11" defaultValue="minijob">
                <NativeSelectOption value="temp-day-shift">⚡ 1-Day Shift / Tagesjob (Single shift)</NativeSelectOption>
                <NativeSelectOption value="short-term">⏱️ Short-term / Temp work (Kurzfristig / Aushilfe)</NativeSelectOption>
                <NativeSelectOption value="minijob">☕ Minijob (up to 538€)</NativeSelectOption>
                <NativeSelectOption value="part-time">💼 Part-time / Teilzeit</NativeSelectOption>
                <NativeSelectOption value="working-student">🎓 Working student / Werkstudent:in</NativeSelectOption>
                <NativeSelectOption value="home-help">🏡 Home help & household assistance</NativeSelectOption>
                <NativeSelectOption value="seasonal">🍁 Seasonal work / Saisonarbeit</NativeSelectOption>
                <NativeSelectOption value="on-call">📞 On-call / Abrufarbeit</NativeSelectOption>
              </NativeSelect>
            </Field>
            <Field label="Language preference">
              <NativeSelect name="language" className="w-full [&_select]:h-11" defaultValue="german_and_english">
                <NativeSelectOption value="german_and_english">German and English</NativeSelectOption>
                <NativeSelectOption value="english_explicit">English only (No German needed)</NativeSelectOption>
                <NativeSelectOption value="german_explicit">German required</NativeSelectOption>
                <NativeSelectOption value="not_stated">Not specified / Open</NativeSelectOption>
              </NativeSelect>
            </Field>
          </div>

          {/* Large, comfortable textareas */}
          <div className="mt-4 space-y-4">
            <Field label="What will the person do? (Tasks & details)">
              <Textarea
                name="responsibilities"
                required
                rows={8}
                className="min-h-[180px] p-4 font-sans text-sm leading-relaxed"
                placeholder="List the main tasks and responsibilities. You can write in continuous paragraphs or bullet points — they are automatically formatted into clean pointers for candidates:&#10;&#10;• Welcome guests and assist with setup&#10;• Help with food/drink prep or household tasks&#10;• Wrap up shift and ensure everything is tidy"
              />
              <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Sparkles className="size-3 text-[#385cdd]" />
                <span>Auto-formatted into clean pointers for candidates without changing any of your words.</span>
              </div>
            </Field>

            <Field label="What do you require? (Experience / Availability)">
              <Textarea
                name="requirements"
                required
                rows={7}
                className="min-h-[160px] p-4 font-sans text-sm leading-relaxed"
                placeholder="Experience, languages, certificates, or availability:&#10;&#10;• Reliable availability for the scheduled time&#10;• Friendly, proactive attitude&#10;• Previous experience welcome but not mandatory"
              />
              <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Sparkles className="size-3 text-[#245e3c]" />
                <span>Automatically formatted cleanly for candidates.</span>
              </div>
            </Field>
          </div>
        </FormSection>

        <FormSection number="02" title="Location & Working Time">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Berlin district">
              <Input name="district" required placeholder="e.g. Kreuzberg, Mitte, Neukölln" className="h-11" />
            </Field>
            <Field label="Postcode">
              <Input name="postcode" required inputMode="numeric" placeholder="10997" className="h-11" />
            </Field>
            <Field label="Workplace">
              <NativeSelect name="workplaceType" className="w-full [&_select]:h-11" defaultValue="on_site">
                <NativeSelectOption value="on_site">On site</NativeSelectOption>
                <NativeSelectOption value="hybrid">Hybrid</NativeSelectOption>
                <NativeSelectOption value="remote">Remote</NativeSelectOption>
              </NativeSelect>
            </Field>
          </div>

          <div className="mt-4">
            <Field label="Shift / Schedule flexibility">
              <div className="grid gap-3 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => setScheduleType('shift_1day')}
                  className={`rounded-xl border p-3.5 text-left transition ${scheduleType === 'shift_1day' ? 'border-[#385cdd] bg-[#eef1ff] ring-1 ring-[#385cdd]' : 'border-foreground/15 bg-white'}`}
                >
                  <Clock className="size-4 text-[#385cdd]" />
                  <p className="mt-1.5 text-sm font-semibold">1-Day Single Shift</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">One-time event, relief shift, or single-day gig.</p>
                </button>
                <button
                  type="button"
                  onClick={() => setScheduleType('flexible')}
                  className={`rounded-xl border p-3.5 text-left transition ${scheduleType === 'flexible' ? 'border-[#385cdd] bg-[#eef1ff] ring-1 ring-[#385cdd]' : 'border-foreground/15 bg-white'}`}
                >
                  <Calendar className="size-4 text-[#245e3c]" />
                  <p className="mt-1.5 text-sm font-semibold">Flexible / By Agreement</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Hours & days arranged flexibly with candidate.</p>
                </button>
                <button
                  type="button"
                  onClick={() => setScheduleType('regular')}
                  className={`rounded-xl border p-3.5 text-left transition ${scheduleType === 'regular' ? 'border-[#385cdd] bg-[#eef1ff] ring-1 ring-[#385cdd]' : 'border-foreground/15 bg-white'}`}
                >
                  <Clock className="size-4 text-[#e06c28]" />
                  <p className="mt-1.5 text-sm font-semibold">Fixed / Regular Hours</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Set weekly or monthly shifts.</p>
                </button>
              </div>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 mt-4">
            <Field label="Working days (optional)">
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
            <Field label="Working times (optional)">
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
            <Field label="Start date (optional)">
              <Input name="startDate" placeholder="e.g. Immediately or 15 Oct 2026" className="h-11" />
            </Field>
            <Field label="End date, if temporary (optional)">
              <Input name="endDate" placeholder="Leave empty if ongoing" className="h-11" />
            </Field>
          </div>
        </FormSection>

        <FormSection number="03" title="Compensation & Pay">
          <p className="text-sm text-muted-foreground">
            You can state exact pay upfront or leave it open to discuss with the candidate.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setPayMode('fixed')}
              className={`rounded-xl border p-4 text-left transition ${payMode === 'fixed' ? 'border-[#385cdd] bg-[#eef1ff] ring-1 ring-[#385cdd]' : 'border-foreground/15 bg-white'}`}
            >
              <Coins className="size-5 text-[#385cdd]" />
              <p className="mt-2 text-sm font-semibold">💶 State pay rate upfront</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Enter an hourly rate, shift fee, or monthly wage to display directly on the map.
              </p>
            </button>
            <button
              type="button"
              onClick={() => setPayMode('discuss')}
              className={`rounded-xl border p-4 text-left transition ${payMode === 'discuss' ? 'border-[#385cdd] bg-[#eef1ff] ring-1 ring-[#385cdd]' : 'border-foreground/15 bg-white'}`}
            >
              <Coins className="size-5 text-[#245e3c]" />
              <p className="mt-2 text-sm font-semibold">💬 Decide after talks / Negotiable</p>
              <p className="mt-1 text-xs text-muted-foreground">
                No fee stated upfront. Listing will show &quot;To be discussed / Nach Vereinbarung&quot;.
              </p>
            </button>
          </div>

          {payMode === 'fixed' ? (
            <div className="space-y-4 pt-2">
              <div className="grid gap-4 sm:grid-cols-4">
                <Field label="Amount (€)">
                  <Input name="amountMinimum" type="number" min="0" step="0.01" placeholder="15.00" className="h-11" />
                </Field>
                <Field label="Max amount (€, optional)">
                  <Input name="amountMaximum" type="number" min="0" step="0.01" placeholder="18.00" className="h-11" />
                </Field>
                <Field label="Rate interval">
                  <NativeSelect name="rateInterval" className="w-full [&_select]:h-11" defaultValue="hour">
                    <NativeSelectOption value="hour">Per hour</NativeSelectOption>
                    <NativeSelectOption value="shift">Per shift (flat)</NativeSelectOption>
                    <NativeSelectOption value="day">Per day</NativeSelectOption>
                    <NativeSelectOption value="month">Per month (Minijob max 538€)</NativeSelectOption>
                    <NativeSelectOption value="project">Per gig / project</NativeSelectOption>
                  </NativeSelect>
                </Field>
                <Field label="Gross / Net">
                  <NativeSelect name="grossNet" className="w-full [&_select]:h-11" defaultValue="gross">
                    <NativeSelectOption value="gross">Gross</NativeSelectOption>
                    <NativeSelectOption value="net">Net (Cash/Direct)</NativeSelectOption>
                  </NativeSelect>
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="When is the person paid?">
                  <NativeSelect name="payoutCadence" className="w-full [&_select]:h-11" defaultValue="monthly">
                    <NativeSelectOption value="after_shift">⚡ Immediately after shift</NativeSelectOption>
                    <NativeSelectOption value="weekly">Weekly</NativeSelectOption>
                    <NativeSelectOption value="fortnightly">Every two weeks</NativeSelectOption>
                    <NativeSelectOption value="monthly">Monthly</NativeSelectOption>
                  </NativeSelect>
                </Field>
                <Field label="Tips, bonuses or extras (optional)">
                  <Input name="extras" placeholder="e.g. Tips shared daily + free meals" className="h-11" />
                </Field>
              </div>
            </div>
          ) : (
            <div className="pt-2">
              <Field label="Note on compensation (optional)">
                <Input
                  name="payDiscussNote"
                  placeholder="e.g. Competitive pay based on experience / Discussed during brief intro call"
                  className="h-11"
                />
              </Field>
            </div>
          )}
        </FormSection>

        <FormSection number="04" title="Application & Contact">
          <p className="text-sm text-muted-foreground">
            Choose where candidates should apply.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setApplicationMethod('email')}
              className={`rounded-xl border p-4 text-left transition ${applicationMethod === 'email' ? 'border-[#385cdd] bg-[#eef1ff] ring-1 ring-[#385cdd]' : 'border-foreground/15 bg-white'}`}
            >
              <Mail className="size-5 text-[#385cdd]" />
              <p className="mt-3 text-sm font-semibold">Apply by email</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Candidates send a brief email directly to you.
              </p>
            </button>
            <button
              type="button"
              onClick={() => setApplicationMethod('external_link')}
              className={`rounded-xl border p-4 text-left transition ${applicationMethod === 'external_link' ? 'border-[#385cdd] bg-[#eef1ff] ring-1 ring-[#385cdd]' : 'border-foreground/15 bg-white'}`}
            >
              <ExternalLink className="size-5 text-[#245e3c]" />
              <p className="mt-3 text-sm font-semibold">Apply on website / form</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Redirect candidates to your own link or form.
              </p>
            </button>
          </div>

          {applicationMethod === 'email' ? (
            <Field label="Application email address">
              <Input name="applicationEmail" required type="email" placeholder="jobs@company.de" className="h-11" />
            </Field>
          ) : (
            <Field label="Application URL">
              <Input name="applicationUrl" required type="url" placeholder="https://company.de/careers/apply" className="h-11" />
            </Field>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Contact person name (optional)">
              <Input name="applicationContactName" placeholder="e.g. Lisa Schmidt" className="h-11" />
            </Field>
            <Field label="Application deadline (optional)">
              <Input name="applicationDeadline" placeholder="e.g. 15 Oct 2026" className="h-11" />
            </Field>
          </div>

          <Field label="Application instructions (optional)">
            <Textarea
              name="applicationInstructions"
              rows={3}
              placeholder="e.g. Send a short note with your availability. No formal CV required."
            />
          </Field>
        </FormSection>

        <div className="flex flex-col gap-4 rounded-xl bg-[#18221e] p-6 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-lg">Post your job opening</p>
            <p className="mt-1 text-sm text-white/70">
              Listing goes live immediately across Berlin upon verification & payment.
            </p>
          </div>
          <Button type="submit" size="lg" disabled={submitStatus === 'submitting'} className="h-12 bg-white px-8 font-semibold text-[#18221e] hover:bg-white/90">
            {submitStatus === 'submitting' ? 'Submitting...' : 'Continue to verification →'}
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
