import Link from 'next/link';
import { ArrowUpRight, MapPin } from 'lucide-react';

export function SiteHeader({ control = false }: { control?: boolean }) {
  return (
    <header className="border-b border-foreground/15 bg-[#f4f0e7]">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 md:px-10">
        <Link
          href="/"
          className="flex items-center gap-3 font-semibold tracking-[-0.03em]"
        >
          <span className="grid size-8 place-items-center rounded-full bg-[#18221e] text-[#f4f0e7]">
            <MapPin className="size-4" strokeWidth={2.4} />
          </span>
          <span>KIEZJOB</span>
          {control ? (
            <span className="hidden rounded-full bg-[#d9ddd7] px-2 py-1 font-mono text-[10px] uppercase tracking-widest sm:inline">
              Control room
            </span>
          ) : null}
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          {control ? (
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 font-medium hover:underline"
            >
              Public portal <ArrowUpRight className="size-3.5" />
            </Link>
          ) : (
            <>
              <Link
                href="/direct-employers"
                className="hidden text-muted-foreground hover:text-foreground sm:inline"
              >
                Direct employers
              </Link>
              <Link
                href="/latest-jobs"
                className="hidden text-muted-foreground hover:text-foreground md:inline"
              >
                Latest jobs
              </Link>
              <Link
                href="/#niches"
                className="hidden text-muted-foreground hover:text-foreground lg:inline"
              >
                Categories
              </Link>
              <Link
                href="/post-a-job"
                className="inline-flex h-9 items-center rounded-lg bg-[#18221e] px-4 font-semibold text-white transition hover:bg-[#2a3832]"
              >
                Post a job <ArrowUpRight className="ml-1.5 size-3.5" />
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
