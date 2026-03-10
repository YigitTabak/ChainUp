import { useState } from 'react';
import styles from './History.module.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import Calendar from '../../components/Calendar/Calendar';
import DayPanel from '../../components/DayPanel/DayPanel';
import type { DailyLog } from '../../types';
import { useAppContext } from '../../context/AppContext';

const History = () => {
  const { tasks } = useAppContext();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<DailyLog | null>(null);

  const handleDaySelect = (dateStr: string, log: DailyLog | null) => {
    setSelectedDate(dateStr);
    setSelectedLog(log);
  };

  const handlePanelClose = () => {
    setSelectedDate(null);
    setSelectedLog(null);
  };

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Geçmiş</h1>
          <p className={styles.subtitle}>Tamamladığın görevlerin kayıtları burada</p>
        </div>
        <div className={styles.content}>
          <div className={styles.calendarWrap}>
            <Calendar
              onDaySelect={handleDaySelect}
              selectedDate={selectedDate}
            />
          </div>
          <DayPanel
            dateStr={selectedDate}
            log={selectedLog}
            tasks={tasks}
            onClose={handlePanelClose}
          />
        </div>
      </main>
    </div>
  );
};

export default History;
