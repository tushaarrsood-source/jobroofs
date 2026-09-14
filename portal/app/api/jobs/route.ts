import { NextResponse } from 'next/server';
import {
  adminCreateJob,
  adminGetJobBySlugOrId,
  adminGetJobs,
  adminDeleteJob,
  adminCheckUserFreeEligibility,
  adminMarkUserFreeJobUsed,
} from '@/lib/firebase/firestore-admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get('slug') || url.searchParams.get('id');

    // Single job lookup
    if (slug) {
      const job = await adminGetJobBySlugOrId(slug);
      if (!job) {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 });
      }
      return NextResponse.json({ job });
    }

    const q = (url.searchParams.get('q') || '').trim().toLowerCase();
    const city = (url.searchParams.get('city') || 'all').toLowerCase();
    const district = (url.searchParams.get('district') || 'all').toLowerCase();
    const niche = url.searchParams.get('niche') || 'all';
    const limit = Math.min(2000, Math.max(1, parseInt(url.searchParams.get('limit') || '50', 10)));
    const offset = Math.max(0, parseInt(url.searchParams.get('offset') || '0', 10));

    // Fetch active jobs from Firestore using Admin authority
    const firestoreJobs = await adminGetJobs(limit);

    const filtered = firestoreJobs.filter((job) => {
      if (job.status !== 'active' && job.status !== 'published') return false;
      if (niche !== 'all' && (job as any).industryId !== niche) return false;
      if (city !== 'all' && !(job.city || 'berlin').toLowerCase().includes(city)) return false;
      if (district !== 'all' && !(job.district || '').toLowerCase().includes(district)) return false;
      if (q) {
        const title = (job.title || '').toLowerCase();
        const company = (job.company || '').toLowerCase();
        const dist = (job.district || '').toLowerCase();
        const c = (job.city || 'berlin').toLowerCase();
        return title.includes(q) || company.includes(q) || dist.includes(q) || c.includes(q);
      }
      return true;
    });

    const paged = filtered.slice(offset, offset + limit).map((j: any) => ({
      id: j.id,
      slug: j.slug || j.id,
      title: j.title,
      company: j.company,
      city: j.city || 'Berlin',
      district: j.district,
      postcode: j.postcode,
      industryId: j.industryId || 'other',
      employmentForms: j.employmentForms || [j.employmentType || 'Minijob'],
      compensation: j.compensation || { label: j.payText },
      hours: j.hours,
      hoursLabel: j.hoursLabel || j.hours?.label,
      schedule: j.schedule,
      scheduleSummary: j.scheduleSummary || j.schedule?.summary,
      tier: j.tier,
      isFeatured: j.tier === 'premium',
      listingOrigin: 'employer_posted',
      tags: j.tags || [],
      isIndependentLister: true,
      isUserListing: true,
      whatsapp: j.whatsapp,
      phone: j.contactPhone || j.phone,
      contactEmail: j.contactEmail,
      applyUrl: j.applyUrl,
      payText: j.payText,
      postedAt: j.createdAt,
    }));

    return NextResponse.json({
      total: filtered.length,
      jobs: paged,
      hasMore: offset + limit < filtered.length,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    if (!body.title || !body.company) {
      return NextResponse.json(
        { error: 'Titel und Arbeitgeber/Unternehmen sind erforderlich.' },
        { status: 400 }
      );
    }

    const tier = body.tier || 'free';
    const userId = body.userId;

    // Strict Free Tier Entitlement Check
    if (tier === 'free') {
      if (!userId) {
        return NextResponse.json(
          {
            error: 'Bitte melde dich an, um dein kostenloses 30-Tage Erstinserat zu aktivieren.',
            requiresAuth: true,
          },
          { status: 401 }
        );
      }

      const eligibility = await adminCheckUserFreeEligibility(userId);
      if (!eligibility.isEligibleForFree) {
        return NextResponse.json(
          {
            error:
              'Das kostenlose 30-Tage Erstinserat wurde für dieses Konto bereits genutzt. Bitte wähle ein reguläres Paket (Quick 9,99 €, Standard 14,99 € oder Extended 24,99 €).',
            requiresPayment: true,
            code: 'FREE_LIMIT_REACHED',
          },
          { status: 403 }
        );
      }
    }

    const companySlug = String(body.company)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const titleSlug = String(body.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const submissionId = body.id || `direct-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const jobSlug = body.slug || `${companySlug}-${titleSlug}-${submissionId.slice(-4)}`;

    // Calculate duration & initial status
    const now = new Date();
    let durationDays = 30; // Free default is 30 days
    let finalStatus = 'active';

    if (tier === 'free') {
      durationDays = 30;
      finalStatus = 'active';
    } else {
      durationDays = tier === 'premium' ? 60 : tier === 'standard' ? 30 : 15;
      // If paid tier and not verified by Stripe yet, mark as pending_payment
      if (!body.stripeSessionId) {
        finalStatus = body.status === 'pending_payment' ? 'pending_payment' : 'pending_payment';
      } else {
        finalStatus = 'active';
      }
    }

    const expiresAt = new Date(now.getTime() + durationDays * 86400000).toISOString();

    const saved = await adminCreateJob(
      {
        ...body,
        id: submissionId,
        slug: jobSlug,
        tier,
        durationDays,
        status: finalStatus,
        expiresAt,
        updatedAt: now.toISOString(),
      },
      submissionId
    );

    if (!saved) {
      return NextResponse.json(
        { error: 'Fehler beim Speichern des Inserats in der Datenbank.' },
        { status: 500 }
      );
    }

    // If free tier succeeded, permanently mark in user record
    if (tier === 'free' && userId) {
      await adminMarkUserFreeJobUsed(userId, submissionId);
    }

    return NextResponse.json({
      success: true,
      id: submissionId,
      slug: jobSlug,
      status: finalStatus,
      job: saved,
    });
  } catch (err: any) {
    console.error('[API /api/jobs POST error]:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    let id = url.searchParams.get('id');

    if (!id) {
      const body = await request.json().catch(() => ({}));
      id = body.id;
    }

    if (!id) {
      return NextResponse.json({ error: 'ID parameter is required' }, { status: 400 });
    }

    const success = await adminDeleteJob(id);
    return NextResponse.json({ success, deleted: id });
  } catch (err: any) {
    console.error('[API /api/jobs DELETE error]:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
