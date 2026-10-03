# TEMO Website Backend API Foundation

This directory contains the pre-launch Cloudflare Worker API scaffold for the TEMO Water Club website.

## Current status

Foundation only. It is intentionally **not** connected to the real ERP, OTP provider, customer database, payment provider or live Water Club accounts yet.

## Public foundation endpoints

- `GET /api/health`
- `GET /api/version`

## Scaffolded Water Club routes

- `POST /api/water-club/auth/start`
- `POST /api/water-club/auth/verify`
- `POST /api/water-club/auth/logout`
- `GET /api/water-club/me`
- `GET /api/water-club/profile`
- `PATCH /api/water-club/profile`
- `POST /api/water-club/membership`
- `GET /api/water-club/rewards`
- `GET /api/water-club/deliveries`
- `GET /api/water-club/referrals`
- `GET /api/water-club/bottles`

Until Step 4B is implemented, scaffolded business/auth routes return HTTP 503 with `BACKEND_INTEGRATION_PENDING`. This prevents the frontend from pretending that authentication or customer data is live.

## Security rules

- Do not commit credentials or tokens.
- Put real secrets in Cloudflare Worker secrets/environment bindings.
- Keep the ERP as the system of record.
- Never trust `customer_id` supplied only by the browser.
- Real authentication must use backend-side verification and secure sessions.
- OTP values must not be logged.
- Production customer APIs must return `Cache-Control: no-store`.

## Planned Step 4B

Connect this Worker API to the trusted central ERP API for:
1. customer lookup/linking
2. OTP start/verify
3. secure session creation
4. authenticated `/me`
5. logout/recovery
6. customer-scoped dashboard data

## Deployment rule

Do not route production `/api/*` traffic to this Worker until Step 4B, security tests and final owner approval are complete.
