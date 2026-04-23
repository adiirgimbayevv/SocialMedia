
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Layout.module.css';

export default function Layout() {
  const { user, logout, getRole } = useAuth();
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
      <Link to="/profile" style={{ color: '#863bff', marginRight: '15px' }}>Профиль</Link>
      <Link to="/profile/following" style={{ color: '#aaa', marginRight: '15px' }}>Подписки</Link>
      <Link to="/profile/followers" style={{ color: '#aaa', marginRight: '20px' }}>Подписчики</Link>

      {getRole() === 'admin' && (
              <Link to="/admin" style={{ color: '#ff9900', marginRight: '20px', fontWeight: 'bold' }}>
                 Админ
              </Link>
            )}
      
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