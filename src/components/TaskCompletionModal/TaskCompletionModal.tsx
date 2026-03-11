import { useEffect, useState } from 'react';
import styles from './TaskCompletionModal.module.css';
import Confetti from '../Confetti/Confetti';
import type { Task } from '../../types';

interface Props {
  task: Task | null;
  onClose: () => void;
}

const TaskCompletionModal = ({ task, onClose }: Props) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (task) {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(t);
    }
  }, [task]);

  if (!task) return null;

  return (
    <>
      <Confetti active={showConfetti} />
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.trophy}>🏆</div>
          <h2 className={styles.title}>Tebrikler!</h2>
          <p className={styles.desc}>
            <strong>"{task.title}"</strong> görevini tamamladın.
          </p>
          <p className={styles.sub}>
            {task.duration} günlük bir yolculuğu başarıyla atlattın.
          </p>
          <button className={styles.closeBtn} onClick={onClose}>
            Devam Et →
          </button>
        </div>
      </div>
    </>
  );
};

export default TaskCompletionModal;
