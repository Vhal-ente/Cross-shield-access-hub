
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ManageBeneficiariesForm } from "./components/ManageBeneficiariesForm";
import { RequestMedicationForm } from "./components/RequestMedicationForm";
import { BeneficiariesList } from "./components/BeneficiariesList";
import { Users, Plus, Heart } from "lucide-react";

type ActiveTab = "beneficiaries" | "manage" | "request";

export const DiasporaDashboard = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("beneficiaries");

  const tabs = [
    { id: "beneficiaries" as ActiveTab, label: "My Beneficiaries", icon: Users },
    { id: "manage" as ActiveTab, label: "Add Beneficiary", icon: Plus },
    { id: "request" as ActiveTab, label: "Request for Myself", icon: Heart }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "beneficiaries":
        return <BeneficiariesList />;
      case "manage":
        return <ManageBeneficiariesForm />;
      case "request":
        return <RequestMedicationForm />;
      default:
        return <BeneficiariesList />;
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Diaspora Dashboard</h2>
          <p className="text-gray-600">Manage beneficiaries and request medications</p>
        </div>
        <Badge className="bg-purple-100 text-purple-800">Sub Admin</Badge>
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
