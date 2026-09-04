'use client';

import { ShieldAlert } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/language-context';

export function PlatformDisclaimer({
  type = 'housing',
}: {
  type?: 'housing' | 'jobs';
}) {
  const { isDe } = useTranslation();

  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-100/70 p-4.5 text-xs text-zinc-600 shadow-2xs">
      <div className="flex items-start gap-3">
        <ShieldAlert className="size-4 shrink-0 text-zinc-500 mt-0.5" />
        <div className="space-y-1.5 leading-relaxed">
          <p className="font-bold text-zinc-950">
            {isDe
              ? 'Rechtlicher Hinweis & Haftungsausschluss (Reines Schwarzes Brett / Anzeigenportal)'
              : 'Legal Notice & Liability Disclaimer (Strictly an Advertising Directory)'}
          </p>
          <p className="text-[11px] text-zinc-500">
            {isDe ? (
              <>
                JOBROOFS ist eine reine Informations- und Anzeigenplattform. JOBROOFS ist weder Immobilienmakler, Hausverwaltung, Vermieter, Arbeitgeber noch Partei von Miet-, Untermiet- oder Arbeitsverträgen. Alle Angaben in den Inseraten stammen ausschließlich von der jeweiligen inserierenden Person und werden von uns nicht auf inhaltliche Richtigkeit, rechtliche Zulässigkeit oder Bonität geprüft.
              </>
            ) : (
              <>
                JOBROOFS is strictly an advertising directory and bulletin board. JOBROOFS is not a real estate agency, property manager, landlord, employer, or party to any tenancy, sublet, or employment contract. All information in listings is provided solely by the posting party and is not verified by us for accuracy, legality, or creditworthiness.
              </>
            )}
          </p>
          <p className="text-[11px] text-zinc-500">
            {isDe ? (
              <>
                Jeglicher Vertragsschluss und die gesamte Kommunikation erfolgen ausschließlich direkt zwischen Suchenden und Inserierenden. JOBROOFS übernimmt keinerlei Gewähr, Garantie oder Haftung für das Zustandekommen von Verträgen, Mietzahlungen, Kautionsrückzahlungen, Sach- oder Vermögensschäden.
              </>
            ) : (
              <>
                Any agreement, transaction, and communication take place solely and directly between seekers and listers. JOBROOFS disclaims all warranties, representations, and liability for contract formation, rent payments, deposit returns, property damages, or financial loss.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
