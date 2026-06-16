/**
 * App Router API Route: Dynamic Coolify API Proxy
 *
 * Route dynamique qui proxie toutes les requêtes vers l'API Coolify.
 * Gère GET, POST, PATCH, DELETE avec authentification NextAuth.
 *
 * Exemples d'utilisation :
 * GET  /api/coolify/applications       → GET  https://coolify.../api/v1/applications
 * POST /api/coolify/applications       → POST https://coolify.../api/v1/applications
 * GET  /api/coolify/applications/uuid  → GET  https://coolify.../api/v1/applications/uuid
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const COOLIFY_API_URL = process.env.COOLIFY_API_URL;
const COOLIFY_TOKEN = process.env.COOLIFY_API_TOKEN;

/**
 * Helper pour construire l'URL complète de l'API Coolify
 */
function buildCoolifyUrl(slug: string[]): string {
  const endpoint = slug.join("/");
  return `${COOLIFY_API_URL}/${endpoint}`;
}

/**
 * Helper pour faire des requêtes à l'API Coolify
 */
async function coolifyFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  if (!COOLIFY_API_URL || !COOLIFY_TOKEN) {
    throw new Error("Coolify API not configured. Check your .env.local");
  }

  console.log(`🔌 Coolify API: ${options.method || "GET"} ${url}`);

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${COOLIFY_TOKEN}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options.headers,
    },
    // Timeout après 30 secondes
    signal: AbortSignal.timeout(30000),
  });

  return response;
}

/**
 * Handler pour toutes les méthodes HTTP
 */
async function handleRequest(
  req: NextRequest,
  params: { slug: string[] },
): Promise<NextResponse> {
  // Vérifier l'authentification
  // @ts-expect-error - authOptions type issue with Next.js 15
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized. Please sign in first." },
      { status: 401 },
    );
  }

  try {
    // Construire l'URL Coolify
    const url = buildCoolifyUrl(params.slug);

    // Préparer les options de la requête
    const options: RequestInit = {
      method: req.method,
    };

    // Ajouter le body pour POST/PATCH
    if (req.method === "POST" || req.method === "PATCH") {
      try {
        const body = await req.json();
        options.body = JSON.stringify(body);
      } catch {
        // Pas de body ou body invalide, continuer sans
      }
    }

    // Effectuer la requête vers Coolify
    const response = await coolifyFetch(url, options);

    // Parser la réponse
    let data: unknown;
    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      try {
        data = await response.json();
      } catch {
        data = { error: "Invalid JSON response from Coolify API" };
      }
    } else {
      data = await response.text();
    }

    // Retourner la réponse avec le même status code
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("[Coolify API Error]:", error);

    // Déterminer le type d'erreur
    let statusCode = 500;
    let errorMessage = "Internal server error";

    if (error instanceof Error) {
      if (error.name === "AbortError" || error.message.includes("timeout")) {
        statusCode = 408;
        errorMessage = "Request timeout";
      } else if (error.message.includes("not configured")) {
        statusCode = 500;
        errorMessage = error.message;
      } else if (error.message.includes("fetch")) {
        statusCode = 503;
        errorMessage = "Unable to reach Coolify API";
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details:
          process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: statusCode },
    );
  }
}

// Export handlers pour toutes les méthodes HTTP
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string[] }> },
) {
  const params = await context.params;
  return handleRequest(req, params);
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ slug: string[] }> },
) {
  const params = await context.params;
  return handleRequest(req, params);
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ slug: string[] }> },
) {
  const params = await context.params;
  return handleRequest(req, params);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ slug: string[] }> },
) {
  const params = await context.params;
  return handleRequest(req, params);
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ slug: string[] }> },
) {
  const params = await context.params;
  return handleRequest(req, params);
}
