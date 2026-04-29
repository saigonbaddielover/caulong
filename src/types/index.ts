export interface Court {
  name: string;
  phone: string;
  address: string;
}

export interface HeatStep {
  bg: string;
  text: string;
  border: string;
}

export type Day = 'T2' | 'T3' | 'T4' | 'T5' | 'T6' | 'T7' | 'CN';

export interface BookingInfo {
  court: string;
  user: string;
}

export interface UserSchedule {
  id: string;
  name: string;
  photo: string | null;
  fixed?: boolean;
  slots: string[];
  updatedAt?: number;
}
