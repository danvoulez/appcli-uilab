import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 512,
          height: 512,
          background: '#0e0e0e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 108,
        }}
      >
        <div
          style={{
            color: '#ffffff',
            fontSize: 240,
            fontWeight: 900,
            fontFamily: 'system-ui, sans-serif',
            letterSpacing: '-10px',
            lineHeight: 1,
          }}
        >
          L
        </div>
      </div>
    ),
    { width: 512, height: 512 },
  );
}
