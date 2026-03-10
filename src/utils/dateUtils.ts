/**
 * Returns today's date as YYYY-MM-DD.
 * In development, can be overridden via localStorage:
 *   localStorage.setItem('__DEV_DATE__', '2026-03-11')
 */
export const getTodayStr = (): string => {
  if (import.meta.env.DEV) {
    const override = localStorage.getItem('__DEV_DATE__');
    if (override) return override;
  }
  const d = new Date();
  return formatDateStr(d);
};

/**
 * Format a Date object to YYYY-MM-DD
 */
export const formatDateStr = (d: Date): string => {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/**
 * Parse a YYYY-MM-DD string to a Date object (local midnight)
 */
export const parseDateStr = (str: string): Date => {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
};

/**
 * Add N days to a YYYY-MM-DD string
 */
export const addDays = (dateStr: string, days: number): string => {
  const d = parseDateStr(dateStr);
  d.setDate(d.getDate() + days);
  return formatDateStr(d);
};

/**
 * Get day difference between two YYYY-MM-DD strings (a - b)
 */
export const dayDiff = (a: string, b: string): number => {
  const da = parseDateStr(a);
  const db = parseDateStr(b);
  return Math.round((da.getTime() - db.getTime()) / 86_400_000);
};

/**
 * Get all days in a month as YYYY-MM-DD[]
 */
export const getDaysInMonth = (year: number, month: number): string[] => {
  const days: string[] = [];
  const date = new Date(year, month - 1, 1);
  while (date.getMonth() === month - 1) {
    days.push(formatDateStr(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

/**
 * Return a human-friendly "Day X" label or date label
 */
export const formatDisplayDate = (dateStr: string): string => {
  const d = parseDateStr(dateStr);
  return d.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

/**
 * Get month name in Turkish
 */
export const getMonthName = (month: number): string => {
  const names = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
  ];
  return names[month - 1];
};

/**
 * Get weekday index (0=Monday ... 6=Sunday) for first day of month
 */
export const getFirstDayOfMonth = (year: number, month: number): number => {
  const day = new Date(year, month - 1, 1).getDay();
  return day === 0 ? 6 : day - 1; // Shift Sunday to end
};
