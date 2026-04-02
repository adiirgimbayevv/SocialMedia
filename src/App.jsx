import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PostProvider } from './context/PostContext';
import UserProvider from './context/UserContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';

function App() {
  return (
    <AuthProvider>
      <PostProvider>
        <UserProvider>
          <Router>
            <Navbar />
            <div style={{ minHeight: '80vh' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                <Route 
                  path="/feed" 
                  element={<PrivateRoute><Feed /></PrivateRoute>} 
                />
                <Route 
                  path="/profile/:id" 
                  element={<PrivateRoute><Profile /></PrivateRoute>} 
                />
                <Route 
                  path="/post/:id" 
                  element={<PrivateRoute><PostDetail /></PrivateRoute>} 
                />
                <Route 
                  path="/create" 
                  element={<PrivateRoute><CreatePost /></PrivateRoute>} 
                />

                {/* 404 Page on English */}
                <Route path="*" element={
                  <div style={{ padding: '20px', textAlign: 'center' }}>
                    <h1>404 - Page Not Found</h1>
                    <p>Oops! The page you are looking for does not exist.</p>
                  </div>
                } />
              </Routes>
            </div>
            <footer style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
              &copy; 2026 Echoes Social Project
            </footer>
          </Router>
        </UserProvider>
      </PostProvider>
    </AuthProvider>
  );
}

export default App;