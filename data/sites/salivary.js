// Salivary gland carcinoma — AJCC/UICC Version 9 (chapter 8).
//
// Effective 1 January 2026. Verified against:
//   Key Updates on the Version 9 AJCC/UICC Staging System for Salivary Gland
//   Carcinoma. Ann Surg Oncol. 2026. doi:10.1245/s10434-026-19350-5
//   Proposed Version Nine of the AJCC and UICC TNM Classification for Salivary
//   Gland Carcinoma. PMID 41678147
//
// Version 9 changes:
//   - MAJOR AND MINOR salivary gland carcinomas are now staged together in one
//     system. The 8th edition chapter covered major glands only; minor gland
//     tumours were staged by their site of origin (e.g. oral cavity). This is
//     the single biggest practical change.
//   - N simplified to a count-and-ENE scheme: N0 / N1 (1-3 nodes, ENE-) /
//     N2 (>3 nodes or any ENE+). The 8th edition's size-based N2a/b/c and
//     N3a/b subcategories are gone.
//   - Stage IV is now reserved exclusively for M1 disease. Locally advanced
//     M0 disease that was stage IVA/IVB in the 8th edition is now stage III.
//   - Stage III split into IIIA and IIIB.
//
// cTNM and pTNM use IDENTICAL criteria in Version 9 — cN is based on
// radiologic node count and imaging-detected ENE (iENE), pN on the specimen
// and pENE, but the thresholds are the same. The app therefore does not ask
// the user to choose a staging basis for this site.

