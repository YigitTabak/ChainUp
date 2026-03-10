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
        <div className={styles.logo} onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
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
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        <span>Çıkış Yap</span>
      </button>
    </aside>
  );
};

export default Sidebar;
