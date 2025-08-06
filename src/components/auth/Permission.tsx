import React, { ReactNode } from 'react'; // Import React and ReactNode
import { useAuth } from '../../contexts/AuthContext'; // Adjust the path as necessary

interface PermissionGateProps {
    permissions: string[]
    children: ReactNode
    fallback?: ReactNode
  }
  
  export const PermissionGate = ({ 
      permissions, 
      children, 
    fallback = null 
  }: PermissionGateProps) => {
      
      const { hasPermission } = useAuth();
    const hasAllPermissions = permissions.every(permission => 
      hasPermission(permission)
    )
  
    return hasAllPermissions ? <>{children}</> : <>{fallback}</>
  }