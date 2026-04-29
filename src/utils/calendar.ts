import { DAYS, TIMES, HEAT_STEPS } from '../constants/data';
import type { Day } from '../types';

export const buildSlotRange = (startKey: string | null, endKey: string | null): Set<string> => {
  if (!startKey || !endKey) return new Set();
  const [startDay, startTime] = startKey.split('-');
  const [endDay, endTime] = endKey.split('-');
  const startX = DAYS.indexOf(startDay as any);
  const startY = TIMES.indexOf(startTime);
  const endX = DAYS.indexOf(endDay as any);
  const endY = TIMES.indexOf(endTime);
  const minX = Math.min(startX, endX);
  const maxX = Math.max(startX, endX);
  const minY = Math.min(startY, endY);
  const maxY = Math.max(startY, endY);
  const range = new Set<string>();

  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      range.add(`${DAYS[x]}-${TIMES[y]}`);
    }
  }

  return range;
};

export const getTodayStr = (): Day => {
    const d = new Date();
    const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    const gmt7 = new Date(utc + (3600000 * 7));
    return ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][gmt7.getDay()] as Day;
};

export const heatColor = (count: number) => {
  if (!count) return { bg: '#f8f9fa', text: '#d1d5db', border: '#f0f0f0' };
  return HEAT_STEPS[Math.min(count, 8) - 1];
};
