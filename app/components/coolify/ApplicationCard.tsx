"use client";

import { useState } from "react";
import {
  ExternalLink,
  GitBranch,
  Play,
  Square,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { CoolifyApplication } from "@/lib/types/coolify";
import toast from "react-hot-toast";

const STATUS_CONFIG = {
  running: {
    label: "Running",
    dot: "bg-emerald-400",
    ping: "bg-emerald-400",
    text: "text-emerald-400",
    animate: true,
  },
  stopped: {
    label: "Stopped",
    dot: "bg-red-500",
    ping: "",
    text: "text-red-400",
    animate: false,
  },
  exited: {
    label: "Exited",
    dot: "bg-red-500",
    ping: "",
    text: "text-red-400",
    animate: false,
  },
  restarting: {
    label: "Restarting",
    dot: "bg-blue-400",
    ping: "bg-blue-400",
    text: "text-blue-400",
    animate: true,
  },
  degraded: {
    label: "Degraded",
    dot: "bg-yellow-400",
    ping: "bg-yellow-400",
    text: "text-yellow-400",
    animate: true,
  },
  unknown: {
    label: "Unknown",
    dot: "bg-zinc-600",
    ping: "",
    text: "text-zinc-500",
    animate: false,
  },
} as const;

interface Props {
  app: CoolifyApplication;
  onActionComplete?: () => void;
}

export default function ApplicationCard({ app, onActionComplete }: Props) {
  const [isDeploying, setIsDeploying] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);

  const cfg =
    STATUS_CONFIG[app.status as keyof typeof STATUS_CONFIG] ??
    STATUS_CONFIG.unknown;
  const isBusy = isDeploying || isStopping || isRestarting;
  const isStopped = app.status === "stopped" || app.status === "exited";

  const callAction = async (type: "deploy" | "stop" | "restart") => {
    const setMap = {
      deploy: setIsDeploying,
      stop: setIsStopping,
      restart: setIsRestarting,
    };
    const msgMap = {
      deploy: `Deploying ${app.name}…`,
      stop: `${app.name} stopped`,
      restart: `${app.name} restarting…`,
    };
    setMap[type](true);
    try {
      const res = await fetch(`/api/coolify/applications/${app.uuid}/${type}`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `${type} failed`);
      toast.success(msgMap[type]);
      setTimeout(() => onActionComplete?.(), 1500);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    } finally {
      setMap[type](false);
    }
  };

  const fqdn = app.fqdn?.replace(/^https?:\/\//, "");
  const repo = app.git_repository?.split("/").slice(-2).join("/");

  return (
    <div className="group relative flex flex-col gap-4 bg-black/40 backdrop-blur-md border border-zinc-800/50 rounded-xl p-5 hover:border-zinc-700/80 transition-all duration-300 overflow-hidden">
      {/* Hover glow */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500/0 to-transparent group-hover:from-emerald-500/[0.04] transition-all duration-500 pointer-events-none" />

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-zinc-100 truncate group-hover:text-emerald-400 transition-colors duration-200">
            {app.name}
          </h3>
          {app.description && (
            <p className="text-xs text-zinc-600 mt-0.5 line-clamp-1">
              {app.description}
            </p>
          )}
        </div>

        {/* Status dot ping */}
        <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
          <div className="relative flex items-center justify-center w-3 h-3">
            {cfg.animate && (
              <span
                className={`absolute inline-flex h-full w-full rounded-full ${cfg.ping} opacity-40 animate-ping`}
              />
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${cfg.dot}`}
            />
          </div>
          <span className={`text-xs font-medium ${cfg.text}`}>{cfg.label}</span>
        </div>
      </div>

      {/* ── Info ── */}
      <div className="flex flex-col gap-2">
        {fqdn && (
          <a
            href={app.fqdn}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-zinc-500 hover:text-emerald-400 transition-colors duration-150 group/link"
          >
            <ExternalLink className="w-3.5 h-3.5 shrink-0 group-hover/link:text-emerald-500" />
            <span className="text-xs font-mono truncate">{fqdn}</span>
          </a>
        )}
        {repo && (
          <div className="flex items-center gap-2 text-zinc-600">
            <GitBranch className="w-3.5 h-3.5 shrink-0" />
            <span className="text-xs font-mono truncate">
              {repo}
              {app.git_branch && (
                <span className="text-zinc-700"> @ {app.git_branch}</span>
              )}
            </span>
          </div>
        )}
        {app.build_pack && (
          <div>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono bg-zinc-900/60 text-zinc-400 border border-zinc-800">
              <span className="w-1 h-1 rounded-full bg-emerald-500/80 shrink-0" />
              {app.build_pack}
            </span>
          </div>
        )}
      </div>

      {/* ── Actions (revealed on hover) ── */}
      <div className="flex items-center gap-2 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
        <button
          onClick={() => callAction("deploy")}
          disabled={isBusy}
          title="Deploy"
          className="flex flex-1 items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 hover:border-emerald-500/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
        >
          {isDeploying ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Play className="w-3.5 h-3.5" />
          )}
          Deploy
        </button>
        <button
          onClick={() => callAction("restart")}
          disabled={isBusy || isStopped}
          title="Restart"
          className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
        >
          {isRestarting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <RefreshCw className="w-3.5 h-3.5" />
          )}
        </button>
        <button
          onClick={() => callAction("stop")}
          disabled={isBusy || isStopped}
          title="Stop"
          className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
        >
          {isStopping ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Square className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* ── Footer ── */}
      {app.updated_at && (
        <div className="flex items-center justify-between text-xs text-zinc-700 font-mono border-t border-zinc-800/50 pt-3 mt-auto">
          <span>
            Updated {new Date(app.updated_at).toLocaleDateString("en-US")}
          </span>
          <span>#{app.uuid.slice(0, 8)}</span>
        </div>
      )}
    </div>
  );
}
