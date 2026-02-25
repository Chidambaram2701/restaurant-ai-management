
import React, { useState, useMemo, useEffect } from 'react';
import { getWastePrediction } from '../services/geminiService';
import { useAppContext } from '../contexts/AppContext';
import { MENU_ITEMS } from '../constants';
import { AIPredictionResult, PortionFeedback } from '../types';
import WasteLogForm from '../components/WasteLogForm';
import BarChartComponent from '../components/BarChartComponent';
import PieChartComponent from '../components/PieChartComponent';
import CameraAnalysisModal from '../components/CameraAnalysisModal';
import { CameraIcon } from '../components/icons/CameraIcon';

const DashboardView: React.FC = () => {
    const { wasteLogs, feedback, visualWasteLogs } = useAppContext();
    const [isLoadingPrediction, setIsLoadingPrediction] = useState(true);
    const [aiResult, setAiResult] = useState<AIPredictionResult | null>(null);
    const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);

    useEffect(() => {
        const runPrediction = async () => {
            setIsLoadingPrediction(true);
            try {
                const result = await getWastePrediction(wasteLogs, feedback, visualWasteLogs, MENU_ITEMS);
                setAiResult(result);
            } catch (error) {
                console.error("Failed to get prediction:", error);
            } finally {
                setIsLoadingPrediction(false);
            }
        };

        runPrediction();
    }, [wasteLogs, feedback, visualWasteLogs]);
    
    const latestVisualLog = visualWasteLogs.length > 0 ? visualWasteLogs[visualWasteLogs.length - 1] : null;

    const barChartData = useMemo(() => {
        const dataMap = new Map<string, number>();
        const sortedLogs = [...wasteLogs].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        sortedLogs.forEach(log => {
            const item = MENU_ITEMS.find(mi => mi.id === log.menuItemId);
            if (item) {
                const key = item.name;
                dataMap.set(key, (dataMap.get(key) || 0) + log.wastedAmountKg);
            }
        });
        return Array.from(dataMap, ([name, waste]) => ({ name, waste }));
    }, [wasteLogs]);

    const pieChartData = useMemo(() => {
        const wasteByStage: { [key: string]: number } = {
            'Kitchen': 0,
            'Plate': 0,
            'Buffet': 0,
        };

        wasteLogs.forEach(log => {
            const amount = log.wastedAmountKg;
            if (log.reason === 'Plate waste') {
                wasteByStage['Plate'] += amount;
            } else if (log.reason === 'Buffet') {
                wasteByStage['Buffet'] += amount;
            } else { 
                wasteByStage['Kitchen'] += amount;
            }
        });
        
        return Object.entries(wasteByStage)
            .map(([name, value]) => ({ name, value }))
            .filter(item => item.value > 0);
    }, [wasteLogs]);
    
    const getMenuItemName = (id: number) => MENU_ITEMS.find(item => item.id === id)?.name || 'Unknown Item';
    
    const getPortionFeedbackColor = (portion: PortionFeedback) => {
        switch(portion) {
            case PortionFeedback.TooLarge: return 'text-red-400';
            case PortionFeedback.TooSmall: return 'text-yellow-400';
            case PortionFeedback.OK: return 'text-green-400';
            default: return 'text-gray-400';
        }
    };

    return (
        <>
            <div className="container mx-auto space-y-6">
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* 1. AI Visual Waste Analyzer */}
                    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                         <h2 className="text-xl font-bold mb-4">AI Visual Waste Analyzer</h2>
                         <p className="mb-4 text-gray-400">Scan or upload plate waste for instant AI analysis.</p>
                         <button
                             onClick={() => setIsCameraModalOpen(true)}
                             className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors duration-300 flex items-center justify-center"
                         >
                             <CameraIcon className="h-5 w-5 mr-2" />
                             Analyze Waste
                         </button>
                         {latestVisualLog && (
                            <div className="mt-6 space-y-3 p-4 bg-gray-700/50 rounded-lg animate-fade-in">
                                <h3 className="font-semibold text-lg">Last Visual Analysis:</h3>
                                <div className="flex items-start space-x-4">
                                    <img src={`data:image/jpeg;base64,${latestVisualLog.imageBase64}`} alt="Last waste analysis" className="w-24 h-24 rounded-md object-cover" />
                                    <div className="text-sm">
                                        <p><span className="font-semibold">Items:</span> {latestVisualLog.analysis.identifiedItems.join(', ')}</p>
                                        <p><span className="font-semibold">Est. Waste:</span> {latestVisualLog.analysis.wasteEstimateKg} kg</p>
                                        <p className="mt-2 italic text-teal-300">"{latestVisualLog.analysis.suggestion}"</p>
                                    </div>
                                </div>
                            </div>
                         )}
                    </div>
                    
                    {/* 2. Log Food Waste */}
                    <WasteLogForm />

                    {/* 3. Live AI Prediction */}
                    <div className="lg:col-span-2 bg-gray-800 rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-4">Live AI Prediction & Insights</h2>
                        {isLoadingPrediction ? (
                            <div className="flex justify-center items-center h-full min-h-[20rem]">
                                <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span className="ml-3 text-gray-400">Generating latest prediction...</span>
                            </div>
                        ) : aiResult ? (
                            <div className="space-y-4 animate-fade-in">
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Customer Feedback Insights:</h3>
                                    <p className="p-3 bg-blue-900/50 text-blue-200 rounded-md text-sm italic">"{aiResult.customerFeedbackInsights}"</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Predictions for Tomorrow:</h3>
                                    <ul className="space-y-3">
                                        {aiResult.predictions.map(p => (
                                            <li key={p.itemName} className="p-3 bg-gray-700 rounded-md">
                                                <p className="font-bold">{p.itemName}: <span className="text-indigo-400">Prepare {p.suggestedQtyKg}kg</span></p>
                                                <p className="text-sm text-gray-400">{p.reasoning}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Suggestion:</h3>
                                    <p className="p-3 bg-green-900/50 text-green-200 rounded-md">{aiResult.menuSuggestion}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-gray-400 py-8">
                                Could not retrieve AI prediction.
                            </div>
                        )}
                    </div>

                    {/* 4. Waste Distribution */}
                    <div className="bg-gray-800 rounded-lg shadow-lg p-6 h-96">
                        <h2 className="text-xl font-bold mb-4 text-white">Waste Distribution</h2>
                        {pieChartData.length > 0 ? (
                            <PieChartComponent data={pieChartData} />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                No waste data to display.
                            </div>
                        )}
                    </div>

                    {/* 5. Waste Trend */}
                    <div className="bg-gray-800 rounded-lg shadow-lg p-6 h-96">
                        <h2 className="text-xl font-bold mb-4 text-white">Waste Trend</h2>
                        {barChartData.length > 0 ? (
                            <BarChartComponent data={barChartData} />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                No waste data to display.
                            </div>
                        )}
                    </div>
                    
                    {/* 6. Customer Feedback */}
                    <div className="lg:col-span-2 bg-gray-800 rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-4 text-white">Customer Feedback</h2>
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                            {feedback.length > 0 ? [...feedback].reverse().map(fb => (
                                <div key={fb.id} className="p-4 bg-gray-700/50 rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-gray-200">{getMenuItemName(fb.menuItemId)}</p>
                                            <p className="text-sm text-gray-400">from Table {fb.tableId}</p>
                                        </div>
                                        <div className="flex items-center" aria-label={`Taste rating: ${fb.tasteRating} out of 5 stars`}>
                                            {[...Array(5)].map((_, i) => (
                                                <svg key={i} className={`w-5 h-5 ${i < fb.tasteRating ? 'text-yellow-400' : 'text-gray-500'}`} fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <p className="text-gray-300">Portion size: <span className={`font-semibold ${getPortionFeedbackColor(fb.portionFeedback)}`}>{fb.portionFeedback}</span></p>
                                    </div>
                                    {fb.comment && (
                                        <div className="mt-3 pt-3 border-t border-gray-600">
                                            <blockquote className="text-gray-300 italic border-l-4 border-gray-500 pl-4">
                                                {fb.comment}
                                            </blockquote>
                                        </div>
                                    )}
                                </div>
                            )) : (
                                 <div className="flex items-center justify-center h-40 text-gray-400">
                                    No customer feedback has been submitted yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <CameraAnalysisModal 
                isOpen={isCameraModalOpen}
                onClose={() => setIsCameraModalOpen(false)}
            />
        </>
    );
};

export default DashboardView;