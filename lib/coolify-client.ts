/**
 * Coolify API Client
 *
 * Wrapper pour toutes les requêtes vers l'API Coolify.
 * Gère l'authentification, les erreurs, et la transformation des données.
 *
 * @example
 * ```typescript
 * import { coolifyFetch } from '@/lib/coolify-client';
 *
 * const apps = await coolifyFetch<CoolifyApplication[]>('/applications');
 * ```
 */

import type { CoolifyAPIResponse } from "./types/coolify";

const COOLIFY_API_BASE = process.env.COOLIFY_API_URL;
const COOLIFY_TOKEN = process.env.COOLIFY_API_TOKEN;

/**
 * Configuration par défaut pour les requêtes Coolify
 */
const defaultHeaders = {
  Authorization: `Bearer ${COOLIFY_TOKEN}`,
  Accept: "application/json",
  "Content-Type": "application/json",
};

/**
 * Options de requête étendues
 */
interface FetchOptions extends RequestInit {
  timeout?: number;
}

/**
 * Erreur personnalisée pour les erreurs API Coolify
 */
export class CoolifyError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "CoolifyError";
  }
}

/**
 * Effectue une requête vers l'API Coolify avec gestion d'erreurs
 *
 * @param endpoint - Endpoint de l'API (ex: '/applications', '/deployments')
 * @param options - Options de requête (method, body, headers, timeout)
 * @returns Promise avec les données typées
 * @throws {CoolifyError} Si la requête échoue
 *
 * @example
 * ```typescript
 * // GET request
 * const apps = await coolifyFetch<CoolifyApplication[]>('/applications');
 *
 * // POST request
 * const newApp = await coolifyFetch<CoolifyApplication>('/applications', {
 *   method: 'POST',
 *   body: JSON.stringify({ name: 'My App', ... })
 * });
 * ```
 */
export async function coolifyFetch<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  // Vérifier que les variables d'environnement sont définies
  if (!COOLIFY_API_BASE || !COOLIFY_TOKEN) {
    throw new CoolifyError(
      "Coolify API not configured. Please set COOLIFY_API_URL and COOLIFY_API_TOKEN in .env.local",
      500,
    );
  }

  // Construire l'URL complète
  const url = `${COOLIFY_API_BASE}${endpoint}`;

  // Timeout par défaut : 30 secondes
  const timeout = options.timeout || 30000;

  // Créer un AbortController pour le timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    // Effectuer la requête
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Parser la réponse JSON
    let data: CoolifyAPIResponse<T>;
    try {
      data = await response.json();
    } catch {
      // Si le parsing JSON échoue, retourner une erreur
      throw new CoolifyError(
        `Invalid JSON response from Coolify API: ${response.statusText}`,
        response.status,
      );
    }

    // Vérifier le status HTTP
    if (!response.ok) {
      throw new CoolifyError(
        data.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        data.errors,
      );
    }

    // Retourner les données (déballées si wrapped)
    return (data.data ?? data) as T;
  } catch (error) {
    clearTimeout(timeoutId);

    // Timeout
    if (error instanceof Error && error.name === "AbortError") {
      throw new CoolifyError(`Request timeout after ${timeout}ms`, 408);
    }

    // Network error
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new CoolifyError(
        "Network error: Unable to reach Coolify API. Check your COOLIFY_API_URL.",
        503,
      );
    }

    // Re-throw CoolifyError
    if (error instanceof CoolifyError) {
      throw error;
    }

    // Unknown error
    throw new CoolifyError(
      `Unexpected error: ${error instanceof Error ? error.message : "Unknown"}`,
      500,
    );
  }
}

/**
 * Wrapper pour les requêtes GET
 */
export async function coolifyGet<T>(
  endpoint: string,
  options?: FetchOptions,
): Promise<T> {
  return coolifyFetch<T>(endpoint, { ...options, method: "GET" });
}

/**
 * Wrapper pour les requêtes POST
 */
export async function coolifyPost<T>(
  endpoint: string,
  body?: Record<string, unknown>,
  options?: FetchOptions,
): Promise<T> {
  return coolifyFetch<T>(endpoint, {
    ...options,
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * Wrapper pour les requêtes PATCH
 */
export async function coolifyPatch<T>(
  endpoint: string,
  body?: Record<string, unknown>,
  options?: FetchOptions,
): Promise<T> {
  return coolifyFetch<T>(endpoint, {
    ...options,
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * Wrapper pour les requêtes DELETE
 */
export async function coolifyDelete<T>(
  endpoint: string,
  options?: FetchOptions,
): Promise<T> {
  return coolifyFetch<T>(endpoint, { ...options, method: "DELETE" });
}

/**
 * Helper pour formater les erreurs Coolify en message lisible
 */
export function formatCoolifyError(error: unknown): string {
  if (error instanceof CoolifyError) {
    if (error.errors && Object.keys(error.errors).length > 0) {
      // Formater les erreurs de validation
      const errorMessages = Object.entries(error.errors)
        .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
        .join("\n");
      return `${error.message}\n${errorMessages}`;
    }
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unknown error occurred";
}

/**
 * Test de connexion à l'API Coolify
 * Retourne true si la connexion est OK, false sinon
 */
export async function testCoolifyConnection(): Promise<boolean> {
  try {
    await coolifyGet("/version");
    return true;
  } catch (error) {
    console.error("Coolify connection test failed:", formatCoolifyError(error));
    return false;
  }
}
