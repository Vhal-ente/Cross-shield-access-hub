// src/components/Navigation.tsx
import React from 'react'; // Add this line
import { useAuth } from '../../contexts/AuthContext'; // Adjust the import path as necessary
import { Link } from 'react-router-dom' // if using React Router
// or import your routing library

export function Navigation() {
  const { user, hasRole, logout } = useAuth()

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8 items-center">
            {/* Logo */}
            <Link to="/dashboard" className="text-xl font-bold">
              CrossShield
            </Link>
            
            {/* Dashboard - Available to all authenticated users */}
            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
              Dashboard
            </Link>
            
            {/* Super Admin Links */}
            {hasRole('super_admin') && (
              <>
                <Link to="/admin/users" className="text-gray-700 hover:text-blue-600">
                  Manage Users
                </Link>
                <Link to="/admin/roles" className="text-gray-700 hover:text-blue-600">
                  Manage Roles
                </Link>
                <Link to="/admin/settings" className="text-gray-700 hover:text-blue-600">
                  System Settings
                </Link>
              </>
            )}
            
            {/* Health Practitioner Links */}
            {hasRole('health_practitioner') && (
              <>
                <Link to="/patients" className="text-gray-700 hover:text-blue-600">
                  Patients
                </Link>
                <Link to="/appointments" className="text-gray-700 hover:text-blue-600">
                  Appointments
                </Link>
              </>
            )}
            
            {/* Supplier Links */}
            {hasRole('supplier') && (
              <>
                <Link to="/inventory" className="text-gray-700 hover:text-blue-600">
                  Inventory
                </Link>
                <Link to="/orders" className="text-gray-700 hover:text-blue-600">
                  Orders
                </Link>
              </>
            )}

            {/* Diaspora Links */}
            {hasRole('diaspora') && (
              <>
                <Link to="/community" className="text-gray-700 hover:text-blue-600">
                  Community
                </Link>
                <Link to="/donations" className="text-gray-700 hover:text-blue-600">
                  Donations
                </Link>
              </>
            )}

            {/* Beneficiary Links */}
            {hasRole('beneficiary') && (
              <>
                <Link to="/services" className="text-gray-700 hover:text-blue-600">
                  Services
                </Link>
                <Link to="/requests" className="text-gray-700 hover:text-blue-600">
                  My Requests
                </Link>
              </>
            )}
          </div>
          
          {/* User Info & Logout */}
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {user?.fullName}</span>
            <button 
              onClick={logout}
              className="text-red-600 hover:text-red-800"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}