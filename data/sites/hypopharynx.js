// Hypopharynx — AJCC 8th edition (chapter 11).
//
// Still 8th edition as of August 2026. Shares chapter 11 (and the common
// nodal scheme and stage-group table) with p16-negative oropharynx, but has
// its own T definitions.
//
// NOT DECK-VERIFIED: HN_staging.pptx contains no hypopharynx slide. The T
// definitions below come from NCI PDQ Hypopharyngeal Cancer Treatment
// (Health Professional), AJCC 8th edition tables. Flagged in REVIEW.md.

import {
  HN8_CLINICAL_N,
  HN8_PATHOLOGICAL_N,
  HN8_M,
  HN8_STAGE_GROUPS,
  HN8_CP_NOTE
} from '../common.js';

export default {
  id: 'hypopharynx',
  name: 'Hypopharynx',
  short: 'Hypopharynx',
  chapter: 11,
  deckVerified: false,
  edition: {
    version: 8,
    label: 'AJCC 8th edition',
    effective: '2018-01-01',
    note: 'This site has NOT moved to Version 9. The 8th edition remains in effect.'
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
        text: 'Lin C, et al. Comparing the 7th and 8th Editions of AJCC Staging System for Hypopharyngeal Cancer Undergoing Surgery. Otolaryngol Head Neck Surg. 2025.',
        doi: '10.1002/ohn.1311',
        url: 'https://aao-hnsfjournals.onlinelibrary.wiley.com/doi/10.1002/ohn.1311'
      }
    ],
    asProvided: null
  },
  basis: ['clinical', 'pathological'],
  basisNote: HN8_CP_NOTE,

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
            source: 'AJCC 8th edition, hypopharynx T category'
          },
          {
            value: 'T1',
            label: 'T1',
            detail: 'Tumour limited to one subsite of the hypopharynx and/or ≤2 cm in greatest dimension.',
            source: 'AJCC 8th edition, hypopharynx T1'
          },
          {
            value: 'T2',
            label: 'T2',
            detail:
              'Tumour invades more than one subsite of the hypopharynx or an adjacent site, or measures >2 cm but ≤4 cm, WITHOUT fixation of the hemilarynx.',
            source: 'AJCC 8th edition, hypopharynx T2'
          },
          {
            value: 'T3',
            label: 'T3',
            detail:
              'Tumour >4 cm in greatest dimension, or with fixation of the hemilarynx, or extension to the oesophageal mucosa.',
            source: 'AJCC 8th edition, hypopharynx T3'
          },
          {
            value: 'T4a',
            label: 'T4a',
            detail:
              'Moderately advanced local disease. Tumour invades the thyroid or cricoid cartilage, hyoid bone, thyroid gland, oesophageal muscle, or central compartment soft tissue.',
            source: 'AJCC 8th edition, hypopharynx T4a'
          },
          {
            value: 'T4b',
            label: 'T4b',
            detail:
              'Very advanced local disease. Tumour invades the prevertebral fascia, encases the carotid artery, or involves mediastinal structures.',
            source: 'AJCC 8th edition, hypopharynx T4b'
          }
        ]
      }
    },
    N: { clinical: HN8_CLINICAL_N, pathological: HN8_PATHOLOGICAL_N },
    M: { shared: HN8_M }
  },

  stageGroups: { shared: HN8_STAGE_GROUPS },

  notes: [
    'Fixation of the hemilarynx makes a tumour T3 regardless of size.',
    'Central compartment soft tissue involvement is T4a; prevertebral fascia and carotid encasement are T4b.',
    HN8_CP_NOTE
  ]
};
