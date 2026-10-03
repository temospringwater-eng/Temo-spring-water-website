# Step 4B — ERP Source Status

Date: 2026-10-04
Status: SOURCE BLOCKER RESOLVED FOR DEVELOPMENT

## Resolution
The complete current TEMO-AQUAFLOW project was supplied as an uploaded ZIP. It contains the previously missing runtime source directories:
- `services/`
- `public/`
- `tests/`
- `docs/`

The ZIP also contains local-only material such as `.env`, `node_modules` and SQLite/debug database files. These must **not** be copied into the website repository or committed as integration secrets/artifacts.

## Existing ERP capabilities confirmed
The current ERP source already provides:
- customer login and ERP sessions
- tenant/customer-scoped profile and dashboard APIs
- recurring delivery subscriptions
- bottle balance
- orders, payments and complaints
- loyalty and referral infrastructure
- driver/delivery workflows
- audit logs and company isolation

The Water Club implementation therefore reuses these existing ERP systems instead of creating duplicate customer/session stores.

## Current Step 4B implementation
The website Cloudflare Worker adapter now maps Water Club member auth/dashboard routes to the existing ERP customer portal APIs. The ERP session token is held in an HttpOnly cookie at the website layer.

## Still pending
- Complete GitHub source synchronization for the ERP project can be done separately without creating another ERP repository or app.
- A reachable HTTPS ERP deployment URL is required for live preview integration.
- Worker environment configuration and preview routing are required.
- OTP provider integration remains intentionally disabled.
- Authentication/tenant-isolation tests must pass before production.

## Go-live rule
No production API routing, ERP deployment, website merge to `main`, or Water Club go-live is authorized by this document. Final owner approval is mandatory.
