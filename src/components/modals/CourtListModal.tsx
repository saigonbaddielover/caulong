import React from 'react';
import { MapPin, X, Phone } from 'lucide-react';
import { COURTS } from '../../constants/data';

interface CourtListModalProps {
  onClose: () => void;
}

export const CourtListModal: React.FC<CourtListModalProps> = ({ onClose }) => (
  <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[100] px-4 animate-in fade-in duration-200">
    <div className="bg-white p-6 rounded-3xl max-w-4xl w-full shadow-2xl flex flex-col max-h-[85dvh]">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-indigo-500" /> Danh sách sân
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="flex-1 overflow-auto custom-scrollbar border border-gray-100 rounded-2xl bg-gray-50/50">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-white sticky top-0 z-10 shadow-sm text-[10px] font-bold text-gray-400 uppercase">
            <tr>
              <th className="p-4 w-12 text-center border-b">#</th>
              <th className="p-4 border-b">Tên sân</th>
              <th className="p-4 border-b">SĐT</th>
              <th className="p-4 border-b">Địa chỉ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {COURTS.map((court, idx) => (
              <tr key={idx} className="hover:bg-white transition-colors group">
                <td className="p-4 font-bold text-gray-300 text-center">{idx + 1}</td>
                <td className="p-4 font-bold text-[#04BADE]">{court.name}</td>
                <td className="p-4 font-semibold text-gray-600 group-hover:text-emerald-500 transition-colors">
                  <a href={`tel:${court.phone}`} className="flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {court.phone}
                  </a>
                </td>
                <td className="p-4 text-gray-500">{court.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 text-center">
        <button
          onClick={onClose}
          className="px-8 py-3 rounded-2xl text-xs font-bold text-white bg-[#04BADE] hover:bg-[#03a6c7] transition shadow-lg w-full sm:w-auto"
        >
          Đóng
        </button>
      </div>
    </div>
  </div>
);
