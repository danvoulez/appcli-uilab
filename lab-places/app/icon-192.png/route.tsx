import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 192,
          height: 192,
          background: '#0e0e0e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 40,
        }}
      >
        <div
          style={{
            color: '#ffffff',
            fontSize: 88,
            fontWeight: 900,
            fontFamily: 'system-ui, sans-serif',
            letterSpacing: '-4px',
            lineHeight: 1,
          }}
        >
          L
        </div>
      </div>
    ),
    { width: 192, height: 192 },
  );
}
