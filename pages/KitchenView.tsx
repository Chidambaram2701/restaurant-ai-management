
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { MENU_ITEMS } from '../constants';
import { Order, OrderStatus } from '../types';
import { ClockIcon } from '../components/icons/ClockIcon';

const KitchenView: React.FC = () => {
  const { orders, updateOrderStatus } = useAppContext();

  const activeOrders = orders.filter(
    order => order.status === OrderStatus.Preparing || order.status === OrderStatus.Ready
  ).sort((a,b) => a.createdAt.getTime() - b.createdAt.getTime());

  const getMenuItemName = (id: number) => {
    return MENU_ITEMS.find(item => item.id === id)?.name || 'Unknown Item';
  };
  
  const getStatusColor = (status: OrderStatus) => {
    switch(status) {
        case OrderStatus.Preparing: return 'bg-yellow-500';
        case OrderStatus.Ready: return 'bg-green-500';
        default: return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Kitchen Order Tickets (KOT)</h1>
      {activeOrders.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <ChefHatIcon className="mx-auto h-12 w-12" />
            <h2 className="mt-2 text-xl font-medium">No active orders.</h2>
            <p>Waiting for new orders from the floor...</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {activeOrders.map((order: Order) => (
          <div key={order.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <div className={`p-4 ${getStatusColor(order.status)}`}>
              <div className="flex justify-between items-center text-white">
                <h2 className="text-2xl font-bold">Table {order.tableId}</h2>
                <span className="text-sm font-semibold px-2 py-1 bg-white/20 rounded-full">{order.status}</span>
              </div>
              <div className="flex items-center text-white text-xs mt-1">
                <ClockIcon className="h-4 w-4 mr-1" />
                <span>{order.createdAt.toLocaleTimeString()}</span>
              </div>
            </div>
            <ul className="p-4 divide-y divide-gray-200 dark:divide-gray-700">
              {order.items.map((item, index) => (
                <li key={index} className="py-2 flex justify-between items-center">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{getMenuItemName(item.menuItemId)}</span>
                  <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">x{item.quantity}</span>
                </li>
              ))}
            </ul>
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50">
              {order.status === OrderStatus.Preparing && (
                <button
                  onClick={() => updateOrderStatus(order.id, OrderStatus.Ready)}
                  className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors duration-300"
                >
                  Mark as Ready
                </button>
              )}
               {order.status === OrderStatus.Ready && (
                <button
                  onClick={() => updateOrderStatus(order.id, OrderStatus.Served)}
                  className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                >
                  Mark as Served
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};

// Placeholder icon, assuming it's in the icons folder
const ChefHatIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 14c-4.41 0-8-3.59-8-8 0-.05 0-.1.01-.15.48-2.28 2.5-4.05 4.99-4.05s4.51 1.77 4.99 4.05c.01.05.01.1.01.15 0 4.41-3.59 8-8 8z" />
    <path d="M12 12m-3 0a3 3 0 106 0 3 3 0 10-6 0" />
  </svg>
);


export default KitchenView;