export default {
  id: 'salivary',
  name: 'Salivary Glands',
  short: 'Salivary gland',
  chapter: 8,
  edition: {
    version: 9,
    label: 'AJCC Version 9',
    effective: '2026-01-01',
    note: 'Version 9 replaced the 8th edition for salivary glands effective 1 January 2026, and now covers minor as well as major glands.'
  },
  citations: {
    ajcc: {
      text: 'AJCC Cancer Staging System: Salivary Glands, Version 9 (effective 1 Jan 2026)',
      url: 'https://www.facs.org/quality-programs/cancer-programs/american-joint-committee-on-cancer/version-9/'
    },
    papers: [
      {
        text: 'Key Updates on the Version 9 AJCC/UICC Staging System for Salivary Gland Carcinoma. Ann Surg Oncol. 2026.',
        doi: '10.1245/s10434-026-19350-5',
        url: 'https://link.springer.com/article/10.1245/s10434-026-19350-5'
      },
      {
        text: 'Proposed Version Nine of the AJCC and UICC TNM Classification for Salivary Gland Carcinoma.',
        pmid: '41678147',
        url: 'https://pubmed.ncbi.nlm.nih.gov/41678147/'
      }
    ],
    asProvided: {
      text: 'Source URL provided on slide 7 of HN_staging.pptx',
      url: 'https://link.springer.com/article/10.1245/s10434-026-19350-5/tables/1'
    }
  },
  basis: ['clinical', 'pathological'],
  basisNote:
    'Version 9 uses identical criteria for cTNM and pTNM. Clinical N uses radiologic node count and imaging-detected ENE (iENE); pathological N uses the specimen and pENE. The thresholds, and therefore the stage group, are the same either way.',

  axes: {
    T: {
      shared: {
        kind: 'derived',
        steps: [
          {
            id: 'local',
            prompt: 'Local extent',
            options: [
              { value: 'confined', label: 'Confined to the gland — no gross extraparenchymal extension' },
              {
                value: 'epe',
                label: 'Gross extraparenchymal extension (major glands only)',
                detail:
                  'Requires clinical or macroscopic — not microscopic — evidence of soft-tissue invasion, and excludes features that would qualify as T4a/T4b. Minor gland tumours are staged by size alone for T1–T3.'
              },
              {
                value: 'adjacent',
                label: 'Invades immediately adjacent structures',
                detail: 'Bone, skin, cartilage, named nerve, solid organ parenchyma, etc.'
              },
              { value: 'beyond', label: 'Invades beyond adjacent structures' }
            ]
          },
          {
            id: 'size',
            prompt: 'Greatest dimension',
            skipWhen: { local: ['epe', 'adjacent', 'beyond'] },
            options: [
              { value: 'le2', label: '≤2 cm' },
              { value: 'gt2le4', label: '>2 cm and ≤4 cm' },
              { value: 'gt4', label: '>4 cm' }
            ]
          }
        ],
        rules: [
          {
            when: { local: ['beyond'] },
            value: 'T4b',
            detail: 'Very advanced disease — tumour invades beyond immediately adjacent structures.',
            source: 'AJCC v9 Salivary Glands, T category'
          },
          {
            when: { local: ['adjacent'] },
            value: 'T4a',
            detail:
              'Moderately advanced disease — tumour invades immediately adjacent structures (bone, skin, cartilage, named nerve, solid organ parenchyma, etc.).',
            source: 'AJCC v9 Salivary Glands, T category'
          },
          {
            when: { local: ['epe'] },
            value: 'T3',
            detail:
              'Gross extraparenchymal extension. Applicable to major salivary glands only, and only with clinical or macroscopic evidence of soft-tissue invasion.',
            source: 'AJCC v9 Salivary Glands, T category'
          },
          {
            when: { local: ['confined'], size: ['gt4'] },
            value: 'T3',
            detail: 'Tumour >4 cm.',
            source: 'AJCC v9 Salivary Glands, T category'
          },
          {
            when: { local: ['confined'], size: ['gt2le4'] },
            value: 'T2',
            detail: 'Tumour >2 cm but ≤4 cm, and no gross extraparenchymal extension.',
            source: 'AJCC v9 Salivary Glands, T category'
          },
          {
            when: { local: ['confined'], size: ['le2'] },
            value: 'T1',
            detail: 'Tumour ≤2 cm, and no gross extraparenchymal extension.',
            source: 'AJCC v9 Salivary Glands, T category'
          }
        ]
      }
    },

    N: {
      shared: {
        kind: 'derived',
        steps: [
          {
            id: 'count',
            prompt: 'Number of positive lymph nodes',
            help: 'Clinically, this is the count of abnormal nodes on imaging; pathologically, positive nodes in the specimen.',
            options: [
              { value: '0', label: 'None' },
              { value: '1to3', label: '1–3 positive nodes' },
              { value: 'over3', label: 'More than 3 positive nodes' }
            ]
          },
          {
            id: 'ene',
            prompt: 'Extranodal extension?',
            help: 'iENE on imaging for clinical staging, pENE on the specimen for pathological staging. Either makes the tumour N2.',
            skipWhen: { count: ['0'] },
            options: [
              { value: 'no', label: 'ENE-negative' },
              { value: 'yes', label: 'ENE-positive' }
            ]
          }
        ],
        rules: [
          {
            when: { count: ['0'] },
            value: 'N0',
            detail: 'No positive lymph nodes.',
            source: 'AJCC v9 Salivary Glands, N category'
          },
          {
            when: { ene: ['yes'] },
            value: 'N2',
            detail: 'Any ENE-positive lymph node.',
            source: 'AJCC v9 Salivary Glands, N category'
          },
          {
            when: { count: ['over3'] },
            value: 'N2',
            detail: 'More than 3 positive lymph nodes.',
            source: 'AJCC v9 Salivary Glands, N category'
          },
          {
            when: { count: ['1to3'] },
            value: 'N1',
            detail: '1–3 positive lymph nodes, ENE-negative.',
            source: 'AJCC v9 Salivary Glands, N category'
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
            detail: 'No distant metastasis. Unchanged from the 8th edition.',
            source: 'AJCC v9 Salivary Glands, M category'
          },
          {
            value: 'M1',
            label: 'M1',
            detail: 'Distant metastasis present. Unchanged from the 8th edition.',
            source: 'AJCC v9 Salivary Glands, M category'
          }
        ]
      }
    }
  },

  stageGroups: {
    shared: [
      {
        M: ['M1'],
        stage: 'IV',
        source: 'AJCC v9 Salivary Glands stage group: any T, any N, M1. Stage IV is M1 disease only.'
      },
      {
        N: ['N2'],
        M: ['M0'],
        stage: 'IIIB',
        source: 'AJCC v9 Salivary Glands stage group: any T, N2, M0'
      },
      {
        T: ['T3', 'T4a', 'T4b'],
        N: ['N1'],
        M: ['M0'],
        stage: 'IIIB',
        source: 'AJCC v9 Salivary Glands stage group: T3-4, N1, M0'
      },
      {
        T: ['T1', 'T2'],
        N: ['N1'],
        M: ['M0'],
        stage: 'IIIA',
        source: 'AJCC v9 Salivary Glands stage group: T1-2, N1, M0'
      },
      {
        T: ['T3', 'T4a', 'T4b'],
        N: ['N0'],
        M: ['M0'],
        stage: 'IIIA',
        source: 'AJCC v9 Salivary Glands stage group: T3-4, N0, M0'
      },
      {
        T: ['T2'],
        N: ['N0'],
        M: ['M0'],
        stage: 'II',
        source: 'AJCC v9 Salivary Glands stage group: T2, N0, M0'
      },
      {
        T: ['T1'],
        N: ['N0'],
        M: ['M0'],
        stage: 'I',
        source: 'AJCC v9 Salivary Glands stage group: T1, N0, M0'
      }
    ]
  },

  notes: [
    'Version 9 unified major and minor salivary gland carcinoma into one staging system. Under the 8th edition, a minor salivary gland tumour was staged by its site of origin — a palatal minor gland carcinoma was staged as an oral cavity cancer.',
    'Stage IV now means M1 and nothing else. Locally advanced M0 disease that was stage IVA or IVB in the 8th edition is stage IIIA or IIIB in Version 9 — the same patient, a dramatically different-sounding stage.',
    'The 8th edition size-based nodal subcategories (N2a/N2b/N2c, N3a/N3b) no longer exist. Nodal staging is now node count plus ENE.',
    'Gross extraparenchymal extension is a T3 criterion for major glands only. Minor gland tumours are staged by size alone across T1–T3.',
    'Because cTNM and pTNM criteria are identical, this site has no clinical/pathological toggle.'
  ]
};
