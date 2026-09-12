'use client';

import React from 'react';
import Link from '@/components/ui/link';
import { usePathname } from 'next/navigation';
import { Briefcase, Plus, User } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/language-context';

export function MobileNavBar() {
  const pathname = usePathname();
  const { isDe } = useTranslation();

  const isJobs = pathname === '/' || pathname.startsWith('/jobs') || pathname.startsWith('/categories');
  const isProfile = pathname.startsWith('/profil');
  const isPost = pathname === '/post-a-job' || pathname === '/post';

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-[#d8ded9] bg-[#fbfbf8]/95 backdrop-blur-xl shadow-[0_-4px_20px_rgba(32,42,49,0.06)]"
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 8px)',
      }}
    >
      <div className="mx-auto flex h-14 max-w-sm items-center justify-around px-6">
        {/* 1. Jobs Tab */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 transition-colors select-none ${
            isJobs
              ? 'text-[#202a31] font-medium'
              : 'text-[#7e8a84] hover:text-[#202a31]'
          }`}
        >
          <Briefcase className={`size-5 transition-transform ${isJobs ? 'scale-105 stroke-[1.8]' : 'stroke-[1.3]'}`} />
          <span className="mt-0.5 text-[10px] tracking-tight">Jobs</span>
        </Link>

        {/* 2. Center Action Button (+) */}
        <Link
          href="/post-a-job"
          aria-label={isDe ? 'Job inserieren' : 'Post a Job'}
          className="flex size-10 items-center justify-center rounded-full bg-[#202a31] text-[#fbfbf8] shadow-xs ring-2 ring-[#d8ded9] transition-transform active:scale-[0.92] hover:bg-[#161d22] cursor-pointer"
        >
          <Plus className="size-5 stroke-[1.8]" />
        </Link>

        {/* 3. Profile Tab */}
        <Link
          href="/profil"
          className={`flex flex-col items-center justify-center py-1 transition-colors select-none ${
            isProfile
              ? 'text-[#202a31] font-medium'
              : 'text-[#7e8a84] hover:text-[#202a31]'
          }`}
        >
          <User className={`size-5 transition-transform ${isProfile ? 'scale-105 stroke-[1.8]' : 'stroke-[1.3]'}`} />
          <span className="mt-0.5 text-[10px] tracking-tight">
            {isDe ? 'Profil' : 'Profile'}
          </span>
        </Link>
      </div>
    </nav>
  );
}
