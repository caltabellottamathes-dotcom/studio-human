import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import OpeningLoader from '@/components/OpeningLoader';
import { AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import ScrollProgress from '@/components/ScrollProgress';
import CustomCursor from '@/components/CustomCursor';
import Home from '@/pages/Home';
import Aanpak from '@/pages/Aanpak';
import Zorgvragen from '@/pages/Zorgvragen';
import Over from '@/pages/Over';
import Contact from '@/pages/Contact';
import StrugglePage from '@/pages/StrugglePage';
import Pricing from '@/pages/Pricing';
import RoleRoute from '@/components/RoleRoute';
import SecureLayout from '@/components/SecureLayout';
import PortalLogin from '@/pages/portal/Login';
import PortalDashboard from '@/pages/portal/Dashboard';
import PortalDocuments from '@/pages/portal/Documents';
import PortalAssignments from '@/pages/portal/Assignments';
import PortalAppointments from '@/pages/portal/Appointments';
import PortalMessages from '@/pages/portal/Messages';
import PortalMood from '@/pages/portal/Mood';
import PortalProfile from '@/pages/portal/Profile';
import PortalInvoices from '@/pages/portal/Invoices';
import AdminLogin from '@/pages/admin/Login';
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminClients from '@/pages/admin/Clients';
import AdminClientDetail from '@/pages/admin/ClientDetail';
import AdminAppointments from '@/pages/admin/Appointments';
import AdminSessionNotes from '@/pages/admin/SessionNotes';
import AdminAssignments from '@/pages/admin/Assignments';
import AdminMessages from '@/pages/admin/Messages';
import AdminSettings from '@/pages/admin/Settings';
import AdminAssessment from '@/pages/admin/Assessment';
import AdminRequests from '@/pages/admin/Requests';
import { useTier } from '@/hooks/useTier';
import LicenseGate from '@/components/LicenseGate';
import { BeeldbankProvider } from '@/lib/beeldbankContext';
import BeeldbankButton from '@/components/beeldbank/BeeldbankButton';
import BeeldbankModal from '@/components/beeldbank/BeeldbankModal';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const { portal: hasPortal, admin: hasAdmin } = useTier();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-neutral-200 border-t-red-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <>
      <ScrollProgress />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/approach" element={<PageTransition><Aanpak /></PageTransition>} />
          <Route path="/concerns" element={<PageTransition><Zorgvragen /></PageTransition>} />
          <Route path="/concerns/:slug" element={<PageTransition><StrugglePage /></PageTransition>} />
          <Route path="/about" element={<PageTransition><Over /></PageTransition>} />
          <Route path="/pricing" element={<PageTransition><Pricing /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
          {hasPortal && <Route path="/portal/login" element={<PortalLogin />} />}
          {hasAdmin && <Route path="/admin/login" element={<AdminLogin />} />}

          {/* Client Portal */}
          {hasPortal && (
            <Route element={<RoleRoute allowedRole="client" unauthenticatedElement={<Navigate to="/portal/login" replace />} />}>
              <Route element={<SecureLayout variant="portal" />}>
                <Route path="/portal" element={<Navigate to="/portal/dashboard" replace />} />
                <Route path="/portal/dashboard" element={<PortalDashboard />} />
                <Route path="/portal/documents" element={<PortalDocuments />} />
                <Route path="/portal/assignments" element={<PortalAssignments />} />
                <Route path="/portal/appointments" element={<PortalAppointments />} />
                <Route path="/portal/messages" element={<PortalMessages />} />
                <Route path="/portal/mood" element={<PortalMood />} />
                <Route path="/portal/invoices" element={<PortalInvoices />} />
                <Route path="/portal/profile" element={<PortalProfile />} />
              </Route>
            </Route>
          )}

          {/* Admin Dashboard */}
          {hasAdmin && (
            <Route element={<RoleRoute allowedRole="admin" unauthenticatedElement={<Navigate to="/admin/login" replace />} />}>
              <Route element={<SecureLayout variant="admin" />}>
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/clients" element={<AdminClients />} />
                <Route path="/admin/clients/:id" element={<AdminClientDetail />} />
                <Route path="/admin/schedule" element={<AdminAppointments />} />
                <Route path="/admin/session-notes" element={<AdminSessionNotes />} />
                <Route path="/admin/assignments" element={<AdminAssignments />} />
                <Route path="/admin/messages" element={<AdminMessages />} />
                <Route path="/admin/requests" element={<AdminRequests />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
                <Route path="/admin/assessment" element={<AdminAssessment />} />
              </Route>
            </Route>
          )}

          <Route path="*" element={<PageTransition><PageNotFound /></PageTransition>} />
        </Routes>
      </AnimatePresence>
      <BeeldbankButton />
      <BeeldbankModal />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <BeeldbankProvider>
            <AuthenticatedApp />
          </BeeldbankProvider>
        </Router>
        <OpeningLoader />
        <CustomCursor />
        <LicenseGate />
        <Toaster />
        </QueryClientProvider>
    </AuthProvider>
  )
}

export default App