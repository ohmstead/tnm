// Lip and oral cavity — AJCC 8th edition (chapter 7).
//
// Still 8th edition as of August 2026 (AJCC Current Staging System 2026 table,
// chapter 7, edition 8). Verified against:
//   NCI PDQ, Lip and Oral Cavity Cancer Treatment (Health Professional),
//   AJCC 8th edition tables
//   Lydiatt WM, et al. CA Cancer J Clin. 2017;67(2):122-137.
//
// The deck (slide 5) supplied the clinical T and clinical N tables only. The
// pathological N and the prognostic stage groups were completed from the
// sources above and are shared with the other 8th edition head & neck
// chapters — see data/common.js.
//
// The headline 8th edition change for this site is DEPTH OF INVASION entering
// the T category. DOI is not tumour thickness: it is measured from the level
// of the adjacent normal mucosal basement membrane down to the deepest point
// of invasion, so an exophytic tumour can be large but shallow.

import {
  HN8_CLINICAL_N,
  HN8_PATHOLOGICAL_N,
  HN8_M,
  HN8_STAGE_GROUPS,
  HN8_CP_NOTE
} from '../common.js';

export default {
  id: 'oral-cavity',
  name: 'Lip and Oral Cavity',
  short: 'Oral cavity',
  chapter: 7,
  edition: {
    version: 8,
    label: 'AJCC 8th edition',
    effective: '2018-01-01',
    note: 'This site has NOT moved to Version 9. The 8th edition remains in effect.'
  },
  citations: {
    ajcc: {
      text: 'AJCC Cancer Staging Manual, 8th edition, Chapter 7: Oral Cavity',
      url: 'https://www.facs.org/media/c5ik5tkr/ajcc-current-staging-system-2026.pdf'
    },
    papers: [
      {
        text: 'Lydiatt WM, Patel SG, O’Sullivan B, et al. Head and neck cancers — major changes in the AJCC eighth edition cancer staging manual. CA Cancer J Clin. 2017;67(2):122-137.',
        doi: '10.3322/caac.21389',
        url: 'https://acsjournals.onlinelibrary.wiley.com/doi/full/10.3322/caac.21389'
      },
      {
        text: 'NCI PDQ: Lip and Oral Cavity Cancer Treatment (Health Professional Version) — AJCC 8th edition staging tables.',
        url: 'https://www.cancer.gov/types/head-and-neck/hp/adult/lip-mouth-treatment-pdq'
      }
    ],
    asProvided: {
      text: 'Source URL provided on slide 5 of HN_staging.pptx',
      url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12883927'
    }
  },
  basis: ['clinical', 'pathological'],
  basisNote: HN8_CP_NOTE,

  axes: {
    T: {
      shared: {
        kind: 'derived',
        steps: [
          {
            id: 'local',
            prompt: 'Local extent',
            options: [
              { value: 'insitu', label: 'Carcinoma in situ' },
              { value: 'confined', label: 'Invasive, no invasion of adjacent structures' },
              {
                value: 'adjacent',
                label: 'Invades adjacent structures',
                detail:
                  'Through the cortical bone of the mandible or maxilla, or involving the maxillary sinus or skin of the face. Superficial erosion of bone or a tooth socket by a gingival primary alone does NOT qualify.'
              },
              {
                value: 'veryadvanced',
                label: 'Invades masticator space, pterygoid plates, or skull base, and/or encases the internal carotid artery'
              }
            ]
          },
          {
            id: 'size',
            prompt: 'Greatest dimension',
            skipWhen: { local: ['insitu', 'adjacent', 'veryadvanced'] },
            options: [
              { value: 'le2', label: '≤2 cm' },
              { value: 'gt2le4', label: '>2 cm and ≤4 cm' },
              { value: 'gt4', label: '>4 cm' }
            ]
          },
          {
            id: 'doi',
            prompt: 'Depth of invasion (DOI)',
            help:
              'Measured from the level of the adjacent normal mucosal basement membrane to the deepest point of invasion. This is not the same as tumour thickness.',
            skipWhen: { local: ['insitu', 'adjacent', 'veryadvanced'] },
            options: [
              { value: 'le5', label: '≤5 mm' },
              { value: 'gt5le10', label: '>5 mm and ≤10 mm' },
              { value: 'gt10', label: '>10 mm' }
            ]
          }
        ],
        rules: [
          {
            when: { local: ['insitu'] },
            value: 'Tis',
            forces: { N: 'N0', M: 'M0' },
            detail: 'Carcinoma in situ.',
            source: 'AJCC 8th edition, oral cavity T category'
          },
          {
            when: { local: ['veryadvanced'] },
            value: 'T4b',
            detail:
              'Very advanced local disease. Tumour invades the masticator space, pterygoid plates, or skull base, and/or encases the internal carotid artery.',
            source: 'AJCC 8th edition, oral cavity T4b'
          },
          {
            when: { local: ['adjacent'] },
            value: 'T4a',
            detail:
              'Moderately advanced local disease. Tumour invades adjacent structures — through the cortical bone of the mandible or maxilla, or involving the maxillary sinus or skin of the face.',
            source: 'AJCC 8th edition, oral cavity T4a'
          },
          {
            when: { local: ['confined'], size: ['gt4'], doi: ['gt10'] },
            value: 'T4a',
            detail: 'Moderately advanced local disease. Tumour >4 cm with DOI >10 mm.',
            source: 'AJCC 8th edition, oral cavity T4a'
          },
          {
            when: { local: ['confined'], size: ['gt2le4'], doi: ['gt10'] },
            value: 'T3',
            detail: 'Tumour >2 cm but ≤4 cm with DOI >10 mm.',
            source: 'AJCC 8th edition (corrected), oral cavity T3'
          },
          {
            when: { local: ['confined'], size: ['gt4'] },
            value: 'T3',
            detail: 'Tumour >4 cm with DOI ≤10 mm.',
            source: 'AJCC 8th edition (corrected), oral cavity T3'
          },
          {
            when: { local: ['confined'], size: ['gt2le4'] },
            value: 'T2',
            detail: 'Tumour >2 cm but ≤4 cm with DOI ≤10 mm.',
            source: 'AJCC 8th edition (corrected), oral cavity T2'
          },
          {
            when: { local: ['confined'], size: ['le2'], doi: ['gt5le10', 'gt10'] },
            value: 'T2',
            detail:
              'Tumour ≤2 cm with DOI >5 mm. The corrected AJCC 8th edition wording places NO upper DOI bound on this clause, so a ≤2 cm tumour remains T2 however deep it invades. Some secondary sources print an obsolete capped version ("5 mm < DOI ≤ 10 mm") which would make this T3 — see the note on this site.',
            source: 'AJCC 8th edition (corrected), oral cavity T2; NCI PDQ'
          },
          {
            when: { local: ['confined'], size: ['le2'], doi: ['le5'] },
            value: 'T1',
            detail: 'Tumour ≤2 cm with DOI ≤5 mm.',
            source: 'AJCC 8th edition, oral cavity T1'
          }
        ]
      }
    },
    N: { clinical: HN8_CLINICAL_N, pathological: HN8_PATHOLOGICAL_N },
    M: { shared: HN8_M }
  },

  stageGroups: { shared: HN8_STAGE_GROUPS },

  notes: [
    'Depth of invasion entered the T category in the 8th edition and is the change most often missed. DOI is measured from the level of the adjacent normal mucosal basement membrane, not from the tumour surface — an exophytic tumour may be large but shallow, and an ulcerated one deep but small. AJCC states explicitly that DOI supersedes muscle invasion.',
    'Watch for the pre-correction T2 wording, which is still in wide circulation: "Tumour ≤2 cm with 5 mm < DOI ≤ 10 mm". AJCC published a correction to the oral cavity T categories, and the corrected T2 reads "Tumour ≤2 cm with DOI >5 mm" — with no upper DOI bound. This app follows the corrected AJCC wording, which NCI PDQ also uses. The practical consequence: a ≤2 cm tumour with DOI >10 mm is T2, not T3.',
    'Superficial erosion of bone or a tooth socket by a gingival primary alone does not make a tumour T4a.',
    'Vermilion lip is staged as cutaneous carcinoma, not oral cavity.',
    'AJCC summarises the pathological rule as: pENE(+) increases the pN category by one full category (pN1 to pN2, pN2 to pN3).',
    HN8_CP_NOTE
  ]
};
