
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FulfillRequestForm } from "./components/FulfillRequestForm";
import { ReferPatientForm } from "./components/ReferPatientForm";
import { SourceDrugForm } from "./components/SourceDrugForm";
import { RequestsList } from "./components/RequestsList";
import { CheckCircle, UserPlus, Search, List } from "lucide-react";

type ActiveTab = "requests" | "fulfill" | "refer" | "source";

export const HealthPractitionerDashboard = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("requests");

  const tabs = [
    { id: "requests" as ActiveTab, label: "View Requests", icon: List },
    { id: "fulfill" as ActiveTab, label: "Fulfill Request", icon: CheckCircle },
    { id: "refer" as ActiveTab, label: "Refer Patient", icon: UserPlus },
    { id: "source" as ActiveTab, label: "Source Drug", icon: Search }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "requests":
        return <RequestsList />;
      case "fulfill":
        return <FulfillRequestForm />;
      case "refer":
        return <ReferPatientForm />;
      case "source":
        return <SourceDrugForm />;
      default:
        return <RequestsList />;
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Health Practitioner Dashboard</h2>
          <p className="text-gray-600">Manage requests, refer patients, and source medications</p>
        </div>
        <Badge className="bg-blue-100 text-blue-800">Sub Admin</Badge>
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
