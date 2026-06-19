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
