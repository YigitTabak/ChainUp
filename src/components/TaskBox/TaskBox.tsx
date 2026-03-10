import { useState } from 'react';
import styles from './TaskBox.module.css';
import TaskItem from './TaskItem';
import AddTaskModal from './AddTaskModal';
import { useAppContext } from '../../context/AppContext';

const MAX_TASKS = 3;

const TaskBox = () => {
  const { activeTasks, pressRing, deleteTask } = useAppContext();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className={styles.taskBox}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Görevler</h1>
          <p className={styles.subtitle}>
            Bugün neler yapacaksın?
          </p>
        </div>
        {activeTasks.length < MAX_TASKS && (
          <button className={styles.addBtn} onClick={() => setShowModal(true)}>
            + Görev Ekle
          </button>
        )}
      </div>

      {activeTasks.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>◎</div>
          <p className={styles.emptyTitle}>Henüz görev yok</p>
          <p className={styles.emptyDesc}>İlk görevini ekleyerek zincirini başlat.</p>
          <button className={styles.emptyBtn} onClick={() => setShowModal(true)}>
            Görev Ekle
          </button>
        </div>
      ) : (
        <div className={styles.taskList}>
          {activeTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              isCompleted={task.isCompleted}
              onPressRing={() => pressRing(task.id)}
              onDelete={() => deleteTask(task.id)}
            />
          ))}
          {activeTasks.length < MAX_TASKS && (
            <button className={styles.addInlineBtn} onClick={() => setShowModal(true)}>
              <span>+</span>
              <span>Yeni görev ekle ({MAX_TASKS - activeTasks.length} slot boş)</span>
            </button>
          )}
        </div>
      )}

      {showModal && (
        <AddTaskModal
          onClose={() => setShowModal(false)}
          existingCount={activeTasks.length}
        />
      )}
    </div>
  );
};

export default TaskBox;
