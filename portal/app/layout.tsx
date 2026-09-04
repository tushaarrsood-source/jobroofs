import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Oswald } from 'next/font/google';
import { LanguageProvider } from '@/lib/i18n/language-context';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const oswald = Oswald({
  variable: '--font-oswald',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
});

export const viewport: Viewport = {
  themeColor: '#18221e',
  width: 'device-width',
  initialScale: 1,
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
    url: 'https://jobroofs.com',
    title: 'JOBROOFS — Berlin Portal for Flexible Jobs & Neighborhood Housing',
    description:
      'Direct marketplace for flexible work, minijobs, WG rooms and apartments across Berlin.',
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
  icons: {
    icon: '/favicon.svg',
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
        className={`${geistSans.variable} ${geistMono.variable} ${oswald.variable} antialiased`}
      >
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}

