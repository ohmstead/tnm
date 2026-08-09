// Shared AJCC 8th edition head & neck building blocks.
//
// The 8th edition uses ONE nodal scheme and ONE prognostic stage-group table
// across oral cavity (ch. 7), p16-negative oropharynx and hypopharynx (ch. 11),
// nasal cavity & paranasal sinuses (ch. 12), and larynx (ch. 13). Only the T
// definitions differ between those chapters.
//
// These are defined once here rather than copied into five files, because a
// transcription error repeated five times is five times harder to spot. Each
// site imports them explicitly so the sharing is visible when auditing.
//
// Verified against:
//   NCI PDQ adult head & neck treatment summaries (AJCC 8th edition tables)
//   Lydiatt WM, et al. Head and neck cancers - major changes in the AJCC
//   eighth edition cancer staging manual. CA Cancer J Clin. 2017;67(2):122-137.
// and against the larynx staging forms and stage-group table reproduced on
// slides 6 of HN_staging.pptx, and the oral cavity cN table on slide 5.

const NODE_STEPS = [
  {
    id: 'nodes',
    prompt: 'Nodal involvement',
    options: [
      { value: 'none', label: 'No regional lymph node metastasis' },
      { value: 'single-ipsi', label: 'Single ipsilateral node' },
      { value: 'multiple-ipsi', label: 'Multiple ipsilateral nodes' },
      { value: 'contra-bilat', label: 'Contralateral or bilateral node(s)' }
    ]
  },
  {
    id: 'size',
    prompt: 'Largest involved node',
    skipWhen: { nodes: ['none'] },
    options: [
      { value: 'le3', label: '≤3 cm' },
      { value: 'gt3le6', label: '>3 cm and ≤6 cm' },
      { value: 'gt6', label: '>6 cm' }
    ]
  }
];

/**
 * Clinical N — AJCC 8th edition, common head & neck scheme.
 * ENE only enters clinical staging when it is CLINICALLY OVERT, and when it is
 * it forces N3b regardless of node size or number.
 */
export const HN8_CLINICAL_N = {
  kind: 'derived',
  steps: [
    ...NODE_STEPS,
    {
      id: 'ene',
      prompt: 'Clinically overt extranodal extension?',
      help:
        'Clinical ENE requires unambiguous evidence on examination — skin invasion, tethering or fixation to adjacent structures, or cranial/brachial plexus, sympathetic trunk or phrenic nerve dysfunction. Imaging alone does not qualify.',
      skipWhen: { nodes: ['none'] },
      options: [
        { value: 'no', label: 'ENE(−) — not clinically overt' },
        { value: 'yes', label: 'ENE(+) — clinically overt' }
      ]
    }
  ],
  rules: [
    {
      when: { nodes: ['none'] },
      value: 'N0',
      detail: 'No regional lymph node metastasis.',
      source: 'AJCC 8th edition, clinical N (common head & neck scheme)'
    },
    {
      when: { ene: ['yes'] },
      value: 'N3b',
      detail: 'Metastasis in any lymph node(s) with clinically overt ENE(+).',
      source: 'AJCC 8th edition, clinical N3b'
    },
    {
      when: { size: ['gt6'] },
      value: 'N3a',
      detail: 'Metastasis in a lymph node >6 cm in greatest dimension and ENE(−).',
      source: 'AJCC 8th edition, clinical N3a'
    },
    {
      when: { nodes: ['contra-bilat'] },
      value: 'N2c',
      detail: 'Metastases in bilateral or contralateral lymph nodes, none >6 cm, and ENE(−).',
      source: 'AJCC 8th edition, clinical N2c'
    },
    {
      when: { nodes: ['multiple-ipsi'] },
      value: 'N2b',
      detail: 'Metastases in multiple ipsilateral lymph nodes, none >6 cm, and ENE(−).',
      source: 'AJCC 8th edition, clinical N2b'
    },
    {
      when: { nodes: ['single-ipsi'], size: ['gt3le6'] },
      value: 'N2a',
      detail: 'Metastasis in a single ipsilateral lymph node >3 cm but ≤6 cm and ENE(−).',
      source: 'AJCC 8th edition, clinical N2a'
    },
    {
      when: { nodes: ['single-ipsi'], size: ['le3'] },
      value: 'N1',
      detail: 'Metastasis in a single ipsilateral lymph node ≤3 cm and ENE(−).',
      source: 'AJCC 8th edition, clinical N1'
    }
  ]
};

