
import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Table } from '../types';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  table: Table | null;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, table }) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && table) {
      const feedbackUrl = `${window.location.origin}${window.location.pathname}#/feedback/${table.id}`;
      QRCode.toDataURL(feedbackUrl, {
        errorCorrectionLevel: 'H',
        margin: 2,
        width: 256,
      })
      .then(url => {
        setQrCodeDataUrl(url);
      })
      .catch(err => {
        console.error('Failed to generate QR code', err);
        setQrCodeDataUrl(null);
      });
    } else {
      // Reset QR code when modal is closed or table is null
      setQrCodeDataUrl(null);
    }
  }, [isOpen, table]);

  if (!isOpen || !table) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm text-center p-8 transform transition-all duration-300 scale-95 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Feedback for Table {table.id}</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Scan this code to share your experience.</p>
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg inline-block h-[288px] w-[288px] flex items-center justify-center">
            {qrCodeDataUrl ? (
                <img src={qrCodeDataUrl} alt={`QR Code for Table ${table.id} feedback`} width="256" height="256" />
            ) : (
                <div className="text-gray-500 dark:text-gray-400">Generating QR code...</div>
            )}
        </div>
        <button 
          onClick={onClose} 
          className="mt-8 w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
          aria-label="Close modal"
        >
          Close
        </button>
      </div>
      <style>{`
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default QRCodeModal;