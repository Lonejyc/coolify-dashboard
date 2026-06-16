import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signIn, signOut, useSession } from 'next-auth/react';
import { LayoutDashboard, FolderKanban, Layers, LogIn, LogOut } from 'lucide-react';

const Layout = ({ children, title = 'Liste' }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isAuth = status === 'authenticated';

  const navItem = (href, label, Icon) => {
    const active = router.pathname === href || router.pathname.startsWith(href + '/');
    return (
      <Link
        href={href}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all duration-150 ${
          active
            ? 'text-emerald-400 bg-emerald-500/10'
            : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
        }`}
      >
        <Icon className="w-3.5 h-3.5" />
        {label}
      </Link>
    );
  };

  return (
    <div className="bg-grain-background bg-cover min-h-screen text-zinc-300 flex flex-col">
      <Head>
        <title>{title} — Liste</title>
        <meta name="description" content="Liste — Coolify Control Plane" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-2.5 bg-black/20 backdrop-blur-md border-b border-zinc-800/50">
        <nav className="flex items-center gap-0.5">
          {navItem('/dashboard',    'Dashboard',    LayoutDashboard)}
          {isAuth && navItem('/liste',        'Projects',     FolderKanban)}
          {isAuth && navItem('/applications', 'Applications', Layers)}
        </nav>

        <div>
          {!isAuth ? (
            <button
              onClick={() => signIn()}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all duration-150"
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign In
            </button>
          ) : (
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-black/40 border border-zinc-800/50 text-sm text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-all duration-150"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          )}
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex flex-col items-center gap-6 px-6 py-10 flex-1">
        {children}
      </main>

      {/* ── Footer ── */}
      <footer className="flex justify-center py-3 text-[11px] font-mono text-zinc-800 border-t border-zinc-900">
        © {new Date().getFullYear()} Ma liste avec Next.js
      </footer>
    </div>
  );
};

export default Layout;
