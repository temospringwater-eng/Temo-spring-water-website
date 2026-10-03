# TEMO Water Club — Customer Journey v1

Status: Pre-launch flow specification
Branch: `design/premium-homepage-v1`

## Goal
Define the exact customer flow before implementing real authentication, subscriptions, rewards, payments or ERP integration.

## 1. Entry Points
A customer can enter Water Club from:
- Homepage Water Club CTA
- Water Club page
- Product page CTA
- Business/B2B page CTA
- WhatsApp link
- Future QR/referral link

## 2. Start Journey
Customer clicks:
**Join TEMO Water Club**

The first screen should explain:
- available plans
- scheduled delivery concept
- rewards concept
- service area note
- no automatic charge until customer confirms the plan/payment method

Primary action:
**Start Membership Setup**

Secondary action:
**Ask on WhatsApp**

## 3. Basic Customer Details
Collect:
- full name
- mobile/WhatsApp number
- email (optional unless needed for account recovery/invoices)
- city/area
- customer type: Home / Family / Office / Business

Validation:
- valid phone required
- duplicate customer check before creating a new record
- existing customer should be routed to login/account recovery instead of creating duplicate account

## 4. Phone Verification
For the real system:
- send OTP to verified channel
- customer enters OTP
- OTP must expire
- retry/rate-limit rules required
- account setup continues only after successful verification

If OTP provider is not configured at first launch, admin-assisted/manual verification may be used as a controlled fallback.

## 5. Choose Water Club Plan
Customer selects one:
- Home Plan
- Family Plan
- Office Plan
- Business Plan

The screen should show:
- plan purpose
- eligible products
- reward eligibility
- whether standard pricing or custom quotation applies

Business Plan should route to quotation/contract flow where required.

## 6. Select Products & Quantity
Customer selects:
- 19L
- 1.5L cartons
- 500ml cartons
- mixed products where allowed

For each selected product:
- quantity
- recurring quantity
- bottle/security-deposit requirement where applicable

The system must not silently apply a product or quantity the customer did not select.

## 7. Choose Delivery Schedule
Available schedule types:
- weekly
- twice weekly
- every 2 weeks
- monthly
- custom schedule

Customer selects:
- preferred delivery day
- preferred time window
- delivery frequency
- start date

The system should calculate and display the next planned delivery before confirmation.

## 8. Delivery Address
Collect:
- address line
- area/sector
- city
- delivery notes
- optional map pin/GPS in the future

For business customers:
- company/business name
- billing contact
- delivery location(s)
- invoice details when enabled

## 9. Pricing & Charges Review
Before confirmation, show a clear summary:
- products
- quantities
- unit/carton/refill price
- delivery/cargo charge if applicable
- 19L bottle security deposit if applicable
- discounts or contract price if applicable
- total due for the first order
- reward points that may be earned after successful paid delivery

No hidden fee should be added after this screen.

## 10. Payment Method
Initial supported methods can be configured by admin, for example:
- Cash on Delivery
- Bank transfer/manual verification
- Raast P2M when approved and integrated

The Water Club system must not assume Raast P2M is available until the payment provider approves and credentials/webhooks are configured.

## 11. Final Review & Consent
Before creating the subscription/member plan, customer sees:
- selected plan
- products/quantities
- schedule
- delivery address
- pricing
- payment method
- reward rules summary
- bottle/security-deposit terms where applicable
- cancellation/pause policy link
- privacy/terms acceptance

Required action:
**Confirm Water Club Membership**

## 12. Account Creation
After confirmation:
- create or link customer record
- create Water Club member profile
- create plan/subscription record
- save delivery schedule
- save address
- create first order if applicable
- generate unique referral code
- initialize rewards ledger at zero
- initialize 19L bottle ledger if relevant

All records must use the correct company/customer IDs and must be auditable.

## 13. Confirmation Screen
Show:
- membership status
- plan name
- first/next delivery
- first order summary
- reward balance
- referral code
- payment status
- support/WhatsApp action

Send confirmation through enabled channels:
- in-app
- email
- WhatsApp when configured

## 14. First Delivery
Driver/Admin workflow:
- assigned delivery appears in delivery system
- driver confirms products delivered
- 19L returns/issued bottles recorded
- payment recorded/verified
- order marked delivered

Only after required payment + delivery conditions are met:
- reward points are posted
- referral qualification can be evaluated
- customer dashboard updates

## 15. After First Delivery
Customer dashboard should show:
- current plan
- next delivery
- order history
- reward points
- referral code/status
- 19L bottle balance
- payment history
- pause/resume/skip/change schedule actions
- support

## 16. Existing Customer Journey
If phone/email already belongs to an existing customer:
- do not create duplicate customer
- offer login/OTP/account recovery
- allow the existing customer to add/activate Water Club on the same customer profile

## 17. Failed / Exception Flows
The implementation must explicitly handle:
- invalid/expired OTP
- duplicate phone/account
- unsupported delivery area
- unavailable product
- failed payment
- missed/failed delivery
- customer cancellation
- refund
- paused plan
- address change
- bottle-return mismatch
- manual admin correction with audit log

## 18. B2B Exception Flow
Business Plan may require:
**Inquiry → Quote → Approval → Commercial Terms → Account Activation → Schedule**

It should not force consumer pricing or consumer reward rules when a contract-specific setup applies.

## 19. Journey State Model
Recommended high-level statuses:
- started
- phone_verified
- plan_selected
- schedule_selected
- address_confirmed
- awaiting_payment_or_approval
- active
- paused
- cancelled

Order/delivery/payment statuses remain separate from membership status.

## 20. No-Go-Live Rule
This journey specification does not authorize production launch. Real account/auth implementation, testing, security review and final owner approval are required before merge to `main`.
