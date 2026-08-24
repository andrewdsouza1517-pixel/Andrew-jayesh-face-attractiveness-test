export interface VisualFeatures {
  lightingQuality: number; // 0 - 100
  compositionAndFraming: number; // 0 - 100
  expressionWarmth: number; // 0 - 100
  symmetryAndHarmony: number; // 0 - 100
  photoSharpness: number; // 0 - 100
  presentationContext: string;
}

export interface SubjectAnalysis {
  latentScore: number; // Calibrated latent perception score (0-100)
  visualFeatures: VisualFeatures;
  keyObservation: string;
}

export interface ContributingFactor {
  factor: string;
  favored: 'A' | 'B' | 'Neutral';
  impactDescription: string;
}

export interface ComparisonAttribute {
  name: string;
  A: number; // 0 - 100 scale
  B: number; // 0 - 100 scale
  winner: 'A' | 'B' | 'TIE';
  explanation: string;
}

export interface ComparisonResult {
  id: string;
  timestamp: number;
  status: 'success' | 'rejected' | 'inconclusive';
  adultVerificationPassed: boolean;
  rejectionReason?: string;

  // Strongly structured top-level evaluation
  winner: 'A' | 'B' | 'TIE';
  preference: {
    A: number; // 0.0 - 1.0 (e.g. 0.68)
    B: number; // 0.0 - 1.0 (e.g. 0.32)
  };
  confidence: number; // 0.0 - 1.0 (e.g. 0.85)
  attributes: ComparisonAttribute[];
  summary: string;
  playfulCommentary: string;
  roastCommentary: string;
  roastData?: RoastBreakdown;

  // Decoupled perception & Bradley–Terry metrics
  imageA: SubjectAnalysis;
  imageB: SubjectAnalysis;
  pairwiseProbabilities: {
    preferenceA: number; // 0.0 to 1.0
    preferenceB: number; // 0.0 to 1.0
    oddsRatio: number;
  };
  bradleyTerryMetrics: {
    scoreDelta: number;
    logisticCurveValue: number;
    uncertaintyInterval: [number, number];
    confidenceLevel: 'High' | 'Moderate' | 'Low' | 'High Uncertainty';
    uncertaintyFactors: string[];
  };
  scientificAnalysis: {
    summary: string;
    contributingFactors: ContributingFactor[];
    methodologicalDisclaimer: string;
    populationContext: string;
  };
}

export interface ImageInputItem {
  id: string;
  name: string; // Internal file name
  personName: string; // User-provided name of the person
  dataUrl: string;
  mimeType: string;
  previewUrl?: string;
  isSample?: boolean;
}

export interface SamplePairPreset {
  id: string;
  title: string;
  description: string;
  category: string;
  imageA: {
    name: string;
    url: string;
    caption: string;
  };
  imageB: {
    name: string;
    url: string;
    caption: string;
  };
}

export interface ExperimentSession {
  consentAccepted: boolean;
  ageConfirmed: boolean;
  termsAcceptedAt?: number;
  comparisons: ComparisonResult[];
}

export type AnalysisStage =
  | 'IDLE'
  | 'VALIDATING'
  | 'UPLOADING'
  | 'ANALYZING'
  | 'PROCESSING_RESULT'
  | 'SUCCESS'
  | 'ERROR';

export type RoastStyle = 'SAVAGE' | 'DEADPAN' | 'SPORTS' | 'DRAMATIC' | 'CORPORATE' | 'CHAOTIC';
export type RoastIntensity = 'PLAYFUL' | 'SAVAGE' | 'NUCLEAR';

export interface RoastBreakdown {
  style: RoastStyle;
  intensity?: RoastIntensity;
  verdict: string;
  loserRoast: string;
  competitionRoast?: string;
  winnerEnergy: string;
  spokenVersion: string;
}
