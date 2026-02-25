
import React, { useState } from 'react';
import { Table, OrderItem } from '../types';
import { useAppContext } from '../contexts/AppContext';
import { MENU_ITEMS } from '../constants';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  table: Table;
}

const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, table }) => {
  const { addOrder } = useAppContext();
  const [orderItems, setOrderItems] = useState<Map<number, number>>(new Map());

  const handleQuantityChange = (menuItemId: number, change: number) => {
    const newItems = new Map(orderItems);
    const currentQty = newItems.get(menuItemId) || 0;
    const newQty = Math.max(0, currentQty + change);
    if (newQty > 0) {
      newItems.set(menuItemId, newQty);
    } else {
      newItems.delete(menuItemId);
    }
    setOrderItems(newItems);
  };

  const handleSubmitOrder = () => {
    if (orderItems.size > 0) {
      const items: OrderItem[] = Array.from(orderItems.entries()).map(([menuItemId, quantity]) => ({
        menuItemId,
        quantity,
      }));
      addOrder(table.id, items);
      onClose();
      setOrderItems(new Map());
    }
  };
  
  const totalItems = Array.from(orderItems.values()).reduce((sum, qty) => sum + qty, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="p-4 border-b dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Place Order for Table {table.id}</h2>
        </div>
        <div className="p-6 overflow-y-auto">
          <ul className="space-y-4">
            {MENU_ITEMS.map(item => (
              <li key={item.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">₹{item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button onClick={() => handleQuantityChange(item.id, -1)} className="w-8 h-8 rounded-full bg-red-500 text-white font-bold text-lg flex items-center justify-center hover:bg-red-600">-</button>
                  <span className="text-xl font-bold w-10 text-center">{orderItems.get(item.id) || 0}</span>
                  <button onClick={() => handleQuantityChange(item.id, 1)} className="w-8 h-8 rounded-full bg-green-500 text-white font-bold text-lg flex items-center justify-center hover:bg-green-600">+</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-4 border-t dark:border-gray-700 mt-auto flex justify-between items-center">
            <button onClick={onClose} className="text-gray-600 dark:text-gray-300 font-semibold py-2 px-4 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">Cancel</button>
            <button 
              onClick={handleSubmitOrder} 
              disabled={totalItems === 0}
              className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              Confirm Order ({totalItems})
            </button>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
