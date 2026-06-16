/**
 * Providers Component
 *
 * Client Component wrapper for React Context providers.
 * This allows Server Components (like layout.tsx) to use context providers
 * by wrapping them in a Client Component boundary.
 */

"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
