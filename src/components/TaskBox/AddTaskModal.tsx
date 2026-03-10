import React, { useState } from 'react';
import styles from './AddTaskModal.module.css';
import { addTask, saveTaskLetter } from '../../firebase/services';
import { useAuth } from '../../context/AuthContext';
import { Timestamp } from 'firebase/firestore';

interface Props {
  onClose: () => void;
  existingCount: number;
}

const AddTaskModal = ({ onClose, existingCount }: Props) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [dailyGoal, setDailyGoal] = useState('');
  const [duration, setDuration] = useState(30);
  const [letterContent, setLetterContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dailyGoal.trim()) {
      setError('Lütfen görev başlığını ve günlük hedefini doldur.');
      return;
    }
    if (!letterContent.trim()) {
      setError('Lütfen kendine bir mektup yaz.');
      return;
    }
    if (!user) return;

    setLoading(true);
    try {
      const taskId = await addTask({
        userId: user.uid,
        title: title.trim(),
        dailyGoal: dailyGoal.trim(),
        duration,
        completedRings: 0,
        isCompleted: false,
        order: existingCount,
        createdAt: Timestamp.now(),
      });

      await saveTaskLetter(taskId, user.uid, title.trim(), letterContent.trim());
      onClose();
    } catch {
      setError('Bir hata oluştu. Tekrar dene.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Yeni Görev</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="task-title" className={styles.label}>Ana Görev</label>
            <input
              id="task-title"
              type="text"
              className={styles.input}
              placeholder="örn: Kitabı bitir"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={80}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="task-goal" className={styles.label}>Günlük Hedef</label>
            <input
              id="task-goal"
              type="text"
              className={styles.input}
              placeholder="örn: Günde 20 sayfa oku"
              value={dailyGoal}
              onChange={(e) => setDailyGoal(e.target.value)}
              maxLength={120}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="task-duration" className={styles.label}>
              Süre — <strong>{duration} gün</strong>
            </label>
            <input
              id="task-duration"
              type="range"
              min={1}
              max={31}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className={styles.slider}
            />
            <div className={styles.sliderLabels}>
              <span>1 gün</span>
              <span>31 gün</span>
            </div>
          </div>

          <div className={styles.letterBox}>
            <div className={styles.letterBoxHeader}>
              <span className={styles.letterIcon}>✉</span>
              <div>
                <p className={styles.letterBoxTitle}>Kendine mektup yaz</p>
                <p className={styles.letterBoxHint}>
                  Bu görevi tamamladığında açılacak. Şimdi yaz, sonra oku.
                </p>
              </div>
            </div>
            <textarea
              id="task-letter"
              className={styles.letterTextarea}
              placeholder="Sevgili gelecekteki ben, bu görevi seçmemin sebebi…"
              value={letterContent}
              onChange={(e) => setLetterContent(e.target.value)}
              rows={5}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              İptal
            </button>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Ekleniyor…' : 'Görevi Ekle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
