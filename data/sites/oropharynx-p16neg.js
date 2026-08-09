// Oropharynx, p16-negative (non–HPV-associated) — AJCC 8th edition (chapter 11).
//
// Still 8th edition as of August 2026 (AJCC Current Staging System 2026 table,
// chapter 11, edition 8). Only the p16-POSITIVE oropharynx chapter moved to
// Version 9 — this one did not.
//
// Transcribed from the AJCC 8th edition tables reproduced on slide 4 of
// HN_staging.pptx (Tables 4 and 5), cross-checked against NCI PDQ
// Oropharyngeal Cancer Treatment (Health Professional).
//
// NOTE ON SOURCING: slide 4 cited cancernetwork.com, a trade publication. That
// link is retained below only as the "as provided" reference; the staging
// content is cited to AJCC 8e and NCI PDQ.

import {
  HN8_CLINICAL_N,
  HN8_PATHOLOGICAL_N,
  HN8_M,
  HN8_STAGE_GROUPS,
  HN8_CP_NOTE
} from '../common.js';

export default {
  id: 'oropharynx-p16neg',
  name: 'Oropharynx — p16-',
  short: 'Oropharynx p16−',
  chapter: 11,
  edition: {
    version: 8,
    label: 'AJCC 8th edition',
    effective: '2018-01-01',
    note: 'This site has NOT moved to Version 9. Only the p16-POSITIVE oropharynx chapter did.'
  },
  citations: {
    ajcc: {
      text: 'AJCC Cancer Staging Manual, 8th edition, Chapter 11: Oropharynx (p16−) and Hypopharynx',
      url: 'https://www.facs.org/media/c5ik5tkr/ajcc-current-staging-system-2026.pdf'
    },
    papers: [
      {
        text: 'Lydiatt WM, Patel SG, O’Sullivan B, et al. Head and neck cancers — major changes in the AJCC eighth edition cancer staging manual. CA Cancer J Clin. 2017;67(2):122-137.',
        doi: '10.3322/caac.21389',
        url: 'https://acsjournals.onlinelibrary.wiley.com/doi/full/10.3322/caac.21389'
      },
      {
        text: 'NCI PDQ: Oropharyngeal Cancer Treatment (Health Professional Version) — AJCC 8th edition staging tables.',
        url: 'https://www.cancer.gov/types/head-and-neck/hp/adult/oropharyngeal-treatment-pdq'
      }
    ],
    asProvided: {
      text: 'Source URL provided on slide 4 of HN_staging.pptx (trade publication; content verified independently)',
      url: 'https://www.cancernetwork.com/view/emergence-novel-staging-system-oropharyngeal-squamous-cell-carcinoma-based-hpv-status'
    }
  },
  basis: ['clinical', 'pathological'],
  basisNote: HN8_CP_NOTE,

  requires: {
    id: 'p16',
    text: 'This chapter applies only to p16-negative oropharyngeal carcinoma. p16-positive disease uses the AJCC Version 9 HPV-associated chapter, which has different N categories and different stage groups.',
    otherSite: 'oropharynx-hpv'
  },

  axes: {
    T: {
      shared: {
        kind: 'direct',
        prompt: 'Primary tumour (T)',
        options: [
          {
            value: 'Tis',
            forces: { N: 'N0', M: 'M0' },
            label: 'Tis',
            detail: 'Carcinoma in situ.',
            source: 'AJCC 8th edition, p16− oropharynx T category'
          },
          {
            value: 'T1',
            label: 'T1',
            detail: 'Tumour ≤2 cm in greatest dimension.',
            source: 'AJCC 8th edition, p16− oropharynx T1'
          },
          {
            value: 'T2',
            label: 'T2',
            detail: 'Tumour >2 cm but ≤4 cm in greatest dimension.',
            source: 'AJCC 8th edition, p16− oropharynx T2'
          },
          {
            value: 'T3',
            label: 'T3',
            detail: 'Tumour >4 cm in greatest dimension, or extension to the lingual surface of the epiglottis.',
            source: 'AJCC 8th edition, p16− oropharynx T3'
          },
          {
            value: 'T4a',
            label: 'T4a',
            detail:
              'Moderately advanced local disease. Tumour invades the larynx, extrinsic tongue muscles, medial pterygoid, hard palate, or mandible.',
            source: 'AJCC 8th edition, p16− oropharynx T4a'
          },
          {
            value: 'T4b',
            label: 'T4b',
            detail:
              'Very advanced local disease. Tumour invades the lateral pterygoid muscle, pterygoid plates, lateral nasopharynx, or skull base, or encases the carotid artery.',
            source: 'AJCC 8th edition, p16− oropharynx T4b'
          }
        ]
      }
    },
    N: { clinical: HN8_CLINICAL_N, pathological: HN8_PATHOLOGICAL_N },
    M: { shared: HN8_M }
  },

  stageGroups: { shared: HN8_STAGE_GROUPS },

  notes: [
    'p16 status decides which chapter you are in, and the two systems are not comparable. A p16-positive tumour with contralateral nodes is stage II under Version 9; the same anatomy p16-negative is stage IVA under the 8th edition.',
    'Unlike the p16-positive system, this chapter has Tis and splits T4 into T4a and T4b.',
    HN8_CP_NOTE
  ]
};
