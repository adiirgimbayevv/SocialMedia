import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/client.js';
const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Отправляем POST запрос на /auth/register (как в их бэкенде)
      const response = await apiClient.post('/auth/register', {
        username,
        email,
        password
      });

      if (response.status === 201) {
        alert('Регистрация успешна! Теперь войдите в аккаунт.');
        // После регистрации кидаем на страницу логина
        navigate('/login');
      }
    } catch (err) {
      // Выводим ошибку от бэкенда (например: "not unique email")
      const errorMsg = err.response?.data?.error || 'Ошибка при регистрации';
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '40px', 
      maxWidth: '400px', 
      margin: '50px auto', 
      background: '#222', // Темная тема, как ты любишь
      borderRadius: '10px',
      color: 'white',
      boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Create Account</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label>Username</label>
          <input 
            type="text" 
            placeholder="Ivan_Ivanov" 
            required 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label>Email</label>
          <input 
            type="email" 
            placeholder="example@mail.com" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label>Password</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            padding: '12px', 
            background: loading ? '#555' : '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            marginTop: '10px',
            transition: 'background 0.3s'
          }}
        >
          {loading ? 'Registering...' : 'Sign Up'}
        </button>
      </form>

      <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
        Already have an account? <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>Login here</Link>
      </p>
    </div>
  );
};

// Стили для инпутов, чтобы код был чище
const inputStyle = {
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #444',
  background: '#333',
  color: 'white',
  outline: 'none'
};

export default Register;