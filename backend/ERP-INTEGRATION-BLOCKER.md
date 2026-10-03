# Step 4B — ERP Integration Blocker

Date: 2026-10-04

## What was verified
Connected GitHub repository:
- `temospringwater-eng/Temo-ERP`
- visibility: private
- default branch: `main`
- only branch currently visible: `main`

The repository contains `server.js`, `package.json`, SQLite database files and documentation.

## Important finding
The current `server.js` imports project files such as:
- `services/subscription-service`
- `services/notification-delivery-service`
- other `services/*` modules

It also references the customer portal/public application and the package test command expects `tests/*.test.js`.

However, on the connected GitHub `main` branch:
- `services/` is not present
- `public/` is not present
- `tests/` is not present

Representative checks:
- `services/subscription-service.js` — not found
- `services/notification-delivery-service.js` — not found
- `public/customer.html` — not found
- `tests/step7.test.js` — not found

Therefore the connected GitHub repository is not a complete copy of the current ERP application and cannot be safely used as the authoritative source for Step 4B implementation/testing.

## Existing ERP capabilities observed in server.js
The available `server.js` already shows useful APIs/features:
- customer login and sessions
- customer profile/dashboard/orders/payments/subscriptions
- bottle balance
- delivery subscriptions
- deliveries and driver flows
- loyalty accounts
- referral codes/referrals
- audit logs
- multi-company `company_id` scoping

These should be reused rather than duplicated once the complete ERP source is available.

## Required unblock
Before Step 4B coding:
1. Sync/push the complete current ERP source to `temospringwater-eng/Temo-ERP`.
2. Include the current `services/`, `public/`, `tests/` and any other runtime source directories.
3. Do NOT upload `.env`, API keys, passwords or other secrets.
4. Database files are not needed for code integration and should preferably remain out of future source commits.
5. After source sync, re-audit the exact customer/auth/session APIs and implement the website Worker ↔ ERP adapter on separate branches.

## Go-live rule
No production API routing, ERP deployment, website merge to `main`, or Water Club go-live is authorized by this document.
