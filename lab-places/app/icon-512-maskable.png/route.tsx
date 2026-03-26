import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Maskable icon: safe zone is the central 80%, so the monogram fits well within it.
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
        }}
      >
        <div
          style={{
            color: '#ffffff',
            fontSize: 192,
            fontWeight: 900,
            fontFamily: 'system-ui, sans-serif',
            letterSpacing: '-8px',
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
