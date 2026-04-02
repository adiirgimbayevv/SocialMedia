// src/components/PrivateRoute.jsx
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Этот компонент пускает внутрь только залогиненных пользователей
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);

  // Если не залогинен — отправляем на страницу логина
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Если залогинен — показываем контент
  return children;
};

export default PrivateRoute;