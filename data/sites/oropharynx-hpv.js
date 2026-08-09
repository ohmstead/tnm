// Oropharynx, HPV-associated (p16-positive) — AJCC/UICC Version 9 (chapter 10).
//
// Effective 1 January 2026. Verified against:
//   Ho AS, et al. Derivation and validation of the AJCC9V pathological stage
//   classification for HPV-positive oropharyngeal carcinoma: a multicentre
//   registry analysis. Lancet Oncol. 2025. PMID 40645195
//   Evans M, Huang SH, Ho AS, et al. HPV-Associated Oropharyngeal Squamous Cell
//   Carcinoma - Key Updates to the AJCC/UICC TNM9 Staging System.
//   Ann Surg Oncol. 2026;33:4905-4910. doi:10.1245/s10434-026-19496-2
// T definitions cross-checked against NCI PDQ (unchanged from the 8th edition).
//
// THIS IS THE ONLY HEAD & NECK SITE WHERE BOTH THE N DEFINITIONS AND THE STAGE
// GROUP TABLES DIFFER BETWEEN CLINICAL AND PATHOLOGICAL STAGING. Everything
// below is therefore defined twice, deliberately, rather than shared.
//
// Version 9 changes:
//   - T categories: unchanged from the 8th edition.
//   - cN: redefined to incorporate imaging-detected ENE (iENE). The clinical
//     stage-group TABLE is unchanged from the 8th edition, but the cN
//     categories feeding it are not. Same labels, different meaning.
//   - pN: wholly new count-based scheme (pN1a/pN1b/pN2/pN3) replacing the
//     8th edition's pN1 (<=4 nodes) / pN2 (>4 nodes) scheme.
//   - Pathological stage groups: rederived.

