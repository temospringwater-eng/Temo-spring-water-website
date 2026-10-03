const json = (data, status = 200, extraHeaders = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      "referrer-policy": "no-referrer",
      "x-frame-options": "DENY",
      ...extraHeaders
    }
  });

function requestId() {
  return crypto.randomUUID();
}

function corsHeaders(request, env) {
  const origin = request.headers.get("origin");
  const allowed = env.ALLOWED_ORIGIN || "https://www.temospringwater.com";

  if (!origin) return {};
  if (origin !== allowed) return {};

  return {
    "access-control-allow-origin": allowed,
    "access-control-allow-methods": "GET,POST,PATCH,OPTIONS",
    "access-control-allow-headers": "content-type,x-requested-with",
    "access-control-max-age": "600",
    "vary": "origin"
  };
}

function routeNotReady(path, id, headers) {
  return json({
    ok: false,
    code: "BACKEND_INTEGRATION_PENDING",
    message: "This Water Club API route is scaffolded but not connected to the trusted ERP/auth backend yet.",
    path,
    request_id: id
  }, 503, headers);
}

export default {
  async fetch(request, env) {
    const id = requestId();
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";
    const headers = { ...corsHeaders(request, env), "x-request-id": id };

    if (request.method === "OPTIONS") {
      const origin = request.headers.get("origin");
      const allowed = env.ALLOWED_ORIGIN || "https://www.temospringwater.com";
      if (origin && origin !== allowed) {
        return json({ ok: false, code: "ORIGIN_NOT_ALLOWED", request_id: id }, 403, headers);
      }
      return new Response(null, { status: 204, headers });
    }

    if (path === "/api/health" && request.method === "GET") {
      return json({
        ok: true,
        service: "temo-water-club-api",
        environment: env.APP_ENV || "unknown",
        request_id: id
      }, 200, headers);
    }

    if (path === "/api/version" && request.method === "GET") {
      return json({
        ok: true,
        api_version: env.API_VERSION || "v1",
        service: "temo-water-club-api",
        request_id: id
      }, 200, headers);
    }

    const scaffoldedRoutes = new Set([
      "POST /api/water-club/auth/start",
      "POST /api/water-club/auth/verify",
      "POST /api/water-club/auth/logout",
      "GET /api/water-club/me",
      "GET /api/water-club/profile",
      "PATCH /api/water-club/profile",
      "POST /api/water-club/membership",
      "GET /api/water-club/rewards",
      "GET /api/water-club/deliveries",
      "GET /api/water-club/referrals",
      "GET /api/water-club/bottles"
    ]);

    const key = `${request.method} ${path}`;
    if (scaffoldedRoutes.has(key)) {
      return routeNotReady(path, id, headers);
    }

    return json({
      ok: false,
      code: "NOT_FOUND",
      message: "API route not found.",
      request_id: id
    }, 404, headers);
  }
};
