# MOWSIL

**Premier agrégateur de location de voitures de confiance à Oujda — transparent, local, instantané.**

MOWSIL connects travelers with local car rental agencies in Oujda, Morocco. No online payment. You pay directly at the agency.

Stack: Next.js 16.2.9 (Turbopack) · Supabase (PostgreSQL) · Resend (emails) · next-intl (i18n) · Tailwind v4 · Zod v4

---

## Requirements

- Node.js ≥ 20
- npm ≥ 10
- Supabase project
- Resend API key (for transactional emails)
- Vercel account (for deployment + cron)

## Environment variables

Copy `.env.local.example` to `.env.local`:

```env
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Resend (required for emails)
RESEND_API_KEY=re_xxxxxxxxxxxx

# Base URL (required for admin logout redirect, QR stickers, sitemap)
NEXT_PUBLIC_BASE_URL=https://mowsil.vercel.app
```

## Quick start

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Build

```bash
npm run build
npm start
```

## Database

Migrations are in `supabase/migrations/`. Apply via Supabase dashboard SQL editor.

Key tables: `agencies`, `vehicles`, `bookings`, `profiles`.

### RLS policies
- `agencies`: owner can read/write own records
- `vehicles`: agency can manage own fleet, public can read available
- `bookings`: agency can read own booking requests, client read by email

## Cron

Booking expiry runs every 5 minutes via Vercel Cron Jobs:

```json
{
  "cron": [{
    "path": "/api/cron/expire-bookings",
    "schedule": "*/5 * * * *"
  }]
}
```

The function calls `expire_stale_bookings()` RPC which sets `status = 'expiree'` and `is_available = true` on expired bookings (`en_attente` + `expires_at < now()`).

## Project structure

```
src/
├── actions/          # Server Actions (booking, auth, admin, agency)
├── app/
│   ├── [locale]/     # Public routes with i18n (fr|ar|en)
│   │   ├── agence/   # Agency dashboard, login, fleet, requests
│   │   ├── dashboard/ # Client booking history
│   │   ├── reservation/ # Booking flow + success page
│   │   └── (legal)/  # Mentions légales, CGU, confidentialité
│   ├── admin/        # Admin console (guarded)
│   │   └── (guarded)/
│   │       ├── dashboard/     # Stats overview
│   │       ├── agencies/      # Manage agency approvals
│   │       ├── bookings/      # View all bookings
│   │       ├── reconciliation/ # Monthly reconciliation + CSV export
│   │       └── qr-stickers/   # QR code sticker generator
│   └── api/          # Route handlers (cron, admin-logout)
├── components/       # Shared UI components (card, button, badge, etc.)
├── config/           # Site config (locales, URLs)
├── emails/           # React Email templates (confirmation, code, receipt, agency notification)
├── i18n/             # next-intl routing + request config
├── lib/              # Utilities (supabase client, email, QR, OUJ code, validation)
└── messages/         # i18n translations (fr.json, ar.json, en.json)
```

## Business rules (§12.6)

- **Age ≥ 21**: validated client-side and server-side at booking creation
- **License ≥ 1 year**: validated server-side at booking creation
- **Anti-double-booking**: checked before insert + overlapping booking detection on accept
- **2-hour expiry**: booking auto-expires if agency doesn't respond within 2 hours
- **Code format**: OUJ-XXXX-XX (strict, generated server-side)
- **Vehicle availability**: `is_available = false` on booking creation, `true` on completion/expiry

## Launch checklist

| Item | Status |
|---|---|
| Supabase project created with migrations applied | ✅ |
| RLS policies enabled | ✅ |
| Resend API key configured | ✅ |
| Domain configured in Vercel | ⬜ |
| RESEND_DOMAIN DNS verified | ⬜ |
| Email "from" domain whitelisted in Resend | ⬜ |
| SMTP test sent and received | ⬜ |
| Cron job verified (booking expiry) | ✅ |
| WhatsApp business number active | ⬜ |
| Footer "Droit à l'oubli" mailto working | ✅ |
| Legal pages (mentions légales, CGU, confidentialité) | ✅ |
| QR stickers print test | ⬜ |
| Admin reconciliation test | ⬜ |
| E2E: client books → agency confirms → activation | ⬜ |
| E2E: client books → 2h expiry | ⬜ |
| E2E: agency registration → admin approval | ⬜ |
| Analytics (Plausible / Vercel Analytics) | ⬜ |
| Error monitoring (Sentry or similar) | ⬜ |

## Tone & lexicon (§17, §24)

- **Professional, reassuring, transparent** — never casual
- **"code de retrait"** (pickup code), never "code promo" or "code"
- **"réservation"** (booking), never "order" or "commande"
- **"agence"** (agency), never "partner" / "fournisseur" in UI
- **"DH"** (dirhams), never "MAD" or "€"
- **"Oujda"** always explicit — local SEO anchor
- Error messages: factual, solution-oriented, no blame

## i18n

Three locales: `fr` (default), `ar`, `en`.

Messages are in `messages/{locale}.json`. The locale is detected via `as-needed` prefix (fr: `/page`, ar: `/ar/page`, en: `/en/page`).

## Deployment

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy
5. Configure domain + Resend DNS
6. Test cron: `GET /api/cron/expire-bookings` (POST)
7. Verify sitemap: `GET /sitemap.xml`
8. Verify robots: `GET /robots.txt`

## License

Proprietary — MOWSIL SARL, Oujda, Maroc.
