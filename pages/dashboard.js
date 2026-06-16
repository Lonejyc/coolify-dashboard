import { useState, useEffect } from 'react';
import { getSession, useSession, signIn, signOut } from 'next-auth/react';
import Layout from '../components/Layout';
import Link from 'next/link';
import {
  Server, Cpu, ArrowUp, ArrowDown, Clock, Layers,
} from 'lucide-react';

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) return { props: { systemInfo: null } };
  try {
    const agentUrl = process.env.MONITOR_AGENT_URL || 'http://10.0.1.11:5000/api/stats';
    const response = await fetch(agentUrl);
    if (!response.ok) throw new Error('Agent error');
    const systemInfo = await response.json();
    return { props: { systemInfo } };
  } catch {
    return { props: { systemInfo: null } };
  }
}

/** Mini sparkline SVG — emerald area chart */
function Sparkline({ data = [], color = '#10b981' }) {
  if (data.length < 2) {
    return (
      <svg viewBox="0 0 100 30" className="w-full h-8" preserveAspectRatio="none">
        <line x1="0" y1="15" x2="100" y2="15" stroke={color} strokeWidth="1" opacity="0.15" strokeDasharray="3 3" />
      </svg>
    );
  }
  const W = 100, H = 30;
  const step = W / (data.length - 1);
  const pts  = data.map((v, i) => `${i * step},${H - (Math.min(Math.max(v, 0), 100) / 100) * H}`);
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p}`).join(' ');
  const area = `${line} L${(data.length - 1) * step},${H} L0,${H} Z`;
  const gid  = `g${color.replace('#', '')}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-8" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0"    />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function MetricSkeleton() {
  return (
    <div className="bg-black/40 backdrop-blur-md border border-zinc-800/50 rounded-xl p-5 animate-pulse flex flex-col gap-3">
      <div className="h-2.5 bg-zinc-800 rounded w-1/3" />
      <div className="h-8 bg-zinc-800 rounded w-2/5" />
      <div className="h-8 bg-zinc-800/40 rounded" />
      <div className="h-2 bg-zinc-800/30 rounded w-2/3 mt-auto" />
    </div>
  );
}

