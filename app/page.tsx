/**
 * App Router - Home Page
 *
 * Page d'accueil - redirige vers le dashboard système.
 * Temporaire pendant la migration vers App Router.
 */

import { redirect } from "next/navigation";

export default function HomePage() {
  // Rediriger vers le dashboard système (Pages Router)
  redirect("/dashboard");
}
