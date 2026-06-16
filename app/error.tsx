/**
 * App Router - Error Boundary
 *
 * Gère les erreurs non capturées dans l'application.
 */

"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4">
      <div className="text-center max-w-md">
        <h2 className="text-3xl font-bold text-red-400 mb-4">
          Une erreur est survenue
        </h2>
        <p className="text-slate-400 mb-6">
          {error.message ||
            "Quelque chose s'est mal passé. Veuillez réessayer."}
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}
