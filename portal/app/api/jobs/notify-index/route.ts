import { NextResponse } from 'next/server';
import { notifyGoogleIndexing } from '@/lib/seo/google-indexing';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, jobSlug, type = 'URL_UPDATED' } = body;

    let targetUrl = url;
    if (!targetUrl && jobSlug) {
      targetUrl = `https://jobroofs.com/jobs/${jobSlug}`;
    }

    if (!targetUrl) {
      return NextResponse.json(
        { error: 'Missing required parameter: url or jobSlug' },
        { status: 400 },
      );
    }

    const result = await notifyGoogleIndexing(targetUrl, type);
    return NextResponse.json({
      success: result.success,
      url: targetUrl,
      result,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
