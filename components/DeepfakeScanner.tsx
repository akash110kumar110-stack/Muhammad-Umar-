import React, { useState, useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadIcon, CheckCircleIcon, XCircleIcon, ClockIcon, MultiModelIcon, CrossVerificationIcon, ReliabilityScoreIcon } from './icons/AnalysisIcons';
import type { AnalysisResult, AnalysisStatus, ModelResult, CrossVerificationResult, ReliabilityScore, AlertLevel, VerificationStatus } from '../types';

const generateMockAnalysis = (isDeepfake: boolean): Omit<AnalysisResult, 'status' | 'fileName' | 'fileSize'> => {
    const models = ["ViT-B/16", "ForensicFormer", "ConvNext-Large"];
    const multiModelResults: ModelResult[] = models.map(model => {
        const isModelFooled = Math.random() < 0.15; // 15% chance a model gets it wrong
        const result = (isDeepfake && !isModelFooled) || (!isDeepfake && isModelFooled) ? 'Manipulated' : 'Authentic';
        const confidence = result === 'Manipulated'
            ? 75 + Math.random() * 24
            : 85 + Math.random() * 14;
        return { model, result, confidence };
    });

    const crossVerification: CrossVerificationResult = {
        sourceAuthenticity: {
            status: isDeepfake && Math.random() > 0.3 ? 'Failed' : 'Passed',
            details: isDeepfake && Math.random() > 0.3 ? 'EXIF data mismatch and no reverse image search matches found.' : 'EXIF data consistent with source device. Image found on trusted sources.'
        },
        voiceSync: {
            status: isDeepfake && Math.random() > 0.6 ? 'Failed' : 'Passed',
            details: isDeepfake && Math.random() > 0.6 ? 'Lip movement and audio phase are desynchronized.' : 'Audio phase aligns with detected lip movement.'
        }
    };

    const avgModelConfidence = multiModelResults
        .filter(r => r.result === 'Manipulated')
        .reduce((acc, r) => acc + r.confidence, 0) / (multiModelResults.filter(r => r.result === 'Manipulated').length || 1) / 100;

    const metadataTrustIndex = crossVerification.sourceAuthenticity.status === 'Passed' ? 0.8 : 1.2;
    
    let finalScore = (0.6 * avgModelConfidence + 0.4 * (isDeepfake ? 1 : 0)) * metadataTrustIndex * 100;
    if (!isDeepfake) {
        finalScore = Math.min(finalScore, 40 + Math.random() * 20);
    } else {
        finalScore = Math.max(finalScore, 75 - Math.random() * 10);
    }
    finalScore = Math.min(Math.max(finalScore, 0), 100);

    let alertLevel: AlertLevel = 'Safe';
    if (finalScore > 90) alertLevel = 'Likely Fake';
    else if (finalScore > 70) alertLevel = 'Suspicious';

    const reliabilityScore: ReliabilityScore = { finalScore, alertLevel };

    return { multiModelResults, crossVerification, reliabilityScore };
};

