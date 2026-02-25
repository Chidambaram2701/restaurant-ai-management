import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Table } from '../types';
import TableCard from '../components/TableCard';
import OrderModal from '../components/OrderModal';
import QRCodeModal from '../components/QRCodeModal';

const TableMapView: React.FC = () => {
  const { tables } = useAppContext();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedTableForOrder, setSelectedTableForOrder] = useState<Table | null>(null);

  const [isQRCodeModalOpen, setIsQRCodeModalOpen] = useState(false);
  const [selectedTableForQRCode, setSelectedTableForQRCode] = useState<Table | null>(null);

  const handlePlaceOrder = (table: Table) => {
    setSelectedTableForOrder(table);
    setIsOrderModalOpen(true);
  };
  
  const handleCloseOrderModal = () => {
    setIsOrderModalOpen(false);
    setSelectedTableForOrder(null);
  }

  const handleShowQRCode = (table: Table) => {
    setSelectedTableForQRCode(table);
    setIsQRCodeModalOpen(true);
  };

  const handleCloseQRCodeModal = () => {
    setIsQRCodeModalOpen(false);
    setSelectedTableForQRCode(null);
  }

  return (
    <>
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Table Map</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {tables.map(table => (
            <TableCard 
                key={table.id} 
                table={table} 
                onPlaceOrder={handlePlaceOrder}
                onShowQRCode={handleShowQRCode}
            />
          ))}
        </div>
      </div>
      {selectedTableForOrder && (
        <OrderModal 
          isOpen={isOrderModalOpen} 
          onClose={handleCloseOrderModal} 
          table={selectedTableForOrder} 
        />
      )}
      <QRCodeModal 
        isOpen={isQRCodeModalOpen}
        onClose={handleCloseQRCodeModal}
        table={selectedTableForQRCode}
      />
    </>
  );
};

export default TableMapView;
