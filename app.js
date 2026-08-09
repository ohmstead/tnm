// app.js — router, question flow, rendering.
//
// All staging logic lives in engine.js and data/. This file only decides what
// question to show next and how to draw it.

import { SITES, SITE_BY_ID, AJCC_REFERENCE } from './data/sites.js';
import { survivalFor } from './data/survival.js';
import {
  resolveSpec,
  resolveDerived,
  resolveStage,
  describeCategory,
  axisValues,
  specFor,
  stageRulesFor,
  basesFor,
  basisIsMeaningful,
  formatTNM
} from './engine.js';
import { AXES, nextQuestion, withForced, axisValue } from './flow.js';

const app = document.getElementById('app');
const tnmbar = document.getElementById('tnmbar');
const htitle = document.getElementById('htitle');
const backBtn = document.getElementById('back');


/* ------------------------------------------------------------------ *
 * State <-> URL
 * ------------------------------------------------------------------ */

// #/siteId/basis?pre.x=v&T.step=v&N.step=v&M._=M0
function readState() {
  const raw = location.hash.replace(/^#\/?/, '');
  const [path, query = ''] = raw.split('?');
  const [siteId, basis] = path.split('/').filter(Boolean);
  const params = new URLSearchParams(query);
  const st = { siteId, basis, pre: {}, T: {}, N: {}, M: {} };
  for (const [k, v] of params) {
    const [scope, key] = k.split('.');
    if (st[scope]) st[scope][key] = v;
  }
  return st;
}

function writeState(st, replace = false) {
  const params = new URLSearchParams();
  for (const scope of ['pre', 'T', 'N', 'M']) {
    for (const [k, v] of Object.entries(st[scope] || {})) params.set(`${scope}.${k}`, v);
  }
  const q = params.toString();
  const hash = `#/${[st.siteId, st.basis].filter(Boolean).join('/')}${q ? '?' + q : ''}`;
  if (replace) history.replaceState(null, '', hash);
  else location.hash = hash;
}

/* ------------------------------------------------------------------ *
 * Rendering helpers
 * ------------------------------------------------------------------ */

const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  );

function editionBadge(site) {
  const v9 = site.edition.version === 9;
  return `<span class="badge ${v9 ? 'v9' : 'e8'}">AJCC v${site.edition.version}</span>`;
}

function optionsHTML(options) {
  return options
    .map(
      (o) => `<button class="opt" data-value="${esc(o.value)}">
        <span class="ol">${esc(o.label)}</span>
        ${o.detail ? `<span class="od">${esc(o.detail)}</span>` : ''}
      </button>`
    )
    .join('');
}

function citationsHTML(site) {
  const c = site.citations;
  let html = `<div class="card"><h3>Sources</h3>`;
  html += `<p class="cite"><b>Staging system:</b> ${esc(c.ajcc.text)}${
    c.ajcc.url ? ` — <a href="${esc(c.ajcc.url)}" target="_blank" rel="noopener">source</a>` : ''
  }</p>`;
  for (const p of c.papers) {
    html += `<p class="cite"><b>Publication:</b> ${esc(p.text)}${
      p.doi ? ` doi:${esc(p.doi)}` : ''
    }${p.url ? ` — <a href="${esc(p.url)}" target="_blank" rel="noopener">link</a>` : ''}</p>`;
  }
  if (c.sourcingNote) html += `<p class="cite"><em>${esc(c.sourcingNote)}</em></p>`;
  html += `<p class="cite"><b>Up to date:</b> <a href="${esc(
    AJCC_REFERENCE.url
  )}" target="_blank" rel="noopener">AJCC Current Staging System (2026)</a>, checked ${esc(
    AJCC_REFERENCE.checked
  )}.</p>`;
  return html + `</div>`;
}

