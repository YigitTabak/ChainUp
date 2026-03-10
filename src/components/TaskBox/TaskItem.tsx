import { useState } from 'react';
import styles from './TaskItem.module.css';
import type { Task } from '../../types';

interface Props {
  task: Task;
  isCompleted: boolean;
  onPressRing: () => void;
  onDelete: () => void;
}

const TaskItem = ({ task, isCompleted, onPressRing, onDelete }: Props) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const progress = Math.min(100, Math.round((task.completedRings / task.duration) * 100));
  const ringsLeft = Math.max(0, task.duration - task.completedRings);

  return (
    <div className={`${styles.taskItem} ${isCompleted ? styles.completedTask : ''}`}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <span className={styles.taskTitle}>{task.title}</span>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.daysLeft}>
            {isCompleted ? 'Tamamlandı' : `${ringsLeft} halka kaldı`}
          </span>
          {confirmDelete ? (
            <div className={styles.confirmRow}>
              <span className={styles.confirmText}>Emin misin?</span>
              <button className={styles.confirmYes} onClick={onDelete}>Evet</button>
              <button className={styles.confirmNo} onClick={() => setConfirmDelete(false)}>Hayır</button>
            </div>
          ) : (
            <button
              className={styles.deleteBtn}
              onClick={() => setConfirmDelete(true)}
              aria-label="Görevi sil"
            >
              🗑
            </button>
          )}
        </div>
      </div>

      <div className={styles.goalRow}>
        <span className={styles.goalLabel}>Günlük hedef:</span>
        <span className={styles.goalText}>{task.dailyGoal}</span>
        {!isCompleted && (
          <button
            className={styles.ringBtn}
            onClick={onPressRing}
            aria-label="Halka ekle"
          >
            + Halka
          </button>
        )}
      </div>

      {!isCompleted && (
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default TaskItem;
