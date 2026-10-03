# TEMO Water Club — Business Rules v1

Status: Pilot / pre-launch
Branch: `design/premium-homepage-v1`

## 1. Scope
TEMO Water Club is a scheduled-delivery and loyalty program for Home, Family, Office and Business customers.

No live payment, recurring charge or automatic enrollment is enabled at this stage.

## 2. Plans
- Home Plan
- Family Plan
- Office Plan
- Business Plan

## 3. Delivery Frequencies
- Weekly
- Twice weekly
- Every 2 weeks
- Monthly
- Custom schedule

Customers must be able to pause, resume, skip and request quantity/schedule changes when the real backend is implemented.

## 4. Pilot Reward Rules — Locked
- Completed 19L refill delivery: +5 points
- Completed 1.5L carton delivery: +5 points
- Completed 500ml carton delivery: +5 points
- First completed Water Club order: +5 bonus points
- Successful verified referral: +20 points
- 100 points: 1 free 19L refill

## 5. Reward Qualification — Locked
- Points are credited only when an order is both paid and marked delivered.
- Cancelled, failed or refunded orders do not earn points.
- If points were already credited for an order that is later reversed/refunded, those points must be reversed.
- Bottle security deposits do not earn points.
- Cargo/delivery charges do not earn points.
- Points have no cash value.
- Pilot points are non-transferable.
- Pilot points expire 12 months after they are earned unless TEMO changes the policy before launch.
- Manual point adjustments require admin, reason, timestamp and audit-log entry.

## 6. Referral Rules — Locked
- Each Water Club member can have a unique referral code.
- Referral reward is issued only after the referred customer completes their first paid delivery.
- One verified new customer can trigger only one referral reward.
- Self-referral and duplicate-customer referral rewards are not allowed.
- Phone/customer identity and completed delivery must be verified before issuing referral points.

## 7. Redemption Rules — Locked
- 100 points can redeem 1 free 19L refill.
- Redemption must create a recorded reward/zero-price order or approved discount record so stock and reporting remain accurate.
- Redemption cannot make the rewards ledger negative.

## 8. B2B Rules — Locked Structure
- Business/B2B accounts can use standard rewards, disabled rewards, or contract-specific benefits.
- B2B reward mode must be configurable per customer/company contract.
- Bulk price, invoice terms, delivery schedule and custom-label terms remain contract-specific.

## 9. 19L Bottle Rules — Backend Requirement
The real system must support:
- bottles issued
- bottles returned
- bottles currently with customer
- security deposit
- lost/damaged bottle handling
- driver return entry
- customer bottle history

Exact deposit/refund business policy will remain configurable until final commercial approval.

## 10. Admin-Configurable Before Launch
The backend should support these as settings rather than hard-code them:
- minimum qualifying order
- referral reward monthly cap
- redemption frequency/limit
- reward point values
- expiry period
- B2B reward mode
- promotional bonus campaigns

These values are intentionally not guessed in v1.

## 11. No-Go-Live Rule
This document does not authorize production launch. The redesign branch must not be merged to `main` until the final preview, tests and explicit owner approval are complete.