const DeepfakeScanner: React.FC = () => {
    const [result, setResult] = useState<AnalysisResult>({ status: 'idle' });
    const [filePreview, setFilePreview] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) {
            setResult({ status: 'error', errorDetails: 'Invalid file type. Please upload an image or video.' });
            return;
        }
        const file = acceptedFiles[0];
        const fileUrl = URL.createObjectURL(file);
        setFilePreview(fileUrl);
        setResult({
            status: 'analyzing',
            fileName: file.name,
            fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        });

        setTimeout(() => {
            const isDeepfake = Math.random() > 0.4;
            const mockResults = generateMockAnalysis(isDeepfake);
            setResult(prev => ({
                ...prev,
                status: isDeepfake ? 'deepfake' : 'real',
                ...mockResults
            }));
        }, 3000 + Math.random() * 2000);

    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.png'], 'video/*': ['.mp4', '.mov'] },
        multiple: false,
    });
    
    const resetScanner = () => {
        setResult({ status: 'idle' });
        if (filePreview) {
            URL.revokeObjectURL(filePreview);
            setFilePreview(null);
        }
    };
    
    const isAnalyzing = result.status === 'analyzing';

    return (
        <div className="space-y-6">
            <div className="rounded-lg bg-gray-900/50 border border-gray-700/50 p-6 backdrop-blur-sm">
                <div {...getRootProps()}
                    className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300
                    ${isDragActive ? 'border-cyan-400 bg-cyan-900/30' : 'border-gray-600 hover:border-gray-500'}
                    ${result.status !== 'idle' ? 'cursor-not-allowed' : ''}`}>
                    <input {...getInputProps()} disabled={result.status !== 'idle'}/>

                    {result.status === 'idle' && (
                        <>
                             <div className={`w-16 h-16 mb-4 text-cyan-400`}> <UploadIcon /> </div>
                             <p className="text-lg font-semibold text-white">Upload Media for Forensic Analysis</p>
                             <p className="text-sm text-gray-400 text-center">Drag & drop an image or video, or click to select a file.</p>
                        </>
                    )}
                    
                    {result.status !== 'idle' && (
                        <div className="flex w-full items-center justify-center gap-4">
                            {filePreview && (
                                <div className="w-24 h-24 flex-shrink-0">
                                    <img src={filePreview} alt="Preview" className="w-full h-full object-cover rounded-md" />
                                </div>
                            )}
                            <div className="flex-1">
                                <p className="font-semibold text-white truncate">{result.fileName}</p>
                                <p className="text-sm text-gray-400">{result.fileSize}</p>
                                {isAnalyzing ? (
                                    <div className="flex items-center gap-2 mt-2 text-yellow-400">
                                        <div className="w-4 h-4 animate-spin"><ClockIcon /></div>
                                        <span>Analyzing...</span>
                                    </div>
                                ) : (
                                    <button onClick={resetScanner} className="mt-2 text-sm text-cyan-400 hover:underline">Scan another file</button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {result.status !== 'idle' && result.status !== 'analyzing' && (
                <AnalysisReport result={result} />
            )}
             {result.status === 'error' && (
                <div className="rounded-lg bg-red-900/50 border border-red-700/50 p-4 backdrop-blur-sm text-center">
                    <h3 className="text-lg font-semibold text-red-300">Analysis Error</h3>
                    <p className="text-red-400">{result.errorDetails}</p>
                    <button onClick={resetScanner} className="mt-4 px-4 py-2 bg-red-600 rounded-md hover:bg-red-500">Try Again</button>
                </div>
            )}
        </div>
    );
};

const AnalysisReport: React.FC<{ result: AnalysisResult }> = ({ result }) => {
    const { reliabilityScore, multiModelResults, crossVerification } = result;

    if (!reliabilityScore || !multiModelResults || !crossVerification) {
        return null;
    }
    
    const scoreColor = reliabilityScore.alertLevel === 'Safe' ? 'text-green-400' : reliabilityScore.alertLevel === 'Suspicious' ? 'text-yellow-400' : 'text-red-400';

    return (
        <div className="space-y-6">
            {/* Reliability Score */}
            <div className="rounded-lg bg-gray-900/50 border border-gray-700/50 p-6 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-8 h-8 text-cyan-400"><ReliabilityScoreIcon /></div>
                    <h3 className="text-xl font-orbitron text-cyan-400">Final Reliability Score</h3>
                </div>
                <div className="text-center bg-gray-900 p-6 rounded-lg">
                    <p className={`text-6xl font-orbitron font-bold ${scoreColor}`}>{reliabilityScore.finalScore.toFixed(1)}%</p>
                    <p className={`text-2xl font-semibold mt-2 ${scoreColor}`}>{reliabilityScore.alertLevel}</p>
                    <p className="text-gray-400 mt-2 max-w-md mx-auto">This score represents the AI's confidence that the media is authentic. Higher scores indicate a higher likelihood of manipulation.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* AI Model Ensemble */}
                <div className="rounded-lg bg-gray-900/50 border border-gray-700/50 p-6 backdrop-blur-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-8 h-8 text-cyan-400"><MultiModelIcon /></div>
                        <h3 className="text-xl font-orbitron text-cyan-400">AI Model Ensemble</h3>
                    </div>
                    <ul className="space-y-3">
                        {multiModelResults.map(modelRes => (
                             <li key={modelRes.model} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-md">
                                <div>
                                    <p className="font-semibold text-white">{modelRes.model}</p>
                                    <p className={`text-sm font-bold ${modelRes.result === 'Authentic' ? 'text-green-400' : 'text-red-400'}`}>{modelRes.result}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-400 text-xs">Confidence</p>
                                    <p className="font-mono text-lg text-white">{modelRes.confidence.toFixed(1)}%</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Cross-Verification */}
                <div className="rounded-lg bg-gray-900/50 border border-gray-700/50 p-6 backdrop-blur-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-8 h-8 text-cyan-400"><CrossVerificationIcon /></div>
                        <h3 className="text-xl font-orbitron text-cyan-400">Cross-Verification</h3>
                    </div>
                    <div className="space-y-4">
                         <VerificationItem title="Source Authenticity" status={crossVerification.sourceAuthenticity.status} details={crossVerification.sourceAuthenticity.details} />
                         <VerificationItem title="Voice & Lip Sync" status={crossVerification.voiceSync.status} details={crossVerification.voiceSync.details} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const VerificationItem: React.FC<{title: string, status: VerificationStatus, details: string}> = ({title, status, details}) => {
    const isPassed = status === 'Passed';
    const color = isPassed ? 'text-green-400' : status === 'Failed' ? 'text-red-400' : 'text-gray-500';
    const icon = isPassed ? <CheckCircleIcon /> : status === 'Failed' ? <XCircleIcon /> : <ClockIcon />;

    return (
        <div className="p-3 bg-gray-800/50 rounded-md">
            <div className="flex items-center justify-between">
                <p className="font-semibold text-white">{title}</p>
                <div className={`flex items-center gap-2 font-bold ${color}`}>
                    <div className="w-5 h-5">{icon}</div>
                    <span>{status}</span>
                </div>
            </div>
            <p className="text-sm text-gray-400 mt-1 pl-1">{details}</p>
        </div>
    )
}

export default DeepfakeScanner;