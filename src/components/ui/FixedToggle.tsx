import React from 'react';

interface FixedToggleProps {
  fixed: boolean;
  onToggle: () => void;
}

export const FixedToggle: React.FC<FixedToggleProps> = ({ fixed, onToggle }) => (
  <div className="relative group">
    <button
      onClick={onToggle}
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-semibold transition-all duration-200 text-[#04BADE] ${
        fixed ? 'bg-[#04BADE]/10 border-[#04BADE]/30' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
      }`}
    >
      Cố định
      <span
        className={`w-6 h-3 rounded-full relative transition-colors duration-200 ${
          fixed ? 'bg-[#04BADE]' : 'bg-gray-300'
        }`}
      >
        <span
          className={`absolute top-0.5 w-2 h-2 rounded-full bg-white transition-all ${
            fixed ? 'left-3.5' : 'left-0.5'
          }`}
        />
      </span>
    </button>
    <div className="absolute right-0 top-full mt-1.5 w-56 bg-gray-900 text-white text-[10px] leading-relaxed rounded-xl p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-50 shadow-xl">
      Khi bật, lịch của bạn sẽ cố định hàng tuần và không bị tự động xoá sau mỗi ngày.
    </div>
  </div>
);
