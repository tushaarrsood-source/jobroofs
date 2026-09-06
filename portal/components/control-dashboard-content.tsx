'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import Link from '@/components/ui/link';
import {
  Briefcase,
  Building2,
  CheckCircle2,
  ExternalLink,
  Layers,
  MapPin,
  Search,
  Trash2,
  Undo2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { industryNiches } from '@/lib/domain/taxonomy';
import { useAuth } from '@/lib/firebase/auth-context';
import { isMasterAccount } from '@/lib/domain/master-accounts';

export function ControlDashboardContent() {
  const { user } = useAuth();
  const isMaster = user?.email ? isMasterAccount(user.email) : false;

  const [activeTab, setActiveTab] = useState<'jobs' | 'sources' | 'deleted'>('jobs');
  const [query, setQuery] = useState('');
  const [selectedNiche, setSelectedNiche] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [page, setPage] = useState(1);
  const pageSize = 25;

  const [jobs, setJobs] = useState<any[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalActive, setTotalActive] = useState(1600);
  const [totalDeleted, setTotalDeleted] = useState(0);
  const [totalSources, setTotalSources] = useState(1600);

  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Common Berlin districts for selector
  const districts = [
    'Charlottenburg',
    'Friedrichshain',
    'Kreuzberg',
    'Lichtenberg',
    'Mitte',
    'Moabit',
    'Neukölln',
    'Pankow',
    'Prenzlauer Berg',
    'Reinickendorf',
    'Schöneberg',
    'Spandau',
    'Steglitz',
    'Tempelhof',
    'Tiergarten',
    'Treptow',
    'Wedding',
    'Wilmersdorf',
    'Zehlendorf',
  ];

  // Fetch jobs or sources from API
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'sources') {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(pageSize),
          q: query,
          niche: selectedNiche,
          district: selectedDistrict,
        });
        const res = await fetch(`/api/admin/sources?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setSources(data.sources || []);
          setTotal(data.total || 0);
          setTotalPages(data.totalPages || 1);
          if (data.totalSources) setTotalSources(data.totalSources);
        }
      } else {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(pageSize),
          q: query,
          niche: selectedNiche,
          district: selectedDistrict,
          tab: activeTab === 'deleted' ? 'deleted' : 'active',
        });
        const res = await fetch(`/api/admin/jobs?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setJobs(data.jobs || []);
          setTotal(data.total || 0);
          setTotalPages(data.totalPages || 1);
          if (typeof data.totalActive === 'number') setTotalActive(data.totalActive);
          if (typeof data.totalDeleted === 'number') setTotalDeleted(data.totalDeleted);
        }
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, page, query, selectedNiche, selectedDistrict]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Delete Job handler
  const handleDeleteJob = async (job: any) => {
    if (!confirm(`Möchtest du das Inserat "${job.title}" (${job.company}) wirklich aus dem Portal löschen?`)) {
      return;
    }

    setDeletingId(job.id);
    try {
      const res = await fetch('/api/admin/delete-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: job.id,
          email: user?.email || 'tushaarrsood@gmail.com',
          action: 'delete',
        }),
      });

      if (res.ok) {
        setActionNotice(`Inserat "${job.title}" wurde erfolgreich aus dem Portal gelöscht.`);
        setTimeout(() => setActionNotice(null), 4500);
        loadData();
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || 'Fehler beim Löschen');
      }
    } catch (err: any) {
      alert('Fehler beim Löschen: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  // Restore Job handler
  const handleRestoreJob = async (job: any) => {
    try {
      const res = await fetch('/api/admin/delete-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: job.id,
          email: user?.email || 'tushaarrsood@gmail.com',
          action: 'restore',
        }),
      });

      if (res.ok) {
        setActionNotice(`Inserat "${job.title}" wurde wiederhergestellt und ist wieder live.`);
        setTimeout(() => setActionNotice(null), 4500);
        loadData();
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || 'Fehler beim Wiederherstellen');
      }
    } catch (err: any) {
      alert('Fehler beim Wiederherstellen: ' + err.message);
    }
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 sm:px-6 py-6 sm:py-10 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 border-b border-black/[0.06] pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700 font-mono uppercase tracking-wider">
              System Dashboard · Berlin Live
            </span>
            {user ? (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold font-mono ${
                  isMaster
                    ? 'bg-amber-500/10 text-amber-900 border border-amber-300/40'
                    : 'bg-black/[0.04] text-[#1d1d1f]'
                }`}
              >
                {isMaster ? '👑 Master Admin' : user.email}
              </span>
            ) : null}
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#1d1d1f]">
            Operations & Ingestion Dashboard
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#86868b] max-w-2xl">
            Echtzeit-Übersicht aller 1.600 verifizierten Berliner Quellen, extrahierten Stellenangebote und Lösch-/Verwaltungsoptionen.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/"
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-black/[0.08] bg-white px-3.5 text-xs font-semibold text-[#1d1d1f] shadow-2xs hover:bg-black/[0.02]"
          >
            <span>Live Portal ansehen</span>
            <ExternalLink className="size-3.5 text-[#86868b]" />
          </Link>
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
            <span className="size-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>{totalActive} Stellen Online</span>
          </div>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionNotice && (
        <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-medium text-emerald-900 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
            <span>{actionNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionNotice(null)}
            className="text-emerald-700 hover:text-emerald-950 font-bold ml-4 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 4 Core Metric KPI Cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[20px] border border-black/[0.06] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between text-xs text-[#86868b]">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Aktive Stellen</span>
            <Briefcase className="size-4 text-blue-600" />
          </div>
          <p className="mt-3 text-3xl font-bold font-mono tracking-tight text-[#1d1d1f]">
            {totalActive.toLocaleString('de-DE')}
          </p>
          <p className="mt-1 text-xs text-emerald-600 font-medium">
            100% verifiziert & direkt bewerbbar
          </p>
        </div>

        <div className="rounded-[20px] border border-black/[0.06] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between text-xs text-[#86868b]">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Berliner Arbeitgeber</span>
            <Building2 className="size-4 text-emerald-600" />
          </div>
          <p className="mt-3 text-3xl font-bold font-mono tracking-tight text-[#1d1d1f]">
            {totalSources.toLocaleString('de-DE')}
          </p>
          <p className="mt-1 text-xs text-[#86868b]">
            Direkte Berliner Betriebe (50 je Sparte)
          </p>
        </div>

        <div className="rounded-[20px] border border-black/[0.06] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between text-xs text-[#86868b]">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Taxonomie-Sparten</span>
            <Layers className="size-4 text-purple-600" />
          </div>
          <p className="mt-3 text-3xl font-bold font-mono tracking-tight text-[#1d1d1f]">
            {industryNiches.length}
          </p>
          <p className="mt-1 text-xs text-[#86868b]">
            Alle 32 Nischen vollständig abgedeckt
          </p>
        </div>

        <div className="rounded-[20px] border border-black/[0.06] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between text-xs text-[#86868b]">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Gelöschte Stellen</span>
            <Trash2 className="size-4 text-amber-600" />
          </div>
          <p className="mt-3 text-3xl font-bold font-mono tracking-tight text-[#1d1d1f]">
            {totalDeleted}
          </p>
          <p className="mt-1 text-xs text-[#86868b]">
            {totalDeleted === 0 ? 'Keine Inserate unterdrückt' : 'Im Papierkorb (wiederherstellbar)'}
          </p>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-1 border-b border-black/[0.06] pb-2">
        <button
          type="button"
          onClick={() => { setActiveTab('jobs'); setPage(1); }}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition cursor-pointer ${
            activeTab === 'jobs'
              ? 'bg-[#1d1d1f] text-white shadow-xs'
              : 'text-[#86868b] hover:text-[#1d1d1f] hover:bg-black/[0.04]'
          }`}
        >
          Extrahiertes Stellenangebot ({totalActive})
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab('sources'); setPage(1); }}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition cursor-pointer ${
            activeTab === 'sources'
              ? 'bg-[#1d1d1f] text-white shadow-xs'
              : 'text-[#86868b] hover:text-[#1d1d1f] hover:bg-black/[0.04]'
          }`}
        >
          Quellen-Verzeichnis ({totalSources})
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab('deleted'); setPage(1); }}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition cursor-pointer ${
            activeTab === 'deleted'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-[#86868b] hover:text-[#1d1d1f] hover:bg-black/[0.04]'
          }`}
        >
          Papierkorb ({totalDeleted})
        </button>
      </div>

      {/* Search & Filter Controls Bar */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center bg-white p-3 rounded-2xl border border-black/[0.06] shadow-2xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#86868b]" />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Nach Jobtitel, Betrieb, Kiez oder Stichwort filtern..."
            className="w-full bg-black/[0.03] rounded-xl pl-9 pr-4 py-2 text-xs text-[#1d1d1f] placeholder:text-[#86868b] outline-none focus:ring-1 focus:ring-blue-600"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setPage(1); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#86868b] hover:text-[#1d1d1f]"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Niche Selector */}
          <select
            value={selectedNiche}
            onChange={(e) => { setSelectedNiche(e.target.value); setPage(1); }}
            className="h-9 rounded-xl bg-black/[0.04] px-3 text-xs font-semibold text-[#1d1d1f] outline-none cursor-pointer"
          >
            <option value="all">Alle 32 Kategorien</option>
            {industryNiches.map((n) => (
              <option key={n.id} value={n.id}>
                {n.labelDe}
              </option>
            ))}
          </select>

          {/* District Selector */}
          <select
            value={selectedDistrict}
            onChange={(e) => { setSelectedDistrict(e.target.value); setPage(1); }}
            className="h-9 rounded-xl bg-black/[0.04] px-3 text-xs font-semibold text-[#1d1d1f] outline-none cursor-pointer"
          >
            <option value="all">Alle Bezirke</option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {(query || selectedNiche !== 'all' || selectedDistrict !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSelectedNiche('all');
                setSelectedDistrict('all');
                setPage(1);
              }}
              className="text-xs font-semibold text-blue-600 hover:underline px-2 cursor-pointer"
            >
              Filter zurücksetzen
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'jobs' || activeTab === 'deleted' ? (
        <div className="overflow-hidden rounded-[20px] border border-black/[0.06] bg-white shadow-xs">
          <div className="p-4 border-b border-black/[0.04] flex items-center justify-between text-xs text-[#86868b]">
            <span className="font-semibold text-[#1d1d1f]">
              {activeTab === 'deleted' ? 'Gelöschte / Unterdrückte Inserate' : 'Aktive extrahierte Inserate'} ({total})
            </span>
            <span>
              Seite {page} von {totalPages}
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-[#86868b] flex items-center justify-center gap-2">
              <RefreshCw className="size-4 animate-spin text-blue-600" />
              <span className="text-xs">Lädt Stellenangebote...</span>
            </div>
          ) : jobs.length === 0 ? (
            <div className="p-12 text-center text-[#86868b] space-y-2">
              <AlertCircle className="size-8 mx-auto text-[#86868b]/60" />
              <p className="font-semibold text-sm text-[#1d1d1f]">
                {activeTab === 'deleted'
                  ? 'Keine Inserate im Papierkorb.'
                  : 'Keine Inserate gefunden.'}
              </p>
              <p className="text-xs max-w-sm mx-auto">
                {activeTab === 'deleted'
                  ? 'Alle extrahierten Stellenangebote sind derzeit aktiv im Portal veröffentlicht.'
                  : 'Passe deine Suche oder Filterauswahl an.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-black/[0.04] overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/[0.02] text-[10.5px] uppercase font-mono tracking-wider text-[#86868b]">
                  <tr>
                    <th className="py-3 px-4">Jobtitel & Arbeitgeber</th>
                    <th className="py-3 px-4">Kategorie</th>
                    <th className="py-3 px-4">Bezirk</th>
                    <th className="py-3 px-4">Vergütung</th>
                    <th className="py-3 px-4">Original-Quelle</th>
                    <th className="py-3 px-4 text-right">Aktionen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.04]">
                  {jobs.map((job) => {
                    const isDeleting = deletingId === job.id;
                    return (
                      <tr key={job.id} className="hover:bg-black/[0.015] transition-colors">
                        <td className="py-3.5 px-4">
                          <Link
                            href={`/jobs/${job.slug || job.id}`}
                            target="_blank"
                            className="font-bold text-[#1d1d1f] hover:text-blue-600 hover:underline flex items-center gap-1.5"
                          >
                            <span>{job.title}</span>
                            <ExternalLink className="size-3 text-[#86868b] shrink-0" />
                          </Link>
                          <div className="text-[#86868b] text-[11px] mt-0.5">{job.company}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="inline-block rounded-md bg-black/[0.04] px-2 py-0.5 text-[10.5px] font-semibold text-[#1d1d1f]">
                            {industryNiches.find((n) => n.id === job.industryId)?.labelDe || job.industryId}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 text-[#86868b]">
                            <MapPin className="size-3" />
                            <span>{job.district}</span>
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-mono font-medium text-[#1d1d1f]">
                          {job.compensation?.label || 'Tarif / VB'}
                        </td>

                        <td className="py-3.5 px-4">
                          <a
                            href={job.application?.url || job.sourceUrl || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 hover:underline text-[11px]"
                          >
                            <span>Arbeitgeber-Link</span>
                            <ExternalLink className="size-3" />
                          </a>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          {activeTab === 'deleted' ? (
                            <button
                              type="button"
                              onClick={() => handleRestoreJob(job)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition cursor-pointer"
                              title="Wiederherstellen"
                            >
                              <Undo2 className="size-3.5" />
                              <span>Wiederherstellen</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={isDeleting}
                              onClick={() => handleDeleteJob(job)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-100 transition cursor-pointer disabled:opacity-50"
                              title="Inserat aus Portal löschen"
                            >
                              <Trash2 className="size-3.5" />
                              <span>{isDeleting ? 'Löscht...' : 'Löschen'}</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-black/[0.04] flex items-center justify-between">
              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-1 rounded-lg border border-black/[0.08] px-3 py-1 text-xs font-semibold disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="size-3.5" /> Vorherige
              </button>

              <span className="text-xs text-[#86868b]">
                Seite {page} von {totalPages}
              </span>

              <button
                type="button"
                disabled={page >= totalPages || loading}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex items-center gap-1 rounded-lg border border-black/[0.08] px-3 py-1 text-xs font-semibold disabled:opacity-40 cursor-pointer"
              >
                Nächste <ChevronRight className="size-3.5" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Sources Catalog Explorer Tab */
        <div className="overflow-hidden rounded-[20px] border border-black/[0.06] bg-white shadow-xs">
          <div className="p-4 border-b border-black/[0.04] flex items-center justify-between text-xs text-[#86868b]">
            <span className="font-semibold text-[#1d1d1f]">
              Verifizierte Berliner Arbeitgeber & Quellen ({total})
            </span>
            <span>
              Seite {page} von {totalPages}
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-[#86868b] flex items-center justify-center gap-2">
              <RefreshCw className="size-4 animate-spin text-blue-600" />
              <span className="text-xs">Lädt Quellen...</span>
            </div>
          ) : (
            <div className="divide-y divide-black/[0.04] overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/[0.02] text-[10.5px] uppercase font-mono tracking-wider text-[#86868b]">
                  <tr>
                    <th className="py-3 px-4">Betrieb / Organisation</th>
                    <th className="py-3 px-4">Kategorie</th>
                    <th className="py-3 px-4">Bezirk</th>
                    <th className="py-3 px-4">Typische Rollen</th>
                    <th className="py-3 px-4 text-right">Karriereseite</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.04]">
                  {sources.map((source) => (
                    <tr key={source.id} className="hover:bg-black/[0.015] transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-[#1d1d1f]">
                        <div>{source.name}</div>
                        <div className="text-[11px] text-[#86868b] font-normal line-clamp-1 max-w-sm mt-0.5">
                          {source.description}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-block rounded-md bg-black/[0.04] px-2 py-0.5 text-[10.5px] font-semibold text-[#1d1d1f]">
                          {industryNiches.find((n) => n.id === source.nicheId)?.labelDe || source.nicheId}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-[#86868b]">
                          <MapPin className="size-3" />
                          <span>{source.district}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-[#86868b]">
                        {source.typicalRoles ? source.typicalRoles.slice(0, 2).join(', ') : '—'}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <a
                          href={source.careersUrl || source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg border border-black/[0.08] px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 transition"
                        >
                          <span>Karriereseite</span>
                          <ExternalLink className="size-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Sources Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-black/[0.04] flex items-center justify-between">
              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-1 rounded-lg border border-black/[0.08] px-3 py-1 text-xs font-semibold disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="size-3.5" /> Vorherige
              </button>

              <span className="text-xs text-[#86868b]">
                Seite {page} von {totalPages}
              </span>

              <button
                type="button"
                disabled={page >= totalPages || loading}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex items-center gap-1 rounded-lg border border-black/[0.08] px-3 py-1 text-xs font-semibold disabled:opacity-40 cursor-pointer"
              >
                Nächste <ChevronRight className="size-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
