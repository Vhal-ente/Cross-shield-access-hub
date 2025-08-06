import { ReactNode } from 'react'
import { useAuth } from '../../contexts/AuthContext' // Adjust the path as necessary
import React from 'react'

interface RoleBasedComponentProps {
  allowedRoles: string[]
  children: ReactNode
  fallback?: ReactNode
}

export const RoleBasedComponent = ({ 
  allowedRoles, 
  children, 
  fallback = null 
}: RoleBasedComponentProps) => {
  const { canAccess } = useAuth()

  return canAccess(allowedRoles) ? <>{children}</> : <>{fallback}</>
}