import { ImageResponse } from 'next/og';

// 180×180 is the recommended apple-touch-icon size.
// iOS rounds corners automatically — no need to pre-round.
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#0e0e0e',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Accent dot */}
        <div
          style={{
            position: 'absolute',
            top: 28,
            right: 28,
            width: 14,
            height: 14,
            borderRadius: 14,
            background: 'rgba(255,255,255,0.85)',
          }}
        />
        {/* L monogram */}
        <div
          style={{
            fontSize: 96,
            fontWeight: 900,
            color: 'white',
            letterSpacing: '-0.04em',
            fontFamily: 'system-ui',
            lineHeight: 1,
            marginBottom: 2,
          }}
        >
          L
        </div>
        {/* PLACES label */}
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: 'rgba(255,255,255,0.32)',
            letterSpacing: '0.2em',
            fontFamily: 'system-ui',
          }}
        >
          PLACES
        </div>
      </div>
    ),
    { ...size }
  );
}
