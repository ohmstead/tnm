// Site registry. Order here is the order shown in the picker: teaching order,
// roughly commonest first and following the anatomy from the lips backwards,
// with the rarer chapters last. Mucosal melanoma sits at the end.

import oropharynxHpv from './sites/oropharynx-hpv.js';
import nasopharynx from './sites/nasopharynx.js';
import salivary from './sites/salivary.js';
import oralCavity from './sites/oral-cavity.js';
import oropharynxP16neg from './sites/oropharynx-p16neg.js';
import hypopharynx from './sites/hypopharynx.js';
import larynx from './sites/larynx.js';
import sinonasal from './sites/sinonasal.js';
import cervicalUnknownPrimary from './sites/cervical-unknown-primary.js';
import mucosalMelanoma from './sites/mucosal-melanoma.js';
import cutaneous from './sites/cutaneous.js';
import thyroid from './sites/thyroid.js';

export const SITES = [
  oralCavity,
  oropharynxHpv,
  oropharynxP16neg,
  hypopharynx,
  larynx,
  salivary,
  thyroid,
  cutaneous,
  cervicalUnknownPrimary,
  nasopharynx,
  sinonasal,
  mucosalMelanoma
];

export const SITE_BY_ID = Object.fromEntries(SITES.map((s) => [s.id, s]));

/** The AJCC master table this app is pinned to. Update together with the data. */
export const AJCC_REFERENCE = {
  text: 'AJCC Current Staging System, revised 2026 — determines which chapters are 8th edition and which have moved to Version 9.',
  url: 'https://www.facs.org/media/c5ik5tkr/ajcc-current-staging-system-2026.pdf',
  checked: '2026-08-09'
};
