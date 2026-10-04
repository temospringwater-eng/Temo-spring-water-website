# TEMO Website + Water Club Master Plan v1

Branch: `design/premium-homepage-v1`

## Rule
Do not merge to `main` or make the redesign live until final approval and go-live checks are complete.

## Phase Status

1. Current branch audit — COMPLETE
2. Water Club business rules — COMPLETE
3. Customer journey — COMPLETE
4. Website backend API foundation — COMPLETE
5. Real member account/auth — STEP 4B CODE + ERP CI READY / HTTPS STAGING DEPLOYMENT PENDING
6. Subscription & delivery engine — PENDING
7. Rewards engine — PENDING
8. Referral system — PENDING
9. 19L bottle ledger — PENDING
10. ERP integration — PARTIAL: EXISTING CUSTOMER PORTAL REUSED
11. Admin Water Club dashboard — PENDING
12. Driver integration — PENDING
13. Payments / Raast P2M — PENDING
14. B2B Water Club — PENDING
15. Notifications — PENDING
16. Website completion — PENDING
17. SEO — PENDING
18. Performance — PENDING
19. Security — PENDING
20. Legal/customer policies — PENDING
21. Full testing — PENDING
22. Staging/preview approval — PENDING
23. Go live — PENDING

## Phase 1 Audit — 03 Oct 2026

### Passed
- No missing local file references detected across the current HTML/CSS files.
- No broken local fragment/anchor targets detected.
- New Water Club page exists and is linked from the premium homepage.
- Water Club pages remain `noindex,nofollow` where account/private content is involved.
- Water Club join form uses the existing TEMO form/WhatsApp flow.
- Original TEMO logo assets are referenced on the new Water Club pages.
- Redesign branch is ahead of `main` and `main` has not been merged/modified by this work.

### Issues / backlog
1. Cloudflare Workers Build check was failing on the redesign and the checked `main` commit. Cloudflare build/deployment configuration must be investigated before go-live.
2. `logo-icon-128.webp` is a zero-byte repository asset and is referenced by several legacy pages. Remove it from responsive image references or replace it with a valid asset before final release.
3. Water Club navigation is not yet added to all legacy pages: About, Products, Business, Quality, Dealer and Contact.
4. `sitemap.xml` does not yet include `water-club.html`. Add only when the page is approved for public indexing.
5. Legacy pages contain likely unstyled utility classes: `check-list`, `contact-form`, `mobile-order-1`, and `three-col`. These predate the Water Club branch changes and should be visually verified/fixed during website completion.
6. The member dashboard is no longer hard-coded demo customer data; it is now an auth-gated ERP adapter preview. It still requires deployed ERP/Worker configuration before it can return live customer data.

## Step 4B — Current Integration

The website Worker now reuses the existing ERP customer portal instead of creating a second account/customer database.

Implemented adapter flow:
- Water Club login → ERP `/api/customer/login`
- Water Club logout → ERP `/api/logout`
- Member identity/profile → ERP `/api/customer/me`
- Member dashboard → ERP `/api/customer/dashboard`
- Recurring deliveries → ERP `/api/customer/subscriptions`
- Bottle balance → ERP `/api/customer/bottle-balance`
- ERP session token is retained in an HttpOnly website cookie and is not returned to frontend JavaScript.

Phone OTP remains fail-closed until an approved provider is configured. No fake OTP is accepted.

## Locked Pilot Reward Rules

- Completed 19L refill delivery: +5 points
- Completed 1.5L carton delivery: +5 points
- Completed 500ml carton delivery: +5 points
- First completed Water Club order: +5 bonus points
- Successful verified referral: +20 points
- 100 points: 1 free 19L refill
- Points credited only after paid + delivered status
- Cancelled/refunded orders do not earn points; issued points are reversed where applicable
- Bottle security deposits and cargo/delivery charges do not earn points
- One referral reward per verified new customer
- Pilot points are non-transferable and have no cash value
- Pilot expiry: 12 months
- Manual point adjustments require an audit trail
- B2B accounts may use separate contract-specific reward settings

## Immediate Next Phase
Step 4B software preparation is now validated in GitHub CI. The ERP integration branch `integration/water-club-api` passed a clean Linux smoke run with:
- `npm ci`
- `node --check server.js`
- service syntax checks
- real process startup
- SQLite database creation on a clean staging path
- `GET /api/health` returning success

Remaining Step 4B work is external staging deployment:
1. connect a hosting provider for the existing ERP (Render is recommended),
2. deploy the existing `integration/water-club-api` branch with a persistent disk,
3. obtain the HTTPS staging URL,
4. set Website Worker `ERP_API_BASE_URL`,
5. provision one staging customer portal account and run login/logout/session/tenant-isolation tests.

Do not route production traffic, merge to `main`, or go live without explicit owner approval.