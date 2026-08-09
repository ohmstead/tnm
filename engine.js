// engine.js — staging rule evaluation.
//
// Design note: every staging decision in this app is made by evaluating an
// ORDERED list of declarative rules, first match wins. This mirrors how the
// printed AJCC stage-group tables actually read, and it makes the exhaustive
// audit in test/selftest.js possible: for any T/N/M combination we can assert
// that exactly one rule matches. Zero matches means a gap in transcription;
// two matches means contradictory rules.
//
// Nothing here knows about any particular cancer. All disease content lives in
// data/sites/*.js as plain data so a clinician can audit it without reading code.

/**
 * Does a rule constraint match a value?
 * A constraint that is undefined or '*' matches anything.
 * Otherwise it is an array of literal category values.
 */
function constraintMatches(constraint, value) {
  if (constraint === undefined || constraint === '*') return true;
  if (!Array.isArray(constraint)) {
    throw new Error(`Rule constraint must be an array or '*', got: ${JSON.stringify(constraint)}`);
  }
  return constraint.includes(value);
}

/**
 * Does a rule's `when` clause match the pre-question answers?
 * `when` is { preQuestionId: [allowedValues] }. Absent means "any".
 */
function whenMatches(when, pre) {
  if (!when) return true;
  for (const [key, allowed] of Object.entries(when)) {
    if (!constraintMatches(allowed, pre[key])) return false;
  }
  return true;
}

/**
 * Find every stage rule matching a given assignment. Returns an array so the
 * self-test can detect ambiguity (>1 match) as loudly as it detects gaps (0).
 * Normal app code uses resolveStage() which takes the first.
 */
export function matchingStageRules(rules, { T, N, M, pre = {} }) {
  return rules.filter(
    (r) =>
      whenMatches(r.when, pre) &&
      constraintMatches(r.T, T) &&
      constraintMatches(r.N, N) &&
      constraintMatches(r.M, M)
  );
}

/**
 * Resolve a prognostic stage group.
 * Returns { stage, rule } or null when no rule matches (which is a data bug,
 * surfaced rather than silently defaulted).
 */
export function resolveStage(rules, assignment) {
  const matches = matchingStageRules(rules, assignment);
  if (matches.length === 0) return null;
  return { stage: matches[0].stage, rule: matches[0] };
}

/* ------------------------------------------------------------------ *
 * Axis specs: how a T, N or M category is arrived at from user answers
 * ------------------------------------------------------------------ */

/**
 * Two spec shapes:
 *
 *  direct  — the user picks the category itself from a radio list. One tap.
 *            { kind:'direct', prompt, options:[{value,label,detail,source}] }
 *
 *  derived — the category is computed from 2+ simpler questions, because the
 *            AJCC criteria are composite (e.g. oral cavity T is size x depth
 *            of invasion). Keeps each screen readable instead of presenting a
 *            wall of compound criteria.
 *            { kind:'derived', steps:[{id,prompt,options:[{value,label}]}],
 *              rules:[{when:{stepId:[vals]}, value:'T1', source}] }
 */

/**
 * Unwrap a `variant` spec against the pre-question answers.
 *
 *   { kind:'variant', on:'subsite', specs:{ glottis:<spec>, supraglottis:<spec> } }
 *
 * Larynx (supraglottis / glottis / subglottis) and the sinonasal tract
 * (maxillary sinus vs nasal cavity & ethmoid) each have genuinely different T
 * tables per subsite while sharing everything else. Modelling that as a variant
 * keeps them as one site in the picker instead of splitting the list.
 */
export function resolveSpec(spec, pre = {}) {
  if (spec && spec.kind === 'variant') {
    const chosen = spec.specs[pre[spec.on]];
    return chosen ? resolveSpec(chosen, pre) : null;
  }
  return spec;
}

/** Every variant branch of a spec, for exhaustive auditing. */
export function specBranches(spec) {
  if (!spec) return [];
  if (spec.kind === 'variant') {
    return Object.entries(spec.specs).flatMap(([key, sub]) =>
      specBranches(sub).map((b) => ({ ...b, pre: { [spec.on]: key, ...b.pre } }))
    );
  }
  return [{ spec, pre: {} }];
}

/**
 * Categories that a chosen value forces on other axes, e.g. Tis forces N0 M0
 * because carcinoma in situ cannot metastasise and AJCC stages no such
 * combination. The app skips the forced questions entirely.
 */
