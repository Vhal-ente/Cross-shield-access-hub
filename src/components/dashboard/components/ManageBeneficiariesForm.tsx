
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export const ManageBeneficiariesForm = () => {
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [beneficiaryPhone, setBeneficiaryPhone] = useState("");
  const [beneficiaryMedication, setBeneficiaryMedication] = useState("");
  const [beneficiaryLocation, setBeneficiaryLocation] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!beneficiaryName || !beneficiaryPhone || !beneficiaryMedication || !beneficiaryLocation) {
      toast.error("Please fill in all required fields");
      return;
    }

    toast.success("Beneficiary added successfully!");
    
    // Reset form
    setBeneficiaryName("");
    setBeneficiaryPhone("");
    setBeneficiaryMedication("");
    setBeneficiaryLocation("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Beneficiary</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="beneficiaryName">Name of Beneficiary *</Label>
            <Input
              id="beneficiaryName"
              value={beneficiaryName}
              onChange={(e) => setBeneficiaryName(e.target.value)}
              placeholder="Enter beneficiary name"
              required
            />
          </div>

          <div>
            <Label htmlFor="beneficiaryPhone">Beneficiary Contact Phone *</Label>
            <Input
              id="beneficiaryPhone"
              value={beneficiaryPhone}
              onChange={(e) => setBeneficiaryPhone(e.target.value)}
              placeholder="Enter phone number"
              required
            />
          </div>

          <div>
            <Label htmlFor="beneficiaryMedication">Beneficiary Medication *</Label>
            <Input
              id="beneficiaryMedication"
              value={beneficiaryMedication}
              onChange={(e) => setBeneficiaryMedication(e.target.value)}
              placeholder="Enter medication details"
              required
            />
          </div>

          <div>
            <Label htmlFor="beneficiaryLocation">Beneficiary Location *</Label>
            <Input
              id="beneficiaryLocation"
              value={beneficiaryLocation}
              onChange={(e) => setBeneficiaryLocation(e.target.value)}
              placeholder="Enter location"
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Add Beneficiary
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
