'use client';

import React, { useState } from 'react';
import Link from '@/components/ui/link';
import { usePathname } from 'next/navigation';
import { Briefcase, Home, Plus, MapPin, User } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/language-context';
import { MobilePostDrawer } from '@/components/mobile-post-drawer';
import { ProfileDrawer } from '@/components/profile-drawer';

export function MobileNavBar() {
  const pathname = usePathname();
  const { isDe } = useTranslation();
  const [isPostDrawerOpen, setIsPostDrawerOpen] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);

  // Active route indicators
  const isMap = pathname === '/karte' || pathname.startsWith('/karte') || pathname.includes('view=map');
  const isJobs = (pathname === '/' || pathname.startsWith('/jobs') || pathname.startsWith('/categories')) && !isMap;
  const isHousing = pathname.startsWith('/wohnen') && !isMap;
  const isProfile = pathname.startsWith('/profil');

  return (
    <>
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-slate-200/90 bg-white/95 backdrop-blur-md shadow-[0_-2px_10px_rgba(0,0,0,0.04)]"
        style={{
          paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 6px)',
        }}
      >
        <div className="mx-auto flex h-14 max-w-lg items-center justify-around px-2">
          {/* 1. Jobs Tab */}
          <Link
            href="/"
            className={`flex flex-1 flex-col items-center justify-center py-1 transition-colors ${
              isJobs && !isMap
                ? 'text-blue-600 font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Briefcase className="size-5" />
            <span className="mt-0.5 text-[10px] tracking-tight">Jobs</span>
          </Link>

          {/* 2. Housing Tab */}
          <Link
            href="/wohnen"
            className={`flex flex-1 flex-col items-center justify-center py-1 transition-colors ${
              isHousing && !isMap
                ? 'text-blue-600 font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Home className="size-5" />
            <span className="mt-0.5 text-[10px] tracking-tight">
              {isDe ? 'Wohnen' : 'Housing'}
            </span>
          </Link>

          {/* 3. Center Action Button (+) */}
          <div className="flex flex-1 items-center justify-center">
            <button
              type="button"
              onClick={() => setIsPostDrawerOpen(true)}
              aria-label="Inserat aufgeben"
              className="flex size-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs transition-transform active:scale-95 hover:bg-blue-700 cursor-pointer"
            >
              <Plus className="size-5 stroke-[2.5]" />
            </button>
          </div>

          {/* 4. Map Tab */}
          <Link
            href="/karte"
            className={`flex flex-1 flex-col items-center justify-center py-1 transition-colors ${
              isMap
                ? 'text-blue-600 font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <MapPin className="size-5" />
            <span className="mt-0.5 text-[10px] tracking-tight">
              {isDe ? 'Karte' : 'Map'}
            </span>
          </Link>

          {/* 5. Profile Tab */}
          <Link
            href="/profil"
            className={`flex flex-1 flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
              isProfile
                ? 'text-blue-600 font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="size-5" />
            <span className="mt-0.5 text-[10px] tracking-tight">
              {isDe ? 'Profil' : 'Profile'}
            </span>
          </Link>
        </div>
      </nav>

      {/* Post Drawer */}
      <MobilePostDrawer
        isOpen={isPostDrawerOpen}
        onClose={() => setIsPostDrawerOpen(false)}
      />

      {/* Profile Drawer */}
      <ProfileDrawer
        isOpen={isProfileDrawerOpen}
        onClose={() => setIsProfileDrawerOpen(false)}
      />
    </>
  );
}
