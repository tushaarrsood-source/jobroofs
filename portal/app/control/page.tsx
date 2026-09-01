import {
  Activity,
  AlertTriangle,
  Bot,
  CircleDot,
  Database,
  FileCheck2,
  Radar,
  ShieldCheck,
} from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { previewSources } from '@/lib/domain/preview-data';
import {
  employmentForms,
  industryNiches,
  roleFamilies,
  workConditionTags,
} from '@/lib/domain/taxonomy';

export const metadata: Metadata = {
  title: 'Internal control room',
  robots: { index: false, follow: false },
};

const metricCards = [
  {
    label: 'Live jobs',
    value: '0',
    detail: 'Publication remains locked',
    icon: FileCheck2,
  },
  {
    label: 'Mapped niches',
    value: String(industryNiches.length),
    detail: `${industryNiches.filter((item) => item.priority === 'launch').length} launch priority`,
    icon: Database,
  },
  {
    label: 'Source groups',
    value: String(previewSources.length),
    detail: 'Adapter plan, not live sources',
    icon: Radar,
  },
  {
    label: 'Review exceptions',
    value: '0',
    detail: 'No ingestion runs yet',
    icon: AlertTriangle,
  },
];

export default function ControlPage() {
  const totalSourceTarget = industryNiches.reduce(
    (sum, niche) => sum + niche.sourceTarget,
    0,
  );

  return (
    <main className="min-h-screen bg-[#eef0ec] text-[#18221e]">
      <SiteHeader control />
      <div className="mx-auto max-w-[1440px] px-5 py-8 md:px-10 md:py-12">
        <div className="flex flex-col gap-5 border-b border-foreground/15 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Operations / Berlin</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-[-0.045em] md:text-6xl">
              Source control room
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              The operational truth for discovery, extraction, evidence, review,
              publication and suppression.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[#c7d8cc] bg-[#e2f3e6] px-3 py-2 text-xs font-medium text-[#285a39]">
            <CircleDot className="size-3.5" /> Safe mode · publication locked
          </div>
        </div>

        <section className="grid gap-3 py-7 sm:grid-cols-2 xl:grid-cols-4">
          {metricCards.map(({ label, value, detail, icon: Icon }) => (
            <article
              key={label}
              className="rounded-xl border border-foreground/12 bg-white p-5"
            >
              <div className="flex items-start justify-between">
                <p className="text-sm text-muted-foreground">{label}</p>
                <Icon className="size-4 text-[#65716a]" />
              </div>
              <p className="mt-5 text-4xl font-semibold tracking-[-0.05em]">
                {value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="overflow-hidden rounded-xl border border-foreground/12 bg-white">
            <div className="flex items-center justify-between border-b border-foreground/12 px-5 py-4">
              <div>
                <p className="text-sm font-semibold">Ingestion pipeline</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  One job record must pass every gate.
                </p>
              </div>
              <Bot className="size-5 text-[#385cdd]" />
            </div>
            <div className="grid gap-px bg-foreground/10 sm:grid-cols-3">
              {[
                [
                  '01',
                  'Scout',
                  'Discover lesser-known Berlin employer sources and score their usefulness.',
                ],
                [
                  '02',
                  'Extract',
                  'Capture the page, structured fields and exact evidence without interpretation.',
                ],
                [
                  '03',
                  'Filter',
                  'Reject non-Berlin, full-time-only, stale, duplicate or unverifiable records.',
                ],
                [
                  '04',
                  'Organize',
                  'Map industry, role, employment form and conditions into separate fields.',
                ],
                [
                  '05',
                  'Review',
                  'Route uncertainty and contradictions to a human evidence screen.',
                ],
                [
                  '06',
                  'Publish',
                  'Release only complete, live records; suppress on failed re-check.',
                ],
              ].map(([step, title, copy]) => (
                <article key={step} className="min-h-40 bg-white p-5">
                  <span className="font-mono text-[11px] text-[#87918b]">
                    {step}
                  </span>
                  <h2 className="mt-6 font-semibold">{title}</h2>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    {copy}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-foreground/12 bg-[#18221e] p-6 text-[#f4f0e7]">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#91a097]">
                  System readiness
                </p>
                <h2 className="mt-2 text-xl font-semibold">
                  Blocked by design
                </h2>
              </div>
              <ShieldCheck className="size-5 text-[#72c697]" />
            </div>
            <div className="mt-7 space-y-5">
              {[
                ['Taxonomy', 'Ready', '30 industries + 27 roles'],
                ['Database contract', 'Ready', 'D1 schema and audit trail'],
                ['Scraper credential', 'Missing', 'FIRECRAWL_API_KEY'],
                ['Source approval', 'Pending', 'No sources authorized yet'],
                ['Public release', 'Locked', 'Requires verified records'],
              ].map(([label, state, detail]) => (
                <div
                  key={label}
                  className="grid grid-cols-[1fr_auto] gap-3 border-b border-white/10 pb-4 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">{label}</p>
                    <p className="mt-1 text-xs text-[#91a097]">{detail}</p>
                  </div>
                  <span
                    className={`h-fit rounded-full px-2 py-1 text-[10px] font-semibold ${state === 'Ready' ? 'bg-[#244b34] text-[#9de0b7]' : 'bg-[#503d29] text-[#f3c987]'}`}
                  >
                    {state}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-5 overflow-hidden rounded-xl border border-foreground/12 bg-white">
          <div className="flex flex-col gap-2 border-b border-foreground/12 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold">Source registry plan</p>
              <p className="mt-1 text-xs text-muted-foreground">
                These are source groups and adapter priorities—not claims of
                active scraping.
              </p>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              60%+ direct-source target
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-[#f5f6f3] text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-medium">Source group</th>
                  <th className="px-4 py-3 font-medium">Kind</th>
                  <th className="px-4 py-3 font-medium">Niches</th>
                  <th className="px-4 py-3 font-medium">Cadence</th>
                  <th className="px-4 py-3 font-medium">State</th>
                  <th className="px-5 py-3 font-medium">Why</th>
                </tr>
              </thead>
              <tbody>
                {previewSources.map((source) => (
                  <tr
                    key={source.name}
                    className="border-t border-foreground/10"
                  >
                    <td className="px-5 py-4 font-medium">{source.name}</td>
                    <td className="px-4 py-4 text-muted-foreground">
                      {source.kind}
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">
                      {source.niches}
                    </td>
                    <td className="px-4 py-4 font-mono text-xs">
                      {source.cadence}
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-[#eef0ec] px-2 py-1 text-xs">
                        {source.state}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">
                      {source.reason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px]">
          <div className="rounded-xl border border-foreground/12 bg-white p-5">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-sm font-semibold">Niche coverage map</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Targets guide source discovery; they are not current counts.
                </p>
              </div>
              <span className="font-mono text-xs text-muted-foreground">
                {totalSourceTarget} target source relationships
              </span>
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {industryNiches.map((niche, index) => (
                <div
                  key={niche.id}
                  className="grid grid-cols-[28px_1fr_auto] items-center gap-2 rounded-lg border border-foreground/10 p-3"
                >
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium">
                      {niche.label}
                    </p>
                    <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
                      {niche.labelDe}
                    </p>
                  </div>
                  <span className="font-mono text-xs font-semibold">
                    {niche.sourceTarget}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-xl border border-foreground/12 bg-white p-5">
              <div className="flex items-center gap-2">
                <Activity className="size-4 text-[#385cdd]" />
                <p className="text-sm font-semibold">Taxonomy dimensions</p>
              </div>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Industries</dt>
                  <dd className="font-mono">{industryNiches.length}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Role families</dt>
                  <dd className="font-mono">{roleFamilies.length}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Employment forms</dt>
                  <dd className="font-mono">{employmentForms.length}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Work-condition tags</dt>
                  <dd className="font-mono">{workConditionTags.length}</dd>
                </div>
              </dl>
            </div>
            <div className="rounded-xl border border-[#e1bc67] bg-[#fff6db] p-5">
              <p className="text-sm font-semibold text-[#5f4816]">
                Classification rule
              </p>
              <p className="mt-2 text-xs leading-5 text-[#795e22]">
                Unknown stays unknown. “English accepted” requires explicit
                source evidence. “Aushilfe” may trigger a role-family review but
                never replaces contract form.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
import type { Metadata } from 'next';
