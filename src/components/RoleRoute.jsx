import { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

export default function RoleRoute({ allowedRole, unauthenticatedElement }) {
  const { isAuthenticated, isLoadingAuth, authChecked, authError, user, checkUserAuth } = useAuth();

  useEffect(() => {
    if (!authChecked && !isLoadingAuth) {
      checkUserAuth();
    }
  }, [authChecked, isLoadingAuth, checkUserAuth]);

  if (isLoadingAuth || !authChecked) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-neutral-50">
        <div className="w-8 h-8 border-4 border-neutral-200 border-t-red-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError || !isAuthenticated) {
    return unauthenticatedElement || <Navigate to="/login" replace />;
  }

  if (user.role !== allowedRole) {
    // Allow admins to preview the client portal; otherwise route each role to its home.
    if (user.role === 'admin' && allowedRole === 'client') return <Outlet />;
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'client') return <Navigate to="/portal/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}