import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Имитируем успешный ответ сервера
    const fakeUserData = {
      token: 'fake-jwt-token-123',
      user: {
        id: Date.now(),
        username: username || 'User',
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
      }
    };

    login(fakeUserData); // Сохраняем "вход"
    navigate('/feed');   // Перекидываем в ленту
  };

  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: '0 auto', color: 'white' }}>
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="text" 
          placeholder="Your Username" 
          required 
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #555', background: '#333', color: 'white' }}
          onChange={(e) => setUsername(e.target.value)} 
        />
        <input 
          type="email" 
          placeholder="Email" 
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #555', background: '#333', color: 'white' }}
        />
        <input 
          type="password" 
          placeholder="Password" 
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #555', background: '#333', color: 'white' }}
        />
        <button 
          type="submit" 
          style={{ padding: '12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;