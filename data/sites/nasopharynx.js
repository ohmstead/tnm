// Nasopharyngeal carcinoma — AJCC/UICC Version 9 (chapter 9).
//
// Effective 1 January 2025. Verified against:
//   Pan JJ, Mai H, Ng WT, et al. Ninth Version of the AJCC and UICC
//   Nasopharyngeal Cancer TNM Staging Classification.
//   JAMA Oncol. 2024;10(12):1627-1635. doi:10.1001/jamaoncol.2024.4354
// and against the AJCC "Current Staging System 2026" master table
// (facs.org), which lists chapter 9 as Version 9, year 2025.
//
// Changes from the 8th edition, all reflected below:
//   - T categories: wording clarified, no change in substance.
//   - N3 now additionally includes advanced radiologic extranodal extension
//     (involvement of adjacent muscle, skin, or neurovascular bundle).
//   - M1 subdivided into M1a (<=3 metastatic lesions) and M1b (>3), which
//     splits the old stage IVB into IVA (M1a) and IVB (M1b).
//
// NPC is staged clinically: it is managed with chemoradiotherapy and is not
// routinely resected, so there is no pathological stage group. The app offers
// clinical staging only for this site.

export default {
  id: 'nasopharynx',
  name: 'Nasopharynx',
  short: 'Nasopharynx',
  chapter: 9,
  edition: {
    version: 9,
    label: 'AJCC Version 9',
    effective: '2025-01-01',
    note: 'Version 9 replaced the 8th edition for nasopharynx effective 1 January 2025.'
  },
  citations: {
    ajcc: {
      text: 'AJCC Cancer Staging System: Nasopharynx, Version 9 (effective 1 Jan 2025)',
      url: 'https://www.facs.org/quality-programs/cancer-programs/american-joint-committee-on-cancer/version-9/'
    },
    papers: [
      {
        text: 'Pan JJ, Mai H, Ng WT, et al. Ninth Version of the AJCC and UICC Nasopharyngeal Cancer TNM Staging Classification. JAMA Oncol. 2024;10(12):1627-1635.',
        doi: '10.1001/jamaoncol.2024.4354',
        url: 'https://jamanetwork.com/journals/jamaoncology/fullarticle/2824837'
      }
    ],
    asProvided: null
  },
  basis: ['clinical'],
  basisNote:
    'Nasopharyngeal carcinoma is staged clinically. It is treated with definitive chemoradiotherapy rather than resection, so AJCC defines no separate pathological stage group.',

  axes: {
    T: {
      shared: {
        kind: 'direct',
        prompt: 'Primary tumour (T)',
        options: [
          {
            value: 'T1',
            label: 'T1',
            detail:
              'Tumour confined to the nasopharynx, or extension to the oropharynx and/or nasal cavity (including nasal septum), WITHOUT parapharyngeal involvement.',
            source: 'AJCC v9 Nasopharynx; Pan 2024 Table (T category)'
          },
          {
            value: 'T2',
            label: 'T2',
            detail:
              'Extension to the parapharyngeal space, and/or adjacent soft tissue involvement (medial pterygoid, lateral pterygoid, prevertebral muscles).',
            source: 'AJCC v9 Nasopharynx; Pan 2024 Table (T category)'
          },
          {
            value: 'T3',
            label: 'T3',
            detail:
              'Unequivocal infiltration into any of: skull base (including pterygoid structures), paranasal sinuses, or cervical vertebrae.',
            source: 'AJCC v9 Nasopharynx; Pan 2024 Table (T category)'
          },
          {
            value: 'T4',
            label: 'T4',
            detail:
              'Any of: intracranial extension; unequivocal radiologic and/or clinical involvement of cranial nerves; hypopharynx; orbit (including inferior orbital fissure); parotid gland; or extensive soft tissue infiltration beyond the anterolateral surface of the lateral pterygoid muscle.',
            source: 'AJCC v9 Nasopharynx; Pan 2024 Table (T category)'
          }
        ]
      }
    },

    // N is asked as two short questions rather than one dense list, because the
    // v9 criteria combine laterality/size/level with the new advanced-ENE rule.
    N: {
      shared: {
        kind: 'derived',
        steps: [
          {
            id: 'extent',
            prompt: 'Nodal extent',
            help: 'The cricoid landmark is the caudal border of the cricoid cartilage.',
            options: [
              { value: 'none', label: 'No regional nodal involvement' },
              {
                value: 'unilateral',
                label: 'Unilateral cervical node(s), and/or retropharyngeal node(s) (uni- or bilateral)',
                detail: 'All ≤6 cm and above the caudal border of the cricoid cartilage. Retropharyngeal nodes count here irrespective of laterality.'
              },
              {
                value: 'bilateral',
                label: 'Bilateral cervical node(s)',
                detail: 'All ≤6 cm and above the caudal border of the cricoid cartilage.'
              },
              {
                value: 'advanced',
                label: 'Node >6 cm, OR extension below the caudal border of the cricoid cartilage',
                detail: 'Either criterion alone is sufficient.'
              }
            ]
          },
          {
            id: 'ene',
            prompt: 'Advanced extranodal extension?',
            help:
              'Version 9 addition: advanced radiologic ENE means involvement of adjacent muscle, skin, or the neurovascular bundle. This alone makes the tumour N3.',
            skipWhen: { extent: ['none', 'advanced'] },
            options: [
              { value: 'no', label: 'No advanced ENE' },
              { value: 'yes', label: 'Advanced ENE present' }
            ]
          }
        ],
        rules: [
          {
            when: { extent: ['none'] },
            value: 'N0',
            detail: 'No tumour involvement of regional lymph node(s).',
            source: 'AJCC v9 Nasopharynx; Pan 2024 Table (N category)'
          },
          {
            when: { ene: ['yes'] },
            value: 'N3',
            detail:
              'Advanced extranodal extension with involvement of adjacent muscle, skin, or neurovascular bundle. New N3 criterion in Version 9.',
            source: 'AJCC v9 Nasopharynx; Pan 2024 Table (N category)'
          },
          {
            when: { extent: ['advanced'] },
            value: 'N3',
            detail:
              'Cervical node(s) >6 cm in greatest dimension, and/or extension below the caudal border of the cricoid cartilage.',
            source: 'AJCC v9 Nasopharynx; Pan 2024 Table (N category)'
          },
          {
            when: { extent: ['unilateral'] },
            value: 'N1',
            detail:
              'Unilateral cervical node(s) and/or uni- or bilateral retropharyngeal node(s), all ≤6 cm, above the caudal border of the cricoid cartilage, without advanced ENE.',
            source: 'AJCC v9 Nasopharynx; Pan 2024 Table (N category)'
          },
          {
            when: { extent: ['bilateral'] },
            value: 'N2',
            detail:
              'Bilateral cervical nodes, all ≤6 cm, above the caudal border of the cricoid cartilage, without advanced ENE.',
            source: 'AJCC v9 Nasopharynx; Pan 2024 Table (N category)'
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
            source: 'AJCC v9 Nasopharynx; Pan 2024 Table (M category)'
          },
          {
            value: 'M1a',
            label: 'M1a',
            detail:
              '≤3 metastatic lesions, in one or more organs/sites. New subdivision in Version 9.',
            source: 'AJCC v9 Nasopharynx; Pan 2024 Table (M category)'
          },
          {
            value: 'M1b',
            label: 'M1b',
            detail:
              '>3 metastatic lesions, in one or more organs/sites. New subdivision in Version 9.',
            source: 'AJCC v9 Nasopharynx; Pan 2024 Table (M category)'
          }
        ]
      }
    }
  },

  // Ordered, first match wins. Transcribed from the Version 9 stage-group grid
  // (Pan 2024, Figure 1B) and cross-checked against the deck's slide 8 image.
  stageGroups: {
    shared: [
      {
        M: ['M1a'],
        stage: 'IVA',
        source: 'AJCC v9 Nasopharynx stage group: any T, any N, M1a'
      },
      {
        M: ['M1b'],
        stage: 'IVB',
        source: 'AJCC v9 Nasopharynx stage group: any T, any N, M1b'
      },
      {
        T: ['T4'],
        M: ['M0'],
        stage: 'III',
        source: 'AJCC v9 Nasopharynx stage group: T4, any N, M0'
      },
      {
        N: ['N3'],
        M: ['M0'],
        stage: 'III',
        source: 'AJCC v9 Nasopharynx stage group: any T, N3, M0'
      },
      {
        T: ['T3'],
        N: ['N0', 'N1', 'N2'],
        M: ['M0'],
        stage: 'II',
        source: 'AJCC v9 Nasopharynx stage group: T3, N0-2, M0'
      },
      {
        T: ['T1', 'T2'],
        N: ['N2'],
        M: ['M0'],
        stage: 'II',
        source: 'AJCC v9 Nasopharynx stage group: T1-2, N2, M0'
      },
      {
        T: ['T1', 'T2'],
        N: ['N1'],
        M: ['M0'],
        stage: 'IB',
        source: 'AJCC v9 Nasopharynx stage group: T1-2, N1, M0'
      },
      {
        T: ['T1', 'T2'],
        N: ['N0'],
        M: ['M0'],
        stage: 'IA',
        source: 'AJCC v9 Nasopharynx stage group: T1-2, N0, M0'
      }
    ]
  },

  notes: [
    'Version 9 split the old stage IVB by metastatic burden: M1a (≤3 lesions) is now stage IVA and M1b (>3 lesions) is stage IVB. Under the 8th edition all M1 disease was a single stage IVB.',
    'Advanced radiologic extranodal extension is a Version 9 addition to N3. A node that would otherwise be N1 or N2 becomes N3 — and therefore stage III — on ENE alone.',
    'Stage I is subdivided into IA (N0) and IB (N1) in Version 9.'
  ]
};
