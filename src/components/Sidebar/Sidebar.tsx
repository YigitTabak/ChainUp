import { NavLink, useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { useAuth } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';

const Sidebar = () => {
  const { signOut } = useAuth();
  const { letters } = useAppContext();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const letterHasNotification = letters.some((l) => l.isUnlocked);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.top}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>⬡</span>
          <span className={styles.logoText}>ChainUp</span>
        </div>

        <nav className={styles.nav}>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
          >
            <span className={styles.icon}>◉</span>
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/history"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
          >
            <span className={styles.icon}>◷</span>
            <span>Geçmiş</span>
          </NavLink>

          <NavLink
            to="/letter"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
          >
            <span className={styles.icon}>✉</span>
            <span>Mektup</span>
            {letterHasNotification && (
              <span className={styles.badge}>★</span>
            )}
          </NavLink>
        </nav>
      </div>

      <button className={styles.signOut} onClick={handleSignOut}>
        <span>↩</span>
        <span>Çıkış</span>
      </button>
    </aside>
  );
};

export default Sidebar;
