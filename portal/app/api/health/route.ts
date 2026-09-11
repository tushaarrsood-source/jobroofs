export async function GET() {
  return Response.json({
    ok: true,
    service: 'kiezjob-berlin',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
}
