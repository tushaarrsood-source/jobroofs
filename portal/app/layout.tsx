import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { AuthProvider } from '@/lib/firebase/auth-context';
import { LanguageProvider } from '@/lib/i18n/language-context';
import { MobileNavBar } from '@/components/mobile-nav-bar';
import { CookieBanner } from '@/components/cookie-banner';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

export const viewport: Viewport = {
  themeColor: '#1b4332',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://jobroofs.com'),
  title: {
    default: 'JOBROOFS — The portal for Temp Jobs in Berlin',
    template: '%s · JOBROOFS — The portal for Temp Jobs',
  },
  description:
    'The portal for temp jobs in Berlin. 1.600+ verified minijobs, student gigs, and flexible shifts with 100% direct employer contact.',
  keywords: [
    'Jobroofs',
    'The portal for Temp Jobs',
    'Temp Jobs Berlin',
    'Minijob Berlin',
    'Teilzeitjob Berlin',
    'Nebenjob Berlin',
    'Studentenjob Berlin',
    'Aushilfe Berlin',
    'Part time jobs Berlin',
    'Flexible work Berlin',
    'Temporary work Berlin',
    'Student jobs Berlin',
    'English speaking jobs Berlin',
    'Werkstudent Berlin',
    'Barista Berlin',
    'Kellner Berlin',
    'Berlin Minijob Portal',
  ],
  openGraph: {
    type: 'website',
    siteName: 'JOBROOFS — The portal for Temp Jobs',
    locale: 'de_DE',
    alternateLocale: ['en_US'],
    url: 'https://jobroofs.com',
    title: 'JOBROOFS — The portal for Temp Jobs in Berlin',
    description:
      'The portal for temp jobs in Berlin. 1.600+ verified minijobs, student gigs, and flexible shifts with 100% direct employer contact.',
  },
  other: {
    'geo.region': 'DE-BE',
    'geo.placename': 'Berlin',
    'geo.position': '52.5200;13.4050',
    ICBM: '52.5200, 13.4050',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JOBROOFS — The portal for Temp Jobs in Berlin',
    description:
      'The portal for temp jobs in Berlin. 1.600+ verified minijobs, student gigs, and flexible shifts with 100% direct employer contact.',
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
    <html lang="de">
      <body
        className={`${plusJakarta.variable} antialiased selection:bg-[#1b4332] selection:text-white pb-24 md:pb-0 font-sans bg-[#fafbfa] text-[#111816]`}
      >
        <AuthProvider>
          <LanguageProvider>
            {children}
            <CookieBanner />
            <MobileNavBar />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

