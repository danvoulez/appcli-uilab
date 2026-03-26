import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Maskable icon: safe zone is the central 80%, so use more padding.
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
        }}
      >
        <div
          style={{
            color: '#ffffff',
            fontSize: 72,
            fontWeight: 900,
            fontFamily: 'system-ui, sans-serif',
            letterSpacing: '-3px',
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
