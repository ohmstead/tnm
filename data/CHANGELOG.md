# Staging data changelog

Every change to a staging rule belongs here, so a reviewer can see what moved
and when. Cite the source for each change.

## 2026-08-12 — added soft tissue sarcoma of the head and neck (chapter 40)

New site `sarcoma`, from slide 12 of `HN_staging.pptx`. No existing site changed.

- **Edition:** AJCC 8th edition, effective 2018-01-01. Confirmed still 8th
  edition in the AJCC Current Staging System 2026 table (Part IX, chapter 40).
- **Source and verification:** the deck's four tables (T, N, M, histologic
  grade) were checked word-for-word against the CAP *Protocol for the
  Examination of Specimens From Patients With Soft Tissue Tumors* (Other • Soft
  Tissue 4.0.1.0), which reproduces the AJCC 8e definitions. Exact match,
  including the T4a/T4b split that some secondary summaries omit.
  <https://cap.objects.frb.io/protocols/cp-other-softtissue-17protocol-4010.pdf>
- **Peer-reviewed citations:** Cates JMM, *Head Neck* 2019;41(7):2359-2366
  (doi:10.1002/hed.25701, SEER n=2756) and Lee NCJ et al., *Oral Oncol*
  2021;114:105137 (doi:10.1016/j.oraloncology.2020.105137, SEER n=546).
- **No prognostic stage groups.** AJCC publishes none for this chapter — the
  8th edition introduced a head-and-neck-specific T classification but withheld
  stage groupings for want of data. The app reports T, N, M and FNCLCC grade
  and states plainly why there is no stage. Cates (2019), Lee (2021) and
  Salunkhe et al. (ASTRO 2023 abstract, linked on the slide) each propose a
  *different* grouping; none is AJCC-endorsed and none is implemented here.
  This matches the instruction on slide 12 of the deck.
- **Grade** is FNCLCC (differentiation + mitotic count + necrosis; 2–3 = G1,
  4–5 = G2, 6–8 = G3) and is asked after T/N/M via the new `postQuestions`
  slot, then shown beside the TNM where other sites show a stage.
- **Scope exclusions recorded in the site's notes:** the AJCC soft tissue
  sarcoma system does not apply to angiosarcoma, embryonal or alveolar
  rhabdomyosarcoma, Kaposi sarcoma, or dermatofibrosarcoma protuberans, and
  does not stage sarcomas arising within the dura.

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
