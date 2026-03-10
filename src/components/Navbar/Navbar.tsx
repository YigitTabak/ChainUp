import { Link, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch {
      // handled by auth state
    }
  };

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        <span className={styles.logoIcon}>⬡</span>
        <span className={styles.logoText}>ChainUp</span>
      </Link>

      <div className={styles.actions}>
        {user ? (
          <button className={styles.btnPrimary} onClick={() => navigate('/dashboard')}>
            Dashboard
          </button>
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
