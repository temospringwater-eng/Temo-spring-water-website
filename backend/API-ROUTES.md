# TEMO Water Club API Routes v1

## Architecture
The website Worker does **not** create a second customer or session database. It reuses the existing TEMO ERP customer portal, customer records, company scope and ERP session table.

Browser → Website Worker → Existing ERP customer APIs

The Worker keeps the ERP session token out of browser JavaScript by storing it in an HttpOnly cookie.

## Foundation
| Method | Route | Current |
|---|---|---|
| GET | /api/health | implemented |
| GET | /api/version | implemented |

## Authentication
| Method | Route | Current / Purpose |
|---|---|---|
| POST | /api/water-club/auth/login | implemented adapter → ERP /api/customer/login |
| POST | /api/water-club/auth/logout | implemented adapter → ERP /api/logout |
| GET | /api/water-club/me | implemented adapter → ERP /api/customer/me |
| POST | /api/water-club/auth/start | OTP reserved; provider pending |
| POST | /api/water-club/auth/verify | OTP reserved; provider pending |

The Worker does not return the ERP session token to frontend JavaScript. A successful customer login sets an HttpOnly, SameSite=Lax session cookie.

## Profile & dashboard
| Method | Route | Current / ERP source |
|---|---|---|
| GET | /api/water-club/profile | implemented → /api/customer/me |
| PATCH | /api/water-club/profile | implemented → /api/customer/profile |
| GET | /api/water-club/dashboard | implemented → /api/customer/dashboard |
| GET | /api/water-club/subscriptions | implemented → /api/customer/subscriptions |
| GET | /api/water-club/bottles | implemented → /api/customer/bottle-balance |

## Later Water Club phases
| Method | Route | Status |
|---|---|---|
| POST | /api/water-club/membership | pending membership engine |
| GET | /api/water-club/rewards | pending customer-scoped rewards adapter |
| GET | /api/water-club/deliveries | pending delivery adapter |
| GET | /api/water-club/referrals | pending customer-scoped referral adapter |

## Required configuration
Set `ERP_API_BASE_URL` in the Worker environment to the trusted deployed TEMO ERP backend. In production the adapter rejects a non-HTTPS ERP base URL.

## Security
- ERP remains the system of record.
- No duplicate customer/session store is created in the website Worker.
- ERP session tokens are kept in HttpOnly cookies and are not returned to frontend JS.
- Protected API responses use `Cache-Control: no-store`.
- Customer identity comes from the authenticated ERP session; browser-supplied customer IDs are not trusted.
- OTP is fail-closed until a provider is explicitly configured.
- Production routing remains disabled until testing and final owner approval.

## Water Club member engine

The following routes now proxy to company/customer-scoped ERP Water Club endpoints:

- POST membership (home/family/office/business)
- GET catalog; POST orders
- GET rewards; POST rewards/redeem
- GET/POST referrals
- POST subscriptions; POST subscriptions/:id/pause|resume|skip|cancel
- GET deliveries
- GET/POST support (existing ERP complaints)

Order, subscription, subscription actions and redemption mutations require a unique requestKey. Identical retries return the prior result; changed bodies under the same key return conflict. Prices and customer identity are determined by ERP, never by browser IDs/prices. Membership uses an existing ERP customer session. OTP signup remains disabled until its approved provider is connected. Production ERP URL must use HTTPS.
