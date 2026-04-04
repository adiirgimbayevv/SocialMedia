// src/pages/ProfilePage.jsx
import { useState, useEffect, useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import * as userApi from '../api/users';

const ProfilePage = () => {
  const { user, login } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await userApi.updateProfile({ username, email });
      
      // Обновляем данные в AuthContext
      login(localStorage.getItem('token'), res.data.user);
      
      setMessage('Профиль успешно обновлён!');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Ошибка обновления профиля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '30px', background: '#1a1a1a', borderRadius: '16px' }}>
      <h2>Редактировать профиль</h2>
      
      {message && <p style={{ color: message.includes('успешно') ? '#4ade80' : '#ff4d4d' }}>{message}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginTop: '20px' }}>
        <div>
          <label>Имя пользователя</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#222', color: 'white', border: '1px solid #444' }}
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#222', color: 'white', border: '1px solid #444' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '14px',
            background: loading ? '#555' : '#863bff',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '16px',
            marginTop: '10px'
          }}
        >
          {loading ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;