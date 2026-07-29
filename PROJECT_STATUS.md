# Blue Ribbon — Reapit/Agentbox Integration Status

Last updated: 2026-07-29

Live site: `blueribbonrealestate.com.au` / `blueribbonre.com.au`
Server: `187.124.212.156` (Hostinger KVM 4, Ubuntu 24.04, **UK–Manchester**)
Agency ID: **`BRB04`**

---

## 1. How it works

Reapit does **not** provide a REST API. Agentbox **pushes** REAXML files to us over
SFTP. We are treated as a *portal* — the same category as realestate.com.au — which
is why the feed is multi-tenant and every query filters on `agentID`.

```
Agentbox ──SFTP push──▶ /srv/reapit-feed/var/www/html/   (inside a chroot)
                                │
                        ingest worker (systemd timer, every 2 min)
                        parse REAXML → filter BRB04 → upsert
                        download images → /srv/blueribbon/media
                                │
                             MongoDB
                                │
                        Next.js 16 (pm2, port 3000) ← nginx :443
```

Files arrive **only when a listing is created or updated**, in batches of up to
10 minutes.

---

## 2. What is done

### Server (live on the VPS)

| Item | Detail |
|---|---|
| Feed account chrooted | `deploy` user jailed to `/srv/reapit-feed`, `nologin` shell, removed from `www-data` |
| Feed relocated out of web root | Was `/var/www/html`. The chroot makes that path resolve *inside* the jail, so **Reapit needed no reconfiguration** |
| MongoDB 8.0 | `127.0.0.1` only, auth enforced, WiredTiger cache capped at 2 GB |
| Swap | 2 GB, `swappiness=10` |
| SSH hardened | `PermitRootLogin prohibit-password`, `PasswordAuthentication no`, `MaxAuthTries 4`. Feed account exempted via its own `Match` block |
| fail2ban | Active, 5 tries / 1 h ban |
| Backups | `blueribbon-backup.timer`, nightly 03:00, 14-day retention, **restore-tested** |
| Health checks | `blueribbon-health.timer`, hourly — feed staleness, parse failures, dead services, stuck images |
| nginx | Serves `/media/` from disk with 30-day immutable cache |

### Application

| Item | File |
|---|---|
| REAXML parser | [lib/reaxml/parse.ts](lib/reaxml/parse.ts) |
| Zod schema | [lib/reaxml/schema.ts](lib/reaxml/schema.ts) |
| Date handling (non-ISO, Sydney→UTC) | [lib/reaxml/date.ts](lib/reaxml/date.ts) |
| Amenity labels | [lib/reaxml/amenities.ts](lib/reaxml/amenities.ts) |
| Mongo connection + indexes | [lib/db/mongo.ts](lib/db/mongo.ts), [lib/db/collections.ts](lib/db/collections.ts) |
| Public query layer | [lib/db/queries.ts](lib/db/queries.ts) |
| Ingest worker | [services/ingest/](services/ingest/) |
| Agent profiles (photos/roles) | [lib/agents/profiles.ts](lib/agents/profiles.ts) |

### Pages wired to real data

- `/` — latest listings (streamed via Suspense)
- `/buy`, `/rent` — filters, sort, pagination, suburb chips
- `/buy/[suburb]`, `/rent/[suburb]` — SEO landing pages, 404 on unknown/empty suburb
- `/property/[id]` — accepts slug **or** `uniqueID`; 404s if sold/hidden
- `/agents` — built from feed data
- `/sitemap.xml`, `/robots.txt`

### Behaviour worth knowing

- **`modTime` guard** — an older file can never overwrite newer data.
- **Image state is carried across updates** — re-delivery of an unchanged listing
  downloads nothing. Verified: same file twice = `written=0 stale=2`, 0 downloads.
- **Images are self-hosted.** Hotlinking `agentboxcdn.com.au` gets the feed
  disabled. `primaryImage()` falls back to a placeholder, **never** to the CDN URL.
- **`isPublic` ≠ `status`.** Agentbox also gates on `hiddenListing` and
  `OffMarketListing`; reading status alone would publish hidden listings.
