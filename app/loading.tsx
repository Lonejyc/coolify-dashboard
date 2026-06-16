/**
 * App Router - Loading State
 *
 * Affiché pendant le chargement des pages.
 */

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-slate-700 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
      <p className="text-slate-400 text-sm">Chargement...</p>
    </div>
  );
}
