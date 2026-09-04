'use client';

import Link from '@/components/ui/link';
import { ShieldCheck, ShieldAlert, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/language-context';

export function PlatformDisclaimer({
  type = 'housing',
  variant = 'trust',
}: {
  type?: 'housing' | 'jobs';
  variant?: 'trust' | 'full';
}) {
  const { isDe } = useTranslation();

  if (variant === 'trust') {
    return (
      <div className="rounded-[20px] border border-black/[0.06] bg-[#f5f5f7]/80 p-4 sm:p-5 text-xs text-[#1d1d1f] shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
        <div className="flex items-start gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white shadow-2xs text-[#0071e3] border border-black/[0.04]">
            <ShieldCheck className="size-4.5 stroke-[2.2]" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="font-semibold text-[#1d1d1f] text-[13px] tracking-tight">
              {isDe
                ? 'Kiez-Transparenz & Schutz für Suchende'
                : 'Community Transparency & Safety'}
            </p>
            <p className="text-[12px] leading-relaxed text-[#86868b]">
              {isDe ? (
                <>
                  100% Direktkontakt ohne Maklergebühren oder Vermittlungsagenturen. Alle Verträge werden direkt zwischen den Parteien geschlossen.
                  <span className="font-medium text-[#1d1d1f]"> Sicherheitshinweis:</span> Leiste niemals Kautionen oder Zahlungen vor einer persönlichen Wohnungsbesichtigung oder vor offiziellem Arbeitsbeginn.
                </>
              ) : (
                <>
                  100% direct contact with zero broker fees or agency markups. All agreements are made directly between the parties.
                  <span className="font-medium text-[#1d1d1f]"> Security advice:</span> Never pay deposits or fees prior to an in-person viewing or official start date.
                </>
              )}
            </p>
            <div className="pt-1">
              <Link
                href="/disclaimer"
                className="inline-flex items-center gap-1 text-[11.5px] font-medium text-[#0071e3] hover:underline"
              >
                <span>{isDe ? 'Rechtliche Hinweise & AGB Details' : 'Legal terms & guidelines'}</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Complete legal disclaimer for /disclaimer, /agb, /impressum
  return (
    <div className="rounded-[20px] border border-black/[0.06] bg-white p-5 text-xs text-[#1d1d1f] shadow-2xs">
      <div className="flex items-start gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-black/[0.04] text-[#86868b]">
          <ShieldAlert className="size-4" />
        </div>
        <div className="space-y-2 leading-relaxed flex-1">
          <p className="font-semibold text-sm text-[#1d1d1f] tracking-tight">
            {isDe
              ? 'Rechtlicher Hinweis & Haftungsausschluss (Plattformbetrieb nach DDG & DSA)'
              : 'Legal Notice & Liability Framework (Platform Operation under DDG & DSA)'}
          </p>
          <p className="text-[12px] text-[#86868b]">
            {isDe ? (
              <>
                JOBROOFS ist eine Informations- und Anzeigenplattform für Berlin. JOBROOFS ist weder Makler, Hausverwaltung, Vermieter noch Arbeitgeber. Alle Angaben stammen von den jeweiligen Inserierenden. Sämtliche Kommunikation und Verträge erfolgen eigenverantwortlich direkt zwischen den Nutzerinnen und Nutzern.
              </>
            ) : (
              <>
                JOBROOFS operates as an online directory and information bulletin board for Berlin. JOBROOFS is not a broker, property manager, landlord, or employer. All listing data originates from the respective posting parties.
              </>
            )}
          </p>
          <p className="text-[12px] text-[#86868b]">
            {isDe ? (
              <>
                JOBROOFS übernimmt im gesetzlich zulässigen Rahmen keine Haftung für das Zustandekommen von Miet- oder Arbeitsverhältnissen, Zahlungsabwicklungen oder fehlerhafte Angaben Dritter. Bei verdächtigen Inseraten bitten wir um unverzügliche Kontaktaufnahme über unser Kontaktformular oder per E-Mail an hilfe@jobroofs.com zur Prüfung und Sperrung.
              </>
            ) : (
              <>
                JOBROOFS disclaims liability for contracts, payment transactions, or third-party inaccuracies to the fullest extent permitted by law. Please report suspicious listings immediately for review.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
