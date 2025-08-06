import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HealthPractitionerDashboard } from "@/components/dashboard/HealthPractitionerDashboard";
import { SupplierDashboard } from "@/components/dashboard/SupplierDashboard";
import { DiasporaDashboard } from "@/components/dashboard/DiasporaDashboard";
import { SuperAdminDashboard } from "@/components/dashboard/SuperAdminDashboard";
import { BeneficiaryDashboard } from "@/components/dashboard/BeneficiaryDashboard";
import { Users, Package, Globe, Shield, Heart, ArrowLeft } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth, ROLES } from "@/contexts/AuthContext";

type UserRole = "health_practitioner" | "supplier" | "diaspora" | "super_admin" | "beneficiary";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  // Fixed: Access user.role.name instead of user.role
  const [selectedRole, setSelectedRole] = useState<UserRole>(user?.role?.name as UserRole || "super_admin");

  const roles = [
    // {
    //   id: "super_admin" as UserRole,
    //   title: "Super Admin",
    //   description: "Manage all users, approve adverts, handle requests",
    //   icon: Shield,
    //   color: "bg-red-500"
    // },
    // {
    //   id: "health_practitioner" as UserRole,
    //   title: "Health Practitioner",
    //   description: "Fulfill requests, refer patients, source medications",
    //   icon: Users,
    //   color: "bg-blue-500"
    // },
    // {
    //   id: "supplier" as UserRole,
    //   title: "Supplier",
    //   description: "Respond to requests, advertise products",
    //   icon: Package,
    //   color: "bg-green-500"
    // },
    // {
    //   id: "diaspora" as UserRole,
    //   title: "Diaspora",
    //   description: "Manage beneficiaries, request medications",
    //   icon: Globe,
    //   color: "bg-purple-500"
    // },
    // {
    //   id: "beneficiary" as UserRole,
    //   title: "Beneficiary",
    //   description: "Request medications, place special orders",
    //   icon: Heart,
    //   color: "bg-pink-500"
    // }
  ];

  // Filter roles based on user's actual role for security
  const getAvailableRoles = () => {
    const userRoleName = user?.role?.name;
    
    // Super admin can view all dashboards
    if (userRoleName === ROLES.SUPER_ADMIN) {
      return roles;
    }
    
    // Regular users can only see their own dashboard
    return roles.filter(role => role.id === userRoleName);
  };

  const renderDashboard = () => {
    switch (selectedRole) {
      case "super_admin":
        return <SuperAdminDashboard />;
      case "health_practitioner":
        return <HealthPractitionerDashboard />;
      case "supplier":
        return <SupplierDashboard />;
      case "diaspora":
        return <DiasporaDashboard />;
      case "beneficiary":
        return <BeneficiaryDashboard />;
      default:
        return <SuperAdminDashboard />;
    }
  };

  const handleBackToLanding = () => {
    navigate('/');
  };

  const availableRoles = getAvailableRoles();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-4 pt-5">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={handleBackToLanding}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Cross Shield Dashboard</h1>
            <p className="text-gray-600">
              Welcome back, {user?.fullName}! 
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {user?.role?.name?.replace('_', ' ').toUpperCase()}
              </span>
              {user?.role?.name !== selectedRole && " (Viewing as different role for demo)"}
            </p>
          </div>

          {/* Role Selection - Only show if user has multiple role access (super admin) */}
          {availableRoles.length > 1 ? (
            <div className="grid md:grid-cols-5 gap-6 mb-8">
              {availableRoles.map((role) => {
                const Icon = role.icon;
                return (
                  <Card 
                    key={role.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      selectedRole === role.id ? 'ring-2 ring-blue-500 shadow-lg' : ''
                    }`}
                    onClick={() => setSelectedRole(role.id)}
                  >
                    <CardHeader className="text-center">
                      <div className={`w-16 h-16 ${role.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-xl">{role.title}</CardTitle>
                      <p className="text-sm text-gray-600">{role.description}</p>
                      {selectedRole === role.id && (
                        <Badge className="mt-2 bg-blue-100 text-blue-800">Active</Badge>
                      )}
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          ) : (
            // Show single role card for non-admin users
            <div className="mb-8">
              {availableRoles.map((role) => {
                const Icon = role.icon;
                return (
                  <Card key={role.id} className="max-w-md">
                    <CardHeader className="text-center">
                      <div className={`w-16 h-16 ${role.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-xl">{role.title}</CardTitle>
                      <p className="text-sm text-gray-600">{role.description}</p>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Dashboard Content */}
          <div className="bg-white rounded-lg shadow-sm border">
            {renderDashboard()}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;