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
    <header className="sticky top-0 z-50 border-b border-[#e5eae7] bg-[#fafbfa]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
        {/* Left: Brand Logo (Editorial Style) */}
        <Link
          href="/"
          className="group flex items-baseline gap-2 select-none"
        >
          <span className="text-xl font-extrabold tracking-tight text-[#111816]">
            KIEZJOB<span className="text-[#1b4332]">.</span>
          </span>
          <span className="text-[11px] font-bold text-[#5c6863] uppercase tracking-widest">
            Berlin
          </span>
        </Link>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Jobs link */}
          <Link
            href="/"
            className={`hidden sm:inline-block text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
              pathname === '/'
                ? 'text-[#1b4332] bg-[#e8f1ec]'
                : 'text-[#5c6863] hover:text-[#111816]'
            }`}
          >
            Alle Jobs
          </Link>

          {/* Post a job CTA - Forest Green Pill */}
          <Link
            href="/post-a-job"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#1b4332] px-4 py-2 text-xs font-bold text-white hover:bg-[#122f23] transition-all shadow-xs active:scale-[0.98]"
          >
            <PlusCircle className="size-3.5" />
            <span>Job schalten</span>
          </Link>

          {/* Language Toggle */}
          <LanguageToggle />

          {/* User Auth */}
          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden md:inline-block text-xs font-medium text-[#5c6863] max-w-[120px] truncate">
                {user.email?.split('@')[0]}
              </span>
              <button
                onClick={() => signOutUser()}
                title="Abmelden"
                className="inline-flex size-8 items-center justify-center rounded-full border border-[#e5eae7] text-[#5c6863] hover:text-[#111816] hover:bg-white transition-colors"
              >
                <LogOut className="size-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAuthOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#e5eae7] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#111816] hover:bg-[#f2f6f4] transition-colors shadow-2xs"
            >
              <UserIcon className="size-3.5 text-[#1b4332]" />
              <span>Anmelden</span>
            </button>
          )}
        </div>
      </div>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </header>
  );
}
