# Mango Mandi

An AI-powered mango marketplace — built to replace the WhatsApp-based sales process I run every summer on my family farm.

**Live demo:** https://mango-mandi-theta.vercel.app

> **Portfolio/demo project.** Checkout is simulated — no real payments are processed and no real customer data is collected.

---

## The problem

Every mango season I manually message hundreds of contacts on WhatsApp to sell the farm's harvest. Each sale means individually telling people what varieties are available, negotiating price, tracking who has paid, and following up on delivery status — all inside a chat thread. There is no way to reach customers outside my contact list or across cities, and the whole process needs to be repeated from scratch the next season.

## The solution

A full-stack web app that puts the farm's product catalog online, lets customers browse and order without needing to be in anyone's contact list, and uses a real AI model trained on farm photos to grade mangoes by quality — removing the manual sorting step when adding new stock.

---

## Features

- **Product catalog** — browse mango varieties with grade badges (Premium / A / B / Unripe), prices, and stock levels
- **Cart + checkout** — add items, adjust quantities, and complete a simulated checkout flow that saves orders to the database
- **Unripe category** — raw mangoes sold for pickling or home-ripening, with a "ripens in 3–5 days" note on each card
- **AI mango grader** — upload a photo in the admin panel and the ML service auto-predicts the grade with a confidence percentage; override manually if needed
- **Admin panel** — password-protected dashboard to add products (with image upload), view all orders, and manage inventory

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend + Backend | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Database / Auth / Storage | Supabase (Postgres + Row Level Security + Storage) |
| ML Service | Python · FastAPI · PyTorch · MobileNetV2 (separate repo) |
| Web deployment | Vercel |
| ML deployment | Railway |

---

## Architecture

```
Browser
  │
  ├─▶ Next.js (Vercel)
  │     ├─▶ Supabase — product catalog, orders, auth, image storage
  │     └─▶ /api/grade proxy
  │               │
  │               └─▶ FastAPI on Railway
  │                     └─▶ MobileNetV2 model
  │                           └─▶ { grade, confidence }
  │
  └─▶ Admin panel
        └── upload photo → grade auto-fills → save product
```

The Next.js app is the single backend entry point. It talks to Supabase for all data, auth, and image storage. When an admin uploads a mango photo, Next.js forwards it to the Railway ML service via the `/api/grade` proxy route. The FastAPI service runs a MobileNetV2 model fine-tuned on real farm photos and returns a predicted grade (`grade_a`, `grade_b`, `grade_c`, or `unripe`) along with a confidence score. The grade dropdown in the admin form auto-fills with the prediction; the admin can override it before saving.

Python is kept entirely in the separate ML repo — the Next.js app communicates with it only over HTTP.

---

## Screenshots

> _(Screenshots coming — shop page, product card with Unripe badge, admin form with AI grade prediction, checkout flow)_

---

## Local setup

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project with the schema below
- (Optional) ML service running locally or on Railway

### 1. Clone and install

```bash
git clone https://github.com/Varad1230/mango-mandi.git
cd mango-mandi
npm install
```

### 2. Create `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional — omit if you don't have the ML service running
MANGO_ML_URL=https://your-railway-service.up.railway.app
```

### 3. Set up Supabase

Run this SQL in the Supabase SQL editor:

```sql
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  variety text not null,
  grade text not null,
  price_per_kg numeric not null,
  stock_kg numeric not null,
  image_url text,
  description text,
  created_at timestamptz default now()
);

create table orders (
  id uuid primary key,
  customer_name text not null,
  phone text not null,
  city text not null,
  items jsonb not null,
  total numeric not null,
  status text not null,
  created_at timestamptz default now()
);

-- Allow public read on products
alter table products enable row level security;
create policy "Public read" on products for select using (true);

-- Allow public insert on orders (checkout), no select needed
alter table orders enable row level security;
create policy "Public insert" on orders for insert with check (true);
```

Create a `product-images` storage bucket in Supabase and set it to public.

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Admin panel is at `/admin/login` — create a user in Supabase Auth (Email provider) and use those credentials.

---

## ML service

The AI grading model lives in a separate repo: **https://github.com/Varad1230/mango-ml**

It is a MobileNetV2 classifier fine-tuned on labeled photos from the farm, served via FastAPI. When `MANGO_ML_URL` is set, uploading a photo in the admin form calls the `/grade` endpoint and auto-fills the grade with the predicted result and confidence score. When the env var is unset or the service is unreachable, the form falls back gracefully with a manual-select prompt.

---

## Notes

- **No real payments** — the checkout flow simulates a payment step and saves the order to Supabase with status `demo_order`. This is intentional; the project demonstrates the full UX without requiring a payment gateway.
- **Seeded data** — the live demo runs on sample mango listings. Orders placed on the demo are not real.
- **Real AI** — the ML model is trained on actual labeled photos from the farm. Accuracy numbers and model limitations are documented in the [mango-ml repo](https://github.com/Varad1230/mango-ml).
