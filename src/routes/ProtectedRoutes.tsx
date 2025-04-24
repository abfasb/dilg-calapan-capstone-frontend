import { Navigate, Outlet } from 'react-router-dom';
import UnAuthorizedPage from '../pages/authentication/UnAuthorizedPage';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/account/login" replace />;
  }

  if (!allowedRoles.includes(role || '')) {
    return <UnAuthorizedPage />;
  }

  return <Outlet />;
};

export default ProtectedRoute;