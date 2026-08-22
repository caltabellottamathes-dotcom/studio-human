import { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

export default function RoleRoute({ allowedRole, unauthenticatedElement }) {
  const { isAuthenticated, isLoadingAuth, authChecked, authError, user, checkUserAuth, logout } = useAuth();
  // A secure session is only valid for the current visit. Without this flag
  // (set on sign-in, cleared when leaving to the public site) we force a
  // fresh login — the login screen shows first, even if a token lingers.
  const forceLogin = !sessionStorage.getItem('portal-session-active');

  useEffect(() => {
    if (!authChecked && !isLoadingAuth) {
      checkUserAuth();
    }
  }, [authChecked, isLoadingAuth, checkUserAuth]);

  useEffect(() => {
    if (forceLogin && isAuthenticated) {
      logout(false);
    }
  }, [forceLogin, isAuthenticated]);

  if (forceLogin) {
    return unauthenticatedElement || <Navigate to="/login" replace />;
  }

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