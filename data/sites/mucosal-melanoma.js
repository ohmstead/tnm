// Mucosal melanoma of the head and neck — AJCC 8th edition (chapter 14).
//
// Still 8th edition as of August 2026.
//
// Transcribed from slides 10 of HN_staging.pptx and cross-checked against the
// AJCC 8th edition chapter listing. This disease is staged unlike any other
// head & neck site: because even small, superficial mucosal melanomas carry a
// poor prognosis, AJCC OMITS T1 and T2 entirely. Staging starts at T3, and
// the earliest possible prognostic stage is STAGE III. There is no stage 0,
// I or II.

export default {
  id: 'mucosal-melanoma',
  name: 'Mucosal Melanoma',
  short: 'Mucosal melanoma',
  chapter: 14,
  edition: {
    version: 8,
    label: 'AJCC 8th edition',
    effective: '2018-01-01',
    note: 'This site has NOT moved to Version 9. The 8th edition remains in effect.'
  },
  citations: {
    ajcc: {
      text: 'AJCC Cancer Staging Manual, 8th edition, Chapter 14: Mucosal Melanoma of the Head and Neck',
      url: 'https://www.facs.org/media/c5ik5tkr/ajcc-current-staging-system-2026.pdf'
    },
    papers: [
      {
        text: 'Lydiatt WM, Patel SG, O’Sullivan B, et al. Head and neck cancers — major changes in the AJCC eighth edition cancer staging manual. CA Cancer J Clin. 2017;67(2):122-137.',
        doi: '10.3322/caac.21389',
        url: 'https://acsjournals.onlinelibrary.wiley.com/doi/full/10.3322/caac.21389'
      }
    ],
    asProvided: {
      text: 'Source URLs provided on slide 10 of HN_staging.pptx (tertiary references; content cited to AJCC 8e)',
      url: 'https://radiopaedia.org/articles/mucosal-melanoma-of-the-head-and-neck-staging?lang=us'
    }
  },
  basis: ['clinical', 'pathological'],
  basisNote:
    'Clinical and pathological criteria are the same for this site. The only distinction AJCC draws is in the M category: cM1 is distant metastasis, pM1 is distant metastasis confirmed microscopically. There is no pM0 category.',

  axes: {
    T: {
      shared: {
        kind: 'direct',
        prompt: 'Primary tumour (T)',
        help: 'T1 and T2 do not exist for this site — they are omitted because even small, superficial mucosal melanomas carry a poor prognosis.',
        options: [
          {
            value: 'T3',
            label: 'T3',
            detail: 'Tumour limited to the mucosa and immediately underlying soft tissue.',
            source: 'AJCC 8th edition, mucosal melanoma T3'
          },
          {
            value: 'T4a',
            label: 'T4a',
            detail:
              'Moderately advanced local disease. Tumour involves deep soft tissue, cartilage, bone, or overlying skin.',
            source: 'AJCC 8th edition, mucosal melanoma T4a'
          },
          {
            value: 'T4b',
            label: 'T4b',
            detail:
              'Very advanced local disease. Tumour involves any of: dura, brain, skull base, lower cranial nerves (IX, X, XI, XII), masticator space, carotid artery, prevertebral space, or mediastinal structures.',
            source: 'AJCC 8th edition, mucosal melanoma T4b'
          }
        ]
      }
    },
    N: {
      shared: {
        kind: 'direct',
        prompt: 'Regional lymph nodes (N)',
        help: 'Nodal staging for this site is binary — there is no size or ENE subdivision.',
        options: [
          {
            value: 'N0',
            label: 'N0',
            detail: 'No regional lymph node metastases.',
            source: 'AJCC 8th edition, mucosal melanoma N0'
          },
          {
            value: 'N1',
            label: 'N1',
            detail: 'Regional lymph node metastases present.',
            source: 'AJCC 8th edition, mucosal melanoma N1'
          }
        ]
      }
    },
    M: {
      shared: {
        kind: 'direct',
        prompt: 'Distant metastasis (M)',
        options: [
          {
            value: 'M0',
            label: 'M0',
            detail: 'No evidence of metastases. Note that pM0 is not a valid category.',
            source: 'AJCC 8th edition, mucosal melanoma M0'
          },
          {
            value: 'M1',
            label: 'M1',
            detail: 'Distant metastasis. pM1 requires microscopic confirmation.',
            source: 'AJCC 8th edition, mucosal melanoma M1'
          }
        ]
      }
    }
  },

  stageGroups: {
    shared: [
      {
        M: ['M1'],
        stage: 'IVC',
        source: 'AJCC 8th edition mucosal melanoma stage group: any T, any N, M1'
      },
      {
        T: ['T4b'],
        M: ['M0'],
        stage: 'IVB',
        source: 'AJCC 8th edition mucosal melanoma stage group: T4b, any N, M0'
      },
      {
        T: ['T3', 'T4a'],
        N: ['N1'],
        M: ['M0'],
        stage: 'IVA',
        source: 'AJCC 8th edition mucosal melanoma stage group: T3 or T4a, N1, M0'
      },
      {
        T: ['T4a'],
        N: ['N0'],
        M: ['M0'],
        stage: 'IVA',
        source: 'AJCC 8th edition mucosal melanoma stage group: T4a, N0, M0'
      },
      {
        T: ['T3'],
        N: ['N0'],
        M: ['M0'],
        stage: 'III',
        source: 'AJCC 8th edition mucosal melanoma stage group: T3, N0, M0'
      }
    ]
  },

  notes: [
    'There is no stage 0, I or II for this disease. The lowest possible stage is III (T3 N0 M0), because AJCC omitted T1 and T2 on the grounds that even small superficial mucosal melanomas behave aggressively.',
    'A single positive node moves a T3 tumour straight from stage III to stage IVA.',
    'Nodal staging is binary — no size thresholds and no ENE subdivision, unlike every mucosal squamous cell site.',
    'pM0 and MX are not valid categories. Use cM0, cM1, or pM1.'
  ]
};
