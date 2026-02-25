
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { MENU_ITEMS } from '../constants';

const WasteLogForm: React.FC = () => {
    const { addWasteLog } = useAppContext();
    const [menuItemId, setMenuItemId] = useState<number>(MENU_ITEMS[0].id);
    const [wastedAmount, setWastedAmount] = useState('');
    const [reason, setReason] = useState('Overproduction');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (menuItemId && wastedAmount) {
            addWasteLog({
                date: new Date().toISOString().split('T')[0],
                menuItemId: Number(menuItemId),
                wastedAmountKg: parseFloat(wastedAmount),
                reason,
            });
            setWastedAmount('');
            setIsSubmitted(true);
            setTimeout(() => setIsSubmitted(false), 2000);
        }
    };

    return (
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Log Food Waste</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="menuItem" className="block text-sm font-medium text-gray-300">Menu Item</label>
                    <select
                        id="menuItem"
                        value={menuItemId}
                        onChange={(e) => setMenuItemId(Number(e.target.value))}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-700"
                    >
                        {MENU_ITEMS.map(item => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="wastedAmount" className="block text-sm font-medium text-gray-300">Wasted Amount (kg)</label>
                    <input
                        type="number"
                        id="wastedAmount"
                        value={wastedAmount}
                        onChange={(e) => setWastedAmount(e.target.value)}
                        step="0.1"
                        min="0"
                        required
                        className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-700"
                        placeholder="e.g., 2.5"
                    />
                </div>
                <div>
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-300">Reason</label>
                     <select
                        id="reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-700"
                    >
                        <option>Overproduction</option>
                        <option>Spoilage</option>
                        <option>Plate waste</option>
                        <option>Buffet</option>
                        <option>Other</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className={`w-full text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 ${isSubmitted ? 'bg-green-500' : 'bg-red-500 hover:bg-red-600'}`}
                >
                    {isSubmitted ? 'Logged!' : 'Add Waste Log'}
                </button>
            </form>
        </div>
    );
};

export default WasteLogForm;
