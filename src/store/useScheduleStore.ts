import { create } from 'zustand';
import type { UserSchedule, BookingInfo } from '../types';

interface ScheduleState {
  mySlots: string[];
  allSchedules: UserSchedule[];
  bookedSlots: Record<string, BookingInfo>;
  fixed: boolean;
  syncing: boolean;
  activeSlot: string | null;
  
  // Actions
  setMySlots: (slots: string[]) => void;
  setAllSchedules: (schedules: UserSchedule[]) => void;
  setBookedSlots: (bookedSlots: Record<string, BookingInfo>) => void;
  setFixed: (fixed: boolean) => void;
  setSyncing: (syncing: boolean) => void;
  setActiveSlot: (slot: string | null) => void;
}

export const useScheduleStore = create<ScheduleState>((set) => ({
  mySlots: [],
  allSchedules: [],
  bookedSlots: {},
  fixed: false,
  syncing: false,
  activeSlot: null,

  setMySlots: (slots) => set({ mySlots: slots }),
  setAllSchedules: (schedules) => set({ allSchedules: schedules }),
  setBookedSlots: (bookedSlots) => set({ bookedSlots }),
  setFixed: (fixed) => set({ fixed }),
  setSyncing: (syncing) => set({ syncing }),
  setActiveSlot: (slot) => set({ activeSlot: slot }),
}));
