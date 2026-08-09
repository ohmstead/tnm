// Exhaustive staging audit.
//
//   node test/selftest.js
//
// Four classes of check:
//
//   1. COVERAGE      For every site, every staging basis, and every reachable
//                    combination of pre-question answers x T x N x M, exactly
//                    one stage rule must match. Zero matches means a gap in
//                    transcription. Two or more means contradictory rules and
//                    an order-dependent answer.
//
//   2. DERIVATION    Every reachable combination of derived-axis step answers
//                    must resolve to a category. A student must never be able
//                    to answer every question and be told nothing.
//
//   3. GOLDEN CASES  Worked examples taken from AJCC's own material and from
//                    the stage-group grids in HN_staging.pptx.
//
//   4. CITATIONS     Every category option, derivation rule and stage rule
//                    must carry a source. No uncited claim ships.

import { SITES, SITE_BY_ID } from '../data/sites.js';
import {
  matchingStageRules,
  axisValues,
  specFor,
  stageRulesFor,
  basesFor,
  resolveSpec,
  resolveDerived,
  resolveStage,
  specBranches,
  forcedBy
} from '../engine.js';
import { nextQuestion, withForced, blankState, answer, choicesFor } from '../flow.js';

let failures = 0;
let checks = 0;

function fail(msg) {
  failures++;
  console.error(`  FAIL  ${msg}`);
}
function ok() {
  checks++;
}

/** Cartesian product of the option values of a list of pre-questions. */
function preCombinations(preQuestions = []) {
  let combos = [{}];
  for (const q of preQuestions) {
    const next = [];
    for (const combo of combos) {
      // Honour skipWhen: a pre-question that is skipped contributes no key.
      if (q.skipWhen && Object.entries(q.skipWhen).every(([k, vals]) => vals.includes(combo[k]))) {
        next.push(combo);
        continue;
      }
      for (const opt of q.options) {
        // Options that redirect to another site never reach staging here.
        if (opt.redirect) continue;
        next.push({ ...combo, [q.id]: opt.value });
      }
    }
    combos = next;
  }
  return combos;
}

/** Cartesian product of the step answers of a derived axis spec. */
function stepCombinations(steps) {
  let combos = [{}];
  for (const step of steps) {
    const next = [];
    for (const combo of combos) {
      if (
        step.skipWhen &&
        Object.entries(step.skipWhen).every(([k, vals]) => vals.includes(combo[k]))
      ) {
        next.push(combo);
        continue;
      }
      for (const opt of step.options) next.push({ ...combo, [step.id]: opt.value });
    }
    combos = next;
  }
  return combos;
}

/* ------------------------------------------------------------------ *
 * 1 + 2. Coverage and derivation
 * ------------------------------------------------------------------ */

console.log('\nExhaustive coverage audit');
for (const site of SITES) {
  let combosChecked = 0;

  for (const basis of basesFor(site)) {
    const rules = stageRulesFor(site, basis);
    if (!rules) {
      fail(`${site.id} / ${basis}: no stage-group rules`);
      continue;
    }

    for (const pre of preCombinations(site.preQuestions)) {
      const tSpec = resolveSpec(specFor(site, 'T', basis), pre);
      const nSpec = resolveSpec(specFor(site, 'N', basis), pre);
      const mSpec = resolveSpec(specFor(site, 'M', basis), pre);

      if (!tSpec || !nSpec || !mSpec) {
        fail(`${site.id} / ${basis} / ${JSON.stringify(pre)}: missing an axis spec`);
        continue;
      }

      // 2. Derivation completeness for each axis.
      for (const [axisName, spec] of [
        ['T', tSpec],
        ['N', nSpec],
        ['M', mSpec]
      ]) {
        if (spec.kind !== 'derived') continue;
        for (const answers of stepCombinations(spec.steps)) {
          const got = resolveDerived(spec, answers);
          if (!got) {
            fail(
              `${site.id} / ${basis} / ${axisName}: no rule for answers ${JSON.stringify(answers)}`
            );
          }
        }
      }

      // 1. Stage-group coverage.
      // A T value may force other axes (Tis forces N0 M0, because carcinoma
      // in situ cannot metastasise). Forced combinations are the only ones
      // reachable in the app, so unreachable ones are not required to stage.
      for (const T of axisValues(tSpec)) {
        const forced = forcedBy(tSpec, T) || {};
        for (const N of axisValues(nSpec)) {
          if (forced.N && forced.N !== N) continue;
          for (const M of axisValues(mSpec)) {
            if (forced.M && forced.M !== M) continue;
            const matches = matchingStageRules(rules, { T, N, M, pre });
            combosChecked++;
            if (matches.length === 0) {
              fail(
                `${site.id} / ${basis} / ${JSON.stringify(pre)}: NO stage rule for ${T} ${N} ${M}`
              );
            } else if (matches.length > 1) {
              const stages = [...new Set(matches.map((m) => m.stage))];
              // Multiple rules agreeing on the stage is harmless (the tables
              // genuinely overlap); disagreement is an order-dependent bug.
              if (stages.length > 1) {
                fail(
                  `${site.id} / ${basis} / ${JSON.stringify(pre)}: ${T} ${N} ${M} matches conflicting stages ${stages.join(', ')}`
                );
              } else {
                ok();
              }
            } else {
              ok();
            }
          }
        }
      }
    }
  }
  console.log(`  ${site.id.padEnd(28)} ${combosChecked} combinations`);
}

