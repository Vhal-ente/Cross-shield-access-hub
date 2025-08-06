import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AllRequestsManagement } from "./components/AllRequestsManagement";
import { UsersRolesManagement } from "./components/UsersRolesManagement";
import { AdvertsApproval } from "./components/AdvertsApproval";
import SupplierRequestsManagement from "./components/SupplierRequestsManagement";
import { Shield, Users, CheckCircle, Package } from "lucide-react";

type ActiveTab = "users" | "requests" | "diaspora" | "supplier_requests" | "health";

export const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("users");

  const tabs = [
    { id: "users" as ActiveTab, label: "Users & Roles", icon: Users },
    { id: "requests" as ActiveTab, label: "Medication Requests", icon: Package },
    { id: "diaspora" as ActiveTab, label: "Diaspora Management", icon: CheckCircle },
    { id: "supplier_requests" as ActiveTab, label: "Suppliers Management", icon: Shield },
    { id: "health" as ActiveTab, label: "Health Practitioner", icon: CheckCircle }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "users":
        return <UsersRolesManagement />;
      case "requests":
        return <AllRequestsManagement />;
      case "diaspora":
        return (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
            <CheckCircle className="h-14 w-14 text-purple-400 mb-3" />
            <h3 className="text-base font-semibold text-gray-900 mb-1">Diaspora Management</h3>
            <p className="text-sm text-gray-600">This feature is coming soon. Stay tuned for updates.</p>
          </div>
        );
      case "supplier_requests":
        return <SupplierRequestsManagement />;
      case "health":
        return (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
            <CheckCircle className="h-14 w-14 text-teal-400 mb-3" />
            <h3 className="text-base font-semibold text-gray-900 mb-1">Health Practitioner Management</h3>
            <p className="text-sm text-gray-600">This feature is coming soon. Stay tuned for updates.</p>
          </div>
        );
      default:
        return <UsersRolesManagement />;
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
            Super Admin Dashboard
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Manage users, requests, suppliers and more.
          </p>
        </div>
        <Badge className="bg-red-100 text-red-800 self-start sm:self-auto">Super Admin</Badge>
      </div>

      {/* Tab Navigation for all < md (mobile & tablet) */}
      <div className="block md:hidden space-y-2 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              className={`w-full flex items-center justify-start space-x-3 px-4 py-3 text-sm ${
                activeTab === tab.id ? "bg-black text-white shadow-sm" : "hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{tab.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Desktop Tabs */}
      <div className="hidden md:flex flex-wrap gap-2 bg-gray-100 rounded-lg p-1 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              className={`flex-1 min-w-[140px] max-w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm ${
                activeTab === tab.id ? "bg-black text-white shadow-sm" : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon className="h-4 w-4" />
              <span className="truncate">{tab.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-gray-50 rounded-lg p-4 sm:p-6 overflow-x-auto">
        {renderContent()}
      </div>
    </div>
  );
};
