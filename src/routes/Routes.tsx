// routes/AppRoutes.tsx
import React from 'react'; // Import React
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import LandingPage from '../pages/LandingPage';
import Dashboard from "../pages/Dashboard/Dashboard";
import NotFound from "../pages/NotFound";
import DiasporaForm from "../pages/DiasporaForm";
import SupplierForm from "../pages/SupplierForm";
import HealthcareForm from "../pages/HealthcareForm";
import MedicationForm from "../pages/MedicationForm";
// import { LoginForm } from "../components/auth/LoginForm"; 
import TermsAndCondition from "@/pages/terms";
import PrivacyPolicy from "@/pages/privacy";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      {/* <Route path="/login" element={<LoginForm />} /> */}
      
      {/* Registration forms - Public but could be role-specific */}
      <Route path="/diaspora-form" element={<DiasporaForm />} />
      <Route path="/supplier-form" element={<SupplierForm />} />
      <Route path="/healthcare-form" element={<HealthcareForm />} />
      <Route path="/terms" element={<TermsAndCondition />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      
      {/* Protected routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Medication form - Only for specific roles */}
      <Route 
        path="/medication-form" 
        element={
            <MedicationForm />
          // <ProtectedRoute requiredRoles={['health_practitioner', 'supplier', 'super_admin']}>
          // </ProtectedRoute>
        } 
      />

      {/* Admin routes */}
      <Route 
        path="/admin/" 
        element={
          <ProtectedRoute requiredRoles={['super_admin']}>
            <AdminRoutes />
          </ProtectedRoute>
        } 
      />

      {/* Health Practitioner specific routes */}
      <Route 
        path="/patients" 
        element={
          <ProtectedRoute requiredRoles={['health_practitioner', 'super_admin']}>
            <PatientsPage />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/appointments" 
        element={
          <ProtectedRoute requiredRoles={['health_practitioner', 'super_admin']}>
            <AppointmentsPage />
          </ProtectedRoute>
        } 
      />

      {/* Supplier specific routes */}
      <Route 
        path="/inventory" 
        element={
          <ProtectedRoute requiredRoles={['supplier', 'super_admin']}>
            <InventoryPage />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/orders" 
        element={
          <ProtectedRoute requiredRoles={['supplier', 'super_admin']}>
            <OrdersPage />
          </ProtectedRoute>
        } 
      />

      {/* Diaspora specific routes */}
      <Route 
        path="/community" 
        element={
          <ProtectedRoute requiredRoles={['diaspora', 'super_admin']}>
            <CommunityPage />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/support-requests" 
        element={
          <ProtectedRoute requiredRoles={['diaspora', 'super_admin']}>
            <SupportRequestsPage />
          </ProtectedRoute>
        } 
      />

      {/* Beneficiary specific routes */}
      <Route 
        path="/services" 
        element={
          <ProtectedRoute requiredRoles={['beneficiary', 'super_admin']}>
            <ServicesPage />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/my-requests" 
        element={
          <ProtectedRoute requiredRoles={['beneficiary', 'super_admin']}>
            <MyRequestsPage />
          </ProtectedRoute>
        } 
      />

      {/* Profile routes - All authenticated users */}
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        } 
      />

      {/* 404 - Must be last */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// Admin sub-routes
const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/users" element={<AdminUsersPage />} />
      <Route path="/roles" element={<AdminRolesPage />} />
      <Route path="/permissions" element={<AdminPermissionsPage />} />
      <Route path="/analytics" element={<AdminAnalyticsPage />} />
      <Route path="/system-settings" element={<AdminSystemSettingsPage />} />
      <Route path="/" element={<AdminDashboard />} />
    </Routes>
  );
};

// Placeholder components (replace with your actual components)
const PatientsPage = () => <div>Patients Management</div>;
const AppointmentsPage = () => <div>Appointments</div>;
const InventoryPage = () => <div>Inventory Management</div>;
const OrdersPage = () => <div>Orders</div>;
const CommunityPage = () => <div>Community</div>;
const SupportRequestsPage = () => <div>Support Requests</div>;
const ServicesPage = () => <div>Services</div>;
const MyRequestsPage = () => <div>My Requests</div>;
const ProfilePage = () => <div>Profile</div>;
const SettingsPage = () => <div>Settings</div>;
const AdminDashboard = () => <div>Admin Dashboard</div>;
const AdminUsersPage = () => <div>Admin - Users</div>;
const AdminRolesPage = () => <div>Admin - Roles</div>;
const AdminPermissionsPage = () => <div>Admin - Permissions</div>;
const AdminAnalyticsPage = () => <div>Admin - Analytics</div>;
const AdminSystemSettingsPage = () => <div>Admin - System Settings</div>;

export default AppRoutes;