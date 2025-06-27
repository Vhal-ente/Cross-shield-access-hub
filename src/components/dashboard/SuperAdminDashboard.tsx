
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AllRequestsManagement } from "./components/AllRequestsManagement";
import { UsersRolesManagement } from "./components/UsersRolesManagement";
import { AdvertsApproval } from "./components/AdvertsApproval";
import { SupplierRequestsManagement } from "./components/SupplierRequestsManagement";
import { Shield, Users, CheckCircle, Package } from "lucide-react";

type ActiveTab = "requests" | "users" | "adverts" | "supplier_requests";

export const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("requests");

  const tabs = [
    { id: "requests" as ActiveTab, label: "All Requests", icon: Package },
    { id: "users" as ActiveTab, label: "Users & Roles", icon: Users },
    { id: "adverts" as ActiveTab, label: "Approve Adverts", icon: CheckCircle },
    { id: "supplier_requests" as ActiveTab, label: "Supplier Requests", icon: Shield }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "requests":
        return <AllRequestsManagement />;
      case "users":
        return <UsersRolesManagement />;
      case "adverts":
        return <AdvertsApproval />;
      case "supplier_requests":
        return <SupplierRequestsManagement />;
      default:
        return <AllRequestsManagement />;
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h2>
          <p className="text-gray-600">Manage all users, requests, and approve advertisements</p>
        </div>
        <Badge className="bg-red-100 text-red-800">Super Admin</Badge>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              className={`flex-1 flex items-center justify-center space-x-2 ${
                activeTab === tab.id ? 'bg-black shadow-sm' : ''
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Content */}
      <div className="bg-gray-50 rounded-lg p-6">
        {renderContent()}
      </div>
    </div>
  );
};
