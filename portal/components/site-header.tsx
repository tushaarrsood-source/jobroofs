'use client';

import { useState } from 'react';
import Link from '@/components/ui/link';
import { usePathname, useRouter } from 'next/navigation';
import { PlusCircle, User as UserIcon, LogOut, Smartphone, Mail } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/language-context';
import { useAuth } from '@/lib/firebase/auth-context';
import { AuthModal } from '@/components/auth-modal';
import { LanguageToggle } from '@/components/language-toggle';
import { BrandLogo } from '@/components/brand-logo';
import { openAppInstallModal } from '@/components/pwa-install-prompt';

export function SiteHeader({ control = false }: { control?: boolean } = {}) {
  const router = useRouter();
  const { t, isDe } = useTranslation();
  const { user, signOutUser } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [pendingPostJob, setPendingPostJob] = useState(false);
  const pathname = usePathname();

  const handlePostJobClick = () => {
    if (!user) {
      setPendingPostJob(true);
      setAuthOpen(true);
    } else {
      router.push('/post-a-job');
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md transition-all shadow-2xs">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 md:px-8">
        {/* Left: Brand Logo */}
        <div className="shrink-0">
          <BrandLogo variant="full" size="md" />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Jobs link */}
          <Link
            href="/"
            className={`hidden sm:inline-block text-[13px] tracking-[0.01em] transition-colors cursor-pointer ${
              pathname === '/'
                ? 'text-black font-semibold'
                : 'text-zinc-600 hover:text-black font-medium'
            }`}
          >
            {isDe ? 'Alle Jobs' : 'All Jobs'}
          </Link>

          {/* Pricing link */}
          <Link
            href="/pricing"
            className={`hidden md:inline-block text-[13px] tracking-[0.01em] transition-colors cursor-pointer ${
              pathname === '/pricing'
                ? 'text-black font-semibold'
                : 'text-zinc-600 hover:text-black font-medium'
            }`}
          >
            {isDe ? 'Preise' : 'Pricing'}
          </Link>

          {/* Official Enquiry Email */}
          <a
            href="mailto:jobroofs@gmail.com"
            title={isDe ? 'Offizielle Anfragen & Support' : 'Official Enquiries & Support'}
            className="hidden lg:inline-flex items-center gap-1.5 text-[12px] text-zinc-600 hover:text-black transition-colors font-mono font-medium"
          >
            <Mail className="size-3.5 stroke-[1.5]" />
            <span>jobroofs@gmail.com</span>
          </a>

          {/* Post a job CTA */}
          <button
            type="button"
            onClick={handlePostJobClick}
            className="apple-press hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-black px-4 py-2 text-[12.5px] font-medium tracking-[0.02em] text-white hover:bg-zinc-800 transition-all cursor-pointer shadow-xs"
          >
            <PlusCircle className="size-3.5 stroke-[1.5]" />
            <span>{isDe ? 'Job inserieren' : 'Post a Job'}</span>
          </button>

          {/* App Install Trigger */}
          <button
            type="button"
            onClick={openAppInstallModal}
            title={isDe ? 'JOBROOFS als App installieren' : 'Install JOBROOFS App'}
            className="apple-press hidden md:inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[12px] font-medium tracking-[0.02em] text-black hover:border-black hover:bg-zinc-50 transition-colors cursor-pointer"
          >
            <Smartphone className="size-3.5 stroke-[1.5] text-zinc-600" />
            <span>App</span>
          </button>

          {/* Language Toggle */}
          <LanguageToggle />

          {/* User Auth */}
          {user ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="hidden md:inline-block text-[12px] font-medium text-zinc-700 max-w-[120px] truncate font-mono">
                {user.email?.split('@')[0]}
              </span>
              <button
                onClick={() => signOutUser()}
                title={isDe ? 'Abmelden' : 'Sign out'}
                className="apple-press inline-flex size-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:text-black hover:border-black hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                <LogOut className="size-3.5 stroke-[1.5]" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAuthOpen(true)}
              title={isDe ? 'Anmelden' : 'Sign in'}
              className="apple-press inline-flex size-8 sm:size-auto items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white sm:px-3 sm:py-1.5 text-[12.5px] font-medium tracking-[0.02em] text-black hover:border-black hover:bg-zinc-50 transition-colors cursor-pointer shadow-2xs"
            >
              <UserIcon className="size-3.5 stroke-[1.5] text-black" />
              <span className="hidden sm:inline">{isDe ? 'Anmelden' : 'Sign In'}</span>
            </button>
          )}
        </div>
      </div>

      <AuthModal
        isOpen={authOpen}
        onClose={() => {
          setAuthOpen(false);
          setPendingPostJob(false);
        }}
        onSuccess={() => {
          if (pendingPostJob) {
            setPendingPostJob(false);
            router.push('/post-a-job');
          }
        }}
      />
    </header>
  );
}
