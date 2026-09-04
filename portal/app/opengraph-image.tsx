import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'JOBROOFS — Berlin Portal for Flexible Jobs & Neighborhood Housing';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #18221e 0%, #0d1411 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '80px',
          color: '#f4f0e7',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: '#1d4ed8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
            }}
          >
            📍
          </div>
          <span
            style={{
              fontSize: '36px',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#f4f0e7',
            }}
          >
            JOBROOFS
          </span>
          <span
            style={{
              fontSize: '18px',
              background: 'rgba(29, 78, 216, 0.25)',
              color: '#93c5fd',
              border: '1px solid rgba(29, 78, 216, 0.4)',
              borderRadius: '20px',
              padding: '4px 14px',
              fontWeight: 600,
            }}
          >
            Berlin
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '900px' }}>
          <h1
            style={{
              fontSize: '56px',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.04em',
              margin: 0,
              color: '#ffffff',
            }}
          >
            The Berlin portal for Flexible Jobs & Neighborhood Housing.
          </h1>
          <p
            style={{
              fontSize: '24px',
              color: '#a3a89e',
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            Direct listings from local employers & neighbors across Berlin districts with transparent pay.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            fontSize: '18px',
            color: '#7b9cf7',
            fontWeight: 600,
          }}
        >
          <span>☕ Minijobs (603€)</span>
          <span>•</span>
          <span>🏡 Housing & Sublets</span>
          <span>•</span>
          <span>⚡ Flexible Shifts</span>
          <span>•</span>
          <span>🗺️ OpenStreetMap</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
