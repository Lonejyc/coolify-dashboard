import { getSession } from "next-auth/react";
import Link from "next/link";
import Layout from "../../components/Layout";
import { ExternalLink, GitFork, Plus } from "lucide-react";
import PROJECTS from "../../data/projects.json";

const STATUS_CONFIG = {
  ONLINE: {
    label: "Online",
    dot: "bg-emerald-400",
    ping: "bg-emerald-400",
    text: "text-emerald-400",
    animate: true,
  },
  DEV: {
    label: "Dev",
    dot: "bg-yellow-400",
    ping: "bg-yellow-400",
    text: "text-yellow-400",
    animate: true,
  },
  OFFLINE: {
    label: "Offline",
    dot: "bg-red-500",
    ping: "",
    text: "text-red-400",
    animate: false,
  },
};

function StatusDot({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.OFFLINE;
  return (
    <div className="flex items-center gap-1.5">
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
  );
}

export default function Liste({ session }) {
  if (!session) {
    return (
      <div className="min-h-screen bg-grain-background bg-cover flex items-center justify-center text-zinc-600 font-mono text-sm">
        Access denied
      </div>
    );
  }

  return (
    <Layout title="Projects">
      <div className="w-full max-w-6xl">
        {/* Page header */}
        <div className="flex items-baseline gap-3 mb-10">
          <h1 className="text-2xl font-semibold text-zinc-50 tracking-tight">
            Projects
          </h1>
          <span className="px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-500 font-mono">
            {PROJECTS.length}
          </span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((project) => (
            <div
              key={project.id}
              className="group relative flex flex-col gap-4 bg-black/40 backdrop-blur-md border border-zinc-800/50 rounded-xl p-5 hover:border-zinc-700/80 transition-all duration-300 overflow-hidden"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500/0 to-transparent group-hover:from-emerald-500/[0.04] transition-all duration-500 pointer-events-none" />

              {/* Header: name + status */}
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-sm font-semibold text-zinc-100 group-hover:text-emerald-400 transition-colors duration-200 truncate">
                  {project.title}
                </h2>
                <StatusDot status={project.status} />
              </div>

              {/* Description */}
              <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2 flex-1">
                {project.description}
              </p>

              {/* Tech tags */}
              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono bg-zinc-900/60 text-zinc-400 border border-zinc-800"
                  >
                    <span className="w-1 h-1 rounded-full bg-emerald-500/60 shrink-0" />
                    {t}
                  </span>
                ))}
              </div>

              {/* Links (revealed on hover) */}
              <div className="flex items-center gap-2 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
                {project.link && (
                  <a
                    href={project.link}
                    target={
                      project.link.startsWith("http") ? "_blank" : "_self"
                    }
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all duration-150"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Launch
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-zinc-800/60 border border-zinc-700/50 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition-all duration-150"
                    title="GitHub"
                  >
                    <GitFork className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Footer */}
              {project.updated_at && (
                <div className="text-[10px] font-mono text-zinc-700 border-t border-zinc-800/50 pt-3 mt-auto">
                  Updated {project.updated_at}
                </div>
              )}
            </div>
          ))}

          {/* Add new placeholder */}
          <div className="group flex flex-col items-center justify-center gap-3 border border-dashed border-zinc-800 rounded-xl p-5 min-h-[200px] text-zinc-700 hover:border-zinc-700 hover:text-zinc-500 transition-all duration-200 cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-zinc-700 transition-all duration-200">
              <Plus className="w-4 h-4" />
            </div>
            <p className="text-[10px] font-mono uppercase tracking-widest">
              Deploy New
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return { redirect: { destination: "/dashboard", permanent: false } };
  }
  return { props: { session } };
}
