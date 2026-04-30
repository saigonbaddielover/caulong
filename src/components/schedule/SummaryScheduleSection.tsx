import React, { useMemo } from 'react';
import { Users, Check } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { useScheduleStore } from '../../store/useScheduleStore';
import { DAYS, TIMES } from '../../constants/data';
import { heatColor } from '../../utils/calendar';

interface SummaryScheduleSectionProps {
  GridComponent: any;
  innerRef: React.RefObject<HTMLDivElement | null>;
  onOpenMembers: () => void;
  sectionClassName?: string;
}

export const SummaryScheduleSection: React.FC<SummaryScheduleSectionProps> = ({
  GridComponent,
  innerRef,
  onOpenMembers,
  sectionClassName = 'h-auto lg:h-[calc(100dvh-48px)]',
}) => {
  const { allSchedules, bookedSlots, mySlots, activeSlot, setActiveSlot } = useScheduleStore();

  const heatmap = useMemo(() => {
    const map: Record<string, number> = {};
    allSchedules.forEach(s => {
      s.slots.forEach(slot => {
        map[slot] = (map[slot] || 0) + 1;
      });
    });
    return map;
  }, [allSchedules]);

  return (
    <section className={`card p-5 flex flex-col ${sectionClassName}`}>
      <SectionHeader
        title="2. Lịch tổng kết"
        colorClass="text-rose-400"
        icon={<Users className="w-3.5 h-3.5" />}
      >
        <button
          onClick={onOpenMembers}
          className="text-[10px] text-gray-400 font-bold bg-gray-50 hover:bg-gray-100 border border-gray-100 px-2 py-1 rounded-lg transition-all shadow-sm"
        >
          {allSchedules.length} thành viên
        </button>
      </SectionHeader>
      <GridComponent
        innerRef={innerRef}
        days={DAYS}
        times={TIMES}
        renderCell={(day: string, time: string) => {
          const key = `${day}-${time}`;
          const count = heatmap[key] || 0;
          const colors = heatColor(count);
          const isActive = activeSlot === key;
          const info = bookedSlots[key];
          const isSelected = mySlots.includes(key);

          return (
            <button
              key={key}
              onClick={() => setActiveSlot(isActive ? null : key)}
              style={{
                background: colors.bg,
                color: colors.text,
                borderColor: isActive ? '#6366f1' : colors.border,
                outline: isActive ? '2px solid #6366f1' : 'none',
                outlineOffset: '1px',
              }}
              className="relative w-full rounded-xl border h-9 flex items-center justify-center text-[11px] font-bold transition-all hover:brightness-95"
            >
              {count > 0 ? count : ''}
              {info && (
                <span
                  className="absolute bottom-0.5 right-0.5 text-[10px] leading-none drop-shadow-sm pointer-events-none"
                  title={`${info.court} - ${info.user}`}
                >
                  🏸
                </span>
              )}
              {isSelected && (
                <div className="absolute top-0.5 right-0.5 text-[#04BADE] drop-shadow-sm pointer-events-none" title="Ca bạn đã chọn">
                  <Check className="w-3 h-3" strokeWidth={3} />
                </div>
              )}
            </button>
          );
        }}
      />
    </section>
  );
};
