import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { AuthProvider } from '@/lib/firebase/auth-context';
import { LanguageProvider } from '@/lib/i18n/language-context';
import { MobileNavBar } from '@/components/mobile-nav-bar';
import { CookieBanner } from '@/components/cookie-banner';
import { PwaInstallPrompt } from '@/components/pwa-install-prompt';
import { LiveSync } from '@/components/live-sync';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://jobroofs.com'),
  title: {
    default: 'JOBROOFS — Das Portal für unabhängige Inserate in ganz Deutschland',
    template: '%s · JOBROOFS',
  },
  description:
    'Deutschlands unabhängiges Portal für Minijobs, Aushilfen & Teilzeitstellen. 100% direkter Kontakt zu echten Betrieben – ohne Zeitarbeit, ohne Vermittler.',
  keywords: [
    'JOBROOFS',
    'Jobportal Deutschland',
    'Minijob Deutschland',
    'Minijob Berlin',
    'Minijob München',
    'Minijob Hamburg',
    'Minijob Köln',
    'Minijob Frankfurt',
    'Teilzeitjob',
    'Aushilfe',
    'Nebenjob',
    'Studentenjob',
    'Werkstudent',
    'Flexible Arbeit',
    'Temp Jobs Germany',
    'Part time jobs Germany',
    'Barista Jobs',
    'Kellner Jobs',
    'Gastronomie Jobs',
    'Einzelhandel Jobs',
    'Lagerhelfer',
    'Job kostenlos inserieren',
    'Stellenanzeige aufgeben',
  ],
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'google-site-verification-enabled',
  },
  openGraph: {
    type: 'website',
    siteName: 'JOBROOFS — Das Portal für unabhängige Inserate',
    locale: 'de_DE',
    alternateLocale: ['en_US'],
    url: 'https://jobroofs.com',
    title: 'JOBROOFS — Das Portal für unabhängige Inserate in ganz Deutschland',
    description:
      'Deutschlands unabhängiges Portal für Minijobs, Aushilfen & Teilzeitstellen. 100% direkter Kontakt zu echten Betrieben – ohne Zeitarbeit, ohne Vermittler.',
  },
  other: {
    'geo.region': 'DE',
    'geo.placename': 'Deutschland',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JOBROOFS — Das Portal für unabhängige Inserate in ganz Deutschland',
    description:
      'Deutschlands unabhängiges Portal für Minijobs, Aushilfen & Teilzeitstellen. 100% direkter Kontakt zu echten Betrieben – ohne Zeitarbeit, ohne Vermittler.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
    languages: {
      'de-DE': 'https://jobroofs.com',
      'en-US': 'https://jobroofs.com',
      'x-default': 'https://jobroofs.com',
    },
  },
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'JOBROOFS',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="overflow-x-clip max-w-full">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if ('serviceWorker' in navigator) {
                  navigator.serviceWorker.getRegistrations().then(function(regs) {
                    for (var i = 0; i < regs.length; i++) { regs[i].unregister(); }
                  });
                }
                if ('caches' in window) {
                  caches.keys().then(function(names) {
                    for (var i = 0; i < names.length; i++) { caches.delete(names[i]); }
                  });
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${plusJakarta.variable} antialiased selection:bg-black selection:text-white pb-24 md:pb-0 font-sans bg-[#fafaf9] text-black relative min-h-screen overflow-x-clip max-w-full`}
      >
        <AuthProvider>
          <LanguageProvider>
            {children}
            <CookieBanner />
            <MobileNavBar />
            <PwaInstallPrompt />
          </LanguageProvider>
        </AuthProvider>
        <LiveSync />
      </body>
    </html>
  );
}

