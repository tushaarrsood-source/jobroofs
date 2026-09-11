'use client';

import { useState } from 'react';
import Link from '@/components/ui/link';
import { usePathname } from 'next/navigation';
import { PlusCircle, User as UserIcon, LogOut } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/language-context';
import { useAuth } from '@/lib/firebase/auth-context';
import { AuthModal } from '@/components/auth-modal';
import { LanguageToggle } from '@/components/language-toggle';

export function SiteHeader({ control = false }: { control?: boolean } = {}) {
  const { t, isDe } = useTranslation();
  const { user, signOutUser } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
        {/* Left: Brand Logo (Jobicco Berlin Style) */}
        <Link
          href="/"
          className="group flex items-baseline gap-1.5 select-none"
        >
          <span className="text-xl font-black tracking-tight text-zinc-900">
            KIEZ<span className="text-[#e33525]">JOB</span>
          </span>
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
            Berlin
          </span>
        </Link>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Jobs link */}
          <Link
            href="/"
            className={`hidden sm:inline-block text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${
              pathname === '/'
                ? 'text-[#e33525] font-bold'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            Jobs
          </Link>

          {/* Post a job CTA - Jobicco Red Button */}
          <Link
            href="/post-a-job"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#e33525] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#c92c1d] transition-colors shadow-2xs"
          >
            <PlusCircle className="size-3.5" />
            <span>Job schalten</span>
          </Link>

          {/* Language Toggle */}
          <LanguageToggle />

          {/* User Auth */}
          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden md:inline-block text-xs font-medium text-zinc-600 max-w-[120px] truncate">
                {user.email?.split('@')[0]}
              </span>
              <button
                onClick={() => signOutUser()}
                title="Abmelden"
                className="inline-flex size-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
              >
                <LogOut className="size-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAuthOpen(true)}
              className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              <UserIcon className="size-3.5" />
              <span>Anmelden</span>
            </button>
          )}
        </div>
      </div>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </header>
  );
}
