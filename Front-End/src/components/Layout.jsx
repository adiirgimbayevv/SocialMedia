// src/components/Layout.jsx
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Layout.module.css';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <nav className={styles.nav}>
        <Link to="/" className={styles.logo}>Echoes</Link>

        {user && (
          <div className={styles.userInfo}>
            <span>@{user.username}</span>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Выйти
            </button>
          </div>
        )}
      </nav>

      <main className={styles.main}>
        <Outlet />
      </main>
    </>
  );
}