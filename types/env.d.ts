/**
 * Type definitions for environment variables
 *
 * This ensures TypeScript knows about all environment variables
 * and provides autocomplete + type safety when accessing process.env
 */

declare namespace NodeJS {
  interface ProcessEnv {
    // NextAuth
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;
    JWT_SECRET: string;

    // Admin Credentials
    ADMIN_USERNAME: string;
    ADMIN_PASSWORD: string;

    // Python Monitoring Agent (optional)
    MONITOR_AGENT_URL?: string;

    // Coolify API
    COOLIFY_API_URL: string;
    COOLIFY_API_TOKEN: string;

    // Node environment
    NODE_ENV: "development" | "production" | "test";
  }
}
