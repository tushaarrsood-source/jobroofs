'use client';

import { useState } from 'react';
import Link from '@/components/ui/link';
import { usePathname } from 'next/navigation';
import { PlusCircle, User as UserIcon, LogOut, Smartphone } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/language-context';
import { useAuth } from '@/lib/firebase/auth-context';
import { AuthModal } from '@/components/auth-modal';
import { LanguageToggle } from '@/components/language-toggle';
import { BrandLogo } from '@/components/brand-logo';
import { openAppInstallModal } from '@/components/pwa-install-prompt';

export function SiteHeader({ control = false }: { control?: boolean } = {}) {
  const { t, isDe } = useTranslation();
  const { user, signOutUser } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[#d8ded9] bg-[#fbfbf8]/92 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 md:px-8">
        {/* Left: Brand Logo (Architectural Roof Mark + Wordmark) */}
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
                ? 'text-[#202a31] font-medium'
                : 'text-[#7e8a84] hover:text-[#202a31]'
            }`}
          >
            {isDe ? 'Alle Jobs' : 'All Jobs'}
          </Link>

          {/* Post a job CTA - Silent Luxury Deep Slate (Hidden on < sm since mobile nav has prominent center + button) */}
          <Link
            href="/post-a-job"
            className="apple-press hidden sm:inline-flex items-center gap-1.5 rounded-sm bg-[#202a31] px-3.5 sm:px-4 py-1.5 sm:py-2 text-[12.5px] font-normal tracking-[0.02em] text-[#fbfbf8] hover:bg-[#2d3a43] transition-colors cursor-pointer"
          >
            <PlusCircle className="size-3.5 stroke-[1.25]" />
            <span>{isDe ? 'Job inserieren' : 'Post a Job'}</span>
          </Link>

          {/* App Install Trigger */}
          <button
            type="button"
            onClick={openAppInstallModal}
            title={isDe ? 'JOBROOFS als App installieren' : 'Install JOBROOFS App'}
            className="apple-press hidden md:inline-flex items-center gap-1.5 rounded-sm border border-[#d8ded9] bg-transparent px-2.5 py-1.5 text-[12px] font-normal tracking-[0.02em] text-[#202a31] hover:bg-[#f4f4ee] transition-colors cursor-pointer"
          >
            <Smartphone className="size-3.5 stroke-[1.25] text-[#7e8a84]" />
            <span>App</span>
          </button>

          {/* Language Toggle */}
          <LanguageToggle />

          {/* User Auth */}
          {user ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="hidden md:inline-block text-[12px] font-normal text-[#7e8a84] max-w-[120px] truncate">
                {user.email?.split('@')[0]}
              </span>
              <button
                onClick={() => signOutUser()}
                title={isDe ? 'Abmelden' : 'Sign out'}
                className="inline-flex size-8 items-center justify-center rounded-sm border border-[#d8ded9] text-[#7e8a84] hover:text-[#202a31] hover:bg-[#f4f4ee] transition-colors cursor-pointer"
              >
                <LogOut className="size-3.5 stroke-[1.25]" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAuthOpen(true)}
              title={isDe ? 'Anmelden' : 'Sign in'}
              className="inline-flex size-8 sm:size-auto items-center justify-center gap-1.5 rounded-sm border border-[#d8ded9] bg-transparent sm:px-3 sm:py-1.5 text-[12.5px] font-normal tracking-[0.02em] text-[#202a31] hover:bg-[#f4f4ee] transition-colors cursor-pointer"
            >
              <UserIcon className="size-3.5 stroke-[1.25] text-[#7e8a84]" />
              <span className="hidden sm:inline">{isDe ? 'Anmelden' : 'Sign In'}</span>
            </button>
          )}
        </div>
      </div>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </header>
  );
}
