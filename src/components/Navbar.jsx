import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '10px 20px', 
      background: '#333', 
      color: 'white',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
    }}>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}>
          Echoes Social
        </Link>
        <Link to="/feed" style={{ color: 'white', textDecoration: 'none' }}>Feed</Link>
        {isAuthenticated && (
          <Link to="/create" style={{ color: 'white', textDecoration: 'none' }}>Create Post</Link>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {isAuthenticated ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img 
               src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=random`}
                alt="avatar" 
                style={{ width: '35px', height: '35px', borderRadius: '50%', border: '1px solid white' }} 
              />
              <Link 
                to={`/profile/${user?.id}`} 
                style={{ color: '#00d1ff', textDecoration: 'none', fontWeight: '500' }}
              >
                @{user?.username}
              </Link>
            </div>
            <button 
              onClick={handleLogout}
              style={{ 
                background: '#ff4d4d', 
                color: 'white', 
                border: 'none', 
                padding: '5px 12px', 
                borderRadius: '5px', 
                cursor: 'pointer' 
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
            <Link 
              to="/register" 
              style={{ 
                background: '#007bff', 
                padding: '5px 12px', 
                borderRadius: '5px', 
                color: 'white', 
                textDecoration: 'none' 
              }}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;