function formatUptime(seconds) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${d}d ${h}h ${m}m`;
}

export default function Dashboard({ systemInfo: initialData }) {
  const { data: session, status } = useSession();
  const [info,    setInfo]    = useState(initialData);
  const [history, setHistory] = useState({ cpu: [], mem: [] });
  const [tick,    setTick]    = useState(0);

  useEffect(() => {
    let mounted = true;
    const poll = async () => {
      try {
        const res = await fetch('/api/system-info');
        if (res.ok && mounted) {
          const data = await res.json();
          setInfo(data);
          setHistory(prev => ({
            cpu: [...prev.cpu, data.cpu?.usage_percent ?? 0].slice(-30),
            mem: [...prev.mem, data.memory?.percent     ?? 0].slice(-30),
          }));
          setTick(t => t + 1);
        }
      } catch {}
    };
    const id = setInterval(poll, 1000);
    return () => { mounted = false; clearInterval(id); };
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center font-mono text-xs text-zinc-700">
        Initializing…
      </div>
    );
  }

  if (!session) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center gap-4 py-20">
          <p className="text-zinc-600 font-mono text-xs uppercase tracking-widest">Access Restricted</p>
          <button
            onClick={() => signIn()}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400 hover:bg-emerald-500/20 transition-all duration-150"
          >
            Sign In
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* ── Welcome row ── */}
      <div className="w-full max-w-5xl flex items-center justify-between mb-8">
        <div>
          <p className="flex items-center gap-2 text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            System Online
          </p>
          <h1 className="text-2xl font-semibold text-zinc-50 tracking-tight">
            Welcome back,{' '}
            <span className="text-emerald-400">{session.user?.name ?? 'Admin'}</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/applications"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/40 border border-zinc-800/50 text-zinc-400 text-sm hover:border-zinc-700 hover:text-zinc-200 transition-all duration-150"
          >
            <Layers className="w-3.5 h-3.5" />
            Apps
          </Link>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/40 border border-zinc-800/50 text-zinc-400 text-sm hover:border-zinc-700 hover:text-zinc-200 transition-all duration-150"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* ── Section label ── */}
      <div className="w-full max-w-5xl flex items-center gap-2 mb-4">
        <Server className="w-3.5 h-3.5 text-emerald-500/50" />
        <span className="text-[10px] font-mono text-emerald-500/50 uppercase tracking-[0.2em]">
          Live Telemetry
        </span>
        {tick > 0 && (
          <span className="ml-auto text-[10px] font-mono text-zinc-800 tabular-nums">
            ↻ {tick}s
          </span>
        )}
      </div>

      {/* ── 4 primary metrics ── */}
      <div className="w-full max-w-5xl grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">

        {/* CPU */}
        {!info ? <MetricSkeleton /> : (
          <div className="bg-black/40 backdrop-blur-md border border-zinc-800/50 rounded-xl p-5 flex flex-col gap-3 hover:border-zinc-700/80 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">CPU</span>
              {info.cpu?.temperature?.current && (
                <span className="text-[10px] font-mono text-orange-400 tabular-nums">
                  {info.cpu.temperature.current}°C
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-mono font-light text-zinc-50 tabular-nums">
                {info.cpu?.usage_percent ?? '—'}
              </span>
              <span className="text-sm font-mono text-zinc-600">%</span>
            </div>
            <Sparkline data={history.cpu} color="#10b981" />
            <p className="text-[10px] font-mono text-zinc-700">
              {info.cpu?.cores_logical} cores · {info.cpu?.frequency_mhz} MHz
            </p>
          </div>
        )}

        {/* Memory */}
        {!info ? <MetricSkeleton /> : (
          <div className="bg-black/40 backdrop-blur-md border border-zinc-800/50 rounded-xl p-5 flex flex-col gap-3 hover:border-zinc-700/80 transition-all duration-300">
            <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Memory</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-mono font-light text-zinc-50 tabular-nums">
                {info.memory?.percent ?? '—'}
              </span>
              <span className="text-sm font-mono text-zinc-600">%</span>
            </div>
            <Sparkline data={history.mem} color="#3b82f6" />
            <div className="w-full bg-zinc-900 rounded-full h-px overflow-hidden">
              <div
                className="bg-blue-500 h-full transition-all duration-1000"
                style={{ width: `${info.memory?.percent ?? 0}%` }}
              />
            </div>
            <p className="text-[10px] font-mono text-zinc-700">
              {info.memory?.used} / {info.memory?.total}
            </p>
          </div>
        )}

        {/* Disk */}
        {!info ? <MetricSkeleton /> : (
          <div className="bg-black/40 backdrop-blur-md border border-zinc-800/50 rounded-xl p-5 flex flex-col gap-3 hover:border-zinc-700/80 transition-all duration-300">
            <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Disk</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-mono font-light text-zinc-50 tabular-nums">
                {info.disk?.percent ?? '—'}
              </span>
              <span className="text-sm font-mono text-zinc-600">%</span>
            </div>
            <div className="flex-1" />
            <div className="w-full bg-zinc-900 rounded-full h-px overflow-hidden">
              <div
                className="bg-violet-500 h-full"
                style={{ width: `${info.disk?.percent ?? 0}%` }}
              />
            </div>
            <p className="text-[10px] font-mono text-zinc-700">{info.disk?.free} free</p>
          </div>
        )}

        {/* Network */}
        {!info ? <MetricSkeleton /> : (
          <div className="bg-black/40 backdrop-blur-md border border-zinc-800/50 rounded-xl p-5 flex flex-col gap-3 hover:border-zinc-700/80 transition-all duration-300">
            <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Network</span>
            <div className="flex flex-col gap-2.5 flex-1 justify-center">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <ArrowUp className="w-3 h-3 text-emerald-500" />
                  <span className="text-[10px] font-mono text-zinc-600">UP</span>
                </div>
                <span className="text-xs font-mono text-zinc-200 tabular-nums">
                  {info.network?.sent ?? '—'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <ArrowDown className="w-3 h-3 text-blue-400" />
                  <span className="text-[10px] font-mono text-zinc-600">DOWN</span>
                </div>
                <span className="text-xs font-mono text-zinc-200 tabular-nums">
                  {info.network?.recv ?? '—'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Secondary row: Uptime + OS ── */}
      <div className="w-full max-w-5xl grid grid-cols-2 gap-4">
        {!info ? (
          <>
            <MetricSkeleton />
            <MetricSkeleton />
          </>
        ) : (
          <>
            <div className="bg-black/40 backdrop-blur-md border border-zinc-800/50 rounded-xl p-5 flex items-center gap-4">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-1">Uptime</p>
                <p className="text-lg font-mono text-zinc-50 tabular-nums">
                  {info.uptime?.seconds != null ? formatUptime(info.uptime.seconds) : '—'}
                </p>
              </div>
            </div>

            <div className="bg-black/40 backdrop-blur-md border border-zinc-800/50 rounded-xl p-5 flex items-center gap-4">
              <div className="p-2.5 rounded-lg bg-zinc-800 text-zinc-400 shrink-0">
                <Server className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-1">Platform</p>
                <p className="text-sm font-mono text-zinc-200">{info.os?.platform ?? '—'}</p>
                <p className="text-[10px] font-mono text-zinc-700">{info.os?.architecture}</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Status bar ── */}
      <div className="w-full max-w-5xl mt-6 flex justify-between items-center border-t border-white/5 pt-3 text-[10px] font-mono text-zinc-800 uppercase tracking-widest">
        <span>SysCheck: OK</span>
        <span>Protocol: SECURE_V2</span>
        <span>Latency: 12ms</span>
      </div>
    </Layout>
  );
}