export function forcedBy(spec, value) {
  const s = resolveSpec(spec, {});
  if (!s) return null;
  if (s.kind === 'direct') {
    const opt = s.options.find((o) => o.value === value);
    return opt?.forces || null;
  }
  if (s.kind === 'derived') {
    const rule = s.rules.find((r) => r.value === value);
    return rule?.forces || null;
  }
  if (s.kind === 'variant') {
    for (const sub of Object.values(s.specs)) {
      const f = forcedBy(sub, value);
      if (f) return f;
    }
  }
  return null;
}

/** Every category value an axis spec can possibly produce. Used by the audit. */
export function axisValues(spec) {
  if (!spec) return [];
  if (spec.kind === 'variant') {
    return [...new Set(Object.values(spec.specs).flatMap(axisValues))];
  }
  if (spec.kind === 'direct') return spec.options.map((o) => o.value);
  if (spec.kind === 'derived') {
    // Preserve declaration order but de-duplicate: several rules may yield T4a.
    return [...new Set(spec.rules.map((r) => r.value))];
  }
  throw new Error(`Unknown axis spec kind: ${spec.kind}`);
}

/**
 * Resolve a derived axis from its step answers.
 * Returns { value, rule } or null if the answers match no rule.
 */
export function resolveDerived(spec, answers) {
  for (const rule of spec.rules) {
    let ok = true;
    for (const [stepId, allowed] of Object.entries(rule.when || {})) {
      if (!constraintMatches(allowed, answers[stepId])) {
        ok = false;
        break;
      }
    }
    if (ok) return { value: rule.value, rule };
  }
  return null;
}

/**
 * Look up the option metadata (label, detail, source) for a resolved category
 * value, so the result screen can quote the criteria that were actually met.
 */
export function describeCategory(spec, value) {
  if (!spec) return null;
  if (spec.kind === 'variant') {
    for (const sub of Object.values(spec.specs)) {
      const found = describeCategory(sub, value);
      if (found) return found;
    }
    return null;
  }
  if (spec.kind === 'direct') {
    return spec.options.find((o) => o.value === value) || null;
  }
  const rule = spec.rules.find((r) => r.value === value);
  return rule ? { value, label: value, detail: rule.detail, source: rule.source } : null;
}

/* ------------------------------------------------------------------ *
 * Site helpers
 * ------------------------------------------------------------------ */

/**
 * Pick the axis spec for a staging basis. A site may share one spec across
 * clinical and pathological (`shared`) or define them separately — the
 * separation matters most for N, where AJCC 8e pathological categories fold in
 * extranodal extension differently from clinical, and for AJCC v9 HPV-
 * associated oropharynx, where cN and pN are wholly different schemes.
 */
export function specFor(site, axis, basis) {
  const a = site.axes[axis];
  if (!a) return null;
  return a.shared || a[basis] || null;
}

/** Stage-group rule list for a basis, falling back to a shared table. */
export function stageRulesFor(site, basis) {
  const g = site.stageGroups;
  return g.shared || g[basis] || null;
}

/** Which staging bases this site offers (some are clinical-only). */
export function basesFor(site) {
  return site.basis || ['clinical'];
}

/**
 * True when clinical and pathological would ask identical questions AND use
 * identical stage tables — in which case the app hides the basis toggle
 * entirely rather than spending a tap on a distinction without a difference.
 */
export function basisIsMeaningful(site) {
  const bases = basesFor(site);
  if (bases.length < 2) return false;
  const sameAxes = ['T', 'N', 'M'].every((axis) => {
    const a = site.axes[axis];
    return !a || !!a.shared;
  });
  const sameGroups = !!site.stageGroups.shared;
  return !(sameAxes && sameGroups);
}

/**
 * Format a TNM string with the c/p prefix conventions, leading with the
 * prefix once: cT4aN2bM0.
 *
 * The one case that cannot collapse is a pathological M0. AJCC defines no pM0
 * category, so M keeps its own 'c' and is split off — pT4aN2b cM0 — rather
 * than hidden inside a leading 'p' that would assert a category that does not
 * exist.
 */
export function formatTNM({ T, N, M }, basis) {
  const p = basis === 'pathological' ? 'p' : 'c';
  const mPrefix = p === 'p' && M === 'M0' ? 'c' : p;
  return mPrefix === p ? `${p}${T}${N}${M}` : `${p}${T}${N} ${mPrefix}${M}`;
}
