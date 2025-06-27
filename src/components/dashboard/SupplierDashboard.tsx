
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RespondToRequestForm } from "./components/RespondToRequestForm";
import { AdvertiseProductForm } from "./components/AdvertiseProductForm";
import { ProductsList } from "./components/ProductsList";
import { RequestsList } from "./components/RequestsList";
import { CheckCircle, Megaphone, Package } from "lucide-react";

type ActiveTab = "requests" | "respond" | "advertise" | "products";

export const SupplierDashboard = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("requests");

  const tabs = [
    { id: "requests" as ActiveTab, label: "Incoming Requests", icon: Package },
    { id: "respond" as ActiveTab, label: "Respond to Request", icon: CheckCircle },
    { id: "advertise" as ActiveTab, label: "Advertise Product", icon: Megaphone },
    { id: "products" as ActiveTab, label: "My Products", icon: Package }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "requests":
        return <RequestsList />;
      case "respond":
        return <RespondToRequestForm />;
      case "advertise":
        return <AdvertiseProductForm />;
      case "products":
        return <ProductsList />;
      default:
        return <RequestsList />;
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Supplier Dashboard</h2>
          <p className="text-gray-600">Respond to requests and manage your product catalog</p>
        </div>
        <Badge className="bg-green-100 text-green-800">Sub Admin</Badge>
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
