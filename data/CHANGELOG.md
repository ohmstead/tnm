# Staging data changelog

Every change to a staging rule belongs here, so a reviewer can see what moved
and when. Cite the source for each change.

## 2026-08-12 — first bundled survival figures

No staging rule or category definition changed. One survival **endpoint** was
corrected, because the figure that was actually available reports a different
one from what the entry claimed.

- Bundled three figures: `oropharynx-hpv-clinical.png` (O'Sullivan 2016 ICON-S,
  *Lancet Oncol* 17(4):440-451, Figure 3 AHR-New stage panels),
  `oropharynx-hpv-pathological.png` (Ho 2025, *Lancet Oncol* 26(8), Figure 3
  panels A-C), and `cutaneous.png` (Karia 2018, *JAMA Dermatol*
  154(2):175-181, Figure panel D). Every other site still renders the citation
  card only.
- **`cutaneous.endpoint` corrected from "Disease-specific survival" to "Overall
  survival."** The bundled image is panel D of the Karia figure, whose y-axis is
  overall survival probability. Disease-specific death appears in panel C of the
  same figure, but as a cumulative *incidence* curve, not a survival curve.
  Labelling panel D as DSS would have misreported the endpoint on the result
  screen. Source: `assets/survival/papers/jamadermatology_karia_2017_oi_170055.pdf`.
- Added the Karia cohort (680 tumours in 459 patients, 2000-2009) and a note
  that this figure stratifies by **T category, not stage group** — the paper
  validates the 8th edition T classification. The result card is headed
  "Survival — stage X", so without that note the curves read as stage curves.
- Recorded the exact figure number for each of the three, replacing the previous
  generic descriptions.
- Added a `paperFile` field pointing at a local PDF of each source paper under
  `assets/survival/papers/`, emitted into `REVIEW.md`, so the endpoint and
  cohort can be re-verified against the paper later.
- `oral-cavity.png` is present in `assets/survival/` but is deliberately **not**
  committed and not wired up, so the `oral-cavity` entry is unchanged and that
  site still renders the citation card only. The figure's numbers-at-risk table
  totals 1788 patients, which is inconsistent with the NCDB observed-survival
  source that entry cites, and the figure's title is cropped off. Attempts to
  identify it against the source deck and the validation literature failed.
  `assets/survival/README.md` records the evidence so the search can resume
  without repeating it. **The entry's existing NCDB/Lydiatt citation should be
  treated as unverified for figure-sourcing purposes** — it remains the cited
  basis for that site's stage-group survival claim, which is unchanged here.

## 2026-08-09 — display labels and picker order

No staging rule, category definition, or citation changed.

- Shortened chapter titles so each fits one line in the picker. The `id` of
  every site is unchanged, so existing shared URLs still resolve.
  - "Oropharynx — HPV-associated (p16+)" → **"Oropharynx — p16+ (HPV-associated)"**
  - "Oropharynx — p16-negative" → **"Oropharynx — p16-"**
  - "Salivary Glands (major and minor)" → **"Salivary Glands"**
  - "Cutaneous Carcinoma of the Head and Neck" → **"Cutaneous Carcinoma"**
  - "Mucosal Melanoma of the Head and Neck" → **"Mucosal Melanoma"**

  The dropped qualifiers were scope statements, not staging content; the full
  scope of each chapter is still stated in its citations and notes.
- Reordered `SITES` into teaching order rather than "Version 9 chapters first".
  Mucosal melanoma was not in the requested order and sits last.
- `formatTNM` now leads with the c/p prefix once (`cT4aN2bM0`) instead of
  prefixing every axis. A pathological M0 is the exception and still prints
  separately as `pT4aN2b cM0`, because AJCC defines no pM0 category and a
  leading `p` would assert one.
- Removed the per-result edition banner from the result screen. The edition is
  still on the site badge and in the Sources card.
- Removed every user-visible reference to the source deck (`HN_staging.pptx`).
  The "As provided in the source deck" citation is no longer rendered; the
  `citations.asProvided` data and this changelog keep the provenance. Three
  prose strings were reworded to drop the deck while keeping their content:
  - Oral cavity note on the T2 correction — now framed as the pre-correction
    wording still in wide circulation, with the same corrected AJCC rule and
    the same practical consequence (≤2 cm with DOI >10 mm is T2, not T3).
  - Larynx `sourcingNote` — now just states what the content was verified
    against.
  - Cutaneous `stageGroupCaveat` — "a secondary reference" instead of naming
    the slide. The caveat itself is unchanged.

## 2026-08-09 — initial

Pinned to the [AJCC Current Staging System table, revised 2026](https://www.facs.org/media/c5ik5tkr/ajcc-current-staging-system-2026.pdf).

**Version 9 chapters (3):**
- Salivary glands — v9, effective 2026-01-01
- Nasopharynx — v9, effective 2025-01-01
- Oropharynx, HPV-associated — v9, effective 2026-01-01

**8th edition chapters (9):** cervical nodes/unknown primary, oral cavity,
oropharynx p16−, hypopharynx, sinonasal, larynx, mucosal melanoma, cutaneous
carcinoma, thyroid (differentiated/anaplastic and medullary).

**Deviations from the supplied source deck, with reasons:**
- *Oral cavity T2.* The deck prints "≤2 cm with 5 mm < DOI ≤ 10 mm". AJCC
  published a correction removing the upper bound: "Tumour ≤2 cm with DOI
  >5 mm". NCI PDQ uses the corrected wording. This app follows the correction,
  so a ≤2 cm tumour with DOI >10 mm is **T2**, not T3.
- *Larynx source.* The deck linked an unofficial PDF mirror (dl.icdst.org).
  Not cited; content verified against NCI PDQ and the AJCC staging form.
- *Oropharynx p16− source.* The deck linked a trade publication
  (cancernetwork.com). Retained only as an "as provided" reference; content
  cited to AJCC 8e and NCI PDQ.
- *Cutaneous stage IVA/IVB.* Follows the deck's reference; could not be
  confirmed against a primary AJCC source. Flagged in the app and in REVIEW.md.

## When AJCC publishes a new version

1. Check the AJCC current-staging-system table for the new effective date.
2. Update the site module's `edition` block and rules, citing the new protocol
   and its validation paper.
3. Update `AJCC_REFERENCE.checked` in `data/sites.js`.
4. Add golden cases from the new stage-group table to `test/selftest.js`.
5. `node test/selftest.js` must pass, then `node test/make-review.js > REVIEW.md`.
6. Bump `CACHE` in `sw.js`.
