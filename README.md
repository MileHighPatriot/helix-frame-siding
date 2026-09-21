# Helix Frame & Siding

A marketing site for Helix Frame & Siding, a Denver and Front Range contractor that self-performs framing and siding and schedules a bench of partner trades for the rest of the job.

The copy, crew, reviews, projects, and plan sheets are original sample content in `lib/content.ts`. Swap those records when real names and jobs are ready. Phone and email in that file are sample contact details.

## Run locally

```bash
npm install
npm run dev -- --hostname 0.0.0.0 --port 43123
```

Open [http://127.0.0.1:43123](http://127.0.0.1:43123).

## Forms

Estimate, permit, and contact requests post to Route Handlers, validate with Zod, and return a reference number on the page. Copy `.env.example` to `.env.local` and set `LEAD_WEBHOOK_URL` if those requests should also be forwarded to an inbox or automation. The site does not require that URL.

## Pages

- `/` home
- `/services` and `/services/[slug]`
- `/work` and `/work/[slug]`
- `/blueprints` and `/blueprints/[slug]`
- `/story`, `/team`, `/trades`, `/reviews`
- `/estimates`, `/permits`, `/contact`
