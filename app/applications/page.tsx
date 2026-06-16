'use client';

import { useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Search, ServerOff, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ApplicationCard from '../components/coolify/ApplicationCard';
import { useCoolifyApplications } from '../hooks/useCoolifyApplications';

const STATUS_FILTERS = ['all', 'running', 'stopped', 'restarting', 'degraded', 'exited'] as const;
type StatusFilter = typeof STATUS_FILTERS[number];

function CardSkeleton() {
  return (
    <div className="bg-black/40 backdrop-blur-md border border-zinc-800/50 rounded-xl p-5 flex flex-col gap-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-4 bg-zinc-800 rounded w-2/5" />
        <div className="h-3 bg-zinc-800 rounded w-16" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-3 bg-zinc-800/60 rounded w-3/4" />
        <div className="h-3 bg-zinc-800/60 rounded w-1/2" />
        <div className="h-5 bg-zinc-800/40 rounded w-1/4 mt-1" />
      </div>
      <div className="h-7 bg-zinc-800/30 rounded-lg mt-auto" />
      <div className="h-px bg-zinc-800/50" />
      <div className="flex justify-between">
        <div className="h-3 bg-zinc-800/40 rounded w-1/3" />
        <div className="h-3 bg-zinc-800/40 rounded w-1/4" />
      </div>
    </div>
  );
}

export default function ApplicationsPage() {
  const { status } = useSession();
  const [search,       setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  if (status === 'unauthenticated') redirect('/api/auth/signin');

  const { data, error, isLoading, mutate, isValidating } = useCoolifyApplications();

  const filtered = useMemo(() => {
    if (!data?.applications) return [];
    return data.applications.filter(app => {
      const q = search.toLowerCase();
      const matchSearch = !q
        || app.name.toLowerCase().includes(q)
        || app.fqdn?.toLowerCase().includes(q)
        || app.git_repository?.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'all' || app.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [data?.applications, search, statusFilter]);

  return (
    <div className="min-h-screen bg-grain-background bg-cover text-zinc-300 flex flex-col">
      <Header />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#18181b',
            color: '#e4e4e7',
            border: '1px solid #3f3f46',
            fontSize: '13px',
          },
        }}
      />

      {/* ── Discrete connection banner ── */}
      {data && !isLoading && (
        <div className={`flex items-center gap-2 px-6 py-1.5 text-xs font-mono border-b transition-colors ${
          data.connected
            ? 'bg-emerald-500/[0.04] border-emerald-500/10 text-emerald-600'
            : 'bg-red-500/[0.04] border-red-500/10 text-red-600'
        }`}>
          {data.connected
            ? <Wifi className="w-3 h-3" />
            : <WifiOff className="w-3 h-3" />}
          <span>
            {data.connected
              ? `Coolify ${data.version} · ${data.count} application${data.count !== 1 ? 's' : ''} · synced ${new Date(data.timestamp).toLocaleTimeString('en-US')}`
              : `Disconnected — ${data.error}`}
          </span>
        </div>
      )}

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-10">

        {/* ── Page header ── */}
        <div className="flex flex-col gap-6 mb-10">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-3">
              <h1 className="text-2xl font-semibold text-zinc-50 tracking-tight">Applications</h1>
              {data && !isLoading && (
                <span className="px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-500 font-mono tabular-nums">
                  {filtered.length}{(statusFilter !== 'all' || search) ? `/${data.count}` : ''}
                </span>
              )}
            </div>
            <button
              onClick={() => mutate()}
              disabled={isValidating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 border border-zinc-800/50 text-zinc-500 text-xs hover:text-zinc-300 hover:border-zinc-700 transition-all duration-150 disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isValidating ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Search + status filter */}
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name, URL, repo…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-72 pl-9 pr-4 py-2 bg-black/40 backdrop-blur-md border border-zinc-800/50 rounded-lg text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition-all duration-200"
              />
            </div>

            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md border border-zinc-800/50 rounded-lg px-1.5 py-1.5">
              {STATUS_FILTERS.map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-all duration-150 ${
                    statusFilter === s
                      ? 'bg-zinc-800 text-zinc-100'
                      : 'text-zinc-600 hover:text-zinc-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Loading skeletons ── */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        )}

        {/* ── Error ── */}
        {error && !isLoading && (
          <div className="flex items-center gap-3 p-4 bg-red-500/5 border border-red-500/20 rounded-xl text-sm text-red-400 font-mono">
            <ServerOff className="w-4 h-4 shrink-0" />
            {error.message}
          </div>
        )}

        {/* ── Grid ── */}
        {!isLoading && !error && (
          filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-zinc-700 text-sm font-mono gap-2">
              <span className="text-2xl">∅</span>
              <span>
                {search || statusFilter !== 'all'
                  ? 'No applications match your filters.'
                  : 'No applications found in Coolify.'}
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(app => (
                <ApplicationCard key={app.uuid} app={app} onActionComplete={() => mutate()} />
              ))}
            </div>
          )
        )}
      </main>

      <Footer />
    </div>
  );
}