/* ------------------------------------------------------------------ *
 * 1b. Flow reachability — drive the real question flow, every path
 *
 * The coverage audit above proves the RULES are complete. This proves the
 * QUESTIONS are: starting from a blank sheet and exhaustively taking every
 * combination of answers the app would actually offer, every path must end at
 * a complete TNM with exactly one stage. A student must never be able to reach
 * a screen with no options and no answer.
 * ------------------------------------------------------------------ */

console.log('\nFlow reachability (every answerable path)');
for (const site of SITES) {
  let paths = 0;
  let maxTaps = 0;
  let minTaps = Infinity;

  const walk = (st, taps) => {
    if (taps > 12) {
      fail(`${site.id}: flow did not terminate within 12 answers`);
      return;
    }
    const q = nextQuestion(site, st);
    if (!q) {
      paths++;
      maxTaps = Math.max(maxTaps, taps);
      minTaps = Math.min(minTaps, taps);
      const vals = withForced(site, st);
      for (const axis of ['T', 'N', 'M']) {
        if (!vals[axis]) {
          fail(`${site.id}: flow completed with no ${axis} category (${JSON.stringify(st)})`);
          return;
        }
      }
      const basis = st.basis || basesFor(site)[0];
      const res = resolveStage(stageRulesFor(site, basis), { ...vals, pre: st.pre });
      if (!res) {
        fail(
          `${site.id} / ${basis}: reachable answers give no stage — ${vals.T} ${vals.N} ${vals.M}`
        );
      } else {
        ok();
      }
      return;
    }
    const choices = choicesFor(site, q);
    if (!choices.length) {
      fail(`${site.id}: question "${q.q?.prompt || q.step?.prompt || 'basis'}" offers no options`);
      return;
    }
    for (const c of choices) {
      if (c.redirect) continue; // routes to another chapter; staged there
      walk(answer(st, q, c.value), taps + 1);
    }
  };

  walk(blankState(site.id), 0);
  console.log(
    `  ${site.id.padEnd(28)} ${String(paths).padStart(4)} paths, ${minTaps}–${maxTaps} taps`
  );
}

/* ------------------------------------------------------------------ *
 * 3. Golden cases
 * ------------------------------------------------------------------ */

