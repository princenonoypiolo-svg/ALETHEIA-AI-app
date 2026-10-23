export type ScreenView = 'login' | 'dashboard' | 'result' | 'profile' | 'settings' | 'history' | 'forensic_inspector';


export type ScanVerdict = 'FABRICATED' | 'VERIFIED' | 'INCONCLUSIVE';

export type AppTheme = 'midnight' | 'emerald' | 'amber';

export interface SourceCheck {
  name: string;
  verified: boolean;
  notes?: string;
}

export interface Discrepancy {
  id: string;
  category: 'image_manipulation' | 'timeline_inconsistency' | 'source_fabrication' | 'synthetic_text' | 'factual_distortion' | 'audio_synthesis';
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
}

export interface ExifData {
  cameraModel?: string;
  software?: string;
  dateTimeOriginal?: string;
  compression?: string;
  colorSpace?: string;
  gpsCoordinates?: string;
  anomaliesDetected: string[];
}

export interface AiDetectionDetails {
  isAiGenerated: boolean;
  aiProbability: number; // 0-100
  generatorModel?: string; // e.g. "Midjourney v6.1", "Sora Video Diffusion", "Runway Gen-3", "Flux.1", "DeepFaceLab"
  mediaType: 'image' | 'video' | 'audio' | 'document';
  temporalFlickerScore?: number; // for video frames (0-100)
  spatialAnomalies: string[];
  lightingInconsistencyScore?: number; // 0-100
}

export interface ForensicMetrics {
  aiArtifactProbability: number;
  metadataAnomaly: boolean;
  citationCoverage: number;
  claimEntropy: string;
  elaScore?: number; // Error Level Analysis score (0-100)
  exif?: ExifData;
  aiDetection?: AiDetectionDetails;
}

export interface SteganographyDetails {
  entropy: number;
  trailingPayloadBytes: number;
  lsbStatus: string;
  details: string;
  magicHeadersFound?: string[];
}

export interface SecurityAudit {
  securityStatus: 'CLEARED' | 'SUSPICIOUS' | 'CRITICAL_THREAT';
  tamperProofHash: string;
  steganographyDetected: boolean;
  steganographyDetails?: SteganographyDetails;
  adversarialPerturbation: boolean;
  adversarialPerturbationPercent?: number;
  quarantineRecommended: boolean;
  securityRecommendation: string;
}

export interface ScanResult {
  id: string;
  target: string;
  targetType: 'url' | 'file' | 'text' | 'audio';
  timestamp: string;
  truthProbability: number; // 0 to 100
  confidence: number; // 0 to 100
  verdict: ScanVerdict;
  headline: string;
  summary: string;
  shortExplanation?: string;
  securityAudit?: SecurityAudit;
  crossReferenceSummary: string;
  sourcesChecked: SourceCheck[];
  discrepancies: Discrepancy[];
  forensics?: ForensicMetrics;
  mediaUrl?: string;
  mediaFrames?: string[];
  isVideo?: boolean;
  rawAnalysis?: string;
  sha256Hash?: string;
  isHeuristicFallback?: boolean;
}

export interface UrlVerificationReport {
  url: string;
  domain: string;
  domainAgeYears: number;
  reputationScore: number; // 0-100
  httpsSecured: boolean;
  editorialTransparency: 'HIGH' | 'MODERATE' | 'LOW' | 'SUSPICIOUS';
  retractionHistory: string;
  extractedHeadline: string;
  claims: {
    statement: string;
    verdict: 'VERIFIED' | 'FALSE' | 'UNPROVEN';
    corroboration: string;
  }[];
}

export interface UrlPreviewData {
  url: string;
  domain: string;
  title: string;
  description: string;
  ogImage?: string;
  author?: string;
  publishDate?: string;
  domainTrustScore: number; // 0-100
  editorialTransparency: 'HIGH' | 'MODERATE' | 'LOW' | 'SUSPICIOUS';
  httpsSecured: boolean;
  credibilityTier: 'Accredited Wire' | 'Mainstream Media' | 'Independent Press' | 'Unverified / Disinformation Risk';
}

export interface AudioAnalysisResult {
  fileName: string;
  durationSeconds: number;
  voiceCloningProbability: number; // 0-100
  vocoderHarmonicJitter: number; // 0-100
  formantContinuity: number; // 0-100
  acousticNaturalness: number; // 0-100
  verdict: 'SYNTHETIC_CLONE' | 'AUTHENTIC_VOICE' | 'SUSPICIOUS_EDIT';
  detectedSynthesisModel?: string;
  anomalies: string[];
}

export interface BatchScanItem {
  id: string;
  target: string;
  status: 'pending' | 'scanning' | 'completed' | 'failed';
  result?: ScanResult;
}

export interface OperativeProfile {
  name: string;
  operativeId: string;
  clearance: string;
  division: string;
  bio: string;
  avatarUrl: string;
  twoFactorActive: boolean;
  telemetrySharing: boolean;
  locationTracking: boolean;
}

export interface SystemConfig {
  darkMode: boolean;
  realTimeAlerts: boolean;
  biometricAuth: boolean;
  aiSensitivity: number; // percentage, e.g., 80
  soundEffects: boolean;
  theme: AppTheme;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  evidenceLinks?: string[];
}

export interface TelemetryStats {
  threatCount: number;
  deepfakeCount: number;
  newsCount: number;
  syntheticMediaCount: number;
  nodeCount: number;
  latencyVal: number;
  inferenceVal?: number;
  latticeVal?: number;
  packetLoss?: number;
}

