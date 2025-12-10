import React, { useState, useRef, useEffect, useCallback } from 'react';
import { analyzeWasteImage } from '../services/geminiService';
import { useAppContext } from '../contexts/AppContext';
import { VisualWasteAnalysis } from '../types';
import { CameraIcon } from './icons/CameraIcon';
import { GalleryIcon } from './icons/GalleryIcon';

interface CameraAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CameraAnalysisModal: React.FC<CameraAnalysisModalProps> = ({ isOpen, onClose }) => {
    const { addVisualWasteLog } = useAppContext();
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [notes, setNotes] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<VisualWasteAnalysis | null>(null);
    const [error, setError] = useState<string | null>(null);

    const cleanup = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    }, [stream]);

    const setupCamera = useCallback(async () => {
        try {
            setError(null);
            const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } 
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Camera access denied:", err);
            setError("Camera access was denied. Please enable it in your browser settings.");
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            setupCamera();
        } else {
            cleanup();
            setCapturedImage(null);
            setAnalysisResult(null);
            setIsLoading(false);
            setNotes('');
        }
        return cleanup;
    }, [isOpen, setupCamera, cleanup]);

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
                setCapturedImage(dataUrl);
                cleanup();
            }
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const dataUrl = e.target?.result as string;
                if (dataUrl) {
                    setCapturedImage(dataUrl);
                    cleanup();
                }
            };
            reader.onerror = () => {
                setError('Failed to read the image file.');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRetake = () => {
        setCapturedImage(null);
        setAnalysisResult(null);
        setupCamera();
    };

    const handleAnalyze = async () => {
        if (!capturedImage) return;
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);
        try {
            const base64Image = capturedImage.split(',')[1];
            const result = await analyzeWasteImage(base64Image, notes);
            setAnalysisResult(result);
            addVisualWasteLog({
                imageBase64: base64Image,
                notes: notes,
                analysis: result
            });
        } catch (err) {
            console.error("Analysis failed:", err);
            setError("Failed to analyze the image. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Visual Waste Analyzer</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-3xl leading-none">&times;</button>
                </div>
                
                <div className="p-6 overflow-y-auto flex-grow">
                    {error && <div className="p-4 mb-4 text-center text-red-800 bg-red-100 rounded-md dark:bg-red-900/50 dark:text-red-300">{error}</div>}

                    {!capturedImage && !error && (
                        <div className="space-y-4">
                            <div className="bg-black rounded-md overflow-hidden aspect-video flex items-center justify-center">
                                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover"></video>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button onClick={handleCapture} className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-300 flex items-center justify-center">
                                    <CameraIcon className="h-6 w-6 mr-2"/>
                                    Capture Image
                                </button>
                                <button onClick={handleUploadClick} className="w-full bg-gray-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-300 flex items-center justify-center">
                                    <GalleryIcon className="h-6 w-6 mr-2"/>
                                    Upload from Gallery
                                </button>
                            </div>
                        </div>
                    )}

                    {capturedImage && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <img src={capturedImage} alt="Captured waste" className="rounded-md w-full" />
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Add notes (e.g., customer comments)..."
                                    rows={3}
                                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                                    disabled={isLoading || !!analysisResult}
                                />
                                <div className="flex gap-4">
                                    <button onClick={handleRetake} disabled={isLoading} className="w-full bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors disabled:bg-gray-400">Retake / Upload New</button>
                                    <button onClick={handleAnalyze} disabled={isLoading || !!analysisResult} className="w-full bg-teal-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors disabled:bg-teal-400 flex items-center justify-center">
                                        {isLoading ? (
                                             <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : 'Analyze Waste'}
                                    </button>
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                                <h3 className="text-xl font-bold mb-4">AI Analysis</h3>
                                {isLoading && <div className="text-center">Analyzing image...</div>}
                                {analysisResult && (
                                    <div className="space-y-3 text-sm animate-fade-in">
                                        <div>
                                            <p className="font-semibold text-gray-700 dark:text-gray-300">Identified Items:</p>
                                            <p>{analysisResult.identifiedItems.join(', ') || 'None'}</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-700 dark:text-gray-300">Estimated Waste:</p>
                                            <p>{analysisResult.wasteEstimateKg.toFixed(2)} kg</p>
                                        </div>
                                        <div className="pt-3 mt-3 border-t dark:border-gray-600">
                                            <p className="font-semibold text-gray-700 dark:text-gray-300">Suggestion:</p>
                                            <p className="italic text-teal-800 dark:text-teal-300">"{analysisResult.suggestion}"</p>
                                        </div>
                                    </div>
                                )}
                                {!isLoading && !analysisResult && <div className="text-gray-500">Analysis results will appear here.</div>}
                            </div>
                        </div>
                    )}
                </div>
                <canvas ref={canvasRef} className="hidden"></canvas>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>
        </div>
    );
};

export default CameraAnalysisModal;