
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BeneficiaryRequestForm } from "./components/BeneficiaryRequestForm";
import { SpecialOrderForm } from "./components/SpecialOrderForm";
import { MyRequestsHistory } from "./components/MyRequestsHistory";
import { Package, Plus, History } from "lucide-react";

type ActiveTab = "request" | "special_order" | "history";

export const BeneficiaryDashboard = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("request");

  const tabs = [
    { id: "request" as ActiveTab, label: "Request Medication", icon: Package },
    { id: "special_order" as ActiveTab, label: "Special Orders", icon: Plus },
    { id: "history" as ActiveTab, label: "My Requests", icon: History }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "request":
        return <BeneficiaryRequestForm />;
      case "special_order":
        return <SpecialOrderForm />;
      case "history":
        return <MyRequestsHistory />;
      default:
        return <BeneficiaryRequestForm />;
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Beneficiary Dashboard</h2>
          <p className="text-gray-600">Request medications and place special orders</p>
        </div>
        <Badge className="bg-pink-100 text-pink-800">Beneficiary</Badge>
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
