# Project: Mango Mandi — AI-powered mango marketplace demo

## What this is
A portfolio/resume project, not a live business. It solves a real problem
(I sell my farm's mangoes manually over WhatsApp every summer) with a
fully functional web app and a real AI model trained on real mango photos
from my farm. It's deployed as a live demo with seeded sample data — no
real payments, no real customer transactions.

## Tech stack
- Frontend + backend: Next.js (App Router) + TypeScript
- Styling: Tailwind CSS
- Database, auth, image storage: Supabase (Postgres)
- ML service: Python + FastAPI, serving a real trained image classifier
- Checkout: simulated "mock payment" step — no real payment gateway

## Architecture
- Next.js talks to Supabase for data/auth/images.
- A separate Python FastAPI service grades mango photos (variety, grade,
  ripeness) using a model fine-tuned on my own farm photos. Next.js calls
  it over HTTP. Don't mix Python into the Next.js app.

## Scope boundaries (important)
- No real payment gateway. Checkout ends in a "mock payment success" step.
- No real customer data collection — seeded/sample data for the public demo.
- The AI model IS real — trained on real labeled photos, real accuracy
  numbers, real limitations. Don't fake or stub this part.
- Skip production concerns: GDPR, tax/GST handling, payment compliance,
  customer support flows, scaling for real traffic.
- Still deploy a working live demo link — that matters for the portfolio.

## Conventions
- TypeScript everywhere. Functional React components.
- Small components in /components, pages in /app.
- Secrets only in .env.local, never hardcoded, never committed.

## Rules for you (Claude)
- Use plan mode before any change touching schema, auth, or the ML pipeline.
- One feature per change, then stop so I can test and commit.
- Briefly explain non-obvious code — I'm learning full-stack dev.
- Ask before adding a new dependency, and say why.
- Never commit .env.local or any secret.

## Current status — Phase 1 complete

The following is fully built, tested, and committed:

- `/` — homepage with tagline
- `/shop` — product listing, fetches from Supabase `products` table, 8 seeded varieties
- `/cart` — React context cart (`context/CartContext.tsx`), quantity stepper, running total
- `/checkout` — 3-step flow: form → 2 s mock payment spinner → success screen; saves to `orders` table
- `/admin/login` — Supabase email + password auth
- `/admin/products` — list all products + add-product form with image upload to Supabase Storage (`product-images` bucket)
- `/admin/orders` — table of all orders

Deployed to Vercel: https://mango-mandi-theta.vercel.app
GitHub: https://github.com/Varad1230/mango-mandi

**Phase 2 remaining:** Python FastAPI ML service (image grading), wiring AI grade results into the add-product flow.

## Gotchas for future sessions

**Database types** — `types/database.types.ts` must use `type` (not `interface`) and include
`Relationships: []` on every table plus `Views`, `Functions`, `Enums`, `CompositeTypes` at
the schema level. Without these, `@supabase/supabase-js@2.108+` resolves all query results
to `never`. Do not simplify this file.

**Admin redirect loop** — `app/admin/layout.tsx` must NOT call `redirect()`. The middleware
(`middleware.ts`) is the sole auth gatekeeper. The layout conditionally renders bare
`<>{children}</>` when there's no session (login page), and the sidebar shell when
authenticated. Adding a redirect here causes an infinite loop on `/admin/login`.

**Supabase RLS + insert + select** — Never chain `.insert(...).select()` on tables where
the anon key has no SELECT policy. Instead, generate the UUID client-side with
`crypto.randomUUID()`, pass it as `id` in the insert, and skip `.select()`. Learned the
hard way on the orders table.

**Supabase clients — three exist, each with a purpose:**
- `lib/supabase.ts` — anon browser client, used by storefront (shop, cart, checkout)
- `lib/supabase-server.ts` — SSR server client via `@supabase/ssr`, used in server components and admin pages
- `lib/supabase-browser.ts` — browser client via `@supabase/ssr` with cookie support, used in admin client components (login, AddProductForm, LogoutButton)

**CartNav on admin pages** — `components/CartNav.tsx` returns `null` when
`pathname.startsWith('/admin')`. Do not remove this guard or the storefront header will
appear inside the admin shell.

**`next.config.ts`** — has `images.remotePatterns` allowing `*.supabase.co` so uploaded
product images render via Next.js `<Image>`. Don't remove this.
