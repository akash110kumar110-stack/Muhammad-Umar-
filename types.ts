// FIX: Removed self-import of ThreatType.
export enum ThreatType {
    Phishing = 'AI Phishing',
    Deepfake = 'Deepfake Attack',
    ZeroDay = 'Zero-Day Exploit',
    CredentialTheft = 'Credential Theft',
    Ransomware = 'Ransomware',
    DDoS = 'DDoS',
}

export interface Threat {
    id: string;
    type: ThreatType;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    source: string;
    target: string;
    timestamp: Date;
}

export interface Metric {
    title: string;
    value: string;
    change: string;
    changeType: 'increase' | 'decrease';
    anomaly?: boolean;
    explanation?: string;
}

export interface City {
    name: string;
    lat: number;
    lon: number;
}

export interface Attack {
    id: number;
    source: City;
    target: City;
}

// --- Deepfake Scanner Advanced Types ---

export type AnalysisStatus = 'idle' | 'analyzing' | 'real' | 'deepfake' | 'error';
export type AlertLevel = 'Safe' | 'Suspicious' | 'Likely Fake' | 'N/A';
export type VerificationStatus = 'Passed' | 'Failed' | 'N/A';

export interface ModelResult {
    model: string;
    result: 'Authentic' | 'Manipulated';
    confidence: number;
}

export interface CrossVerificationResult {
    sourceAuthenticity: {
        status: VerificationStatus;
        details: string;
    };
    voiceSync: {
        status: VerificationStatus;
        details: string;
    };
}

export interface ReliabilityScore {
    finalScore: number;
    alertLevel: AlertLevel;
}

export interface AnalysisResult {
    status: AnalysisStatus;
    fileName?: string;
    fileSize?: string;
    errorDetails?: string;
    
    // New detailed results
    multiModelResults?: ModelResult[];
    crossVerification?: CrossVerificationResult;
    reliabilityScore?: ReliabilityScore;
}