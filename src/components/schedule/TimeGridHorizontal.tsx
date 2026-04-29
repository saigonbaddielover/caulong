import React, { useMemo } from 'react';
import { getTodayStr } from '../../utils/calendar';

interface TimeGridHorizontalProps {
  days: string[];
  times: string[];
  renderCell: (day: string, time: string) => React.ReactNode;
  innerRef?: React.RefObject<HTMLDivElement | null>;
}

export const TimeGridHorizontal: React.FC<TimeGridHorizontalProps> = ({ days, times, renderCell, innerRef }) => {
  const todayStr = useMemo(getTodayStr, []);
  const todayIndex = days.indexOf(todayStr);

  const gridTemplate = useMemo(() => {
    const cols = ['56px'];
    times.forEach(t => {
      if (t === '14:00' || t === '18:00') cols.push('8px');
      cols.push('minmax(40px, 1fr)');
    });
    return cols.join(' ');
  }, [times]);

  return (
    <div className="overflow-x-auto flex-1 flex flex-col min-h-0">
      <div ref={innerRef} className="flex-1 overflow-x-auto overflow-y-auto relative custom-scrollbar">
        <div className="sticky top-0 z-40 bg-white pt-3 pb-2 pr-2 pl-0 border-b border-gray-100 min-w-max">
          <div className="absolute top-0 bottom-0 left-0 right-0 pointer-events-none z-[50]">
            <div className="sticky left-0 w-[54px] h-full bg-white shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]" />
          </div>
          <div className="grid gap-1.5 relative z-20 py-1" style={{ gridTemplateColumns: gridTemplate }}>
            <div />
            {times.map((time, idx) => {
              const isHour = time.endsWith(':00');
              const sep = (time === '14:00' || time === '18:00') ? <div key={`sep-${idx}`} /> : null;
              const col = (
                <div key={time} className={`text-center ${isHour ? 'text-[10px] font-bold text-gray-500' : 'text-[9px] font-medium text-gray-400'} uppercase tracking-tight`}>
                  {time}
                </div>
              );
              return sep ? [sep, col] : col;
            })}
          </div>
        </div>
        <div className="relative pt-2 pb-4 pr-2 pl-0 min-w-max">
          <div className="absolute top-0 bottom-0 left-0 right-0 pointer-events-none z-[30]">
            <div className="sticky left-0 w-[54px] h-full bg-white shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]" />
          </div>
          <div className="relative">
            <div className="space-y-1.5 relative">
              {days.map((day, i) => {
                return (
                  <div key={day} className="grid gap-1.5 relative" style={{ gridTemplateColumns: gridTemplate }}>
                    {i === todayIndex && (
                      <React.Fragment>
                        <div className="absolute pointer-events-none z-[10]" style={{ left: '0', width: '56px', top: '-2px', bottom: '-2px' }}>
                          <div className="absolute inset-0 border-[#04BADE] rounded-l-[10px]" style={{ borderTopWidth: '1.5px', borderBottomWidth: '1.5px', borderLeftWidth: '1.5px', borderRightWidth: '0' }}></div>
                        </div>
                        <div className="absolute pointer-events-none z-[10]" style={{ left: '54px', right: '-4px', top: '-2px', bottom: '-2px' }}>
                          <div className="absolute inset-0 border-[#04BADE] rounded-r-[10px]" style={{ borderTopWidth: '1.5px', borderBottomWidth: '1.5px', borderRightWidth: '1.5px', borderLeftWidth: '0' }}></div>
                        </div>
                      </React.Fragment>
                    )}
                    <div className={`sticky left-0 z-[40] w-[56px] flex items-center justify-end pr-2 text-right select-none text-[10px] font-bold ${day === todayStr ? 'text-[#04BADE]' : 'text-gray-500'}`}>
                      <span className="relative z-10">{day}</span>
                    </div>
                    {times.map((time, idx) => {
                      const sep = (time === '14:00' || time === '18:00') ? (
                        <div key={`sep-${idx}`} className="flex justify-center items-center py-1">
                          <div className="h-full border-l border-dashed border-indigo-200"></div>
                        </div>
                      ) : null;
                      const col = (
                        <div key={time} className="relative">
                          {renderCell(day, time)}
                        </div>
                      );
                      return sep ? [sep, col] : col;
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
