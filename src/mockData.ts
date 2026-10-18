import { ScanResult, OperativeProfile, SystemConfig } from './types';

export const INITIAL_OPERATIVE: OperativeProfile = {
  name: 'Agent 01',
  operativeId: 'VXP-8492',
  clearance: 'OMEGA',
  division: 'Cyber Threat Intelligence Division',
  bio: 'Senior Analyst, Cyber Threat Intelligence Division. Responsible for continuous monitoring and verification protocols.',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABGmq0NY7s2u7ZcuaMEWJ6zev-I0y8HzeRYtP_3pGP4QrA2HgXP2zoNnrByOCI068YrWgWdFq-ktmZb1-uV5-dvD_6KDrpNAFtfmUf1ZVI4ATMV9I0TCAUal1F98jqlvnZZN0XtHmVig0-e-3h8UUUjZcxqNiZGcJb_1o-mo_3xrwbhNPTg60yUzPnH4noerNFB-Y81hEJFKDf951HfmZ9AUzEYvNEwTr4LqchRSfrhO6mDpU0MzNdAQ',
  twoFactorActive: true,
  telemetrySharing: true,
  locationTracking: false,
};

export const INITIAL_CONFIG: SystemConfig = {
  darkMode: true,
  realTimeAlerts: false,
  biometricAuth: true,
  aiSensitivity: 80,
  soundEffects: true,
  theme: 'midnight',
};

export const INITIAL_SCAN_LOGS: ScanResult[] = [
  {
    id: 'scan-001',
    target: 'politicstoday.news/election-fraud-claims',
    targetType: 'url',
    timestamp: '10 mins ago',
    truthProbability: 12,
    confidence: 98,
    verdict: 'FABRICATED',
    headline: 'High Probability of Fabrication',
    summary: 'Analysis complete. The scanned content exhibits critical discrepancies and lacks corroboration from verified primary sources.',
    crossReferenceSummary: 'Extensive deep search algorithms found a critical lack of similar news items across our trusted network. Only 2 tangential mentions were discovered, indicating this narrative is highly isolated and likely manufactured.',
    sourcesChecked: [
      { name: 'Global News Network (GNN)', verified: false, notes: 'Zero matching archives' },
      { name: 'Reuters International', verified: false, notes: 'No published correspondent dispatches' },
      { name: 'Associated Press Archive', verified: false, notes: 'Direct contradiction in election records' },
    ],
    discrepancies: [
      {
        id: 'd-1',
        category: 'image_manipulation',
        title: 'Image Manipulation',
        description: 'Metadata analysis indicates AI generation signatures and GAN upscaling artifacts.',
        severity: 'critical',
      },
      {
        id: 'd-2',
        category: 'timeline_inconsistency',
        title: 'Timeline Inconsistency',
        description: 'Stated events contradict established chronological records and official voting tallies.',
        severity: 'critical',
      },
    ],
    forensics: {
      aiArtifactProbability: 94,
      metadataAnomaly: true,
      citationCoverage: 4,
      claimEntropy: '0.89 High Anomaly',
    },
  },
  {
    id: 'scan-002',
    target: 'q3_financial_report_leaked.pdf',
    targetType: 'file',
    timestamp: '42 mins ago',
    truthProbability: 92,
    confidence: 92,
    verdict: 'VERIFIED',
    headline: 'Verified Authenticity & Authenticated Audit',
    summary: 'Cryptographic signature, SEC EDGAR cross-check, and quarterly ledger records verified consistent with certified filings.',
    crossReferenceSummary: 'Document matches registered institutional disclosure records and official auditor cryptographic hash chains with 99.4% vector parity.',
    sourcesChecked: [
      { name: 'SEC EDGAR Filings Repository', verified: true, notes: 'Cryptographic checksum verified' },
      { name: 'Bloomberg Terminal Feeds', verified: true, notes: 'Numbers align with published earnings release' },
      { name: 'Deloitte Independent Auditor Stamp', verified: true, notes: 'Digital certificate intact' },
    ],
    discrepancies: [],
    forensics: {
      aiArtifactProbability: 3,
      metadataAnomaly: false,
      citationCoverage: 98,
      claimEntropy: '0.12 Nominal',
    },
  },
  {
    id: 'scan-003',
    target: 'protest_crowd_size_manipulated.jpg',
    targetType: 'file',
    timestamp: '2 hours ago',
    truthProbability: 48,
    confidence: 64,
    verdict: 'INCONCLUSIVE',
    headline: 'Inconclusive Vector Analysis',
    summary: 'Partial perspective warp detected; satellite imagery baseline shows conflicting density data pending manual satellite corroboration.',
    crossReferenceSummary: 'Secondary source feeds confirm peaceful demonstration took place, but aerial crowd density estimates deviate by 35% between municipal cameras and broadcast media.',
    sourcesChecked: [
      { name: 'Sentinel-2 Geospatial Imagery', verified: false, notes: 'Cloud cover obscured high-res ground sampling' },
      { name: 'City Municipal Transit Sensors', verified: true, notes: 'Subway ridership showed 1.4x surge' },
      { name: 'AFP FactCheck Bureau', verified: false, notes: 'Pending local desk review' },
    ],
    discrepancies: [
      {
        id: 'd-3',
        category: 'image_manipulation',
        title: 'Cloning & Focal Blur Anomalies',
        description: 'Error level analysis reveals repeating crowd clusters along the southern boulevard quadrant.',
        severity: 'warning',
      },
    ],
    forensics: {
      aiArtifactProbability: 61,
      metadataAnomaly: true,
      citationCoverage: 52,
      claimEntropy: '0.54 Moderate Ambiguity',
    },
  },
];

export const PRESET_VECTORS = [
  {
    label: 'Deepfake Video / Fabricated Policy Announcement',
    url: 'https://statepolicy-leaks.org/emergency-rationing-order-2026',
    type: 'url' as const,
  },
  {
    label: 'AI Cloned Executive Voice Memo (.wav)',
    url: 'internal_corp_memo_ceo_resignation.mp3',
    type: 'file' as const,
  },
  {
    label: 'Viral Geo-Engineering / Weather Weapon Claim',
    url: 'https://global-anomalies.net/synthetic-cyclone-manifesto',
    type: 'url' as const,
  },
  {
    label: 'NASA Artemis Lunar Base Water Discovery',
    url: 'https://nasa.gov/press-release/artemis-spectrometry-findings-crater-shackleton',
    type: 'url' as const,
  },
];
