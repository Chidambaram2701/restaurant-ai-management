import React from 'react';
import { Table, TableStatus } from '../types';
import { useAppContext } from '../contexts/AppContext';
import { TableIcon } from './icons/TableIcon';
import { CleanIcon } from './icons/CleanIcon';
import { QRIcon } from './icons/QRIcon';

interface TableCardProps {
  table: Table;
  onPlaceOrder: (table: Table) => void;
  onShowQRCode: (table: Table) => void;
}

const TableCard: React.FC<TableCardProps> = ({ table, onPlaceOrder, onShowQRCode }) => {
  const { updateTableStatus } = useAppContext();

  const getStatusClasses = () => {
    switch (table.status) {
      case TableStatus.Free:
        return {
          bg: 'bg-gradient-to-br from-[#4CAF50]/10 to-[#4CAF50]/20 dark:from-[#4CAF50]/20 dark:to-[#4CAF50]/30',
          text: 'text-[#4CAF50]',
          border: 'border-[#4CAF50]',
          icon: 'text-[#4CAF50]',
        };
      case TableStatus.Occupied:
        return {
          bg: 'bg-gradient-to-br from-[#F44336]/10 to-[#F44336]/20 dark:from-[#F44336]/20 dark:to-[#F44336]/30',
          text: 'text-[#F44336]',
          border: 'border-[#F44336]',
          icon: 'text-[#F44336]',
        };
      case TableStatus.Reserved:
        return {
          bg: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-indigo-900/20',
          text: 'text-blue-800 dark:text-blue-300',
          border: 'border-blue-400 dark:border-blue-600',
          icon: 'text-blue-600 dark:text-blue-400',
        };
      case TableStatus.NeedsCleaning:
        return {
          bg: 'bg-gradient-to-br from-[#FFC107]/10 to-[#FFC107]/20 dark:from-[#FFC107]/20 dark:to-[#FFC107]/30',
          text: 'text-[#FFC107]',
          border: 'border-[#FFC107]',
          icon: 'text-[#FFC107]',
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900',
          text: 'text-gray-800 dark:text-gray-300',
          border: 'border-gray-400 dark:border-gray-600',
          icon: 'text-gray-600 dark:text-gray-400',
        };
    }
  };

  const { bg, text, border, icon } = getStatusClasses();
  const isActionable = table.status === TableStatus.Free || table.status === TableStatus.Reserved;

  return (
    <div className={`relative rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 overflow-hidden border border-white/20 dark:border-gray-700/50 backdrop-blur-sm ${bg} flex flex-col group`}>
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${border.replace('border-', 'from-').replace('dark:border-', 'dark:to-')} to-transparent opacity-70`}></div>
      <div className="p-5 flex-grow">
        <div className="flex items-center justify-between">
          <h3 className={`text-lg font-bold ${text}`}>Table {table.id}</h3>
          {table.status === TableStatus.NeedsCleaning && <CleanIcon className={`h-6 w-6 ${icon}`} />}
          {table.status !== TableStatus.NeedsCleaning && <TableIcon className={`h-6 w-6 ${icon}`} />}
        </div>
        <p className={`text-sm font-medium ${text} mt-1`}>{table.status}</p>
      </div>
      <div className="p-2 bg-white/50 dark:bg-black/20 flex items-stretch gap-2">
        <div className="flex-grow grid grid-cols-2 gap-2">
          {isActionable ? (
            <>
              <button
                onClick={() => onPlaceOrder(table)}
                className="col-span-2 w-full text-sm bg-indigo-600 text-white font-semibold py-2 px-3 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Place Order
              </button>
              {table.status === TableStatus.Free && (
                <button onClick={() => updateTableStatus(table.id, TableStatus.Reserved)} className="col-span-2 text-sm bg-blue-500 text-white font-semibold py-2 px-3 rounded-md hover:bg-blue-600 transition-colors">Reserve</button>
              )}
              {table.status === TableStatus.Reserved && (
                <button onClick={() => updateTableStatus(table.id, TableStatus.Free)} className="col-span-2 text-sm bg-gray-500 text-white font-semibold py-2 px-3 rounded-md hover:bg-gray-600 transition-colors">Cancel</button>
              )}
            </>
          ) : (
            <>
              <button
                onClick={() => updateTableStatus(table.id, TableStatus.NeedsCleaning)}
                className="text-sm bg-[#FFC107] text-white font-semibold py-2 px-3 rounded-md hover:bg-[#e0a800] transition-colors"
              >
                Clean
              </button>
              <button
                onClick={() => updateTableStatus(table.id, TableStatus.Free)}
                className="text-sm bg-[#4CAF50] text-white font-semibold py-2 px-3 rounded-md hover:bg-[#388E3C] transition-colors"
              >
                Free
              </button>
            </>
          )}
        </div>
        <button
          onClick={() => onShowQRCode(table)}
          title="Show Feedback QR Code"
          className="flex-shrink-0 w-12 flex items-center justify-center rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          aria-label="Show feedback QR code"
        >
          <QRIcon className="h-6 w-6 text-gray-700 dark:text-gray-200" />
          <span className="sr-only">Show QR Code</span>
        </button>
      </div>
    </div>
  );
};

export default TableCard;
