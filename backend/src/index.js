const SESSION_COOKIE = "temo_wc_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

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
  if (!origin || origin !== allowed) return {};
  return {
    "access-control-allow-origin": allowed,
    "access-control-allow-methods": "GET,POST,PATCH,OPTIONS",
    "access-control-allow-headers": "content-type,x-requested-with",
    "access-control-allow-credentials": "true",
    "access-control-max-age": "600",
    "vary": "origin"
  };
}

function cookies(request) {
  return Object.fromEntries(
    String(request.headers.get("cookie") || "")
      .split(";")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => {
        const index = item.indexOf("=");
        return index < 0 ? [item, ""] : [item.slice(0, index), decodeURIComponent(item.slice(index + 1))];
      })
  );
}

function sessionToken(request) {
  const token = cookies(request)[SESSION_COOKIE] || "";
  return /^[a-f0-9]{64}$/i.test(token) ? token : "";
}

function sessionCookie(token, secure = true) {
  return [
    `${SESSION_COOKIE}=${encodeURIComponent(token)}`,
    "Path=/api/water-club",
    "HttpOnly",
    secure ? "Secure" : "",
    "SameSite=Lax",
    `Max-Age=${SESSION_MAX_AGE}`
  ].filter(Boolean).join("; ");
}

function clearSessionCookie(secure = true) {
  return [
    `${SESSION_COOKIE}=`,
    "Path=/api/water-club",
    "HttpOnly",
    secure ? "Secure" : "",
    "SameSite=Lax",
    "Max-Age=0"
  ].filter(Boolean).join("; ");
}

function erpBase(env) {
  const base = String(env.ERP_API_BASE_URL || "").trim().replace(/\/+$/, "");
  if (!base) return "";
  if ((env.APP_ENV || "").toLowerCase() === "production" && !base.startsWith("https://")) return "";
  return base;
}

async function erpRequest(env, path, options = {}) {
  const base = erpBase(env);
  if (!base) return { configured: false };

  const headers = new Headers(options.headers || {});
  headers.set("accept", "application/json");
  if (options.body !== undefined) headers.set("content-type", "application/json");
  if (options.token) headers.set("authorization", `Bearer ${options.token}`);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(`${base}${path}`, {
      method: options.method || "GET",
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      signal: controller.signal
    });
    const text = await response.text();
    let body = {};
    try { body = text ? JSON.parse(text) : {}; } catch (_) { body = {}; }
    return { configured: true, ok: response.ok, status: response.status, body };
  } catch (_) {
    return { configured: true, ok: false, status: 502, body: { message: "ERP backend is temporarily unavailable." } };
  } finally {
    clearTimeout(timer);
  }
}

function integrationPending(id, headers) {
  return json({
    ok: false,
    code: "ERP_CONNECTION_NOT_CONFIGURED",
    message: "Water Club API is ready but the trusted ERP backend URL has not been configured yet.",
    request_id: id
  }, 503, headers);
}

function authRequired(id, headers) {
  return json({ ok: false, code: "AUTH_REQUIRED", message: "Member login is required.", request_id: id }, 401, headers);
}

async function readJson(request, maxBytes = 8192) {
  const length = Number(request.headers.get("content-length") || 0);
  if (length > maxBytes) throw new Error("PAYLOAD_TOO_LARGE");
  return request.json();
}

async function authenticatedProxy(request, env, erpPath, id, headers, method = "GET") {
  const token = sessionToken(request);
  if (!token) return authRequired(id, headers);

  let body;
  if (method === "PATCH" || method === "POST") {
    try { body = await readJson(request); }
    catch (_) { return json({ ok: false, code: "INVALID_JSON", message: "Invalid request body.", request_id: id }, 400, headers); }
  }

  const result = await erpRequest(env, erpPath, { method, token, body });
  if (!result.configured) return integrationPending(id, headers);
  if (result.status === 401 || result.status === 403) {
    return json({ ok: false, code: "AUTH_REQUIRED", message: "Your member session is no longer valid.", request_id: id }, 401, {
      ...headers,
      "set-cookie": clearSessionCookie((env.APP_ENV || "") !== "local")
    });
  }
  if (!result.ok) {
    return json({ ok: false, code: "ERP_REQUEST_FAILED", message: result.body?.message || "Unable to complete this request.", request_id: id }, result.status || 502, headers);
  }
  return json({ ok: true, data: result.body, request_id: id }, 200, headers);
}

