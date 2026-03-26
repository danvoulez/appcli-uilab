import type { Metadata, Viewport } from 'next';
import './globals.css';
import { RealtimeProvider } from '@/components/shell/RealtimeProvider';

// viewport-fit: cover — required for env(safe-area-inset-*) to return real values.
// Without this, safe-area-inset-* is always 0 and Dynamic Island / home indicator
// overlap with content.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0e0e0e',
  colorScheme: 'dark',
  // resizes-visual: only the visual viewport shrinks when virtual keyboard opens,
  // so fixed/sticky elements stay put and the layout box is unchanged.
  // This is the correct mode for apps that manage their own scroll containers.
  interactiveWidget: 'resizes-visual',
};

export const metadata: Metadata = {
  title: {
    default: 'LAB Places',
    template: '%s — LAB Places',
  },
  description: 'Operational cockpit for the LAB ecosystem',
  applicationName: 'LAB Places',
  appleWebApp: {
    capable: true,
    title: 'LAB Places',
    // black-translucent: status bar blends into the app, maximising screen real estate.
    // Requires viewport-fit=cover to avoid content sitting under the status bar.
    statusBarStyle: 'black-translucent',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[#0e0e0e] text-white">
        <RealtimeProvider>{children}</RealtimeProvider>
      </body>
    </html>
  );
}
