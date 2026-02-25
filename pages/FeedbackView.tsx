import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FeedbackForm from '../components/FeedbackForm';
import { useAppContext } from '../contexts/AppContext';
import { getPersonalizedFeedbackGreeting } from '../services/geminiService';
import { MENU_ITEMS } from '../constants';

const FeedbackView: React.FC = () => {
    const { tableId } = useParams<{ tableId: string }>();
    const { orders } = useAppContext();
    const [greeting, setGreeting] = useState<string>('Your opinion helps us improve.');
    const [isGreetingLoading, setIsGreetingLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchGreeting = async () => {
            if (!tableId || !orders) {
                setIsGreetingLoading(false);
                return;
            }

            const tableOrders = orders
                .filter(o => o.tableId === Number(tableId))
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

            if (tableOrders.length > 0) {
                const latestOrder = tableOrders[0];
                const itemNames = latestOrder.items
                    .map(item => MENU_ITEMS.find(mi => mi.id === item.menuItemId)?.name)
                    .filter((name): name is string => !!name);

                if (itemNames.length > 0) {
                    try {
                        const aiGreeting = await getPersonalizedFeedbackGreeting(itemNames);
                        setGreeting(aiGreeting);
                    } catch (err) {
                        // Fallback is handled in the service, but we can have another one here.
                        setGreeting(`We hope you enjoyed your meal! Your feedback is valuable to us.`);
                    }
                }
            }
            setIsGreetingLoading(false);
        };

        fetchGreeting();
    }, [tableId, orders]);

    return (
        <div className="max-w-md mx-auto mt-10">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Share Your Feedback</h1>
                <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">
                    Thank you for dining at Table {tableId}!
                </p>
                <div className="mt-4 min-h-[3rem] flex items-center justify-center px-4">
                     {isGreetingLoading ? (
                        <p className="text-indigo-400 italic">Personalizing your experience...</p>
                    ) : (
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            {greeting}
                        </p>
                    )}
                </div>
            </div>
            <FeedbackForm tableId={Number(tableId)} />
        </div>
    );
};

export default FeedbackView;
