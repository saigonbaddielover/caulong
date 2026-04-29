import type { Court, HeatStep, Day } from '../types';

export const DAYS: Day[] = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

export const TIMES: string[] = (() => {
    const t: string[] = [];
    for (let h = 8; h <= 21; h++) {
        for (const m of ['00', '30']) {
            const val = h * 100 + parseInt(m);
            if (val >= 1200 && val <= 1330) continue;
            t.push(`${String(h).padStart(2, '0')}:${m}`);
        }
    }
    return t;
})();

export const HEAT_STEPS: HeatStep[] = [
  { bg: '#EEF2FF', text: '#6366F1', border: '#C7D2FE' },
  { bg: '#E0E7FF', text: '#4F46E5', border: '#A5B4FC' },
  { bg: '#C7D2FE', text: '#4338CA', border: '#818CF8' },
  { bg: '#A5B4FC', text: '#3730A3', border: '#6366F1' },
  { bg: '#818CF8', text: '#312E81', border: '#4F46E5' },
  { bg: '#6366F1', text: '#FFFFFF', border: '#4338CA' },
  { bg: '#4F46E5', text: '#FFFFFF', border: '#3730A3' },
  { bg: '#4338CA', text: '#FFFFFF', border: '#312E81' },
];

export const COURTS: Court[] = [
    { name: 'EZB Đằng Hải', phone: '0779766333', address: '84 Lũng Bắc' },
    { name: 'EZB Cầu Niệm', phone: '0934275222', address: '22 Tân Hà' },
    { name: 'EZB An Đồng', phone: '0369633444', address: '87 đường 302' },
    { name: 'EZB Văn Cao', phone: '0914616818', address: '14/333B Văn Cao' },
    { name: 'Phú Cường', phone: '0333766333', address: '135 Quán Trữ' },
    { name: 'Hải Tiến', phone: '0906903555', address: 'lô 9 Lê Hồng Phong' },
    { name: 'Giang Lakaika', phone: '0945433979', address: '50 An Trực' },
    { name: 'TD', phone: '0971186416', address: '34/3B Lê Hồng Phong' },
    { name: 'Phoenix 1', phone: '0976171250', address: 'Số 28, ngõ 739, Nguyễn Văn Linh' },
    { name: 'Phoenix 2', phone: '0976171250', address: 'Ngõ Nguyễn Sơn Hà, 727 Nguyễn Văn Linh' },
];