- **Failed files move to `failed/`, never deleted** — they're the only evidence of
  what was actually sent.

---

## 3. What data the feed sends

Sample: `BRB04_2026-07-29-15-00-09.xml` — 2 rentals, 22.9 KB.

**Legend:** ✅ stored + displayed · 📦 stored, not displayed · ⬜ empty in our data

### Document structure

```xml
<propertyList date="…" username="…" password="…">   ← SFTP credentials, STRIPPED on parse
  <rental modTime="2026-07-29-14:49:47" status="current">   ← root element = category
```

> Every delivered file carries the SFTP username and password as plaintext
> attributes on `<propertyList>`. The parser never persists them. Do not paste
> real feed files into tickets, chat, or this repo.

Root element determines category: `residential`, `rental`, `land`, `rural`,
`commercial`, `commercialLand`, `business`, `holidayRental`, `project`.

`status`: `current`, `withdrawn`, `offmarket`, `sold`, `leased`, `deleted`.
**Removal is a status change, not a deleted file.**

### Fields

| Element | Status | Notes |
|---|---|---|
| `agentID` | ✅ | `BRB04` — every query filters on it |
| `uniqueID` | ✅ | e.g. `1P0271` — our Mongo `_id` |
| `modTime` | ✅ | Format `YYYY-MM-DD-HH:MM:SS`, **not ISO**, Sydney local |
| `headline`, `description` | ✅ | |
| `address` | ✅ | `streetNumber`, `street`, `suburb`, `state`, `postcode`, `country`. `display="no"` hides the street address |
| `category name` | ✅ | "House", "Studio" → property type |
| `price` / `rent` | ✅ | `@period="weekly"`, `@display`. `display="no"` = do not publish the number |
| `priceView` | ✅ | Agency's own wording, e.g. "$400 pw" |
| `bond` | ✅ | Rentals |
| `dateAvailable` | ✅ | Date-only, parsed as Sydney midnight |
| `features` (counts) | ✅ | `bedrooms`, `bathrooms`, `ensuite`, `toilets`, `livingAreas`, `garages`, `carports`, `openSpaces` |
| `features` (flags) | ✅ | ~35 `0`/`1` amenities. Discovered dynamically — new ones work without a code change |
| `otherFeatures` | ✅ | Comma-separated free text |
| `landDetails`, `buildingDetails` | ✅ | `area@unit`, `frontage` |
| `listingAgent` | ✅ | `name`, `email`, `telephone@type="mobile"/"BH"`. Empty slots 3–4 filtered out |
| `objects/img` | ✅ | `@url`, `@modTime`, `@id` (`m`=main, then a,b,c…), `@recordId`, `@format`. Empty placeholder slots filtered |
| `objects/floorplan` | ✅ | Same shape |
| `videoLink@href` | ✅ | |
| `extraFields geoLat/geoLong` | ✅ | **Coordinates supplied — no geocoding needed** |
| `extraFields regionName` | ✅ | "Western Sydney" |
| `extraFields hiddenListing` | ✅ | Gates `isPublic` |
| `extraFields OffMarketListing` | ✅ | Gates `isPublic` |
| `extraFields streetAddress` | ✅ | |
| `exclusivity@value` | 📦 | "exclusive" — internal, not public-facing |
| `externalLink@href` | 📦 | rent.com.au / YouTube links |
| `allowances` | 📦 | `furnished`, `petFriendly`, `smokers` — filter exists, data empty |
| `ecoFriendly` | 📦 | `solarPanels`, `waterTank`, `solarHotWater`, `greyWaterSystem` |
| `soldDetails` | ⬜ | Sold price + date. **Unlocks a "Recently sold" page** once sold stock flows |
| `inspectionTimes` | ⬜ | Open homes. **Agency must enter these in Agentbox** |
| `councilRates`, `waterRates`, `strataAdmin`, `strataSinking`, `landTax`, `otherOutgoings` | ⬜ | Buyer cost breakdown — agency data entry |
| `energyRating`, `levelNumber`, `externalArea`, `propertyName`, `leaseDetails`, `holidayGuests` | ⬜ | Agency data entry |

