// flow.js — deciding which question comes next.
//
// Kept separate from app.js (which touches the DOM) so the exhaustive audit in
// test/selftest.js can drive the real question flow headlessly in Node and
// prove that no site can dead-end: every path of answers must reach a complete
// TNM and a stage.

import {
  resolveSpec,
  resolveDerived,
  specFor,
  basesFor,
  basisIsMeaningful,
  forcedBy
} from './engine.js';

export const AXES = ['T', 'N', 'M'];

/**
 * Questions asked AFTER T/N/M rather than before.
 *
 * Only soft tissue sarcoma uses this, for FNCLCC grade. Grade is not part of
 * the TNM string, but for that chapter it is the rest of the AJCC answer, and
 * asking it first — the way `preQuestions` are asked — would put a pathology
 * detail ahead of the tumour itself. Answers land in the same `pre` namespace,
 * so URL serialisation, `when` clauses and the audit need no special case.
 */
export function postQuestions(site) {
  return site.postQuestions || [];
}

/** True when an item's skipWhen condition is satisfied by the answers so far. */
export function skipped(item, answers) {
  return (
    !!item.skipWhen &&
    Object.entries(item.skipWhen).every(([k, vals]) => vals.includes(answers[k]))
  );
}

/** Normalise an axis spec into a list of question steps. */
export function stepsOf(spec) {
  if (!spec) return [];
  if (spec.kind === 'direct') {
    return [{ id: '_', prompt: spec.prompt, help: spec.help, options: spec.options, direct: true }];
  }
  return spec.steps;
}

/**
 * Fill in any question that has only one possible answer.
 *
 * The cervical nodes & unknown primary chapter has exactly one T category (T0,
 * by definition), and asking a question with a single option wastes a tap
 * without teaching anything. Applied before deciding what to ask and before
 * reading off the categories, so the URL and the result stay consistent.
 */
export function autofill(site, st) {
  const basis = st.basis || basesFor(site)[0];
  let next = st;
  for (const q of [...(site.preQuestions || []), ...postQuestions(site)]) {
    if (skipped(q, next.pre) || next.pre[q.id]) continue;
    if (q.options.length === 1 && !q.options[0].redirect) {
      next = { ...next, pre: { ...next.pre, [q.id]: q.options[0].value } };
    }
  }
  for (const axis of AXES) {
    const spec = resolveSpec(specFor(site, axis, basis), next.pre);
    if (!spec) continue;
    for (const step of stepsOf(spec)) {
      if (skipped(step, next[axis]) || next[axis][step.id]) continue;
      if (step.options.length === 1) {
        next = { ...next, [axis]: { ...next[axis], [step.id]: step.options[0].value } };
      }
    }
  }
  return next;
}

/** Resolve an axis to its category value, or null if not yet fully answered. */
export function axisValue(site, st, axis) {
  const spec = resolveSpec(specFor(site, axis, st.basis || basesFor(site)[0]), st.pre);
  if (!spec) return null;
  if (spec.kind === 'direct') return st[axis]._ || null;
  const got = resolveDerived(spec, st[axis]);
  return got ? got.value : null;
}

/**
 * The first unanswered question given the current answers, or null when the
 * staging is complete. Order: pre-questions, staging basis, T, N, M, then any
 * post-questions — skipping any axis a previous answer forces (Tis forces N0 M0).
 */
export function nextQuestion(site, stIn) {
  const st = autofill(site, stIn);
  for (const q of site.preQuestions || []) {
    if (skipped(q, st.pre)) continue;
    if (!st.pre[q.id]) return { kind: 'pre', q };
  }

  if (basisIsMeaningful(site) && !st.basis) return { kind: 'basis' };

  const basis = st.basis || basesFor(site)[0];
  const forced = {};

  for (const axis of AXES) {
    const spec = resolveSpec(specFor(site, axis, basis), st.pre);
    if (!spec) continue;
    if (forced[axis]) continue;

    for (const step of stepsOf(spec)) {
      if (skipped(step, st[axis])) continue;
      if (!st[axis][step.id]) return { kind: 'axis', axis, spec, step };
    }

    const value = axisValue(site, st, axis);
    if (value) Object.assign(forced, forcedBy(spec, value) || {});
  }

  for (const q of postQuestions(site)) {
    if (skipped(q, st.pre)) continue;
    if (!st.pre[q.id]) return { kind: 'pre', q };
  }

  return null;
}

/** The complete T/N/M, filling in any categories forced by an earlier answer. */
export function withForced(site, stIn) {
  const st = autofill(site, stIn);
  const basis = st.basis || basesFor(site)[0];
  const out = { T: null, N: null, M: null };
  const forced = {};
  for (const axis of AXES) {
    if (forced[axis]) {
      out[axis] = forced[axis];
      continue;
    }
    const spec = resolveSpec(specFor(site, axis, basis), st.pre);
    const v = axisValue(site, st, axis);
    out[axis] = v;
    if (v && spec) Object.assign(forced, forcedBy(spec, v) || {});
  }
  return out;
}

/** A blank answer sheet for a site. */
export function blankState(siteId) {
  return { siteId, basis: undefined, pre: {}, T: {}, N: {}, M: {} };
}

/** Record an answer for a question returned by nextQuestion, immutably. */
export function answer(st, q, value) {
  const next = { ...st, pre: { ...st.pre }, T: { ...st.T }, N: { ...st.N }, M: { ...st.M } };
  if (q.kind === 'pre') next.pre[q.q.id] = value;
  else if (q.kind === 'basis') next.basis = value;
  else next[q.axis][q.step.id] = value;
  return next;
}

/** The choices available for a question, as plain values. */
export function choicesFor(site, q) {
  if (q.kind === 'pre') return q.q.options;
  if (q.kind === 'basis') {
    return basesFor(site).map((b) => ({ value: b, label: b }));
  }
  return q.step.options;
}
