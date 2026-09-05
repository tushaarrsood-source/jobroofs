import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/firebase/auth-context';
import { LanguageProvider } from '@/lib/i18n/language-context';
import { MobileNavBar } from '@/components/mobile-nav-bar';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://jobroofs.com'),
  title: {
    default: 'JOBROOFS — Berlin Portal for Flexible Jobs & Neighborhood Housing',
    template: '%s · JOBROOFS',
  },
  description:
    'Direct marketplace for flexible work, minijobs, WG rooms and apartments across Berlin.',
  keywords: [
    'Jobroofs',
    'Minijob Berlin',
    'Teilzeitjob Berlin',
    'Nebenjob Berlin',
    'Studentenjob Berlin',
    'Aushilfe Berlin',
    'Wohnen Berlin',
    'WG Zimmer Berlin',
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
    siteName: 'JOBROOFS',
    locale: 'de_DE',
    alternateLocale: ['en_US'],
    url: 'https://jobroofs.com',
    title: 'JOBROOFS — Berlin Portal for Flexible Jobs & Neighborhood Housing',
    description:
      'Direct marketplace for flexible work, minijobs, WG rooms and apartments across Berlin.',
  },
  other: {
    'geo.region': 'DE-BE',
    'geo.placename': 'Berlin',
    'geo.position': '52.5200;13.4050',
    ICBM: '52.5200, 13.4050',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JOBROOFS — Berlin Portal for Flexible Jobs & Neighborhood Housing',
    description:
      'Direct marketplace for flexible work, minijobs, WG rooms and apartments across Berlin.',
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
        className={`${inter.variable} antialiased selection:bg-[#0071e3] selection:text-white pb-24 md:pb-0 font-sans`}
      >
        <AuthProvider>
          <LanguageProvider>
            {children}
            <MobileNavBar />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

