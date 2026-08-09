// Cervical nodes and unknown primary tumours of the head and neck
// — AJCC 8th edition (chapter 6).
//
// Still 8th edition as of August 2026.
//
// NOT DECK-VERIFIED: HN_staging.pptx contains no slide for this chapter.
// Content is taken from the AJCC's own physician-to-physician 8th edition
// head & neck staging material published by the American College of Surgeons.
//
// AJCC's routing rule for a metastatic cervical node with no identified
// primary, quoted from that material:
//   - p16-positive  -> staged as T0, N-appropriate, in the HPV-MEDIATED
//                      (p16+) OROPHARYNX chapter (Version 9)
//   - EBER-positive -> staged as T0, N-appropriate, in the NASOPHARYNX
//                      chapter (Version 9)
//   - EBER-negative AND p16-negative -> staged HERE, as T0, N-appropriate,
//                      with an ENE designation
// AJCC also states explicitly that a physician's assumption about the likely
// primary site is NOT used to choose the chapter.
//
// AJCC's own worked example for this chapter — a 2 cm submental node,
// no primary found, p16/EBER not done — is cT0 cN1 cM0 = clinical stage III.
// That case is asserted in test/selftest.js.

import {
  HN8_CLINICAL_N,
  HN8_PATHOLOGICAL_N,
  HN8_M,
  HN8_STAGE_GROUPS,
  HN8_CP_NOTE,
  withoutValues
} from '../common.js';

export default {
  id: 'cervical-unknown-primary',
  name: 'Cervical Nodes & Unknown Primary',
  short: 'Unknown primary',
  chapter: 6,
  deckVerified: false,
  edition: {
    version: 8,
    label: 'AJCC 8th edition',
    effective: '2018-01-01',
    note: 'This chapter has NOT moved to Version 9. The 8th edition remains in effect.'
  },
  citations: {
    ajcc: {
      text: 'AJCC Cancer Staging Manual, 8th edition, Chapter 6: Cervical Lymph Nodes and Unknown Primary Tumors of the Head and Neck',
      url: 'https://www.facs.org/media/c5ik5tkr/ajcc-current-staging-system-2026.pdf'
    },
    papers: [
      {
        text: 'Gress DM. AJCC 8th Edition Head & Neck Staging (Physician to Physician). American College of Surgeons / AJCC.',
        url: 'https://www.facs.org/media/i2kn34ed/head-and-neck-8th-ed.pdf'
      },
      {
        text: 'Lydiatt WM, Patel SG, O’Sullivan B, et al. Head and neck cancers — major changes in the AJCC eighth edition cancer staging manual. CA Cancer J Clin. 2017;67(2):122-137.',
        doi: '10.3322/caac.21389',
        url: 'https://acsjournals.onlinelibrary.wiley.com/doi/full/10.3322/caac.21389'
      }
    ],
    asProvided: null
  },
  basis: ['clinical', 'pathological'],
  basisNote: HN8_CP_NOTE,

  // The routing decision is the first and most important question for this
  // chapter, so it is asked before anything else.
  preQuestions: [
    {
      id: 'viral',
      prompt: 'p16 and EBER status of the node',
      help:
        'AJCC requires both tests before staging an unknown primary. The result decides which chapter applies — not the physician’s assumption about the likely primary site.',
      options: [
        {
          value: 'both-neg',
          label: 'EBER-negative AND p16-negative (or not done)',
          detail: 'Stage here, in the Cervical Nodes chapter, as T0 with an ENE designation.'
        },
        {
          value: 'p16-pos',
          label: 'p16-positive',
          detail: 'Stage in the HPV-associated oropharynx chapter (Version 9) as T0.',
          redirect: 'oropharynx-hpv'
        },
        {
          value: 'eber-pos',
          label: 'EBER-positive',
          detail: 'Stage in the nasopharynx chapter (Version 9) as T0.',
          redirect: 'nasopharynx'
        }
      ]
    }
  ],

  axes: {
    T: {
      shared: {
        kind: 'direct',
        prompt: 'Primary tumour (T)',
        help: 'By definition there is no identified primary in this chapter.',
        options: [
          {
            value: 'T0',
            label: 'T0',
            detail:
              'No primary tumour identified. T0 exists in the 8th edition only in this chapter, in EBV-related nasopharynx, in HPV-related oropharynx, and in salivary gland based on nodal histology.',
            source: 'AJCC 8th edition, cervical nodes & unknown primary, T0'
          }
        ]
      }
    },
    // N0 is deliberately not offered: this chapter exists only for metastatic
    // cervical adenopathy, so T0 N0 is not a stageable presentation and AJCC
    // defines no stage group for it.
    N: {
      clinical: withoutValues(HN8_CLINICAL_N, ['N0'], { nodes: ['none'] }),
      pathological: withoutValues(HN8_PATHOLOGICAL_N, ['N0'], { nodes: ['none'] })
    },
    M: { shared: HN8_M }
  },

  // The common 8th edition table, extended so that T0 behaves as T1-T3 do.
  // AJCC's own worked example (cT0 cN1 cM0 = stage III) confirms this.
  stageGroups: {
    shared: HN8_STAGE_GROUPS.map((rule) =>
      rule.T && rule.T.includes('T1') && rule.T.includes('T3')
        ? { ...rule, T: ['T0', ...rule.T] }
        : rule
    )
  },

  notes: [
    'Test p16 AND EBER before staging. p16-positive disease goes to the HPV-associated oropharynx chapter (Version 9) and EBER-positive disease to the nasopharynx chapter (Version 9) — both as T0. Only EBER-negative, p16-negative disease is staged here.',
    'AJCC is explicit that a physician’s assumption about the likely primary site is not used to choose the chapter. "Probably a floor-of-mouth primary" does not move the case to the oral cavity chapter.',
    'The same node can therefore be stage I, stage III, or a nasopharyngeal stage depending purely on two immunostains. This is the clearest illustration in head & neck staging of why biomarker status precedes anatomy.',
    HN8_CP_NOTE
  ]
};
