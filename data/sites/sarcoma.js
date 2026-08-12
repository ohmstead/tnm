// Soft tissue sarcoma of the head and neck — AJCC 8th edition (chapter 40).
//
// Still 8th edition as of August 2026 (AJCC Current Staging System 2026 table,
// Part IX, chapter 40, edition 8).
//
// Transcribed from slide 12 of HN_staging.pptx (T, N, M and grade tables) and
// verified word-for-word against the CAP Protocol for the Examination of
// Specimens From Patients With Soft Tissue Tumors (Other • Soft Tissue 4.0.1.0),
// which reproduces the AJCC 8th edition definitions:
//
//   pT1  Tumor <=2 cm
//   pT2  Tumor >2 to <=4 cm
//   pT3  Tumor >4 cm
//   pT4  Tumor with invasion of adjoining structures
//   pT4a orbital invasion, skull base/dural invasion, invasion of central
//        compartment viscera, involvement of facial skeleton, or invasion of
//        pterygoid muscles
//   pT4b brain parenchymal invasion, carotid artery encasement, prevertebral
//        muscle invasion, or CNS involvement via perineural spread
//   pN0  No regional lymph node metastasis   pN1 Regional lymph node metastasis
//   M0 / M1
//   Grade FNCLCC G1-G3
//
// THE POINT OF THIS CHAPTER: AJCC defines NO prognostic stage groups for head
// and neck soft tissue sarcoma. The 8th edition introduced a head-and-neck-
// specific T classification but deliberately withheld stage groupings for want
// of data. Stage groupings have been PROPOSED (Cates 2019; Lee 2021; Salunkhe
// 2023) but none is AJCC-endorsed, so this app reports T, N, M and grade and
// stops there rather than inventing a stage. This is stated to the student on
// the result screen — see `noStageGroups` below, which the app renders in place
// of a stage.

