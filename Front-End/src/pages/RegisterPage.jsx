import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/client.js';
import { useToast } from '../context/ToastContext.jsx';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiClient.post('/auth/register', { username, email, password });
      if (response.status === 201) {
        showToast('Регистрация успешна! Теперь войдите.', 'success');
        navigate('/login');
      }
    } catch (err) {
      showToast(err.response?.data?.error || 'Ошибка при регистрации', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: '50px auto', background: '#222', borderRadius: '10px', color: 'white', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Создать аккаунт</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label>Имя пользователя</label>
          <input type="text" placeholder="Ади" required value={username} onChange={(e) => setUsername(e.target.value)} style={inputStyle} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label>Почта</label>
          <input type="email" placeholder="example@mail.com" required value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label>Пароль</label>
          <input type="password" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
        </div>
        <button type="submit" disabled={loading} style={{ padding: '12px', background: loading ? '#555' : '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '16px', marginTop: '10px' }}>
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
      </form>

      <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
        Уже есть аккаунт? <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>Войдите здесь</Link>
      </p>
    </div>
  );
};

const inputStyle = { padding: '10px', borderRadius: '5px', border: '1px solid #444', background: '#333', color: 'white', outline: 'none' };

export default Register;