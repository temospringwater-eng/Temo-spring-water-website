# Step 4B Validation Checkpoint

Date: 2026-10-04
Status: ADAPTER CODE READY / LIVE CONNECTION TEST PENDING

## Source validation completed

Using the supplied current TEMO-AQUAFLOW source:

- `server.js` passed `node --check`
- all 10 files currently present under `services/` passed `node --check`
- all 12 `tests/*.test.js` files passed `node --check`
- the supplied project contains `server.js`, `services/`, `public/`, `tests/`, `docs/`, `package.json` and `package-lock.json`

This validates JavaScript syntax only. It does not replace the full automated test suite.

## Runtime test limitation

The ZIP contained a local `node_modules` tree from another platform. Native modules such as SQLite are not portable across operating systems. A clean dependency install could not be completed in the current isolated test environment, so the full `npm test` suite was not claimed as passed here.

Do not commit or deploy the bundled `node_modules`; production/staging should run a clean install from `package-lock.json`.

## ERP deployment check

No existing deployed ERP URL was found in the connected `temospringwater-eng/Temo-ERP` repository for common hosting domains or `ERP_API_BASE_URL`.

The current project documentation describes local startup at `http://localhost:3000`. Therefore the website Worker cannot yet perform a real network call to the ERP.

## Database readiness check

The supplied current `hayrila.db` contains the expected ERP structures including companies, users, customers, sessions, delivery subscriptions, loyalty/referral and bottle-related tables.

For safe testing:
- the original uploaded database was not modified
- no duplicate customer/account was created
- the current database does not contain an active customer-portal user linked through `users.role='customer'` + `customer_id`
- current stored sessions are not usable as an active Water Club test session

A test customer portal account should be provisioned only in a staging/test environment or a copied database.

## Step 4B test matrix still required

After a reachable HTTPS ERP staging URL exists:

1. Configure Worker `ERP_API_BASE_URL`.
2. Provision one staging customer portal user linked to an existing staging customer.
3. Valid Water Club login → ERP session created.
4. Invalid login → generic rejection.
5. `/api/water-club/me` returns only the signed-in customer.
6. Dashboard returns only the signed-in customer's orders/payments/subscriptions/bottle balance.
7. Cross-customer/company access attempt is rejected.
8. Logout invalidates the ERP session and clears the Worker cookie.
9. Expired/invalid session redirects to login.
10. OTP routes remain fail-closed until a provider is configured.

## Current blocker

A reachable HTTPS deployment of the existing TEMO ERP is required for real integration testing.

No production routing, merge to `main`, duplicate backend, or go-live is authorized.
