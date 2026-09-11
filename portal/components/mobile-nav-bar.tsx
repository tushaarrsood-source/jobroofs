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
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-[#e5eae7] bg-[#fafbfa]/95 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.03)]"
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 6px)',
      }}
    >
      <div className="mx-auto flex h-14 max-w-sm items-center justify-around px-4">
        {/* 1. Jobs Tab */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 transition-all select-none ${
            isJobs
              ? 'text-[#1b4332] font-bold'
              : 'text-[#5c6863] hover:text-[#111816]'
          }`}
        >
          <Briefcase className={`size-5 transition-transform ${isJobs ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'}`} />
          <span className="mt-0.5 text-[10px] tracking-tight">Jobs</span>
        </Link>

        {/* 2. Center Action Button (+) */}
        <Link
          href="/post-a-job"
          aria-label="Job schalten"
          className="flex size-10 items-center justify-center rounded-full bg-[#1b4332] text-white shadow-sm ring-2 ring-[#e8f1ec] transition-transform active:scale-[0.92] hover:bg-[#122f23] cursor-pointer"
        >
          <Plus className="size-5 stroke-[2.6]" />
        </Link>

        {/* 3. Profile Tab */}
        <Link
          href="/profil"
          className={`flex flex-col items-center justify-center py-1 transition-all select-none ${
            isProfile
              ? 'text-[#1b4332] font-bold'
              : 'text-[#5c6863] hover:text-[#111816]'
          }`}
        >
          <User className={`size-5 transition-transform ${isProfile ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'}`} />
          <span className="mt-0.5 text-[10px] tracking-tight">
            {isDe ? 'Profil' : 'Profile'}
          </span>
        </Link>
      </div>
    </nav>
  );
}
