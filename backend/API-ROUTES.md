# TEMO Water Club API Routes v1

## Foundation
| Method | Route | Current |
|---|---|---|
| GET | /api/health | implemented |
| GET | /api/version | implemented |

## Authentication
| Method | Route | Purpose |
|---|---|---|
| POST | /api/water-club/auth/start | Start phone verification |
| POST | /api/water-club/auth/verify | Verify OTP and create session |
| POST | /api/water-club/auth/logout | Invalidate session |
| GET | /api/water-club/me | Return authenticated member identity |

## Profile & membership
| Method | Route | Purpose |
|---|---|---|
| GET | /api/water-club/profile | Member profile |
| PATCH | /api/water-club/profile | Allowed profile updates |
| POST | /api/water-club/membership | Create/activate Water Club membership |

## Member data
| Method | Route | Purpose |
|---|---|---|
| GET | /api/water-club/rewards | Rewards ledger/summary |
| GET | /api/water-club/deliveries | Delivery schedule/history |
| GET | /api/water-club/referrals | Referral status |
| GET | /api/water-club/bottles | 19L bottle ledger |

All business/auth routes are scaffold-only until Step 4B.
