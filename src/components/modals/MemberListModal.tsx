import React from 'react';
import { Crown, X } from 'lucide-react';
import type { UserSchedule } from '../../types';

interface MemberListModalProps {
  members: UserSchedule[];
  onClose: () => void;
}

export const MemberListModal: React.FC<MemberListModalProps> = ({ members, onClose }) => (
  <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[100] px-4 animate-in fade-in duration-200">
    <div className="bg-white p-6 rounded-3xl max-w-md w-full shadow-2xl flex flex-col max-h-[80vh]">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Crown className="w-5 h-5 text-amber-500" /> Danh sách thượng đế
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2">
        {members.map((m, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100 hover:border-indigo-100 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-500 flex items-center justify-center font-bold shadow-sm overflow-hidden">
              {m.photo ? (
                <img src={m.photo} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                m.name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-700 truncate">{m.name}</p>
            </div>
            <div className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
              Active
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <button
          onClick={onClose}
          className="px-8 py-3 rounded-2xl text-xs font-bold text-white bg-[#04BADE] hover:bg-[#03a6c7] transition shadow-lg w-full"
        >
          Đóng
        </button>
      </div>
    </div>
  </div>
);