// [siteId, basis, T, N, M, expectedStage, pre, provenance]
const GOLDEN = [
  // --- AJCC's own worked examples (facs.org, 8th edition H&N staging) ---
  ['cervical-unknown-primary', 'clinical', 'T0', 'N1', 'M0', 'III', { viral: 'both-neg' },
    "AJCC worked example: 2 cm submental node, no primary found — cT0 cN1 cM0 = stage III"],
  ['oropharynx-hpv', 'clinical', 'T0', 'N1', 'M0', 'I', {},
    "AJCC worked example: p16+ node, no primary found — cT0 cN1 cM0 = stage I"],
  ['oral-cavity', 'clinical', 'T2', 'N1', 'M0', 'III', {},
    "AJCC worked example: floor of mouth 3.5 cm DOI 6 mm with 2 cm node — cT2 cN1 cM0 = stage III"],
  ['oral-cavity', 'clinical', 'T2', 'N3b', 'M0', 'IVB', {},
    "AJCC worked example: cT2 cN3b cM0 = stage IVB"],

  // --- HPV+ oropharynx v9, clinical grid (deck slide 3) ---
  ['oropharynx-hpv', 'clinical', 'T1', 'N0', 'M0', 'I', {}, 'deck slide 3 clinical grid'],
  ['oropharynx-hpv', 'clinical', 'T2', 'N1', 'M0', 'I', {}, 'deck slide 3 clinical grid'],
  ['oropharynx-hpv', 'clinical', 'T3', 'N0', 'M0', 'II', {}, 'deck slide 3 clinical grid'],
  ['oropharynx-hpv', 'clinical', 'T1', 'N2', 'M0', 'II', {}, 'deck slide 3 clinical grid'],
  ['oropharynx-hpv', 'clinical', 'T3', 'N2', 'M0', 'II', {}, 'deck slide 3 clinical grid'],
  ['oropharynx-hpv', 'clinical', 'T1', 'N3', 'M0', 'III', {}, 'deck slide 3 clinical grid'],
  ['oropharynx-hpv', 'clinical', 'T4', 'N0', 'M0', 'III', {}, 'deck slide 3 clinical grid'],
  ['oropharynx-hpv', 'clinical', 'T1', 'N0', 'M1', 'IV', {}, 'deck slide 3 clinical grid'],

  // --- HPV+ oropharynx v9, pathological grid (deck slide 3 + Ho 2025) ---
  ['oropharynx-hpv', 'pathological', 'T1', 'N0', 'M0', 'I', {}, 'deck slide 3 pathological grid'],
  ['oropharynx-hpv', 'pathological', 'T2', 'N1a', 'M0', 'I', {}, 'deck slide 3 pathological grid'],
  ['oropharynx-hpv', 'pathological', 'T2', 'N1b', 'M0', 'I', {}, 'deck slide 3 pathological grid'],
  ['oropharynx-hpv', 'pathological', 'T1', 'N2', 'M0', 'II', {}, 'deck slide 3 pathological grid'],
  ['oropharynx-hpv', 'pathological', 'T1', 'N3', 'M0', 'II', {},
    'Ho 2025: stage II includes T0-2 N3 — pN3 does NOT force stage III'],
  ['oropharynx-hpv', 'pathological', 'T3', 'N0', 'M0', 'II', {}, 'deck slide 3 pathological grid'],
  ['oropharynx-hpv', 'pathological', 'T3', 'N3', 'M0', 'III', {}, 'Ho 2025: T3 N3 = stage III'],
  ['oropharynx-hpv', 'pathological', 'T4', 'N0', 'M0', 'III', {}, 'deck slide 3 pathological grid'],

  // --- Nasopharynx v9 (deck slide 8 grid + Pan 2024 Fig 1B) ---
  ['nasopharynx', 'clinical', 'T1', 'N0', 'M0', 'IA', {}, 'deck slide 8 grid'],
  ['nasopharynx', 'clinical', 'T2', 'N0', 'M0', 'IA', {}, 'deck slide 8 grid'],
  ['nasopharynx', 'clinical', 'T1', 'N1', 'M0', 'IB', {}, 'deck slide 8 grid'],
  ['nasopharynx', 'clinical', 'T2', 'N1', 'M0', 'IB', {}, 'deck slide 8 grid'],
  ['nasopharynx', 'clinical', 'T1', 'N2', 'M0', 'II', {}, 'deck slide 8 grid'],
  ['nasopharynx', 'clinical', 'T3', 'N0', 'M0', 'II', {}, 'deck slide 8 grid'],
  ['nasopharynx', 'clinical', 'T3', 'N2', 'M0', 'II', {}, 'deck slide 8 grid'],
  ['nasopharynx', 'clinical', 'T1', 'N3', 'M0', 'III', {}, 'deck slide 8 grid'],
  ['nasopharynx', 'clinical', 'T4', 'N0', 'M0', 'III', {}, 'deck slide 8 grid'],
  ['nasopharynx', 'clinical', 'T1', 'N0', 'M1a', 'IVA', {}, 'deck slide 8 grid — M1a is IVA in v9'],
  ['nasopharynx', 'clinical', 'T1', 'N0', 'M1b', 'IVB', {}, 'deck slide 8 grid — M1b is IVB in v9'],

  // --- Salivary v9 (deck slide 7 grid) ---
  ['salivary', 'clinical', 'T1', 'N0', 'M0', 'I', {}, 'deck slide 7 grid'],
  ['salivary', 'clinical', 'T2', 'N0', 'M0', 'II', {}, 'deck slide 7 grid'],
  ['salivary', 'clinical', 'T3', 'N0', 'M0', 'IIIA', {}, 'deck slide 7 grid'],
  ['salivary', 'clinical', 'T4a', 'N0', 'M0', 'IIIA', {}, 'deck slide 7 grid'],
  ['salivary', 'clinical', 'T1', 'N1', 'M0', 'IIIA', {}, 'deck slide 7 grid'],
  ['salivary', 'clinical', 'T2', 'N1', 'M0', 'IIIA', {}, 'deck slide 7 grid'],
  ['salivary', 'clinical', 'T3', 'N1', 'M0', 'IIIB', {}, 'deck slide 7 grid'],
  ['salivary', 'clinical', 'T4b', 'N1', 'M0', 'IIIB', {}, 'deck slide 7 grid'],
  ['salivary', 'clinical', 'T1', 'N2', 'M0', 'IIIB', {}, 'deck slide 7 grid'],
  ['salivary', 'clinical', 'T4b', 'N0', 'M1', 'IV', {}, 'deck slide 7 — stage IV is M1 only'],

  // --- Larynx 8e stage groups (deck slide 6) ---
  ['larynx', 'clinical', 'Tis', 'N0', 'M0', '0', { subsite: 'glottis' }, 'deck slide 6 table'],
  ['larynx', 'clinical', 'T1a', 'N0', 'M0', 'I', { subsite: 'glottis' }, 'T1a behaves as T1'],
  ['larynx', 'clinical', 'T1b', 'N0', 'M0', 'I', { subsite: 'glottis' }, 'T1b behaves as T1'],
  ['larynx', 'clinical', 'T2', 'N0', 'M0', 'II', { subsite: 'supraglottis' }, 'deck slide 6 table'],
  ['larynx', 'clinical', 'T3', 'N0', 'M0', 'III', { subsite: 'supraglottis' }, 'deck slide 6 table'],
  ['larynx', 'clinical', 'T1', 'N1', 'M0', 'III', { subsite: 'supraglottis' }, 'deck slide 6 table'],
  ['larynx', 'clinical', 'T4a', 'N0', 'M0', 'IVA', { subsite: 'supraglottis' }, 'deck slide 6 table'],
  ['larynx', 'clinical', 'T4a', 'N1', 'M0', 'IVA', { subsite: 'supraglottis' }, 'deck slide 6 table'],
  ['larynx', 'clinical', 'T1', 'N2a', 'M0', 'IVA', { subsite: 'supraglottis' }, 'deck slide 6 table'],
  ['larynx', 'clinical', 'T4b', 'N0', 'M0', 'IVB', { subsite: 'supraglottis' }, 'deck slide 6 table'],
  ['larynx', 'clinical', 'T1', 'N3a', 'M0', 'IVB', { subsite: 'supraglottis' }, 'deck slide 6 table'],
  ['larynx', 'clinical', 'T1', 'N0', 'M1', 'IVC', { subsite: 'supraglottis' }, 'deck slide 6 table'],

  // --- p16- oropharynx 8e (deck slide 4, Table 5) ---
  ['oropharynx-p16neg', 'clinical', 'Tis', 'N0', 'M0', '0', {}, 'deck slide 4 Table 5'],
  ['oropharynx-p16neg', 'clinical', 'T1', 'N0', 'M0', 'I', {}, 'deck slide 4 Table 5'],
  ['oropharynx-p16neg', 'clinical', 'T2', 'N0', 'M0', 'II', {}, 'deck slide 4 Table 5'],
  ['oropharynx-p16neg', 'clinical', 'T3', 'N0', 'M0', 'III', {}, 'deck slide 4 Table 5'],
  ['oropharynx-p16neg', 'clinical', 'T1', 'N1', 'M0', 'III', {}, 'deck slide 4 Table 5'],
  ['oropharynx-p16neg', 'clinical', 'T4a', 'N1', 'M0', 'IVA', {}, 'deck slide 4 Table 5'],
  ['oropharynx-p16neg', 'clinical', 'T4a', 'N2b', 'M0', 'IVA', {}, 'deck slide 4 Table 5'],
  ['oropharynx-p16neg', 'clinical', 'T1', 'N3b', 'M0', 'IVB', {}, 'deck slide 4 Table 5'],
  ['oropharynx-p16neg', 'clinical', 'T4b', 'N0', 'M0', 'IVB', {}, 'deck slide 4 Table 5'],
  ['oropharynx-p16neg', 'clinical', 'T1', 'N0', 'M1', 'IVC', {}, 'deck slide 4 Table 5'],

  // --- Mucosal melanoma (deck slide 10) — no stage 0/I/II exists ---
  ['mucosal-melanoma', 'clinical', 'T3', 'N0', 'M0', 'III', {}, 'deck slide 10 stage groups'],
  ['mucosal-melanoma', 'clinical', 'T4a', 'N0', 'M0', 'IVA', {}, 'deck slide 10 stage groups'],
  ['mucosal-melanoma', 'clinical', 'T3', 'N1', 'M0', 'IVA', {}, 'deck slide 10 stage groups'],
  ['mucosal-melanoma', 'clinical', 'T4a', 'N1', 'M0', 'IVA', {}, 'deck slide 10 stage groups'],
  ['mucosal-melanoma', 'clinical', 'T4b', 'N0', 'M0', 'IVB', {}, 'deck slide 10 stage groups'],
  ['mucosal-melanoma', 'clinical', 'T4b', 'N1', 'M0', 'IVB', {}, 'deck slide 10 stage groups'],
  ['mucosal-melanoma', 'clinical', 'T3', 'N0', 'M1', 'IVC', {}, 'deck slide 10 stage groups'],

  // --- Cutaneous carcinoma (deck slide 11) ---
  ['cutaneous', 'clinical', 'Tis', 'N0', 'M0', '0', {}, 'deck slide 11 stage groups'],
  ['cutaneous', 'clinical', 'T1', 'N0', 'M0', 'I', {}, 'deck slide 11 stage groups'],
  ['cutaneous', 'clinical', 'T2', 'N0', 'M0', 'II', {}, 'deck slide 11 stage groups'],
  ['cutaneous', 'clinical', 'T3', 'N0', 'M0', 'III', {}, 'deck slide 11 stage groups'],
  ['cutaneous', 'clinical', 'T2', 'N1', 'M0', 'III', {}, 'deck slide 11 stage groups'],
  ['cutaneous', 'clinical', 'T4a', 'N0', 'M0', 'IVA', {}, 'deck slide 11 stage groups'],
  ['cutaneous', 'clinical', 'T1', 'N2a', 'M0', 'IVA', {}, 'deck slide 11 stage groups'],
  ['cutaneous', 'clinical', 'T1', 'N0', 'M1', 'IVB', {}, 'deck slide 11 stage groups'],

  // --- Thyroid (deck slide 9) ---
  ['thyroid', 'clinical', 'T4b', 'N1b', 'M0', 'I',
    { histology: 'differentiated', age: 'under55' },
    'deck slide 9: DTC under 55, any T any N M0 = stage I'],
  ['thyroid', 'clinical', 'T1a', 'N0', 'M1', 'II',
    { histology: 'differentiated', age: 'under55' },
    'deck slide 9: DTC under 55, M1 = stage II'],
  ['thyroid', 'clinical', 'T1a', 'N0', 'M0', 'I',
    { histology: 'differentiated', age: '55plus' }, 'deck slide 9'],
  ['thyroid', 'clinical', 'T2', 'N0', 'M0', 'I',
    { histology: 'differentiated', age: '55plus' }, 'deck slide 9'],
  ['thyroid', 'clinical', 'T1b', 'N1a', 'M0', 'II',
    { histology: 'differentiated', age: '55plus' }, 'deck slide 9: T1 N1 = II'],
  ['thyroid', 'clinical', 'T3a', 'N0', 'M0', 'II',
    { histology: 'differentiated', age: '55plus' }, 'deck slide 9'],
  ['thyroid', 'clinical', 'T3b', 'N1b', 'M0', 'II',
    { histology: 'differentiated', age: '55plus' }, 'deck slide 9'],
  ['thyroid', 'clinical', 'T4a', 'N0', 'M0', 'III',
    { histology: 'differentiated', age: '55plus' }, 'deck slide 9'],
  ['thyroid', 'clinical', 'T4b', 'N0', 'M0', 'IVA',
    { histology: 'differentiated', age: '55plus' }, 'deck slide 9'],
  ['thyroid', 'clinical', 'T1a', 'N0', 'M1', 'IVB',
    { histology: 'differentiated', age: '55plus' }, 'deck slide 9'],
  ['thyroid', 'clinical', 'T1a', 'N0', 'M0', 'I', { histology: 'medullary' }, 'deck slide 9'],
  ['thyroid', 'clinical', 'T2', 'N0', 'M0', 'II', { histology: 'medullary' }, 'deck slide 9'],
  ['thyroid', 'clinical', 'T3a', 'N0', 'M0', 'II', { histology: 'medullary' }, 'deck slide 9'],
  ['thyroid', 'clinical', 'T2', 'N1a', 'M0', 'III', { histology: 'medullary' }, 'deck slide 9'],
  ['thyroid', 'clinical', 'T4a', 'N0', 'M0', 'IVA', { histology: 'medullary' }, 'deck slide 9'],
  ['thyroid', 'clinical', 'T2', 'N1b', 'M0', 'IVA', { histology: 'medullary' }, 'deck slide 9'],
  ['thyroid', 'clinical', 'T4b', 'N0', 'M0', 'IVB', { histology: 'medullary' }, 'deck slide 9'],
  ['thyroid', 'clinical', 'T1a', 'N0', 'M1', 'IVC', { histology: 'medullary' }, 'deck slide 9'],
  ['thyroid', 'clinical', 'T1a', 'N0', 'M0', 'IVA', { histology: 'anaplastic' }, 'deck slide 9'],
  ['thyroid', 'clinical', 'T3a', 'N0', 'M0', 'IVA', { histology: 'anaplastic' }, 'deck slide 9'],
  ['thyroid', 'clinical', 'T1a', 'N1a', 'M0', 'IVB', { histology: 'anaplastic' }, 'deck slide 9'],
  ['thyroid', 'clinical', 'T3b', 'N0', 'M0', 'IVB', { histology: 'anaplastic' }, 'deck slide 9'],
  ['thyroid', 'clinical', 'T4a', 'N0', 'M0', 'IVB', { histology: 'anaplastic' }, 'deck slide 9'],
  ['thyroid', 'clinical', 'T1a', 'N0', 'M1', 'IVC', { histology: 'anaplastic' }, 'deck slide 9']
];

