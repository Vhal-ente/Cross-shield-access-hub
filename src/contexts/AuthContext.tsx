import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '@/lib/api';

// Updated interfaces to match your new database schema
interface Role {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
  permissions?: Permission[];
}

interface Permission {
  id: number;
  name: string;
  description?: string;
}

interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: Role; // Changed from enum to Role object
  status: 'active' | 'pending' | 'suspended' | 'rejected'; // Added 'rejected'
  location?: string;
  licenseNumber?: string;
  businessName?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<{ message: string; user: User; }>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  
  // New role-based helper methods
  hasRole: (roleName: string) => boolean;
  hasPermission: (permissionName: string) => boolean;
  canAccess: (requiredRoles: string[]) => boolean;
  hasAnyRole: (roleNames: string[]) => boolean;
  getRoleName: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('auth_token');
      const storedUser = apiClient.getCurrentUserFromStorage();

      if (token && storedUser) {
        try {
          // Verify token is still valid
          const response = await apiClient.getCurrentUser();
          setUser({
            ...response.user,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            role: {
              ...response.user.role,
              permissions: response.user.role.permissions?.map((perm: any) => ({
                id: perm.id,
                name: perm.name,
                description: perm.description,
              })) || [],
            },
          });
        } catch (error) {
          console.error('Token validation failed:', error);
          apiClient.clearToken();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('AuthContext login called with:', { email, password: '***' });
      const response = await apiClient.login(email, password);
      console.log('Login response:', response);
  
      // Store the token
      localStorage.setItem('auth_token', response.token);
  
      // Create user object with proper structure
      const userWithTimestamps: User = {
        ...response.user,
        createdAt: response.user.createdAt || new Date().toISOString(),
        updatedAt: response.user.updatedAt || new Date().toISOString(),
        role: response.user.role ? {
          ...response.user.role,
          permissions: response.user.role.permissions?.map((perm: any) => ({
            id: perm.id,
            name: perm.name,
            description: perm.description,
          })) || [],
        } : {
          // Only use default role if no role exists
          id: null,
          name: 'no_role',
          is_active: false,
          permissions: []
        }
      };
  
      setUser(userWithTimestamps);
    } catch (error) {
      console.error('Login failed in AuthContext:', error);
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await apiClient.register(userData);
      // Ensure the user object has createdAt and updatedAt properties
      const userWithTimestamps: User = {
        ...response.user,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        role: {
          ...response.user.role,
          permissions: response.user.role.permissions?.map((perm: any) => ({
            id: perm.id,
            name: perm.name,
            description: perm.description,
          })) || [],
        },
      };
      return { message: response.message, user: userWithTimestamps };
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser: User = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  // New role-based helper methods
  const hasRole = (roleName: string): boolean => {
    return user?.role?.name === roleName;
  };

  const hasPermission = (permissionName: string): boolean => {
    if (!user?.role?.permissions) return false;
    return user.role.permissions.some(permission => 
      permission.name === permissionName
    );
  };

  const canAccess = (requiredRoles: string[]): boolean => {
    if (!user?.role) return false;
    return requiredRoles.includes(user.role.name);
  };

  const hasAnyRole = (roleNames: string[]): boolean => {
    if (!user?.role) return false;
    return roleNames.includes(user.role.name);
  };

  const getRoleName = (): string | null => {
    return user?.role?.name || null;
  };

  // Helper method to check if user is specific role (for backwards compatibility)
  const isRole = (roleName: string): boolean => hasRole(roleName);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user && user.status === 'active',
    isLoading,
    login,
    register,
    logout,
    updateUser,
    hasRole,
    hasPermission,
    canAccess,
    hasAnyRole,
    getRoleName,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Export role constants for easier usage
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  HEALTH_PRACTITIONER: 'health_practitioner',
  SUPPLIER: 'supplier',
  DIASPORA: 'diaspora',
  PATIENT: 'patient',
} as const;

// Export helper components
interface RoleBasedComponentProps {
  allowedRoles: string[];
  children: ReactNode;
  fallback?: ReactNode;
}

export const RoleBasedComponent: React.FC<RoleBasedComponentProps> = ({ 
  allowedRoles, 
  children, 
  fallback = null 
}) => {
  const { canAccess } = useAuth();
  return canAccess(allowedRoles) ? <>{children}</> : <>{fallback}</>;
};

interface PermissionGateProps {
  permissions: string[];
  children: ReactNode;
  fallback?: ReactNode;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({ 
  permissions, 
  children, 
  fallback = null 
}) => {
  const { hasPermission } = useAuth();

  const hasAllPermissions = permissions.every(permission => 
    hasPermission(permission)
  );

  return hasAllPermissions ? <>{children}</> : <>{fallback}</>;
};

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
  requiredPermissions?: string[];
  fallback?: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoles = [], 
  requiredPermissions = [],
  fallback = <div className="p-4 text-center text-red-600">Access Denied</div>
}) => {
  const { user, isLoading, canAccess, hasPermission } = useAuth();

  if (isLoading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (!user) {
    return <div className="p-4 text-center">Please login to access this page</div>;
  }

  if (user.status !== 'active') {
    return <div className="p-4 text-center text-yellow-600">Your account is pending approval</div>;
  }

  // Check roles
  if (requiredRoles.length > 0 && !canAccess(requiredRoles)) {
    return <>{fallback}</>;
  }

  // Check permissions
  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(permission => 
      hasPermission(permission)
    );
    if (!hasAllPermissions) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
};