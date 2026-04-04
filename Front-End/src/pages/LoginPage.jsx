import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';   // ← ИСПРАВЛЕНО: используем useAuth

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();        // ← используем хук useAuth
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      
      if (response.data.token) {
        login(response.data.token, response.data.user);
        navigate('/');
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Ошибка входа. Проверь email и пароль.');
    }
  };

  return (
    <div style={{ 
      padding: '40px', 
      maxWidth: '400px', 
      margin: '80px auto', 
      background: '#1a1a1a', 
      borderRadius: '12px',
      color: 'white',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Вход в Echoes</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          style={inputStyle}
        />
        <input 
          type="password" 
          placeholder="Пароль" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={inputStyle}
        />
        <button 
          type="submit"
          style={{
            padding: '14px',
            background: '#863bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Войти
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '25px' }}>
        Нет аккаунта? <Link to="/register" style={{ color: '#863bff' }}>Зарегистрироваться</Link>
      </p>
    </div>
  );
};

const inputStyle = {
  padding: '12px 14px',
  borderRadius: '8px',
  border: '1px solid #444',
  background: '#222',
  color: 'white',
  fontSize: '16px'
};

export default LoginPage;