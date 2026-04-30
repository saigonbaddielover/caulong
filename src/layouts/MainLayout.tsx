import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { useScheduleStore } from '../store/useScheduleStore';
import { SidebarTop } from '../components/sidebar/SidebarTop';
import { SidebarDetail } from '../components/sidebar/SidebarDetail';
import { PersonalScheduleSection } from '../components/schedule/PersonalScheduleSection';
import { SummaryScheduleSection } from '../components/schedule/SummaryScheduleSection';
import { TimeGridHorizontal } from '../components/schedule/TimeGridHorizontal';
import { TimeGridVertical } from '../components/schedule/TimeGridVertical';
import { ManageBookingModal } from '../components/modals/ManageBookingModal';
import { SelectCourtModal } from '../components/modals/SelectCourtModal';
import { CourtListModal } from '../components/modals/CourtListModal';
import { MemberListModal } from '../components/modals/MemberListModal';
import { ConfirmationModal } from '../components/modals/ConfirmationModal';
import { COURTS } from '../constants/data';

interface MainLayoutProps {
  user: User;
  onLogout: () => void;
  onSaveSchedule: (slots: string[], fixed: boolean) => Promise<void>;
  onSaveBookings: (data: { newSelection: Set<string>; deleteSelection: Set<string>; selectedCourt: string }) => Promise<void>;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  user,
  onLogout,
  onSaveSchedule,
  onSaveBookings,
}) => {
  const [viewMode, setViewMode] = useState<'vertical' | 'horizontal'>('horizontal');
  const { allSchedules, activeSlot, setActiveSlot } = useScheduleStore();
  
  const [modalConfig, setModalConfig] = useState<{ message: string; onConfirm: () => void } | null>(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isCourtModalOpen, setIsCourtModalOpen] = useState(false);
  const [isSelectCourtModalOpen, setIsSelectCourtModalOpen] = useState(false);
  const [isMemberListModalOpen, setIsMemberListModalOpen] = useState(false);
  
  const [newSelection, setNewSelection] = useState<Set<string>>(new Set());
  const [deleteSelection, setDeleteSelection] = useState<Set<string>>(new Set());
  const [selectedCourt, setSelectedCourt] = useState(COURTS[0].name);

  const grid1Ref = useRef<HTMLDivElement>(null);
  const grid2Ref = useRef<HTMLDivElement>(null);

  // Sync scroll
  useEffect(() => {
    const el1 = grid1Ref.current;
    const el2 = grid2Ref.current;
    if (!el1 || !el2) return;

    let lock = false;
    const onScroll1 = () => {
      if (lock) return;
      lock = true;
      el2.scrollTop = el1.scrollTop;
      el2.scrollLeft = el1.scrollLeft;
      window.requestAnimationFrame(() => { lock = false; });
    };
    const onScroll2 = () => {
      if (lock) return;
      lock = true;
      el1.scrollTop = el2.scrollTop;
      el1.scrollLeft = el2.scrollLeft;
      window.requestAnimationFrame(() => { lock = false; });
    };

    el1.addEventListener('scroll', onScroll1, { passive: true });
    el2.addEventListener('scroll', onScroll2, { passive: true });

    return () => {
      el1.removeEventListener('scroll', onScroll1);
      el2.removeEventListener('scroll', onScroll2);
    };
  }, [viewMode]);

  const slotUsers = useMemo(() => {
    const map: Record<string, { name: string; photo: string | null }[]> = {};
    allSchedules.forEach(entry => entry.slots?.forEach(slot => {
      if (!map[slot]) map[slot] = [];
      map[slot].push({ name: entry.name, photo: entry.photo });
    }));
    return map;
  }, [allSchedules]);

  const handleFinalSave = async () => {
    await onSaveBookings({ newSelection, deleteSelection, selectedCourt });
    setIsSelectCourtModalOpen(false);
    setIsManageModalOpen(false);
    setNewSelection(new Set());
    setDeleteSelection(new Set());
  };

  const isHorizontalView = viewMode === 'horizontal';
  const GridComponent = isHorizontalView ? TimeGridHorizontal : TimeGridVertical;
  const contentGridClass = isHorizontalView ? 'lg:col-span-10 flex flex-col gap-5 lg:h-[calc(100dvh-48px)] min-h-0' : 'lg:col-span-5';
  const scheduleSectionClassName = isHorizontalView ? 'flex-1 min-h-0' : 'h-auto lg:h-[calc(100dvh-48px)]';

  const shellClassName = `grid grid-cols-1 gap-4 mx-auto ${isHorizontalView ? 'items-stretch lg:grid-cols-12 max-w-[1600px]' : 'items-start lg:grid-cols-12 max-w-[1400px]'}`;

  return (
    <div className="min-h-screen min-h-[100dvh] p-4 md:p-6 relative bg-[#f0f2f5]">
      <div className={shellClassName}>
        {/* Sidebar Left/Top */}
        <div className={`flex flex-col gap-4 ${isHorizontalView ? 'lg:col-span-2' : 'lg:col-span-2'}`}>
          <SidebarTop
            user={user}
            idleSyncLabel="Saved"
            onLogout={() => setModalConfig({ 
              message: 'mày chắc chưa?', 
              onConfirm: () => {
                onLogout();
                setModalConfig(null);
              } 
            })}
            onOpenManage={() => setIsManageModalOpen(true)}
            onOpenCourts={() => setIsCourtModalOpen(true)}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
          <div className="hidden lg:flex flex-col flex-1 min-h-0">
            <SidebarDetail activeSlot={activeSlot} slotUsers={slotUsers} />
          </div>
        </div>

        {/* Schedule Content */}
        {isHorizontalView ? (
          <div className={`order-2 lg:order-none ${contentGridClass}`}>
            <PersonalScheduleSection
              GridComponent={GridComponent}
              innerRef={grid1Ref}
              onSaveSchedule={onSaveSchedule}
              sectionClassName={scheduleSectionClassName}
            />
            <SummaryScheduleSection
              GridComponent={GridComponent}
              innerRef={grid2Ref}
              onOpenMembers={() => setIsMemberListModalOpen(true)}
              sectionClassName={scheduleSectionClassName}
            />
          </div>
        ) : (
          <React.Fragment>
            <div className={`order-2 lg:order-none ${contentGridClass}`}>
              <PersonalScheduleSection
                GridComponent={GridComponent}
                innerRef={grid1Ref}
                onSaveSchedule={onSaveSchedule}
                sectionClassName={scheduleSectionClassName}
              />
            </div>
            <div className="order-3 lg:order-none lg:col-span-5">
              <SummaryScheduleSection
                GridComponent={GridComponent}
                innerRef={grid2Ref}
                onOpenMembers={() => setIsMemberListModalOpen(true)}
                sectionClassName={scheduleSectionClassName}
              />
            </div>
          </React.Fragment>
        )}
      </div>

      {/* Mobile Bottom Sheet for Detail */}
      <div className={`lg:hidden fixed inset-0 z-[120] transition-opacity duration-300 ${activeSlot ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setActiveSlot(null)}></div>
        <div
          className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 transform ${activeSlot ? 'translate-y-0' : 'translate-y-full'} flex flex-col`}
          style={{ maxHeight: '85dvh', paddingBottom: 'env(safe-area-inset-bottom)', overscrollBehavior: 'contain' }}
        >
          <div className="flex justify-center pt-3 pb-2 w-full active:bg-gray-50 rounded-t-3xl" onClick={() => setActiveSlot(null)}>
            <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
          </div>
          <div className="p-4 pt-0 flex-1 overflow-y-auto custom-scrollbar flex flex-col min-h-0">
            <SidebarDetail activeSlot={activeSlot} slotUsers={slotUsers} />
          </div>
        </div>
      </div>

      {/* Modals */}
      {isManageModalOpen && (
        <ManageBookingModal
          newSelection={newSelection}
          setNewSelection={setNewSelection}
          deleteSelection={deleteSelection}
          setDeleteSelection={setDeleteSelection}
          onClose={() => setIsManageModalOpen(false)}
          onSelectCourt={() => setIsSelectCourtModalOpen(true)}
          viewMode={viewMode}
        />
      )}
      {isSelectCourtModalOpen && (
        <SelectCourtModal
          newCount={newSelection.size}
          delCount={deleteSelection.size}
          selectedCourt={selectedCourt}
          setSelectedCourt={setSelectedCourt}
          onBack={() => setIsSelectCourtModalOpen(false)}
          onSave={handleFinalSave}
        />
      )}
      {isCourtModalOpen && <CourtListModal onClose={() => setIsCourtModalOpen(false)} />}
      {isMemberListModalOpen && <MemberListModal members={allSchedules} onClose={() => setIsMemberListModalOpen(false)} />}
      {modalConfig && <ConfirmationModal config={modalConfig} onClose={() => setModalConfig(null)} />}
    </div>
  );
};
