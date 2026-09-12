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
      className="flex w-full items-center justify-between p-4.5 text-sm font-medium text-[#202A31] hover:bg-[#F0F1EA] transition-colors cursor-pointer text-left"
    >
      <div className="flex items-center gap-3.5">
        <div className="flex size-10 items-center justify-center rounded-xl bg-white border border-[#D8DED9] text-[#202A31]">
          <Smartphone className="size-5 text-[#202A31]" />
        </div>
        <div>
          <div className="text-[#202A31] font-medium text-sm">
            {isDe ? 'App auf Home-Bildschirm' : 'Install to Home Screen'}
          </div>
          <div className="text-xs text-[#7E8A84] font-light">
            {isDe ? '1-Klick Installation für iPhone & Android' : '1-click install for iPhone & Android'}
          </div>
        </div>
      </div>
      <ArrowRight className="size-4 text-[#7E8A84]" />
    </button>
  );
}
