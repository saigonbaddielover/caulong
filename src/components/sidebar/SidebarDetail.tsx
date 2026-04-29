import React from 'react';
import { useScheduleStore } from '../../store/useScheduleStore';

interface SidebarDetailProps {
  activeSlot: string | null;
  slotUsers: Record<string, { name: string; photo: string | null }[]>;
}

export const SidebarDetail: React.FC<SidebarDetailProps> = ({ activeSlot, slotUsers }) => {
  const { bookedSlots } = useScheduleStore();
  const info = activeSlot ? bookedSlots[activeSlot] : null;
  const users = activeSlot ? (slotUsers[activeSlot] || []) : [];

  return (
    <div className="card p-5 flex flex-col flex-1 min-h-0 bg-white border border-gray-100 rounded-[20px] shadow-sm overflow-hidden h-full">
      <div className="space-y-5 flex flex-col flex-1 min-h-0">
        {/* Section 1: Thông tin sân */}
        <div className="shrink-0 space-y-3">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900 pb-2 border-b border-gray-100">
            Thông tin sân
          </h2>
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 space-y-2.5 shadow-inner min-h-[84px] flex flex-col justify-center">
            {activeSlot ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-xs">📅</span>
                  <span className="text-[11px] font-bold text-gray-600 uppercase tracking-tight">
                    {activeSlot.replace('-', ' • ')}
                  </span>
                </div>
                <div className="flex items-start gap-2 pt-2 border-t border-gray-200/50">
                  <span className="text-xs">🏸</span>
                  {info ? (
                    <div>
                      <p className="text-[11px] font-bold text-emerald-700 leading-tight">{info.court}</p>
                      <p className="text-[9px] text-emerald-600/60 mt-0.5 italic">
                        Người đặt: <b>{info.user}</b>
                      </p>
                    </div>
                  ) : (
                    <p className="text-[11px] text-gray-400 italic">Trống</p>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center opacity-40 py-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Chưa chọn ca</p>
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Ai rảnh? */}
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100 shrink-0">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900">Ai rảnh?</h2>
            {activeSlot && users.length > 0 && (
              <span className="text-[9px] font-bold text-[#04BADE] bg-[#04BADE]/10 px-2 py-0.5 rounded-full">
                {users.length}
              </span>
            )}
          </div>
          <div className="space-y-1.5 flex-1 overflow-y-auto custom-scrollbar pr-1 pb-1">
            {!activeSlot || users.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 opacity-30 text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Trống</p>
              </div>
            ) : (
              users.map((u, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-2 rounded-xl bg-white border border-gray-100 hover:border-indigo-100 transition-all shadow-sm animate-in fade-in slide-in-from-bottom-1 duration-200"
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-400 flex items-center justify-center text-[10px] font-bold overflow-hidden border border-indigo-100/50">
                    {u.photo ? (
                      <img src={u.photo} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      u.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <p className="text-[11px] font-semibold text-gray-500 truncate">{u.name}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
