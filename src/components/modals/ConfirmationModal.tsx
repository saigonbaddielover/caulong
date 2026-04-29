import React from 'react';

interface ConfirmationModalProps {
  config: {
    message: string;
    onConfirm: () => void;
  };
  onClose: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ config, onClose }) => (
  <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-[100] px-4 animate-in fade-in duration-200">
    <div className="bg-white p-6 rounded-2xl max-w-xs w-full shadow-2xl text-center">
      <h3 className="text-lg font-bold mb-2 text-gray-800">Xác nhận</h3>
      <p className="text-sm text-gray-500 mb-6">{config.message}</p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 transition"
        >
          Tao chưa
        </button>
        <button
          onClick={config.onConfirm}
          className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#04BADE] hover:bg-[#03a6c7] transition"
        >
          Tao chắc
        </button>
      </div>
    </div>
  </div>
);
