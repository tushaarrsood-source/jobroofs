'use client';

import React from 'react';
import { Smartphone, ArrowRight } from 'lucide-react';
import { openAppInstallModal } from '@/components/pwa-install-prompt';
import { useTranslation } from '@/lib/i18n/language-context';

export function ProfileAppTrigger() {
  const { isDe } = useTranslation();

  return (
    <button
      type="button"
      onClick={openAppInstallModal}
      className="apple-press flex w-full items-center justify-between p-4.5 text-sm font-semibold text-black hover:bg-zinc-50 transition-colors cursor-pointer text-left active:scale-[0.99]"
    >
      <div className="flex items-center gap-3.5">
        <div className="flex size-10 items-center justify-center rounded-xl bg-zinc-100 border border-zinc-200 text-black">
          <Smartphone className="size-5 stroke-[2]" />
        </div>
        <div>
          <div className="text-black font-bold text-sm">
            {isDe ? 'App auf Home-Bildschirm' : 'Install to Home Screen'}
          </div>
          <div className="text-xs text-zinc-600 font-normal">
            {isDe ? '1-Klick Installation für iPhone & Android' : '1-click install for iPhone & Android'}
          </div>
        </div>
      </div>
      <ArrowRight className="size-4 text-zinc-400 stroke-[2]" />
    </button>
  );
}
