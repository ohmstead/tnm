// Nasal cavity and paranasal sinuses — AJCC 8th edition (chapter 12).
//
// Still 8th edition as of August 2026.
//
// NOT DECK-VERIFIED: HN_staging.pptx contains no sinonasal slide. T definitions
// come from NCI PDQ Paranasal Sinus and Nasal Cavity Cancer Treatment (Health
// Professional), AJCC 8th edition tables. Flagged in REVIEW.md.
//
// Two subsites with different T tables: maxillary sinus, and nasal cavity &
// ethmoid sinus. N, M and the stage groups are the common 8th edition tables.

import {
  HN8_CLINICAL_N,
  HN8_PATHOLOGICAL_N,
  HN8_M,
  HN8_STAGE_GROUPS,
  HN8_CP_NOTE
} from '../common.js';

const TIS = {
  value: 'Tis',
  forces: { N: 'N0', M: 'M0' },
  label: 'Tis',
  detail: 'Carcinoma in situ.',
  source: 'AJCC 8th edition, nasal cavity & paranasal sinuses, Tis'
};

// T4b is identical for both subsites.
const T4B = {
  value: 'T4b',
  label: 'T4b',
  detail:
    'Very advanced local disease. Tumour invades any of: orbital apex, dura, brain, middle cranial fossa, cranial nerves other than the maxillary division of the trigeminal nerve (V2), nasopharynx, or clivus.',
  source: 'AJCC 8th edition, nasal cavity & paranasal sinuses, T4b'
};

export default {
  id: 'sinonasal',
  name: 'Nasal Cavity and Paranasal Sinuses',
  short: 'Sinonasal',
  chapter: 12,
  deckVerified: false,
  edition: {
    version: 8,
    label: 'AJCC 8th edition',
    effective: '2018-01-01',
    note: 'This site has NOT moved to Version 9. The 8th edition remains in effect.'
  },
  citations: {
    ajcc: {
      text: 'AJCC Cancer Staging Manual, 8th edition, Chapter 12: Nasal Cavity and Paranasal Sinuses',
      url: 'https://www.facs.org/media/c5ik5tkr/ajcc-current-staging-system-2026.pdf'
    },
    papers: [
      {
        text: 'Lydiatt WM, Patel SG, O’Sullivan B, et al. Head and neck cancers — major changes in the AJCC eighth edition cancer staging manual. CA Cancer J Clin. 2017;67(2):122-137.',
        doi: '10.3322/caac.21389',
        url: 'https://acsjournals.onlinelibrary.wiley.com/doi/full/10.3322/caac.21389'
      },
      {
        text: 'Farrell NF, et al. Predictors of survival outcomes in sinonasal squamous cell carcinoma: an analysis of the National Cancer Database. Int Forum Allergy Rhinol. 2021.',
        doi: '10.1002/alr.22737',
        url: 'https://onlinelibrary.wiley.com/doi/abs/10.1002/alr.22737'
      }
    ],
    asProvided: null
  },
  basis: ['clinical', 'pathological'],
  basisNote: HN8_CP_NOTE,

  preQuestions: [
    {
      id: 'subsite',
      prompt: 'Subsite',
      options: [
        { value: 'maxillary', label: 'Maxillary sinus' },
        { value: 'nasoethmoid', label: 'Nasal cavity and ethmoid sinus' }
      ]
    }
  ],

  axes: {
    T: {
      shared: {
        kind: 'variant',
        on: 'subsite',
        specs: {
          maxillary: {
            kind: 'direct',
            prompt: 'Primary tumour (T) — maxillary sinus',
            options: [
              TIS,
              {
                value: 'T1',
                label: 'T1',
                detail:
                  'Tumour limited to the maxillary sinus mucosa, with no erosion or destruction of bone.',
                source: 'AJCC 8th edition, maxillary sinus T1'
              },
              {
                value: 'T2',
                label: 'T2',
                detail:
                  'Bone erosion or destruction, including extension into the hard palate and/or middle nasal meatus — EXCEPT extension to the posterior wall of the maxillary sinus and pterygoid plates.',
                source: 'AJCC 8th edition, maxillary sinus T2'
              },
              {
                value: 'T3',
                label: 'T3',
                detail:
                  'Tumour invades any of: bone of the posterior wall of the maxillary sinus, subcutaneous tissues, floor or medial wall of the orbit, pterygoid fossa, or ethmoid sinuses.',
                source: 'AJCC 8th edition, maxillary sinus T3'
              },
              {
                value: 'T4a',
                label: 'T4a',
                detail:
                  'Moderately advanced local disease. Tumour invades anterior orbital contents, skin of the cheek, pterygoid plates, infratemporal fossa, cribriform plate, or sphenoid or frontal sinuses.',
                source: 'AJCC 8th edition, maxillary sinus T4a'
              },
              T4B
            ]
          },
          nasoethmoid: {
            kind: 'direct',
            prompt: 'Primary tumour (T) — nasal cavity and ethmoid sinus',
            options: [
              TIS,
              {
                value: 'T1',
                label: 'T1',
                detail: 'Tumour restricted to any one subsite, with or without bony invasion.',
                source: 'AJCC 8th edition, nasal cavity & ethmoid T1'
              },
              {
                value: 'T2',
                label: 'T2',
                detail:
                  'Tumour invades two subsites in a single region, or extends to involve an adjacent region within the nasoethmoidal complex, with or without bony invasion.',
                source: 'AJCC 8th edition, nasal cavity & ethmoid T2'
              },
              {
                value: 'T3',
                label: 'T3',
                detail:
                  'Tumour extends to invade the medial wall or floor of the orbit, maxillary sinus, palate, or cribriform plate.',
                source: 'AJCC 8th edition, nasal cavity & ethmoid T3'
              },
              {
                value: 'T4a',
                label: 'T4a',
                detail:
                  'Moderately advanced local disease. Tumour invades any of: anterior orbital contents, skin of the nose or cheek, minimal extension to the anterior cranial fossa, pterygoid plates, or sphenoid or frontal sinuses.',
                source: 'AJCC 8th edition, nasal cavity & ethmoid T4a'
              },
              T4B
            ]
          }
        }
      }
    },
    N: { clinical: HN8_CLINICAL_N, pathological: HN8_PATHOLOGICAL_N },
    M: { shared: HN8_M }
  },

  stageGroups: { shared: HN8_STAGE_GROUPS },

  notes: [
    'The maxillary sinus and the nasal cavity/ethmoid complex have different T definitions. Pick the subsite first — the same anatomical finding can mean different T categories in each.',
    'Involvement of cranial nerve V2 (maxillary division of the trigeminal) does NOT make a tumour T4b; other cranial nerves do.',
    'The orbital APEX is T4b, while anterior orbital contents are T4a.',
    HN8_CP_NOTE
  ]
};
