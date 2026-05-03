# Priceline GPM Simulator

Salesforce GPM + Loyalty simulator skinned as Priceline Beauty Rewards. Demo-ready for showing GPM promotion evaluation, loyalty points accrual, and transaction journals.

## Stack
- **Frontend:** React 18 + Vite + Tailwind CSS (port 5173)
- **Backend:** Node.js + Express (port 3001)
- **Auth:** SF OAuth2 client credentials (server-side only)

## Dev
```bash
npm run dev          # both server + client concurrently
npm run dev:server   # server only :3001
npm run dev:client   # client only :5173
```

## Key conventions
- All API routes under `/api/*`
- POST bodies: `{ profile, items, channel, useMock }`
- Mock auto-fires if SF GPM returns 404 or `useMock: true`
- CartContext + BrandContext for all global state
- `client/src/api/client.js` wraps all fetch calls — always use this, never raw fetch

## Promotion engine (server/routes/promotions.js)
- `buildMockEligible()` — smart mock for all 10 UCs based on cart/profile/channel
- `buildMockExecution()` — applies promos, calculates discounts
- UC1–UC10 all implemented in mock; live SF GPM path requires `GlobalPromotionsForRLM` datakit

## Profiles (server/data/profiles.json)
9 profiles with real SF contactIds/memberIds. Key profiles:
- Emma Wilson (Gold, Sister Club) — UC1+UC2
- Diana Nguyen (Gold, Sister Club) — UC8+UC9
- Rachel Kim (Silver, Sister Club) — UC10
- guest-nonmember — UC7 BLM tracker

## Products (server/data/products.json)
Categories: Skincare, Vitamins & Supplements, Haircare, Fragrance, Makeup, Gift Sets, Baby & Mum, Health

## Env vars required
```
SF_CLIENT_ID, SF_CLIENT_SECRET, SF_INSTANCE_URL, SF_API_VERSION
SF_PROGRAM_NAME=PricelineBeautyRewards
SF_CATALOG_NAME=Priceline Beauty Rewards Catalog
PORT=3001
```

## Live API status
- `/services/data/v64.0/global-promotions-management/eligible-promotions/?ruleLibraryApiName=GPMRuleLibraryGPM_V1`
- Currently returns `INVALID_API_INPUT` — requires GPM datakit deployed in fresh org on Monday
- RuleLibrary `GPMRuleLibraryGPM` (Id: 9QsIi000000oNx4KAE) has UsageType=GlobalPromotionsForRLM + Active version

## Brand
- Primary: `#EC2B8C` (Priceline pink)
- CSS vars: `--brand-primary`, `--brand-primary-dark`
- Font: Poppins

## Deploy
Heroku — `git push heroku main` or auto-deploy from GitHub `main`
