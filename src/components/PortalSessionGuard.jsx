import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const isSecureRoute = (pathname) =>
  pathname.startsWith('/portal') || pathname.startsWith('/admin');

// Leaving the portal/admin area ends the secure session so the next
// visit forces a fresh sign-in (login screen first).
export default function PortalSessionGuard() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!isSecureRoute(pathname)) {
      sessionStorage.removeItem('portal-session-active');
    }
  }, [pathname]);

  return null;
}