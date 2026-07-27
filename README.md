# Blue Ribbon Real Estate

Website for Blue Ribbon Real Estate (Western Sydney) backed by the **Agentbox** CRM (Reapit Sales AU).

## Repo layout

```
.
├── frontend/   Next.js 16 site (public pages, forms, LeadPlus appraisal widget)
├── api/        Node + Express backend that proxies Agentbox
└── README.md   (this file)
```

The frontend never talks to Agentbox directly — the API key must not be exposed to browsers. All property data, staff, and lead submissions flow through the `api/` service.

## Prerequisites

- Node 20+
- npm (backend) and yarn (frontend — the repo uses Yarn Berry via `.yarnrc.yml`)
- Outbound access to `https://api.agentboxcrm.com.au` from an **IP whitelisted by Reapit**

## Running locally

Two processes, two terminals:

```bash
# terminal 1 — backend on :4000
cd api
npm install
cp .env.example .env         # fill in the sandbox credentials
npm run dev

# terminal 2 — frontend on :3000
cd frontend
yarn install
cp .env.local.example .env.local
yarn dev
```

Verify the whole chain works:

```bash
curl http://localhost:4000/health
# → {"ok":true,"agentbox":{"reachable":true,"offices":N}, ...}
```

If `/health` returns 502 with `upstreamStatus: 403`, the current machine's IP isn't whitelisted with Reapit. Email Reapit with the new IP.

## Environment variables

**`api/.env`** (never commit — see `api/.env.example`):
- `AGENTBOX_API_KEY` — from Reapit Bitwarden Send
- `AGENTBOX_CLIENT_ID` — from Reapit (base64 of `https://<instance>.agentboxcrm.com.au/admin/`)
- `AGENTBOX_BASE_URL` — `https://api.agentboxcrm.com.au`
- `BLUE_RIBBON_OFFICE_ID` — filter listings/staff to this office. Discover via `GET /offices`. **Must be updated when switching from sandbox to production.**
- `PORT` — API port (default 4000)
- `CORS_ORIGIN` — comma-separated list of frontend origins allowed to call this API

**`frontend/.env.local`**:
- `NEXT_PUBLIC_API_URL` — where the frontend reaches the API (e.g. `http://localhost:4000` in dev, `https://api.blueribbonre.com.au` in prod)

## Architecture

**Read paths.** Frontend server components fetch from the API (`app/agents`, `app/buy`, `app/property/[id]`, home page grids). The API proxies to Agentbox, applies rate limiting (20 req/5s + 4 concurrent), caches responses in-memory (5 min TTL for property/staff, 24h for lookups), and normalizes Agentbox's `{response: {<resource>: [...]}}` envelope into flat `{items, pagination}`.

**Write paths.** Frontend client components (contact form, property enquiry modal, appraisal flow) POST to `api/leads/*`, which POSTs to `Agentbox /enquiries`. Each enquiry embeds `attachedContact` so Agentbox matches an existing contact by email/mobile or creates one — no separate `/contacts` call needed.

**Appraisals.** The digital appraisal flow (`/property-report-digital-appraisal` and `/rental-report-digital-appraisal`) still uses the third-party **LeadPlus DPR** widget for the "9-second estimate." When the user submits the name/email form, we POST a Vendor/Tenant enquiry to Agentbox so agents get the lead in their inbox. Address travels between steps via a `?a=` URL parameter.

## Endpoints

**Public (frontend):**
| Route | Purpose |
|---|---|
| `GET /` | Home |
| `GET /buy?suburb=&type=` | Listings grid |
| `GET /property/[id]` | Listing detail |
| `GET /agents` | Staff |
| `GET /about`, `/contact` | Static-ish pages |
| `GET /property-report-digital-appraisal`, `/rental-report-digital-appraisal` | Appraisal flow entries |

**Internal (API):**
| Method | Path | Notes |
|---|---|---|
| GET | `/health` | Verifies Agentbox reachability |
| GET | `/offices`, `/offices/:id` | Offices |
| GET | `/staff?officeId=` | Staff (defaults to `BLUE_RIBBON_OFFICE_ID`) |
| GET | `/properties?type=&suburb=&minBedrooms=&page=&limit=` | Listings |
| GET | `/properties/:id` | Listing detail |
| GET | `/suburbs?state=NSW&q=` | Suburb list |
| GET | `/lookups` | Bundles enquiry types/sources/interest levels + contact classes/sources + property types + regions (cached 24h) |
| POST | `/leads/contact` | General contact form |
| POST | `/leads/enquiry` | Property enquiry (requires `listingId`) |
| POST | `/leads/appraisal` | Digital appraisal request |

## Deployment (production)

**Prod server:** `187.124.212.156` (whitelisted with Reapit for outbound to `api.agentboxcrm.com.au`).

Both `api/` and `frontend/` must egress from a whitelisted IP. Serverless platforms with dynamic egress IPs (Vercel/Netlify) will not work unless proxied through a static IP.

Suggested deploy target: run both on the prod server, `nginx` reverse proxy → `frontend` on `:3000`, `/api/*` → `api` on `:4000`. Use `pm2` or a systemd unit for process supervision. Set env vars via the server's `.env` files (mode 600, owned by the service user).

Before going live:
1. Get **production** Agentbox credentials from Reapit — sandbox will not have Blue Ribbon's real data. Pay the $1000 setup fee and sign the integration agreement.
2. Discover the production Blue Ribbon office ID via `GET /offices` and update `BLUE_RIBBON_OFFICE_ID` in `api/.env`.
3. Point `NEXT_PUBLIC_API_URL` at the production API URL.
4. Update `CORS_ORIGIN` in `api/.env` to the production frontend origin.
5. Confirm the LeadPlus DPR `cid` (currently `943` in `frontend/app/_components/reports/DprReport.tsx`) is the correct Blue Ribbon Client ID.

## Known gaps / TODOs

- Property images come back `null` from the sandbox — the `include=media` parameter didn't populate media on the test listings. Real Agentbox instances almost always have photos; the mapper already handles the shape (`media.items[].url`). Verify against a listing that has photos in prod and adjust `extractImages` in `api/src/routes/properties.ts` if the field name differs.
- The property detail page shows a placeholder "Blue Ribbon Agent" instead of the actual assigned agent because the sandbox `/listings/{id}?include=listingContact` didn't return that data. Wire this once the shape is confirmed.
- `PropertySearchBar` (desktop on `/buy`) and the mobile filter chips on `/buy` are not wired — the hero search **is** wired. Extend `frontend/app/buy/page.tsx` searchParams to accept the extra filters when the UI is wired.
- Pagination on `/buy` shows numbers but clicking them doesn't yet change the page — wire pages via `?page=N` (the API already supports it).

## Contacts

- Agentbox / Reapit Sales: `platformservices@reapit.com`
- Integration/partnership: `partner@reapitsales.com.au`
- Reapit rate limit: 20 req / 5s per API key, ~4 concurrent (enforced client-side)
