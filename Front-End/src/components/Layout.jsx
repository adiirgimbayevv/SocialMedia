import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Modal from './Modal';
import styles from './Layout.module.css';

export default function Layout() {
  const { user, logout, getRole } = useAuth();
  const navigate = useNavigate();

  // Состояние модалки выхода
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Подтвердили выход
  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Модалка подтверждения выхода */}
      {showLogoutModal && (
        <Modal
          message="Вы уверены, что хотите выйти?"
          onConfirm={handleLogoutConfirm}
          onCancel={() => setShowLogoutModal(false)}
          confirmText='Log out'
        />
      )}

      <nav className={styles.nav}>
        <Link to="/" className={styles.logo}>Echoes</Link>

        {user && (
          <div className={styles.userInfo}>
            <Link to="/profile" style={{ color: '#863bff', marginRight: '15px' }}>Профиль</Link>
            <Link to="/profile/following" style={{ color: '#aaa', marginRight: '15px' }}>Подписки</Link>
            <Link to="/profile/followers" style={{ color: '#aaa', marginRight: '20px' }}>Подписчики</Link>

            {getRole() === 'admin' && (
              <Link to="/admin" style={{ color: '#ff9900', marginRight: '20px', fontWeight: 'bold' }}>
                ⚙️ Админ
              </Link>
            )}

            <span>@{user.username}</span>
            {/* 👇 Теперь кнопка открывает модалку, а не сразу выходит */}
            <button onClick={() => setShowLogoutModal(true)} className={styles.logoutBtn}>
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