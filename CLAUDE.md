# CLAUDE.md

Static, mobile-first web app for learning AJCC head & neck cancer staging.
Students pick a site, answer a few radio questions, and get the prognostic stage
with the rule and citations behind it. **Educational use only — not for clinical
practice.** That disclaimer appears on the landing screen and every result
screen; do not remove it.

## Commands

```bash
node test/selftest.js              # MUST pass (0 failures) before finishing
node test/make-review.js > REVIEW.md   # regenerate after ANY data/ change
python3 -m http.server 8777        # run locally; no build step, no deps
```

CI runs both and blocks deployment on failure, including a check that
`REVIEW.md` matches `data/`.

## Layout

| Path | Role |
|---|---|
| `index.html` | Single page. All CSS lives in one `<style>` block; design tokens are CSS variables at the top, light and dark defined together. |
| `app.js` | Rendering only — `renderPicker`, `renderQuestion`, `renderResult`, and the `*HTML` helpers. Also URL/state serialisation. |
| `flow.js` | Which question comes next. Deliberately DOM-free so the audit can drive the real flow headlessly. |
| `engine.js` | Rule evaluation. Knows nothing about any cancer. |
| `data/sites/*.js` | One declarative module per site. Disease content lives here. |
| `data/common.js` | Shared AJCC 8e nodal schemes and stage-group table (used by 5+ sites). |
| `data/survival.js` | Survival figure references, endpoints, published estimates. |
| `test/selftest.js` | The exhaustive audit. |
| `REVIEW.md` | Generated. Never edit by hand. |

## Boundaries

- **`data/` and `engine.js` are clinical content.** Do not change a staging rule,
  category definition, or citation unless the user explicitly asks and provides
  a source. UI work never needs to touch them.
- **Every rule needs a `source` field.** The audit fails without one.
- **No dependencies, no build step, no framework.** Vanilla ES modules served
  as-is. Don't add npm packages, bundlers, or CDN links (a CDN link would also
  break offline support).
- **`REVIEW.md` is generated** from the same modules the app imports, so it can't
  drift. Regenerate it; don't edit it.

## Non-obvious decisions

Changing any of these without reason will look like a bug fix and be a
regression.

- **Ordered first-match stage rules.** Mirrors how the printed AJCC tables read,
  lets each rule carry its own citation, and makes the exhaustive audit possible.
- **The service worker is network-first, not cache-first.** This app makes
  clinical-teaching claims, so a published correction must reach students
  immediately rather than after a cache expiry. Cache-first was tried and
  rejected. Bump `CACHE` in `sw.js` when data changes.
- **The clinical/pathological toggle is hidden where c and p are identical**
  (salivary v9, nasopharynx, thyroid, mucosal melanoma) — `basisIsMeaningful()`.
  Showing it would spend a tap on a distinction without a difference.
- **`forces` on a category** skips downstream questions: Tis forces N0/M0 because
  carcinoma in situ cannot metastasise and AJCC stages no such combination.
- **`autofill()`** answers any question with exactly one option (unknown primary
  has only T0).
- **Pathological M0 renders as `cM0`** — AJCC defines no pM0 category.
- **The c/p comparison re-resolves the same raw answers under the other basis.**
  It deliberately returns null when the two bases ask different questions (v9
  HPV oropharynx), because there the answers aren't comparable and a comparison
  would mislead.
- **Only 3 of 12 sites are AJCC Version 9** (salivary, nasopharynx, HPV+
  oropharynx). Everything else is 8th edition. The app labels this everywhere
  because assuming the wrong edition is the most common staging error.

## Changing staging data

1. Update the site module, citing both the AJCC chapter/version and a
   peer-reviewed publication.
2. Add golden cases to `test/selftest.js` from the published stage-group table.
3. `node test/selftest.js` → 0 failures.
4. `node test/make-review.js > REVIEW.md`.
5. Record the change and its source in `data/CHANGELOG.md`.
6. Bump `CACHE` in `sw.js`.

Known deviations from the source deck (`HN_staging.pptx`) are documented in
`data/CHANGELOG.md` — most importantly, oral cavity T2 follows AJCC's published
correction (no upper DOI bound), so ≤2 cm with DOI >10 mm is **T2**, not T3.

## Survival figures

Not bundled — published KM figures are copyrighted and nothing here
redistributes one. The app renders a citation card when
`assets/survival/<key>.png` is absent, so it works with that directory empty.
`REVIEW.md` lists the exact paper, figure, and expected filename per site.
