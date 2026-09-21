# Helix Frame & Siding

A marketing site for Helix Frame & Siding, a Denver and Front Range contractor that self-performs framing and siding and schedules a bench of partner trades for the rest of the job.

The copy, crew, reviews, projects, and plan sheets are original sample content in `lib/content.ts`. Swap those records when real names and jobs are ready. Phone and email in that file are sample contact details.

## Run locally

```bash
npm install
npm run dev -- --hostname 0.0.0.0 --port 43123
```

Open [http://127.0.0.1:43123](http://127.0.0.1:43123).

## Design scenes

Each service keeps one finished project in the frame. The controls change that part of the photograph: siding field and gable, deck boards, handrail, and fascia, and the same kind of split for outdoor structures, remodels, additions, and framing. Color tints the masked region. The estimate uses those same controls, and the scope sheet shows the composite with the written spec.

## Forms

Estimate, permit, and contact requests are checked in the browser and return a reference number on the page. That works on GitHub Pages, which only serves the static site.

## GitHub Pages

The live site is [https://milehighpatriot.github.io/helix-frame-siding/](https://milehighpatriot.github.io/helix-frame-siding/). `npm run pages` builds a static export into `docs/`, which is the folder GitHub Pages publishes from `main`.

## Pages

- `/` home
- `/services` and `/services/[slug]`
- `/work` and `/work/[slug]`
- `/blueprints` and `/blueprints/[slug]`
- `/story`, `/team`, `/trades`, `/reviews`
- `/estimates`, `/permits`, `/contact`
