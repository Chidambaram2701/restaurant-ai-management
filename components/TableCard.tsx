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
          bg: 'bg-green-100 dark:bg-green-900/50',
          text: 'text-green-800 dark:text-green-200',
          border: 'border-green-500',
          icon: 'text-green-500',
        };
      case TableStatus.Occupied:
        return {
          bg: 'bg-red-100 dark:bg-red-900/50',
          text: 'text-red-800 dark:text-red-200',
          border: 'border-red-500',
          icon: 'text-red-500',
        };
      case TableStatus.Reserved:
        return {
          bg: 'bg-blue-100 dark:bg-blue-900/50',
          text: 'text-blue-800 dark:text-blue-200',
          border: 'border-blue-500',
          icon: 'text-blue-500',
        };
      case TableStatus.NeedsCleaning:
        return {
          bg: 'bg-yellow-100 dark:bg-yellow-900/50',
          text: 'text-yellow-800 dark:text-yellow-200',
          border: 'border-yellow-500',
          icon: 'text-yellow-500',
        };
      default:
        return {
          bg: 'bg-gray-100 dark:bg-gray-700',
          text: 'text-gray-800 dark:text-gray-200',
          border: 'border-gray-500',
          icon: 'text-gray-500',
        };
    }
  };

  const { bg, text, border, icon } = getStatusClasses();
  const isActionable = table.status === TableStatus.Free || table.status === TableStatus.Reserved;

  return (
    <div className={`rounded-lg shadow-lg overflow-hidden border-t-4 ${border} ${bg} flex flex-col`}>
      <div className="p-4 flex-grow">
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
                    <button onClick={() => updateTableStatus(table.id, TableStatus.Reserved)} className="text-sm bg-blue-500 text-white font-semibold py-2 px-3 rounded-md hover:bg-blue-600 transition-colors">Reserve</button>
                )}
                {table.status === TableStatus.Reserved && (
                    <button onClick={() => updateTableStatus(table.id, TableStatus.Free)} className="text-sm bg-gray-500 text-white font-semibold py-2 px-3 rounded-md hover:bg-gray-600 transition-colors">Cancel</button>
                )}
            </>
            ) : (
                <>
                <button
                    onClick={() => updateTableStatus(table.id, TableStatus.NeedsCleaning)}
                    className="text-sm bg-yellow-500 text-white font-semibold py-2 px-3 rounded-md hover:bg-yellow-600 transition-colors"
                >
                    Clean
                </button>
                <button
                    onClick={() => updateTableStatus(table.id, TableStatus.Free)}
                    className="text-sm bg-green-500 text-white font-semibold py-2 px-3 rounded-md hover:bg-green-600 transition-colors"
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