function survivalHTML(site, basis, stage) {
  const s = survivalFor(site.id, basis);
  if (!s) return '';
  const estimate = s.stages?.[stage];
  let html = `<div class="card"><h3>Survival — stage ${esc(stage)}</h3>`;
  html += `<img class="survival" alt="Survival curve by stage — ${esc(
    s.figure
  )}" src="assets/survival/${esc(s.key)}.png"
      onerror="this.remove();document.getElementById('sv-missing-${esc(s.key)}').hidden=false">`;
  html += `<p class="cite" id="sv-missing-${esc(s.key)}" hidden style="margin-top:10px">
      <em>Figure not bundled. ${esc(s.figure)} — see the source below.</em></p>`;
  if (estimate) {
    html += `<p class="why" style="margin-top:10px"><b>${esc(estimate)}</b> for stage ${esc(
      stage
    )} (${esc(s.endpoint)}${s.cohort ? `; ${esc(s.cohort)}` : ''}).</p>`;
  } else {
    html += `<p class="cite" style="margin-top:10px">Endpoint: ${esc(s.endpoint)}${
      s.cohort ? ` — ${esc(s.cohort)}` : ''
    }.</p>`;
  }
  if (s.stagesNote) html += `<p class="cite">${esc(s.stagesNote)}</p>`;
  if (s.note) html += `<p class="cite">${esc(s.note)}</p>`;
  if (s.pending) html += `<p class="cite"><em>${esc(s.pending)}</em></p>`;
  html += `<p class="cite">${esc(s.citation)} — <a href="${esc(
    s.url
  )}" target="_blank" rel="noopener">source figure</a></p>`;
  return html + `</div>`;
}

const DISCLAIMER = `<p class="disclaimer"><b>Educational use only.</b> This tool is a study aid for
learning AJCC staging rules. It is not a clinical decision support system and must not be used to
stage a real patient. Always confirm against the current AJCC Cancer Staging Manual or protocol.</p>`;

/* ------------------------------------------------------------------ *
 * Screens
 * ------------------------------------------------------------------ */

function renderPicker() {
  htitle.textContent = 'H&N Staging';
  backBtn.hidden = true;
  tnmbar.innerHTML = '';

  app.innerHTML = `
    <div class="sitelist" id="sitelist">
      ${SITES.map(
        // Badge is a sibling of the name, not inside it, so the name can
        // ellipsis without taking the badge with it.
        (s) => `<button class="opt" data-site="${esc(s.id)}">
          <span class="ol">${esc(s.name)}</span>${editionBadge(s)}
        </button>`
      ).join('')}
    </div>
    ${DISCLAIMER}`;

  app.querySelectorAll('[data-site]').forEach((el) =>
    el.addEventListener('click', () => {
      writeState({ siteId: el.dataset.site, pre: {}, T: {}, N: {}, M: {} });
    })
  );
}

function renderTnmBar(site, st) {
  const basis = st.basis || basesFor(site)[0];
  const vals = withForced(site, st);
  const chips = [];
  if (basisIsMeaningful(site) && st.basis) {
    chips.push(
      `<button class="tnmchip" data-clear="basis">${basis === 'pathological' ? 'pTNM' : 'cTNM'}</button>`
    );
  }
  for (const axis of AXES) {
    const v = vals[axis];
    chips.push(
      v
        ? `<button class="tnmchip" data-clear="${axis}">${esc(v)}</button>`
        : `<button class="tnmchip" disabled>${axis}</button>`
    );
  }
  tnmbar.innerHTML = chips.join('');
  tnmbar.querySelectorAll('[data-clear]').forEach((el) =>
    el.addEventListener('click', () => {
      const scope = el.dataset.clear;
      const next = { ...st };
      if (scope === 'basis') {
        next.basis = undefined;
        next.T = {};
        next.N = {};
        next.M = {};
      } else {
        // Clearing an axis also clears the ones after it, since a later
        // answer may no longer be reachable.
        const from = AXES.indexOf(scope);
        AXES.slice(from).forEach((a) => (next[a] = {}));
      }
      writeState(next);
    })
  );
}

