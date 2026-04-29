import React from 'react';
import { FixedToggle } from './FixedToggle';

interface SelectionActionButtonsProps {
  fixed: boolean;
  onToggleFixed: () => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  clearLabel?: string;
}

export const SelectionActionButtons: React.FC<SelectionActionButtonsProps> = ({
  fixed,
  onToggleFixed,
  onSelectAll,
  onClearAll,
  clearLabel = 'Bỏ chọn',
}) => (
  <div className="flex items-center gap-2">
    <FixedToggle fixed={fixed} onToggle={onToggleFixed} />
    <button
      onClick={onSelectAll}
      className="px-2.5 py-1 rounded-lg border border-[#04BADE]/30 bg-[#04BADE]/10 text-[#04BADE] text-[10px] font-semibold hover:bg-[#04BADE]/20 transition-all"
    >
      Chọn tất cả
    </button>
    <button
      onClick={onClearAll}
      className="px-2.5 py-1 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 text-[10px] font-semibold hover:bg-rose-100 transition-all"
    >
      {clearLabel}
    </button>
  </div>
);
