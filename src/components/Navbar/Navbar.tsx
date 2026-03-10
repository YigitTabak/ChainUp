import { Link, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, signInWithGoogle, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch {
      // handled by auth state
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        <span className={styles.logoIcon}>⬡</span>
        <span className={styles.logoText}>ChainUp</span>
      </Link>

      <div className={styles.actions}>
        {user ? (
          <>
            <button className={styles.btnPrimary} onClick={() => navigate('/dashboard')}>
              Dashboard
            </button>
            <button className={styles.btnSignOut} onClick={handleSignOut}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Çıkış Yap
            </button>
          </>
        ) : (
          <>
            <button className={styles.btnGhost} onClick={handleSignIn}>
              Giriş Yap
            </button>
            <button className={styles.btnPrimary} onClick={handleSignIn}>
              Kayıt Ol
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
