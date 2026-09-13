'use client';

import { useState } from 'react';
import Link from '@/components/ui/link';
import { usePathname, useRouter } from 'next/navigation';
import { PlusCircle, User as UserIcon, LogOut, Smartphone } from 'lucide-react';
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
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-3.5 sm:px-4 md:px-5">
        {/* Left: Brand Logo */}
        <div className="shrink-0">
          <BrandLogo variant="full" size="md" />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
          {/* Jobs link */}
          <Link
            href="/"
            className={`hidden sm:inline-block text-sm sm:text-base tracking-[0.01em] transition-colors cursor-pointer ${
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
            className={`hidden md:inline-block text-sm sm:text-base tracking-[0.01em] transition-colors cursor-pointer ${
              pathname === '/pricing'
                ? 'text-black font-semibold'
                : 'text-zinc-600 hover:text-black font-medium'
            }`}
          >
            {isDe ? 'Preise' : 'Pricing'}
          </Link>

          {/* Post a job CTA */}
          <button
            type="button"
            onClick={handlePostJobClick}
            className="apple-press hidden sm:inline-flex items-center gap-2 rounded-xl bg-black px-4 sm:px-5 py-2.5 text-sm sm:text-base font-semibold tracking-[0.01em] text-white hover:bg-zinc-800 transition-all cursor-pointer shadow-xs"
          >
            <PlusCircle className="size-4 stroke-[2]" />
            <span>{isDe ? 'Job kostenlos inserieren' : 'Post your job (free)'}</span>
          </button>

          {/* App Install Trigger */}
          <button
            type="button"
            onClick={openAppInstallModal}
            title={isDe ? 'App installieren' : 'Install App'}
            className="apple-press hidden md:inline-flex items-center gap-2 rounded-xl bg-zinc-100 px-3 py-2 text-sm font-medium text-black hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            <Smartphone className="size-4 stroke-[1.5] text-zinc-600" />
            <span>{isDe ? 'App' : 'App'}</span>
          </button>

          {/* Language Toggle */}
          <LanguageToggle />

          {/* User Auth */}
          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden md:inline-block text-sm font-medium text-zinc-700 max-w-[120px] truncate font-mono">
                {user.email?.split('@')[0]}
              </span>
              <button
                onClick={() => signOutUser()}
                title={isDe ? 'Abmelden' : 'Sign out'}
                className="apple-press inline-flex size-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 hover:text-black hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                <LogOut className="size-4 stroke-[1.5]" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAuthOpen(true)}
              title={isDe ? 'Anmelden' : 'Sign in'}
              className="apple-press inline-flex size-9 sm:size-auto items-center justify-center gap-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 sm:px-4 sm:py-2 text-sm sm:text-base font-semibold text-black transition-colors cursor-pointer"
            >
              <UserIcon className="size-4 stroke-[2] text-black" />
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
