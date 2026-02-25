
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { MENU_ITEMS } from '../constants';
import { PortionFeedback } from '../types';

interface FeedbackFormProps {
    tableId: number;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ tableId }) => {
    const { addFeedback } = useAppContext();
    const [menuItemId, setMenuItemId] = useState<number>(MENU_ITEMS[0].id);
    const [tasteRating, setTasteRating] = useState(5);
    const [portion, setPortion] = useState<PortionFeedback>(PortionFeedback.OK);
    const [comment, setComment] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addFeedback({
            tableId,
            menuItemId,
            tasteRating,
            portionFeedback: portion,
            comment,
        });
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 text-center">
                <h2 className="text-2xl font-bold text-green-500">Thank you!</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Your feedback has been submitted successfully.</p>
            </div>
        );
    }
    
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="menuItem" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Which dish would you like to review?</label>
                    <select
                        id="menuItem"
                        value={menuItemId}
                        onChange={(e) => setMenuItemId(Number(e.target.value))}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600"
                    >
                        {MENU_ITEMS.map(item => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">How was the taste?</label>
                    <div className="mt-2 flex justify-center space-x-2">
                        {[1, 2, 3, 4, 5].map(rating => (
                            <button key={rating} type="button" onClick={() => setTasteRating(rating)} className={`w-12 h-12 rounded-full text-xl font-bold transition-transform transform hover:scale-110 ${tasteRating >= rating ? 'bg-yellow-400 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>
                                {rating}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">How was the portion size?</label>
                    <div className="mt-2 grid grid-cols-3 gap-3">
                        {(Object.values(PortionFeedback)).map(p => (
                            <button key={p} type="button" onClick={() => setPortion(p)} className={`p-3 rounded-md text-sm font-semibold transition-colors ${portion === p ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Any other comments?</label>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={3}
                        className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600"
                        placeholder="e.g., The music was great, service was excellent..."
                    ></textarea>
                </div>

                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
                >
                    Submit Feedback
                </button>
            </form>
        </div>
    );
};

export default FeedbackForm;