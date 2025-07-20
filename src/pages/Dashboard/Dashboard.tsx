
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HealthPractitionerDashboard } from "@/components/dashboard/HealthPractitionerDashboard";
import { SupplierDashboard } from "@/components/dashboard/SupplierDashboard";
import { DiasporaDashboard } from "@/components/dashboard/DiasporaDashboard";
import { SuperAdminDashboard } from "@/components/dashboard/SuperAdminDashboard";
import { BeneficiaryDashboard } from "@/components/dashboard/BeneficiaryDashboard";
import { Users, Package, Globe, Shield, Heart } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

type UserRole = "health_practitioner" | "supplier" | "diaspora" | "super_admin" | "beneficiary";

const Dashboard = () => {
  const { user } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>(user?.role || "super_admin");

  const roles = [
    {
      id: "super_admin" as UserRole,
      title: "Super Admin",
      description: "Manage all users, approve adverts, handle requests",
      icon: Shield,
      color: "bg-red-500"
    },
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

  const renderDashboard = () => {
    switch (selectedRole) {
      case "super_admin":
        return <SuperAdminDashboard />;
      // case "health_practitioner":
      //   return <HealthPractitionerDashboard />;
      // case "supplier":
      //   return <SupplierDashboard />;
      // case "diaspora":
      //   return <DiasporaDashboard />;
      // case "beneficiary":
      //   return <BeneficiaryDashboard />;
      default:
        return <SuperAdminDashboard />;
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-4 pt-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Cross Shield Dashboard</h1>
            <p className="text-gray-600">
              Welcome back, {user?.fullName}! 
              {user?.role !== selectedRole && " (Viewing as different role for demo)"}
            </p>
          </div>

          {/* Role Selection */}
          <div className="grid md:grid-cols-5 gap-6 mb-8">
            {roles.map((role) => {
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
