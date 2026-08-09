// Larynx — AJCC 8th edition (chapter 13).
//
// Still 8th edition as of August 2026 (AJCC Current Staging System 2026 table,
// chapter 13, edition 8).
//
// T definitions transcribed from the AJCC 8th edition larynx staging form
// reproduced on slide 6 of HN_staging.pptx, and cross-checked against
// NCI PDQ Laryngeal Cancer Treatment (Health Professional) AJCC 8e tables.
//
// NOTE ON SOURCING: slide 6 cited dl.icdst.org, an unofficial PDF mirror. That
// URL is not cited here; the content was verified against NCI PDQ and the AJCC
// staging form instead.
//
// The larynx has three subsites with genuinely different T criteria, so T is
// modelled as a variant keyed on subsite. N, M and the stage groups are the
// common 8th edition head & neck tables.

import {
  HN8_CLINICAL_N,
  HN8_PATHOLOGICAL_N,
  HN8_M,
  HN8_STAGE_GROUPS,
  HN8_CP_NOTE
} from '../common.js';

const SHARED_T4 = [
  {
    value: 'T4a',
    label: 'T4a',
    detail:
      'Moderately advanced local disease. Tumour invades through the outer cortex of the thyroid cartilage and/or invades tissues beyond the larynx (trachea, soft tissues of the neck including deep extrinsic muscle of the tongue, strap muscles, thyroid, or oesophagus).',
    source: 'AJCC 8th edition larynx staging form, T4a'
  },
  {
    value: 'T4b',
    label: 'T4b',
    detail:
      'Very advanced local disease. Tumour invades the prevertebral space, encases the carotid artery, or invades mediastinal structures.',
    source: 'AJCC 8th edition larynx staging form, T4b'
  }
];

const TIS = {
  value: 'Tis',
  forces: { N: 'N0', M: 'M0' },
  label: 'Tis',
  detail: 'Carcinoma in situ.',
  source: 'AJCC 8th edition larynx staging form, Tis'
};

