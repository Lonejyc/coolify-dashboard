/**
 * App Router - Root Layout
 *
 * Layout global pour toutes les pages de l'application App Router.
 * Inclut le SessionProvider NextAuth et les styles globaux.
 *
 * Note: This is a Server Component. Context providers are wrapped
 * in a separate Client Component (Providers.tsx) to avoid
 * "React Context is unavailable in Server Components" errors.
 */

import type { Metadata } from "next";
import { Providers } from "./components/Providers";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Liste - Coolify Control Plane",
  description: "Dashboard centralisé pour gérer vos applications Coolify",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-grain-background bg-cover min-h-screen text-slate-300">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
