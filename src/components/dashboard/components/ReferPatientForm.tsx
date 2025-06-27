
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export const ReferPatientForm = () => {
  const [patientData, setPatientData] = useState({
    name: "",
    phone: "",
    email: "",
    address: ""
  });
  
  const [medicationData, setMedicationData] = useState({
    name: "",
    dosage: "",
    frequency: "",
    duration: "",
    notes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!patientData.name || !patientData.phone || !medicationData.name) {
      toast.error("Please fill in required fields");
      return;
    }

    toast.success("Patient referred successfully! You'll receive 30% of the profit.");
    
    // Reset form
    setPatientData({ name: "", phone: "", email: "", address: "" });
    setMedicationData({ name: "", dosage: "", frequency: "", duration: "", notes: "" });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Refer a Patient (Get 30% Profit)</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Data */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Patient Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patientName">Patient Name *</Label>
                <Input
                  id="patientName"
                  value={patientData.name}
                  onChange={(e) => setPatientData({...patientData, name: e.target.value})}
                  placeholder="Enter patient name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="patientPhone">Phone Number *</Label>
                <Input
                  id="patientPhone"
                  value={patientData.phone}
                  onChange={(e) => setPatientData({...patientData, phone: e.target.value})}
                  placeholder="Enter phone number"
                  required
                />
              </div>
              <div>
                <Label htmlFor="patientEmail">Email</Label>
                <Input
                  id="patientEmail"
                  type="email"
                  value={patientData.email}
                  onChange={(e) => setPatientData({...patientData, email: e.target.value})}
                  placeholder="Enter email"
                />
              </div>
              <div>
                <Label htmlFor="patientAddress">Address</Label>
                <Input
                  id="patientAddress"
                  value={patientData.address}
                  onChange={(e) => setPatientData({...patientData, address: e.target.value})}
                  placeholder="Enter address"
                />
              </div>
            </div>
          </div>

          {/* Medication Data */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Medication Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="medicationName">Medication Name *</Label>
                <Input
                  id="medicationName"
                  value={medicationData.name}
                  onChange={(e) => setMedicationData({...medicationData, name: e.target.value})}
                  placeholder="Enter medication name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="dosage">Dosage</Label>
                <Input
                  id="dosage"
                  value={medicationData.dosage}
                  onChange={(e) => setMedicationData({...medicationData, dosage: e.target.value})}
                  placeholder="e.g., 500mg"
                />
              </div>
              <div>
                <Label htmlFor="frequency">Frequency</Label>
                <Input
                  id="frequency"
                  value={medicationData.frequency}
                  onChange={(e) => setMedicationData({...medicationData, frequency: e.target.value})}
                  placeholder="e.g., Twice daily"
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={medicationData.duration}
                  onChange={(e) => setMedicationData({...medicationData, duration: e.target.value})}
                  placeholder="e.g., 7 days"
                />
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="notes">Additional Notes</Label>
              <Input
                id="notes"
                value={medicationData.notes}
                onChange={(e) => setMedicationData({...medicationData, notes: e.target.value})}
                placeholder="Any additional notes"
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Refer Patient
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