> Everything not modelled is kept verbatim in `listing.raw`, so new fields can be
> derived later without asking Reapit to resend anything.

### Current contents

**2 rental listings. No sales stock.** See §4.

---

## 4. What remains

### Blocking launch

**Request a full re-export.** Email `support@agentbox.com.au`, quote Agency ID
**BRB04**, ask for a full re-export of all listings. The feed only fires on
create/update, so existing listings will otherwise **never arrive** and the site
launches with two rentals.

Also tell the **property management team**, not just sales, to tick *Export to
Portals* (bottom of the General tab) — otherwise rentals silently never appear and
it looks like a bug in our code.

### Needs a decision

| Item | Why it matters |
|---|---|
| **Deploy to live** | Site still serves hardcoded mock data. Deploying now shows 2 rentals + empty Buy page |
| **Commit to git** | All work is uncommitted on `backup/pre-agentbox-integration` |
| **Server code vs git** | `/srv/blueribbon/ingest` and `/srv/blueribbon/web-preview` are scp'd copies, not checkouts. A `git pull` won't update them |
| **Offsite backups** | Backups sit on the same disk they protect. Needs a destination |
| **301 redirects** | Needs the old site's URL map — try Wayback CDX API and Google Search Console. Prioritise static pages; old listing URLs matter less |
| **Setup fee** | Reapit's email left the amount as an internal placeholder. Unknown who pays |
| **Agent photos + roles** | Only one headshot exists. Ritu Chopra renders initials. Roles were inferred — confirm |
| **Server location** | UK — ~280 ms to Sydney, and vendor PII stored offshore (APP 8). Decision was to stay; Cloudflare's free tier would recover most of the latency |
| **Pending kernel reboot** | Restarts the live site |

### Next features

1. **Recently sold page** — needs the backfill
2. **Inspection times** — needs Agentbox data entry
3. Rates/outgoings display — needs Agentbox data entry
4. Enquiry form → email/CRM

---

## 5. Local development

MongoDB lives on the VPS bound to localhost. Reach it through a tunnel — **port
27018**, because a local mongod may already hold 27017 (if it does, `ssh` silently
binds IPv6 only and you query the wrong database):

```bash
ssh -N -L 27018:127.0.0.1:27017 root@187.124.212.156
```

`.env.local` (gitignored) needs:

```
MONGODB_URI=mongodb://blueribbon:<password>@127.0.0.1:27018/blueribbon?authSource=blueribbon
MONGODB_DB=blueribbon
REAPIT_AGENT_ID=BRB04
NEXT_PUBLIC_MEDIA_ORIGIN=https://blueribbonrealestate.com.au
```

The password is in `/root/.blueribbon-secrets` on the server (chmod 600).
`NEXT_PUBLIC_MEDIA_ORIGIN` must be **empty in production** — images are same-origin
there.

```bash
npx tsx --env-file=.env.local scripts/check-db.ts   # verify connection
npx tsx scripts/test-parse.ts <file.xml>            # test a REAXML file
yarn dev
```

---

## 6. Operations

```bash
systemctl list-timers blueribbon-*        # ingest / health / backup
journalctl -u blueribbon-ingest -f        # ingest log
/usr/local/bin/br-healthcheck.sh          # exit 0 = healthy
ls /srv/reapit-feed/failed/               # parse failures
```

Mongo `ingest_runs` holds 90 days of per-file history.

**If the feed stops:** check `journalctl -u blueribbon-ingest`, then
`/srv/reapit-feed/var/www/html/` for undelivered files, then whether the `deploy`
SFTP account still authenticates. The health check catches a 24-hour silence.

### Known hazards

- **`Match` blocks in sshd run to end-of-file.** The hardening file is numbered
  `10-` so it parses *before* `98-reapit-sftp.conf`. Put globals after a `Match`
  and they apply only to that user — this broke the feed once.
- **The feed password is inside every delivered file** (`<propertyList password=…>`).
  Rotating it requires a Reapit round-trip; the chroot limits the blast radius.
- **Never render `sourceUrl`.** Serving an Agentbox CDN URL is hotlinking and gets
  the feed disabled.
