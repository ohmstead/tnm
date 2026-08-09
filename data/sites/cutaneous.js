// Cutaneous carcinoma of the head and neck — AJCC 8th edition (chapter 15).
//
// Still 8th edition as of August 2026.
//
// Covers all non-melanoma skin carcinomas of the head and neck EXCEPT Merkel
// cell carcinoma. Primary sites: skin of lip, external ear, face, scalp and
// neck. Per AJCC, the VERMILION LIP is staged here and is excluded from the
// oral cavity chapter.
//
// T and nodal definitions transcribed from slide 11 of HN_staging.pptx and
// cross-checked against the AJCC 8th edition physician-to-physician material
// (ACS), which states the T category is based on greatest dimension, invasion
// >6 mm or into subcutaneous tissue, perineural invasion, and bone invasion.
// The nodal categories mirror the common head & neck nodal scheme.
//
// SEE `stageGroupCaveat` BELOW — the IVA/IVB subdivision could not be
// confirmed against a primary AJCC source and is flagged for faculty review.

import { HN8_CLINICAL_N, HN8_PATHOLOGICAL_N, HN8_M, HN8_CP_NOTE } from '../common.js';

export default {
  id: 'cutaneous',
  name: 'Cutaneous Carcinoma',
  short: 'Cutaneous carcinoma',
  chapter: 15,
  edition: {
    version: 8,
    label: 'AJCC 8th edition',
    effective: '2018-01-01',
    note: 'This site has NOT moved to Version 9. The 8th edition remains in effect.'
  },
  citations: {
    ajcc: {
      text: 'AJCC Cancer Staging Manual, 8th edition, Chapter 15: Cutaneous Carcinoma of the Head and Neck',
      url: 'https://www.facs.org/media/c5ik5tkr/ajcc-current-staging-system-2026.pdf'
    },
    papers: [
      {
        text: 'Karia PS, et al. Comparison of Tumor Classifications for Cutaneous Squamous Cell Carcinoma of the Head and Neck in the 7th vs 8th Edition of the AJCC Cancer Staging Manual. JAMA Dermatol. 2018.',
        pmid: '29261835',
        url: 'https://pubmed.ncbi.nlm.nih.gov/29261835/'
      },
      {
        text: 'Gress DM. AJCC 8th Edition Head & Neck Staging (Physician to Physician). American College of Surgeons / AJCC.',
        url: 'https://www.facs.org/media/i2kn34ed/head-and-neck-8th-ed.pdf'
      }
    ],
    asProvided: {
      text: 'Source URLs provided on slide 11 of HN_staging.pptx (tertiary references; content cited to AJCC 8e)',
      url: 'https://radiopaedia.org/articles/cutaneous-carcinoma-of-the-head-and-neck-staging?lang=us'
    }
  },
  basis: ['clinical', 'pathological'],
  basisNote:
    'Clinical criteria apply to patients treated non-surgically, without neck dissection. Pathological criteria apply when multiple whole lymph nodes are available for microscopic evaluation. ' +
    HN8_CP_NOTE,

  axes: {
    T: {
      shared: {
        kind: 'direct',
        prompt: 'Primary tumour (T)',
        help:
          'T3 is reached by ANY ONE of four high-risk features — size, minor bone erosion, perineural invasion, or deep invasion. Check all four before settling on T1 or T2.',
        options: [
          {
            value: 'Tis',
            forces: { N: 'N0', M: 'M0' },
            label: 'Tis',
            detail: 'Carcinoma in situ.',
            source: 'AJCC 8th edition, cutaneous carcinoma Tis'
          },
          {
            value: 'T1',
            label: 'T1',
            detail: 'Tumour ≤2 cm in greatest dimension, with none of the T3 high-risk features.',
            source: 'AJCC 8th edition, cutaneous carcinoma T1'
          },
          {
            value: 'T2',
            label: 'T2',
            detail:
              'Tumour >2 cm and ≤4 cm in greatest dimension, with none of the T3 high-risk features.',
            source: 'AJCC 8th edition, cutaneous carcinoma T2'
          },
          {
            value: 'T3',
            label: 'T3',
            detail:
              'Any one of: tumour >4 cm; minor bone erosion; perineural invasion (clinical or radiographic involvement of named nerves without skull base invasion, or tumour infiltrating the nerve sheath deeper than the dermis or ≥0.1 mm in calibre); or deep invasion (beyond the subcutaneous fat, or >6 mm from the granular layer of adjacent epidermis to the tumour base).',
            source: 'AJCC 8th edition, cutaneous carcinoma T3'
          },
          {
            value: 'T4a',
            label: 'T4a',
            detail: 'Gross cortical bone or marrow invasion.',
            source: 'AJCC 8th edition, cutaneous carcinoma T4a'
          },
          {
            value: 'T4b',
            label: 'T4b',
            detail: 'Skull base invasion and/or involvement of a skull base foramen.',
            source: 'AJCC 8th edition, cutaneous carcinoma T4b'
          }
        ]
      }
    },
    N: { clinical: HN8_CLINICAL_N, pathological: HN8_PATHOLOGICAL_N },
    M: { shared: HN8_M }
  },

  stageGroups: {
    shared: [
      {
        M: ['M1'],
        stage: 'IVB',
        source: 'AJCC 8th edition cutaneous carcinoma stage group: any T, any N, M1'
      },
      {
        T: ['T4a', 'T4b'],
        M: ['M0'],
        stage: 'IVA',
        source: 'AJCC 8th edition cutaneous carcinoma stage group: T4, any N, M0'
      },
      {
        N: ['N2', 'N2a', 'N2b', 'N2c', 'N3', 'N3a', 'N3b'],
        M: ['M0'],
        stage: 'IVA',
        source: 'AJCC 8th edition cutaneous carcinoma stage group: any T, N2 or N3, M0'
      },
      {
        T: ['T1', 'T2', 'T3'],
        N: ['N1'],
        M: ['M0'],
        stage: 'III',
        source: 'AJCC 8th edition cutaneous carcinoma stage group: T1-T3, N1, M0'
      },
      {
        T: ['T3'],
        N: ['N0'],
        M: ['M0'],
        stage: 'III',
        source: 'AJCC 8th edition cutaneous carcinoma stage group: T3, N0, M0'
      },
      {
        T: ['T2'],
        N: ['N0'],
        M: ['M0'],
        stage: 'II',
        source: 'AJCC 8th edition cutaneous carcinoma stage group: T2, N0, M0'
      },
      {
        T: ['T1'],
        N: ['N0'],
        M: ['M0'],
        stage: 'I',
        source: 'AJCC 8th edition cutaneous carcinoma stage group: T1, N0, M0'
      },
      {
        T: ['Tis'],
        N: ['N0'],
        M: ['M0'],
        stage: '0',
        source: 'AJCC 8th edition cutaneous carcinoma stage group: Tis, N0, M0'
      }
    ]
  },

  stageGroupCaveat:
    'The stage IVA / IVB labelling for this site follows a secondary reference, where IVA is advanced M0 disease and IVB is M1 disease. It could not be confirmed against a primary AJCC source, and several references instead print a single undivided Stage IV for cutaneous carcinoma of the head and neck. The T/N/M-to-stage boundaries are unaffected — only the IVA/IVB naming is in question. Confirm against the AJCC manual before relying on the label.',

  notes: [
    'Vermilion lip is staged here, not under oral cavity. Merkel cell carcinoma has its own chapter and is excluded.',
    'T3 is reached by any single high-risk feature: >4 cm, minor bone erosion, perineural invasion, or deep invasion. A 1 cm tumour with perineural invasion is T3, not T1.',
    'Deep invasion means beyond the subcutaneous fat, or >6 mm measured from the granular layer of the adjacent epidermis to the base of the tumour.',
    'Minor bone erosion is T3; gross cortical bone or marrow invasion is T4a; skull base or skull base foramen involvement is T4b.',
    HN8_CP_NOTE
  ]
};
