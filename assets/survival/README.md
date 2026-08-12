# Survival figures

Drop figure images here and the app picks them up automatically. Until a file
exists, the result screen shows a citation card with the published estimate and
a link to the source figure — the app ships and works with this directory empty.

## What is here now

| File | Source | Endpoint | Stratified by |
|---|---|---|---|
| `oropharynx-hpv-clinical.png` | O'Sullivan 2016 (ICON-S), Lancet Oncol — Figure 3, AHR-New stage panels | Overall survival | Clinical stage I / II / III |
| `oropharynx-hpv-pathological.png` | Ho 2025, Lancet Oncol — Figure 3, panels A–C | Overall survival | Pathological stage I / II / III |
| `cutaneous.png` | Karia 2018, JAMA Dermatol — Figure, panel D | Overall survival | **AJCC 8 T category**, not stage group |

Two further files may be present in a working copy but are **deliberately not
committed**, so they will not be in a fresh clone and never reach the deployed
site. Neither is wired to a site, and the app would only load them if a `key` in
`data/survival.js` matched their name:

- `cutaneous_extra.png` — the complete four-panel Karia figure. Panels A–C are
  cumulative incidence of local recurrence, nodal metastasis and
  disease-specific death; only panel D is a survival curve. Kept for context.
- `oral-cavity.png` — a five-stage cumulative survival curve (I, II, III, IVA,
  IVB) over 60 months with a numbers-at-risk table. **Its provenance is not
  established, and the citation currently in `data/survival.js` is very likely
  wrong for it.** Do not wire it to the `oral-cavity` key until the paper is
  identified and the endpoint confirmed.

  What is known, so this is not re-investigated from scratch:

  - The numbers at risk at time 0 total **1788 patients** (I 338, II 349,
    III 346, IVA 452, IVB 303). The `oral-cavity` entry claims **NCDB** observed
    survival; NCDB oral cavity cohorts run to tens of thousands, so this is
    almost certainly a different cohort — probably single- or
    multi-institutional.
  - Approximate 5-year survival read off the curves: I 85%, II 72%, III 73%,
    IVA 51%, IVB 25%. **Stages II and III cross and finish nearly identical** —
    an unusual non-monotonicity, and a useful fingerprint when matching the
    figure to a paper.
  - The figure's title was cropped off above the plot area, so the image cannot
    identify itself.
  - Ruled out: the source deck (`HN_staging.pptx`), whose oral cavity slide
    cites a 2026 *J Korean Soc Radiol* imaging review containing no survival
    curves, and whose only oral cavity images are category tables; and
    Ghantous et al, *Cancers* 2022;14(19):4632 (265 patients, different
    figures).

## Papers

The source PDFs live in `papers/`, so the endpoint, cohort and figure number
recorded in `data/survival.js` can be re-verified without tracking them down
again.

| PDF | Paper |
|---|---|
| `papers/1-s2.0-S1470204515005604-main.pdf` | O'Sullivan B, et al. ICON-S. *Lancet Oncol.* 2016;17(4):440-451. |
| `papers/1-s2.0-S1470204525002815-main.pdf` | Ho AS, et al. AJCC9V pathological staging for HPV+ oropharyngeal carcinoma. *Lancet Oncol.* 2025;26(8). |
| `papers/jamadermatology_karia_2017_oi_170055.pdf` | Karia PS, et al. AJCC 7 vs 8 tumour classification for head & neck cutaneous SCC. *JAMA Dermatol.* 2018;154(2):175-181. |

`REVIEW.md` records the same per-figure provenance, generated from
`data/survival.js` rather than maintained by hand.

## Naming

Use the `key` from `data/survival.js` as the basename, with a `.png` extension:

| File | Site |
|---|---|
| `oropharynx-hpv-clinical.png` | Oropharynx p16+ — clinical stage (AJCC v9) |
| `oropharynx-hpv-pathological.png` | Oropharynx p16+ — pathological stage (AJCC v9) |
| `nasopharynx.png` | Nasopharynx (AJCC v9) |
| `salivary.png` | Salivary glands (AJCC v9) |
| `oral-cavity.png` | Lip and oral cavity |
| `oropharynx-p16neg.png` | Oropharynx p16− |
| `hypopharynx.png` | Hypopharynx |
| `larynx.png` | Larynx |
| `sinonasal.png` | Nasal cavity and paranasal sinuses |
| `cervical-unknown-primary.png` | Cervical nodes and unknown primary |
| `mucosal-melanoma.png` | Mucosal melanoma |
| `cutaneous.png` | Cutaneous carcinoma |
| `thyroid.png` | Thyroid |

`REVIEW.md` lists, for each key, the exact paper and figure to pull, the
endpoint it reports, and the expected file path.

## Before you add a figure

- **Check the endpoint.** These papers do not all report the same thing:
  overall survival, disease-specific survival and recurrence-free survival are
  not interchangeable. `data/survival.js` records the endpoint per site and the
  app displays it. If you substitute a different figure, update that field.
- **Check the licence.** Most of these figures are copyrighted by the publisher.
  Committing one publishes it, because this repository deploys to GitHub Pages
  — that is a licensing decision, not a technical one. Options that avoid the
  problem: link out to the figure, use a figure from an open-access (CC BY)
  paper, or obtain permission. The figures now in this directory were added
  deliberately; the same question applies to every further one.
- **Keep it legible on a phone.** PNG, roughly 700–1200 px wide, under ~200 KB.
  Downscaling further does not help: the card is only ~310 px wide on a 375 px
  phone, so a wide multi-panel figure is unreadable inline no matter its pixel
  count. The result screen therefore links each figure to its own full-size
  file, and the stored image needs enough resolution to reward that tap.
  `pngquant --quality 70-96 --strip` typically cuts a KM figure by 60–75% with
  no visible loss; `sips --resampleWidth 1200` caps the width first if needed.
- **Include the stage labels** in the image itself — the app does not overlay
  them.
