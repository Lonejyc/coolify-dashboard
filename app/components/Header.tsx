'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { LayoutDashboard, FolderKanban, Layers, LogIn, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { data: session, status } = useSession();
  const pathname  = usePathname();
  const isAuth    = status === 'authenticated';

  const navItem = (href: string, label: string, Icon: React.ElementType) => {
    const active = pathname === href;
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
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-2.5 bg-black/20 backdrop-blur-md border-b border-zinc-800/50">
      <nav className="flex items-center gap-0.5">
        {navItem('/dashboard',     'Dashboard',    LayoutDashboard)}
        {isAuth && navItem('/liste',         'Projects',     FolderKanban)}
        {isAuth && navItem('/applications',  'Applications', Layers)}
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
  );
}
