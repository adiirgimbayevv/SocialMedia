
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


function AdminRoute({ children }) {
  const { token, getRole } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (getRole() !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;