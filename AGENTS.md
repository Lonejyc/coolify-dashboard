# Agent Coding Guidelines

This file provides guidelines for AI agents working on this codebase.

---

## 1. Build, Lint, and Test Commands

```bash
# Development
npm run dev              # Start development server on http://localhost:3000
npm run build            # Production build
npm run start            # Start production server
npm run lint             # Run ESLint

# TypeScript
npx tsc --noEmit         # Check TypeScript without emitting files
```

**Note**: No test framework installed yet. If added, use `npm test -- --testPathPattern="name"`.

---

## 2. Code Style Guidelines

### File Organization

| Directory         | Purpose                                |
| ----------------- | -------------------------------------- |
| `app/`            | App Router (TypeScript) - new features |
| `pages/`          | Pages Router (JavaScript) - legacy     |
| `app/api/`        | API routes (App Router)                |
| `app/components/` | Shared components                      |
| `app/hooks/`      | Custom React hooks                     |
| `lib/`            | Utilities and types                    |

### Imports - Use Path Aliases

```typescript
// Good
import { CoolifyApplication } from "@/lib/types/coolify";
import Header from "@/app/components/Header";

// Avoid
import { CoolifyApplication } from "../../../lib/types/coolify";
```

**Available aliases**: `@/`, `@components/`, `@lib/`, `@types/`, `@api/`

### Naming Conventions

| Type       | Convention        | Example                         |
| ---------- | ----------------- | ------------------------------- |
| Components | PascalCase        | `ApplicationCard.tsx`           |
| Hooks      | camelCase + `use` | `useCoolifyApplications.ts`     |
| API Routes | kebab-case        | `app/api/coolify/test/route.ts` |
| Types      | PascalCase        | `CoolifyApplication`            |
| Variables  | camelCase         | `isLoading`                     |
| Constants  | UPPER_SNAKE       | `API_TIMEOUT`                   |

### Component Structure

**Client Component** (with interactivity):

```typescript
'use client';
import { useSession } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();
  return <header>{/* JSX */}</header>;
}
```

**Server Component** (default):

```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'App' };

export default function Page() {
  return <div>{/* JSX */}</div>;
}
```

### TypeScript Guidelines

- Use `interface` for object shapes, `type` for unions
- Always type function parameters and return values
- Use explicit types, avoid `any`

```typescript
interface StatusBadgeProps {
  status?: "running" | "stopped" | "exited";
  size?: "sm" | "md" | "lg";
}

export default function StatusBadge({
  status = "unknown",
  size = "md",
}: StatusBadgeProps) {
  // ...
}
```

### Error Handling

**API Routes**:

```typescript
export async function GET(req: NextRequest) {
  try {
    if (!response.ok) {
      return NextResponse.json(
        { message: "Error" },
        { status: response.status },
      );
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("[API Error]:", error);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
```

**Client Components**:

```typescript
const handleAction = async () => {
  try {
    const res = await fetch("/api/endpoint");
    if (!res.ok) throw new Error("Failed");
    toast.success("Success");
  } catch (error: any) {
    toast.error(error.message);
  }
};
```

### React Best Practices

- Use `useState<boolean>` not `useState(false)`
- Clean up effects: `return () => { isMounted = false; }`
- Early return for loading/error states

---

## 3. Tailwind CSS

### Class Order

```
layout → spacing → sizing → visual → states → responsive
```

### Colors (Project Palette)

- Backgrounds: `bg-slate-800`, `bg-slate-900`
- Accents: `text-emerald-400`, `border-emerald-500/30`
- Text: `text-slate-300`, `text-slate-400`

---

## 4. Project Conventions

### Coolify API

- Use proxy: `/api/coolify/[...slug]`
- Never expose token to client
- Parse status: `'running:unhealthy'.split(':')[0]` → `'running'`

### NextAuth

- Use `SessionProvider` wrapper (Client Component) in layout
- In Server Components: `getServerSession(authOptions as any)`

### Toast Notifications

```typescript
import toast from "react-hot-toast";
toast.success("Operation successful");
toast.error("Operation failed");
```

---

## 5. Quick Reference

| Task          | Solution                            |
| ------------- | ----------------------------------- |
| Add new page  | Create `app/[feature]/page.tsx`     |
| Add API route | Create `app/api/[...slug]/route.ts` |
| Add component | Create `app/components/[name].tsx`  |
| Add hook      | Create `app/hooks/use[name].ts`     |
| Add types     | Add to `lib/types/coolify.ts`       |

---

## 6. Common Issues

**"React Context unavailable in Server Components"** → Wrap providers in Client Component (`app/components/Providers.tsx`)

**TypeScript error with NextAuth** → Cast: `getServerSession(authOptions as any)`

---

Last updated: 2026-03-04
