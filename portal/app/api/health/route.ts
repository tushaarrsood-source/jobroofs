export async function GET() {
  return Response.json({
    ok: true,
    service: 'jobroofs-berlin',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
}
