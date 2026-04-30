import React, { useMemo, useEffect } from 'react';
import { useScheduleStore } from '../../store/useScheduleStore';
import { DAYS, TIMES } from '../../constants/data';
import { heatColor } from '../../utils/calendar';
import { usePointerRangeSelection } from '../../hooks/usePointerRangeSelection';
import { TimeGridVertical } from '../schedule/TimeGridVertical';
import { TimeGridHorizontal } from '../schedule/TimeGridHorizontal';

interface ManageBookingModalProps {
  newSelection: Set<string>;
  setNewSelection: React.Dispatch<React.SetStateAction<Set<string>>>;
  deleteSelection: Set<string>;
  setDeleteSelection: React.Dispatch<React.SetStateAction<Set<string>>>;
  onClose: () => void;
  onSelectCourt: () => void;
  viewMode: 'vertical' | 'horizontal';
}

export const ManageBookingModal: React.FC<ManageBookingModalProps> = ({
  newSelection,
  setNewSelection,
  deleteSelection,
  setDeleteSelection,
  onClose,
  onSelectCourt,
  viewMode,
}) => {
  const { allSchedules, bookedSlots } = useScheduleStore();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const heatmap = useMemo(() => {
    const map: Record<string, number> = {};
    allSchedules.forEach(s => {
      s.slots.forEach(slot => {
        map[slot] = (map[slot] || 0) + 1;
      });
    });
    return map;
  }, [allSchedules]);

  const handleApplyRange = (action: 'select' | 'deselect', range: Set<string>, meta?: any) => {
    if (meta?.type === 'delete') {
      setDeleteSelection(old => {
        const next = new Set(old);
        range.forEach(key => {
          if (!bookedSlots[key]) return;
          if (action === 'select') next.add(key);
          else next.delete(key);
        });
        return next;
      });
      return;
    }

    setNewSelection(old => {
      const next = new Set(old);
      range.forEach(key => {
        if (bookedSlots[key]) return;
        if (action === 'select') next.add(key);
        else next.delete(key);
      });
      return next;
    });
  };

  const {
    dragSelection,
    currentRange,
    startSelection,
    startTouchSelection,
    updateSelection
  } = usePointerRangeSelection({
    dataAttribute: 'data-slot-manage',
    onApplyRange: handleApplyRange,
  });


  const GridComp = viewMode === 'horizontal' ? TimeGridHorizontal : TimeGridVertical;

  return (
    <div 
      className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[100] px-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className={`bg-white p-5 rounded-3xl w-full shadow-2xl flex flex-col h-[85dvh] ${viewMode === 'horizontal' ? 'max-w-5xl' : 'max-w-3xl'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span>🏸</span> Quản lý đặt sân
          </h3>
          <div className="flex gap-2">
            <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#04BADE] rounded-sm"></span><span className="text-[8px] font-bold uppercase text-gray-400">Đã chốt</span></div>
            <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-400 rounded-sm"></span><span className="text-[8px] font-bold uppercase text-gray-400">Chọn mới</span></div>
            <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-rose-400 rounded-sm"></span><span className="text-[8px] font-bold uppercase text-gray-400">Sẽ xóa</span></div>
          </div>
        </div>
        <div className="flex-1 min-h-0 bg-gray-50 rounded-2xl border border-gray-100 p-2 flex flex-col">
          <GridComp
            days={DAYS}
            times={TIMES}
            renderCell={(day, time) => {
              const key = `${day}-${time}`;
              const count = heatmap[key] || 0;
              const isBooked = !!bookedSlots[key];
              
              const isHovered = currentRange.has(key);
              const selectionType = dragSelection.meta?.type;

              let isNew = newSelection.has(key);
              let isDel = deleteSelection.has(key);

              // Apply hover override logic similar to PersonalScheduleSection
              if (isHovered) {
                if (selectionType === 'delete' && isBooked) {
                  isDel = dragSelection.action === 'select';
                } else if (selectionType === 'new' && !isBooked) {
                  isNew = dragSelection.action === 'select';
                }
              }

              // Determine visual state
              let bg = '#fff', border = '#f3f4f6', text = '#d1d5db';
              if (isBooked && !isDel) { bg = '#04BADE'; border = '#03a6c7'; text = '#fff'; }
              else if (isDel) { bg = '#fb7185'; border = '#e11d48'; text = '#fff'; }
              else if (isNew) { bg = '#fbbf24'; border = '#f59e0b'; text = '#fff'; }
              else if (count > 0) { const c = heatColor(count); bg = c.bg; border = c.border; text = c.text; }

              // Calculate action for this specific cell if user were to start a drag here
              const currentAction = isBooked 
                ? (deleteSelection.has(key) ? 'deselect' : 'select')
                : (newSelection.has(key) ? 'deselect' : 'select');
              const currentMeta = { type: isBooked ? 'delete' : 'new' };

              return (
                <button
                  key={key}
                  data-slot-manage={key}
                  onMouseDown={(e) => { e.preventDefault(); startSelection(key, currentAction, currentMeta); }}
                  onMouseEnter={() => updateSelection(key)}
                  onTouchStart={(e) => startTouchSelection(key, currentAction, e, currentMeta)}
                  onContextMenu={(e) => { if (/Mobi|Android/i.test(navigator.userAgent)) e.preventDefault(); }}
                  style={{ background: bg, color: text, borderColor: border, WebkitTouchCallout: 'none', userSelect: 'none' }}
                  className={`w-full rounded-xl border h-9 flex items-center justify-center text-[11px] font-bold relative transition-all shadow-sm hover:brightness-95 ${
                    isHovered && ((selectionType === 'delete' && isBooked) || (selectionType === 'new' && !isBooked))
                      ? (selectionType === 'delete' ? 'ring-2 ring-rose-500/50 z-10' : 'ring-2 ring-amber-500/50 z-10') 
                      : ''
                  }`}
                >
                  {count > 0 ? count : ''}
                  {(isBooked || isNew) && !isDel && <span className="absolute bottom-0.5 right-0.5 text-[10px] pointer-events-none">🏸</span>}
                  {isDel && <span className="absolute inset-0 flex items-center justify-center text-white bg-rose-500/20 rounded-xl pointer-events-none">✕</span>}
                </button>
              );
            }}
          />
        </div>
        <div className="flex gap-3 justify-end mt-4 shrink-0">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition">Hủy</button>
          <button
            onClick={onSelectCourt}
            disabled={newSelection.size === 0 && deleteSelection.size === 0}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#04BADE] hover:bg-[#03a6c7] transition shadow-lg disabled:opacity-50"
          >
            Tiếp tục
          </button>
        </div>
      </div>
    </div>
  );
};
