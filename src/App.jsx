// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PostProvider } from './context/PostContext';
import UserProvider from './context/UserContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingSpinner from './components/common/LoadingSpinner';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <PostProvider>
          <UserProvider>
            <Router>
              <Navbar />
              <div style={{ minHeight: '80vh', padding: '20px' }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Защищённые маршруты */}
                  <Route 
                    path="/feed" 
                    element={
                      <PrivateRoute>
                        <Feed />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/profile/:id" 
                    element={
                      <PrivateRoute>
                        <Profile />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/post/:id" 
                    element={
                      <PrivateRoute>
                        <PostDetail />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/create" 
                    element={
                      <PrivateRoute>
                        <CreatePost />
                      </PrivateRoute>
                    } 
                  />

                  {/* 404 */}
                  <Route path="*" element={
                    <div style={{ textAlign: 'center', padding: '60px' }}>
                      <h1>404 — Страница не найдена</h1>
                      <p>К сожалению, такой страницы не существует.</p>
                    </div>
                  } />
                </Routes>
              </div>

              <footer style={{ 
                textAlign: 'center', 
                padding: '20px', 
                color: '#888', 
                borderTop: '1px solid #eee' 
              }}>
                © 2026 Echoes Social Network
              </footer>
            </Router>
          </UserProvider>
        </PostProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;