# TEMO Website + Water Club Master Plan v1

Branch: `design/premium-homepage-v1`

## Rule
Do not merge to `main` or make the redesign live until final approval and go-live checks are complete.

## Phase Status

1. Current branch audit — COMPLETE
2. Water Club business rules — COMPLETE
3. Customer journey — COMPLETE
4. Website backend API foundation — COMPLETE
5. Real member account/auth — FOUNDATION READY / BACKEND CONNECTION PENDING
6. Subscription & delivery engine — PENDING
7. Rewards engine — PENDING
8. Referral system — PENDING
9. 19L bottle ledger — PENDING
10. ERP integration — PENDING
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
- Member dashboard prototype exists and is marked `noindex,nofollow`.
- Water Club join form uses the existing TEMO form/WhatsApp flow.
- Original TEMO logo assets are referenced on the new Water Club pages.
- Redesign branch is ahead of `main` and `main` has not been merged/modified by this work.

### Issues / backlog
1. Cloudflare Workers Build check is failing on the latest redesign commit. The latest checked `main` commit also shows the same failure, so this is not isolated to the Water Club code. Cloudflare build/deployment configuration must be investigated before go-live.
2. `logo-icon-128.webp` is a zero-byte repository asset and is referenced by several legacy pages. Remove it from responsive image references or replace it with a valid asset before final release.
3. Water Club navigation is not yet added to all legacy pages: About, Products, Business, Quality, Dealer and Contact.
4. `sitemap.xml` does not yet include `water-club.html`. Add only when the page is approved for public indexing.
5. Legacy pages contain likely unstyled utility classes: `check-list`, `contact-form`, `mobile-order-1`, and `three-col`. These predate the Water Club branch changes and should be visually verified/fixed during website completion.
6. The member dashboard currently contains demo data only; no real authentication, customer data, rewards ledger, delivery engine or ERP connection exists yet.

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
Step 4B: connect the new same-repository Cloudflare Worker API foundation to the trusted central ERP backend. Implement customer lookup/linking, OTP provider integration, secure sessions, logout/recovery and protected customer-scoped dashboard access. The ERP remains the system of record. Do not deploy production /api/* routing or merge to main without final approval.