/**
 * Pathological N — AJCC 8th edition, common head & neck scheme.
 * The key difference from clinical: microscopic ENE counts, and it upstages
 * according to node size and number rather than jumping straight to N3b.
 * A single ipsilateral node ≤3 cm with ENE(+) is pN2a, not pN3b.
 */
export const HN8_PATHOLOGICAL_N = {
  kind: 'derived',
  steps: [
    ...NODE_STEPS,
    {
      id: 'ene',
      prompt: 'Extranodal extension on the specimen?',
      help:
        'Pathological ENE includes microscopic extension, unlike clinical ENE which must be overt. This is the main reason pN can exceed cN for the same patient.',
      skipWhen: { nodes: ['none'] },
      options: [
        { value: 'no', label: 'pENE(−)' },
        { value: 'yes', label: 'pENE(+)' }
      ]
    }
  ],
  rules: [
    {
      when: { nodes: ['none'] },
      value: 'N0',
      detail: 'No regional lymph node metastasis.',
      source: 'AJCC 8th edition, pathological N (common head & neck scheme)'
    },
    {
      when: { nodes: ['single-ipsi'], size: ['le3'], ene: ['yes'] },
      value: 'N2a',
      detail: 'Metastasis in a single ipsilateral lymph node ≤3 cm and ENE(+).',
      source: 'AJCC 8th edition, pathological N2a'
    },
    {
      when: { ene: ['yes'] },
      value: 'N3b',
      detail:
        'Metastasis in a single ipsilateral node >3 cm with ENE(+); or in multiple ipsilateral, contralateral or bilateral nodes with any ENE(+); or a single contralateral node with ENE(+).',
      source: 'AJCC 8th edition, pathological N3b'
    },
    {
      when: { size: ['gt6'] },
      value: 'N3a',
      detail: 'Metastasis in a lymph node >6 cm in greatest dimension and ENE(−).',
      source: 'AJCC 8th edition, pathological N3a'
    },
    {
      when: { nodes: ['contra-bilat'] },
      value: 'N2c',
      detail: 'Metastases in bilateral or contralateral lymph nodes, none >6 cm, and ENE(−).',
      source: 'AJCC 8th edition, pathological N2c'
    },
    {
      when: { nodes: ['multiple-ipsi'] },
      value: 'N2b',
      detail: 'Metastases in multiple ipsilateral lymph nodes, none >6 cm, and ENE(−).',
      source: 'AJCC 8th edition, pathological N2b'
    },
    {
      when: { nodes: ['single-ipsi'], size: ['gt3le6'] },
      value: 'N2a',
      detail: 'Metastasis in a single ipsilateral lymph node >3 cm but ≤6 cm and ENE(−).',
      source: 'AJCC 8th edition, pathological N2a'
    },
    {
      when: { nodes: ['single-ipsi'], size: ['le3'] },
      value: 'N1',
      detail: 'Metastasis in a single ipsilateral lymph node ≤3 cm and ENE(−).',
      source: 'AJCC 8th edition, pathological N1'
    }
  ]
};

/** M — AJCC 8th edition, common across head & neck chapters. */
export const HN8_M = {
  kind: 'direct',
  prompt: 'Distant metastasis (M)',
  options: [
    {
      value: 'M0',
      label: 'M0',
      detail:
        'No distant metastasis. There is no pathological M0 category — clinical M is used to complete the stage group.',
      source: 'AJCC 8th edition, M category'
    },
    {
      value: 'M1',
      label: 'M1',
      detail: 'Distant metastasis.',
      source: 'AJCC 8th edition, M category'
    }
  ]
};

/**
 * Prognostic stage groups — AJCC 8th edition, common head & neck table.
 * Identical for clinical and pathological staging. Note that this does NOT
 * mean cStage equals pStage for a given patient: the same table applied to
 * different N categories routinely yields a different stage.
 *
 * Transcribed from the larynx stage-group table (slide 6 of HN_staging.pptx)
 * and cross-checked against NCI PDQ for oral cavity.
 */