console.log('\nGolden cases');
for (const [siteId, basis, T, N, M, expected, pre, provenance] of GOLDEN) {
  const site = SITE_BY_ID[siteId];
  if (!site) {
    fail(`unknown site in golden case: ${siteId}`);
    continue;
  }
  const got = resolveStage(stageRulesFor(site, basis), { T, N, M, pre });
  if (!got) {
    fail(`${siteId} ${basis} ${T} ${N} ${M} -> no match (expected ${expected}) [${provenance}]`);
  } else if (got.stage !== expected) {
    fail(
      `${siteId} ${basis} ${T} ${N} ${M} -> ${got.stage}, expected ${expected} [${provenance}]`
    );
  } else {
    ok();
  }
}
console.log(`  ${GOLDEN.length} golden cases checked`);

/* ------------------------------------------------------------------ *
 * 3b. Derivation golden cases — the category questions themselves
 * ------------------------------------------------------------------ */

// [siteId, basis, axis, answers, expectedCategory, pre, provenance]
const DERIVED_GOLDEN = [
  // Oral cavity size x DOI grid, using the CORRECTED AJCC 8e wording.
  ['oral-cavity', 'clinical', 'T', { local: 'confined', size: 'le2', doi: 'le5' }, 'T1', {},
    'AJCC 8e corrected: <=2 cm with DOI <=5 mm'],
  ['oral-cavity', 'clinical', 'T', { local: 'confined', size: 'le2', doi: 'gt5le10' }, 'T2', {},
    'AJCC 8e corrected: <=2 cm with DOI >5 mm'],
  ['oral-cavity', 'clinical', 'T', { local: 'confined', size: 'le2', doi: 'gt10' }, 'T2', {},
    'AJCC 8e CORRECTED T2 has no upper DOI bound — deck slide 5 prints the obsolete capped version'],
  ['oral-cavity', 'clinical', 'T', { local: 'confined', size: 'gt2le4', doi: 'le5' }, 'T2', {},
    'AJCC 8e corrected: >2-4 cm with DOI <=10 mm'],
  ['oral-cavity', 'clinical', 'T', { local: 'confined', size: 'gt2le4', doi: 'gt10' }, 'T3', {},
    'AJCC 8e corrected: >2-4 cm with DOI >10 mm'],
  ['oral-cavity', 'clinical', 'T', { local: 'confined', size: 'gt4', doi: 'le5' }, 'T3', {},
    'AJCC 8e corrected: >4 cm with DOI <=10 mm'],
  ['oral-cavity', 'clinical', 'T', { local: 'confined', size: 'gt4', doi: 'gt10' }, 'T4a', {},
    'AJCC 8e corrected: >4 cm with DOI >10 mm'],

  // 8e clinical vs pathological N divergence — the c/p teaching point.
  ['larynx', 'clinical', 'N', { nodes: 'single-ipsi', size: 'le3', ene: 'yes' }, 'N3b',
    { subsite: 'glottis' }, 'AJCC 8e: any clinically overt ENE is cN3b'],
  ['larynx', 'pathological', 'N', { nodes: 'single-ipsi', size: 'le3', ene: 'yes' }, 'N2a',
    { subsite: 'glottis' }, 'AJCC 8e: single ipsilateral node <=3 cm with pENE is pN2a, not pN3b'],
  ['larynx', 'clinical', 'N', { nodes: 'single-ipsi', size: 'le3', ene: 'no' }, 'N1',
    { subsite: 'glottis' }, 'AJCC 8e cN1'],
  ['larynx', 'pathological', 'N', { nodes: 'multiple-ipsi', size: 'le3', ene: 'yes' }, 'N3b',
    { subsite: 'glottis' }, 'AJCC 8e pN3b: multiple nodes any with pENE'],

  // HPV+ oropharynx v9 nodal schemes — clinical uses iENE, pathological counts.
  ['oropharynx-hpv', 'clinical', 'N', { extent: 'ipsi', iene: 'no' }, 'N1', {}, 'v9 cN1'],
  ['oropharynx-hpv', 'clinical', 'N', { extent: 'ipsi', iene: 'yes' }, 'N2', {},
    'v9 cN2: ipsilateral with iENE — new in Version 9'],
  ['oropharynx-hpv', 'clinical', 'N', { extent: 'bilat', iene: 'no' }, 'N2', {}, 'v9 cN2'],
  ['oropharynx-hpv', 'clinical', 'N', { extent: 'bilat', iene: 'yes' }, 'N3', {}, 'v9 cN3'],
  ['oropharynx-hpv', 'clinical', 'N', { extent: 'over6' }, 'N3', {}, 'v9 cN3'],
  ['oropharynx-hpv', 'pathological', 'N', { count: '1', pene: 'no' }, 'N1a', {}, 'Ho 2025 pN1a'],
  ['oropharynx-hpv', 'pathological', 'N', { count: '2to4', pene: 'no' }, 'N1b', {}, 'Ho 2025 pN1b'],
  ['oropharynx-hpv', 'pathological', 'N', { count: 'over4', pene: 'no' }, 'N2', {}, 'Ho 2025 pN2'],
  ['oropharynx-hpv', 'pathological', 'N', { count: '1', pene: 'yes' }, 'N2', {}, 'Ho 2025 pN2'],
  ['oropharynx-hpv', 'pathological', 'N', { count: 'over4', pene: 'yes' }, 'N3', {}, 'Ho 2025 pN3'],

  // Salivary v9 nodal scheme.
  ['salivary', 'clinical', 'N', { count: '1to3', ene: 'no' }, 'N1', {}, 'v9 salivary N1'],
  ['salivary', 'clinical', 'N', { count: '1to3', ene: 'yes' }, 'N2', {}, 'v9 salivary N2: any ENE'],
  ['salivary', 'clinical', 'N', { count: 'over3', ene: 'no' }, 'N2', {}, 'v9 salivary N2: >3 nodes'],
  ['salivary', 'clinical', 'T', { local: 'confined', size: 'le2' }, 'T1', {}, 'v9 salivary T1'],
  ['salivary', 'clinical', 'T', { local: 'epe' }, 'T3', {},
    'v9 salivary T3: gross extraparenchymal extension, major glands only'],

  // Nasopharynx v9 — advanced ENE forces N3.
  ['nasopharynx', 'clinical', 'N', { extent: 'unilateral', ene: 'no' }, 'N1', {}, 'v9 NPC N1'],
  ['nasopharynx', 'clinical', 'N', { extent: 'unilateral', ene: 'yes' }, 'N3', {},
    'v9 NPC: advanced ENE is an N3 criterion — new in Version 9'],
  ['nasopharynx', 'clinical', 'N', { extent: 'bilateral', ene: 'no' }, 'N2', {}, 'v9 NPC N2'],
  ['nasopharynx', 'clinical', 'N', { extent: 'advanced' }, 'N3', {}, 'v9 NPC N3'],

  // Thyroid T — T3b is ETE into strap muscles at any size.
  ['thyroid', 'clinical', 'T', { ete: 'none', size: 'le1' }, 'T1a', { histology: 'medullary' },
    'AJCC 8e thyroid T1a'],
  ['thyroid', 'clinical', 'T', { ete: 'none', size: 'gt4' }, 'T3a', { histology: 'medullary' },
    'AJCC 8e thyroid T3a'],
  ['thyroid', 'clinical', 'T', { ete: 'strap' }, 'T3b', { histology: 'medullary' },
    'AJCC 8e thyroid T3b: strap muscle ETE at any size']
];