export default {
  async fetch(request, env) {
    const id = requestId();
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";
    const headers = { ...corsHeaders(request, env), "x-request-id": id };
    const secureCookie = (env.APP_ENV || "").toLowerCase() !== "local";

    if (request.method === "OPTIONS") {
      const origin = request.headers.get("origin");
      const allowed = env.ALLOWED_ORIGIN || "https://www.temospringwater.com";
      if (origin && origin !== allowed) {
        return json({ ok: false, code: "ORIGIN_NOT_ALLOWED", request_id: id }, 403, headers);
      }
      return new Response(null, { status: 204, headers });
    }

    if (path === "/api/health" && request.method === "GET") {
      return json({ ok: true, service: "temo-water-club-api", environment: env.APP_ENV || "unknown", erp_configured: Boolean(erpBase(env)), request_id: id }, 200, headers);
    }

    if (path === "/api/version" && request.method === "GET") {
      return json({ ok: true, api_version: env.API_VERSION || "v1", service: "temo-water-club-api", request_id: id }, 200, headers);
    }

    if (path === "/api/water-club/auth/login" && request.method === "POST") {
      let body;
      try { body = await readJson(request); }
      catch (_) { return json({ ok: false, code: "INVALID_JSON", message: "Invalid request body.", request_id: id }, 400, headers); }

      const identifier = String(body?.identifier || "").trim().toLowerCase();
      const password = String(body?.password || "");
      if (!identifier || identifier.length > 320 || !password || password.length > 200) {
        return json({ ok: false, code: "INVALID_CREDENTIALS", message: "Email/username and password are required.", request_id: id }, 400, headers);
      }

      const result = await erpRequest(env, "/api/customer/login", {
        method: "POST",
        body: { email: identifier, password }
      });
      if (!result.configured) return integrationPending(id, headers);
      if (!result.ok || !result.body?.success || !result.body?.token) {
        const status = result.status === 429 ? 429 : 401;
        return json({ ok: false, code: "LOGIN_FAILED", message: "Invalid customer credentials or account unavailable.", request_id: id }, status, headers);
      }

      const token = String(result.body.token);
      if (!/^[a-f0-9]{64}$/i.test(token)) {
        return json({ ok: false, code: "ERP_SESSION_INVALID", message: "ERP returned an invalid session.", request_id: id }, 502, headers);
      }

      return json({
        ok: true,
        user: result.body.user || null,
        request_id: id
      }, 200, {
        ...headers,
        "set-cookie": sessionCookie(token, secureCookie)
      });
    }

    if (path === "/api/water-club/auth/logout" && request.method === "POST") {
      const token = sessionToken(request);
      if (token) await erpRequest(env, "/api/logout", { method: "POST", token });
      return json({ ok: true, request_id: id }, 200, {
        ...headers,
        "set-cookie": clearSessionCookie(secureCookie)
      });
    }

    if ((path === "/api/water-club/auth/start" || path === "/api/water-club/auth/verify") && request.method === "POST") {
      return json({
        ok: false,
        code: "OTP_PROVIDER_PENDING",
        message: "Phone OTP is intentionally disabled until an approved OTP provider is configured. Existing ERP customer login is available through /api/water-club/auth/login.",
        request_id: id
      }, 503, headers);
    }

    if (path === "/api/water-club/me" && request.method === "GET")
      return authenticatedProxy(request, env, "/api/customer/me", id, headers);

    if (path === "/api/water-club/profile" && request.method === "GET")
      return authenticatedProxy(request, env, "/api/customer/me", id, headers);

    if (path === "/api/water-club/profile" && request.method === "PATCH")
      return authenticatedProxy(request, env, "/api/customer/profile", id, headers, "PATCH");

    if (path === "/api/water-club/dashboard" && request.method === "GET")
      return authenticatedProxy(request, env, "/api/customer/dashboard", id, headers);

    if (path === "/api/water-club/subscriptions" && request.method === "GET")
      return authenticatedProxy(request, env, "/api/customer/subscriptions", id, headers);

    if (path === "/api/water-club/bottles" && request.method === "GET")
      return authenticatedProxy(request, env, "/api/customer/bottle-balance", id, headers);

    const pending = new Set([
      "POST /api/water-club/membership",
      "GET /api/water-club/rewards",
      "GET /api/water-club/deliveries",
      "GET /api/water-club/referrals"
    ]);
    if (pending.has(`${request.method} ${path}`)) {
      return json({ ok: false, code: "PHASE_NOT_IMPLEMENTED", message: "This Water Club feature belongs to a later implementation phase.", request_id: id }, 503, headers);
    }

    return json({ ok: false, code: "NOT_FOUND", message: "API route not found.", request_id: id }, 404, headers);
  }
};
