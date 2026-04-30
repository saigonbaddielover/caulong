import React from 'react';
import { RefreshCw, Columns, Rows, MapPin, Calendar } from 'lucide-react';
import { useScheduleStore } from '../../store/useScheduleStore';
import type { User } from 'firebase/auth';

const GitHub = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

interface SidebarTopProps {
  user: User;
  idleSyncLabel: string;
  onLogout: () => void;
  onOpenManage: () => void;
  onOpenCourts: () => void;
  viewMode: 'vertical' | 'horizontal';
  setViewMode: (mode: 'vertical' | 'horizontal') => void;
}

export const SidebarTop: React.FC<SidebarTopProps> = ({
  user,
  idleSyncLabel,
  onLogout,
  onOpenManage,
  onOpenCourts,
  viewMode,
  setViewMode,
}) => {
  const { syncing } = useScheduleStore();

  return (
    <div className="card p-4 shrink-0 flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-y-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs text-white shadow-sm">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm tracking-tight text-gray-800">Lịch Rảnh</span>
          </div>
          <div className="flex items-center gap-1 text-[9px] font-semibold tracking-wider uppercase text-gray-300 pt-0.5">
            <RefreshCw className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Saving' : idleSyncLabel}
          </div>
        </div>
        <div className="flex flex-col items-end opacity-50 select-none pointer-events-none pt-0.5">
          <span className="text-[9px] font-medium text-gray-400 lowercase tracking-wider">
            v{__APP_VERSION__}
          </span>
          <div className="flex items-center gap-1">
            <GitHub className="w-2.5 h-2.5 text-gray-400" />
            <span className="text-[9px] font-medium text-gray-400 lowercase tracking-wider">
              saigonbaddielover
            </span>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 shadow-inner">
          <div className="flex items-center gap-2 min-w-0">
            {user.photoURL ? (
              <img src={user.photoURL} className="w-7 h-7 rounded-full object-cover border border-white" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-500 flex items-center justify-center text-[11px] font-bold">
                {user.displayName?.charAt(0) || 'U'}
              </div>
            )}
            <span className="text-xs font-bold text-gray-700 truncate">{user.displayName}</span>
          </div>
          <button
            onClick={onLogout}
            className="shrink-0 text-[9px] text-gray-400 hover:text-red-500 font-bold uppercase tracking-tighter transition-colors bg-white hover:bg-red-50 px-2 py-1 rounded-lg border border-gray-100 hover:border-red-100 shadow-sm active:scale-95"
          >
            Đăng xuất
          </button>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl w-full shadow-inner">
          <button
            onClick={() => setViewMode('horizontal')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
              viewMode === 'horizontal' ? 'bg-white text-[#04BADE] shadow-sm ring-1 ring-black/5' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Rows className="w-3.5 h-3.5" />
            <span>Ngang</span>
          </button>
          <button
            onClick={() => setViewMode('vertical')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
              viewMode === 'vertical' ? 'bg-white text-[#04BADE] shadow-sm ring-1 ring-black/5' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Dọc</span>
          </button>
        </div>
        <button
          onClick={onOpenManage}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-100 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95"
        >
          <span className="text-[14px]">🏸</span> Quản lý đặt sân
        </button>
        <button
          onClick={onOpenCourts}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95"
        >
          <MapPin className="w-3.5 h-3.5" /> Danh sách sân
        </button>
      </div>
    </div>
  );
};