// Every T value used by an 8th edition head & neck site EXCEPT T4b. The
// AJCC table reads "T1, T2, T3, T4a with N2 is IVA" — T4b with N2 is IVB, so
// the N2 rule must exclude T4b explicitly rather than relying on rule order.
const T_EXCEPT_T4B = ['T0', 'Tis', 'T1', 'T1a', 'T1b', 'T2', 'T3', 'T4a'];

export const HN8_STAGE_GROUPS = [
  {
    M: ['M1'],
    stage: 'IVC',
    source: 'AJCC 8th edition stage group: any T, any N, M1'
  },
  {
    T: ['T4b'],
    M: ['M0'],
    stage: 'IVB',
    source: 'AJCC 8th edition stage group: T4b, any N, M0'
  },
  {
    T: T_EXCEPT_T4B,
    N: ['N3', 'N3a', 'N3b'],
    M: ['M0'],
    stage: 'IVB',
    source: 'AJCC 8th edition stage group: any T, N3, M0'
  },
  {
    T: T_EXCEPT_T4B,
    N: ['N2', 'N2a', 'N2b', 'N2c'],
    M: ['M0'],
    stage: 'IVA',
    source: 'AJCC 8th edition stage group: T1-T4a, N2, M0'
  },
  {
    T: ['T4a'],
    N: ['N0', 'N1'],
    M: ['M0'],
    stage: 'IVA',
    source: 'AJCC 8th edition stage group: T4a, N0-N1, M0'
  },
  {
    T: ['T1', 'T2', 'T3'],
    N: ['N1'],
    M: ['M0'],
    stage: 'III',
    source: 'AJCC 8th edition stage group: T1-T3, N1, M0'
  },
  {
    T: ['T3'],
    N: ['N0'],
    M: ['M0'],
    stage: 'III',
    source: 'AJCC 8th edition stage group: T3, N0, M0'
  },
  {
    T: ['T2'],
    N: ['N0'],
    M: ['M0'],
    stage: 'II',
    source: 'AJCC 8th edition stage group: T2, N0, M0'
  },
  {
    T: ['T1'],
    N: ['N0'],
    M: ['M0'],
    stage: 'I',
    source: 'AJCC 8th edition stage group: T1, N0, M0'
  },
  {
    T: ['Tis'],
    N: ['N0'],
    M: ['M0'],
    stage: '0',
    source: 'AJCC 8th edition stage group: Tis, N0, M0'
  }
];

/**
 * Return a copy of an axis spec with certain category values removed.
 *
 * Used by the cervical nodes & unknown primary chapter, which exists only for
 * node-positive disease: N0 is not a meaningful answer there, and offering it
 * would let a student build T0 N0 M0, a combination AJCC does not stage.
 */
export function withoutValues(spec, values, dropStepOptions = {}) {
  if (spec.kind === 'direct') {
    return { ...spec, options: spec.options.filter((o) => !values.includes(o.value)) };
  }
  // For a derived spec, removing an outcome usually means the question option
  // that led to it must go too, or the student can pick an answer that
  // resolves to nothing.
  return {
    ...spec,
    steps: spec.steps.map((step) =>
      dropStepOptions[step.id]
        ? {
            ...step,
            options: step.options.filter((o) => !dropStepOptions[step.id].includes(o.value)),
            skipWhen: step.skipWhen
              ? Object.fromEntries(
                  Object.entries(step.skipWhen).map(([k, vals]) => [
                    k,
                    vals.filter((v) => !(dropStepOptions[k] || []).includes(v))
                  ])
                )
              : undefined
          }
        : step
    ),
    rules: spec.rules.filter((r) => !values.includes(r.value))
  };
}

/**
 * Carcinoma in situ cannot metastasise, so AJCC defines no stage group for
 * Tis with N or M disease. Rather than leave that combination unstaged, a Tis
 * answer forces N0 and M0 and skips both questions.
 */
export const TIS_FORCES = { N: 'N0', M: 'M0' };

/** Shared note explaining why cStage and pStage can differ on this table. */
export const HN8_CP_NOTE =
  'Clinical and pathological staging use the same stage-group table, but not the same N categories: pathological N counts microscopic extranodal extension while clinical N requires overt ENE. The same patient can therefore be clinical stage III and pathological stage IVA without any change in disease.';
