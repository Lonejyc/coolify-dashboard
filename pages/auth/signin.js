import { getCsrfToken } from "next-auth/react";
import Head from "next/head";
import { User, Lock, LogIn } from "lucide-react";

export default function SignIn({ csrfToken, error }) {
  return (
    <>
      <Head>
        <title>Sign In — Liste</title>
      </Head>
      <div className="min-h-screen bg-grain-background bg-cover flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          {/* Logo / brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
              <LogIn className="w-5 h-5 text-emerald-400" />
            </div>
            <h1 className="text-xl font-semibold text-zinc-50 tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-zinc-600 mt-1">
              Sign in to your control plane
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-4 px-4 py-2.5 rounded-lg bg-red-500/5 border border-red-500/20 text-sm text-red-400 font-mono text-center">
              {error === "CredentialsSignin"
                ? "Invalid username or password."
                : `Error: ${error}`}
            </div>
          )}

          {/* Form card */}
          <div className="bg-black/40 backdrop-blur-md border border-zinc-800/50 rounded-xl p-6">
            <form
              method="post"
              action="/api/auth/callback/credentials"
              className="flex flex-col gap-5"
            >
              <input
                name="csrfToken"
                type="hidden"
                defaultValue={csrfToken ?? ""}
              />

              {/* Username */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="username"
                  className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest"
                >
                  Username
                </label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 group-focus-within:text-emerald-500 transition-colors pointer-events-none" />
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    placeholder="admin"
                    className="w-full pl-9 pr-4 py-2.5 bg-zinc-950/60 border border-zinc-800 rounded-lg text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="password"
                  className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest"
                >
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 group-focus-within:text-emerald-500 transition-colors pointer-events-none" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full pl-9 pr-4 py-2.5 bg-zinc-950/60 border border-zinc-800 rounded-lg text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/25 text-sm font-medium text-emerald-400 hover:bg-emerald-500/25 hover:border-emerald-500/40 active:scale-[0.98] transition-all duration-150"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-[11px] font-mono text-zinc-800 uppercase tracking-widest">
            Authorized personnel only
          </p>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { error } = context.query;
  const csrfToken = await getCsrfToken(context);
  return {
    props: {
      csrfToken: csrfToken ?? null,
      error: error ?? null,
    },
  };
}
