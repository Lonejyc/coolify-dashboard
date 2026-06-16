/**
 * Footer Component (App Router)
 *
 * Shared footer for all App Router pages.
 * Simple copyright notice with current year.
 */

export default function Footer() {
  return (
    <footer className="flex flex-row p-3 justify-center text-slate-500 text-sm">
      &copy; {new Date().getFullYear()} Ma liste avec Next.js
    </footer>
  );
}
