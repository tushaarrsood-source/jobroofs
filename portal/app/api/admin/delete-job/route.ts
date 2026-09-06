import { NextResponse } from 'next/server';
import { suppressJob, unsuppressJob, getSuppressedJobs } from '@/lib/sources/suppression-store';
import { isMasterAccount } from '@/lib/domain/master-accounts';

export async function GET() {
  const suppressed = getSuppressedJobs();
  return NextResponse.json({
    totalSuppressed: suppressed.length,
    suppressedJobs: suppressed,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { jobId, email, action } = body;

    if (!jobId) {
      return NextResponse.json({ error: 'Missing jobId' }, { status: 400 });
    }

    // Allow master accounts or authorization header
    const authHeader = request.headers.get('authorization') || '';
    const isMaster = isMasterAccount(email) || authHeader.includes('Himanshu@0010');

    if (!isMaster) {
      return NextResponse.json(
        { error: 'Unauthorized: Master account permissions required to delete extracted jobs.' },
        { status: 403 },
      );
    }

    if (action === 'restore') {
      unsuppressJob(jobId);
      return NextResponse.json({
        success: true,
        action: 'restored',
        jobId,
        message: `Job ${jobId} has been restored to the portal.`,
      });
    }

    suppressJob(jobId);
    return NextResponse.json({
      success: true,
      action: 'deleted',
      jobId,
      message: `Job ${jobId} has been successfully deleted from the portal.`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const jobId = url.searchParams.get('id');
  const email = url.searchParams.get('email') || request.headers.get('x-user-email') || '';

  if (!jobId) {
    return NextResponse.json({ error: 'Missing id query parameter' }, { status: 400 });
  }

  const authHeader = request.headers.get('authorization') || '';
  const isMaster = isMasterAccount(email) || authHeader.includes('Himanshu@0010');

  if (!isMaster) {
    return NextResponse.json(
      { error: 'Unauthorized: Master account permissions required to delete jobs.' },
      { status: 403 },
    );
  }

  suppressJob(jobId);
  return NextResponse.json({
    success: true,
    deleted: jobId,
    message: `Job ${jobId} successfully removed from the portal.`,
  });
}
