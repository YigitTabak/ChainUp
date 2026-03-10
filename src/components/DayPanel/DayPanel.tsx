import { useState } from 'react';
import styles from './DayPanel.module.css';
import type { DailyLog, Task } from '../../types';
import { formatDisplayDate } from '../../utils/dateUtils';
import { updateDailyNote } from '../../firebase/services';
import { useAuth } from '../../context/AuthContext';

interface Props {
  dateStr: string | null;
  log: DailyLog | null;
  tasks: Task[];
  onClose: () => void;
}

const DayPanel = ({ dateStr, log, tasks, onClose }: Props) => {
  const { user } = useAuth();
  const [note, setNote] = useState(log?.note ?? '');
  const [saving, setSaving] = useState(false);

  const handleSaveNote = async () => {
    if (!user || !dateStr) return;
    setSaving(true);
    try {
      await updateDailyNote(user.uid, dateStr, note);
    } finally {
      setSaving(false);
    }
  };

  if (!dateStr) return null;

  const completedTaskIds = Object.entries(log?.taskCompletions ?? {})
    .filter(([, v]) => v)
    .map(([k]) => k);

  const dayTasks = tasks.filter((t) => completedTaskIds.includes(t.id));

  return (
    <div className={`${styles.panel} ${dateStr ? styles.open : ''}`}>
      <div className={styles.panelHeader}>
        <div>
          <h3 className={styles.panelDate}>{formatDisplayDate(dateStr)}</h3>
          {log?.ringType && (
            <span className={`${styles.ringBadge} ${styles[log.ringType]}`}>
              {log.ringType === 'bright' ? '● Parlak halka' : '○ Kırık halka'}
            </span>
          )}
        </div>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>
      </div>

      <div className={styles.panelBody}>
        {dayTasks.length > 0 ? (
          <div className={styles.section}>
            <p className={styles.sectionTitle}>Tamamlanan hedefler</p>
            {dayTasks.map((t) => (
              <div key={t.id} className={styles.taskRow}>
                <span className={styles.checkMark}>✓</span>
                <div>
                  <p className={styles.taskTitle}>{t.title}</p>
                  <p className={styles.taskGoal}>{t.dailyGoal}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.noTasks}>
            <p>Bu gün için tamamlanan görev yok.</p>
          </div>
        )}

        <div className={styles.section}>
          <p className={styles.sectionTitle}>Not</p>
          <textarea
            className={styles.noteInput}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Bu gün için bir şeyler yaz…"
            rows={4}
          />
          <button
            className={styles.saveBtn}
            onClick={handleSaveNote}
            disabled={saving}
          >
            {saving ? 'Kaydediliyor…' : 'Notu Kaydet'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DayPanel;
