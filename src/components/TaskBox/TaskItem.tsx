import React, { useState } from 'react';
import styles from './TaskItem.module.css';
import type { Task } from '../../types';
import ConfirmModal from '../ConfirmModal/ConfirmModal';

interface Props {
  task: Task;
  isCompleted: boolean;
  onPressRing: () => void;
  onDelete: () => void;
}

const TaskItem: React.FC<Props> = ({ task, isCompleted, onPressRing, onDelete }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const progress = Math.min(100, Math.round((task.completedRings / task.duration) * 100));
  const ringsLeft = Math.max(0, task.duration - task.completedRings);

  return (
    <div className={`${styles.taskItem} ${isCompleted ? styles.completedTask : ''}`}>
      <ConfirmModal
        isOpen={confirmDelete}
        title="Görevi silmek istiyor musun?"
        description="Bu işlem geri alınamaz."
        onConfirm={() => { onDelete(); setConfirmDelete(false); }}
        onCancel={() => setConfirmDelete(false)}
      />
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <span className={styles.taskTitle}>{task.title}</span>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.daysLeft}>
            {isCompleted ? 'Tamamlandı' : `${ringsLeft} halka kaldı`}
          </span>
          <button
            className={styles.deleteBtn}
            onClick={() => setConfirmDelete(true)}
            aria-label="Görevi sil"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.goalRow}>
        <div className={styles.goalInfo}>
          <span className={styles.goalLabel}>Günlük hedef:</span>
          <span className={styles.goalText}>{task.dailyGoal}</span>
        </div>
        {!isCompleted && (
          <button
            className={styles.ringBtn}
            onClick={onPressRing}
            aria-label="Yapıldı"
          >
            Yapıldı
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
