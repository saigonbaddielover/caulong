import React from 'react';
import { User, Check } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { SelectionActionButtons } from '../ui/SelectionActionButtons';
import { useScheduleStore } from '../../store/useScheduleStore';
import { DAYS, TIMES } from '../../constants/data';
import { usePointerRangeSelection } from '../../hooks/usePointerRangeSelection';

interface PersonalScheduleSectionProps {
  GridComponent: any;
  innerRef: React.RefObject<HTMLDivElement | null>;
  onSaveSchedule: (slots: string[], fixed: boolean) => void;
  sectionClassName?: string;
}

export const PersonalScheduleSection: React.FC<PersonalScheduleSectionProps> = ({
  GridComponent,
  innerRef,
  onSaveSchedule,
  sectionClassName = 'h-auto lg:h-[calc(100dvh-48px)]',
}) => {
  const { mySlots, fixed } = useScheduleStore();

  const handleApplyRange = (action: 'select' | 'deselect', range: Set<string>) => {
    const next = new Set(mySlots);
    range.forEach(key => {
      if (action === 'select') next.add(key);
      else next.delete(key);
    });
    onSaveSchedule(Array.from(next), fixed);
  };

  const {
    dragSelection,
    currentRange,
    startSelection,
    startTouchSelection,
    updateSelection
  } = usePointerRangeSelection({
    dataAttribute: 'data-slot',
    onApplyRange: handleApplyRange,
  });

  const handleSelectAll = () => {
    const all: string[] = [];
    DAYS.forEach(d => TIMES.forEach(t => all.push(`${d}-${t}`)));
    onSaveSchedule(all, fixed);
  };

  const handleClearAll = () => onSaveSchedule([], fixed);

  return (
    <section className={`card p-5 flex flex-col ${sectionClassName}`}>
      <SectionHeader
        title="1. Lịch cá nhân"
        colorClass="text-[#04BADE]"
        icon={<User className="w-3.5 h-3.5" />}
      >
        <SelectionActionButtons
          fixed={fixed}
          onToggleFixed={() => onSaveSchedule(mySlots, !fixed)}
          onSelectAll={handleSelectAll}
          onClearAll={handleClearAll}
        />
      </SectionHeader>
      <GridComponent
        innerRef={innerRef}
        days={DAYS}
        times={TIMES}
        renderCell={(day: string, time: string) => {
          const key = `${day}-${time}`;
          const isHovered = currentRange.has(key);
          const isSelectedInStore = mySlots.includes(key);
          
          let selected = isSelectedInStore;
          if (isHovered) selected = dragSelection.action === 'select';
          
          const dragAction = isSelectedInStore ? 'deselect' : 'select';

          return (
            <button
              key={key}
              data-slot={key}
              onMouseDown={(e) => { e.preventDefault(); startSelection(key, dragAction); }}
              onMouseEnter={() => updateSelection(key)}
              onTouchStart={(e) => startTouchSelection(key, dragAction, e)}
              onContextMenu={(e) => { if (/Mobi|Android/i.test(navigator.userAgent)) e.preventDefault(); }}
              style={{ WebkitTouchCallout: 'none', userSelect: 'none' }}
              className={`w-full rounded-xl border h-9 flex items-center justify-center transition-all duration-150 ${
                selected
                  ? 'bg-[#04BADE] border-[#03a6c7] text-white shadow-sm scale-[0.97]'
                  : 'bg-gray-50 border-gray-100 hover:bg-white hover:border-[#04BADE]/40'
              } ${isHovered ? 'ring-2 ring-[#04BADE]/50 z-10' : ''}`}
            >
              {selected && <Check className="w-3 h-3 pointer-events-none" strokeWidth={3} />}
            </button>
          );
        }}
      />
    </section>
  );
};
