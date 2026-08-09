# H&N TNM Staging Trainer (AJCC)

A fast, mobile-first web app for learning AJCC head and neck cancer staging.
Pick a site, answer a short chain of radio questions, get the prognostic stage
with the rule that produced it and the sources behind it.

> **Educational use only.** This is a study aid for learning AJCC staging rules.
> It is not a clinical decision support system and must not be used to stage a
> real patient. Always confirm against the current AJCC Cancer Staging Manual.

## What it covers

All 11 AJCC head and neck chapters plus thyroid — 12 selectable sites.

As of the [AJCC current staging system table, revised 2026](https://www.facs.org/media/c5ik5tkr/ajcc-current-staging-system-2026.pdf),
**three head and neck chapters have moved to Version 9** and the rest are still
8th edition. The app labels every site with its edition, because assuming the
wrong one is the most common staging error right now.

| Version 9 | Effective |
|---|---|
| Nasopharynx (ch. 9) | 1 Jan 2025 |
| Salivary glands (ch. 8) | 1 Jan 2026 |
| Oropharynx, HPV-associated (ch. 10) | 1 Jan 2026 |

Everything else — oral cavity, oropharynx p16−, hypopharynx, larynx, sinonasal,
cervical nodes/unknown primary, mucosal melanoma, cutaneous carcinoma, thyroid —
remains 8th edition.

## Clinical vs pathological staging

The app models c/p divergence at three levels, because the labels alone hide it:

- **Oropharynx p16+ (v9)** — different N definitions *and* different stage-group
  tables. The clinical table is unchanged from the 8th edition, but the cN
  categories feeding it were redefined around imaging-detected ENE. Same stage
  labels, different meaning.
- **Oral cavity, larynx, hypopharynx, oropharynx p16−, sinonasal, cutaneous
  (8e)** — one shared stage table, but different N definitions. When the same
  findings give a different clinical and pathological stage, the app shows both
  side by side and names the reason.
- **Salivary (v9), nasopharynx (v9), thyroid, mucosal melanoma** — identical, so
  no toggle is shown and no tap is wasted.

## Trusting the data

Every T, N, M and stage-group rule carries two citations: the AJCC chapter and
version, and a peer-reviewed publication. `REVIEW.md` prints all of them in a
form a clinician can check against the manual without reading any code — it is
generated from the same modules the app imports, so it cannot drift.

The data is audited by construction:

```bash
node test/selftest.js
```

- **Coverage** — for every site, basis, and reachable combination of
  pre-question answers × T × N × M, exactly one stage rule must match. Zero
  matches means a transcription gap; two conflicting matches means an
  order-dependent answer. ~1,900 combinations.
- **Derivation** — every reachable set of question answers must resolve to a
  category. A student can never answer everything and be told nothing.
- **Golden cases** — worked examples taken from AJCC's own published material
  and from every coloured cell of the stage-group grids in the source deck.
- **Citations** — the build fails if any rule lacks a source.

CI runs this on every push and blocks deployment on failure.

### Known deviations from the source deck

Recorded with reasons in [`data/CHANGELOG.md`](data/CHANGELOG.md). The
consequential one: AJCC published a correction to the oral cavity T categories
removing the upper DOI bound from T2, so a ≤2 cm tumour with DOI >10 mm is
**T2** here, not T3.

## Survival figures

`data/survival.js` names, per site, the paper and figure whose Kaplan-Meier
curves belong with that staging system, the endpoint it reports (OS, DSS and RFS
are not interchangeable and are never conflated), and published estimates where
available.

Published figures are copyrighted and are **not** redistributed here. Drop your
own copies into `assets/survival/` using the naming convention in
[`assets/survival/README.md`](assets/survival/README.md) and they appear
automatically. Until then the app shows a citation card with the published
estimate and a link to the source figure.

## Running locally

No build step, no dependencies. Any static server works:

```bash
python3 -m http.server 8777
```

Then open <http://localhost:8777>. Node 20+ is needed only for the tests.

## Hosting — GitHub Pages, $0/yr

The app is entirely static: all staging logic runs client-side, with no server,
database or API. At ~20 users/day it uses roughly **0.6 GB/month** against a
100 GB soft limit.

1. Push this repo to GitHub (public).
2. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
3. Push to `main`. [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
   runs the audit, checks `REVIEW.md` is current, and deploys only if both pass.

HTTPS and CDN are automatic. A custom domain is free to configure (you'd pay
only for the domain, ~$10–15/yr). `.nojekyll` is present so Jekyll does not
mangle the paths.

The app also registers a network-first service worker, so it keeps working
offline on a phone — but always fetches fresh data when there is a connection,
so a published correction reaches students immediately rather than after a cache
expiry.

## Updating when AJCC publishes a new version

The checklist is in [`data/CHANGELOG.md`](data/CHANGELOG.md).

## Layout

```
index.html          single page, inline critical CSS, light + dark
app.js              router, question flow, rendering
engine.js           rule evaluation — knows nothing about any cancer
data/
  sites.js          site registry
  common.js         shared AJCC 8e nodal schemes and stage-group table
  sites/*.js        one declarative module per site
  survival.js       survival figure references and published estimates
  CHANGELOG.md      every staging-rule change, with sources
test/
  selftest.js       exhaustive audit
  make-review.js    generates REVIEW.md
assets/survival/    figure images (not bundled)
```
