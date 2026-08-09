// Thyroid carcinoma — AJCC 8th edition (chapters 73 and 74).
//
// Still 8th edition as of August 2026 (AJCC Current Staging System 2026 table:
// ch. 73 Thyroid Differentiated & Anaplastic, ch. 74 Thyroid Medullary, both
// edition 8).
//
// Transcribed from slide 9 of HN_staging.pptx and cross-checked against:
//   Tuttle RM, Haugen B, Perrier ND. Updated American Joint Committee on
//   Cancer/TNM Staging System for Differentiated and Anaplastic Thyroid Cancer
//   (Eighth Edition). Thyroid. 2017;27(6):751-756.
//
// Thyroid is the only head & neck site where AGE enters the stage group, and
// the only one where the histology changes the stage table entirely. The T and
// N categories are shared across histologies; the stage groups are not.
//
// The 8th edition raised the age threshold from 45 to 55 years. Under 55,
// differentiated thyroid cancer can only ever be stage I or stage II, however
// advanced the primary or the nodes.

export default {
  id: 'thyroid',
  name: 'Thyroid',
  short: 'Thyroid',
  chapter: 73,
  edition: {
    version: 8,
    label: 'AJCC 8th edition',
    effective: '2018-01-01',
    note: 'Chapters 73 (differentiated & anaplastic) and 74 (medullary) have NOT moved to Version 9.'
  },
  citations: {
    ajcc: {
      text: 'AJCC Cancer Staging Manual, 8th edition, Chapters 73 and 74: Thyroid',
      url: 'https://www.facs.org/media/c5ik5tkr/ajcc-current-staging-system-2026.pdf'
    },
    papers: [
      {
        text: 'Tuttle RM, Haugen B, Perrier ND. Updated American Joint Committee on Cancer/TNM Staging System for Differentiated and Anaplastic Thyroid Cancer (Eighth Edition). Thyroid. 2017;27(6):751-756.',
        doi: '10.1089/thy.2017.0102',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5467103/'
      }
    ],
    asProvided: {
      text: 'Source URLs provided on slide 9 of HN_staging.pptx',
      url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5467103/'
    }
  },
  basis: ['clinical', 'pathological'],
  basisNote:
    'The T, N and M categories and the stage groups are the same for clinical and pathological staging in thyroid carcinoma.',

  preQuestions: [
    {
      id: 'histology',
      prompt: 'Histology',
      options: [
        {
          value: 'differentiated',
          label: 'Differentiated',
          detail: 'Papillary, follicular, poorly differentiated, or Hürthle cell carcinoma. Chapter 73.'
        },
        { value: 'medullary', label: 'Medullary', detail: 'Chapter 74.' },
        { value: 'anaplastic', label: 'Anaplastic', detail: 'Chapter 73.' }
      ]
    },
    {
      id: 'age',
      prompt: 'Age at diagnosis',
      help:
        'Age enters the stage group for DIFFERENTIATED thyroid cancer only. The 8th edition raised this threshold from 45 to 55 years.',
      skipWhen: { histology: ['medullary', 'anaplastic'] },
      options: [
        { value: 'under55', label: 'Under 55 years' },
        { value: '55plus', label: '55 years or older' }
      ]
    }
  ],

  axes: {
    T: {
      shared: {
        kind: 'derived',
        steps: [
          {
            id: 'ete',
            prompt: 'Gross extrathyroidal extension (ETE)',
            options: [
              { value: 'none', label: 'None — tumour limited to the thyroid' },
              { value: 'strap', label: 'Invading only the strap muscles (sternohyoid, sternothyroid, sternothyroid/omohyoid)' },
              {
                value: 'major',
                label: 'Invading subcutaneous soft tissue, larynx, trachea, oesophagus, or recurrent laryngeal nerve'
              },
              { value: 'prevertebral', label: 'Invading prevertebral fascia, or encasing the carotid artery or mediastinal vessels' }
            ]
          },
          {
            id: 'size',
            prompt: 'Greatest dimension',
            skipWhen: { ete: ['strap', 'major', 'prevertebral'] },
            options: [
              { value: 'le1', label: '≤1 cm' },
              { value: 'gt1le2', label: '>1 cm and ≤2 cm' },
              { value: 'gt2le4', label: '>2 cm and ≤4 cm' },
              { value: 'gt4', label: '>4 cm' }
            ]
          }
        ],
        rules: [
          {
            when: { ete: ['prevertebral'] },
            value: 'T4b',
            detail:
              'Gross extrathyroidal extension invading the prevertebral fascia, or encasing the carotid artery or mediastinal vessels, from a tumour of any size.',
            source: 'AJCC 8th edition, thyroid T4b'
          },
          {
            when: { ete: ['major'] },
            value: 'T4a',
            detail:
              'Gross extrathyroidal extension invading subcutaneous soft tissues, larynx, trachea, oesophagus, or recurrent laryngeal nerve, from a tumour of any size.',
            source: 'AJCC 8th edition, thyroid T4a'
          },
          {
            when: { ete: ['strap'] },
            value: 'T3b',
            detail:
              'Gross extrathyroidal extension invading only the strap muscles, from a tumour of any size.',
            source: 'AJCC 8th edition, thyroid T3b'
          },
          {
            when: { ete: ['none'], size: ['gt4'] },
            value: 'T3a',
            detail: 'Tumour >4 cm, limited to the thyroid.',
            source: 'AJCC 8th edition, thyroid T3a'
          },
          {
            when: { ete: ['none'], size: ['gt2le4'] },
            value: 'T2',
            detail: 'Tumour >2 cm but ≤4 cm, limited to the thyroid.',
            source: 'AJCC 8th edition, thyroid T2'
          },
          {
            when: { ete: ['none'], size: ['gt1le2'] },
            value: 'T1b',
            detail: 'Tumour >1 cm but ≤2 cm, limited to the thyroid.',
            source: 'AJCC 8th edition, thyroid T1b'
          },
          {
            when: { ete: ['none'], size: ['le1'] },
            value: 'T1a',
            detail: 'Tumour ≤1 cm, limited to the thyroid.',
            source: 'AJCC 8th edition, thyroid T1a'
          }
        ]
      }
    },

    N: {
      shared: {
        kind: 'direct',
        prompt: 'Regional lymph nodes (N)',
        options: [
          {
            value: 'N0',
            label: 'N0 / NX',
            detail:
              'No evidence of regional lymph node metastasis, or nodes not assessed. AJCC groups N0 and NX together in the thyroid stage table.',
            source: 'AJCC 8th edition, thyroid N0/NX'
          },
          {
            value: 'N1a',
            label: 'N1a',
            detail:
              'Metastasis to level VI or VII nodes (pretracheal, paratracheal, prelaryngeal/Delphian, or upper mediastinal). May be unilateral or bilateral.',
            source: 'AJCC 8th edition, thyroid N1a'
          },
          {
            value: 'N1b',
            label: 'N1b',
            detail:
              'Metastasis to unilateral, bilateral or contralateral lateral neck nodes (levels I, II, III, IV or V), or to retropharyngeal nodes.',
            source: 'AJCC 8th edition, thyroid N1b'
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
            detail: 'No distant metastasis.',
            source: 'AJCC 8th edition, thyroid M0'
          },
          {
            value: 'M1',
            label: 'M1',
            detail: 'Distant metastasis.',
            source: 'AJCC 8th edition, thyroid M1'
          }
        ]
      }
    }
  },

  stageGroups: {
    shared: [
      // ---- Differentiated, under 55 years ----
      {
        when: { histology: ['differentiated'], age: ['under55'] },
        M: ['M1'],
        stage: 'II',
        source: 'AJCC 8th edition thyroid: differentiated, <55 years, any T, any N, M1'
      },
      {
        when: { histology: ['differentiated'], age: ['under55'] },
        M: ['M0'],
        stage: 'I',
        source: 'AJCC 8th edition thyroid: differentiated, <55 years, any T, any N, M0'
      },

      // ---- Differentiated, 55 years and older ----
      {
        when: { histology: ['differentiated'], age: ['55plus'] },
        M: ['M1'],
        stage: 'IVB',
        source: 'AJCC 8th edition thyroid: differentiated, ≥55 years, any T, any N, M1'
      },
      {
        when: { histology: ['differentiated'], age: ['55plus'] },
        T: ['T4b'],
        M: ['M0'],
        stage: 'IVA',
        source: 'AJCC 8th edition thyroid: differentiated, ≥55 years, T4b, any N, M0'
      },
      {
        when: { histology: ['differentiated'], age: ['55plus'] },
        T: ['T4a'],
        M: ['M0'],
        stage: 'III',
        source: 'AJCC 8th edition thyroid: differentiated, ≥55 years, T4a, any N, M0'
      },
      {
        when: { histology: ['differentiated'], age: ['55plus'] },
        T: ['T3a', 'T3b'],
        M: ['M0'],
        stage: 'II',
        source: 'AJCC 8th edition thyroid: differentiated, ≥55 years, T3a/T3b, any N, M0'
      },
      {
        when: { histology: ['differentiated'], age: ['55plus'] },
        T: ['T1a', 'T1b', 'T2'],
        N: ['N1a', 'N1b'],
        M: ['M0'],
        stage: 'II',
        source: 'AJCC 8th edition thyroid: differentiated, ≥55 years, T1/T2, N1, M0'
      },
      {
        when: { histology: ['differentiated'], age: ['55plus'] },
        T: ['T1a', 'T1b', 'T2'],
        N: ['N0'],
        M: ['M0'],
        stage: 'I',
        source: 'AJCC 8th edition thyroid: differentiated, ≥55 years, T1/T2, N0/NX, M0'
      },

      // ---- Medullary (any age) ----
      {
        when: { histology: ['medullary'] },
        M: ['M1'],
        stage: 'IVC',
        source: 'AJCC 8th edition thyroid: medullary, any T, any N, M1'
      },
      {
        when: { histology: ['medullary'] },
        T: ['T4b'],
        M: ['M0'],
        stage: 'IVB',
        source: 'AJCC 8th edition thyroid: medullary, T4b, any N, M0'
      },
      {
        when: { histology: ['medullary'] },
        T: ['T4a'],
        M: ['M0'],
        stage: 'IVA',
        source: 'AJCC 8th edition thyroid: medullary, T4a, any N, M0'
      },
      {
        when: { histology: ['medullary'] },
        T: ['T1a', 'T1b', 'T2', 'T3a', 'T3b'],
        N: ['N1b'],
        M: ['M0'],
        stage: 'IVA',
        source: 'AJCC 8th edition thyroid: medullary, T1-T3, N1b, M0'
      },
      {
        when: { histology: ['medullary'] },
        T: ['T1a', 'T1b', 'T2', 'T3a', 'T3b'],
        N: ['N1a'],
        M: ['M0'],
        stage: 'III',
        source: 'AJCC 8th edition thyroid: medullary, T1-T3, N1a, M0'
      },
      {
        when: { histology: ['medullary'] },
        T: ['T2', 'T3a', 'T3b'],
        N: ['N0'],
        M: ['M0'],
        stage: 'II',
        source: 'AJCC 8th edition thyroid: medullary, T2 or T3, N0, M0'
      },
      {
        when: { histology: ['medullary'] },
        T: ['T1a', 'T1b'],
        N: ['N0'],
        M: ['M0'],
        stage: 'I',
        source: 'AJCC 8th edition thyroid: medullary, T1, N0, M0'
      },

      // ---- Anaplastic (any age) — all anaplastic disease is stage IV ----
      {
        when: { histology: ['anaplastic'] },
        M: ['M1'],
        stage: 'IVC',
        source: 'AJCC 8th edition thyroid: anaplastic, any T, any N, M1'
      },
      {
        when: { histology: ['anaplastic'] },
        T: ['T3b', 'T4a', 'T4b'],
        M: ['M0'],
        stage: 'IVB',
        source: 'AJCC 8th edition thyroid: anaplastic, T3b or T4, any N, M0'
      },
      {
        when: { histology: ['anaplastic'] },
        T: ['T1a', 'T1b', 'T2', 'T3a'],
        N: ['N1a', 'N1b'],
        M: ['M0'],
        stage: 'IVB',
        source: 'AJCC 8th edition thyroid: anaplastic, T1-T3a, N1, M0'
      },
      {
        when: { histology: ['anaplastic'] },
        T: ['T1a', 'T1b', 'T2', 'T3a'],
        N: ['N0'],
        M: ['M0'],
        stage: 'IVA',
        source: 'AJCC 8th edition thyroid: anaplastic, T1-T3a, N0/NX, M0'
      }
    ]
  },

  notes: [
    'Age is part of the stage group for DIFFERENTIATED thyroid cancer only, and the 8th edition raised the threshold from 45 to 55 years. Under 55, differentiated disease is stage I if M0 and stage II if M1 — regardless of how advanced T or N are.',
    'That is not an error in this app: a 40-year-old with a T4b N1b M0 papillary carcinoma is stage I. The staging system is predicting disease-specific survival, which remains excellent in young patients, not describing anatomical extent.',
    'All anaplastic thyroid carcinoma is stage IV — IVA, IVB or IVC. There is no stage I, II or III.',
    'Medullary thyroid carcinoma does not use age at all, and its N1a versus N1b distinction changes the stage (III versus IVA).',
    'T3 is split by mechanism, not just size: T3a is >4 cm confined to the thyroid, T3b is gross extrathyroidal extension into strap muscles only, at any size.'
  ]
};
