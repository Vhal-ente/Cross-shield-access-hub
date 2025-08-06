import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from './AuthModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[]; // Changed from requiredRole to requiredRoles (plural)
  requiredPermissions?: string[]; // Added permission support
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoles = [], // Default to empty array
  requiredPermissions = [], // Default to empty array
  fallback 
}) => {
  const token = localStorage.getItem('auth_token');
  const { isAuthenticated, user, isLoading, canAccess, hasPermission } = useAuth();
  const [showAuthModal, setShowAuthModal] = React.useState(false);

  if (!token) {
    return;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <>
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-6">Please login to access this page</p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Login
            </button>
          </div>
        </div>
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </>
    );
  }

  if (user?.status !== 'active') {
    const statusMessages = {
      pending: "Your account is pending approval from an administrator.",
      suspended: "Your account has been suspended. Please contact support.",
      rejected: "Your account application has been rejected. Please contact support."
    };

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Account Access Restricted</h2>
          <p className="text-gray-600">
            {statusMessages[user?.status as keyof typeof statusMessages] || 
             "There's an issue with your account. Please contact support."}
          </p>
        </div>
      </div>
    );
  }

  // Check role requirements - Updated for new role system
  if (requiredRoles.length > 0 && user && !canAccess(requiredRoles)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-2">
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-gray-500">
            Required role(s): {requiredRoles.join(', ')}
          </p>
          <p className="text-sm text-gray-500">
            Your role: {user.role.name}
          </p>
        </div>
      </div>
    );
  }

  // Check permission requirements - New feature
  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(permission => 
      hasPermission(permission)
    );
    
    if (!hasAllPermissions) {
      const missingPermissions = requiredPermissions.filter(permission => 
        !hasPermission(permission)
      );

      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Insufficient Permissions</h2>
            <p className="text-gray-600 mb-2">
              You don't have the required permissions to access this page.
            </p>
            <p className="text-sm text-gray-500">
              Missing permissions: {missingPermissions.join(', ')}
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};