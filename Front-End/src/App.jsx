import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import FeedPage from './pages/FeedPage.jsx';
import PostPage from './pages/PostPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import FollowListPage from './pages/FollowListPage.jsx'; 
import Layout from './components/Layout.jsx';
import AdminRoute from './components/AdminRoute.jsx';  
import AdminPage from './pages/AdminPage.jsx';          

function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<FeedPage />} />
        <Route path="post/:id" element={<PostPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="profile/:type" element={<FollowListPage />} />
      </Route>

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminPage />
          </AdminRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}