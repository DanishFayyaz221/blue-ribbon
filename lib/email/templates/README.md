# EmailJS setup

The contact form and the property enquiry modal both send **two** emails per
submit:

| | Template | Goes to | On failure |
|---|---|---|---|
| 1 | `notify.html` | the studio inbox | surfaces an error to the visitor |
| 2 | `reply.html` | the visitor | swallowed — see [`../send.ts`](../send.ts) |

Both templates live here as the source of truth. EmailJS stores its own copy,
so **editing a file here changes nothing until it is re-pasted** into the
dashboard.

## Live configuration

| | |
|---|---|
| Account | `enquiries@blueribbonre.com.au` |
| Service | `service_21bzjxq` (Gmail) |
| Notify template | `template_i1dhdd8` — "Studio notification" |
| Reply template | `template_bp1a495` — "Visitor auto-reply" |

Six env vars are required. Until all are set, every submit throws
`"EmailJS is not configured"`:

```
NEXT_PUBLIC_EMAILJS_SERVICE_ID
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
NEXT_PUBLIC_EMAILJS_NOTIFY_TEMPLATE
NEXT_PUBLIC_EMAILJS_REPLY_TEMPLATE
NEXT_PUBLIC_STUDIO_EMAIL
NEXT_PUBLIC_SITE_URL
```

> **`NEXT_PUBLIC_*` is inlined at build time.** Setting these on the production
> server is not enough — the site must be rebuilt afterwards, or the live build
> keeps the old (or empty) values and the forms keep failing.

## Dashboard settings

These cannot be set from code. Getting them wrong is the usual reason an email
never arrives.

### `notify.html` → studio

| Field | Value |
|---|---|
| Subject | `{{form_type}} from {{from_name}}` |
| To Email | `sales@blueribbonre.com.au` |
| Cc | `enquiries@blueribbonre.com.au` |
| From Name | `Blue Ribbon Website` |
| Reply To | `{{reply_to}}` |

`To Email` is a literal address on purpose — the code also sends `{{to_email}}`,
but a fixed address cannot be broken by a missing env var. `Reply To` matters:
it makes *Reply* in the inbox answer the visitor rather than the studio.

### `reply.html` → visitor

| Field | Value |
|---|---|
| Subject | `We've received your enquiry - Blue Ribbon Real Estate` |
| To Email | `{{to_email}}` |
| From Name | `Blue Ribbon Real Estate` |
| Reply To | `sales@blueribbonre.com.au` |

**`To Email` must be `{{to_email}}`.** EmailJS pre-fills it with the account
address; leaving that default sends the visitor's confirmation to the studio and
the visitor receives nothing. This is the single most common failure.

## Editing a template

Content → switch the editor to the **code / `</>` view** → select all → paste.
The visual editor will reformat table markup; the code view is the source of
truth.

## Template variables

EmailJS supports Mustache-style sections, so both templates gate their optional
blocks with `{{#name}}…{{/name}}`. One reply template therefore serves both
forms: a property enquiry renders the photo, price and agent card, while a
contact-page message renders neither instead of showing empty boxes. This
matters because the free plan allows only **2 templates**, so there is no room
for a separate contact-form variant.

### `notify` — from `sendAdminNotification()`

`form_type` · `from_name` · `from_email` · `phone` · `reply_to` · `help_with` ·
`message` · `listing_address` · `listing_image` · `listing_price` ·
`listing_type` · `listing_beds` · `listing_baths` · `listing_cars` ·
`listing_url` · `agent_name`

`message` also carries every other field folded into its body, so nothing is
lost even if the template stops referencing them individually.

### `reply` — from `sendVisitorAutoReply()`

`to_email` · `to_name` · `intro_line` · `help_with` · `message` ·
`listing_address` · `listing_image` · `listing_price` · `listing_type` ·
`listing_beds` · `listing_baths` · `listing_cars` · `agent_name` ·
`agent_phone` · `agent_email` · `agent_image` · `cta_url` · `cta_label`

Gating keys off `listing_address` and `agent_name`, so those must be `undefined`
rather than `""` when absent — an empty string is falsy to the template but the
sender strips empty values anyway.

## Gotchas found the hard way

**Never use `www.`** The TLS certificate covers `blueribbonre.com.au` and
`blueribbonrealestate.com.au` only. Any `https://www.blueribbonrealestate.com.au`
URL fails the handshake, so images silently break and links are dead. This is
why `NEXT_PUBLIC_SITE_URL` has no `www` — and why `app/robots.ts` and
`app/sitemap.ts`, which still default to the `www` host, need attention.

**URLs must not come from `window.location`.** An email is read outside the
browser that composed it. Submitting from localhost would otherwise embed
`http://localhost:3001/...` images and links that no inbox can resolve, which
looks like a broken email rather than a broken dev setup.

**The logo sits on white.** The wordmark is navy + sky blue; on the navy header
it nearly disappears.

**EmailJS parses variables inside HTML comments.** Writing a sample `{{#x}}` in
a documentation comment creates a real phantom parameter in the dashboard.

**The domain allowlist is a paid feature.** On the free plan it cannot be set,
so the public key in the JS bundle is unprotected — anyone who lifts it can
spend the quota.

## Quota

Free plan: **200 emails/month, 2 templates**. Each submit sends two emails, so
roughly **100 enquiries per month** before sends start failing. The durable fix
for both the cap and the exposed key is to move sending server-side, which this
project is already equipped for.

## Previewing without spending quota

`scripts` are not wired for this, but any template can be rendered locally with
a small Mustache-subset substitution to check the design in a browser before
pasting. Test sends from the dashboard consume real quota — use them sparingly.