console.log('\nDerivation golden cases');
for (const [siteId, basis, axis, answers, expected, pre, provenance] of DERIVED_GOLDEN) {
  const site = SITE_BY_ID[siteId];
  const spec = resolveSpec(specFor(site, axis, basis), pre);
  if (!spec) {
    fail(`${siteId} ${basis} ${axis}: no spec [${provenance}]`);
    continue;
  }
  const got = resolveDerived(spec, answers);
  if (!got) {
    fail(`${siteId} ${axis} ${JSON.stringify(answers)} -> no match (expected ${expected}) [${provenance}]`);
  } else if (got.value !== expected) {
    fail(`${siteId} ${axis} ${JSON.stringify(answers)} -> ${got.value}, expected ${expected} [${provenance}]`);
  } else {
    ok();
  }
}
console.log(`  ${DERIVED_GOLDEN.length} derivation cases checked`);

/* ------------------------------------------------------------------ *
 * 4. Citation completeness
 * ------------------------------------------------------------------ */

console.log('\nCitation completeness');
for (const site of SITES) {
  if (!site.citations?.ajcc?.text) fail(`${site.id}: missing AJCC citation`);
  if (!site.citations?.papers?.length) fail(`${site.id}: missing peer-reviewed citation`);
  if (!site.edition?.label || !site.edition?.effective) fail(`${site.id}: incomplete edition info`);

  for (const axis of ['T', 'N', 'M']) {
    for (const basis of basesFor(site)) {
      const top = specFor(site, axis, basis);
      if (!top) continue;
      for (const { spec } of specBranches(top)) {
        const items = spec.kind === 'direct' ? spec.options : spec.rules;
        for (const item of items) {
          if (!item.source) {
            fail(`${site.id} / ${axis} / ${item.value}: missing source`);
          }
        }
      }
    }
  }

  for (const basis of basesFor(site)) {
    for (const rule of stageRulesFor(site, basis) || []) {
      if (!rule.source) fail(`${site.id} / ${basis} / stage ${rule.stage}: missing source`);
    }
  }
}
console.log('  every category and stage rule carries a source');

/* ------------------------------------------------------------------ */

console.log(
  `\n${failures === 0 ? 'PASS' : 'FAIL'} — ${checks} assertions passed, ${failures} failed\n`
);
process.exit(failures === 0 ? 0 : 1);
