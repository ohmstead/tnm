# Survival figures

Drop figure images here and the app picks them up automatically. Until a file
exists, the result screen shows a citation card with the published estimate and
a link to the source figure — the app ships and works with this directory empty.

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
  Redistributing them from a public GitHub Pages site is a licensing decision,
  not a technical one. Options that avoid the problem: link out to the figure
  (the current default), use a figure from an open-access (CC BY) paper, or
  obtain permission. Nothing in this repository redistributes a published
  figure.
- **Keep it legible on a phone.** Target ~1000 px wide, PNG, under ~200 KB.
- **Include the stage labels** in the image itself — the app does not overlay
  them.
