import React, { useMemo } from 'react';
import { getTodayStr } from '../../utils/calendar';

interface TimeGridVerticalProps {
  days: string[];
  times: string[];
  renderCell: (day: string, time: string) => React.ReactNode;
  innerRef?: React.RefObject<HTMLDivElement | null>;
}

export const TimeGridVertical: React.FC<TimeGridVerticalProps> = ({ days, times, renderCell, innerRef }) => {
  const todayStr = useMemo(getTodayStr, []);
  const todayIndex = days.indexOf(todayStr);

  return (
    <div className="overflow-x-auto flex-1 flex flex-col min-h-0">
      <div ref={innerRef} className="flex-1 overflow-y-auto relative custom-scrollbar">
        <div className="sticky top-0 z-40 bg-white pt-3 pb-2 px-2 border-b border-gray-100">
          {todayIndex !== -1 && (
            <div className="absolute inset-0 pointer-events-none z-10 px-2" style={{ top: '1px', bottom: '-1px' }}>
              <div className="grid h-full gap-1.5" style={{ gridTemplateColumns: '40px repeat(7, 1fr)' }}>
                <div />
                {days.map((d, i) => (
                  <div key={d} className="relative h-full">
                    {i === todayIndex && (
                      <div className="absolute top-0 bottom-0 border-[#04BADE] rounded-t-[10px]" style={{ left: '-3.75px', right: '-3.75px', borderTopWidth: '1.5px', borderLeftWidth: '1.5px', borderRightWidth: '1.5px', borderBottomWidth: '0' }}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="grid gap-1.5 relative z-20 text-[10px] font-bold uppercase tracking-tight text-gray-400 py-1" style={{ gridTemplateColumns: '40px repeat(7, 1fr)' }}>
            <div />
            {days.map((d, i) => (
              <div key={d} className={`text-center ${i === todayIndex ? 'text-[#04BADE]' : ''}`}>
                {d}
              </div>
            ))}
          </div>
        </div>
        <div className="relative pt-2 pb-4 px-2">
          <div className="relative">
            {todayIndex !== -1 && (
              <div className="absolute inset-0 pointer-events-none z-20" style={{ top: '-16px', bottom: '-4px' }}>
                <div className="grid h-full gap-1.5" style={{ gridTemplateColumns: '40px repeat(7, 1fr)' }}>
                  <div />
                  {days.map((d, i) => (
                    <div key={d} className="relative h-full">
                      {i === todayIndex && (
                        <div className="absolute top-0 bottom-0 border-[#04BADE] rounded-b-[10px]" style={{ left: '-3.75px', right: '-3.75px', borderTopWidth: '0', borderLeftWidth: '1.5px', borderRightWidth: '1.5px', borderBottomWidth: '1.5px' }}></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-1.5 relative z-10">
              {times.map((time) => {
                const isHour = time.endsWith(':00');
                return (
                  <React.Fragment key={time}>
                    {(time === '14:00' || time === '18:00') && (
                      <div className="flex items-center py-2 my-1 relative">
                        <div className="w-[40px]"></div>
                        <div className="flex-1 border-t border-dashed border-indigo-200"></div>
                      </div>
                    )}
                    <div className="grid gap-1.5 relative" style={{ gridTemplateColumns: '40px repeat(7, 1fr)' }}>
                      <div className={`flex items-center justify-end pr-2 text-right select-none ${isHour ? 'text-[10px] font-bold text-gray-500' : 'text-[9px] font-medium text-gray-400'}`}>
                        {time}
                      </div>
                      {days.map(day => (
                        <div key={day} className="relative">
                          {renderCell(day, time)}
                        </div>
                      ))}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
