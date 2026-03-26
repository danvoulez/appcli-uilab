import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#0e0e0e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 7,
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: 900,
            color: 'white',
            letterSpacing: '-0.04em',
            fontFamily: 'system-ui',
            lineHeight: 1,
          }}
        >
          L
        </div>
      </div>
    ),
    { ...size }
  );
}
