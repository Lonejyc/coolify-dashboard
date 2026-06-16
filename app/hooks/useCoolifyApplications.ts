/**
 * Custom Hook: useCoolifyApplications
 *
 * Fetches Coolify applications with version info using SWR.
 * Combines /version and /applications endpoints for dashboard display.
 */

"use client";

import useSWR from "swr";
import { CoolifyApplication } from "@/lib/types/coolify";

interface CoolifyTestResponse {
  connected: boolean;
  version?: string;
  count: number;
  applications: CoolifyApplication[];
  timestamp: string;
  error?: string;
  details?: string;
}

const fetcher = async (): Promise<CoolifyTestResponse> => {
  try {
    // Fetch version and applications in parallel
    const [versionRes, appsRes] = await Promise.all([
      fetch("/api/coolify/version"),
      fetch("/api/coolify/applications"),
    ]);

    // Check for errors
    if (!versionRes.ok && !appsRes.ok) {
      throw new Error("Failed to connect to Coolify API");
    }

    // Parse responses
    const versionData = versionRes.ok ? await versionRes.json() : null;
    const appsData = appsRes.ok ? await appsRes.json() : { data: [] };

    // Extract applications array
    const applications = Array.isArray(appsData)
      ? appsData
      : appsData.data || [];

    // Parse status format (Coolify returns "state:health" like "running:unhealthy")
    const parsedApplications = applications.map((app: CoolifyApplication & { status?: string }) => ({
      ...app,
      status: app.status?.split(":")[0] || "unknown",
    }));

    return {
      connected: true,
      version: versionData?.version || "unknown",
      count: parsedApplications.length,
      applications: parsedApplications,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : "Failed to fetch applications",
      count: 0,
      applications: [],
      timestamp: new Date().toISOString(),
    };
  }
};

export function useCoolifyApplications() {
  return useSWR<CoolifyTestResponse>("coolify-applications", fetcher, {
    refreshInterval: 5000, // Refresh every 5 seconds
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });
}