export default {
  id: 'oropharynx-hpv',
  name: 'Oropharynx — p16+ (HPV-associated)',
  short: 'Oropharynx p16+',
  chapter: 10,
  edition: {
    version: 9,
    label: 'AJCC Version 9',
    effective: '2026-01-01',
    note: 'Version 9 replaced the 8th edition for HPV-associated oropharynx effective 1 January 2026.'
  },
  citations: {
    ajcc: {
      text: 'AJCC Cancer Staging System: Oropharynx (HPV-Associated), Version 9 (effective 1 Jan 2026)',
      url: 'https://www.facs.org/quality-programs/cancer-programs/american-joint-committee-on-cancer/version-9/'
    },
    papers: [
      {
        text: 'Ho AS, et al. Derivation and validation of the AJCC9V pathological stage classification for HPV-positive oropharyngeal carcinoma: a multicentre registry analysis. Lancet Oncol. 2025.',
        pmid: '40645195',
        url: 'https://pubmed.ncbi.nlm.nih.gov/40645195/'
      },
      {
        text: 'Evans M, Huang SH, Ho AS, et al. HPV-Associated Oropharyngeal Squamous Cell Carcinoma — Key Updates to the AJCC/UICC TNM9 Staging System. Ann Surg Oncol. 2026;33:4905-4910.',
        doi: '10.1245/s10434-026-19496-2',
        url: 'https://link.springer.com/article/10.1245/s10434-026-19496-2'
      }
    ],
    asProvided: {
      text: 'Source URL provided on slide 3 of HN_staging.pptx',
      url: 'https://link.springer.com/article/10.1245/s10434-026-19496-2'
    }
  },
  basis: ['clinical', 'pathological'],
  basisNote:
    'Clinical staging applies to patients staged by examination and imaging. Pathological staging applies after neck dissection, and in Version 9 uses an entirely different nodal scheme and a different stage-group table — not merely a refinement of the clinical one.',

  requires: {
    id: 'p16',
    text: 'This chapter applies only to p16-positive (HPV-associated) oropharyngeal carcinoma. p16-negative disease is staged under chapter 11.',
    otherSite: 'oropharynx-p16neg'
  },

  axes: {
    // T is identical for clinical and pathological, and unchanged from 8e.
    // Note there is no Tis and no T4a/T4b subdivision in the p16+ system.
    T: {
      shared: {
        kind: 'direct',
        prompt: 'Primary tumour (T)',
        help: 'The p16-positive system has no Tis and no T4a/T4b split.',
        options: [
          {
            value: 'T0',
            label: 'T0',
            detail: 'No primary identified. Used for HPV-associated nodal disease with an occult primary.',
            source: 'AJCC v9 Oropharynx (HPV-Associated), T category; unchanged from 8th edition'
          },
          {
            value: 'T1',
            label: 'T1',
            detail: 'Tumour ≤2 cm in greatest dimension.',
            source: 'AJCC v9 Oropharynx (HPV-Associated), T category; unchanged from 8th edition'
          },
          {
            value: 'T2',
            label: 'T2',
            detail: 'Tumour >2 cm but ≤4 cm in greatest dimension.',
            source: 'AJCC v9 Oropharynx (HPV-Associated), T category; unchanged from 8th edition'
          },
          {
            value: 'T3',
            label: 'T3',
            detail: 'Tumour >4 cm in greatest dimension, or extension to the lingual surface of the epiglottis.',
            source: 'AJCC v9 Oropharynx (HPV-Associated), T category; unchanged from 8th edition'
          },
          {
            value: 'T4',
            label: 'T4',
            detail:
              'Moderately advanced local disease. Tumour invades the larynx, extrinsic muscle of the tongue, medial pterygoid, hard palate, or mandible, or beyond.',
            source: 'AJCC v9 Oropharynx (HPV-Associated), T category; unchanged from 8th edition'
          }
        ]
      }
    },

    N: {
      // ---- CLINICAL N: redefined in v9 around imaging-detected ENE ----
      clinical: {
        kind: 'derived',
        steps: [
          {
            id: 'extent',
            prompt: 'Nodal extent on imaging / examination',
            options: [
              { value: 'none', label: 'No involved nodes on imaging or clinical examination' },
              { value: 'ipsi', label: 'Ipsilateral neck node(s), all ≤6 cm' },
              { value: 'bilat', label: 'Contralateral and/or bilateral neck node(s), all ≤6 cm' },
              { value: 'over6', label: 'Any node >6 cm' }
            ]
          },
          {
            id: 'iene',
            prompt: 'Imaging-detected extranodal extension (iENE)?',
            help:
              'New in Version 9: iENE now separates cN1 from cN2, and upgrades bilateral disease to cN3. It had no role in the 8th edition clinical N categories.',
            skipWhen: { extent: ['none', 'over6'] },
            options: [
              { value: 'no', label: 'iENE-negative' },
              { value: 'yes', label: 'iENE-positive' }
            ]
          }
        ],
        rules: [
          {
            when: { extent: ['none'] },
            value: 'N0',
            detail: 'No involved lymph nodes on imaging or clinical examination.',
            source: 'AJCC v9 Oropharynx (HPV-Associated), clinical N category'
          },
          {
            when: { extent: ['over6'] },
            value: 'N3',
            detail: 'Any lymph node >6 cm.',
            source: 'AJCC v9 Oropharynx (HPV-Associated), clinical N category'
          },
          {
            when: { extent: ['bilat'], iene: ['yes'] },
            value: 'N3',
            detail: 'Bilateral neck lymph nodes and iENE-positive.',
            source: 'AJCC v9 Oropharynx (HPV-Associated), clinical N category'
          },
          {
            when: { extent: ['ipsi'], iene: ['yes'] },
            value: 'N2',
            detail: 'Ipsilateral neck lymph nodes ≤6 cm and iENE-positive.',
            source: 'AJCC v9 Oropharynx (HPV-Associated), clinical N category'
          },
          {
            when: { extent: ['bilat'], iene: ['no'] },
            value: 'N2',
            detail: 'Bilateral neck lymph nodes ≤6 cm and iENE-negative.',
            source: 'AJCC v9 Oropharynx (HPV-Associated), clinical N category'
          },
          {
            when: { extent: ['ipsi'], iene: ['no'] },
            value: 'N1',
            detail: 'Ipsilateral neck lymph nodes ≤6 cm and iENE-negative.',
            source: 'AJCC v9 Oropharynx (HPV-Associated), clinical N category'
          }
        ]
      },

      // ---- PATHOLOGICAL N: entirely new count-based scheme in v9 ----
      pathological: {
        kind: 'derived',
        steps: [
          {
            id: 'count',
            prompt: 'Number of positive lymph nodes in the specimen',
            options: [
              { value: '0', label: 'None — no involved nodes' },
              { value: '1', label: '1 positive node' },
              { value: '2to4', label: '2–4 positive nodes' },
              { value: 'over4', label: 'More than 4 positive nodes' }
            ]
          },
          {
            id: 'pene',
            prompt: 'Pathological extranodal extension (pENE)?',
            skipWhen: { count: ['0'] },
            options: [
              { value: 'no', label: 'pENE-negative' },
              { value: 'yes', label: 'pENE-positive' }
            ]
          }
        ],
        rules: [
          {
            when: { count: ['0'] },
            value: 'N0',
            detail: 'No involved lymph nodes in the pathological specimen.',
            source: 'AJCC v9 Oropharynx (HPV-Associated), pathological N category; Ho 2025'
          },
          {
            when: { count: ['over4'], pene: ['yes'] },
            value: 'N3',
            detail: 'More than 4 positive nodes and pENE-positive.',
            source: 'AJCC v9 Oropharynx (HPV-Associated), pathological N category; Ho 2025'
          },
          {
            when: { count: ['1', '2to4'], pene: ['yes'] },
            value: 'N2',
            detail: '1–4 positive nodes and pENE-positive.',
            source: 'AJCC v9 Oropharynx (HPV-Associated), pathological N category; Ho 2025'
          },
          {
            when: { count: ['over4'], pene: ['no'] },
            value: 'N2',
            detail: 'More than 4 positive nodes and pENE-negative.',
            source: 'AJCC v9 Oropharynx (HPV-Associated), pathological N category; Ho 2025'
          },
          {
            when: { count: ['2to4'], pene: ['no'] },
            value: 'N1b',
            detail: '2–4 positive nodes and pENE-negative.',
            source: 'AJCC v9 Oropharynx (HPV-Associated), pathological N category; Ho 2025'
          },
          {
            when: { count: ['1'], pene: ['no'] },
            value: 'N1a',
            detail: '1 positive node and pENE-negative.',
            source: 'AJCC v9 Oropharynx (HPV-Associated), pathological N category; Ho 2025'
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
            source: 'AJCC v9 Oropharynx (HPV-Associated), M category'
          },
          {
            value: 'M1',
            label: 'M1',
            detail: 'Distant metastasis present.',
            source: 'AJCC v9 Oropharynx (HPV-Associated), M category'
          }
        ]
      }
    }
  },

  stageGroups: {
    // Clinical table is unchanged from the 8th edition — but see notes: the cN
    // categories feeding it were redefined in Version 9.
    clinical: [
      {
        M: ['M1'],
        stage: 'IV',
        source: 'AJCC v9 HPV-associated oropharynx clinical stage group: any T, any N, M1'
      },
      {
        T: ['T4'],
        M: ['M0'],
        stage: 'III',
        source: 'AJCC v9 HPV-associated oropharynx clinical stage group: T4, any N, M0'
      },
      {
        N: ['N3'],
        M: ['M0'],
        stage: 'III',
        source: 'AJCC v9 HPV-associated oropharynx clinical stage group: any T, N3, M0'
      },
      {
        T: ['T3'],
        N: ['N0', 'N1', 'N2'],
        M: ['M0'],
        stage: 'II',
        source: 'AJCC v9 HPV-associated oropharynx clinical stage group: T3, N0-2, M0'
      },
      {
        T: ['T0', 'T1', 'T2'],
        N: ['N2'],
        M: ['M0'],
        stage: 'II',
        source: 'AJCC v9 HPV-associated oropharynx clinical stage group: T0-2, N2, M0'
      },
      {
        T: ['T0', 'T1', 'T2'],
        N: ['N0', 'N1'],
        M: ['M0'],
        stage: 'I',
        source: 'AJCC v9 HPV-associated oropharynx clinical stage group: T0-2, N0-1, M0'
      }
    ],

    // Pathological table rederived in Version 9 (Ho 2025, Lancet Oncol).
    // Note N1a and N1b both behave as "N1" in this table.
    pathological: [
      {
        M: ['M1'],
        stage: 'IV',
        source: 'AJCC v9 HPV-associated oropharynx pathological stage group: M1 (Ho 2025)'
      },
      {
        T: ['T4'],
        M: ['M0'],
        stage: 'III',
        source: 'AJCC v9 HPV-associated oropharynx pathological stage group: T4, N0-3, M0 (Ho 2025)'
      },
      {
        T: ['T3'],
        N: ['N3'],
        M: ['M0'],
        stage: 'III',
        source: 'AJCC v9 HPV-associated oropharynx pathological stage group: T3, N3, M0 (Ho 2025)'
      },
      {
        T: ['T3'],
        N: ['N0', 'N1a', 'N1b', 'N2'],
        M: ['M0'],
        stage: 'II',
        source: 'AJCC v9 HPV-associated oropharynx pathological stage group: T3, N0-2, M0 (Ho 2025)'
      },
      {
        T: ['T0', 'T1', 'T2'],
        N: ['N2', 'N3'],
        M: ['M0'],
        stage: 'II',
        source: 'AJCC v9 HPV-associated oropharynx pathological stage group: T0-2, N2-3, M0 (Ho 2025)'
      },
      {
        T: ['T0', 'T1', 'T2'],
        N: ['N0', 'N1a', 'N1b'],
        M: ['M0'],
        stage: 'I',
        source: 'AJCC v9 HPV-associated oropharynx pathological stage group: T0-2, N0-1, M0 (Ho 2025)'
      }
    ]
  },

  notes: [
    'Watch this trap: the CLINICAL stage-group table is unchanged from the 8th edition, but the cN categories underneath it were redefined in Version 9 to incorporate imaging-detected ENE. The same stage label can mean a different thing than it did in 2025.',
    'Pathological N is now counted, not measured: pN1a = 1 node, pN1b = 2–4 nodes, pN2 = >4 nodes or any 1–4 with pENE, pN3 = >4 nodes with pENE. Node size does not enter pathological staging at all.',
    'pN1a and pN1b group together as "N1" in the pathological stage table — the split carries prognostic information without changing the stage group.',
    'There is no Tis and no T4a/T4b in the p16-positive system.',
    'The Version 9 table wording for cN2/cN3 says "bilateral"; the 8th edition said "contralateral or bilateral". Contralateral-only nodal disease is handled in the same category here.'
  ]
};
