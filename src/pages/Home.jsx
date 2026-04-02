// src/pages/Home.jsx
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Feed</h1>
      <nav style={{ marginBottom: '20px' }}>
        <Link to="/" style={{ marginRight: '10px' }}>Home</Link> | 
        <Link to="/cart" style={{ marginLeft: '10px', marginRight: '10px' }}>Profile (Protected)</Link> |
        {isAuthenticated ? (
          <button onClick={logout} style={{ marginLeft: '10px' }}>Logout</button>
        ) : (
          <>
            <Link to="/login" style={{ marginLeft: '10px', marginRight: '10px' }}>Sign In</Link> |
            <Link to="/register" style={{ marginLeft: '10px' }}>Sign Up</Link>
          </>
        )}
      </nav>

      {isAuthenticated ? (
        <p>Welcome back! You are successfully logged in.</p>
      ) : (
        <p>Please sign in or create an account to see more.</p>
      )}
    </div>
  );
};

export default Home;