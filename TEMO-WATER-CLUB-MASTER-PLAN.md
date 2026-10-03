# TEMO Website + Water Club Master Plan v1

Branch: `design/premium-homepage-v1`

## Rule
Do not merge to `main` or make the redesign live until final approval and go-live checks are complete.

## Phase Status

1. Current branch audit — COMPLETE
2. Water Club business rules — COMPLETE
3. Customer journey — COMPLETE
4. Real member account/auth — FOUNDATION READY / BACKEND PENDING
5. Subscription & delivery engine — PENDING
6. Rewards engine — PENDING
7. Referral system — PENDING
8. 19L bottle ledger — PENDING
9. ERP integration — PENDING
10. Admin Water Club dashboard — PENDING
11. Driver integration — PENDING
12. Payments / Raast P2M — PENDING
13. B2B Water Club — PENDING
14. Notifications — PENDING
15. Website completion — PENDING
16. SEO — PENDING
17. Performance — PENDING
18. Security — PENDING
19. Legal/customer policies — PENDING
20. Full testing — PENDING
21. Staging/preview approval — PENDING
22. Go live — PENDING

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
Phase 4B: connect the Water Club authentication foundation to a trusted backend/ERP API. Required before Phase 4 can be marked complete: real customer lookup/linking, OTP verification provider, secure session handling, customer-scoped authorization, logout/recovery and protected dashboard access. Do not fake these controls in frontend JavaScript.