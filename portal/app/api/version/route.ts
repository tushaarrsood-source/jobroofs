import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Unique per server instance/deployment
const SERVER_INSTANCE_ID = `live-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

export async function GET() {
  return NextResponse.json(
    {
      buildId: process.env.NEXT_PUBLIC_DEPLOY_ID || SERVER_INSTANCE_ID,
      timestamp: Date.now(),
      status: 'live',
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    }
  );
}
