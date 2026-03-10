import styles from './Dashboard.module.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import TaskBox from '../../components/TaskBox/TaskBox';
import Chain from '../../components/Chain/Chain';
import TaskCompletionModal from '../../components/TaskCompletionModal/TaskCompletionModal';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { profile } = useAuth();
  const { tasks, celebratingTaskId, clearCelebration } = useAppContext();

  const celebratingTask = tasks.find((t) => t.id === celebratingTaskId) ?? null;

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Günaydın';
    if (hour < 18) return 'İyi günler';
    return 'İyi akşamlar';
  };

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <div className={styles.welcome}>
          <span className={styles.greet}>
            {greeting()}, {profile?.displayName?.split(' ')[0] ?? 'sen'} 👋
          </span>
          <p className={styles.welcomeText}>Bugün ne tamamlayacaksın?</p>
        </div>

        <div className={styles.content}>
          <div className={styles.taskArea}>
            <TaskBox />
          </div>
          <div className={styles.chainArea}>
            <Chain />
          </div>
        </div>
      </main>

      <TaskCompletionModal task={celebratingTask} onClose={clearCelebration} />
    </div>
  );
};

export default Dashboard;
