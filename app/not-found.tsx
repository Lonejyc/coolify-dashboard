/**
 * App Router - 404 Not Found
 *
 * Page affichée pour les routes inexistantes.
 */

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-slate-100 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-slate-300 mb-4">
          Page introuvable
        </h2>
        <p className="text-slate-400 mb-8">
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
