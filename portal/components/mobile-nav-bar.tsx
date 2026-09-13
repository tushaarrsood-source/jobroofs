'use client';

import React, { useState } from 'react';
import Link from '@/components/ui/link';
import { usePathname, useRouter } from 'next/navigation';
import { Briefcase, Plus, User } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/language-context';
import { useAuth } from '@/lib/firebase/auth-context';
import { AuthModal } from '@/components/auth-modal';

export function MobileNavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isDe } = useTranslation();
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  const isJobs = pathname === '/' || pathname.startsWith('/jobs') || pathname.startsWith('/categories');
  const isProfile = pathname.startsWith('/profil');

  const handlePostClick = () => {
    if (!user) {
      setAuthOpen(true);
    } else {
      router.push('/post-a-job');
    }
  };

  return (
    <>
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-zinc-200 bg-white/95 backdrop-blur-xl shadow-lg"
        style={{
          paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 8px)',
        }}
      >
        <div className="mx-auto flex h-14 max-w-sm items-center justify-around px-6">
          {/* 1. Jobs Tab */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center py-1 transition-colors select-none active:scale-[0.95] ${
              isJobs
                ? 'text-black font-bold'
                : 'text-zinc-500 hover:text-black font-medium'
            }`}
          >
            <Briefcase className={`size-5 transition-transform ${isJobs ? 'scale-105 stroke-[2.2]' : 'stroke-[1.6]'}`} />
            <span className="mt-0.5 text-[10.5px] tracking-tight">Jobs</span>
          </Link>

          {/* 2. Center Action Button (+) */}
          <button
            type="button"
            onClick={handlePostClick}
            aria-label={isDe ? 'Job inserieren' : 'Post a Job'}
            className="flex size-10 items-center justify-center rounded-full bg-black text-white shadow-sm ring-2 ring-zinc-200 transition-all active:scale-[0.90] hover:bg-zinc-800 cursor-pointer"
          >
            <Plus className="size-5 stroke-[2.2]" />
          </button>

          {/* 3. Profile Tab */}
          <Link
            href="/profil"
            className={`flex flex-col items-center justify-center py-1 transition-colors select-none active:scale-[0.95] ${
              isProfile
                ? 'text-black font-bold'
                : 'text-zinc-500 hover:text-black font-medium'
            }`}
          >
            <User className={`size-5 transition-transform ${isProfile ? 'scale-105 stroke-[2.2]' : 'stroke-[1.6]'}`} />
            <span className="mt-0.5 text-[10.5px] tracking-tight">
              {isDe ? 'Profil' : 'Profile'}
            </span>
          </Link>
        </div>
      </nav>

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={() => router.push('/post-a-job')}
      />
    </>
  );
}
