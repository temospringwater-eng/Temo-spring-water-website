# Water Club checkpoint — 5 October 2026

Customer interface and Worker routes now connect memberships, catalog/orders, recurring schedules/actions, rewards/redemption, referrals, deliveries, profile and support to the existing ERP. ERP implementation and admin controls are on Temo-ERP integration/water-club-api. Website edits remain on design/premium-homepage-v1; main is untouched.

Pilot rules: 5 points per 19L refill / 1.5L carton / 500ml carton; first verified qualifying paid delivery +5; successful first-paid-delivery referral +20; 100 points for one zero-price 19L refill order. Unused points expire after 12 months. Refund/cancel reversals and spent-point debt are recorded; retries and concurrent requests cannot issue duplicate rewards. Admin configures qualifying ERP products/units and verifies payments, rather than exposing financial/reward mutation to customers.

ERP local suite 27/27 and Worker suite 10/10 passed. Cross-repository Worker-to-real-local-ERP flow also passed using WC_WORKER_PATH. JavaScript syntax and member/admin DOM targets checked. Browser interaction/visual testing could not run because localhost preview was blocked by the browser environment.

Still pending: paid ERP hosting, HTTPS Worker configuration and deployment, actual product/stock/commercial review, OTP provider signup, real provider delivery, browser/mobile/driver flows, restart persistence/backup restore and final owner go-live approval. No paid deployment, production publish or main merge performed. Existing login supports ERP-provisioned customer credentials. Complete software flow is not a claim that public Water Club is already live.
