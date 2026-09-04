'use client';

import { useTranslation } from '@/lib/i18n/language-context';

export function PostAJobHeader() {
  const { t } = useTranslation();

  return (
    <div>
      <p className="text-sm font-semibold text-blue-600">{t('postJobForEmployers')}</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-[-0.045em] md:text-6xl">
        {t('postJobHeading')}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
        {t('postJobSubheading')}
      </p>
    </div>
  );
}
