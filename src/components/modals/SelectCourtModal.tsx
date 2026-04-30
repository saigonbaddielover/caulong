import React, { useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { COURTS } from '../../constants/data';

interface SelectCourtModalProps {
  newCount: number;
  delCount: number;
  selectedCourt: string;
  setSelectedCourt: (court: string) => void;
  onBack: () => void;
  onSave: () => void;
}

export const SelectCourtModal: React.FC<SelectCourtModalProps> = ({
  newCount,
  delCount,
  selectedCourt,
  setSelectedCourt,
  onBack,
  onSave,
}) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onBack();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onBack]);

  return (
    <div 
      className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-[110] px-4 animate-in fade-in duration-200"
      onClick={onBack}
    >
      <div 
        className="bg-white p-6 rounded-3xl max-w-sm w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <MapPin className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Xác nhận thay đổi</h3>
        </div>
        <div className="space-y-3 mb-6">
          {newCount > 0 && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                Thêm mới/Cập nhật {newCount} ca:
              </p>
              <select
                value={selectedCourt}
                onChange={(e) => setSelectedCourt(e.target.value)}
                className="w-full mt-2 p-2 bg-white border border-amber-200 rounded-lg text-[16px] font-bold outline-none focus:border-amber-400 transition-all"
              >
                {COURTS.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          {delCount > 0 && (
            <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
              <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">
                Sẽ gỡ đặt sân cho {delCount} ca
              </p>
            </div>
          )}
        </div>
        <div className="flex gap-3 pt-2">
          <button
            onClick={onBack}
            className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 transition"
          >
            Quay lại
          </button>
          <button
            onClick={onSave}
            className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#04BADE] hover:bg-[#03a6c7] transition shadow-lg shadow-cyan-500/20"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};
