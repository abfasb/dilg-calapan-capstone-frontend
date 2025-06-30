import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const [status, setStatus] = useState<
    'checking' | 'allowed' | 'unauthorized' | 'frozen' | 'deleted'
  >('checking');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const verifySession = async () => {
      if (!token) {
        setStatus('unauthorized');
        return;
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/verify-session`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userRole = response.data.role;

        if (!allowedRoles.includes(userRole)) {
          setStatus('unauthorized');
        } else {
          setStatus('allowed');
        }
      } catch (error: any) {
        const reason = error.response?.data?.reason;

        if (reason === 'frozen') {
          setStatus('frozen');
        } else if (reason === 'deleted') {
          setStatus('deleted');
        } else {
          setStatus('unauthorized');
        }
      }
    };

    verifySession();
  }, [allowedRoles, token]);

  if (status === 'checking') return null;
  if (status === 'unauthorized') return <Navigate to="/account/login" replace />;
  if (status === 'frozen') return <Navigate to="/account/frozen" replace />;
  if (status === 'deleted') return <Navigate to="/account/delete" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
