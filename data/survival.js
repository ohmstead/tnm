// Survival data and figure references, keyed by site (and staging basis where
// the two diverge), then by prognostic stage.
//
// HOW THIS WORKS
// --------------
// Each entry names the paper whose Kaplan-Meier figure belongs with that
// staging system, the endpoint it reports (these differ between papers and
// must never be conflated), the cohort, and the published survival estimate
// for each stage.
//
// Figure images live in assets/survival/<key>.png and are displayed
// automatically when present; when one is absent the app renders the citation
// card with the published estimate and a link to the source figure instead, so
// the app still works with that directory empty. See assets/survival/README.md
// for the naming convention and for the licensing caveat on bundling a
// published figure.
//
// `paperFile`, where present, points at a local PDF of the source paper under
// assets/survival/papers/ — kept so the figure, endpoint and cohort recorded
// here can be re-checked against the paper without hunting for it again.
//
// `key` is the image basename. Sites whose clinical and pathological stage
// groups differ carry one entry per basis.

export const SURVIVAL = {
  'oropharynx-hpv:clinical': {
    key: 'oropharynx-hpv-clinical',
    endpoint: 'Overall survival',
    citation:
      'O’Sullivan B, Huang SH, Su J, et al. Development and validation of a staging system for HPV-related oropharyngeal cancer by the International Collaboration on Oropharyngeal cancer Network for Staging (ICON-S). Lancet Oncol. 2016;17(4):440-451.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/26936027/',
    figure:
      'Figure 3 (AHR-New stage panels, training and validation cohorts) — Kaplan-Meier overall survival by clinical stage I / II / III',
    paperFile: 'assets/survival/papers/1-s2.0-S1470204515005604-main.pdf',
    note: 'The AJCC Version 9 clinical stage-group table is unchanged from the 8th edition, which was derived from ICON-S. The cN definitions feeding it did change in Version 9.',
    stages: {}
  },
  'oropharynx-hpv:pathological': {
    key: 'oropharynx-hpv-pathological',
    endpoint: 'Overall survival',
    citation:
      'Ho AS, et al. Derivation and validation of the AJCC9V pathological stage classification for HPV-positive oropharyngeal carcinoma: a multicentre registry analysis. Lancet Oncol. 2025.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/40645195/',
    figure:
      'Figure 3 (A) AJCC8E derivation, (B) AJCC9V derivation, (C) AJCC9V validation — Kaplan-Meier overall survival by pathological stage',
    paperFile: 'assets/survival/papers/1-s2.0-S1470204525002815-main.pdf',
    stages: {}
  },

  nasopharynx: {
    key: 'nasopharynx',
    endpoint: 'Overall survival',
    cohort: '4,914 patients, median follow-up 68 months',
    citation:
      'Pan JJ, Mai H, Ng WT, et al. Ninth Version of the AJCC and UICC Nasopharyngeal Cancer TNM Staging Classification. JAMA Oncol. 2024;10(12):1627-1635.',
    url: 'https://jamanetwork.com/journals/jamaoncology/fullarticle/2824837',
    figure: 'Figure 2 — Kaplan-Meier overall survival by Version 9 stage',
    // 5-year overall survival as reported in the derivation cohort.
    stages: {
      IA: '~97% 5-year OS',
      IB: '~96% 5-year OS',
      II: '~93% 5-year OS',
      IVA: '~61% 5-year OS',
      IVB: '~44% 5-year OS'
    }
  },

  salivary: {
    key: 'salivary',
    endpoint: 'Overall survival',
    citation:
      'Proposed Version Nine of the AJCC and UICC TNM Classification for Salivary Gland Carcinoma. (PMID 41678147); see also Key Updates on the Version 9 AJCC/UICC Staging System for Salivary Gland Carcinoma. Ann Surg Oncol. 2026.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/41678147/',
    figure: 'Kaplan-Meier overall survival by Version 9 stage (I, II, IIIA, IIIB, IV)',
    stages: {}
  },

  'oral-cavity': {
    key: 'oral-cavity',
    endpoint: 'Observed survival',
    citation:
      'AJCC Cancer Staging Manual, 8th edition, Chapter 7 (survival data figures, NCDB); Lydiatt WM, et al. CA Cancer J Clin. 2017;67(2):122-137.',
    url: 'https://acsjournals.onlinelibrary.wiley.com/doi/full/10.3322/caac.21389',
    figure: 'NCDB observed survival by 8th edition stage group',
    stages: {}
  },

  'oropharynx-p16neg': {
    key: 'oropharynx-p16neg',
    endpoint: 'Observed survival',
    citation:
      'AJCC Cancer Staging Manual, 8th edition, Chapter 11 (survival data figures, NCDB); Lydiatt WM, et al. CA Cancer J Clin. 2017;67(2):122-137.',
    url: 'https://acsjournals.onlinelibrary.wiley.com/doi/full/10.3322/caac.21389',
    figure: 'NCDB observed survival by 8th edition stage group',
    stages: {}
  },

  hypopharynx: {
    key: 'hypopharynx',
    endpoint: 'Disease-specific survival',
    citation:
      'Lin C, et al. Comparing the 7th and 8th Editions of AJCC Staging System for Hypopharyngeal Cancer Undergoing Surgery. Otolaryngol Head Neck Surg. 2025.',
    url: 'https://aao-hnsfjournals.onlinelibrary.wiley.com/doi/10.1002/ohn.1311',
    figure: 'Disease-specific survival by 8th edition stage group',
    note: 'This paper reports an overlap between stages III and IVA — worth showing students as an example of a stage boundary that does not fully separate.',
    stages: {}
  },

  larynx: {
    key: 'larynx',
    endpoint: 'Observed survival',
    citation:
      'AJCC Cancer Staging Manual, 8th edition, Chapter 13 (survival data figures, NCDB); Lydiatt WM, et al. CA Cancer J Clin. 2017;67(2):122-137.',
    url: 'https://acsjournals.onlinelibrary.wiley.com/doi/full/10.3322/caac.21389',
    figure: 'NCDB observed survival by 8th edition stage group',
    stages: {}
  },

  sinonasal: {
    key: 'sinonasal',
    endpoint: 'Overall survival',
    citation:
      'Farrell NF, et al. Predictors of survival outcomes in sinonasal squamous cell carcinoma: an analysis of the National Cancer Database. Int Forum Allergy Rhinol. 2021.',
    url: 'https://onlinelibrary.wiley.com/doi/abs/10.1002/alr.22737',
    figure: 'NCDB overall survival by stage',
    stages: {}
  },

  'cervical-unknown-primary': {
    key: 'cervical-unknown-primary',
    endpoint: 'Observed survival',
    citation: 'AJCC Cancer Staging Manual, 8th edition, Chapter 6 (survival data figures).',
    url: 'https://www.facs.org/media/i2kn34ed/head-and-neck-8th-ed.pdf',
    figure: 'Observed survival by 8th edition stage group',
    pending:
      'No suitable stage-specific survival curve has been selected for this chapter yet. Rather than show a curve from a mismatched cohort, this site currently displays citations only.',
    stages: {}
  },

  'mucosal-melanoma': {
    key: 'mucosal-melanoma',
    endpoint: 'Overall survival',
    citation: 'AJCC Cancer Staging Manual, 8th edition, Chapter 14 (survival data figures).',
    url: 'https://www.facs.org/media/c5ik5tkr/ajcc-current-staging-system-2026.pdf',
    figure: 'Observed survival by stage III / IVA / IVB / IVC',
    pending:
      'No suitable stage-specific survival curve has been selected for this chapter yet. The published literature on head & neck mucosal melanoma is thin and cohorts are small. Citations only for now.',
    stages: {}
  },

  cutaneous: {
    key: 'cutaneous',
    // The bundled figure is panel D of the Karia figure, which plots OVERALL
    // survival. Panels A-C of the same figure are cumulative incidence of local
    // recurrence, nodal metastasis and disease-specific death — not survival
    // curves — so the endpoint here is overall survival, not DSS.
    endpoint: 'Overall survival',
    cohort: '680 primary head & neck cutaneous SCC tumours in 459 patients, 2000-2009',
    citation:
      'Karia PS, Morgan FC, Califano JA, Schmults CD. Comparison of Tumor Classifications for Cutaneous Squamous Cell Carcinoma of the Head and Neck in the 7th vs 8th Edition of the AJCC Cancer Staging Manual. JAMA Dermatol. 2018;154(2):175-181.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/29261835/',
    figure:
      'Figure, panel D — Kaplan-Meier overall survival by AJCC 8 T category (T1, T2, T3, T4b)',
    paperFile: 'assets/survival/papers/jamadermatology_karia_2017_oi_170055.pdf',
    note: 'This figure stratifies by T CATEGORY, not by prognostic stage group — the paper validates the 8th edition T classification. Note also that T2 and T3 overlap almost completely, while T4b separates sharply.',
    stages: {}
  },

  thyroid: {
    key: 'thyroid',
    endpoint: 'Disease-specific survival (10-year)',
    citation:
      'Tuttle RM, Haugen B, Perrier ND. Updated American Joint Committee on Cancer/TNM Staging System for Differentiated and Anaplastic Thyroid Cancer (Eighth Edition). Thyroid. 2017;27(6):751-756.',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5467103/',
    figure: 'Disease-specific survival by 8th edition stage',
    // Expected 10-year DSS ranges, as printed on slide 9 of the source deck
    // and in Tuttle 2017. Differentiated thyroid cancer only.
    stages: {
      I: '98–100% 10-year DSS',
      II: '85–95% 10-year DSS',
      III: '60–70% 10-year DSS',
      IVA: '<50% 10-year DSS',
      IVB: '<50% 10-year DSS'
    },
    stagesNote:
      'These expected 10-year disease-specific survival figures apply to DIFFERENTIATED thyroid carcinoma. Medullary and anaplastic carcinoma have different outcomes at the same stage label.'
  }
};

/** Look up the survival entry for a site + basis, falling back to site-only. */
export function survivalFor(siteId, basis) {
  return SURVIVAL[`${siteId}:${basis}`] || SURVIVAL[siteId] || null;
}