export default {
  id: 'larynx',
  name: 'Larynx',
  short: 'Larynx',
  chapter: 13,
  edition: {
    version: 8,
    label: 'AJCC 8th edition',
    effective: '2018-01-01',
    note: 'This site has NOT moved to Version 9. The 8th edition remains in effect.'
  },
  citations: {
    ajcc: {
      text: 'AJCC Cancer Staging Manual, 8th edition, Chapter 13: Larynx',
      url: 'https://www.facs.org/media/c5ik5tkr/ajcc-current-staging-system-2026.pdf'
    },
    papers: [
      {
        text: 'Lydiatt WM, Patel SG, O’Sullivan B, et al. Head and neck cancers — major changes in the AJCC eighth edition cancer staging manual. CA Cancer J Clin. 2017;67(2):122-137.',
        doi: '10.3322/caac.21389',
        url: 'https://acsjournals.onlinelibrary.wiley.com/doi/full/10.3322/caac.21389'
      },
      {
        text: 'NCI PDQ: Laryngeal Cancer Treatment (Health Professional Version) — AJCC 8th edition staging tables.',
        url: 'https://www.cancer.gov/types/head-and-neck/hp/adult/laryngeal-treatment-pdq'
      }
    ],
    asProvided: null,
    sourcingNote:
      'The staging content here was verified against NCI PDQ and the AJCC 8th edition staging form.'
  },
  basis: ['clinical', 'pathological'],
  basisNote: HN8_CP_NOTE,

  preQuestions: [
    {
      id: 'subsite',
      prompt: 'Laryngeal subsite',
      options: [
        { value: 'supraglottis', label: 'Supraglottis' },
        { value: 'glottis', label: 'Glottis' },
        { value: 'subglottis', label: 'Subglottis' }
      ]
    }
  ],

  axes: {
    T: {
      shared: {
        kind: 'variant',
        on: 'subsite',
        specs: {
          supraglottis: {
            kind: 'direct',
            prompt: 'Primary tumour (T) — supraglottis',
            options: [
              TIS,
              {
                value: 'T1',
                label: 'T1',
                detail: 'Tumour limited to one subsite of the supraglottis with normal vocal cord mobility.',
                source: 'AJCC 8th edition larynx staging form, supraglottis T1'
              },
              {
                value: 'T2',
                label: 'T2',
                detail:
                  'Tumour invades mucosa of more than one adjacent subsite of the supraglottis or glottis, or a region outside the supraglottis (e.g. mucosa of base of tongue, vallecula, medial wall of pyriform sinus), WITHOUT fixation of the larynx.',
                source: 'AJCC 8th edition larynx staging form, supraglottis T2'
              },
              {
                value: 'T3',
                label: 'T3',
                detail:
                  'Tumour limited to the larynx with vocal cord fixation, and/or invades any of: postcricoid area, pre-epiglottic space, paraglottic space, and/or inner cortex of the thyroid cartilage.',
                source: 'AJCC 8th edition larynx staging form, supraglottis T3'
              },
              ...SHARED_T4
            ]
          },
          glottis: {
            kind: 'direct',
            prompt: 'Primary tumour (T) — glottis',
            options: [
              TIS,
              {
                value: 'T1a',
                label: 'T1a',
                detail: 'Tumour limited to one vocal cord, with normal mobility.',
                source: 'AJCC 8th edition larynx staging form, glottis T1a'
              },
              {
                value: 'T1b',
                label: 'T1b',
                detail: 'Tumour involves both vocal cords, with normal mobility.',
                source: 'AJCC 8th edition larynx staging form, glottis T1b'
              },
              {
                value: 'T2',
                label: 'T2',
                detail:
                  'Tumour extends to the supraglottis and/or subglottis, and/or with impaired vocal cord mobility.',
                source: 'AJCC 8th edition larynx staging form, glottis T2'
              },
              {
                value: 'T3',
                label: 'T3',
                detail:
                  'Tumour limited to the larynx with vocal cord fixation, and/or invasion of the paraglottic space, and/or inner cortex of the thyroid cartilage.',
                source: 'AJCC 8th edition larynx staging form, glottis T3'
              },
              ...SHARED_T4
            ]
          },
          subglottis: {
            kind: 'direct',
            prompt: 'Primary tumour (T) — subglottis',
            options: [
              TIS,
              {
                value: 'T1',
                label: 'T1',
                detail: 'Tumour limited to the subglottis.',
                source: 'AJCC 8th edition larynx staging form, subglottis T1'
              },
              {
                value: 'T2',
                label: 'T2',
                detail: 'Tumour extends to the vocal cord(s) with normal or impaired mobility.',
                source: 'AJCC 8th edition larynx staging form, subglottis T2'
              },
              {
                value: 'T3',
                label: 'T3',
                detail:
                  'Tumour limited to the larynx with vocal cord fixation, and/or invasion of the paraglottic space, and/or inner cortex of the thyroid cartilage.',
                source: 'AJCC 8th edition larynx staging form, subglottis T3'
              },
              {
                value: 'T4a',
                label: 'T4a',
                detail:
                  'Moderately advanced local disease. Tumour invades the cricoid or thyroid cartilage and/or invades tissues beyond the larynx (trachea, soft tissues of the neck including deep extrinsic muscles of the tongue, strap muscles, thyroid, or oesophagus).',
                source: 'AJCC 8th edition larynx staging form, subglottis T4a'
              },
              SHARED_T4[1]
            ]
          }
        }
      }
    },
    N: { clinical: HN8_CLINICAL_N, pathological: HN8_PATHOLOGICAL_N },
    M: { shared: HN8_M }
  },

  // T1a and T1b behave as T1 in the stage table; the split carries no stage
  // consequence but is recorded in the TNM string.
  stageGroups: {
    shared: HN8_STAGE_GROUPS.map((rule) =>
      rule.T && rule.T.includes('T1') ? { ...rule, T: [...rule.T, 'T1a', 'T1b'] } : rule
    )
  },

  notes: [
    'Glottic T1 is subdivided into T1a (one cord) and T1b (both cords). Both are stage I when N0 M0 — the split records extent, not stage.',
    'Inner cortex of the thyroid cartilage is T3; through the outer cortex is T4a. This single distinction separates a larynx-preservation candidate from moderately advanced disease.',
    'The subglottic T4a criterion differs from the supraglottic and glottic one: it names the cricoid cartilage explicitly.',
    HN8_CP_NOTE
  ]
};
