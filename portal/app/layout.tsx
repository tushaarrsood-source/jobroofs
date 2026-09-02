import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
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

export const viewport: Viewport = {
  themeColor: '#18221e',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://kiezjob.de'),
  title: {
    default: 'KIEZJOB — Berlin Portal for Part-Time, Minijobs & Flexible Shifts',
    template: '%s · KIEZJOB',
  },
  description:
    'Direct from local employers & verified venues across Berlin — Minijobs, part-time work, temporary gigs, working student roles, and flexible shifts.',
  keywords: [
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
    siteName: 'KIEZJOB',
    locale: 'de_DE',
    url: 'https://kiezjob.de',
    title: 'KIEZJOB — Berlin Portal for Part-Time, Minijobs & Flexible Shifts',
    description:
      'Direct from local employers & verified venues across Berlin — Minijobs, part-time work, temporary gigs, working student roles, and flexible shifts.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KIEZJOB — Berlin Portal for Part-Time, Minijobs & Flexible Shifts',
    description:
      'Direct from local employers & verified venues across Berlin — Minijobs, part-time work, temporary gigs, and flexible shifts.',
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
      'de-DE': 'https://kiezjob.de',
      'en-US': 'https://kiezjob.de',
      'x-default': 'https://kiezjob.de',
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}

