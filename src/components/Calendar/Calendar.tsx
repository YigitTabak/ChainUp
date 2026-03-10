import { useState, useEffect } from 'react';
import styles from './Calendar.module.css';
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  getMonthName,
} from '../../utils/dateUtils';
import { getLogsForMonth } from '../../firebase/services';
import { useAuth } from '../../context/AuthContext';
import type { DailyLog } from '../../types';

interface Props {
  onDaySelect: (dateStr: string, log: DailyLog | null) => void;
  selectedDate: string | null;
}

const WEEKDAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

const Calendar = ({ onDaySelect, selectedDate }: Props) => {
  const { user } = useAuth();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [logs, setLogs] = useState<Record<string, DailyLog>>({});
  const [_loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getLogsForMonth(user.uid, year, month)
      .then((data) => {
        const byDate: Record<string, DailyLog> = {};
        data.forEach((l) => { byDate[l.date] = l; });
        setLogs(byDate);
      })
      .finally(() => setLoading(false));
  }, [user, year, month]);

  const days = getDaysInMonth(year, month);
  const firstDayOffset = getFirstDayOfMonth(year, month);
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const prevMonth = () => {
    if (month === 1) { setYear(y => y - 1); setMonth(12); }
    else setMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (month === 12) { setYear(y => y + 1); setMonth(1); }
    else setMonth(m => m + 1);
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.nav}>
        <button className={styles.navBtn} onClick={prevMonth}>‹</button>
        <span className={styles.monthLabel}>
          {getMonthName(month)} {year}
        </span>
        <button className={styles.navBtn} onClick={nextMonth}>›</button>
      </div>

      <div className={styles.weekdays}>
        {WEEKDAYS.map((d) => (
          <span key={d} className={styles.weekday}>{d}</span>
        ))}
      </div>

      <div className={styles.grid}>
        {/* Offset blank cells */}
        {Array.from({ length: firstDayOffset }).map((_, i) => (
          <div key={`blank-${i}`} className={styles.blank} />
        ))}

        {days.map((dateStr) => {
          const log = logs[dateStr];
          const isToday = dateStr === today;
          const isSelected = dateStr === selectedDate;
          const isFuture = dateStr > today;

          return (
            <button
              key={dateStr}
              className={`
                ${styles.day}
                ${isToday ? styles.today : ''}
                ${isSelected ? styles.selected : ''}
                ${isFuture ? styles.future : ''}
                ${log?.ringType === 'bright' ? styles.bright : ''}
                ${log?.ringType === 'broken' ? styles.broken : ''}
              `}
              onClick={() => !isFuture && onDaySelect(dateStr, log ?? null)}
              disabled={isFuture}
            >
              <span className={styles.dayNum}>
                {parseInt(dateStr.split('-')[2])}
              </span>
              {log?.ringType && (
                <span className={`${styles.dot} ${styles[log.ringType]}`} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