export default {
  id: 'sarcoma',
  name: 'Soft Tissue Sarcoma',
  // Header label. Kept short so the edition badge still fits beside it at 375px.
  short: 'Sarcoma',
  chapter: 40,
  edition: {
    version: 8,
    label: 'AJCC 8th edition',
    effective: '2018-01-01',
    note: 'This site has NOT moved to Version 9. The 8th edition remains in effect.'
  },
  citations: {
    ajcc: {
      text: 'AJCC Cancer Staging Manual, 8th edition, Chapter 40: Soft Tissue Sarcoma of the Head and Neck. T, N, M and FNCLCC grade only — AJCC publishes no prognostic stage groups for this chapter.',
      url: 'https://www.facs.org/media/c5ik5tkr/ajcc-current-staging-system-2026.pdf'
    },
    papers: [
      {
        text: 'Cates JMM. Staging soft tissue sarcoma of the head and neck: evaluation of the AJCC 8th edition revised T classifications. Head Neck. 2019;41(7):2359-2366. (SEER, n=2756 — validates the revised T classification and PROPOSES, but does not establish, stage groupings.)',
        doi: '10.1002/hed.25701',
        pmid: '30779403',
        url: 'https://onlinelibrary.wiley.com/doi/10.1002/hed.25701'
      },
      {
        text: 'Lee NCJ, Eskander A, Miccio JA, et al. Evaluation of head and neck soft tissue sarcoma 8th edition pathologic staging system and proposal of a novel stage grouping system. Oral Oncol. 2021;114:105137. (SEER, n=546, NCDB validation — a second, DIFFERENT proposed grouping. Also not AJCC-endorsed.)',
        doi: '10.1016/j.oraloncology.2020.105137',
        pmid: '33422859',
        url: 'https://pubmed.ncbi.nlm.nih.gov/33422859/'
      },
      {
        text: 'College of American Pathologists. Protocol for the Examination of Specimens From Patients With Soft Tissue Tumors (Other • Soft Tissue 4.0.1.0) — reproduces the AJCC 8th edition head and neck pT, pN and FNCLCC grade definitions used here.',
        url: 'https://cap.objects.frb.io/protocols/cp-other-softtissue-17protocol-4010.pdf'
      }
    ],
    sourcingNote:
      'Three published groups have proposed prognostic stage groupings for this disease and they do not agree with each other. None has been adopted by AJCC. This app therefore reports no stage.',
    asProvided: {
      text: 'Source URLs provided on slide 12 of HN_staging.pptx (Medscape overview; Cates 2019; Salunkhe RR et al., ASTRO 2023 meeting abstract, Int J Radiat Oncol Biol Phys — a conference abstract proposing stage groupings, not an AJCC standard)',
      url: 'https://www.redjournal.org/article/S0360-3016(23)05001-0/fulltext'
    }
  },

  // AJCC gives one set of definitions for this chapter; the c/p distinction is
  // only that pT may be measured on the resection specimen. No toggle is shown.
  basis: ['clinical', 'pathological'],
  basisNote:
    'The T, N and M definitions are identical clinically and pathologically. AJCC notes that where the excised specimen cannot be measured accurately it is acceptable to use the radiologic size to assign pT. There is no pM0 category.',

  // Rendered by the app in place of a prognostic stage.
  noStageGroups:
    'AJCC defines no prognostic stage groups for soft tissue sarcoma of the head and neck. The 8th edition introduced a head-and-neck-specific T classification but withheld stage groupings for want of data, so the complete AJCC answer for this disease is TNM plus FNCLCC grade. Stage groupings have been proposed in the literature (Cates 2019; Lee 2021; Salunkhe 2023) and they disagree with one another; none is AJCC-endorsed, so this app does not report one.',

  axes: {
    T: {
      shared: {
        kind: 'derived',
        steps: [
          {
            id: 'local',
            prompt: 'Local extent',
            help:
              'Before staging, check the histology. The AJCC soft tissue sarcoma system does NOT apply to angiosarcoma, embryonal or alveolar rhabdomyosarcoma, Kaposi sarcoma, or dermatofibrosarcoma protuberans, nor to sarcomas arising within the dura.',
            options: [
              { value: 'confined', label: 'No invasion of adjoining structures' },
              {
                value: 'moderate',
                label: 'Orbit, skull base/dura, central compartment viscera, facial skeleton, or pterygoid muscles',
                detail:
                  'Tumour with orbital invasion, skull base/dural invasion, invasion of central compartment viscera, involvement of facial skeleton, or invasion of pterygoid muscles.'
              },
              {
                value: 'advanced',
                label: 'Brain parenchyma, carotid artery, prevertebral muscle, or CNS via perineural spread',
                detail:
                  'Tumour with brain parenchymal invasion, carotid artery encasement, prevertebral muscle invasion, or central nervous system involvement via perineural spread.'
              }
            ]
          },
          {
            id: 'size',
            prompt: 'Greatest dimension',
            help:
              'The head and neck size thresholds are 2 cm and 4 cm — much smaller than the 5/10/15 cm thresholds used for sarcoma of the trunk and extremities. Do not carry the extremity cut-offs over.',
            skipWhen: { local: ['moderate', 'advanced'] },
            options: [
              { value: 'le2', label: '≤2 cm' },
              { value: 'gt2le4', label: '>2 cm and ≤4 cm' },
              { value: 'gt4', label: '>4 cm' }
            ]
          }
        ],
        rules: [
          {
            when: { local: ['advanced'] },
            value: 'T4b',
            detail:
              'Tumour with brain parenchymal invasion, carotid artery encasement, prevertebral muscle invasion, or central nervous system involvement via perineural spread.',
            source: 'AJCC 8th edition, chapter 40, head and neck soft tissue sarcoma T4b'
          },
          {
            when: { local: ['moderate'] },
            value: 'T4a',
            detail:
              'Tumour with orbital invasion, skull base/dural invasion, invasion of central compartment viscera, involvement of facial skeleton, or invasion of pterygoid muscles.',
            source: 'AJCC 8th edition, chapter 40, head and neck soft tissue sarcoma T4a'
          },
          {
            when: { local: ['confined'], size: ['gt4'] },
            value: 'T3',
            detail: 'Tumour >4 cm.',
            source: 'AJCC 8th edition, chapter 40, head and neck soft tissue sarcoma T3'
          },
          {
            when: { local: ['confined'], size: ['gt2le4'] },
            value: 'T2',
            detail: 'Tumour >2 cm and ≤4 cm.',
            source: 'AJCC 8th edition, chapter 40, head and neck soft tissue sarcoma T2'
          },
          {
            when: { local: ['confined'], size: ['le2'] },
            value: 'T1',
            detail: 'Tumour ≤2 cm.',
            source: 'AJCC 8th edition, chapter 40, head and neck soft tissue sarcoma T1'
          }
        ]
      }
    },
    N: {
      shared: {
        kind: 'direct',
        prompt: 'Regional lymph nodes (N)',
        help:
          'Nodal staging is binary here — no size thresholds, no laterality, no extranodal extension. Nodal metastasis is rare in soft tissue sarcoma outside a few histologies (epithelioid and clear cell sarcoma), which is why AJCC did not subdivide it.',
        options: [
          {
            value: 'N0',
            label: 'N0',
            detail: 'No regional lymph node metastasis.',
            source: 'AJCC 8th edition, chapter 40, head and neck soft tissue sarcoma N0'
          },
          {
            value: 'N1',
            label: 'N1',
            detail: 'Regional lymph node metastasis.',
            source: 'AJCC 8th edition, chapter 40, head and neck soft tissue sarcoma N1'
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
            detail: 'No distant metastasis. There is no pM0 category — this renders as cM0.',
            source: 'AJCC 8th edition, chapter 40, head and neck soft tissue sarcoma M0'
          },
          {
            value: 'M1',
            label: 'M1',
            detail: 'Distant metastasis.',
            source: 'AJCC 8th edition, chapter 40, head and neck soft tissue sarcoma M1'
          }
        ]
      }
    }
  },

  // Asked after T, N and M. Grade is not part of the TNM string, but for this
  // chapter it is the rest of the AJCC answer, so the result screen shows it
  // alongside the TNM where other sites show a stage.
  postQuestions: [
    {
      id: 'grade',
      prompt: 'Histologic grade (G)',
      short: 'Grade',
      help:
        'AJCC 8th edition uses the FNCLCC system: score tumour differentiation (1–3), mitotic count (1–3) and necrosis (0–2), then sum. Total 2–3 = G1, 4–5 = G2, 6–8 = G3.',
      options: [
        { value: 'G1', label: 'G1', detail: 'FNCLCC total score 2 or 3.' },
        { value: 'G2', label: 'G2', detail: 'FNCLCC total score 4 or 5.' },
        { value: 'G3', label: 'G3', detail: 'FNCLCC total score 6 to 8.' },
        {
          value: 'GX',
          label: 'GX',
          detail:
            'Grade cannot be assessed, or an ungraded sarcoma. Common on core biopsy and after neoadjuvant treatment.'
        }
      ]
    }
  ],

  // Present so the engine's shared-vs-per-basis logic behaves normally; empty
  // because AJCC publishes no groups. The app reads `noStageGroups` instead.
  stageGroups: { shared: [] },

  notes: [
    'There is no prognostic stage group for this disease. AJCC 8th edition created a head-and-neck-specific T classification for soft tissue sarcoma but published no stage groupings, citing insufficient data. The complete AJCC answer is T, N, M and FNCLCC grade.',
    'Stage groupings have been proposed by at least three groups (Cates 2019; Lee 2021; Salunkhe 2023) and they do not agree — Lee, for example, proposes a single 5 cm size cut-off rather than the AJCC 2 cm and 4 cm thresholds. Treat any "stage" you see quoted for head and neck sarcoma as that author\'s proposal, not as AJCC staging.',
    'The size thresholds are 2 cm and 4 cm. Sarcoma of the trunk and extremities (chapter 41) uses 5, 10 and 15 cm and DOES have stage groups. Applying the extremity system to a head and neck primary is the commonest error here.',
    'Grade drives management and prognosis far more than T does in this disease, which is why AJCC records it separately. Grade is FNCLCC, not the NCI system: differentiation + mitotic count + necrosis, summed.',
    'The AJCC soft tissue sarcoma system does not apply to angiosarcoma, embryonal or alveolar rhabdomyosarcoma, Kaposi sarcoma, or dermatofibrosarcoma protuberans, and sarcomas arising within the dura are not well staged by it.',
    'Nodal metastasis is uncommon and is recorded as present or absent only. There is no ENE subdivision, unlike every mucosal squamous cell site in this app.',
    'pM0 and MX are not valid categories. Use cM0, cM1 or pM1.'
  ]
};
