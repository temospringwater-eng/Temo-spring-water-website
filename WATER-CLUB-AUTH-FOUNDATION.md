# TEMO Water Club — Authentication Foundation v1

Status: Secure foundation / pre-backend
Branch: `design/premium-homepage-v1`

## Current Repository Reality
The public website repository is a static HTML/CSS/JavaScript site. It does not currently contain a trusted application backend, database, server-side session store, OTP provider, or customer identity API.

Therefore:
- passwords must NOT be stored in browser localStorage/sessionStorage
- OTP verification must NOT be simulated as real security
- customer records must NOT be embedded in frontend JavaScript
- the prototype login/signup screens must remain non-production until a secure backend is connected

## 1. Identity Model
The real Water Club member should link to the existing ERP customer record where possible.

Required identifiers:
- customer_id
- company_id
- water_club_member_id
- verified phone number
- optional verified email
- account status
- created_at / updated_at

The phone number should be the primary customer-facing identity unless business rules later require email login.

## 2. Duplicate Customer Handling
Before creating a new member:
1. normalize the phone number
2. look up an existing customer within the correct company
3. if found, link/activate Water Club on that customer
4. do not create a duplicate customer
5. require verification before exposing customer data

## 3. Signup Flow
Recommended real flow:
1. user enters phone number
2. backend checks whether customer exists
3. backend sends OTP through configured provider
4. user submits OTP
5. backend verifies OTP and rate limits attempts
6. if new customer: collect name and required profile fields
7. create/link Water Club member
8. create authenticated session
9. redirect to member onboarding/dashboard

## 4. Login Flow
Recommended:
- phone + OTP as primary login
- optional password login can be added later if required
- account recovery should reuse verified phone/email
- business accounts may use additional admin/contact controls

## 5. OTP Security Requirements
Backend must enforce:
- short expiry window
- hashed or provider-managed OTP verification
- attempt counter
- resend cooldown
- IP/device/phone rate limiting
- one-time use
- audit event for send/verify/failure
- no OTP value in application logs

## 6. Session Security
Use server-managed or cryptographically signed secure sessions.

Required controls:
- Secure cookie in production
- HttpOnly
- SameSite=Lax or stricter where compatible
- session rotation after authentication
- expiry and logout invalidation
- CSRF protection for state-changing requests where applicable
- no authentication token in query strings
- do not store long-lived auth secrets in localStorage

## 7. Customer Data Isolation
Every authenticated request must resolve:
- company_id
- customer_id / member_id
- authorization scope

A customer may read/change only their own permitted Water Club data.

Never trust customer_id supplied only by the browser.

## 8. Minimum API Contract
Future backend endpoints should provide equivalent capabilities:

### Auth
- POST /api/water-club/auth/start
- POST /api/water-club/auth/verify
- POST /api/water-club/auth/logout
- GET /api/water-club/me

### Profile / onboarding
- GET /api/water-club/profile
- PATCH /api/water-club/profile
- POST /api/water-club/membership

### Security responses
Use generic authentication errors so account existence is not exposed unnecessarily.

## 9. Dashboard Access Rule
`water-club-account.html` is currently a DEMO only.

The real customer dashboard must:
- require an authenticated session
- fetch data from the backend
- never contain hard-coded real customer data
- redirect unauthenticated users to login
- keep dashboard pages noindex

## 10. Audit Events
Record at minimum:
- signup started
- OTP sent
- OTP failed
- OTP verified
- login success
- login failure
- logout
- profile change
- membership activation
- recovery event
- account status change by admin

## 11. Statuses
Recommended account statuses:
- pending_verification
- active
- suspended
- disabled

Membership status remains separate:
- started
- awaiting_payment_or_approval
- active
- paused
- cancelled

## 12. Frontend Prototype Rule
Frontend login/signup pages may be built now for visual review, but must clearly state that secure account activation is not live until backend integration is completed.

No real credentials or customer secrets should be accepted/stored by the prototype.

## 13. Implementation Gate
Phase 4 is considered fully COMPLETE only when:
- trusted backend is connected
- OTP/provider strategy is configured
- sessions are implemented securely
- duplicate-customer linking works
- customer-scoped authorization tests pass
- real dashboard requires authentication

Until then, status is FOUNDATION READY / BACKEND PENDING.

## 14. No-Go-Live Rule
Do not merge the authenticated Water Club experience to `main` as a live feature until security testing and explicit owner approval are complete.