function renderQuestion(site, st, next) {
  const isPre = next.kind === 'pre';
  const isBasis = next.kind === 'basis';

  let prompt, help, options;
  if (isPre) {
    prompt = next.q.prompt;
    help = next.q.help;
    options = next.q.options;
  } else if (isBasis) {
    prompt = 'Staging basis';
    help = site.basisNote;
    options = basesFor(site).map((b) => ({
      value: b,
      label: b === 'clinical' ? 'Clinical (cTNM)' : 'Pathological (pTNM)',
      detail:
        b === 'clinical'
          ? 'Examination, imaging and biopsy, before definitive treatment.'
          : 'After resection and neck dissection, using the specimen.'
    }));
  } else {
    prompt = next.step.prompt;
    help = next.step.help;
    options = next.step.options;
  }

  // Chapters selected by a biomarker warn about it before the first answer.
  const firstStep = !Object.keys(st.pre).length && !st.basis && !axisValue(site, st, 'T');
  const requiresHTML =
    site.requires && firstStep
      ? `<div class="note"><b>Check the biomarker first.</b> ${esc(site.requires.text)}
         <a href="#/${esc(site.requires.otherSite)}">Switch to the other chapter</a>.</div>`
      : '';

  app.innerHTML = `
    ${requiresHTML}
    <div class="prompt">${esc(prompt)}</div>
    ${help ? `<p class="help">${esc(help)}</p>` : ''}
    <div class="opts" role="group">${optionsHTML(options)}</div>`;

  app.querySelectorAll('.opt').forEach((el) =>
    el.addEventListener('click', () => {
      const value = el.dataset.value;
      const opt = options.find((o) => o.value === value);
      const s = { ...st, pre: { ...st.pre }, T: { ...st.T }, N: { ...st.N }, M: { ...st.M } };

      if (opt?.redirect) {
        // e.g. a p16-positive unknown primary belongs in another chapter.
        writeState({ siteId: opt.redirect, pre: {}, T: {}, N: {}, M: {} });
        return;
      }
      if (isPre) s.pre[next.q.id] = value;
      else if (isBasis) s.basis = value;
      else s[next.axis][next.step.id] = value;
      writeState(s);
    })
  );
}

/**
 * Re-resolve every axis under the OTHER staging basis, reusing the same raw
 * answers. This works for the 8th edition sites because their clinical and
 * pathological N specs ask identical questions (node laterality, size, ENE)
 * and only differ in how they map the answers to a category — which is exactly
 * the point worth showing a student. Returns null when the two bases ask
 * different questions (AJCC v9 HPV-associated oropharynx), because there the
 * answers are not comparable and inventing a comparison would mislead.
 */
function crossBasis(site, st, otherBasis) {
  const vals = {};
  for (const axis of AXES) {
    const spec = resolveSpec(specFor(site, axis, otherBasis), st.pre);
    if (!spec) return null;
    if (spec.kind === 'direct') {
      const v = st[axis]._;
      if (!v || !axisValues(spec).includes(v)) return null;
      vals[axis] = v;
    } else {
      const got = resolveDerived(spec, st[axis]);
      if (!got) return null;
      vals[axis] = got.value;
    }
  }
  const res = resolveStage(stageRulesFor(site, otherBasis), { ...vals, pre: st.pre });
  return res ? { res, vals } : null;
}

