import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";

// Contexts
import { AuthProvider } from "./context/AuthContext";
import { ApplicationProvider } from "./context/ApplicationContext";

// Auth Pages
import ApplicantLoginPage from "./pages/Auth/ApplicantLoginPage";
import StaffLoginPage from "./pages/Auth/StaffLoginPage";

// Applicant Pages
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import SavedApplicationsPage from "./pages/SavedApplicationsPage";
import NotificationsPage from "./pages/NotificationsPage";
import PaymentStatusPage from "./pages/PaymentStatusPage";
import ProfilePage from "./pages/ProfilePage";

// Application Form Pages
import PersonalDetailsPage from "./pages/PersonalDetailsPage";
import DocumentUploadPage from "./pages/DocumentUploadPage";
import ConsentPrivacyPage from "./pages/ConsentPrivacyPage";
import SubmissionConfirmationPage from "./pages/SubmissionConfirmationPage";

// SuperAdmin Pages
import AdminDashboardPage    from "./pages/admin/AdminDashboardPage";
import UserManagementPage    from "./pages/admin/UserManagementPage";
import AdminApplicationsPage from "./pages/admin/AdminApplicationsPage";
import SystemSettingsPage    from "./pages/admin/SystemSettingsPage";

// HO Pages
import HODashboardPage         from "./pages/ho/HODashboardPage";
import HOApplicationsPage      from "./pages/ho/HOApplicationsPage";
import HOApplicationDetailPage from "./pages/ho/HOApplicationDetailPage";
import HOSearchPage            from "./pages/ho/HOSearchPage";

// Inspector Pages
import InspectorDashboardPage         from "./pages/inspector/InspectorDashboardPage";
import InspectorApplicationsPage      from "./pages/inspector/InspectorApplicationsPage";
import InspectorApplicationDetailPage from "./pages/inspector/InspectorApplicationDetailPage";

// Supervisor Pages
import SupervisorDashboardPage         from "./pages/supervisor/SupervisorDashboardPage";
import SupervisorApplicationsPage      from "./pages/supervisor/SupervisorApplicationsPage";
import SupervisorApplicationDetailPage from "./pages/supervisor/SupervisorApplicationDetailPage";

// Global Styles
import "./styles/globals.css";

const App = () => (
  <Router>
    <AuthProvider>
      <ApplicationProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3500,
            style: {
              fontFamily: "var(--font-sans)",
              fontSize: "0.875rem",
              borderRadius: "var(--radius-md)",
              maxWidth: "360px",
            },
          }}
        />
        <Routes>

          {/* ── PUBLIC ROUTES ─────────────────────────────── */}
          <Route path="/"            element={<ApplicantLoginPage />} />
          <Route path="/staff/login" element={<StaffLoginPage />} />

          {/* ── APPLICANT PROTECTED ROUTES ────────────────── */}
          <Route path="/ApplicantLandingPage" element={
            <ProtectedRoute allowedRoles={['APPLICANT']}>
              <LandingPage />
            </ProtectedRoute>
          } />

          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['APPLICANT']}>
              <DashboardPage />
            </ProtectedRoute>
          } />

          <Route path="/applications" element={
            <ProtectedRoute allowedRoles={['APPLICANT']}>
              <SavedApplicationsPage />
            </ProtectedRoute>
          } />

          <Route path="/notifications" element={
            <ProtectedRoute allowedRoles={['APPLICANT']}>
              <NotificationsPage />
            </ProtectedRoute>
          } />

          <Route path="/payment-status" element={
            <ProtectedRoute allowedRoles={['APPLICANT']}>
              <PaymentStatusPage />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['APPLICANT']}>
              <ProfilePage />
            </ProtectedRoute>
          } />

          {/* ── APPLICATION FORM (APPLICANT ONLY) ─────────── */}
          <Route path="/apply/personal" element={
            <ProtectedRoute allowedRoles={['APPLICANT']}>
              <PersonalDetailsPage />
            </ProtectedRoute>
          } />

          <Route path="/apply/documents" element={
            <ProtectedRoute allowedRoles={['APPLICANT']}>
              <DocumentUploadPage />
            </ProtectedRoute>
          } />

          <Route path="/apply/consent" element={
            <ProtectedRoute allowedRoles={['APPLICANT']}>
              <ConsentPrivacyPage />
            </ProtectedRoute>
          } />

          <Route path="/apply/confirmation" element={
            <ProtectedRoute allowedRoles={['APPLICANT']}>
              <SubmissionConfirmationPage />
            </ProtectedRoute>
          } />

          {/* ── SUPERADMIN ROUTES ─────────────────────────── */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['SUPERADMIN']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          } />

          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['SUPERADMIN']}>
              <UserManagementPage />
            </ProtectedRoute>
          } />

          <Route path="/admin/applications" element={
            <ProtectedRoute allowedRoles={['SUPERADMIN']}>
              <AdminApplicationsPage />
            </ProtectedRoute>
          } />

          <Route path="/admin/settings" element={
            <ProtectedRoute allowedRoles={['SUPERADMIN']}>
              <SystemSettingsPage />
            </ProtectedRoute>
          } />

          {/* ── HEAD OFFICE ROUTES ────────────────────────── */}
          <Route path="/headoffice/dashboard" element={
            <ProtectedRoute allowedRoles={['HO']}>
              <HODashboardPage />
            </ProtectedRoute>
          } />

          <Route path="/headoffice/applications" element={
            <ProtectedRoute allowedRoles={['HO']}>
              <HOApplicationsPage />
            </ProtectedRoute>
          } />

          <Route path="/headoffice/applications/:applicationId" element={
            <ProtectedRoute allowedRoles={['HO']}>
              <HOApplicationDetailPage />
            </ProtectedRoute>
          } />

          <Route path="/headoffice/search" element={
            <ProtectedRoute allowedRoles={['HO']}>
              <HOSearchPage />
            </ProtectedRoute>
          } />

          {/* ── INSPECTOR ROUTES ──────────────────────────── */}
          <Route path="/inspector/dashboard" element={
            <ProtectedRoute allowedRoles={['INSPECTOR']}>
              <InspectorDashboardPage />
            </ProtectedRoute>
          } />

          <Route path="/inspector/applications" element={
            <ProtectedRoute allowedRoles={['INSPECTOR']}>
              <InspectorApplicationsPage />
            </ProtectedRoute>
          } />

          <Route path="/inspector/applications/:applicationId" element={
            <ProtectedRoute allowedRoles={['INSPECTOR']}>
              <InspectorApplicationDetailPage />
            </ProtectedRoute>
          } />

          {/* ── SUPERVISOR ROUTES ─────────────────────────── */}
          <Route path="/supervisor/dashboard" element={
            <ProtectedRoute allowedRoles={['SUPERVISOR']}>
              <SupervisorDashboardPage />
            </ProtectedRoute>
          } />

          <Route path="/supervisor/applications" element={
            <ProtectedRoute allowedRoles={['SUPERVISOR']}>
              <SupervisorApplicationsPage />
            </ProtectedRoute>
          } />

          <Route path="/supervisor/applications/:applicationId" element={
            <ProtectedRoute allowedRoles={['SUPERVISOR']}>
              <SupervisorApplicationDetailPage />
            </ProtectedRoute>
          } />

          {/* ── FALLBACK ──────────────────────────────────── */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </ApplicationProvider>
    </AuthProvider>
  </Router>
);

export default App;
