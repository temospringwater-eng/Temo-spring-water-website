# TEMO Website Backend API

This directory contains the pre-launch Cloudflare Worker API for the TEMO Water Club website.

## Architecture

The Worker is an adapter in front of the **existing TEMO ERP**. It does not create a second customer database or a second ERP.

```
Browser
  ↓
temospringwater.com/api/water-club/*
  ↓
Cloudflare Worker adapter
  ↓
Existing TEMO ERP customer/session APIs
  ↓
Existing ERP database
```

The ERP remains the system of record for customer identity, company scope, orders, recurring deliveries, payments and bottle balances.

## Current Step 4B status

Implemented in the preview branch:
- `POST /api/water-club/auth/login` → ERP `/api/customer/login`
- `POST /api/water-club/auth/logout` → ERP `/api/logout`
- `GET /api/water-club/me` → ERP `/api/customer/me`
- `GET /api/water-club/profile`
- `PATCH /api/water-club/profile`
- `GET /api/water-club/dashboard` → ERP customer dashboard
- `GET /api/water-club/subscriptions`
- `GET /api/water-club/bottles`

A successful ERP customer login token is stored only in an HttpOnly, SameSite=Lax cookie by the Worker. The token is not returned to frontend JavaScript.

## OTP

Phone OTP routes remain fail-closed:
- `POST /api/water-club/auth/start`
- `POST /api/water-club/auth/verify`

They return `OTP_PROVIDER_PENDING` until an approved provider is configured. No fake OTP is accepted.

## Required configuration

Set:

```
ERP_API_BASE_URL=https://<trusted-erp-host>
```

Production requires HTTPS for the ERP base URL.

## Still pending before Step 4B can be called complete

1. Deploy the trusted ERP backend to a reachable HTTPS host.
2. Configure `ERP_API_BASE_URL` in the Worker environment.
3. Route preview/test `/api/*` traffic to this Worker.
4. Test valid/invalid customer login, logout, expired session and tenant isolation.
5. Configure an approved phone OTP provider if passwordless login is required for launch.
6. Run security/recovery tests.

## Security rules

- No duplicate customer/session store in the website.
- Do not commit credentials, tokens or `.env`.
- Customer IDs are derived from the ERP-authenticated session.
- Protected responses use `Cache-Control: no-store`.
- Production cookies are `Secure`, `HttpOnly`, and `SameSite=Lax`.
- OTP fails closed until configured.
- Do not route production traffic or merge to `main` without final owner approval.