function renderResult(site, st) {
  const basis = st.basis || basesFor(site)[0];
  const vals = withForced(site, st);
  const rules = stageRulesFor(site, basis);
  const result = resolveStage(rules, { ...vals, pre: st.pre });

  if (!result) {
    app.innerHTML = `<div class="note"><b>No stage group defined.</b> AJCC defines no prognostic
      stage for ${esc(formatTNM(vals, basis))} in this chapter. This is a gap in the app's data —
      please report it.</div>`;
    return;
  }

  // Where clinical and pathological can differ, compute both and show them
  // side by side when they disagree — the c/p alignment question.
  let cpHTML = '';
  if (basisIsMeaningful(site) && basesFor(site).length === 2) {
    const other = basis === 'clinical' ? 'pathological' : 'clinical';
    const cross = crossBasis(site, st, other);
    if (cross && cross.res.stage !== result.stage) {
      const boxes = [
        { label: 'Clinical', b: basis === 'clinical' ? basis : other },
        { label: 'Pathological', b: basis === 'pathological' ? basis : other }
      ].map(({ label, b }) => {
        const isCurrent = b === basis;
        const stage = isCurrent ? result.stage : cross.res.stage;
        const tnm = formatTNM(isCurrent ? vals : cross.vals, b);
        return `<div class="cpbox"><div class="stagelabel">${label}</div>
          <div class="stage">${esc(stage)}</div>
          <div class="cite" style="margin:4px 0 0">${esc(tnm)}</div></div>`;
      });
      cpHTML = `<div class="cp">${boxes.join('')}</div>
        <div class="note"><b>Clinical and pathological stage differ here.</b>
        The same findings give ${esc(formatTNM(vals, basis))} = stage ${esc(result.stage)} on one
        basis and ${esc(formatTNM(cross.vals, other))} = stage ${esc(cross.res.stage)} on the other.
        ${esc(site.basisNote || '')}</div>`;
    }
  }

  // Quote the criteria that were actually met for each category.
  const criteria = AXES.map((axis) => {
    const spec = resolveSpec(specFor(site, axis, basis), st.pre);
    const d = describeCategory(spec, vals[axis]);
    return d?.detail
      ? `<p class="why"><b>${esc(vals[axis])}</b> — ${esc(d.detail)}</p>`
      : `<p class="why"><b>${esc(vals[axis])}</b></p>`;
  }).join('');

  const preSummary = Object.entries(st.pre)
    .map(([k, v]) => {
      const q = (site.preQuestions || []).find((x) => x.id === k);
      const o = q?.options.find((x) => x.value === v);
      return o ? `${esc(q.prompt)}: <b>${esc(o.label)}</b>` : '';
    })
    .filter(Boolean)
    .join(' · ');

  htitle.textContent = site.short;

  app.innerHTML = `
    <div class="stagecard">
      <div class="stagelabel">Prognostic</div>
      <div class="stagedash" aria-hidden="true"></div>
      <div class="stagelabel">TNM</div>
      <div class="stage">Stage ${esc(result.stage)}</div>
      <div class="stagedash" aria-hidden="true">—</div>
      <div class="stage tnm">${esc(formatTNM(vals, basis))}</div>
    </div>
    ${cpHTML}
    ${site.stageGroupCaveat ? `<div class="note"><b>Check this stage label.</b> ${esc(site.stageGroupCaveat)}</div>` : ''}

    ${survivalHTML(site, basis, result.stage)}

    <div class="card">
      <h3>Why this stage</h3>
      ${preSummary ? `<p class="why">${preSummary}</p>` : ''}
      ${criteria}
      <div class="rule">${esc(result.rule.source)}</div>
    </div>

    ${
      site.notes?.length
        ? `<div class="card"><h3>Notes &amp; pitfalls</h3>
           <ul class="notes">${site.notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul></div>`
        : ''
    }

    ${citationsHTML(site)}

    <div class="btnrow">
      <button class="btn primary" id="again">Stage another</button>
      <button class="btn" id="restart">Change site</button>
    </div>
    ${DISCLAIMER}`;

  document
    .getElementById('again')
    .addEventListener('click', () => writeState({ siteId: site.id, pre: {}, T: {}, N: {}, M: {} }));
  document.getElementById('restart').addEventListener('click', () => {
    location.hash = '#/';
  });
}

/* ------------------------------------------------------------------ *
 * Router
 * ------------------------------------------------------------------ */

function render() {
  const st = readState();
  const site = SITE_BY_ID[st.siteId];

  if (!site) {
    renderPicker();
    return;
  }

  htitle.innerHTML = `${esc(site.short)}${editionBadge(site)}`;
  backBtn.hidden = false;
  renderTnmBar(site, st);

  const next = nextQuestion(site, st);
  if (next) {
    renderQuestion(site, st, next);
    window.scrollTo(0, 0);
  } else {
    renderResult(site, st);
    window.scrollTo(0, 0);
  }
}

backBtn.addEventListener('click', () => history.back());
window.addEventListener('hashchange', render);
render();

// Offline support: the whole app is static, so cache the shell aggressively.
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
