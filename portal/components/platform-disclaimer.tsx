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
    <div className="rounded-xl border border-foreground/15 bg-[#f0ede6] p-5 text-xs text-[#526058]">
      <div className="flex items-start gap-3">
        <ShieldAlert className="size-4 shrink-0 text-[#857154] mt-0.5" />
        <div className="space-y-1.5 leading-relaxed">
          <p className="font-semibold text-[#18221e]">
            {isDe
              ? 'Rechtlicher Hinweis & Haftungsausschluss (Reines Schwarzes Brett / Anzeigenportal)'
              : 'Legal Notice & Liability Disclaimer (Strictly an Advertising Directory)'}
          </p>
          <p>
            {isDe ? (
              <>
                KIEZJOB ist eine reine Informations- und Anzeigenplattform. KIEZJOB ist weder Immobilienmakler, Hausverwaltung, Vermieter, Arbeitgeber noch Partei von Miet-, Untermiet- oder Arbeitsverträgen. Alle Angaben in den Inseraten stammen ausschließlich von der jeweiligen inserierenden Person und werden von uns nicht auf inhaltliche Richtigkeit, rechtliche Zulässigkeit oder Bonität geprüft.
              </>
            ) : (
              <>
                KIEZJOB is strictly an advertising directory and bulletin board. KIEZJOB is not a real estate agency, property manager, landlord, employer, or party to any tenancy, sublet, or employment contract. All information in listings is provided solely by the posting party and is not verified by us for accuracy, legality, or creditworthiness.
              </>
            )}
          </p>
          <p>
            {isDe ? (
              <>
                Jeglicher Vertragsschluss und die gesamte Kommunikation erfolgen ausschließlich direkt zwischen Suchenden und Inserierenden. KIEZJOB übernimmt keinerlei Gewähr, Garantie oder Haftung für das Zustandekommen von Verträgen, Mietzahlungen, Kautionsrückzahlungen, Sach- oder Vermögensschäden.
              </>
            ) : (
              <>
                Any agreement, transaction, and communication take place solely and directly between seekers and listers. KIEZJOB disclaims all warranties, representations, and liability for contract formation, rent payments, deposit returns, property damages, or financial loss.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
